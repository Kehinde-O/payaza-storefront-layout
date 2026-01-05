import { api } from '../api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role?: string;
  userType?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType?: 'user' | 'merchant' | 'customer';
  businessName?: string;
  contactName?: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<LoginResponse> {
    const response = await api.post<{ status: string; data: LoginResponse; message?: string }>('/auth/register', data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  /**
   * Login user
   */
  async login(email: string, password: string, userType: 'user' | 'merchant' | 'customer' = 'customer'): Promise<LoginResponse> {
    const response = await api.post<{ status: string; data: LoginResponse; message?: string }>('/auth/login', {
      email,
      password,
      userType,
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ status: string; data: { user: User }; message?: string }>('/auth/me');
    if (response.data.status === 'success') {
      // Backend returns { user: {...} } structure
      return response.data.data.user;
    }
    throw new Error(response.data.message || 'Failed to get current user');
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post<{ status: string; data: { token: string; refreshToken: string }; message?: string }>(
      '/auth/refresh',
      { refreshToken }
    );
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Token refresh failed');
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    const response = await api.post<{ status: string; message?: string }>('/auth/forgot-password', { email });
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to send password reset email');
    }
  },

  /**
   * Reset password with token (legacy) or OTP (new)
   */
  async resetPassword(tokenOrEmail: string, password: string, otp?: string): Promise<void> {
    // If OTP is provided, use new OTP-based flow
    if (otp) {
      const response = await api.post<{ status: string; message?: string }>('/auth/reset-password', { 
        email: tokenOrEmail, 
        otp, 
        password 
      });
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    } else {
      // Legacy token-based flow
      const response = await api.post<{ status: string; message?: string }>('/auth/reset-password', { 
        token: tokenOrEmail, 
        password 
      });
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    }
  },

  /**
   * Verify email with OTP
   */
  async verifyEmail(email: string, otp: string): Promise<void> {
    const response = await api.post<{ status: string; message?: string }>('/auth/verify-email', { email, otp });
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Email verification failed');
    }
  },

  /**
   * Resend OTP
   */
  async resendOtp(email: string): Promise<void> {
    const response = await api.post<{ status: string; message?: string }>('/auth/resend-otp', { email });
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to resend OTP');
    }
  },
};

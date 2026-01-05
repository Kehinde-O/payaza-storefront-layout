import { api } from '../api';
export const authService = {
    /**
     * Register a new user
     */
    async register(data) {
        const response = await api.post('/auth/register', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Registration failed');
    },
    /**
     * Login user
     */
    async login(email, password, userType = 'customer') {
        const response = await api.post('/auth/login', {
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
    async getCurrentUser() {
        const response = await api.get('/auth/me');
        if (response.data.status === 'success') {
            // Backend returns { user: {...} } structure
            return response.data.data.user;
        }
        throw new Error(response.data.message || 'Failed to get current user');
    },
    /**
     * Refresh access token
     */
    async refreshToken(refreshToken) {
        const response = await api.post('/auth/refresh', { refreshToken });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Token refresh failed');
    },
    /**
     * Request password reset
     */
    async forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email });
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to send password reset email');
        }
    },
    /**
     * Reset password with token (legacy) or OTP (new)
     */
    async resetPassword(tokenOrEmail, password, otp) {
        // If OTP is provided, use new OTP-based flow
        if (otp) {
            const response = await api.post('/auth/reset-password', {
                email: tokenOrEmail,
                otp,
                password
            });
            if (response.data.status !== 'success') {
                throw new Error(response.data.message || 'Failed to reset password');
            }
        }
        else {
            // Legacy token-based flow
            const response = await api.post('/auth/reset-password', {
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
    async verifyEmail(email, otp) {
        const response = await api.post('/auth/verify-email', { email, otp });
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Email verification failed');
        }
    },
    /**
     * Resend OTP
     */
    async resendOtp(email) {
        const response = await api.post('/auth/resend-otp', { email });
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to resend OTP');
        }
    },
};

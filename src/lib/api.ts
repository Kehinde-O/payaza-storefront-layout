import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    // Add test mode header if in test environment
    ...(typeof window !== 'undefined' && (window as any).__TEST_MODE__ ? { 'x-test-mode': 'true' } : {}),
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for auth token and session ID
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add session ID for guest cart operations
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }
      config.headers['x-session-id'] = sessionId;
      
      // Add test mode header if in test environment
      if ((window as any).__TEST_MODE__) {
        config.headers['x-test-mode'] = 'true';
      }
      
      // For FormData requests, remove Content-Type header to let axios set it with boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { 
      _retry?: boolean;
      _retryCount?: number;
      _retryDelay?: number;
    };

    // Handle 429 Too Many Requests - retry with exponential backoff
    if (error.response?.status === 429 && originalRequest) {
      const retryCount = originalRequest._retryCount || 0;
      const maxRetries = 3;
      const baseDelay = 1000; // 1 second

      if (retryCount < maxRetries) {
        originalRequest._retryCount = retryCount + 1;
        originalRequest._retryDelay = baseDelay * Math.pow(2, retryCount); // Exponential backoff: 1s, 2s, 4s

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, originalRequest._retryDelay));

        console.log(`[API] Retrying request after rate limit (attempt ${retryCount + 1}/${maxRetries}, delay: ${originalRequest._retryDelay}ms)`);
        return api(originalRequest);
      } else {
        console.warn('[API] Max retries reached for rate-limited request');
      }
    }

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post<{ status: string; data: { token: string; refreshToken: string } }>(
            `${API_URL}/api/auth/refresh`,
            { refreshToken }
          );

          if (response.data.status === 'success' && response.data.data) {
            const { token, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem('token', token);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('storefront_user');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      (error.response?.data as any)?.message ||
      error.message ||
      'An error occurred';

    // Create custom ApiError with status and data
    const apiError = new ApiError(
      errorMessage,
      error.response?.status,
      (error.response?.data as any)?.data || error.response?.data // Fallback to full data if data property doesn't exist
    );

    return Promise.reject(apiError);
  }
);

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
export declare const authService: {
    /**
     * Register a new user
     */
    register(data: RegisterDto): Promise<LoginResponse>;
    /**
     * Login user
     */
    login(email: string, password: string, userType?: "user" | "merchant" | "customer"): Promise<LoginResponse>;
    /**
     * Get current user
     */
    getCurrentUser(): Promise<User>;
    /**
     * Refresh access token
     */
    refreshToken(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
    /**
     * Request password reset
     */
    forgotPassword(email: string): Promise<void>;
    /**
     * Reset password with token (legacy) or OTP (new)
     */
    resetPassword(tokenOrEmail: string, password: string, otp?: string): Promise<void>;
    /**
     * Verify email with OTP
     */
    verifyEmail(email: string, otp: string): Promise<void>;
    /**
     * Resend OTP
     */
    resendOtp(email: string): Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map
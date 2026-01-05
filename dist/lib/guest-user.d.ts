/**
 * Guest User Information Management
 * Stores and retrieves guest user data from localStorage
 */
export interface GuestUserInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
/**
 * Get guest user information from localStorage
 */
export declare function getGuestUserInfo(): GuestUserInfo | null;
/**
 * Save guest user information to localStorage
 */
export declare function saveGuestUserInfo(info: GuestUserInfo): void;
/**
 * Clear guest user information from localStorage
 */
export declare function clearGuestUserInfo(): void;
/**
 * Check if guest user info is complete
 */
export declare function hasCompleteGuestInfo(): boolean;
//# sourceMappingURL=guest-user.d.ts.map
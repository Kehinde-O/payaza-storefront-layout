/**
 * Guest User Information Management
 * Stores and retrieves guest user data from localStorage
 */
const GUEST_USER_STORAGE_KEY = 'guest_user_info';
/**
 * Get guest user information from localStorage
 */
export function getGuestUserInfo() {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const stored = localStorage.getItem(GUEST_USER_STORAGE_KEY);
        if (!stored) {
            return null;
        }
        const parsed = JSON.parse(stored);
        // Validate that all required fields are present
        if (parsed.firstName &&
            parsed.lastName &&
            parsed.phone &&
            parsed.email) {
            return parsed;
        }
        return null;
    }
    catch (error) {
        console.error('Error reading guest user info:', error);
        return null;
    }
}
/**
 * Save guest user information to localStorage
 */
export function saveGuestUserInfo(info) {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(info));
    }
    catch (error) {
        console.error('Error saving guest user info:', error);
    }
}
/**
 * Clear guest user information from localStorage
 */
export function clearGuestUserInfo() {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.removeItem(GUEST_USER_STORAGE_KEY);
    }
    catch (error) {
        console.error('Error clearing guest user info:', error);
    }
}
/**
 * Check if guest user info is complete
 */
export function hasCompleteGuestInfo() {
    const info = getGuestUserInfo();
    return info !== null &&
        !!info.firstName &&
        !!info.lastName &&
        !!info.phone &&
        !!info.email;
}

'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from './services/auth.service';
import { customerService } from './services/customer.service';
export const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    logout: () => { },
    updateProfile: async () => { },
    updateUserState: () => { },
});
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const loadUser = async () => {
            try {
                setIsLoading(true);
                // Check if we're in preview mode - skip all API calls to prevent session invalidation
                const isPreview = typeof window !== 'undefined' && window.__IS_PREVIEW__;
                if (isPreview) {
                    // In preview mode, don't make any API calls or clear tokens
                    // Just return empty auth state to prevent interfering with parent window session
                    console.log('[AuthProvider] Preview mode detected - skipping auth API calls');
                    setUser(null);
                    setIsLoading(false);
                    return;
                }
                const token = localStorage.getItem('token');
                if (token) {
                    // Try to get current user from API
                    try {
                        const response = await authService.getCurrentUser();
                        // Backend returns user object directly from auth service
                        // Parse address if it exists (address may not be in API response)
                        const addressData = response.address || {};
                        const addressObj = typeof addressData === 'string' ? (addressData ? JSON.parse(addressData) : {}) : addressData;
                        const user = {
                            id: response.id,
                            firstName: response.firstName,
                            lastName: response.lastName,
                            email: response.email,
                            phone: response.phone,
                            avatar: response.avatar,
                            address: addressObj.address1 || addressObj.address || addressObj.street || '',
                            city: addressObj.city || '',
                            state: addressObj.state || '',
                            zipCode: addressObj.zipCode || '',
                            country: addressObj.country || '',
                            createdAt: response.createdAt,
                        };
                        setUser(user);
                        localStorage.setItem('storefront_user', JSON.stringify(user));
                    }
                    catch (error) {
                        // API call failed - token may be invalid, clear everything
                        console.error('Failed to load user from API:', error);
                        localStorage.removeItem('storefront_user');
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        setUser(null);
                    }
                }
            }
            catch (error) {
                console.error('Failed to load user:', error);
                setUser(null);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        try {
            // Password is required for real API login
            if (!password) {
                throw new Error('Password is required');
            }
            // Real API login
            const response = await authService.login(email, password);
            // Parse address if it exists (address may not be in API response)
            const addressData = response.user.address || {};
            const addressObj = typeof addressData === 'string' ? (addressData ? JSON.parse(addressData) : {}) : addressData;
            const user = {
                id: response.user.id,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                email: response.user.email,
                phone: response.user.phone,
                avatar: response.user.avatar,
                address: addressObj.address1 || addressObj.address || addressObj.street || '',
                city: addressObj.city || '',
                state: addressObj.state || '',
                zipCode: addressObj.zipCode || '',
                country: addressObj.country || '',
                createdAt: response.user.createdAt,
            };
            // Store tokens
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            localStorage.setItem('storefront_user', JSON.stringify(user));
            // Clear guest user info since user is now authenticated
            if (typeof window !== 'undefined') {
                try {
                    const { clearGuestUserInfo } = await import('./guest-user');
                    clearGuestUserInfo();
                }
                catch (error) {
                    console.error('Failed to clear guest user info:', error);
                }
            }
            setUser(user);
            // Trigger cart refresh after login - the backend will automatically merge session cart with user cart
            // when the next cart operation happens, but we can trigger a refresh here to ensure cart is loaded
            if (typeof window !== 'undefined') {
                // Dispatch a custom event that store context can listen to for cart refresh
                window.dispatchEvent(new CustomEvent('userLoggedIn'));
            }
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('storefront_user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        router.push('/');
    }, [router]);
    const updateProfile = useCallback(async (data) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to update your profile');
            }
            // Use customer service API for profile updates
            const updatedUser = await customerService.updateProfile(data);
            // Parse address if it exists
            const addressData = updatedUser.address || {};
            const addressObj = typeof addressData === 'string' ? (addressData ? JSON.parse(addressData) : {}) : addressData;
            const user = {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                address: addressObj.address1 || addressObj.address || addressObj.street || '',
                city: addressObj.city || '',
                state: addressObj.state || '',
                zipCode: addressObj.zipCode || '',
                country: addressObj.country || '',
            };
            setUser(user);
            localStorage.setItem('storefront_user', JSON.stringify(user));
        }
        catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Update user state without triggering isLoading
     * This is used for updating user state after profile save without showing full-page loading
     */
    const updateUserState = useCallback((user) => {
        try {
            // Validate required fields before updating
            if (!user || !user.id || !user.firstName || !user.lastName || !user.email) {
                console.error('Invalid user data provided to updateUserState:', user);
                throw new Error('Invalid user data: missing required fields');
            }
            setUser(user);
            // Safely update localStorage
            try {
                localStorage.setItem('storefront_user', JSON.stringify(user));
            }
            catch (storageError) {
                console.error('Error updating localStorage:', storageError);
                // Continue even if localStorage update fails
            }
        }
        catch (error) {
            console.error('Error in updateUserState:', error);
            throw error;
        }
    }, []);
    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateProfile,
        updateUserState
    }), [user, isLoading, login, logout, updateProfile, updateUserState]);
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
}
export const useAuth = () => useContext(AuthContext);

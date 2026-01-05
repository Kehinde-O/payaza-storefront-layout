'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Store, User as UserIcon, Package, Settings, LogOut, Heart, Bell, Edit2, Check, Trash2, Lock, Calendar, Clock, Loader2, X, Camera, Truck, BookOpen, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { motion } from 'framer-motion';
import { AvatarImage } from '../../../components/ui/avatar-image';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { cn, formatCurrency } from '../../../lib/utils';
import { orderService } from '../../../lib/services/order.service';
import { bookingService } from '../../../lib/services/booking.service';
import { wishlistService } from '../../../lib/services/wishlist.service';
import { customerService } from '../../../lib/services/customer.service';
import { useToast } from '../../../components/ui/toast';
import { useLoading } from '../../../lib/loading-context';
import { MentorshipProgress } from '../../../components/learning/MentorshipProgress';
import { CertificateCard } from '../../../components/learning/CertificateTemplates';
export function AccountPage({ storeConfig }) {
    const { user, isAuthenticated, isLoading, logout, updateUserState } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToast } = useToast();
    const { startBackendLoading, stopBackendLoading } = useLoading();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || 'profile');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    // Update active tab if URL param changes
    useEffect(() => {
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [tabParam, activeTab]);
    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const returnUrl = storeConfig ? `/${storeConfig.slug}/account` : '/account';
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
        }
    }, [isLoading, isAuthenticated, router, storeConfig]);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    // Load user profile data
    useEffect(() => {
        if (user) {
            // Parse address with error handling
            let addressObj = {};
            try {
                if (typeof user.address === 'string') {
                    // Try to parse as JSON if it's a string
                    if (user.address && user.address.trim()) {
                        try {
                            addressObj = JSON.parse(user.address);
                        }
                        catch (parseError) {
                            // If JSON parsing fails, treat as plain string
                            console.warn('Failed to parse address as JSON, treating as plain string:', parseError);
                            addressObj = { address: user.address };
                        }
                    }
                }
                else if (user.address && typeof user.address === 'object') {
                    // Already an object
                    addressObj = user.address;
                }
            }
            catch (error) {
                console.error('Error processing address data:', error);
                // Continue with empty address object
                addressObj = {};
            }
            // Safely set profile data with validation
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: addressObj.address1 || addressObj.address || addressObj.street || '',
                city: addressObj.city || user.city || '',
                state: addressObj.state || user.state || '',
                zipCode: addressObj.zipCode || user.zipCode || '',
                country: addressObj.country || user.country || ''
            });
            // Set avatar preview - always sync with user avatar
            setAvatarPreview(user.avatar || null);
        }
        else {
            // If user is null, clear avatar preview
            setAvatarPreview(null);
        }
    }, [user]);
    // Fetch orders, bookings, and wishlist when authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            const fetchData = async () => {
                setIsLoadingData(true);
                startBackendLoading();
                try {
                    // Fetch orders
                    try {
                        const ordersData = await orderService.getOrders();
                        setOrders(ordersData);
                    }
                    catch (error) {
                        console.error('Failed to fetch orders:', error);
                        setOrders([]);
                    }
                    // Fetch bookings
                    try {
                        const bookingsData = await bookingService.getBookings();
                        setBookings(bookingsData);
                    }
                    catch (error) {
                        console.error('Failed to fetch bookings:', error);
                        setBookings([]);
                    }
                    // Fetch wishlist
                    try {
                        const wishlistData = await wishlistService.getWishlist();
                        setWishlistItems(wishlistData);
                    }
                    catch (error) {
                        console.error('Failed to fetch wishlist:', error);
                        setWishlistItems([]);
                    }
                }
                catch (error) {
                    console.error('Failed to fetch account data:', error);
                }
                finally {
                    setIsLoadingData(false);
                    stopBackendLoading();
                }
            };
            fetchData();
        }
    }, [isAuthenticated, isLoading, startBackendLoading, stopBackendLoading]);
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    // Mock Notifications
    // const [notifications, setNotifications] = useState({
    //   orderUpdates: true,
    //   promotions: false,
    //   newArrivals: true
    // });
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type - must match backend allowed MIME types
            const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedMimes.includes(file.type)) {
                addToast('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.', 'error');
                return;
            }
            // Validate file size (5MB) - must match backend limit
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                addToast('File size must be less than 5MB', 'error');
                return;
            }
            setAvatarFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(user?.avatar || null);
    };
    const handleProfileSave = async (e) => {
        e.preventDefault();
        // Validation
        if (!profileData.firstName.trim()) {
            addToast('First name is required', 'error');
            return;
        }
        if (!profileData.lastName.trim()) {
            addToast('Last name is required', 'error');
            return;
        }
        setIsSavingProfile(true);
        startBackendLoading();
        try {
            // Create FormData if avatar is being uploaded, otherwise use JSON
            const hasAvatar = avatarFile !== null;
            const hasAddress = profileData.address || profileData.city || profileData.state || profileData.zipCode || profileData.country;
            let updatedUser;
            if (hasAvatar) {
                // Use FormData for file upload
                const formData = new FormData();
                formData.append('firstName', profileData.firstName);
                formData.append('lastName', profileData.lastName);
                // Always append phone, even if empty (backend will handle null)
                formData.append('phone', profileData.phone || '');
                formData.append('avatar', avatarFile);
                // Add address fields if provided
                if (hasAddress) {
                    formData.append('address1', profileData.address || '');
                    formData.append('city', profileData.city || '');
                    formData.append('state', profileData.state || '');
                    formData.append('zipCode', profileData.zipCode || '');
                    formData.append('country', profileData.country || '');
                }
                // Update profile with FormData
                updatedUser = await customerService.updateProfile(formData);
            }
            else {
                // Use regular JSON update
                const addressData = hasAddress ? {
                    address1: profileData.address || '',
                    city: profileData.city || '',
                    state: profileData.state || '',
                    zipCode: profileData.zipCode || '',
                    country: profileData.country || ''
                } : undefined;
                const updateData = {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone,
                };
                if (addressData) {
                    updateData.address = JSON.stringify(addressData);
                }
                updatedUser = await customerService.updateProfile(updateData);
            }
            // Validate API response - ensure all required fields exist
            if (!updatedUser) {
                throw new Error('Invalid response from server: no user data received');
            }
            if (!updatedUser.id) {
                throw new Error('Invalid response from server: missing user ID');
            }
            if (!updatedUser.email) {
                throw new Error('Invalid response from server: missing email');
            }
            if (!updatedUser.firstName) {
                throw new Error('Invalid response from server: missing first name');
            }
            if (!updatedUser.lastName) {
                throw new Error('Invalid response from server: missing last name');
            }
            // Parse address data with error handling
            let addressObj = {};
            try {
                const addressData = updatedUser.address || {};
                if (typeof addressData === 'string') {
                    if (addressData && addressData.trim()) {
                        try {
                            addressObj = JSON.parse(addressData);
                        }
                        catch (parseError) {
                            // If JSON parsing fails, treat as plain string
                            console.warn('Failed to parse address as JSON, treating as plain string:', parseError);
                            addressObj = { address: addressData };
                        }
                    }
                }
                else if (addressData && typeof addressData === 'object') {
                    addressObj = addressData;
                }
            }
            catch (parseError) {
                console.error('Error processing address data:', parseError);
                // Continue with empty address object if parsing fails
                addressObj = {};
            }
            // Build updated user object for auth context with validated data
            const updatedUserData = {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone || undefined,
                avatar: updatedUser.avatar || user?.avatar || undefined, // Preserve existing avatar if not updated
                address: addressObj.address1 || addressObj.address || addressObj.street || '',
                city: addressObj.city || '',
                state: addressObj.state || '',
                zipCode: addressObj.zipCode || '',
                country: addressObj.country || '',
                createdAt: user?.createdAt || updatedUser.createdAt // Preserve createdAt
            };
            // Validate the user object before updating state
            if (!updatedUserData.id || !updatedUserData.firstName || !updatedUserData.lastName || !updatedUserData.email) {
                throw new Error('Invalid user data: missing required fields');
            }
            // Update auth context state without triggering isLoading
            try {
                updateUserState(updatedUserData);
            }
            catch (stateError) {
                console.error('Error updating user state:', stateError);
                throw new Error('Failed to update user state');
            }
            // Update local profile data to reflect changes with defensive checks
            try {
                setProfileData({
                    firstName: updatedUserData.firstName || '',
                    lastName: updatedUserData.lastName || '',
                    email: updatedUserData.email || '',
                    phone: updatedUserData.phone || '',
                    address: updatedUserData.address || '',
                    city: updatedUserData.city || '',
                    state: updatedUserData.state || '',
                    zipCode: updatedUserData.zipCode || '',
                    country: updatedUserData.country || ''
                });
            }
            catch (profileDataError) {
                console.error('Error updating profile data:', profileDataError);
                // Don't throw - profile data update failure shouldn't break the flow
            }
            // Update avatar preview if avatar was updated
            if (updatedUser.avatar) {
                setAvatarPreview(updatedUser.avatar);
            }
            else if (!hasAvatar && user?.avatar) {
                // If no new avatar was uploaded, keep the existing one
                setAvatarPreview(user.avatar);
            }
            // Reset avatar file
            setAvatarFile(null);
            // Show success message and exit edit mode
            addToast('Profile updated successfully', 'success');
            setIsEditingProfile(false);
        }
        catch (error) {
            console.error('Profile update error:', error);
            let errorMessage = 'Failed to update profile';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = String(error.message);
            }
            addToast(errorMessage, 'error');
        }
        finally {
            setIsSavingProfile(false);
            stopBackendLoading();
        }
    };
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            addToast('New passwords do not match', 'error');
            return;
        }
        if (passwordData.new.length < 8) {
            addToast('Password must be at least 8 characters', 'error');
            return;
        }
        try {
            // TODO: Implement password change API endpoint
            // For now, redirect to forgot password flow
            addToast('Password change feature coming soon. Please use "Forgot Password" to reset your password.', 'info');
            setIsChangingPassword(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
            addToast(errorMessage, 'error');
        }
    };
    // Determine primary color if store config is present, otherwise default to black/blue
    const primaryColor = storeConfig?.branding?.primaryColor || '#000000';
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-gray-400" }) }));
    }
    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [!storeConfig && (_jsx("header", { className: "bg-white border-b border-gray-200 sticky top-0 z-50", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs(Link, { href: "/", className: "flex items-center gap-2 group", children: [_jsx("div", { className: "w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white", children: _jsx(Store, { className: "w-5 h-5" }) }), _jsx("span", { className: "text-xl font-bold tracking-tight text-gray-900", children: "StoreFront" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-sm font-medium text-gray-700 hidden sm:block", children: [user?.firstName, " ", user?.lastName] }), _jsx("div", { className: "w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-gray-100", children: _jsx(AvatarImage, { src: user?.avatar, alt: "Profile", size: 36, className: "rounded-full" }) })] })] }) }) })), _jsx("div", { className: cn("container mx-auto px-4 sm:px-6 lg:px-8 py-8", storeConfig ? "pt-24" : ""), children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [_jsx("div", { className: "w-full lg:w-72 flex-shrink-0", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24", children: [_jsxs("div", { className: "mb-6 px-4 pt-4 text-center", children: [_jsx("div", { className: "w-20 h-20 mx-auto rounded-full bg-gray-100 mb-3 overflow-hidden", children: _jsx(AvatarImage, { src: user?.avatar, alt: "Profile", size: 80, className: "rounded-full" }) }), _jsxs("h3", { className: "font-bold text-gray-900", children: [user?.firstName, " ", user?.lastName] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Member since ", user?.createdAt
                                                        ? new Date(user.createdAt).getFullYear()
                                                        : new Date().getFullYear()] })] }), _jsxs("nav", { className: "space-y-1", children: [[
                                                { id: 'profile', label: 'My Profile', icon: UserIcon },
                                                { id: 'orders', label: 'Orders', icon: Package },
                                                ...(storeConfig?.layout === 'motivational-speaker' ? [{ id: 'learning', label: 'My Learning', icon: BookOpen }] : []),
                                                { id: 'bookings', label: 'My Bookings', icon: Calendar },
                                                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                                                // { id: 'payment', label: 'Payment Methods', icon: CreditCard }, // Hidden for now
                                                { id: 'notifications', label: 'Notifications', icon: Bell },
                                                { id: 'settings', label: 'Settings', icon: Settings },
                                            ].map((item) => (_jsxs("button", { onClick: () => setActiveTab(item.id), className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id
                                                    ? 'bg-black text-white shadow-md shadow-black/10'
                                                    : 'text-gray-600 hover:bg-gray-50'}`, style: activeTab === item.id && storeConfig ? { backgroundColor: primaryColor } : {}, children: [_jsx(item.icon, { className: "w-4.5 h-4.5" }), item.label] }, item.id))), _jsx("div", { className: "pt-4 mt-4 border-t border-gray-100", children: _jsxs("button", { onClick: logout, className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors", children: [_jsx(LogOut, { className: "w-4.5 h-4.5" }), "Sign Out"] }) })] })] }) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px] p-6 sm:p-8", children: [activeTab === 'profile' && (_jsxs("div", { className: "space-y-8 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Profile" }), !isEditingProfile && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsEditingProfile(true), className: "gap-2", children: [_jsx(Edit2, { className: "w-4 h-4" }), " Edit Profile"] }))] }), _jsxs("form", { onSubmit: handleProfileSave, className: "space-y-8", children: [_jsxs("div", { className: "flex items-center gap-6 pb-6 border-b border-gray-100", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200", children: avatarPreview ? (_jsx(AvatarImage, { src: avatarPreview, alt: "Profile", size: 96, className: "rounded-full" })) : (_jsx(AvatarImage, { src: user?.avatar, alt: "Profile", size: 96, className: "rounded-full" })) }), isEditingProfile && (_jsx("div", { className: "absolute bottom-0 right-0", children: _jsxs("label", { className: "cursor-pointer", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg", style: storeConfig ? { backgroundColor: primaryColor } : {}, children: _jsx(Camera, { className: "w-4 h-4" }) }), _jsx("input", { type: "file", accept: "image/jpeg,image/jpg,image/png,image/gif,image/webp", onChange: handleAvatarChange, className: "hidden" })] }) }))] }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-1", children: "Profile Photo" }), _jsx("p", { className: "text-sm text-gray-500 mb-3", children: "Upload a new profile picture. JPG, PNG, GIF, or WebP. Max size 5MB." }), isEditingProfile && avatarFile && (_jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: handleRemoveAvatar, className: "gap-2 text-red-600 hover:text-red-700 hover:bg-red-50", children: [_jsx(X, { className: "w-4 h-4" }), " Remove Photo"] }))] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "Personal Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-semibold text-gray-700", children: ["First Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: profileData.firstName || '', onChange: (e) => setProfileData({ ...profileData, firstName: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, required: true, className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-semibold text-gray-700", children: ["Last Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: profileData.lastName || '', onChange: (e) => setProfileData({ ...profileData, lastName: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, required: true, className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Email" }), _jsx("input", { type: "email", value: profileData.email, readOnly: true, className: "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none" }), _jsx("p", { className: "text-xs text-gray-400", children: "Email cannot be changed" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Phone" }), _jsx("input", { type: "tel", value: profileData.phone || '', onChange: (e) => setProfileData({ ...profileData, phone: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, placeholder: "+1 (555) 000-0000", className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "Address Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Street Address" }), _jsx("input", { type: "text", value: profileData.address || '', onChange: (e) => setProfileData({ ...profileData, address: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, placeholder: "123 Main Street", className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "City" }), _jsx("input", { type: "text", value: profileData.city || '', onChange: (e) => setProfileData({ ...profileData, city: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, placeholder: "New York", className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "State/Province" }), _jsx("input", { type: "text", value: profileData.state || '', onChange: (e) => setProfileData({ ...profileData, state: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, placeholder: "NY", className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "ZIP/Postal Code" }), _jsx("input", { type: "text", value: profileData.zipCode || '', onChange: (e) => setProfileData({ ...profileData, zipCode: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, placeholder: "10001", className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Country" }), _jsx("input", { type: "text", value: profileData.country || '', onChange: (e) => setProfileData({ ...profileData, country: e.target.value }), disabled: !isEditingProfile, readOnly: !isEditingProfile, placeholder: "United States", className: cn("w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all", isEditingProfile
                                                                                    ? "bg-white text-gray-900 cursor-text focus:border-black focus:ring-0"
                                                                                    : "bg-gray-50 text-gray-500 cursor-not-allowed") })] })] })] }), isEditingProfile && (_jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-100", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => {
                                                                    setIsEditingProfile(false);
                                                                    setAvatarFile(null);
                                                                    setAvatarPreview(user?.avatar || null);
                                                                    // Reset form data
                                                                    if (user) {
                                                                        const addressObj = typeof user.address === 'string'
                                                                            ? (user.address ? JSON.parse(user.address) : {})
                                                                            : (user.address || {});
                                                                        setProfileData({
                                                                            firstName: user.firstName || '',
                                                                            lastName: user.lastName || '',
                                                                            email: user.email || '',
                                                                            phone: user.phone || '',
                                                                            address: addressObj.address1 || addressObj.address || addressObj.street || '',
                                                                            city: addressObj.city || user.city || '',
                                                                            state: addressObj.state || '',
                                                                            zipCode: addressObj.zipCode || '',
                                                                            country: addressObj.country || user.country || ''
                                                                        });
                                                                    }
                                                                }, disabled: isSavingProfile, children: "Cancel" }), _jsx(Button, { type: "submit", className: "bg-black text-white gap-2 min-w-[120px]", style: storeConfig ? { backgroundColor: primaryColor } : {}, disabled: isSavingProfile, children: isSavingProfile ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), " Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4" }), " Save Changes"] })) })] }))] })] })), activeTab === 'orders' && (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Order History" }), isLoadingData ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-gray-400" }) })) : orders.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Package, { className: "w-8 h-8 text-gray-300" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "No orders yet" }), _jsx("p", { className: "text-gray-500 mt-2", children: "Start shopping to see your orders here" })] })) : (_jsx("div", { className: "space-y-6", children: orders.map((order, orderIndex) => {
                                                    // Tracking number equals order number, so use order number for tracking
                                                    const trackingId = order.orderNumber;
                                                    // Create visual distinction for each order container
                                                    const isEven = orderIndex % 2 === 0;
                                                    return (_jsxs("div", { className: `
                              border rounded-xl p-4 transition-all relative overflow-hidden
                              ${isEven
                                                            ? 'border-gray-200 bg-white shadow-sm'
                                                            : 'border-gray-100 bg-gray-50/50'}
                              hover:border-gray-300 hover:shadow-md
                              before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-300
                            `, children: [_jsxs("div", { className: "flex items-start justify-between gap-4 mb-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Package, { className: `w-4 h-4 flex-shrink-0 ${order.status === 'delivered' ? 'text-green-600' :
                                                                                            order.status === 'pending' ? 'text-yellow-600' :
                                                                                                order.status === 'cancelled' ? 'text-red-600' :
                                                                                                    'text-blue-600'}` }), _jsxs("p", { className: "font-bold text-gray-900 text-base", children: ["Order #", order.orderNumber] }), _jsx("span", { className: `px-2 py-0.5 text-xs font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                                                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                                                                                order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                                                                    'bg-blue-50 text-blue-700 border border-blue-200'}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500", children: [_jsx("span", { children: new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                                            year: 'numeric',
                                                                                            month: 'short',
                                                                                            day: 'numeric'
                                                                                        }) }), order.paymentStatus && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-gray-400" }), order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)] }))] })] }), _jsx(Link, { href: storeConfig
                                                                            ? `/${storeConfig.slug}/track-order?orderNumber=${order.orderNumber}`
                                                                            : `/track-order?orderNumber=${order.orderNumber}`, className: "flex-shrink-0", children: _jsxs(Button, { variant: "outline", size: "sm", className: "text-xs h-8 px-3 gap-1.5", children: [_jsx(Truck, { className: "w-3.5 h-3.5" }), "Track"] }) })] }), _jsx("div", { className: "space-y-2 mb-3", children: order.items?.map((item, idx) => {
                                                                    // Extract product image from images array (backend returns images as array)
                                                                    const productImage = item.product?.images
                                                                        ? (Array.isArray(item.product.images)
                                                                            ? (item.product.images[0]?.url || (typeof item.product.images[0] === 'string' ? item.product.images[0] : null))
                                                                            : null)
                                                                        : (item.product?.image || null); // Fallback for legacy single image field
                                                                    // Use item.name if product name is not available (from order item)
                                                                    const productName = item.product?.name || item.name || 'Product';
                                                                    return (_jsxs("div", { className: "flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "w-12 h-12 bg-white rounded-md shadow-sm overflow-hidden flex-shrink-0 relative", children: productImage ? (_jsx(Image, { src: productImage, fill: true, className: "object-cover", alt: productName, unoptimized: true })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center bg-gray-100", children: _jsx(Package, { className: "w-4 h-4 text-gray-400" }) })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-sm text-gray-900 truncate", children: productName }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Qty: ", item.quantity] })] }), _jsx("div", { className: "text-right flex-shrink-0", children: (() => {
                                                                                    // Use item currency if available, otherwise use order currency, then store config, then USD
                                                                                    const itemCurrency = item.currency || order.currency || storeConfig?.settings?.currency || 'USD';
                                                                                    return (_jsx("p", { className: "font-bold text-sm text-gray-900", children: formatCurrency(item.price * item.quantity, itemCurrency) }));
                                                                                })() })] }, item.id || idx));
                                                                }) }), _jsxs("div", { className: "pt-2.5 border-t border-gray-100 flex justify-between items-center", children: [_jsx("span", { className: "text-xs font-medium text-gray-500", children: "Total" }), (() => {
                                                                        // Determine currency: extract from items if order currency is missing or inconsistent
                                                                        let displayCurrency = order.currency || storeConfig?.settings?.currency || 'USD';
                                                                        if (order.items && order.items.length > 0) {
                                                                            const itemCurrencies = order.items
                                                                                .map(item => item.currency)
                                                                                .filter(Boolean);
                                                                            if (itemCurrencies.length > 0) {
                                                                                const currencyCounts = {};
                                                                                itemCurrencies.forEach(curr => {
                                                                                    currencyCounts[curr] = (currencyCounts[curr] || 0) + 1;
                                                                                });
                                                                                const mostCommonCurrency = Object.entries(currencyCounts).reduce((a, b) => currencyCounts[a[0]] > currencyCounts[b[0]] ? a : b)[0];
                                                                                // If all items have same currency, use it for totals
                                                                                if (itemCurrencies.every(c => c === mostCommonCurrency)) {
                                                                                    displayCurrency = mostCommonCurrency;
                                                                                }
                                                                                else if (!order.currency || order.currency === 'USD') {
                                                                                    displayCurrency = mostCommonCurrency;
                                                                                }
                                                                            }
                                                                        }
                                                                        return (_jsx("span", { className: "text-base font-bold text-gray-900", children: formatCurrency(order.total, displayCurrency) }));
                                                                    })()] })] }, order.id));
                                                }) }))] })), activeTab === 'bookings' && (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Bookings" }), isLoadingData ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-gray-400" }) })) : bookings.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Calendar, { className: "w-8 h-8 text-gray-300" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "No bookings yet" }), _jsx("p", { className: "text-gray-500 mt-2", children: "Book a service to see your appointments here" })] })) : (_jsxs(_Fragment, { children: [bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Upcoming" }), _jsx("div", { className: "space-y-4", children: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').map((booking) => (_jsx("div", { className: "border border-gray-100 rounded-2xl p-6 bg-white hover:shadow-md transition-all", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsx("div", { className: "w-full md:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative", children: _jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200", children: _jsx(Calendar, { className: "w-12 h-12 text-gray-400" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsxs("h4", { className: "text-xl font-bold text-gray-900", children: ["Booking #", booking.id.slice(-6)] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Service ID: ", booking.serviceId] })] }), _jsx("span", { className: `px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                                                                                                    booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                                                                                        'bg-gray-50 text-gray-700'}`, children: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) })] }), _jsxs("div", { className: "flex flex-wrap gap-4 mt-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg", children: [_jsx(Calendar, { className: "w-4 h-4" }), new Date(booking.bookingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })] }), _jsxs("div", { className: "flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg", children: [_jsx(Clock, { className: "w-4 h-4" }), booking.startTime, " - ", booking.endTime] }), _jsx("div", { className: "flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg", children: _jsx("span", { className: "font-semibold", children: formatCurrency(booking.price, booking.currency || storeConfig?.settings?.currency || 'USD') }) })] }), _jsxs("div", { className: "mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: async () => {
                                                                                                    try {
                                                                                                        await bookingService.cancelBooking(booking.id);
                                                                                                        addToast('Booking cancelled successfully', 'success');
                                                                                                        // Refresh bookings
                                                                                                        const updatedBookings = await bookingService.getBookings();
                                                                                                        setBookings(updatedBookings);
                                                                                                    }
                                                                                                    catch (error) {
                                                                                                        const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking';
                                                                                                        addToast(errorMessage, 'error');
                                                                                                    }
                                                                                                }, children: "Cancel" }), _jsx(Button, { size: "sm", className: "bg-black text-white", style: storeConfig ? { backgroundColor: primaryColor } : {}, children: "View Details" })] })] })] }) }, booking.id))) })] })), bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length > 0 && (_jsxs("div", { className: "pt-8", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Past" }), _jsx("div", { className: "space-y-4", children: bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map((booking) => (_jsx("div", { className: `border border-gray-100 rounded-2xl p-6 ${booking.status === 'cancelled' ? 'bg-red-50/30' : 'bg-gray-50/50'} opacity-75 hover:opacity-100 transition-all`, children: _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative", children: _jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300", children: _jsx(Calendar, { className: "w-8 h-8 text-gray-400" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-bold text-gray-900", children: ["Booking #", booking.id.slice(-6)] }), _jsxs("p", { className: "text-sm text-gray-500", children: [new Date(booking.bookingDate).toLocaleDateString(), " \u2022 ", booking.startTime, " - ", booking.endTime] }), _jsx("p", { className: "text-sm font-medium text-gray-700 mt-1", children: formatCurrency(booking.price, booking.currency || storeConfig?.settings?.currency || 'USD') })] }), _jsx("span", { className: `px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`, children: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) })] }) }, booking.id))) })] }))] }))] })), activeTab === 'wishlist' && (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Wishlist" }), isLoadingData ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-gray-400" }) })) : wishlistItems.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: wishlistItems.map((item) => {
                                                    const product = item.product;
                                                    const productSlug = product?.slug || product?.id;
                                                    const storeSlug = product?.storeSlug || storeConfig?.slug;
                                                    return (_jsxs("div", { className: "group border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all relative bg-white", children: [_jsx("button", { className: "absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors", onClick: async () => {
                                                                    try {
                                                                        await wishlistService.removeFromWishlist(item.id);
                                                                        addToast('Removed from wishlist', 'success');
                                                                        // Refresh wishlist
                                                                        const updatedWishlist = await wishlistService.getWishlist();
                                                                        setWishlistItems(updatedWishlist);
                                                                    }
                                                                    catch (error) {
                                                                        const errorMessage = error instanceof Error ? error.message : 'Failed to remove from wishlist';
                                                                        addToast(errorMessage, 'error');
                                                                    }
                                                                }, children: _jsx(Heart, { className: "w-5 h-5 fill-current" }) }), _jsx("div", { className: "aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden relative", children: product?.image ? (_jsx(Image, { src: product.image, alt: product.name || 'Product', fill: true, className: "object-cover group-hover:scale-105 transition-transform duration-500", unoptimized: true })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200", children: _jsx(Heart, { className: "w-12 h-12 text-gray-300" }) })) }), storeSlug && (_jsx(Link, { href: `/${storeSlug}`, className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 hover:text-black", children: product?.storeName || storeConfig?.name || 'Store' })), _jsx("h3", { className: "font-bold text-gray-900 mb-2 truncate", children: product?.name || 'Product' }), _jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsx("span", { className: "text-lg font-bold", children: product?.price ? formatCurrency(product.price, product.currency || storeConfig?.settings?.currency || 'USD') : formatCurrency(0, storeConfig?.settings?.currency || 'USD') }), storeSlug && productSlug && (_jsx(Link, { href: `/${storeSlug}/product/${productSlug}`, children: _jsx(Button, { size: "sm", className: "rounded-full bg-black text-white px-4", style: storeConfig ? { backgroundColor: primaryColor } : {}, children: "View Item" }) }))] })] }, item.id));
                                                }) })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Heart, { className: "w-8 h-8 text-gray-300" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Your wishlist is empty" }), _jsx("p", { className: "text-gray-500 mt-2", children: "Start saving items you love!" })] }))] })), activeTab === 'notifications' && (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Notification Preferences" }), _jsxs("div", { className: "space-y-4 divide-y divide-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between py-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: "Order Updates" }), _jsx("p", { className: "text-sm text-gray-500", children: "Receive updates about your order status" })] }), _jsx("div", { className: "relative inline-flex h-6 w-11 items-center rounded-full bg-black transition-colors", style: storeConfig ? { backgroundColor: primaryColor } : {}, children: _jsx("span", { className: "inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" }) })] }), _jsxs("div", { className: "flex items-center justify-between py-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: "Promotions" }), _jsx("p", { className: "text-sm text-gray-500", children: "Receive emails about new sales and deals" })] }), _jsx("div", { className: "relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors", children: _jsx("span", { className: "inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" }) })] }), _jsxs("div", { className: "flex items-center justify-between py-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: "New Arrivals" }), _jsx("p", { className: "text-sm text-gray-500", children: "Get notified when new products arrive" })] }), _jsx("div", { className: "relative inline-flex h-6 w-11 items-center rounded-full bg-black transition-colors", style: storeConfig ? { backgroundColor: primaryColor } : {}, children: _jsx("span", { className: "inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" }) })] })] })] })), activeTab === 'learning' && storeConfig?.layout === 'motivational-speaker' && (_jsxs("div", { className: "space-y-8 animate-fade-in", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-black text-slate-900 tracking-tight", children: "Learning Hub" }), _jsx("p", { className: "text-slate-500 font-medium", children: "Your personal growth and certification center" })] }) }), _jsx("div", { className: "flex border-b border-slate-100 overflow-x-auto no-scrollbar gap-8", children: [
                                                    { id: 'courses', label: 'My Courses' },
                                                    { id: 'mentorship', label: 'Mentorship' },
                                                    { id: 'certificates', label: 'Credentials' }
                                                ].map((sub) => (_jsxs("button", { onClick: () => router.push(`?tab=learning&sub=${sub.id}`), className: cn("pb-4 text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-all relative", (searchParams.get('sub') || 'courses') === sub.id
                                                        ? "text-slate-900"
                                                        : "border-transparent text-slate-400 hover:text-slate-600"), children: [sub.label, (searchParams.get('sub') || 'courses') === sub.id && (_jsx(motion.div, { layoutId: "activeLearningTab", className: "absolute bottom-[-2px] left-0 right-0 h-0.5 bg-slate-900 rounded-full", style: storeConfig ? { backgroundColor: primaryColor } : {} }))] }, sub.id))) }), (searchParams.get('sub') === 'courses' || !searchParams.get('sub')) && (_jsxs("div", { className: "space-y-10", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
                                                            { label: 'Enrolled', value: '12', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                            { label: 'Completed', value: '8', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                                                            { label: 'Learning Time', value: '24h', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' }
                                                        ].map((stat, i) => (_jsxs("div", { className: "bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm", children: [_jsx("div", { className: cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg), children: _jsx(stat.icon, { className: cn("w-6 h-6", stat.color) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: stat.label }), _jsx("h3", { className: "text-xl font-black text-slate-900", children: stat.value })] })] }, i))) }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-black uppercase tracking-[0.2em] text-slate-400", children: "In Progress" }), _jsx("span", { className: "bg-slate-100 text-slate-900 rounded-full px-3 py-0.5 text-[10px] font-bold border border-slate-200", children: "2 Active" })] }), _jsx("div", { className: "space-y-4", children: [
                                                                    {
                                                                        id: 'art-of-focus',
                                                                        title: 'The Art of Focus',
                                                                        progress: 65,
                                                                        type: 'Masterclass',
                                                                        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
                                                                        lastAccessed: '2 days ago'
                                                                    },
                                                                    {
                                                                        id: 'leadership-101',
                                                                        title: 'Executive Leadership 101',
                                                                        progress: 30,
                                                                        type: 'Specialization',
                                                                        thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=400&h=300&fit=crop',
                                                                        lastAccessed: '1 week ago'
                                                                    },
                                                                ].map((course) => {
                                                                    const courseLink = storeConfig ? `/${storeConfig.slug}/services/${course.id}` : '#';
                                                                    return (_jsx(Link, { href: courseLink, className: "group block bg-white border border-slate-100 rounded-3xl p-5 hover:border-slate-300 hover:shadow-xl transition-all", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-6", children: [_jsxs("div", { className: "relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm", children: [_jsx(Image, { src: course.thumbnail, alt: course.title, fill: true, className: "object-cover group-hover:scale-110 transition-transform duration-700", unoptimized: true }), _jsx("div", { className: "absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100", children: _jsx("div", { className: "w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl", children: _jsx(Play, { className: "w-5 h-5 text-slate-900 fill-current" }) }) })] }), _jsxs("div", { className: "flex-1 flex flex-col justify-between py-1", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-blue-600", children: course.type }), _jsx("h4", { className: "text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors", children: course.title })] }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-slate-400 font-bold uppercase tracking-widest text-[10px]", children: "Progress" }), _jsxs("span", { className: "font-black text-slate-900", children: [course.progress, "%"] })] }), _jsx("div", { className: "w-full h-1.5 bg-slate-50 rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${course.progress}%` }, className: "h-full bg-slate-900 rounded-full", style: storeConfig ? { backgroundColor: primaryColor } : {} }) }), _jsxs("div", { className: "flex items-center justify-between pt-2", children: [_jsxs("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: ["Last seen ", course.lastAccessed] }), _jsxs("span", { className: "flex items-center gap-1.5 text-xs font-black text-slate-900 group-hover:translate-x-1 transition-transform", children: ["Continue ", _jsx(ArrowRight, { className: "w-3.5 h-3.5" })] })] })] })] })] }) }, course.id));
                                                                }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("h3", { className: "text-sm font-black uppercase tracking-[0.2em] text-slate-400", children: "Recently Completed" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                                                                    { title: 'Strategic Planning Guide', type: 'Framework', completedDate: '3 days ago' },
                                                                    { title: 'Mindset Mastery Basics', type: 'Foundation', completedDate: '2 weeks ago' },
                                                                ].map((course, i) => (_jsxs("div", { className: "bg-slate-50/50 border border-slate-100 rounded-2xl p-5 group hover:bg-white hover:shadow-md transition-all flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0", children: _jsx(Check, { className: "w-5 h-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-900 text-sm leading-snug", children: course.title }), _jsxs("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5", children: [course.type, " \u2022 ", course.completedDate] })] })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-8 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100", children: "Review" })] }, i))) })] })] })), searchParams.get('sub') === 'mentorship' && (_jsx("div", { className: "space-y-6", children: _jsx(MentorshipProgress, { programs: [
                                                        {
                                                            id: 'ment-1',
                                                            name: '1-on-1 Executive Coaching',
                                                            mentorName: 'Dr. Sarah Mitchell',
                                                            mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
                                                            startDate: '2025-10-01',
                                                            expiryDate: '2025-12-31',
                                                            sessionsTotal: 12,
                                                            sessionsCompleted: 8,
                                                            status: 'active',
                                                            nextSessionDate: 'Oct 24, 2025 @ 10:00 AM'
                                                        }
                                                    ] }) })), searchParams.get('sub') === 'certificates' && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-black uppercase tracking-[0.2em] text-slate-400", children: "Verified Credentials" }), _jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: "Digital PDF Documents" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                                                            {
                                                                id: 'CERT-8821',
                                                                courseName: 'The Art of Focus',
                                                                date: 'Dec 15, 2025',
                                                                instructor: 'Dr. Sarah Mitchell',
                                                                design: 'modern',
                                                                color: primaryColor
                                                            },
                                                            {
                                                                id: 'CERT-7732',
                                                                courseName: 'Strategic Planning Guide',
                                                                date: 'Nov 20, 2025',
                                                                instructor: 'Marcus Aurelius',
                                                                design: 'minimal',
                                                                color: '#64748b'
                                                            }
                                                        ].map((cert) => (_jsx(CertificateCard, { certificate: cert, onDownload: (id) => window.open(`/${storeConfig?.slug}/account/certificates/${id}`, '_blank') }, cert.id))) })] })), _jsx("div", { className: "pt-12 border-t border-slate-100", children: _jsx(Link, { href: storeConfig ? `/${storeConfig.slug}/services` : '#', children: _jsxs(Button, { className: "w-full h-16 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:shadow-primary/20 hover:-translate-y-1 transition-all text-sm", style: storeConfig ? { backgroundColor: primaryColor } : {}, children: ["Explore Learning Catalogue", _jsx(ArrowRight, { className: "ml-3 w-5 h-5" })] }) }) })] })), activeTab === 'settings' && (_jsxs("div", { className: "space-y-8 animate-fade-in", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Account Settings" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Security" }) }), !isChangingPassword ? (_jsxs(Button, { variant: "outline", className: "w-full justify-between group h-12 rounded-xl", onClick: () => setIsChangingPassword(true), children: [_jsx("span", { children: "Change Password" }), _jsx(Lock, { className: "w-4 h-4 text-gray-400 group-hover:text-black" })] })) : (_jsxs("form", { onSubmit: handlePasswordChange, className: "p-6 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50", children: [_jsx("h4", { className: "font-bold text-gray-900 mb-2", children: "Change Password" }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Current Password" }), _jsx("input", { type: "password", value: passwordData.current, onChange: (e) => setPasswordData({ ...passwordData, current: e.target.value }), className: "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-black focus:ring-0 focus:outline-none transition-all", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "New Password" }), _jsx("input", { type: "password", value: passwordData.new, onChange: (e) => setPasswordData({ ...passwordData, new: e.target.value }), className: "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-black focus:ring-0 focus:outline-none transition-all", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Confirm New Password" }), _jsx("input", { type: "password", value: passwordData.confirm, onChange: (e) => setPasswordData({ ...passwordData, confirm: e.target.value }), className: "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-black focus:ring-0 focus:outline-none transition-all", required: true })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => setIsChangingPassword(false), children: "Cancel" }), _jsx(Button, { type: "submit", className: "bg-black text-white", style: storeConfig ? { backgroundColor: primaryColor } : {}, children: "Update Password" })] })] }))] }), _jsxs("div", { className: "pt-8 border-t border-gray-100", children: [_jsx("h3", { className: "text-lg font-bold text-red-600 mb-2", children: "Danger Zone" }), _jsx("p", { className: "text-gray-500 text-sm mb-4", children: "Once you delete your account, there is no going back. Please be certain." }), _jsxs(Button, { variant: "outline", className: "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full justify-between h-12 rounded-xl", children: [_jsx("span", { children: "Delete Account" }), _jsx(Trash2, { className: "w-4 h-4" })] })] })] })] }))] }) })] }) })] }));
}

'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../components/ui/button';
import { usePayazaCheckout } from '../../hooks/use-payaza-checkout';
import { generateCheckoutConfig } from '../../lib/payaza-checkout';
import { useStore } from '../../lib/store-context';
import { useToast } from '../../components/ui/toast';
import { useState } from 'react';
import { GuestCheckoutModal } from './guest-checkout-modal';
import { getGuestUserInfo, saveGuestUserInfo, hasCompleteGuestInfo } from '../../lib/guest-user';
import { useRouter } from 'next/navigation';
import { checkoutService } from '../../lib/services/checkout.service';
import { useAuth } from '../../lib/auth-context';
export function CheckoutButton({ storeConfig, className, children = 'Checkout', variant = 'default', size = 'lg', }) {
    const { cart, cartTotal } = useStore();
    const { addToast } = useToast();
    const { user, isAuthenticated } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [pendingCheckout, setPendingCheckout] = useState(null);
    const router = useRouter();
    // Do not hardcode a live key in code; require configuration via storeConfig/env.
    const payazaPublicKey = storeConfig.payment?.payazaPublicKey || process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '';
    const { checkout: initiateCheckout, isLoading } = usePayazaCheckout({
        publicKey: payazaPublicKey,
        onSuccess: (response) => {
            addToast('Checkout initiated successfully!', 'success');
            setIsProcessing(false);
        },
        onError: (error) => {
            addToast(`Checkout error: ${error}`, 'error');
            setIsProcessing(false);
        },
        onClose: () => {
            // onClose is only called when payment was not successful (user canceled)
            // This is now handled correctly by payaza-checkout.ts tracking payment success state
            addToast('Payment canceled', 'info');
            setIsProcessing(false);
        },
    });
    const proceedWithCheckout = async (userInfo) => {
        if (cart.length === 0) {
            addToast('Your cart is empty', 'error');
            return;
        }
        if (!payazaPublicKey) {
            addToast('Payment gateway not configured. Please contact support.', 'error');
            return;
        }
        setIsProcessing(true);
        // DEMO MODE BYPASS
        if (storeConfig.slug.startsWith('demo/')) {
            setTimeout(() => {
                router.push(`/${storeConfig.slug}/payment/callback?status=success&reference=DEMO-${Date.now()}`);
            }, 1500);
            return;
        }
        try {
            // Use authenticated user info if available, otherwise use guest info
            const customerEmail = isAuthenticated && user ? user.email : (userInfo?.email || '');
            const customerFirstName = isAuthenticated && user ? user.firstName : (userInfo?.firstName || '');
            const customerLastName = isAuthenticated && user ? user.lastName : (userInfo?.lastName || '');
            const customerPhone = isAuthenticated && user ? (user.phone || '') : (userInfo?.phone || '');
            // Step 1: Create order via API before payment
            const checkoutResponse = await checkoutService.processCheckout({
                storeId: storeConfig.id,
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    variationId: item.variantId && item.variantId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
                        ? item.variantId
                        : undefined, // Only use if it's a UUID
                    variantId: item.variantId, // Keep for backward compatibility
                })),
                customerInfo: {
                    email: customerEmail,
                    firstName: customerFirstName,
                    lastName: customerLastName,
                    phone: customerPhone,
                },
                shippingAddress: {
                    firstName: customerFirstName,
                    lastName: customerLastName,
                    address1: isAuthenticated && user?.address ? user.address : 'Address to be provided',
                    city: isAuthenticated && user?.city ? user.city : 'City',
                    state: isAuthenticated && user?.state ? user.state : 'State',
                    zipCode: isAuthenticated && user?.zipCode ? user.zipCode : '00000',
                    country: isAuthenticated && user?.country ? user.country : 'Country',
                    phone: customerPhone,
                },
                paymentMethod: 'payaza',
                customerId: isAuthenticated && user ? user.id : undefined, // Pass customerId for authenticated users
            });
            // Step 2: Convert cart items to checkout format for Payaza
            const checkoutItems = cart.map(item => ({
                product: {
                    name: item.product.name,
                    price: item.price,
                    currency: item.product.currency,
                },
                quantity: item.quantity,
                price: item.price,
            }));
            // Step 3: Generate Payaza checkout config with order details
            const checkoutConfig = generateCheckoutConfig(checkoutItems, customerEmail, payazaPublicKey, {
                firstName: customerFirstName,
                lastName: customerLastName,
                phone: customerPhone,
                callbackUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/${storeConfig.slug}/payment/callback?storeId=${storeConfig.id}`,
                currency: checkoutResponse.currency || storeConfig.settings?.currency,
                storeId: storeConfig.id,
                orderId: checkoutResponse.orderId,
                orderNumber: checkoutResponse.orderNumber,
                shippingAddress: {
                    firstName: customerFirstName,
                    lastName: customerLastName,
                    address: isAuthenticated && user?.address ? user.address : 'Address to be provided',
                    city: isAuthenticated && user?.city ? user.city : 'City',
                    state: isAuthenticated && user?.state ? user.state : 'State',
                    country: isAuthenticated && user?.country ? user.country : 'Country',
                    zipCode: isAuthenticated && user?.zipCode ? user.zipCode : '00000',
                },
            });
            // Step 4: Use transaction reference from order
            checkoutConfig.reference = checkoutResponse.transactionReference;
            await initiateCheckout(checkoutConfig);
        }
        catch (error) {
            addToast('Failed to initiate checkout. Please try again.', 'error');
            console.error('Checkout error:', error);
            setIsProcessing(false);
        }
    };
    const handleCheckout = async () => {
        if (cart.length === 0) {
            addToast('Your cart is empty', 'error');
            return;
        }
        // If user is authenticated, proceed directly with their info
        if (isAuthenticated && user) {
            await proceedWithCheckout();
            return;
        }
        // For guest users, check if we have complete guest user info
        const guestInfo = getGuestUserInfo();
        if (hasCompleteGuestInfo() && guestInfo) {
            // Proceed directly with guest info
            await proceedWithCheckout(guestInfo);
        }
        else {
            // Show modal to collect guest info
            setShowGuestModal(true);
            setPendingCheckout(() => () => {
                const info = getGuestUserInfo();
                if (info) {
                    proceedWithCheckout(info);
                }
            });
        }
    };
    const handleGuestInfoSubmit = (userInfo) => {
        // Save guest info to localStorage
        saveGuestUserInfo(userInfo);
        setShowGuestModal(false);
        // Proceed with checkout
        proceedWithCheckout(userInfo);
    };
    const isDisabled = isLoading || isProcessing || cart.length === 0 || !payazaPublicKey;
    return (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: handleCheckout, disabled: isDisabled, variant: variant, size: size, className: className, children: isLoading || isProcessing ? 'Processing...' : children }), _jsx(GuestCheckoutModal, { isOpen: showGuestModal, onClose: () => {
                    setShowGuestModal(false);
                    setPendingCheckout(null);
                }, onSubmit: handleGuestInfoSubmit, initialData: getGuestUserInfo() || undefined })] }));
}

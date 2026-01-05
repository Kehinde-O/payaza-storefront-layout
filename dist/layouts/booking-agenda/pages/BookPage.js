'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Clock, Check, ChevronRight, ChevronLeft, ArrowLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn, formatCurrency } from '../../../lib/utils';
import Link from 'next/link';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { usePayazaCheckout } from '../../../hooks/use-payaza-checkout';
import { generateCheckoutConfig } from '../../../lib/payaza-checkout';
import { checkoutService } from '../../../lib/services/checkout.service';
import { paymentService } from '../../../lib/services/payment.service';
import { useToast } from '../../../components/ui/toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
export function BookPage({ storeConfig, serviceSlug }) {
    const primaryColor = storeConfig.branding.primaryColor;
    const { addToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated } = useAuth();
    // Get service slug from query params or prop
    const serviceSlugFromQuery = searchParams?.get('service') || null;
    const effectiveServiceSlug = serviceSlug || serviceSlugFromQuery;
    // State
    const [currentStep, setCurrentStep] = useState(effectiveServiceSlug ? 'datetime' : 'service');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    // Pre-fill form data for authenticated users
    useEffect(() => {
        if (isAuthenticated && user) {
            setGuestInfo(prev => ({
                firstName: user.firstName || prev.firstName,
                lastName: user.lastName || prev.lastName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
                notes: prev.notes,
                address: user.address || prev.address,
                city: user.city || prev.city,
                state: user.state || prev.state,
                zipCode: user.zipCode || prev.zipCode,
                country: user.country || prev.country,
            }));
        }
    }, [isAuthenticated, user]);
    // Payaza Configuration
    // Do not hardcode a live key in code; require configuration via storeConfig/env.
    const payazaPublicKey = storeConfig.payment?.payazaPublicKey || process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '';
    const { checkout: initiateCheckout, isLoading: isPayazaLoading } = usePayazaCheckout({
        publicKey: payazaPublicKey,
        onSuccess: async (response) => {
            try {
                setIsProcessing(true);
                const transactionRef = response.transactionRef || response.callbackData?.data?.transaction_reference;
                if (!transactionRef) {
                    addToast('Payment successful but no transaction reference. Please contact support.', 'info');
                    setIsProcessing(false);
                    return;
                }
                console.log('[Booking] SDK callback received, verifying payment...');
                addToast('Verifying payment...', 'info');
                // Step 1: Immediate check if webhook already processed payment (no delay)
                let immediateVerification;
                try {
                    immediateVerification = await paymentService.verifyPayment(transactionRef, storeConfig.id);
                    if (immediateVerification.verified && immediateVerification.paymentStatus === 'completed') {
                        console.log('[Booking] Payment already completed by webhook, proceeding to success page');
                        const orderId = immediateVerification.orderId || transactionRef;
                        const orderNumber = immediateVerification.orderNumber || '';
                        router.push(`/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`);
                        return;
                    }
                }
                catch (error) {
                    console.log('[Booking] Immediate verification failed, proceeding with confirmation');
                }
                // Step 2: If webhook hasn't processed yet, immediately confirm from callback data
                // We have the callback data from Payaza, so we can confirm immediately instead of waiting
                if (response.callbackData) {
                    console.log('[Booking] Processing Payaza callback confirmation immediately');
                    // Retry logic for payment confirmation
                    const MAX_RETRIES = 3;
                    const RETRY_DELAY = 1000; // 1 second
                    let confirmation;
                    let lastError;
                    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                        try {
                            // Confirm payment with backend and trigger order processing
                            confirmation = await paymentService.confirmPaymentFromCallback(response.callbackData);
                            if (confirmation.alreadyProcessed) {
                                console.log('[Booking] Payment already processed');
                            }
                            else {
                                console.log('[Booking] Payment confirmed, order processing initiated');
                            }
                            // Success - break out of retry loop
                            break;
                        }
                        catch (error) {
                            lastError = error;
                            console.error(`[Booking] Payment confirmation attempt ${attempt} failed:`, error);
                            // If this is not the last attempt, wait before retrying
                            if (attempt < MAX_RETRIES) {
                                console.log(`[Booking] Retrying payment confirmation in ${RETRY_DELAY}ms...`);
                                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt)); // Exponential backoff
                            }
                        }
                    }
                    // If all retries failed, do a short poll to catch webhook processing (max 3 seconds)
                    if (!confirmation) {
                        console.log('[Booking] Confirmation failed, doing short poll for webhook processing...');
                        try {
                            const polledVerification = await paymentService.pollPaymentStatus(transactionRef, storeConfig.id, {
                                maxAttempts: 3, // Poll for max 3 seconds (3 * 1s)
                                intervalMs: 1000, // Poll every 1 second
                                onProgress: (attempt, maxAttempts) => {
                                    console.log(`[Booking] Polling for webhook (${attempt}/${maxAttempts})...`);
                                }
                            });
                            if (polledVerification && polledVerification.verified && polledVerification.paymentStatus === 'completed') {
                                console.log('[Booking] Payment completed by webhook, proceeding to success page');
                                const orderId = polledVerification.orderId || transactionRef;
                                const orderNumber = polledVerification.orderNumber || '';
                                router.push(`/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`);
                                return;
                            }
                        }
                        catch (pollError) {
                            console.error('[Booking] Polling also failed:', pollError);
                        }
                        // Final fallback: Redirect to callback page for manual verification
                        console.log('[Booking] Redirecting to callback page for verification');
                        addToast('Payment successful. Verifying transaction...', 'info');
                        router.push(`/${storeConfig.slug}/payment/callback?reference=${transactionRef}&storeId=${storeConfig.id}`);
                        return;
                    }
                    // Success - redirect to success page
                    const orderId = confirmation.orderId;
                    const orderNumber = confirmation.orderNumber || '';
                    // Redirect to success page with order details
                    router.push(`/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`);
                }
                else {
                    // Fallback: Use transaction reference to verify payment
                    console.log('[Booking] No callback data, verifying payment with transaction reference:', response.transactionRef);
                    if (response.transactionRef) {
                        // Redirect to callback page for verification and confirmation
                        router.push(`/${storeConfig.slug}/payment/callback?reference=${response.transactionRef}&storeId=${storeConfig.id}`);
                    }
                    else {
                        addToast('Payment successful but unable to process. Please contact support.', 'info');
                        setIsProcessing(false);
                    }
                }
            }
            catch (error) {
                console.error('[Booking] Error processing payment callback:', error);
                // Fallback: Try to redirect to callback page for verification
                const transactionRef = response.transactionRef || response.callbackData?.data?.transaction_reference;
                if (transactionRef) {
                    addToast('Payment successful. Verifying transaction...', 'info');
                    router.push(`/${storeConfig.slug}/payment/callback?reference=${transactionRef}&storeId=${storeConfig.id}`);
                }
                else {
                    addToast('Payment successful but verification failed. Please contact support with your transaction details.', 'error');
                    setIsProcessing(false);
                }
            }
        },
        onError: (error) => {
            addToast(`Payment error: ${error}`, 'error');
            setIsProcessing(false);
        },
        onClose: () => {
            // onClose is only called when payment was not successful (user canceled)
            // This is now handled correctly by payaza-checkout.ts tracking payment success state
            addToast('Payment canceled', 'info');
            setIsProcessing(false);
        },
    });
    // Initialize selected service if slug provided (from prop or query param)
    useEffect(() => {
        if (effectiveServiceSlug) {
            const service = storeConfig.services?.find(s => s.slug === effectiveServiceSlug);
            if (service) {
                if (service.id !== selectedService?.id) {
                    setSelectedService(service);
                    // If service is pre-selected, ensure we're on the datetime step
                    setCurrentStep('datetime');
                }
            }
            else {
                // Service slug not found - show error and fallback to service selection
                addToast(`Service not found. Please select a service.`, 'error');
                setCurrentStep('service');
                setSelectedService(null);
            }
        }
        else if (selectedService && !effectiveServiceSlug) {
            // If no service slug but we have a selected service, keep it
            // This handles the case where user navigates back
        }
        else if (!selectedService && !effectiveServiceSlug) {
            // No service selected and no slug - show service selection
            setCurrentStep('service');
        }
    }, [effectiveServiceSlug, storeConfig.services, addToast]);
    // Mock Data Generators
    const generateDates = () => {
        const dates = [];
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        // Get first day of the month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        // Calculate start date (Sunday before or on first day)
        const startDate = new Date(firstDay);
        startDate.setDate(1 - firstDay.getDay());
        // Calculate end date (Saturday after or on last day) to complete the grid
        const endDate = new Date(lastDay);
        if (endDate.getDay() < 6) {
            endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
        }
        // Generate dates
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
    const timeSlots = [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    // Helper function to get customer data (user data if authenticated, otherwise guestInfo)
    const getCustomerData = () => {
        if (isAuthenticated && user) {
            return {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                notes: guestInfo.notes, // Notes are still editable
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                zipCode: user.zipCode || '',
                country: user.country || '',
            };
        }
        return guestInfo;
    };
    // Helper function to calculate endTime from startTime and duration
    const calculateEndTime = (startTime, durationMinutes) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
        startDate.setMinutes(startDate.getMinutes() + durationMinutes);
        const endHours = String(startDate.getHours()).padStart(2, '0');
        const endMinutes = String(startDate.getMinutes()).padStart(2, '0');
        return `${endHours}:${endMinutes}`;
    };
    // Payaza SDK Integration
    const handlePayment = async () => {
        const customerData = getCustomerData();
        if (!selectedService || !customerData.email) {
            addToast('Missing booking information', 'error');
            return;
        }
        // Validate booking date and time are selected
        if (!selectedDate || !selectedTime) {
            addToast('Please select a date and time for your booking', 'error');
            return;
        }
        setIsProcessing(true);
        try {
            // Calculate endTime from service duration if not already set
            const endTime = selectedService.duration
                ? calculateEndTime(selectedTime, selectedService.duration)
                : null;
            // Format booking date as YYYY-MM-DD
            const bookingDateStr = selectedDate.toISOString().split('T')[0];
            // Step 1: Create order via API before payment
            // For services, use serviceId instead of productId
            const checkoutResponse = await checkoutService.processCheckout({
                storeId: storeConfig.id,
                items: selectedService.id ? [{
                        serviceId: selectedService.id, // Use serviceId for services
                        quantity: 1,
                        price: selectedService.price,
                        options: {
                            bookingDate: bookingDateStr,
                            startTime: selectedTime,
                            endTime: endTime || undefined,
                            customerNotes: guestInfo.notes || undefined,
                        },
                    }] : [],
                customerInfo: {
                    email: customerData.email,
                    firstName: customerData.firstName,
                    lastName: customerData.lastName,
                    phone: customerData.phone,
                },
                shippingAddress: {
                    firstName: customerData.firstName,
                    lastName: customerData.lastName,
                    address1: customerData.address || 'Address to be provided',
                    city: customerData.city || 'City',
                    state: customerData.state || 'State',
                    zipCode: customerData.zipCode || '00000',
                    country: customerData.country || 'Country',
                    phone: customerData.phone,
                },
                paymentMethod: 'payaza',
                customerId: isAuthenticated && user ? user.id : undefined, // Pass customerId for authenticated users
            });
            // Step 2: Convert to checkout format for Payaza
            const checkoutItems = [{
                    product: {
                        name: selectedService.name,
                        price: selectedService.price,
                    },
                    quantity: 1,
                    price: selectedService.price,
                }];
            // Step 3: Generate Payaza checkout config with order details
            const checkoutConfig = generateCheckoutConfig(checkoutItems, customerData.email, payazaPublicKey, {
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phone: customerData.phone,
                callbackUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/${storeConfig.slug}/payment/callback?storeId=${storeConfig.id}`,
                currency: checkoutResponse.currency || storeConfig.settings?.currency || 'USD',
                storeId: storeConfig.id,
                orderId: checkoutResponse.orderId,
                orderNumber: checkoutResponse.orderNumber,
                shippingAddress: {
                    firstName: customerData.firstName,
                    lastName: customerData.lastName,
                    address: customerData.address,
                    city: customerData.city,
                    state: customerData.state,
                    country: customerData.country,
                    zipCode: customerData.zipCode,
                },
            });
            // Step 4: Use transaction reference from order
            checkoutConfig.reference = checkoutResponse.transactionReference;
            await initiateCheckout(checkoutConfig);
        }
        catch (error) {
            console.error("Payment init error:", error);
            setIsProcessing(false);
        }
    };
    // Steps Configuration
    const steps = [
        { id: 'service', label: 'Service' },
        { id: 'datetime', label: 'Date & Time' },
        { id: 'details', label: 'Details' },
        { id: 'payment', label: 'Payment' },
        { id: 'success', label: 'Confirmation' },
    ];
    const currentStepIndex = steps.findIndex(s => s.id === currentStep);
    return (_jsx("div", { className: "min-h-screen bg-gray-50 pt-20 pb-20", children: _jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [_jsxs("div", { className: "mb-8", children: [_jsxs(Link, { href: `/${storeConfig.slug}`, className: "inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), " Back to Store"] }), _jsxs("div", { className: "flex items-center justify-between relative", children: [_jsx("div", { className: "absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" }), steps.filter(s => s.id !== 'success').map((step, idx) => (_jsxs("div", { className: "flex flex-col items-center gap-2 bg-gray-50 px-2", children: [_jsx("div", { className: cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border-2", idx <= currentStepIndex
                                                ? "bg-black border-black text-white"
                                                : "bg-white border-gray-300 text-gray-400"), style: idx <= currentStepIndex ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}, children: idx < currentStepIndex ? _jsx(Check, { className: "w-4 h-4" }) : idx + 1 }), _jsx("span", { className: cn("text-xs font-medium uppercase tracking-wider hidden md:block", idx <= currentStepIndex ? "text-black" : "text-gray-400"), children: step.label })] }, step.id)))] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl min-h-[500px] flex flex-col md:flex-row", children: [currentStep !== 'success' && (_jsxs("div", { className: "hidden md:block w-80 bg-gray-50 p-8 border-r border-gray-100 flex-shrink-0 md:rounded-l-2xl", children: [_jsx("h3", { className: "text-lg font-bold mb-6", children: "Booking Summary" }), selectedService ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1", children: "Service" }), _jsx("p", { className: "font-semibold text-gray-900", children: selectedService.name }), _jsxs("p", { className: "text-sm text-gray-500", children: [selectedService.duration, " mins \u2022 ", formatCurrency(selectedService.price, selectedService.currency || storeConfig.settings?.currency || 'USD')] })] }), selectedDate && (_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1", children: "Date" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) })] })), selectedTime && (_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1", children: "Time" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedTime })] })), _jsxs("div", { className: "pt-6 border-t border-gray-200 mt-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-gray-500", children: "Total" }), _jsx("span", { className: "text-xl font-bold", children: formatCurrency(selectedService.price, selectedService.currency || storeConfig.settings?.currency || 'USD') })] }), _jsxs("div", { className: "flex justify-between items-center text-xs text-green-600 font-medium mt-2", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ShieldCheck, { className: "w-3 h-3" }), " Secure Payment"] }), _jsx("span", { children: "Payaza" })] })] })] })) : (_jsx("p", { className: "text-gray-400 text-sm italic", children: "Select a service to begin..." }))] })), _jsxs("div", { className: "flex-1 p-6 md:p-10 flex flex-col md:rounded-r-2xl", children: [currentStep === 'service' && (_jsxs("div", { className: "animate-fade-in w-full", children: [_jsx("h2", { className: "text-2xl font-light mb-6", children: "Select a Service" }), _jsx("div", { className: "grid gap-4", children: storeConfig.services?.map((service) => (_jsxs("div", { onClick: () => {
                                                    setSelectedService(service);
                                                    setCurrentStep('datetime');
                                                }, className: "group flex items-center p-4 rounded-xl border border-gray-100 hover:border-black hover:shadow-md cursor-pointer transition-all", children: [_jsx("div", { className: "h-16 w-16 rounded-lg bg-gray-100 overflow-hidden mr-4 flex-shrink-0 relative", children: _jsx(ImageWithFallback, { src: service.image, alt: service.name, className: "w-full h-full object-cover", skeletonAspectRatio: "square" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("h3", { className: "font-bold text-gray-900 group-hover:text-black transition-colors truncate", children: service.name }), _jsx("span", { className: "font-semibold flex-shrink-0 ml-2", children: formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD') })] }), _jsx("p", { className: "text-sm text-gray-500 line-clamp-1", children: service.description }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-gray-400", children: [_jsx(Clock, { className: "w-3 h-3" }), " ", service.duration, " mins"] })] }), _jsx(ChevronRight, { className: "w-5 h-5 text-gray-300 group-hover:text-black ml-4 flex-shrink-0" })] }, service.id))) })] })), currentStep === 'datetime' && (_jsxs("div", { className: "w-full", children: [_jsx("h2", { className: "text-2xl font-light mb-8", children: "When would you like to come?" }), _jsx("div", { className: "mb-10", children: _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }) }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 rounded-full", onClick: prevMonth, children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 rounded-full", onClick: nextMonth, children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "grid grid-cols-7 mb-3", children: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (_jsx("div", { className: "text-center text-xs font-bold text-gray-400 uppercase tracking-wider", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-y-3", children: generateDates().map((date, i) => {
                                                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                                                            const isToday = date.toDateString() === new Date().toDateString();
                                                            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                                                            return (_jsx("div", { className: "flex justify-center", children: _jsxs("button", { onClick: () => setSelectedDate(date), className: cn("h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative", isSelected
                                                                        ? "bg-black text-white shadow-md scale-110"
                                                                        : isToday
                                                                            ? "text-black font-bold bg-gray-100"
                                                                            : !isCurrentMonth
                                                                                ? "text-gray-300 hover:text-gray-500"
                                                                                : "text-gray-600 hover:bg-gray-50 hover:text-black"), style: isSelected ? { backgroundColor: primaryColor } : {}, children: [date.getDate(), isToday && !isSelected && (_jsx("div", { className: "absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-400" }))] }) }, i));
                                                        }) })] }) }), selectedDate && (_jsxs("div", { className: "mb-8 animate-fade-in", children: [_jsxs("h3", { className: "text-sm font-bold uppercase tracking-wider text-gray-400 mb-4", children: ["Available Time Slots for ", selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })] }), _jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3", children: timeSlots.map((time) => (_jsx("button", { onClick: () => setSelectedTime(time), className: cn("py-3 px-2 rounded-xl text-sm font-medium border transition-all text-center hover:shadow-sm", selectedTime === time
                                                            ? "bg-black text-white border-black shadow-md transform scale-[1.02]"
                                                            : "bg-white border-gray-100 text-gray-700 hover:border-gray-300 hover:text-black"), style: selectedTime === time ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}, children: time }, time))) })] })), _jsx("div", { className: "mt-10 pt-6 border-t border-gray-100 flex justify-end", children: _jsxs(Button, { disabled: !selectedDate || !selectedTime, onClick: () => {
                                                    // Skip details step for authenticated users, go directly to payment
                                                    if (isAuthenticated && user) {
                                                        setCurrentStep('payment');
                                                    }
                                                    else {
                                                        setCurrentStep('details');
                                                    }
                                                }, className: "w-full sm:w-auto shadow-lg min-w-[140px] rounded-full", style: { backgroundColor: primaryColor }, children: ["Continue ", _jsx(ChevronRight, { className: "w-4 h-4 ml-2" })] }) })] })), currentStep === 'details' && (_jsxs("div", { className: "animate-fade-in w-full", children: [_jsx("h2", { className: "text-2xl font-light mb-6", children: "Your Details" }), isAuthenticated && user ? (
                                        // Authenticated user - show read-only account info
                                        _jsxs("div", { className: "space-y-4 max-w-md", children: [_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6", children: _jsxs("p", { className: "text-sm text-blue-900", children: [_jsx("strong", { children: "Using your account information." }), " Your details are pre-filled from your account."] }) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "First Name" }), _jsx("input", { type: "text", className: "w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed", value: user.firstName || '', disabled: true, readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Last Name" }), _jsx("input", { type: "text", className: "w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed", value: user.lastName || '', disabled: true, readOnly: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Email" }), _jsx("input", { type: "email", className: "w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed", value: user.email || '', disabled: true, readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Phone" }), _jsx("input", { type: "tel", className: "w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed", value: user.phone || '', disabled: true, readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Notes (Optional)" }), _jsx("textarea", { className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors h-24 resize-none", placeholder: "Any special requests or allergies?", value: guestInfo.notes, onChange: (e) => setGuestInfo({ ...guestInfo, notes: e.target.value }) })] })] })) : (
                                        // Guest user - show editable form
                                        _jsxs("form", { className: "space-y-4 max-w-md", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "First Name" }), _jsx("input", { type: "text", className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors", placeholder: "John", value: guestInfo.firstName, onChange: (e) => setGuestInfo({ ...guestInfo, firstName: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Last Name" }), _jsx("input", { type: "text", className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors", placeholder: "Doe", value: guestInfo.lastName, onChange: (e) => setGuestInfo({ ...guestInfo, lastName: e.target.value }), required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Email" }), _jsx("input", { type: "email", className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors", placeholder: "john@example.com", value: guestInfo.email, onChange: (e) => setGuestInfo({ ...guestInfo, email: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Phone" }), _jsx("input", { type: "tel", className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors", placeholder: "+1 (555) 000-0000", value: guestInfo.phone, onChange: (e) => setGuestInfo({ ...guestInfo, phone: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1", children: "Notes (Optional)" }), _jsx("textarea", { className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors h-24 resize-none", placeholder: "Any special requests or allergies?", value: guestInfo.notes, onChange: (e) => setGuestInfo({ ...guestInfo, notes: e.target.value }) })] })] })), _jsxs("div", { className: "mt-10 flex justify-between items-center", children: [_jsxs(Button, { variant: "ghost", onClick: () => {
                                                        // Go back to details for guests, datetime for authenticated users (since they skip details)
                                                        if (isAuthenticated && user) {
                                                            setCurrentStep('datetime');
                                                        }
                                                        else {
                                                            setCurrentStep('details');
                                                        }
                                                    }, children: [_jsx(ChevronLeft, { className: "w-4 h-4 mr-2" }), " Back"] }), _jsxs(Button, { onClick: () => {
                                                        // Validate guest info if not authenticated
                                                        if (!isAuthenticated) {
                                                            if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
                                                                addToast('Please fill in all required fields', 'error');
                                                                return;
                                                            }
                                                        }
                                                        setCurrentStep('payment');
                                                    }, className: "w-full sm:w-auto", style: { backgroundColor: primaryColor }, children: ["Continue to Payment ", _jsx(ChevronRight, { className: "w-4 h-4 ml-2" })] })] })] })), currentStep === 'payment' && (_jsxs("div", { className: "animate-fade-in w-full", children: [_jsx("h2", { className: "text-2xl font-light mb-6", children: "Review & Pay" }), isAuthenticated && user && (_jsxs("div", { className: "bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6", children: [_jsx("h3", { className: "text-sm font-bold uppercase tracking-wider text-gray-500 mb-4", children: "Booking Information" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Name:" }), _jsxs("p", { className: "font-medium text-gray-900", children: [user.firstName, " ", user.lastName] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Email:" }), _jsx("p", { className: "font-medium text-gray-900", children: user.email })] }), user.phone && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Phone:" }), _jsx("p", { className: "font-medium text-gray-900", children: user.phone })] })), selectedDate && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Date:" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) })] })), selectedTime && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Time:" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedTime })] }))] }), guestInfo.notes && (_jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200", children: [_jsx("span", { className: "text-gray-500 text-sm", children: "Special Notes:" }), _jsx("p", { className: "text-gray-900 mt-1", children: guestInfo.notes })] }))] })), _jsx("div", { className: "bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx(Lock, { className: "w-5 h-5 text-blue-600 mt-1" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-blue-900 mb-1", children: "Encrypted Transaction" }), _jsx("p", { className: "text-sm text-blue-700/80 leading-relaxed", children: "Your payment is processed securely by Payaza. We do not store your card details." })] })] }) }), _jsxs("div", { className: "flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest", children: [_jsx(Lock, { className: "w-3 h-3" }), "256-bit SSL Secure Payment"] }), _jsxs("div", { className: "mt-10 flex justify-between items-center", children: [_jsxs(Button, { variant: "ghost", onClick: () => {
                                                        // Go back to details for guests, datetime for authenticated users (since they skip details)
                                                        if (isAuthenticated && user) {
                                                            setCurrentStep('datetime');
                                                        }
                                                        else {
                                                            setCurrentStep('details');
                                                        }
                                                    }, disabled: isProcessing || isPayazaLoading, children: [_jsx(ChevronLeft, { className: "w-4 h-4 mr-2" }), " Back"] }), _jsx(Button, { onClick: handlePayment, disabled: isProcessing || isPayazaLoading, className: "w-full sm:w-auto min-w-[200px] h-14 text-lg shadow-xl hover:shadow-2xl transition-all", style: { backgroundColor: primaryColor }, children: isProcessing || isPayazaLoading ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), _jsx("span", { children: "Processing..." })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Lock, { className: "w-4 h-4" }), _jsxs("span", { children: ["Pay ", formatCurrency(selectedService?.price || 0, selectedService?.currency || storeConfig.settings?.currency || 'USD'), " Now"] })] })) })] })] })), currentStep === 'success' && (_jsxs("div", { className: "animate-fade-in flex-1 flex flex-col items-center justify-center py-12 px-4", children: [_jsxs("div", { className: "mb-8 relative", children: [_jsx("div", { className: "w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-scale-in relative z-10", children: _jsx(CheckCircle2, { className: "w-12 h-12 text-green-600" }) }), _jsx("div", { className: "absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" })] }), _jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-3 text-gray-900 text-center tracking-tight", children: "Booking Confirmed!" }), _jsx("p", { className: "text-gray-500 mb-10 text-center max-w-md text-lg", children: "You're all set. A confirmation email has been sent to you." }), _jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-10 w-full max-w-md relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-1 h-full", style: { backgroundColor: primaryColor } }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Service" }), _jsx("p", { className: "font-bold text-gray-900", children: selectedService?.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Total Paid" }), _jsx("p", { className: "font-bold text-gray-900", children: formatCurrency(selectedService?.price || 0, selectedService?.currency || storeConfig.settings?.currency || 'USD') })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Date" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedDate?.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Time" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedTime })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 w-full max-w-md", children: [_jsx(Link, { href: `/${storeConfig.slug}/account?tab=bookings`, className: "flex-1", children: _jsx(Button, { size: "lg", className: "w-full rounded-xl h-14 text-base shadow-xl shadow-black/5 transition-all hover:shadow-2xl hover:-translate-y-0.5", style: { backgroundColor: primaryColor }, children: "View My Bookings" }) }), _jsx(Link, { href: `/${storeConfig.slug}`, className: "flex-1", children: _jsx(Button, { variant: "outline", size: "lg", className: "w-full rounded-xl h-14 text-base border-gray-200 hover:bg-gray-50 hover:text-black hover:border-gray-300", children: "Return to Home" }) })] })] }))] })] })] }) }));
}

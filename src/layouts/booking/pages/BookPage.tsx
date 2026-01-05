'use client';

import { StoreConfig, StoreService } from '@/lib/store-types';
import { useState, useEffect } from 'react';
import { Clock, Check, ChevronRight, ChevronLeft, ArrowLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { usePayazaCheckout } from '@/hooks/use-payaza-checkout';
import { generateCheckoutConfig } from '@/lib/payaza-checkout';
import { checkoutService } from '@/lib/services/checkout.service';
import { paymentService } from '@/lib/services/payment.service';
import { useToast } from '@/components/ui/toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface BookPageProps {
  storeConfig: StoreConfig;
  serviceSlug?: string;
}

type Step = 'service' | 'datetime' | 'details' | 'payment' | 'success';

export function BookPage({ storeConfig, serviceSlug }: BookPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;
  const { addToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  // Get service slug from query params or prop
  const serviceSlugFromQuery = searchParams?.get('service') || null;
  const effectiveServiceSlug = serviceSlug || serviceSlugFromQuery;
  
  // State
  const [currentStep, setCurrentStep] = useState<Step>(effectiveServiceSlug ? 'datetime' : 'service');
  const [selectedService, setSelectedService] = useState<StoreService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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
            router.push(
              `/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`
            );
            return;
          }
        } catch (error) {
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
              } else {
                console.log('[Booking] Payment confirmed, order processing initiated');
              }
          
              // Success - break out of retry loop
              break;
            } catch (error: any) {
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
              const polledVerification = await paymentService.pollPaymentStatus(
                transactionRef,
                storeConfig.id,
                {
                  maxAttempts: 3, // Poll for max 3 seconds (3 * 1s)
                  intervalMs: 1000, // Poll every 1 second
                  onProgress: (attempt, maxAttempts) => {
                    console.log(`[Booking] Polling for webhook (${attempt}/${maxAttempts})...`);
                  }
                }
              );
              
              if (polledVerification && polledVerification.verified && polledVerification.paymentStatus === 'completed') {
                console.log('[Booking] Payment completed by webhook, proceeding to success page');
                const orderId = polledVerification.orderId || transactionRef;
                const orderNumber = polledVerification.orderNumber || '';
                router.push(
                  `/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`
                );
                return;
              }
            } catch (pollError) {
              console.error('[Booking] Polling also failed:', pollError);
            }
            
            // Final fallback: Redirect to callback page for manual verification
            console.log('[Booking] Redirecting to callback page for verification');
            addToast('Payment successful. Verifying transaction...', 'info');
            router.push(
              `/${storeConfig.slug}/payment/callback?reference=${transactionRef}&storeId=${storeConfig.id}`
            );
            return;
          }
          
          // Success - redirect to success page
          const orderId = confirmation.orderId;
          const orderNumber = confirmation.orderNumber || '';
          
          // Redirect to success page with order details
          router.push(
            `/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`
          );
        } else {
          // Fallback: Use transaction reference to verify payment
          console.log('[Booking] No callback data, verifying payment with transaction reference:', response.transactionRef);
          
          if (response.transactionRef) {
            // Redirect to callback page for verification and confirmation
            router.push(
              `/${storeConfig.slug}/payment/callback?reference=${response.transactionRef}&storeId=${storeConfig.id}`
            );
          } else {
            addToast('Payment successful but unable to process. Please contact support.', 'info');
            setIsProcessing(false);
          }
        }
      } catch (error: any) {
        console.error('[Booking] Error processing payment callback:', error);
        
        // Fallback: Try to redirect to callback page for verification
        const transactionRef = response.transactionRef || response.callbackData?.data?.transaction_reference;
        if (transactionRef) {
          addToast('Payment successful. Verifying transaction...', 'info');
          router.push(
            `/${storeConfig.slug}/payment/callback?reference=${transactionRef}&storeId=${storeConfig.id}`
          );
        } else {
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
      } else {
        // Service slug not found - show error and fallback to service selection
        addToast(`Service not found. Please select a service.`, 'error');
        setCurrentStep('service');
        setSelectedService(null);
      }
    } else if (selectedService && !effectiveServiceSlug) {
      // If no service slug but we have a selected service, keep it
      // This handles the case where user navigates back
    } else if (!selectedService && !effectiveServiceSlug) {
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
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
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
      const checkoutConfig = generateCheckoutConfig(
        checkoutItems,
        customerData.email,
        payazaPublicKey,
        {
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
        }
      );

      // Step 4: Use transaction reference from order
      checkoutConfig.reference = checkoutResponse.transactionReference;

      await initiateCheckout(checkoutConfig);
    } catch (error) {
      console.error("Payment init error:", error);
      setIsProcessing(false);
    }
  };

  // Steps Configuration
  const steps: { id: Step; label: string }[] = [
    { id: 'service', label: 'Service' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'details', label: 'Details' },
    { id: 'payment', label: 'Payment' },
    { id: 'success', label: 'Confirmation' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Progress Header */}
        <div className="mb-8">
          <Link href={`/${storeConfig.slug}`} className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Store
          </Link>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />
            {steps.filter(s => s.id !== 'success').map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border-2",
                    idx <= currentStepIndex 
                      ? "bg-black border-black text-white" 
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                  style={idx <= currentStepIndex ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                >
                  {idx < currentStepIndex ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium uppercase tracking-wider hidden md:block",
                  idx <= currentStepIndex ? "text-black" : "text-gray-400"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl min-h-[500px] flex flex-col md:flex-row">
          
          {/* Summary Sidebar (Desktop) - Hide on Success */}
          {currentStep !== 'success' && (
            <div className="hidden md:block w-80 bg-gray-50 p-8 border-r border-gray-100 flex-shrink-0 md:rounded-l-2xl">
              <h3 className="text-lg font-bold mb-6">Booking Summary</h3>
              
              {selectedService ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">Service</span>
                    <p className="font-semibold text-gray-900">{selectedService.name}</p>
                    <p className="text-sm text-gray-500">{selectedService.duration} mins • {formatCurrency(selectedService.price, selectedService.currency || storeConfig.settings?.currency || 'USD')}</p>
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">Date</span>
                      <p className="font-medium text-gray-900">
                        {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">Time</span>
                      <p className="font-medium text-gray-900">{selectedTime}</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-200 mt-auto">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-gray-500">Total</span>
                       <span className="text-xl font-bold">{formatCurrency(selectedService.price, selectedService.currency || storeConfig.settings?.currency || 'USD')}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs text-green-600 font-medium mt-2">
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Payment</span>
                        <span>Payaza</span>
                     </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Select a service to begin...</p>
              )}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-10 flex flex-col md:rounded-r-2xl">
            
            {/* Step 1: Service Selection */}
            {currentStep === 'service' && (
              <div className="animate-fade-in w-full">
                <h2 className="text-2xl font-light mb-6">Select a Service</h2>
                <div className="grid gap-4">
                  {storeConfig.services?.map((service) => (
                    <div 
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        setCurrentStep('datetime');
                      }}
                      className="group flex items-center p-4 rounded-xl border border-gray-100 hover:border-black hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden mr-4 flex-shrink-0 relative">
                        <ImageWithFallback 
                          src={service.image} 
                          alt={service.name} 
                          className="w-full h-full object-cover"
                          skeletonAspectRatio="square"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-black transition-colors truncate">{service.name}</h3>
                          <span className="font-semibold flex-shrink-0 ml-2">{formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD')}</span>
                            </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" /> {service.duration} mins
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black ml-4 flex-shrink-0" />
                    </div>
              ))}
            </div>
          </div>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 'datetime' && (
              <div className="w-full">
                <h2 className="text-2xl font-light mb-8">When would you like to come?</h2>
                
                {/* Calendar Grid */}
                <div className="mb-10">
                    <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-lg font-bold text-gray-900">
                         {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                       </h3>
                       <div className="flex gap-1">
                         <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={prevMonth}>
                           <ChevronLeft className="w-4 h-4" />
                         </Button>
                         <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={nextMonth}>
                           <ChevronRight className="w-4 h-4" />
                         </Button>
                       </div>
                    </div>

                    {/* Calendar Header - Day Names */}
                    <div className="grid grid-cols-7 mb-3">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {day}
                        </div>
                            ))}
                        </div>

                    {/* Calendar Grid - Dates */}
                    <div className="grid grid-cols-7 gap-y-3">
                      {generateDates().map((date, i) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                        
                        return (
                          <div key={i} className="flex justify-center">
                            <button
                              onClick={() => setSelectedDate(date)}
                              className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative",
                                isSelected 
                                  ? "bg-black text-white shadow-md scale-110" 
                                  : isToday
                                  ? "text-black font-bold bg-gray-100"
                                  : !isCurrentMonth
                                  ? "text-gray-300 hover:text-gray-500" 
                                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
                              )}
                              style={isSelected ? { backgroundColor: primaryColor } : {}}
                            >
                              {date.getDate()}
                              {isToday && !isSelected && (
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-400" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Grid */}
                {selectedDate && (
                  <div className="mb-8 animate-fade-in">
                     <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                       Available Time Slots for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                     </h3>
                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                       {timeSlots.map((time) => (
                         <button
                           key={time}
                           onClick={() => setSelectedTime(time)}
                           className={cn(
                             "py-3 px-2 rounded-xl text-sm font-medium border transition-all text-center hover:shadow-sm",
                             selectedTime === time
                               ? "bg-black text-white border-black shadow-md transform scale-[1.02]"
                               : "bg-white border-gray-100 text-gray-700 hover:border-gray-300 hover:text-black"
                           )}
                           style={selectedTime === time ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                         >
                           {time}
                         </button>
                       ))}
                     </div>
                  </div>
                )}
                
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                    <Button
                      disabled={!selectedDate || !selectedTime}
                    onClick={() => {
                      // Skip details step for authenticated users, go directly to payment
                      if (isAuthenticated && user) {
                        setCurrentStep('payment');
                      } else {
                        setCurrentStep('details');
                      }
                    }}
                    className="w-full sm:w-auto shadow-lg min-w-[140px] rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 'details' && (
              <div className="animate-fade-in w-full">
                <h2 className="text-2xl font-light mb-6">Your Details</h2>
                
                {isAuthenticated && user ? (
                  // Authenticated user - show read-only account info
                  <div className="space-y-4 max-w-md">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-900">
                        <strong>Using your account information.</strong> Your details are pre-filled from your account.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed" 
                          value={user.firstName || ''}
                          disabled
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed" 
                          value={user.lastName || ''}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed" 
                        value={user.email || ''}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed" 
                        value={user.phone || ''}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Notes (Optional)</label>
                      <textarea 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors h-24 resize-none" 
                        placeholder="Any special requests or allergies?"
                        value={guestInfo.notes}
                        onChange={(e) => setGuestInfo({...guestInfo, notes: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  // Guest user - show editable form
                  <form className="space-y-4 max-w-md">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                         <input 
                           type="text" 
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors" 
                           placeholder="John"
                           value={guestInfo.firstName}
                           onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                           required
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                         <input 
                           type="text" 
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors" 
                           placeholder="Doe"
                           value={guestInfo.lastName}
                           onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                           required
                         />
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email</label>
                       <input 
                         type="email" 
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors" 
                         placeholder="john@example.com"
                         value={guestInfo.email}
                         onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Phone</label>
                       <input 
                         type="tel" 
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors" 
                         placeholder="+1 (555) 000-0000"
                         value={guestInfo.phone}
                         onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Notes (Optional)</label>
                       <textarea 
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors h-24 resize-none" 
                         placeholder="Any special requests or allergies?"
                         value={guestInfo.notes}
                         onChange={(e) => setGuestInfo({...guestInfo, notes: e.target.value})}
                       />
                     </div>
                  </form>
                )}

                 <div className="mt-10 flex justify-between items-center">
                   <Button variant="ghost" onClick={() => {
                     // Go back to details for guests, datetime for authenticated users (since they skip details)
                     if (isAuthenticated && user) {
                       setCurrentStep('datetime');
                     } else {
                       setCurrentStep('details');
                     }
                   }}>
                     <ChevronLeft className="w-4 h-4 mr-2" /> Back
                   </Button>
                   <Button 
                    onClick={() => {
                      // Validate guest info if not authenticated
                      if (!isAuthenticated) {
                        if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
                          addToast('Please fill in all required fields', 'error');
                          return;
                        }
                      }
                      setCurrentStep('payment');
                    }}
                    className="w-full sm:w-auto"
                    style={{ backgroundColor: primaryColor }}
                    >
                    Continue to Payment <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 'payment' && (
              <div className="animate-fade-in w-full">
                 <h2 className="text-2xl font-light mb-6">Review & Pay</h2>
                 
                 {/* Customer Info Summary for Authenticated Users */}
                 {isAuthenticated && user && (
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                     <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Booking Information</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="text-gray-500">Name:</span>
                         <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                       </div>
                       <div>
                         <span className="text-gray-500">Email:</span>
                         <p className="font-medium text-gray-900">{user.email}</p>
                       </div>
                       {user.phone && (
                         <div>
                           <span className="text-gray-500">Phone:</span>
                           <p className="font-medium text-gray-900">{user.phone}</p>
                         </div>
                       )}
                       {selectedDate && (
                         <div>
                           <span className="text-gray-500">Date:</span>
                           <p className="font-medium text-gray-900">
                             {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                           </p>
                         </div>
                       )}
                       {selectedTime && (
                         <div>
                           <span className="text-gray-500">Time:</span>
                           <p className="font-medium text-gray-900">{selectedTime}</p>
                         </div>
                       )}
                     </div>
                     {guestInfo.notes && (
                       <div className="mt-4 pt-4 border-t border-gray-200">
                         <span className="text-gray-500 text-sm">Special Notes:</span>
                         <p className="text-gray-900 mt-1">{guestInfo.notes}</p>
                       </div>
                     )}
                   </div>
                 )}
                 
                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6">
                   <div className="flex items-start gap-4">
                     <Lock className="w-5 h-5 text-blue-600 mt-1" />
                     <div>
                       <h4 className="font-bold text-blue-900 mb-1">Encrypted Transaction</h4>
                       <p className="text-sm text-blue-700/80 leading-relaxed">
                         Your payment is processed securely by Payaza. We do not store your card details.
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                   <Lock className="w-3 h-3" />
                   256-bit SSL Secure Payment
                 </div>

                 <div className="mt-10 flex justify-between items-center">
                   <Button variant="ghost" onClick={() => {
                     // Go back to details for guests, datetime for authenticated users (since they skip details)
                     if (isAuthenticated && user) {
                       setCurrentStep('datetime');
                     } else {
                       setCurrentStep('details');
                     }
                   }} disabled={isProcessing || isPayazaLoading}>
                     <ChevronLeft className="w-4 h-4 mr-2" /> Back
                   </Button>
                   <Button 
                    onClick={handlePayment}
                    disabled={isProcessing || isPayazaLoading}
                    className="w-full sm:w-auto min-w-[200px] h-14 text-lg shadow-xl hover:shadow-2xl transition-all"
                    style={{ backgroundColor: primaryColor }}
                   >
                    {isProcessing || isPayazaLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Pay {formatCurrency(selectedService?.price || 0, selectedService?.currency || storeConfig.settings?.currency || 'USD')} Now</span>
                      </div>
                    )}
                    </Button>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {currentStep === 'success' && (
              <div className="animate-fade-in flex-1 flex flex-col items-center justify-center py-12 px-4">
                <div className="mb-8 relative">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-scale-in relative z-10">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 text-center tracking-tight">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-10 text-center max-w-md text-lg">
                  You&apos;re all set. A confirmation email has been sent to you.
                </p>

                {/* Booking Details Card */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-10 w-full max-w-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: primaryColor }} />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Service</p>
                      <p className="font-bold text-gray-900">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
                      <p className="font-bold text-gray-900">{formatCurrency(selectedService?.price || 0, selectedService?.currency || storeConfig.settings?.currency || 'USD')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-medium text-gray-900">
                        {selectedDate?.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                      <p className="font-medium text-gray-900">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Link href={`/${storeConfig.slug}/account?tab=bookings`} className="flex-1">
                    <Button size="lg" className="w-full rounded-xl h-14 text-base shadow-xl shadow-black/5 transition-all hover:shadow-2xl hover:-translate-y-0.5" style={{ backgroundColor: primaryColor }}>
                      View My Bookings
                    </Button>
                  </Link>
                  <Link href={`/${storeConfig.slug}`} className="flex-1">
                    <Button variant="outline" size="lg" className="w-full rounded-xl h-14 text-base border-gray-200 hover:bg-gray-50 hover:text-black hover:border-gray-300">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

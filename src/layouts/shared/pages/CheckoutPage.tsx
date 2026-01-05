'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, CheckCircle, MapPin, Lock, ChevronRight, Tag, Truck, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { usePayazaCheckout } from '@/hooks/use-payaza-checkout';
import { generateCheckoutConfig } from '@/lib/payaza-checkout';
import { useToast } from '@/components/ui/toast';
import { useStore } from '@/lib/store-context';
import { useRouter } from 'next/navigation';
import { normalizePrice, formatCurrency } from '@/lib/utils';
import { checkoutService } from '@/lib/services/checkout.service';
import { paymentService } from '@/lib/services/payment.service';
import { useAuth } from '@/lib/auth-context';
import { customerService, Address } from '@/lib/services/customer.service';
import { AddressSelector } from '@/components/ui/address-selector';
import { countries, getCountryByName, getCitiesByCountry } from '@/lib/countries';
import { calculateVAT, getVATLabel } from '@/lib/utils/fee-calculations';
import { shippingService, ShippingMethod } from '@/lib/services/shipping.service';
import { CheckoutSkeleton } from '@/components/ui/skeletons/checkout-skeleton';
import type { CartItem } from '@/lib/store-context';
import { analyticsService } from '@/lib/services/analytics.service';
import { useAnalytics } from '@/hooks/use-analytics';

interface CheckoutPageProps {
  storeConfig: StoreConfig;
}

export function CheckoutPage({ storeConfig }: CheckoutPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;
  const { cart, cartTotal, buyNowItem, clearBuyNowItem, setBuyNowItem } = useStore();
  const { addToast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { trackEvent } = useAnalytics();

  // Read from sessionStorage synchronously on mount if buyNowItem is not in context
  const [sessionBuyNowItem] = useState<CartItem | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem('buyNowItem');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to read buyNowItem from sessionStorage:', error);
    }
    return null;
  });

  // State to track initialization
  const [isInitializing, setIsInitializing] = useState(true);
  const hasRestoredRef = useRef(false);

  // Restore buyNowItem from sessionStorage to context if needed (only once on mount)
  useEffect(() => {
    // Only run restoration once
    if (hasRestoredRef.current) {
      return;
    }

    hasRestoredRef.current = true;

    // If item is already in context, we're done
    if (buyNowItem) {
      setIsInitializing(false);
      return;
    }

    // If we have sessionBuyNowItem but not in context, restore it
    if (sessionBuyNowItem) {
      setBuyNowItem(sessionBuyNowItem);
    }

    // Add a small delay to ensure state propagation
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 150);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Stop initializing if buyNowItem becomes available after mount
  useEffect(() => {
    if (buyNowItem && isInitializing) {
      setIsInitializing(false);
    }
  }, [buyNowItem, isInitializing]);

  // Use buyNowItem from context or sessionStorage, otherwise use cart
  const effectiveBuyNowItem = buyNowItem || sessionBuyNowItem;
  const checkoutItems = effectiveBuyNowItem ? [effectiveBuyNowItem] : cart;
  const checkoutTotal = effectiveBuyNowItem
    ? effectiveBuyNowItem.price * effectiveBuyNowItem.quantity
    : cartTotal;

  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Address management state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Shipping calculation state
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [freeShippingEligible, setFreeShippingEligible] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | undefined>(undefined);


  // Payaza Configuration
  // Do not hardcode a live key in code; require configuration via storeConfig/env.
  const payazaPublicKey = storeConfig.payment?.payazaPublicKey || process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '';

  const { checkout: initiateCheckout, isLoading: isPayazaLoading } = usePayazaCheckout({
    publicKey: payazaPublicKey,
    onSuccess: async (response) => {
      try {
        setLoading(true);
        const transactionRef = response.transactionRef || response.callbackData?.data?.transaction_reference;

        if (!transactionRef) {
          addToast('Payment successful but no transaction reference. Please contact support.', 'info');
          setLoading(false);
          return;
        }

        console.log('[Checkout] SDK callback received, verifying payment...');
        addToast('Verifying payment...', 'info');

        // Step 1: Immediate check if webhook already processed payment (no delay)
        let immediateVerification;
        try {
          immediateVerification = await paymentService.verifyPayment(transactionRef, storeConfig.id);
          if (immediateVerification.verified && immediateVerification.paymentStatus === 'completed') {
            console.log('[Checkout] Payment already completed by webhook, proceeding to success page');
            const orderId = immediateVerification.orderId || transactionRef;
            const orderNumber = immediateVerification.orderNumber || '';
            router.push(
              `/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`
            );
            return;
          }
        } catch (error) {
          console.log('[Checkout] Immediate verification failed, proceeding with confirmation');
        }

        // Step 2: If webhook hasn't processed yet, immediately confirm from callback data
        // We have the callback data from Payaza, so we can confirm immediately instead of waiting
        if (response.callbackData) {
          console.log('[Checkout] Processing Payaza callback confirmation immediately');

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
                console.log('[Checkout] Payment already processed, redirecting to success page');
              } else {
                console.log('[Checkout] Payment confirmed, order processing initiated');
              }

              // Success - break out of retry loop
              break;
            } catch (error: any) {
              lastError = error;
              console.error(`[Checkout] Payment confirmation attempt ${attempt} failed:`, error);

              // If this is not the last attempt, wait before retrying
              if (attempt < MAX_RETRIES) {
                console.log(`[Checkout] Retrying payment confirmation in ${RETRY_DELAY}ms...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt)); // Exponential backoff
              }
            }
          }

          // If all retries failed, do a short poll to catch webhook processing (max 3 seconds)
          if (!confirmation) {
            console.log('[Checkout] Confirmation failed, doing short poll for webhook processing...');
            try {
              const polledVerification = await paymentService.pollPaymentStatus(
                transactionRef,
                storeConfig.id,
                {
                  maxAttempts: 3, // Poll for max 3 seconds (3 * 1s)
                  intervalMs: 1000, // Poll every 1 second
                  onProgress: (attempt, maxAttempts) => {
                    console.log(`[Checkout] Polling for webhook (${attempt}/${maxAttempts})...`);
                  }
                }
              );

              if (polledVerification && polledVerification.verified && polledVerification.paymentStatus === 'completed') {
                console.log('[Checkout] Payment completed by webhook, proceeding to success page');
                const orderId = polledVerification.orderId || transactionRef;
                const orderNumber = polledVerification.orderNumber || '';
                router.push(
                  `/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`
                );
                return;
              }
            } catch (pollError) {
              console.error('[Checkout] Polling also failed:', pollError);
            }

            // Final fallback: Redirect to callback page for manual verification
            console.log('[Checkout] Redirecting to callback page for verification');
            addToast('Payment successful. Verifying transaction...', 'info');
            router.push(
              `/${storeConfig.slug}/payment/callback?reference=${transactionRef}&storeId=${storeConfig.id}`
            );
            return;
          }

          // Success - redirect to success page
          const orderId = confirmation.orderId;
          const orderNumber = confirmation.orderNumber || '';

          // Redirect to success page
          router.push(
            `/${storeConfig.slug}/order/success?orderId=${orderId}&ref=${transactionRef}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`
          );
        } else {
          // Fallback: Use transaction reference to verify payment
          console.log('[Checkout] No callback data, verifying payment with transaction reference:', response.transactionRef);

          if (response.transactionRef) {
            // Redirect to callback page for verification and confirmation
            router.push(
              `/${storeConfig.slug}/payment/callback?reference=${response.transactionRef}&storeId=${storeConfig.id}`
            );
          } else {
            addToast('Payment successful but unable to process. Please contact support.', 'info');
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error('[Checkout] Error processing payment callback:', error);

        // Fallback: Try to redirect to callback page for verification
        const transactionRef = response.transactionRef || response.callbackData?.data?.transaction_reference;
        if (transactionRef) {
          addToast('Payment successful. Verifying transaction...', 'info');
          router.push(
            `/${storeConfig.slug}/payment/callback?reference=${transactionRef}&storeId=${storeConfig.id}`
          );
        } else {
          addToast('Payment successful but verification failed. Please contact support with your transaction details.', 'error');
          setLoading(false);
        }
      }
    },
    onError: (error) => {
      addToast(`Checkout error: ${error}`, 'error');
      setLoading(false);
    },
    onClose: () => {
      // onClose is only called when payment was not successful (user canceled)
      // This is now handled correctly by payaza-checkout.ts tracking payment success state
      addToast('Payment canceled', 'info');
      setLoading(false);
    },
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Track checkout_start event when checkout page loads with items
  useEffect(() => {
    if (isLoaded && !isInitializing && storeConfig?.id && (checkoutItems.length > 0 || effectiveBuyNowItem)) {
      const totalValue = checkoutTotal;
      const itemCount = checkoutItems.length;
      trackEvent({
        eventType: 'checkout_start',
        metadata: {
          totalValue,
          itemCount,
          items: checkoutItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }).catch(err => console.warn('Failed to track checkout_start:', err));
    }
  }, [isLoaded, isInitializing, storeConfig?.id, checkoutItems, effectiveBuyNowItem, checkoutTotal, trackEvent]);

  // Redirect to home if checkout items are empty (with delay to allow state propagation)
  useEffect(() => {
    if (!isInitializing && isLoaded) {
      // Add a delay to ensure buyNowItem state has propagated
      const redirectTimer = setTimeout(() => {
        // Check again if we have buyNowItem in sessionStorage (even if not in context yet)
        const hasBuyNowInStorage = typeof window !== 'undefined' && sessionStorage.getItem('buyNowItem');

        // Don't redirect if we have buyNowItem in sessionStorage or if checkoutItems exist
        if (hasBuyNowInStorage) {
          // If we have it in storage but not in state, try to restore it one more time
          if (!effectiveBuyNowItem) {
            try {
              const stored = sessionStorage.getItem('buyNowItem');
              if (stored) {
                const parsedItem = JSON.parse(stored);
                setBuyNowItem(parsedItem);
                return; // Don't redirect, we're restoring the item
              }
            } catch (error) {
              console.error('Failed to restore buyNowItem:', error);
            }
          } else {
            return; // We have the item, don't redirect
          }
        }

        // Only redirect if we truly have no items and no buyNowItem in storage
        if (!checkoutItems || checkoutItems.length === 0) {
          router.push(`/${storeConfig.slug}`);
        }
      }, 400);

      return () => clearTimeout(redirectTimer);
    }
  }, [checkoutItems, isLoaded, isInitializing, router, storeConfig.slug, effectiveBuyNowItem, setBuyNowItem]);

  // Clear buyNowItem when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (effectiveBuyNowItem) {
        clearBuyNowItem();
      }
    };
  }, [effectiveBuyNowItem, clearBuyNowItem]);

  // Load saved addresses for authenticated users (runs on mount and when auth state changes)
  useEffect(() => {
    const loadAddresses = async () => {
      if (isAuthenticated) {
        setLoadingAddresses(true);
        try {
          const addresses = await customerService.getAddresses();
          setSavedAddresses(addresses);

          // Priority 1: Auto-select default address if available
          const defaultAddress = addresses.find(a => a.isDefault);
          if (defaultAddress) {
            handleAddressSelect(defaultAddress.id);
            return; // Don't pre-fill from profile if we have a saved address
          }

          // Priority 2: If no saved addresses, pre-fill from profile data
          if (addresses.length === 0 && user) {
            setFormData(prev => ({
              email: user.email || prev.email,
              firstName: user.firstName || prev.firstName,
              lastName: user.lastName || prev.lastName,
              phone: user.phone || prev.phone,
              address: user.address || prev.address,
              city: user.city || prev.city,
              country: user.country || prev.country || 'Nigeria',
              postalCode: user.zipCode || prev.postalCode,
            }));
          }
        } catch (error: any) {
          console.error('Failed to load addresses:', error);
          // Don't show error toast - addresses are optional
          // Guest users can still checkout without saved addresses

          // If address loading fails but user is authenticated, still try to pre-fill from profile
          if (user) {
            setFormData(prev => ({
              email: user.email || prev.email,
              firstName: user.firstName || prev.firstName,
              lastName: user.lastName || prev.lastName,
              phone: user.phone || prev.phone,
              address: user.address || prev.address,
              city: user.city || prev.city,
              country: user.country || prev.country || 'Nigeria',
              postalCode: user.zipCode || prev.postalCode,
            }));
          }
        } finally {
          setLoadingAddresses(false);
        }
      }
    };

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Pre-fill form data for authenticated users when no saved address is selected
  // This runs after addresses are loaded to ensure proper priority
  useEffect(() => {
    if (isAuthenticated && user && !selectedAddressId && savedAddresses.length === 0 && !loadingAddresses) {
      setFormData(prev => ({
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        country: user.country || prev.country || 'Nigeria',
        postalCode: user.zipCode || prev.postalCode,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, selectedAddressId, savedAddresses.length, loadingAddresses]);

  // Calculate shipping when address is filled
  const calculateShipping = async () => {
    if (!formData.city || !formData.country || checkoutItems.length === 0) {
      setShippingMethods([]);
      setSelectedShippingMethod(null);
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const result = await shippingService.calculateShipping({
        storeId: storeConfig.id,
        address: {
          country: formData.country,
          city: formData.city,
          zipCode: formData.postalCode,
        },
        items: checkoutItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        subtotal: subtotal,
        currency: currency,
      });

      // Filter out any methods with invalid costs before storing
      const validMethods = (result.methods || []).filter(
        method => Number.isFinite(method.cost) && method.cost >= 0
      );

      setShippingMethods(validMethods);
      setFreeShippingEligible(result.freeShippingEligible || false);
      setFreeShippingThreshold(result.freeShippingThreshold);

      // Auto-select first method or selected method, but only if it has valid cost
      if (validMethods.length > 0) {
        // Find the selected method in valid methods, or use first valid method
        const methodToSelect = result.selectedMethod &&
          validMethods.find(m => m.code === result.selectedMethod?.code)
          ? validMethods.find(m => m.code === result.selectedMethod?.code)
          : validMethods[0];

        if (methodToSelect) {
          setSelectedShippingMethod(methodToSelect);
        } else {
          setSelectedShippingMethod(null);
        }
      } else {
        setSelectedShippingMethod(null);
      }
    } catch (error: any) {
      console.error('Shipping calculation error:', error);
      setShippingError(error.message || 'Failed to calculate shipping. Please try again.');
      setShippingMethods([]);
      setSelectedShippingMethod(null);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Determine currency from checkout items or store config
  const getCurrency = (): string => {
    // Try to get currency from checkout items first
    if (checkoutItems.length > 0) {
      const itemCurrency = checkoutItems[0]?.product?.currency;
      if (itemCurrency) {
        return itemCurrency;
      }
    }
    // Fallback to store config currency
    return storeConfig.settings?.currency || 'USD';
  };

  const currency = getCurrency();

  // Calculations
  const subtotal = checkoutTotal;
  // Only use shipping cost if it's a valid number and from a properly selected method
  const shipping = (selectedShippingMethod &&
    Number.isFinite(selectedShippingMethod.cost) &&
    selectedShippingMethod.cost >= 0)
    ? selectedShippingMethod.cost
    : 0;

  // Calculate VAT using store configuration
  const vatAmount = calculateVAT(
    subtotal,
    storeConfig.settings?.vat,
    storeConfig.settings?.taxRate
  );
  const vatLabel = getVATLabel(storeConfig.settings?.vat, storeConfig.settings?.taxRate);
  
  // Service charges are calculated on backend only, not displayed to customers
  const total = subtotal + shipping + vatAmount;

  // Mock Form Data
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Nigeria',
    postalCode: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);


  // Debounced shipping calculation when address changes
  useEffect(() => {
    if (!formData.city || !formData.country || checkoutItems.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      calculateShipping();
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.city, formData.country, formData.postalCode, checkoutItems.length, subtotal, currency]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const handleApplyPromo = () => {
    if (!promoCode) return;
    setIsPromoApplied(true);
    addToast('Promo code applied successfully!', 'success');
  };

  // Handle address selection
  const handleAddressSelect = (addressId: string | null) => {
    if (addressId === null) {
      // "Add new address" selected - pre-fill with profile data if available, otherwise clear
      setFormData(prev => ({
        email: user?.email || prev.email,
        firstName: user?.firstName || prev.firstName,
        lastName: user?.lastName || prev.lastName,
        phone: user?.phone || prev.phone,
        address: user?.address || '',
        city: user?.city || '',
        country: user?.country || prev.country || 'Nigeria',
        postalCode: user?.zipCode || '',
      }));
      setSelectedAddressId(null);
      setSaveNewAddress(false);
      setAddressLabel('');
      return;
    }

    const address = savedAddresses.find(a => a.id === addressId);
    if (address) {
      setFormData(prev => ({
        ...prev,
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address1,
        city: address.city,
        country: address.country,
        postalCode: address.zipCode,
        phone: address.phone || prev.phone,
      }));
      setSelectedAddressId(addressId);
      setSaveNewAddress(false);
      setAddressLabel('');
    }
  };

  const validateCheckoutPreFlight = (): { isValid: boolean; error?: string } => {
    // Validate checkout items
    if (checkoutItems.length === 0) {
      return { isValid: false, error: 'No items to checkout' };
    }

    // Validate Payaza public key
    if (!payazaPublicKey) {
      return { isValid: false, error: 'Payment gateway not configured. Please contact support.' };
    }

    // Validate form data
    if (!formData.email) {
      return { isValid: false, error: 'Email is required' };
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return { isValid: false, error: 'Invalid email address' };
    }
    if (!formData.firstName) {
      return { isValid: false, error: 'First name is required' };
    }
    if (!formData.lastName) {
      return { isValid: false, error: 'Last name is required' };
    }
    if (!formData.address) {
      return { isValid: false, error: 'Address is required' };
    }
    if (!formData.city) {
      return { isValid: false, error: 'City is required' };
    }
    if (!formData.phone) {
      return { isValid: false, error: 'Phone is required' };
    }

    // Validate currency availability
    const hasCurrency = storeConfig.settings?.currency || checkoutItems.some(item => item.product.currency);
    if (!hasCurrency) {
      console.warn('[Checkout] No currency found, will use USD fallback');
    }

    return { isValid: true };
  };

  const handlePayazaCheckout = async () => {
    // Pre-flight validation
    const validation = validateCheckoutPreFlight();
    if (!validation.isValid) {
      addToast(validation.error || 'Please complete all required fields', 'error');
      return;
    }

    setLoading(true);

    // DEMO MODE BYPASS
    if (storeConfig.slug.startsWith('demo/')) {
      setTimeout(() => {
        router.push(`/${storeConfig.slug}/payment/callback?status=success&reference=DEMO-${Date.now()}`);
      }, 1500);
      return;
    }

    let checkoutResponse;
    let checkoutConfig;

    try {
      // Step 1: Create order via API before payment
      console.log('[Checkout] Step 1: Creating order via API', {
        storeId: storeConfig.id,
        itemCount: checkoutItems.length,
        customerEmail: formData.email,
      });

      try {
        checkoutResponse = await checkoutService.processCheckout({
          storeId: storeConfig.id,
          items: checkoutItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variantId: item.variantId,
          })),
          customerInfo: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
          },
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address,
            city: formData.city,
            state: formData.city || formData.country, // Use city as state fallback (form doesn't collect state field)
            zipCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
          },
          shippingMethod: selectedShippingMethod?.code,
          shippingCost: shipping, // Use validated shipping value
          paymentMethod: 'payaza',
          customerId: isAuthenticated && user ? user.id : undefined, // Pass customerId for authenticated users
        });

        console.log('[Checkout] Step 1: Order created successfully', {
          orderId: checkoutResponse.orderId,
          orderNumber: checkoutResponse.orderNumber,
          currency: checkoutResponse.currency,
          transactionReference: checkoutResponse.transactionReference,
        });
      } catch (apiError: any) {
        console.error('[Checkout] Step 1: API call failed', {
          error: apiError,
          message: apiError?.message,
          status: apiError?.status,
          data: apiError?.data,
          requestData: {
            storeId: storeConfig.id,
            itemCount: checkoutItems.length,
          },
        });

        if (apiError?.status === 0 || apiError?.code === 'ECONNABORTED' || apiError?.message?.includes('timeout')) {
          addToast('Unable to connect to server. Please check your internet connection.', 'error');
        } else if (apiError?.status === 500) {
          addToast('Server error occurred. Please try again later.', 'error');
        } else if (apiError?.status === 400) {
          addToast(apiError?.message || 'Invalid checkout data. Please review your information.', 'error');
        } else {
          addToast(apiError?.message || 'Failed to create order. Please try again.', 'error');
        }
        setLoading(false);
        return;
      }

      // Step 2: Convert checkout items to Payaza format
      console.log('[Checkout] Step 2: Converting checkout items to Payaza format');
      try {
        const payazaItems = checkoutItems.map(item => ({
          product: {
            name: item.product.name,
            price: item.price,
            currency: item.product.currency,
          },
          quantity: item.quantity,
          price: item.price,
        }));

        console.log('[Checkout] Step 2: Items converted', { itemCount: payazaItems.length });

        // Step 3: Generate Payaza checkout config with order details
        console.log('[Checkout] Step 3: Generating Payaza checkout config', {
          currency: checkoutResponse.currency || storeConfig.settings?.currency,
          orderId: checkoutResponse.orderId,
          orderNumber: checkoutResponse.orderNumber,
        });

        checkoutConfig = generateCheckoutConfig(
          payazaItems,
          formData.email,
          payazaPublicKey,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            callbackUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/${storeConfig.slug}/payment/callback?storeId=${storeConfig.id}`,
            currency: checkoutResponse.currency || storeConfig.settings?.currency,
            storeId: storeConfig.id,
            orderId: checkoutResponse.orderId,
            orderNumber: checkoutResponse.orderNumber,
            shippingAddress: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              city: formData.city,
              state: formData.city || formData.country, // Use city as state fallback (form doesn't collect state field)
              country: formData.country,
              zipCode: formData.postalCode,
            },
          }
        );

        console.log('[Checkout] Step 3: Checkout config generated', {
          amount: checkoutConfig.amount,
          currency: checkoutConfig.currency,
          reference: checkoutConfig.reference,
        });
      } catch (configError: any) {
        console.error('[Checkout] Step 2-3: Config generation failed', {
          error: configError,
          message: configError?.message,
          stack: configError?.stack,
        });
        addToast(configError?.message || 'Invalid checkout configuration. Please contact support.', 'error');
        setLoading(false);
        return;
      }

      // Step 4: Use transaction reference from order
      checkoutConfig.reference = checkoutResponse.transactionReference;
      console.log('[Checkout] Step 4: Transaction reference set', {
        reference: checkoutConfig.reference,
      });

      // Step 5: Save address if requested (for authenticated users)
      if (isAuthenticated && saveNewAddress && !selectedAddressId) {
        try {
          // Ensure required fields are never empty (backend validation requires non-empty values)
          const zipCode = formData.postalCode || formData.city || '00000';
          const state = formData.city || formData.country || 'N/A';

          const newAddress = await customerService.addAddress({
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address,
            address2: '',
            city: formData.city,
            state: state,
            zipCode: zipCode,
            country: formData.country,
            phone: formData.phone,
            isDefault: savedAddresses.length === 0, // Set as default if it's the first address
            label: addressLabel || undefined,
          });
          console.log('[Checkout] Address saved successfully');

          // Refresh addresses list
          const addresses = await customerService.getAddresses();
          setSavedAddresses(addresses);

          // Select the newly saved address (this will also sync the form with the saved address)
          handleAddressSelect(newAddress.id);
          addToast('Address saved successfully!', 'success');
        } catch (addressError: any) {
          console.error('[Checkout] Failed to save address:', addressError);
          addToast('Failed to save address. You can save it later from your account.', 'error');
          // Don't block checkout if address save fails - just log the error
          // User can save address later from their account
        }
      }

      // Step 6: Initiate Payaza checkout
      console.log('[Checkout] Step 6: Initiating Payaza checkout');
      try {
        await initiateCheckout(checkoutConfig);
        console.log('[Checkout] Step 6: Payaza checkout initiated successfully');

        // Clear buyNowItem after successful checkout initiation
        // The item has been processed and order created
        if (effectiveBuyNowItem) {
          clearBuyNowItem();
        }
      } catch (sdkError: any) {
        console.error('[Checkout] Step 5: Payaza SDK initiation failed', {
          error: sdkError,
          message: sdkError?.message,
          config: {
            amount: checkoutConfig.amount,
            currency: checkoutConfig.currency,
            publicKey: checkoutConfig.publicKey?.substring(0, 20) + '...',
          },
        });

        if (sdkError?.message?.includes('SDK not loaded') || sdkError?.message?.includes('PayazaCheckout')) {
          addToast('Payment system is loading. Please wait a moment and try again.', 'error');
        } else if (sdkError?.message?.includes('Currency')) {
          addToast('Invalid currency code. Please contact support.', 'error');
        } else {
          addToast('Payment popup failed to open. Please try again.', 'error');
        }
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('[Checkout] Unexpected error in checkout flow', {
        error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      });
      addToast('Failed to initiate checkout. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToast('Please fix the errors in the form.', 'error');
      // Scroll to the first error or top of form
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Show skeleton while initializing or if not loaded
  if (isInitializing || !isLoaded) {
    return <CheckoutSkeleton />;
  }

  // Show empty cart message if checkout items are empty (redirect will happen after delay)
  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="text-gray-600">
                Add some items to your cart before proceeding to checkout.
              </p>
              <div className="pt-4">
                <Link href={`/${storeConfig.slug}`}>
                  <Button 
                    size="lg" 
                    className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 h-auto font-semibold shadow-lg shadow-black/10 hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto max-w-6xl">

        {/* Header / Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <Link href={`/${storeConfig.slug}/cart`} className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium">
            <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:border-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Cart
          </Link>

          <div className="flex items-center gap-2 text-sm font-bold">
            <span className={cn("px-3 py-1.5 rounded-full transition-colors", step === 'details' ? "bg-black text-white" : "bg-green-100 text-green-700")}>
              {step === 'details' ? '1' : <CheckCircle className="w-4 h-4" />}
            </span>
            <span className={cn(step === 'details' ? "text-black" : "text-gray-500")}>Shipping</span>
            <div className="w-8 h-0.5 bg-gray-200" />
            <span className={cn("px-3 py-1.5 rounded-full transition-colors", step === 'payment' ? "bg-black text-white" : "bg-gray-200 text-gray-500")}>
              2
            </span>
            <span className={cn(step === 'payment' ? "text-black" : "text-gray-400")}>Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Form Section */}
          <div className="flex-1">
            {step === 'details' ? (
              <form onSubmit={handleDetailsSubmit} className="space-y-8 animate-fade-in">
                {/* Contact Information */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                  </div>

                  <div className="space-y-4">
                    {isAuthenticated && user ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Logged in as</p>
                          <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                          <input
                            type="email"
                            className={cn(
                              "w-full px-5 py-3.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-0 transition-all font-medium",
                              errors.email ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-black"
                            )}
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                          />
                          <p className="text-xs text-gray-500 ml-1">You can use a different email for this order</p>
                          {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <input
                          type="email"
                          className={cn(
                            "w-full px-5 py-3.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-0 transition-all font-medium",
                            errors.email ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-black"
                          )}
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
                      </div>
                    )}
                  </div>
                </section>

                {/* Shipping Address */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{storeConfig.settings?.shippingEnabled === false ? 'Billing Address' : 'Shipping Address'}</h2>
                  </div>

                  {/* Address Selector for Authenticated Users */}
                  {isAuthenticated && (
                    <AddressSelector
                      addresses={savedAddresses}
                      selectedAddressId={selectedAddressId}
                      onSelect={handleAddressSelect}
                      isLoading={loadingAddresses}
                      isAuthenticated={isAuthenticated}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                      <input
                        type="text"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none transition-all text-base",
                          errors.firstName ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-black"
                        )}
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs ml-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                      <input
                        type="text"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none transition-all text-base",
                          errors.lastName ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-black"
                        )}
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs ml-1">{errors.lastName}</p>}
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Address</label>
                      <input
                        type="text"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none transition-all text-base",
                          errors.address ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-black"
                        )}
                        placeholder="123 Main St"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                      />
                      {errors.address && <p className="text-red-500 text-xs ml-1">{errors.address}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">Country</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className={cn(
                            "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none transition-all text-left flex items-center justify-between text-base",
                            errors.country ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-black"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {(() => {
                              const selectedCountry = getCountryByName(formData.country);
                              return selectedCountry ? (
                                <>
                                  <span className="text-lg">{selectedCountry.flag}</span>
                                  <span>{selectedCountry.name}</span>
                                </>
                              ) : (
                                <span className="text-gray-400">Select country</span>
                              );
                            })()}
                          </span>
                          <ChevronDown className={cn(
                            "w-5 h-5 text-gray-400 transition-transform",
                            isCountryDropdownOpen && "transform rotate-180"
                          )} />
                        </button>
                        {isCountryDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsCountryDropdownOpen(false)}
                            />
                            <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                              {countries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, country: country.name, city: '' }); // Clear city when country changes
                                    setIsCountryDropdownOpen(false);
                                    setIsCityDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors",
                                    formData.country === country.name && "bg-gray-50 font-medium"
                                  )}
                                >
                                  <span className="text-lg">{country.flag}</span>
                                  <span>{country.name}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      {errors.country && <p className="text-red-500 text-xs ml-1">{errors.country}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.country) {
                              setIsCityDropdownOpen(!isCityDropdownOpen);
                            } else {
                              addToast('Please select a country first', 'error');
                            }
                          }}
                          disabled={!formData.country}
                          className={cn(
                            "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none transition-all text-left flex items-center justify-between text-base",
                            errors.city ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-black",
                            !formData.country && "bg-gray-50 text-gray-400 cursor-not-allowed"
                          )}
                        >
                          <span className={formData.city ? "text-gray-900" : "text-gray-400"}>
                            {formData.city || 'Select city'}
                          </span>
                          <ChevronDown className={cn(
                            "w-5 h-5 text-gray-400 transition-transform",
                            isCityDropdownOpen && "transform rotate-180"
                          )} />
                        </button>
                        {isCityDropdownOpen && formData.country && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsCityDropdownOpen(false)}
                            />
                            <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                              {getCitiesByCountry(formData.country).length > 0 ? (
                                getCitiesByCountry(formData.country).map((city) => (
                                  <button
                                    key={city}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, city });
                                      setIsCityDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors",
                                      formData.city === city && "bg-gray-50 font-medium"
                                    )}
                                  >
                                    {city}
                                  </button>
                                ))
                              ) : (
                                <div className="px-5 py-3 text-gray-500 text-sm">
                                  No cities available for this country
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {errors.city && <p className="text-red-500 text-xs ml-1">{errors.city}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">Postal/Zip Code</label>
                      <input
                        type="text"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none transition-all text-base",
                          errors.postalCode ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-black"
                        )}
                        placeholder="Optional"
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs ml-1">{errors.postalCode}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">Phone</label>
                      <input
                        type="tel"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:outline-none transition-all text-base",
                          errors.phone ? "border-red-300 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-black"
                        )}
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Save Address Option for Authenticated Users */}
                  {isAuthenticated && !selectedAddressId && (
                    <div className="mt-6 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={saveNewAddress}
                          onChange={(e) => setSaveNewAddress(e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-black focus:ring-2 focus:ring-black cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                          Save this address for future use
                        </span>
                      </label>
                      {saveNewAddress && (
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-gray-700 ml-1">Address Label (optional)</label>
                          <input
                            type="text"
                            value={addressLabel}
                            onChange={(e) => setAddressLabel(e.target.value)}
                            placeholder="e.g., Home, Work, Office"
                            className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-0 focus:border-black transition-all font-medium"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* Shipping Method Selection */}
                {storeConfig.settings?.shippingEnabled !== false && (formData.city && formData.country) && (
                  <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <Truck className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Shipping Method</h2>
                    </div>

                    {/* Free Shipping Progress */}
                    {freeShippingThreshold !== undefined && !freeShippingEligible && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 mb-1">
                          Spend {formatCurrency(freeShippingThreshold - subtotal, currency)} more for free shipping!
                        </p>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {isCalculatingShipping ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                          <span className="text-sm font-medium">Calculating shipping options...</span>
                        </div>
                      </div>
                    ) : shippingError ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{shippingError}</p>
                      </div>
                    ) : shippingMethods.length > 0 ? (
                      <div className="space-y-3">
                        {shippingMethods.map((method) => (
                          <label
                            key={method.code}
                            className={cn(
                              "flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all",
                              selectedShippingMethod?.code === method.code
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            )}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <input
                                type="radio"
                                name="shippingMethod"
                                value={method.code}
                                checked={selectedShippingMethod?.code === method.code}
                                onChange={() => setSelectedShippingMethod(method)}
                                className="w-5 h-5 text-black focus:ring-2 focus:ring-black cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-900">{method.name}</p>
                                  {freeShippingEligible && method.cost === 0 && (
                                    <span className="text-xs font-normal text-green-700 bg-green-100 px-2 py-0.5 rounded-full">FREE</span>
                                  )}
                                </div>
                                {method.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                                )}
                                {method.estimatedDays && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {method.estimatedDaysMin && method.estimatedDaysMax
                                      ? `Estimated delivery: ${method.estimatedDaysMin}-${method.estimatedDaysMax} business days`
                                      : `Estimated delivery: ${method.estimatedDays} business days`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {freeShippingEligible && method.cost === 0
                                  ? 'FREE'
                                  : Number.isFinite(method.cost) && method.cost >= 0
                                    ? formatCurrency(method.cost, currency)
                                    : 'Not available'}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                        <p className="text-sm text-gray-600">No shipping methods available. Please check your address.</p>
                      </div>
                    )}
                  </section>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Continue to Payment <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            ) : (
              <div className="space-y-8 animate-fade-in">
                {/* Review Shipping */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-gray-300 transition-colors cursor-pointer" onClick={() => setStep('details')}>
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Shipping To</p>
                      <p className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-gray-500">{formData.address}, {formData.city}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 px-4 py-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">Edit</span>
                </section>

                {/* Secure Payment Info */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Security</h2>
                  </div>

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
                </section>

                <Button
                  onClick={handlePayazaCheckout}
                  size="lg"
                  className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: primaryColor }}
                  disabled={loading || isPayazaLoading}
                >
                  {loading || isPayazaLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing Securely...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      <span>Pay Now</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-8">
              <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto scrollbar-hide">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-200">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">x{item.quantity}</span>
                    </div>
                    <div className="flex-1 py-1">
                      <p className="font-bold text-gray-900 text-sm line-clamp-2 leading-relaxed">{item.product.name}</p>
                      {item.variantName && <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>}
                      <p className="text-gray-500 text-sm font-medium mt-1">{formatCurrency(normalizePrice(item.price), item.product?.currency || currency)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t-2 border-gray-50">
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Shipping{selectedShippingMethod ? ` (${selectedShippingMethod.name})` : ''}</span>
                  <span className="text-gray-900 font-bold">
                    {isCalculatingShipping ? (
                      <span className="text-gray-400">Calculating...</span>
                    ) : !selectedShippingMethod ? (
                      <span className="text-gray-400">Not available</span>
                    ) : shipping === 0 && freeShippingEligible ? (
                      <span className="text-green-600">Free</span>
                    ) : shipping === 0 ? (
                      'Free'
                    ) : Number.isFinite(shipping) && shipping > 0 ? (
                      formatCurrency(shipping, currency)
                    ) : (
                      <span className="text-gray-400">Not available</span>
                    )}
                  </span>
                </div>
                {vatAmount > 0 && (
                  <div className="flex justify-between text-gray-500 font-medium text-sm">
                    <span>{vatLabel}</span>
                    <span className="text-gray-900 font-bold">{formatCurrency(vatAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-gray-100">
                  <span className="text-base font-bold text-gray-900">Total to pay</span>
                  <span className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(total, currency)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 opacity-50 grayscale">
                {/* Visual placeholders for card logos */}
                <div className="h-8 bg-gray-100 rounded border border-gray-200" />
                <div className="h-8 bg-gray-100 rounded border border-gray-200" />
                <div className="h-8 bg-gray-100 rounded border border-gray-200" />
              </div>
            </div>

            {/* Promo Code - NEW UI */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mt-6 sticky top-[500px]">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Have a promo code?
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all uppercase placeholder:normal-case font-medium"
                />
                <Button
                  onClick={handleApplyPromo}
                  disabled={!promoCode || isPromoApplied}
                  className="bg-black text-white rounded-xl"
                  style={isPromoApplied ? { backgroundColor: '#22c55e' } : {}}
                >
                  {isPromoApplied ? 'Applied' : 'Apply'}
                </Button>
              </div>
              {isPromoApplied && (
                <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Discount applied to total
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

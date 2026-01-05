/**
 * Payaza Checkout SDK Integration
 * Based on Payaza Web SDK documentation: https://docs.payaza.africa/developers/apis/sdks/web-sdk
 * 
 * Implementation uses script tag: https://checkout-v2.payaza.africa/js/v1/bundle.js
 * Method: PayazaCheckout.setup(config).showPopup()
 */

export interface PayazaCheckoutConfig {
  publicKey: string;
  amount: number;
  currency?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  reference?: string;
  description?: string;
  callbackUrl?: string;
  storeId?: string;
  orderId?: string;
  orderNumber?: string;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  metadata?: Record<string, unknown>;
  onSuccess?: (response: PayazaCheckoutResponse) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

export interface PayazaCurrency {
  name: string;
  code: string;
  unicode: string;
  html_value: string;
  enabled: boolean;
}

export interface PayazaCustomer {
  customer_id: string;
  email_address: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
}

export interface PayazaSuccessData {
  message: string;
  payaza_reference: string;
  transaction_reference: string;
  transaction_fee: number;
  transaction_total_amount: number;
  currency: PayazaCurrency;
  customer: PayazaCustomer;
}

export interface PayazaSuccessCallback {
  type: 'success';
  status: number;
  data: PayazaSuccessData;
}

export interface PayazaCheckoutResponse {
  status: 'success' | 'error';
  message?: string;
  transactionRef?: string;
  checkoutUrl?: string;
  // Full callback data for successful transactions
  callbackData?: PayazaSuccessCallback;
}

interface PayazaCheckoutSetupConfig {
  merchant_key: string;
  connection_mode: 'Live' | 'Test';
  checkout_amount: number;
  currency_code: string;
  email_address: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  transaction_reference: string;
  country_code?: string; // BEN or CIV for CIV/BEN Collections
  virtual_account_configuration?: {
    expires_in_minutes?: number;
  };
  additional_details?: Record<string, unknown>;
}

interface PayazaCheckoutInstance {
  setCallback: (callback: (response: { transactionRef?: string; reference?: string; [key: string]: unknown }) => void) => void;
  setOnClose: (onClose: () => void) => void;
  showPopup: () => void;
}

declare global {
  interface Window {
    PayazaCheckout?: {
      setup: (config: PayazaCheckoutSetupConfig) => PayazaCheckoutInstance;
    };
  }
}

/**
 * Load Payaza SDK script dynamically
 */
export const loadPayazaSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.PayazaCheckout && typeof window.PayazaCheckout.setup === 'function') {
      console.log('Payaza SDK already loaded');
      resolve();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="payaza"]');
    if (existingScript) {
      console.log('Payaza script already in DOM, waiting for load...');
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.PayazaCheckout && typeof window.PayazaCheckout.setup === 'function') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      existingScript.addEventListener('load', () => {
        clearInterval(checkInterval);
        // Give SDK time to initialize
        setTimeout(() => {
          console.log('Existing script loaded, SDK available:', !!(window.PayazaCheckout && typeof window.PayazaCheckout.setup === 'function'));
          resolve();
        }, 300);
      });
      existingScript.addEventListener('error', () => {
        clearInterval(checkInterval);
        reject(new Error('Failed to load Payaza SDK from existing script'));
      });
      return;
    }

    // Payaza SDK script URL (from official documentation)
    const sdkUrl = 'https://checkout-v2.payaza.africa/js/v1/bundle.js';

    // Load the Payaza SDK script
    const script = document.createElement('script');
    script.src = sdkUrl;
    script.defer = true;
    
    script.onload = () => {
      console.log('Payaza SDK script loaded, waiting for initialization...');
      // Wait for SDK to initialize
      const checkInterval = setInterval(() => {
        if (window.PayazaCheckout && typeof window.PayazaCheckout.setup === 'function') {
          clearInterval(checkInterval);
          console.log('Payaza SDK initialized successfully');
          resolve();
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.PayazaCheckout && typeof window.PayazaCheckout.setup === 'function') {
          resolve();
        } else {
          reject(new Error('Payaza SDK loaded but PayazaCheckout.setup not found'));
        }
      }, 5000);
    };
    
    script.onerror = () => {
      reject(new Error(`Failed to load Payaza SDK from ${sdkUrl}`));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Validate and normalize currency to ISO 4217 format (3-letter uppercase code)
 * @param currency - Currency code to validate
 * @returns Validated uppercase ISO 4217 currency code
 * @throws Error if currency cannot be normalized to valid ISO format
 */
export function validateAndNormalizeCurrency(currency: string | null | undefined): string {
  if (!currency || typeof currency !== 'string') {
    throw new Error('Currency is required and must be a string');
  }

  // Normalize: trim whitespace and convert to uppercase
  const normalized = currency.trim().toUpperCase();

  // Validate: must be exactly 3 uppercase letters (ISO 4217 format)
  const iso4217Pattern = /^[A-Z]{3}$/;
  if (!iso4217Pattern.test(normalized)) {
    throw new Error(`Invalid currency format: "${currency}". Must be a 3-letter ISO 4217 code (e.g., USD, NGN, KES, GHS)`);
  }

  return normalized;
}

/**
 * Validate and normalize currency with fallback
 * @param currency - Currency code to validate
 * @param fallback - Fallback currency if validation fails (default: 'USD')
 * @returns Validated uppercase ISO 4217 currency code or fallback
 */
export function validateAndNormalizeCurrencyWithFallback(
  currency: string | null | undefined,
  fallback: string = 'USD'
): string {
  try {
    return validateAndNormalizeCurrency(currency);
  } catch (error) {
    console.warn(`[Currency] Invalid currency "${currency}", using fallback "${fallback}":`, error);
    try {
      return validateAndNormalizeCurrency(fallback);
    } catch (fallbackError) {
      console.error(`[Currency] Fallback currency "${fallback}" is also invalid, using USD`);
      return 'USD';
    }
  }
}

/**
 * Extract currency from items with fallback logic
 * Handles mixed currencies by using the most common currency, or first item's currency
 * All currencies are validated and normalized to ISO 4217 format
 */
export function getCurrencyFromItems(
  items: Array<{ product?: { currency?: string } }>,
  fallbackCurrency?: string
): string {
  if (!items || items.length === 0) {
    return validateAndNormalizeCurrencyWithFallback(fallbackCurrency, 'USD');
  }

  // Extract currencies from items and validate/normalize them
  const currencies: string[] = [];
  for (const item of items) {
    if (item.product?.currency) {
      try {
        const validated = validateAndNormalizeCurrency(item.product.currency);
        currencies.push(validated);
      } catch (error) {
        console.warn(`[Currency] Invalid currency "${item.product.currency}" in product, skipping:`, error);
      }
    }
  }

  if (currencies.length === 0) {
    return validateAndNormalizeCurrencyWithFallback(fallbackCurrency, 'USD');
  }

  // If all items have the same currency, use it
  const uniqueCurrencies = [...new Set(currencies)];
  if (uniqueCurrencies.length === 1) {
    return uniqueCurrencies[0];
  }

  // If mixed currencies, find the most common one
  const currencyCounts: Record<string, number> = {};
  currencies.forEach(currency => {
    currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
  });

  const mostCommonCurrency = Object.entries(currencyCounts).reduce((a, b) =>
    currencyCounts[a[0]] > currencyCounts[b[0]] ? a : b
  )[0];

  return mostCommonCurrency;
}

/**
 * Initialize Payaza checkout using SDK
 * Uses PayazaCheckout.setup() method as per official documentation
 */
export const initiatePayazaCheckout = async (
  config: PayazaCheckoutConfig
): Promise<PayazaCheckoutResponse> => {
  try {
    // Validate currency before proceeding
    if (!config.currency) {
      throw new Error('Currency is required for Payaza checkout');
    }

    // Validate and normalize currency to ISO 4217 format
    let validatedCurrency: string;
    try {
      validatedCurrency = validateAndNormalizeCurrency(config.currency);
    } catch (error) {
      throw new Error(`Invalid currency code: ${config.currency}. Currency must be a valid 3-letter ISO 4217 code (e.g., USD, NGN, KES, GHS)`);
    }

    // Load SDK if not already loaded with timeout
    const SDK_LOAD_TIMEOUT = 10000; // 10 seconds
    const loadPromise = loadPayazaSDK();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Payaza SDK loading timeout. Please check your internet connection and try again.')), SDK_LOAD_TIMEOUT)
    );

    try {
      await Promise.race([loadPromise, timeoutPromise]);
    } catch (loadError: any) {
      if (loadError?.message?.includes('timeout')) {
        throw new Error('Payment system is loading. Please wait a moment and try again.');
      }
      throw new Error(`Failed to load payment system: ${loadError?.message || 'Unknown error'}`);
    }

    // Wait a bit for SDK to initialize
    await new Promise(resolve => setTimeout(resolve, 200));

    // Generate transaction reference
    const reference = config.reference || `PL${Math.floor((Math.random() * 10000000) + 1)}`;

    // Use PayazaCheckout.setup() method (official implementation)
    if (!window.PayazaCheckout || typeof window.PayazaCheckout.setup !== 'function') {
      throw new Error('Payaza SDK not loaded. PayazaCheckout.setup is not available. Please refresh the page and try again.');
    }

    // Determine connection mode from public key
    const connectionMode = config.publicKey.includes('PKLIVE') ? 'Live' : 'Test';

    // Build comprehensive additional_details metadata
    // This data will be available in Payaza webhooks and transaction responses
    const additionalDetails: Record<string, unknown> = {
      // Merge any custom metadata first
      ...(config.metadata || {}),
    };

    // Core order identifiers
    if (config.storeId) {
      additionalDetails.storeId = config.storeId;
    }
    if (config.orderId) {
      additionalDetails.orderId = config.orderId;
    }
    if (config.orderNumber) {
      additionalDetails.orderNumber = config.orderNumber;
    }
    
    // Customer information
    if (config.email) {
      additionalDetails.customerEmail = config.email;
    }
    if (config.firstName) {
      additionalDetails.customerFirstName = config.firstName;
    }
    if (config.lastName) {
      additionalDetails.customerLastName = config.lastName;
    }
    if (config.phone) {
      additionalDetails.customerPhone = config.phone;
    }
    
    // Shipping address information
    if (config.shippingAddress) {
      additionalDetails.shippingAddress = {
        firstName: config.shippingAddress.firstName,
        lastName: config.shippingAddress.lastName,
        address: config.shippingAddress.address,
        city: config.shippingAddress.city,
        state: config.shippingAddress.state,
        country: config.shippingAddress.country,
        zipCode: config.shippingAddress.zipCode,
      };
    }
    
    // Transaction details
    additionalDetails.amount = config.amount;
    additionalDetails.currency = validatedCurrency;
    if (config.description) {
      additionalDetails.description = config.description;
    }
    
    // Timestamp for tracking
    additionalDetails.timestamp = new Date().toISOString();

    // Setup Payaza checkout with correct configuration
    // Ensure currency_code is validated ISO 4217 format
    const payazaConfig: PayazaCheckoutSetupConfig = {
      merchant_key: config.publicKey,
      connection_mode: connectionMode,
      checkout_amount: config.amount,
      currency_code: validatedCurrency, // Use validated ISO 4217 currency code
      email_address: config.email,
      first_name: config.firstName,
      last_name: config.lastName,
      phone_number: config.phone,
      transaction_reference: reference,
      additional_details: additionalDetails,
    };

    // Create checkout instance
    const payazaCheckout = window.PayazaCheckout.setup(payazaConfig);

    // Track payment success state to prevent misleading "Payment canceled" message
    // when checkout window closes after successful payment
    let paymentSuccessful = false;

    // Set callback for payment response
    payazaCheckout.setCallback((callbackResponse: { transactionRef?: string; reference?: string; type?: string; status?: number; data?: PayazaSuccessData; [key: string]: unknown }) => {
      // TO BE REMOVED FOR PRODUCTION - Temporary logging for debugging
      console.log('=== PAYAZA CHECKOUT SDK CALLBACK DATA (TO BE REMOVED FOR PRODUCTION) ===');
      console.log('Full callback response:', JSON.stringify(callbackResponse, null, 2));
      console.log('=== END OF CALLBACK DATA ===');
      
      // Parse the callback response structure
      // Payaza returns: { type: "success", status: 201, data: { ... } }
      const isSuccessResponse = callbackResponse.type === 'success' || 
                                (callbackResponse.status !== undefined && callbackResponse.status >= 200 && callbackResponse.status < 300);
      
      if (isSuccessResponse && callbackResponse.data) {
        // Full success response with transaction details
        const successData = callbackResponse.data as PayazaSuccessData;
        const transactionRef = successData.transaction_reference || 
                              callbackResponse.transactionRef || 
                              callbackResponse.reference || 
                              reference;
        
        const fullCallback: PayazaSuccessCallback = {
          type: callbackResponse.type as 'success' || 'success',
          status: callbackResponse.status || 201,
          data: successData,
        };
        
        console.log('[Payaza Callback] Transaction successful:', {
          transactionRef,
          payazaReference: successData.payaza_reference,
          amount: successData.transaction_total_amount,
          fee: successData.transaction_fee,
          currency: successData.currency?.code,
        });
        
        // Mark payment as successful BEFORE calling onSuccess
        // This ensures onClose knows payment succeeded even if it fires immediately after
        paymentSuccessful = true;
        
        // Call the success handler with full callback data
        if (config.onSuccess) {
          config.onSuccess({
            status: 'success',
            transactionRef,
            message: successData.message || 'Payment successful',
            callbackData: fullCallback,
          });
        }
      } else if (isSuccessResponse) {
        // Fallback for older callback format or minimal response
        const transactionRef = callbackResponse.transactionRef || 
                              callbackResponse.reference || 
                              reference;
        
        console.log('[Payaza Callback] Transaction reference:', transactionRef);
        
        // Mark payment as successful
        paymentSuccessful = true;
        
        // Call the success handler if provided
        if (config.onSuccess) {
          config.onSuccess({
            status: 'success',
            transactionRef,
            message: 'Payment successful',
          });
        }
      }
    });

    // Set onClose handler
    // Only call onClose if payment was not successful (user actually canceled)
    payazaCheckout.setOnClose(() => {
      console.log('Payaza checkout closed', { paymentSuccessful });
      // Only call onClose if payment was not successful
      // This prevents misleading "Payment canceled" message when payment succeeds
      if (!paymentSuccessful && config.onClose) {
        config.onClose();
      }
      // Reset flag for next checkout (if user opens checkout again)
      paymentSuccessful = false;
    });

    // Show the popup
    payazaCheckout.showPopup();

    // Return success - actual payment status comes via callback
    return {
      status: 'success',
      transactionRef: reference,
      message: 'Checkout popup opened',
    };
  } catch (error) {
    console.error('Payaza checkout error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to initialize checkout',
    };
  }
};

/**
 * Generate checkout config from cart items
 */
export const generateCheckoutConfig = (
  items: Array<{ product: { name: string; price: number; currency?: string }; quantity: number; price: number }>,
  customerEmail: string,
  publicKey: string,
  options?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    callbackUrl?: string;
    currency?: string; // Optional currency override, otherwise extracted from items
    storeId?: string;
    orderId?: string;
    orderNumber?: string;
    shippingAddress?: {
      firstName?: string;
      lastName?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  }
): PayazaCheckoutConfig => {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Extract currency from items or use provided currency with fallback chain
  // Fallback chain: options.currency → getCurrencyFromItems() → 'USD'
  // CRITICAL: Payaza only accepts ISO 4217 currency codes (e.g., 'NGN', 'USD'), NOT currency symbols (e.g., '₦', '$')
  // All currency values must be validated and normalized to ISO format before use
  let currency: string;
  try {
    if (options?.currency) {
      // Validate that provided currency is an ISO code, not a symbol
      currency = validateAndNormalizeCurrency(options.currency);
    } else {
      // Try to get currency from items
      const itemsCurrency = getCurrencyFromItems(items);
      currency = validateAndNormalizeCurrency(itemsCurrency);
    }
    
    // Double-check: Ensure currency is a valid 3-letter ISO code
    if (!currency || currency.length !== 3 || !/^[A-Z]{3}$/.test(currency)) {
      throw new Error(`Invalid currency format: "${currency}". Must be a 3-letter ISO 4217 code.`);
    }
  } catch (error: any) {
    console.error('[Checkout Config] Currency validation failed:', {
      providedCurrency: options?.currency,
      error: error?.message,
      fallback: 'USD'
    });
    // Always fallback to USD if validation fails
    currency = 'USD';
  }

  // Build comprehensive payer description
  const customerName = options?.firstName && options?.lastName
    ? `${options.firstName} ${options.lastName}`
    : options?.firstName || options?.lastName || 'Customer';

  // Build shipping address string
  const shippingParts: string[] = [];
  if (options?.shippingAddress) {
    const addr = options.shippingAddress;
    if (addr.address) shippingParts.push(addr.address);
    if (addr.city) shippingParts.push(addr.city);
    if (addr.state) shippingParts.push(addr.state);
    if (addr.zipCode) shippingParts.push(addr.zipCode);
    if (addr.country) shippingParts.push(addr.country);
  }
  const shippingAddressStr = shippingParts.length > 0 ? shippingParts.join(', ') : 'Not provided';

  // Build comprehensive description
  let description = '';
  if (options?.orderNumber) {
    description = `Order #${options.orderNumber} - ${customerName} (${customerEmail})\n`;
  } else {
    description = `Order - ${customerName} (${customerEmail})\n`;
  }
  description += `Items: ${itemCount} | Total: ${currency} ${totalAmount.toFixed(2)}\n`;
  description += `Shipping: ${shippingAddressStr}`;

  // Truncate if too long (Payaza may have limits)
  const maxDescriptionLength = 500;
  if (description.length > maxDescriptionLength) {
    description = description.substring(0, maxDescriptionLength - 3) + '...';
  }

  return {
    publicKey,
    amount: totalAmount,
    currency,
    email: customerEmail,
    firstName: options?.firstName,
    lastName: options?.lastName,
    phone: options?.phone,
    description,
    callbackUrl: options?.callbackUrl,
    storeId: options?.storeId,
    orderId: options?.orderId,
    orderNumber: options?.orderNumber,
    shippingAddress: options?.shippingAddress,
    metadata: {
      // Cart items information
      items: items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        currency: item.product.currency,
      })),
      // Order summary
      itemCount: itemCount,
      totalAmount: totalAmount,
      // Customer information
      customerName: customerName,
      customerEmail: customerEmail,
      // Shipping information
      shippingAddress: shippingAddressStr,
    },
  };
};

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
    country_code?: string;
    virtual_account_configuration?: {
        expires_in_minutes?: number;
    };
    additional_details?: Record<string, unknown>;
}
interface PayazaCheckoutInstance {
    setCallback: (callback: (response: {
        transactionRef?: string;
        reference?: string;
        [key: string]: unknown;
    }) => void) => void;
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
export declare const loadPayazaSDK: () => Promise<void>;
/**
 * Validate and normalize currency to ISO 4217 format (3-letter uppercase code)
 * @param currency - Currency code to validate
 * @returns Validated uppercase ISO 4217 currency code
 * @throws Error if currency cannot be normalized to valid ISO format
 */
export declare function validateAndNormalizeCurrency(currency: string | null | undefined): string;
/**
 * Validate and normalize currency with fallback
 * @param currency - Currency code to validate
 * @param fallback - Fallback currency if validation fails (default: 'USD')
 * @returns Validated uppercase ISO 4217 currency code or fallback
 */
export declare function validateAndNormalizeCurrencyWithFallback(currency: string | null | undefined, fallback?: string): string;
/**
 * Extract currency from items with fallback logic
 * Handles mixed currencies by using the most common currency, or first item's currency
 * All currencies are validated and normalized to ISO 4217 format
 */
export declare function getCurrencyFromItems(items: Array<{
    product?: {
        currency?: string;
    };
}>, fallbackCurrency?: string): string;
/**
 * Initialize Payaza checkout using SDK
 * Uses PayazaCheckout.setup() method as per official documentation
 */
export declare const initiatePayazaCheckout: (config: PayazaCheckoutConfig) => Promise<PayazaCheckoutResponse>;
/**
 * Generate checkout config from cart items
 */
export declare const generateCheckoutConfig: (items: Array<{
    product: {
        name: string;
        price: number;
        currency?: string;
    };
    quantity: number;
    price: number;
}>, customerEmail: string, publicKey: string, options?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    callbackUrl?: string;
    currency?: string;
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
}) => PayazaCheckoutConfig;
export {};
//# sourceMappingURL=payaza-checkout.d.ts.map
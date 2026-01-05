import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCurrencySymbolInfo, getCurrencySymbol } from "../../lib/currency-symbols";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Normalizes a price value to a number
 * Handles string, number, null, undefined, and invalid values
 */
export function normalizePrice(price) {
    if (typeof price === 'number') {
        return isNaN(price) ? 0 : price;
    }
    if (typeof price === 'string') {
        const parsed = parseFloat(price);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}
/**
 * Formats a price amount with the correct currency symbol and code
 * Uses explicit currency symbol mapping for accurate symbol display
 * @param amount - The price amount to format
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'NGN', 'EUR')
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "$1,234.56" or "₦1,234.56")
 */
export function formatCurrency(amount, currencyCode, options) {
    // Normalize the amount first
    const normalizedAmount = normalizePrice(amount);
    // Default to USD if currency code is invalid or missing
    const validCurrencyCode = currencyCode && typeof currencyCode === 'string' && currencyCode.length === 3
        ? currencyCode.toUpperCase()
        : 'USD';
    // Get currency symbol information from our mapping
    const currencyInfo = getCurrencySymbolInfo(validCurrencyCode);
    if (currencyInfo) {
        // Use our explicit currency symbol mapping
        // Determine decimal places: use provided options, or fall back to currency's standard decimal places
        const defaultDecimalPlaces = currencyInfo.decimalPlaces;
        const minFractionDigits = options?.minimumFractionDigits ?? (defaultDecimalPlaces === 0 ? 0 : defaultDecimalPlaces);
        const maxFractionDigits = options?.maximumFractionDigits ?? defaultDecimalPlaces;
        // Format the number using Intl.NumberFormat (for thousands separators, decimal formatting)
        // But don't use style: 'currency' since we'll add the symbol ourselves
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minFractionDigits,
            maximumFractionDigits: maxFractionDigits,
        });
        const formattedNumber = formatter.format(normalizedAmount);
        // Position the symbol based on currency convention
        if (currencyInfo.position === 'prefix') {
            return `${currencyInfo.symbol}${formattedNumber}`;
        }
        else {
            return `${formattedNumber} ${currencyInfo.symbol}`;
        }
    }
    // Fallback: Use Intl.NumberFormat if currency not in our mapping
    // This handles edge cases and ensures we always return a formatted value
    try {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: validCurrencyCode,
            minimumFractionDigits: options?.minimumFractionDigits ?? 2,
            maximumFractionDigits: options?.maximumFractionDigits ?? 2,
        });
        return formatter.format(normalizedAmount);
    }
    catch (error) {
        // Final fallback: Use symbol from mapping or currency code itself
        const fallbackSymbol = getCurrencySymbol(validCurrencyCode, validCurrencyCode);
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: options?.minimumFractionDigits ?? 2,
            maximumFractionDigits: options?.maximumFractionDigits ?? 2,
        });
        const formattedNumber = formatter.format(normalizedAmount);
        return `${fallbackSymbol}${formattedNumber}`;
    }
}
/**
 * Converts API errors to user-friendly messages
 */
export function getUserFriendlyErrorMessage(error, defaultMessage = 'Something went wrong. Please try again.') {
    // Handle network errors
    if (!error.response) {
        if (error.message?.includes('timeout')) {
            return 'Request timed out. Please check your connection and try again.';
        }
        if (error.message?.includes('Network Error') || error.code === 'ECONNABORTED') {
            return 'Network error. Please check your internet connection and try again.';
        }
        return defaultMessage;
    }
    // Handle HTTP status codes
    const status = error.response?.status;
    const errorData = error.response?.data;
    switch (status) {
        case 400:
            return errorData?.message || 'Invalid request. Please check your input and try again.';
        case 401:
            return 'You need to be logged in to perform this action.';
        case 403:
            return 'You do not have permission to perform this action.';
        case 404:
            return errorData?.message || 'The requested resource was not found.';
        case 409:
            return errorData?.message || 'This action conflicts with existing data.';
        case 422:
            return errorData?.message || 'Validation error. Please check your input.';
        case 429:
            return 'Too many requests. Please wait a moment and try again.';
        case 500:
            return 'Server error. Please try again later.';
        case 502:
        case 503:
        case 504:
            return 'Service temporarily unavailable. Please try again later.';
        default:
            return errorData?.message || error.message || defaultMessage;
    }
}
/**
 * Filters out inactive or deleted products
 * Excludes products where isActive === false OR status === 'inactive' OR status === 'draft'
 * If isActive/status are undefined (mock data), includes the product for backward compatibility
 */
export function filterActiveProducts(products) {
    return products.filter((product) => {
        // If isActive is explicitly false, exclude
        if (product.isActive === false) {
            return false;
        }
        // If status is 'inactive' or 'draft', exclude
        if (product.status === 'inactive' || product.status === 'draft') {
            return false;
        }
        // Include if isActive is true, status is 'active', or both are undefined (backward compatibility)
        return true;
    });
}
/**
 * Filters out inactive or deleted services
 * Excludes services where isActive === false OR status === 'inactive' OR status === 'draft'
 * If isActive/status are undefined (mock data), includes the service for backward compatibility
 */
export function filterActiveServices(services) {
    return services.filter((service) => {
        // If isActive is explicitly false, exclude
        if (service.isActive === false) {
            return false;
        }
        // If status is 'inactive' or 'draft', exclude
        if (service.status === 'inactive' || service.status === 'draft') {
            return false;
        }
        // Include if isActive is true, status is 'active', or both are undefined (backward compatibility)
        return true;
    });
}

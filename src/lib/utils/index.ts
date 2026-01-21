import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCurrencySymbolInfo, getCurrencySymbol } from "@/lib/currency-symbols"
import { StoreProduct, StoreService } from "@/lib/store-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a price value to a number
 * Handles string, number, null, undefined, and invalid values
 */
export function normalizePrice(price: any): number {
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
export function formatCurrency(
  amount: number | string | null | undefined,
  currencyCode?: string | null | undefined,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
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
    } else {
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
  } catch (error) {
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
export function getUserFriendlyErrorMessage(error: any, defaultMessage: string = 'Something went wrong. Please try again.'): string {
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
export function filterActiveProducts(products: StoreProduct[]): StoreProduct[] {
  if (!products || !Array.isArray(products)) {
    return [];
  }
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

export function filterActiveServices(services: StoreService[]): StoreService[] {
  if (!services || !Array.isArray(services)) {
    return [];
  }
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

/**
 * Deep clones an object using structuredClone if available, or a fallback recursive clone.
 * This is more efficient and handles more types than JSON.parse(JSON.stringify).
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(obj);
    } catch (e) {
      // Fallback if structuredClone fails (e.g. for some non-serializable objects)
    }
  }

  // Fallback recursive clone
  if (Array.isArray(obj)) {
    const copy = [] as any[];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy as any as T;
  }

  const copy = {} as any;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone((obj as any)[key]);
    }
  }
  return copy as T;
}

/**
 * Checks if two objects are deeply equal without using JSON.stringify.
 * Optimized for performance by doing early exits and avoiding stringification.
 */
export function isDeepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

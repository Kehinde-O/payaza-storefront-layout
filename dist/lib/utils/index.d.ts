import { type ClassValue } from "clsx";
import { StoreProduct, StoreService } from "../../lib/store-types";
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Normalizes a price value to a number
 * Handles string, number, null, undefined, and invalid values
 */
export declare function normalizePrice(price: any): number;
/**
 * Formats a price amount with the correct currency symbol and code
 * Uses explicit currency symbol mapping for accurate symbol display
 * @param amount - The price amount to format
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'NGN', 'EUR')
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "$1,234.56" or "₦1,234.56")
 */
export declare function formatCurrency(amount: number | string | null | undefined, currencyCode?: string | null | undefined, options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}): string;
/**
 * Converts API errors to user-friendly messages
 */
export declare function getUserFriendlyErrorMessage(error: any, defaultMessage?: string): string;
/**
 * Filters out inactive or deleted products
 * Excludes products where isActive === false OR status === 'inactive' OR status === 'draft'
 * If isActive/status are undefined (mock data), includes the product for backward compatibility
 */
export declare function filterActiveProducts(products: StoreProduct[]): StoreProduct[];
export declare function filterActiveServices(services: StoreService[]): StoreService[];
/**
 * Deep clones an object using structuredClone if available, or a fallback recursive clone.
 * This is more efficient and handles more types than JSON.parse(JSON.stringify).
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Checks if two objects are deeply equal without using JSON.stringify.
 * Optimized for performance by doing early exits and avoiding stringification.
 */
export declare function isDeepEqual(obj1: any, obj2: any): boolean;
//# sourceMappingURL=index.d.ts.map
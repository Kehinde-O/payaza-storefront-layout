/**
 * Currency Symbol Mapping
 * Maps ISO 4217 currency codes to their corresponding symbols
 * Based on XE.com currency symbols standards
 * Reference: https://www.xe.com/symbols
 */
export interface CurrencySymbolInfo {
    symbol: string;
    position: 'prefix' | 'suffix';
    decimalPlaces: number;
}
/**
 * Comprehensive mapping of ISO 4217 currency codes to their symbols
 * Includes major and minor currencies
 */
export declare const CURRENCY_SYMBOLS: Record<string, CurrencySymbolInfo>;
/**
 * Get currency symbol information for a given ISO 4217 currency code
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'NGN', 'EUR')
 * @returns Currency symbol information or null if not found
 */
export declare function getCurrencySymbolInfo(currencyCode: string | null | undefined): CurrencySymbolInfo | null;
/**
 * Get just the currency symbol for a given ISO 4217 currency code
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'NGN', 'EUR')
 * @param fallback - Fallback symbol or code to use if not found (default: currency code itself)
 * @returns The currency symbol or fallback
 */
export declare function getCurrencySymbol(currencyCode: string | null | undefined, fallback?: string): string;
/**
 * Check if a currency code is supported
 * @param currencyCode - The ISO 4217 currency code to check
 * @returns True if the currency code has a symbol mapping
 */
export declare function isCurrencySupported(currencyCode: string | null | undefined): boolean;
//# sourceMappingURL=currency-symbols.d.ts.map
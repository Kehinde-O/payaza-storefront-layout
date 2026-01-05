/**
 * Currency Symbol Mapping
 * Maps ISO 4217 currency codes to their corresponding symbols
 * Based on XE.com currency symbols standards
 * Reference: https://www.xe.com/symbols
 */

export interface CurrencySymbolInfo {
  symbol: string;
  position: 'prefix' | 'suffix'; // Where the symbol appears relative to the amount
  decimalPlaces: number; // Standard decimal places for this currency
}

/**
 * Comprehensive mapping of ISO 4217 currency codes to their symbols
 * Includes major and minor currencies
 */
export const CURRENCY_SYMBOLS: Record<string, CurrencySymbolInfo> = {
  // Major currencies
  USD: { symbol: '$', position: 'prefix', decimalPlaces: 2 },
  EUR: { symbol: '€', position: 'prefix', decimalPlaces: 2 },
  GBP: { symbol: '£', position: 'prefix', decimalPlaces: 2 },
  JPY: { symbol: '¥', position: 'prefix', decimalPlaces: 0 },
  CNY: { symbol: '¥', position: 'prefix', decimalPlaces: 2 },
  AUD: { symbol: 'A$', position: 'prefix', decimalPlaces: 2 },
  CAD: { symbol: 'C$', position: 'prefix', decimalPlaces: 2 },
  CHF: { symbol: 'CHF', position: 'prefix', decimalPlaces: 2 },
  HKD: { symbol: 'HK$', position: 'prefix', decimalPlaces: 2 },
  NZD: { symbol: 'NZ$', position: 'prefix', decimalPlaces: 2 },
  SEK: { symbol: 'kr', position: 'suffix', decimalPlaces: 2 },
  NOK: { symbol: 'kr', position: 'suffix', decimalPlaces: 2 },
  DKK: { symbol: 'kr', position: 'suffix', decimalPlaces: 2 },
  PLN: { symbol: 'zł', position: 'suffix', decimalPlaces: 2 },
  MXN: { symbol: '$', position: 'prefix', decimalPlaces: 2 },
  SGD: { symbol: 'S$', position: 'prefix', decimalPlaces: 2 },
  INR: { symbol: '₹', position: 'prefix', decimalPlaces: 2 },
  KRW: { symbol: '₩', position: 'prefix', decimalPlaces: 0 },
  TRY: { symbol: '₺', position: 'prefix', decimalPlaces: 2 },
  RUB: { symbol: '₽', position: 'suffix', decimalPlaces: 2 },
  BRL: { symbol: 'R$', position: 'prefix', decimalPlaces: 2 },
  ZAR: { symbol: 'R', position: 'prefix', decimalPlaces: 2 },
  THB: { symbol: '฿', position: 'prefix', decimalPlaces: 2 },
  IDR: { symbol: 'Rp', position: 'prefix', decimalPlaces: 0 },
  HUF: { symbol: 'Ft', position: 'suffix', decimalPlaces: 2 },
  CZK: { symbol: 'Kč', position: 'suffix', decimalPlaces: 2 },
  ILS: { symbol: '₪', position: 'prefix', decimalPlaces: 2 },
  CLP: { symbol: '$', position: 'prefix', decimalPlaces: 0 },
  PHP: { symbol: '₱', position: 'prefix', decimalPlaces: 2 },
  AED: { symbol: 'د.إ', position: 'prefix', decimalPlaces: 2 },
  COP: { symbol: '$', position: 'prefix', decimalPlaces: 2 },
  SAR: { symbol: '﷼', position: 'prefix', decimalPlaces: 2 },
  MYR: { symbol: 'RM', position: 'prefix', decimalPlaces: 2 },
  RON: { symbol: 'lei', position: 'suffix', decimalPlaces: 2 },
  
  // African currencies
  NGN: { symbol: '₦', position: 'prefix', decimalPlaces: 2 },
  KES: { symbol: 'KSh', position: 'prefix', decimalPlaces: 2 },
  GHS: { symbol: 'GH₵', position: 'prefix', decimalPlaces: 2 },
  UGX: { symbol: 'USh', position: 'prefix', decimalPlaces: 0 },
  TZS: { symbol: 'TSh', position: 'prefix', decimalPlaces: 2 },
  ETB: { symbol: 'Br', position: 'prefix', decimalPlaces: 2 },
  RWF: { symbol: 'RF', position: 'prefix', decimalPlaces: 0 },
  XOF: { symbol: 'CFA', position: 'prefix', decimalPlaces: 0 },
  XAF: { symbol: 'FCFA', position: 'prefix', decimalPlaces: 0 },
  EGP: { symbol: 'E£', position: 'prefix', decimalPlaces: 2 },
  MAD: { symbol: 'د.م.', position: 'prefix', decimalPlaces: 2 },
  TND: { symbol: 'د.ت', position: 'prefix', decimalPlaces: 3 },
  DZD: { symbol: 'د.ج', position: 'prefix', decimalPlaces: 2 },
  LYD: { symbol: 'ل.د', position: 'prefix', decimalPlaces: 3 },
  
  // Middle Eastern currencies
  IQD: { symbol: 'ع.د', position: 'prefix', decimalPlaces: 3 },
  JOD: { symbol: 'د.ا', position: 'prefix', decimalPlaces: 3 },
  LBP: { symbol: 'ل.ل', position: 'prefix', decimalPlaces: 2 },
  OMR: { symbol: 'ر.ع.', position: 'prefix', decimalPlaces: 3 },
  QAR: { symbol: 'ر.ق', position: 'prefix', decimalPlaces: 2 },
  KWD: { symbol: 'د.ك', position: 'prefix', decimalPlaces: 3 },
  BHD: { symbol: 'د.ب', position: 'prefix', decimalPlaces: 3 },
  
  // Asian currencies
  VND: { symbol: '₫', position: 'suffix', decimalPlaces: 0 },
  PKR: { symbol: '₨', position: 'prefix', decimalPlaces: 2 },
  BDT: { symbol: '৳', position: 'prefix', decimalPlaces: 2 },
  LKR: { symbol: 'Rs', position: 'prefix', decimalPlaces: 2 },
  NPR: { symbol: '₨', position: 'prefix', decimalPlaces: 2 },
  MMK: { symbol: 'K', position: 'prefix', decimalPlaces: 2 },
  KHR: { symbol: '៛', position: 'suffix', decimalPlaces: 2 },
  LAK: { symbol: '₭', position: 'prefix', decimalPlaces: 2 },
  MNT: { symbol: '₮', position: 'prefix', decimalPlaces: 2 },
  
  // European currencies
  ISK: { symbol: 'kr', position: 'suffix', decimalPlaces: 0 },
  RSD: { symbol: 'дин.', position: 'suffix', decimalPlaces: 2 },
  BGN: { symbol: 'лв', position: 'suffix', decimalPlaces: 2 },
  HRK: { symbol: 'kn', position: 'suffix', decimalPlaces: 2 },
  UAH: { symbol: '₴', position: 'prefix', decimalPlaces: 2 },
  BYN: { symbol: 'Br', position: 'prefix', decimalPlaces: 2 },
  MDL: { symbol: 'L', position: 'prefix', decimalPlaces: 2 },
  
  // Latin American currencies
  ARS: { symbol: '$', position: 'prefix', decimalPlaces: 2 },
  PEN: { symbol: 'S/', position: 'prefix', decimalPlaces: 2 },
  UYU: { symbol: '$U', position: 'prefix', decimalPlaces: 2 },
  PYG: { symbol: '₲', position: 'prefix', decimalPlaces: 0 },
  BOB: { symbol: 'Bs.', position: 'prefix', decimalPlaces: 2 },
  VES: { symbol: 'Bs.S', position: 'prefix', decimalPlaces: 2 },
  CRC: { symbol: '₡', position: 'prefix', decimalPlaces: 2 },
  GTQ: { symbol: 'Q', position: 'prefix', decimalPlaces: 2 },
  HNL: { symbol: 'L', position: 'prefix', decimalPlaces: 2 },
  NIO: { symbol: 'C$', position: 'prefix', decimalPlaces: 2 },
  PAB: { symbol: 'B/.', position: 'prefix', decimalPlaces: 2 },
  DOP: { symbol: 'RD$', position: 'prefix', decimalPlaces: 2 },
  JMD: { symbol: 'J$', position: 'prefix', decimalPlaces: 2 },
  TTD: { symbol: 'TT$', position: 'prefix', decimalPlaces: 2 },
  BBD: { symbol: 'Bds$', position: 'prefix', decimalPlaces: 2 },
  BZD: { symbol: 'BZ$', position: 'prefix', decimalPlaces: 2 },
  
  // Other currencies
  XCD: { symbol: '$', position: 'prefix', decimalPlaces: 2 },
  AWG: { symbol: 'ƒ', position: 'prefix', decimalPlaces: 2 },
  ANG: { symbol: 'ƒ', position: 'prefix', decimalPlaces: 2 },
  FJD: { symbol: 'FJ$', position: 'prefix', decimalPlaces: 2 },
  PGK: { symbol: 'K', position: 'prefix', decimalPlaces: 2 },
  SBD: { symbol: 'SI$', position: 'prefix', decimalPlaces: 2 },
  TOP: { symbol: 'T$', position: 'prefix', decimalPlaces: 2 },
  VUV: { symbol: 'Vt', position: 'prefix', decimalPlaces: 0 },
  WST: { symbol: 'WS$', position: 'prefix', decimalPlaces: 2 },
};

/**
 * Get currency symbol information for a given ISO 4217 currency code
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'NGN', 'EUR')
 * @returns Currency symbol information or null if not found
 */
export function getCurrencySymbolInfo(currencyCode: string | null | undefined): CurrencySymbolInfo | null {
  if (!currencyCode || typeof currencyCode !== 'string') {
    return null;
  }
  
  const normalizedCode = currencyCode.trim().toUpperCase();
  return CURRENCY_SYMBOLS[normalizedCode] || null;
}

/**
 * Get just the currency symbol for a given ISO 4217 currency code
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'NGN', 'EUR')
 * @param fallback - Fallback symbol or code to use if not found (default: currency code itself)
 * @returns The currency symbol or fallback
 */
export function getCurrencySymbol(
  currencyCode: string | null | undefined,
  fallback?: string
): string {
  const info = getCurrencySymbolInfo(currencyCode);
  if (info) {
    return info.symbol;
  }
  
  // If no symbol found, return fallback or the currency code itself
  return fallback || currencyCode || 'USD';
}

/**
 * Check if a currency code is supported
 * @param currencyCode - The ISO 4217 currency code to check
 * @returns True if the currency code has a symbol mapping
 */
export function isCurrencySupported(currencyCode: string | null | undefined): boolean {
  if (!currencyCode || typeof currencyCode !== 'string') {
    return false;
  }
  
  const normalizedCode = currencyCode.trim().toUpperCase();
  return normalizedCode in CURRENCY_SYMBOLS;
}


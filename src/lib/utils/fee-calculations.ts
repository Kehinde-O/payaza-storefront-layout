import { StoreConfig } from '../store-types';

export interface VATConfig {
  type: 'flat' | 'percentage';
  value: number; // flat amount or percentage (0-100)
  enabled: boolean;
}

export interface ServiceChargeConfig {
  type: 'flat' | 'percentage';
  value: number;
  enabled: boolean;
  applyTo: 'pos' | 'online' | 'both';
}

/**
 * Calculate VAT amount based on configuration
 * @param subtotal - Subtotal amount
 * @param vatConfig - VAT configuration
 * @param taxRate - Deprecated: fallback tax rate (as decimal, e.g., 0.08 for 8%)
 * @returns VAT amount
 */
export function calculateVAT(
  subtotal: number,
  vatConfig?: VATConfig | null,
  taxRate?: number
): number {
  if (vatConfig?.enabled) {
    if (vatConfig.type === 'percentage') {
      return subtotal * (vatConfig.value / 100);
    } else {
      // Flat fee VAT
      return vatConfig.value;
    }
  } else if (taxRate !== undefined && taxRate !== null) {
    // Fallback to deprecated taxRate for backward compatibility
    return subtotal * taxRate;
  }
  return 0;
}

/**
 * Calculate service charge amount based on configuration
 * @param subtotal - Subtotal amount
 * @param serviceChargeConfig - Service charge configuration
 * @param applyTo - Context: 'pos' or 'online'
 * @returns Service charge amount
 */
export function calculateServiceCharge(
  subtotal: number,
  serviceChargeConfig?: ServiceChargeConfig | null,
  applyTo: 'pos' | 'online' = 'online'
): number {
  if (!serviceChargeConfig?.enabled) {
    return 0;
  }

  // Check if service charge should apply to this context
  const shouldApply =
    serviceChargeConfig.applyTo === applyTo ||
    serviceChargeConfig.applyTo === 'both' ||
    !serviceChargeConfig.applyTo; // Default to 'both' if not specified

  if (!shouldApply) {
    return 0;
  }

  if (serviceChargeConfig.type === 'percentage') {
    return subtotal * (serviceChargeConfig.value / 100);
  } else {
    // Flat fee service charge
    return serviceChargeConfig.value;
  }
}

/**
 * Get VAT label based on configuration
 * @param vatConfig - VAT configuration
 * @param taxRate - Deprecated: fallback tax rate
 * @returns Label string ('VAT' or 'Tax')
 */
export function getVATLabel(vatConfig?: VATConfig | null, taxRate?: number): string {
  if (vatConfig?.enabled) {
    return 'VAT';
  } else if (taxRate !== undefined && taxRate !== null) {
    return 'Tax';
  }
  return 'Tax'; // Default
}


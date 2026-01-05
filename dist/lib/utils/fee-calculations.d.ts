export interface VATConfig {
    type: 'flat' | 'percentage';
    value: number;
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
export declare function calculateVAT(subtotal: number, vatConfig?: VATConfig | null, taxRate?: number): number;
/**
 * Calculate service charge amount based on configuration
 * @param subtotal - Subtotal amount
 * @param serviceChargeConfig - Service charge configuration
 * @param applyTo - Context: 'pos' or 'online'
 * @returns Service charge amount
 */
export declare function calculateServiceCharge(subtotal: number, serviceChargeConfig?: ServiceChargeConfig | null, applyTo?: 'pos' | 'online'): number;
/**
 * Get VAT label based on configuration
 * @param vatConfig - VAT configuration
 * @param taxRate - Deprecated: fallback tax rate
 * @returns Label string ('VAT' or 'Tax')
 */
export declare function getVATLabel(vatConfig?: VATConfig | null, taxRate?: number): string;
//# sourceMappingURL=fee-calculations.d.ts.map
export interface FeeCalculationRequest {
    storeId: string;
    subtotal: number;
    currency: string;
    orderType?: 'product' | 'service' | 'mixed';
}
export interface FeeCalculationResponse {
    charges: Array<{
        label: string;
        type: string;
        amount: number;
        rate?: number;
        chargeId: string;
    }>;
    totalCharges: number;
}
export declare const feesService: {
    /**
     * Calculate fees for an order
     */
    calculateFees(data: FeeCalculationRequest): Promise<FeeCalculationResponse>;
};
//# sourceMappingURL=fees.service.d.ts.map
export interface PromoValidation {
    valid: boolean;
    code: string;
    type: string;
    discountValue: number;
    discount: number;
    description?: string;
}
export interface Promo {
    id: string;
    code: string;
    type: string;
    discountValue: number;
    minimumPurchase?: number;
    maximumDiscount?: number;
    status: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}
export declare const promoService: {
    /**
     * Validate a promo code
     */
    validatePromo(code: string, storeId: string, amount?: number): Promise<PromoValidation>;
    /**
     * Get active promo codes for a store
     */
    getActivePromos(storeId: string): Promise<Promo[]>;
};
//# sourceMappingURL=promo.service.d.ts.map
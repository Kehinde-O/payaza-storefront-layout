export interface ShippingMethod {
    code: string;
    name: string;
    cost: number;
    estimatedDays: number;
    estimatedDaysMin?: number;
    estimatedDaysMax?: number;
    description?: string;
}
export interface ShippingCalculation {
    methods: ShippingMethod[];
    selectedMethod?: ShippingMethod;
    freeShippingEligible: boolean;
    freeShippingThreshold?: number;
}
export interface TaxCalculation {
    tax: number;
    taxRate: number;
    subtotal: number;
    total: number;
}
export declare const shippingService: {
    /**
     * Calculate shipping costs
     */
    calculateShipping(data: {
        storeId: string;
        address: any;
        weight?: number;
        items?: any[];
        subtotal?: number;
        shippingMethod?: string;
        currency?: string;
    }): Promise<ShippingCalculation>;
    /**
     * Calculate tax
     */
    calculateTax(data: {
        storeId: string;
        address: any;
        subtotal: number;
    }): Promise<TaxCalculation>;
};
//# sourceMappingURL=shipping.service.d.ts.map
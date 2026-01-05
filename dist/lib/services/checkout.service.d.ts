export interface CheckoutItem {
    productId?: string;
    serviceId?: string;
    quantity: number;
    price: number;
    variationId?: string;
    variantId?: string;
    options?: {
        bookingDate?: string;
        startTime?: string;
        endTime?: string;
        customerNotes?: string;
    };
}
export interface CheckoutRequest {
    storeId: string;
    items: CheckoutItem[];
    customerInfo: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    };
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
    };
    billingAddress?: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: string;
    promoCode?: string;
    shippingMethod?: string;
    shippingCost?: number;
    customerId?: string;
}
export interface CheckoutResponse {
    orderId: string;
    orderNumber?: string;
    checkoutUrl?: string;
    transactionReference?: string;
    totalAmount?: number;
    currency?: string;
}
export declare const checkoutService: {
    /**
     * Process checkout
     */
    processCheckout(data: CheckoutRequest): Promise<CheckoutResponse>;
    /**
     * Process payment
     */
    processPayment(orderId: string, paymentMethod: string, transactionReference: string, amount: number): Promise<void>;
    /**
     * Get checkout receipt
     */
    getReceipt(orderId: string): Promise<{
        orderNumber: string;
        total: number;
        items: unknown[];
        paymentStatus: string;
        receiptUrl: string;
    }>;
};
//# sourceMappingURL=checkout.service.d.ts.map
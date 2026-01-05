import { PayazaSuccessCallback } from '../payaza-checkout';
export interface PaymentVerificationRequest {
    transactionRef: string;
    storeId?: string;
}
export interface PaymentVerificationResponse {
    verified: boolean;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    orderId?: string;
    orderNumber?: string;
    amount?: number;
    currency?: string;
    message?: string;
    webhookPending?: boolean;
    webhookProcessing?: boolean;
}
export interface PaymentConfirmationResponse {
    orderId: string;
    orderNumber?: string;
    paymentStatus: 'completed' | 'partial';
    message: string;
    alreadyProcessed?: boolean;
}
export declare const paymentService: {
    /**
     * Verify payment status with backend
     * This ensures the payment is legitimate before showing success to user
     */
    verifyPayment(transactionRef: string, storeId?: string): Promise<PaymentVerificationResponse>;
    /**
     * Confirm payment from Payaza callback data
     * This processes the payment, updates order status, and triggers order processing
     */
    confirmPaymentFromCallback(callbackData: PayazaSuccessCallback): Promise<PaymentConfirmationResponse>;
    /**
     * Confirm payment from transaction reference (fallback method)
     * Used when SDK callback fails but payment was successful
     * This processes the payment, updates order status, and triggers order processing
     */
    confirmPaymentFromReference(transactionRef: string, storeId?: string): Promise<PaymentConfirmationResponse>;
    /**
     * Poll payment status until it's completed or timeout
     * Used when SDK callback fires to check if webhook already processed payment
     */
    pollPaymentStatus(transactionRef: string, storeId: string | undefined, options?: {
        maxAttempts?: number;
        intervalMs?: number;
        onProgress?: (attempt: number, maxAttempts: number) => void;
    }): Promise<PaymentVerificationResponse | null>;
};
//# sourceMappingURL=payment.service.d.ts.map
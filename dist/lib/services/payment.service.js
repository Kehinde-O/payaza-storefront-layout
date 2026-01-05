import { api } from '../api';
export const paymentService = {
    /**
     * Verify payment status with backend
     * This ensures the payment is legitimate before showing success to user
     */
    async verifyPayment(transactionRef, storeId) {
        try {
            const response = await api.post('/payments/verify', {
                transactionRef,
                storeId,
            });
            if (response.data.status === 'success') {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Payment verification failed');
        }
        catch (error) {
            console.error('Payment verification error:', error);
            return {
                verified: false,
                paymentStatus: 'pending',
                message: error.message || 'Failed to verify payment',
            };
        }
    },
    /**
     * Confirm payment from Payaza callback data
     * This processes the payment, updates order status, and triggers order processing
     */
    async confirmPaymentFromCallback(callbackData) {
        try {
            const response = await api.post('/payments/confirm-callback', callbackData);
            if (response.data.status === 'success') {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Payment confirmation failed');
        }
        catch (error) {
            console.error('Payment confirmation error:', error);
            throw new Error(error.message || 'Failed to confirm payment');
        }
    },
    /**
     * Confirm payment from transaction reference (fallback method)
     * Used when SDK callback fails but payment was successful
     * This processes the payment, updates order status, and triggers order processing
     */
    async confirmPaymentFromReference(transactionRef, storeId) {
        try {
            const response = await api.post('/payments/confirm-reference', {
                transactionRef,
                storeId,
            });
            if (response.data.status === 'success') {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Payment confirmation failed');
        }
        catch (error) {
            console.error('Payment confirmation from reference error:', error);
            throw new Error(error.message || 'Failed to confirm payment');
        }
    },
    /**
     * Poll payment status until it's completed or timeout
     * Used when SDK callback fires to check if webhook already processed payment
     */
    async pollPaymentStatus(transactionRef, storeId, options = {}) {
        const maxAttempts = options.maxAttempts || 10;
        const intervalMs = options.intervalMs || 1500; // Poll every 1.5 seconds
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (options.onProgress) {
                options.onProgress(attempt, maxAttempts);
            }
            try {
                const verification = await this.verifyPayment(transactionRef, storeId);
                // If payment is completed, return immediately
                if (verification.verified && verification.paymentStatus === 'completed') {
                    return verification;
                }
                // If webhook is processing, continue polling
                if (verification.webhookProcessing) {
                    // Wait before next poll
                    await new Promise(resolve => setTimeout(resolve, intervalMs));
                    continue;
                }
                // If payment is still pending and no webhook processing, wait and continue
                if (verification.paymentStatus === 'pending') {
                    await new Promise(resolve => setTimeout(resolve, intervalMs));
                    continue;
                }
                // Payment is in a final state (failed, etc.), return it
                return verification;
            }
            catch (error) {
                console.error(`[PaymentPolling] Attempt ${attempt} failed:`, error);
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        }
        // Timeout - return null to indicate polling didn't find completed payment
        return null;
    },
};

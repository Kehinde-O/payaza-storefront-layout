import { api } from '../api';
export const checkoutService = {
    /**
     * Process checkout
     */
    async processCheckout(data) {
        const response = await api.post('/checkout/process', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Checkout processing failed');
    },
    /**
     * Process payment
     */
    async processPayment(orderId, paymentMethod, transactionReference, amount) {
        const response = await api.post('/checkout/payment', {
            orderId,
            paymentMethod,
            transactionReference,
            amount,
        });
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Payment processing failed');
        }
    },
    /**
     * Get checkout receipt
     */
    async getReceipt(orderId) {
        const response = await api.get(`/checkout/receipt/${orderId}`);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch receipt');
    },
};

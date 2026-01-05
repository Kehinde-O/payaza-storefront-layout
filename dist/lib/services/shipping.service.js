import { api } from '../api';
export const shippingService = {
    /**
     * Calculate shipping costs
     */
    async calculateShipping(data) {
        const response = await api.post('/shipping/calculate', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to calculate shipping');
    },
    /**
     * Calculate tax
     */
    async calculateTax(data) {
        const response = await api.post('/tax/calculate', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to calculate tax');
    },
};

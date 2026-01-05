import { api } from '../api';
export const promoService = {
    /**
     * Validate a promo code
     */
    async validatePromo(code, storeId, amount) {
        const response = await api.post('/promos/validate', {
            code,
            storeId,
            amount,
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Invalid promo code');
    },
    /**
     * Get active promo codes for a store
     */
    async getActivePromos(storeId) {
        const response = await api.get('/promos', {
            params: { storeId },
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch promos');
    },
};

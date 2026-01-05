import { api } from '../api';
export const feesService = {
    /**
     * Calculate fees for an order
     */
    async calculateFees(data) {
        const response = await api.post('/fees/calculate', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to calculate fees');
    },
};

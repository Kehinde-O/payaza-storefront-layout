import { api } from '../api';
export const serviceService = {
    /**
     * Get services for a store
     */
    async getServices(storeId, params) {
        const response = await api.get('/services', {
            params: { storeId, ...params },
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch services');
    },
    /**
     * Get service by ID
     */
    async getServiceById(id) {
        const response = await api.get(`/services/${id}`);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch service');
    },
    /**
     * Get service by slug
     */
    async getServiceBySlug(slug, storeId) {
        const response = await api.get(`/services/slug/${slug}`, {
            params: { storeId },
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch service');
    },
};

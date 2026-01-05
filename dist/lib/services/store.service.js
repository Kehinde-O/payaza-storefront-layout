import { api } from '../api';
export const storeService = {
    /**
     * Get store by slug
     * Returns store data and maintenance mode status
     */
    async getStoreBySlug(slug) {
        const response = await api.get(`/stores/slug/${slug}`);
        if (response.data.status === 'success') {
            return {
                store: response.data.data,
                maintenanceMode: response.data.maintenanceMode || false,
            };
        }
        throw new Error(response.data.message || 'Failed to fetch store');
    },
    /**
     * Get store by domain
     * Returns store data and maintenance mode status
     */
    async getStoreByDomain(domain) {
        const response = await api.get(`/stores/domain/${domain}`);
        if (response.data.status === 'success') {
            return {
                store: response.data.data,
                maintenanceMode: response.data.maintenanceMode || false,
            };
        }
        throw new Error(response.data.message || 'Failed to fetch store');
    },
    /**
     * Get all published stores
     */
    async getAllPublishedStores() {
        const response = await api.get('/stores');
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch stores');
    },
};

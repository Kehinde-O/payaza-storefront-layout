import { api } from '../api';
export const categoryService = {
    /**
     * Get all categories for a store
     */
    async getCategories(storeId) {
        try {
            console.log(`[CategoryService] Fetching categories for storeId: ${storeId}`);
            const response = await api.get('/categories', {
                params: { storeId },
            });
            if (response.data.status === 'success') {
                console.log(`[CategoryService] Successfully fetched ${response.data.data.length} categories`);
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch categories');
        }
        catch (error) {
            console.error('[CategoryService] Error fetching categories:', {
                storeId,
                message: error.message,
                status: error.status,
                response: error.response?.data,
                url: error.config?.url,
            });
            throw error;
        }
    },
    /**
     * Get category by slug
     */
    async getCategoryBySlug(slug, storeId) {
        const response = await api.get(`/categories/slug/${slug}`, {
            params: { storeId },
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch category');
    },
};

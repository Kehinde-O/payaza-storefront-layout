import { api } from '../api';
export const productService = {
    /**
     * Get products with filtering, sorting, and pagination
     */
    async getProducts(params) {
        try {
            console.log(`[ProductService] Fetching products with params:`, { storeId: params.storeId, limit: params.limit });
            const response = await api.get('/products', { params });
            if (response.data.status === 'success') {
                console.log(`[ProductService] Successfully fetched ${response.data.data.length} products (total: ${response.data.meta?.total || 0})`);
                return {
                    data: response.data.data,
                    meta: response.data.meta || { page: 1, limit: 20, total: 0, totalPages: 0 },
                };
            }
            throw new Error(response.data.message || 'Failed to fetch products');
        }
        catch (error) {
            console.error('[ProductService] Error fetching products:', {
                params,
                message: error.message,
                status: error.status,
                response: error.response?.data,
                url: error.config?.url,
            });
            throw error;
        }
    },
    /**
     * Get product by ID
     */
    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch product');
    },
    /**
     * Get product by slug
     */
    async getProductBySlug(slug, storeId) {
        const response = await api.get(`/products/slug/${slug}`, { params: { storeId } });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch product');
    },
    /**
     * Get related products
     */
    async getRelatedProducts(productId, limit = 4) {
        const response = await api.get(`/products/${productId}/related`, {
            params: { limit },
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch related products');
    },
    /**
     * Get trending products
     */
    async getTrendingProducts(storeId, limit = 10) {
        const response = await api.get('/products/trending', {
            params: { storeId, limit },
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch trending products');
    },
    /**
     * Get featured products
     */
    async getFeaturedProducts(storeId, limit = 10) {
        const response = await api.get('/products/featured', {
            params: { storeId, limit },
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch featured products');
    },
};

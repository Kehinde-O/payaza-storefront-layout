import { api } from '../api';
export const reviewService = {
    /**
     * Get product reviews
     */
    async getProductReviews(productId, page = 1, limit = 10) {
        const response = await api.get(`/products/${productId}/reviews`, { params: { page, limit } });
        if (response.data.status === 'success') {
            return {
                data: response.data.data,
                meta: response.data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
            };
        }
        throw new Error(response.data.message || 'Failed to fetch reviews');
    },
    /**
     * Create a review (requires authentication)
     */
    async createReview(productId, data) {
        const response = await api.post(`/products/${productId}/reviews`, data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create review');
    },
    /**
     * Update a review (requires authentication, owner only)
     */
    async updateReview(productId, reviewId, data) {
        const response = await api.put(`/products/${productId}/reviews/${reviewId}`, data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update review');
    },
    /**
     * Delete a review (requires authentication, owner only)
     */
    async deleteReview(productId, reviewId) {
        const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to delete review');
        }
    },
    /**
     * Mark review as helpful (requires authentication)
     */
    async markHelpful(productId, reviewId) {
        const response = await api.post(`/products/${productId}/reviews/${reviewId}/helpful`);
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to mark review as helpful');
        }
    },
};

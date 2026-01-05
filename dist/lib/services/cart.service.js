import { api } from '../api';
export const cartService = {
    /**
     * Get cart (requires session ID header for guests or auth token)
     */
    async getCart() {
        const response = await api.get('/cart');
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch cart');
    },
    /**
     * Add item to cart
     */
    async addItem(productId, quantity, options) {
        const response = await api.post('/cart/items', {
            productId,
            quantity,
            options,
        });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to add item to cart');
    },
    /**
     * Update cart item quantity
     */
    async updateItem(itemId, quantity) {
        const response = await api.put(`/cart/items/${itemId}`, { quantity });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update cart item');
    },
    /**
     * Remove item from cart
     */
    async removeItem(itemId) {
        const response = await api.delete(`/cart/items/${itemId}`);
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to remove item from cart');
        }
    },
    /**
     * Clear entire cart
     */
    async clearCart() {
        const response = await api.delete('/cart');
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to clear cart');
        }
    },
};

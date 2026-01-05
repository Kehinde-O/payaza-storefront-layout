import { api } from '../api';
export const wishlistService = {
    /**
     * Get wishlist (requires authentication)
     * Backend returns Wishlist object with items array, we extract and return items
     * Deduplicates items by productId to prevent duplicates
     */
    async getWishlist() {
        const response = await api.get('/wishlist');
        if (response.data.status === 'success') {
            const data = response.data.data;
            let items = [];
            // Handle both response formats: direct array or Wishlist object with items
            if (Array.isArray(data)) {
                items = data;
            }
            else {
                // If it's a Wishlist object, extract the items array
                items = data.items || [];
            }
            // Deduplicate items by productId to prevent duplicates
            const seenProductIds = new Set();
            const uniqueItems = items.filter(item => {
                if (seenProductIds.has(item.productId)) {
                    return false; // Duplicate, filter it out
                }
                seenProductIds.add(item.productId);
                return true;
            });
            return uniqueItems;
        }
        throw new Error(response.data.message || 'Failed to fetch wishlist');
    },
    /**
     * Add product to wishlist
     */
    async addToWishlist(productId) {
        const response = await api.post('/wishlist/items', { productId });
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to add to wishlist');
    },
    /**
     * Remove item from wishlist
     */
    async removeFromWishlist(itemId) {
        const response = await api.delete(`/wishlist/items/${itemId}`);
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to remove from wishlist');
        }
    },
};

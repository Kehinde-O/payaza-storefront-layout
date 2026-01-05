import { api } from '../api';

export interface WishlistItem {
  id: string;
  productId: string;
  product?: any;
  createdAt: string;
}

export interface WishlistResponse {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export const wishlistService = {
  /**
   * Get wishlist (requires authentication)
   * Backend returns Wishlist object with items array, we extract and return items
   * Deduplicates items by productId to prevent duplicates
   */
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await api.get<{ status: string; data: WishlistResponse | WishlistItem[]; message?: string }>('/wishlist');
    if (response.data.status === 'success') {
      const data = response.data.data;
      let items: WishlistItem[] = [];
      
      // Handle both response formats: direct array or Wishlist object with items
      if (Array.isArray(data)) {
        items = data;
      } else {
        // If it's a Wishlist object, extract the items array
        items = (data as WishlistResponse).items || [];
      }
      
      // Deduplicate items by productId to prevent duplicates
      const seenProductIds = new Set<string>();
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
  async addToWishlist(productId: string): Promise<WishlistItem> {
    const response = await api.post<{ status: string; data: WishlistItem; message?: string }>('/wishlist/items', { productId });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to add to wishlist');
  },

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(itemId: string): Promise<void> {
    const response = await api.delete<{ status: string; message?: string }>(`/wishlist/items/${itemId}`);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to remove from wishlist');
    }
  },
};


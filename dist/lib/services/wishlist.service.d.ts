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
export declare const wishlistService: {
    /**
     * Get wishlist (requires authentication)
     * Backend returns Wishlist object with items array, we extract and return items
     * Deduplicates items by productId to prevent duplicates
     */
    getWishlist(): Promise<WishlistItem[]>;
    /**
     * Add product to wishlist
     */
    addToWishlist(productId: string): Promise<WishlistItem>;
    /**
     * Remove item from wishlist
     */
    removeFromWishlist(itemId: string): Promise<void>;
};
//# sourceMappingURL=wishlist.service.d.ts.map
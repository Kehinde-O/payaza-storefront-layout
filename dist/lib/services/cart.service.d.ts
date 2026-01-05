export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    options?: Record<string, any>;
    product?: any;
}
export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
    total: number;
}
export declare const cartService: {
    /**
     * Get cart (requires session ID header for guests or auth token)
     */
    getCart(): Promise<Cart>;
    /**
     * Add item to cart
     */
    addItem(productId: string, quantity: number, options?: Record<string, any>): Promise<CartItem>;
    /**
     * Update cart item quantity
     */
    updateItem(itemId: string, quantity: number): Promise<CartItem>;
    /**
     * Remove item from cart
     */
    removeItem(itemId: string): Promise<void>;
    /**
     * Clear entire cart
     */
    clearCart(): Promise<void>;
};
//# sourceMappingURL=cart.service.d.ts.map
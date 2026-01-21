import { StoreConfig } from '../lib/store-types';
export interface Cart {
    items: CartItem[];
    total: number;
}
export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product?: any;
}
export interface UseCartApiResult {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    syncCart: () => Promise<void>;
    addItem: (productId: string, quantity: number, options?: Record<string, any>) => Promise<void>;
    updateItem: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}
/**
 * Hook to manage cart - uses StoreContext only (localStorage-based)
 * Note: cartService removed - all cart operations use StoreContext
 */
export declare function useCartApi(storeConfig: StoreConfig | null): UseCartApiResult;
//# sourceMappingURL=use-cart-api.d.ts.map
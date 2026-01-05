import { Cart } from '../lib/services/cart.service';
import { StoreConfig } from '../lib/store-types';
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
 * Hook to manage cart with API sync for non-demo stores
 */
export declare function useCartApi(storeConfig: StoreConfig | null): UseCartApiResult;
//# sourceMappingURL=use-cart-api.d.ts.map
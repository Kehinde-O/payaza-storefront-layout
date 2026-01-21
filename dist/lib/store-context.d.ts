import type { StoreConfig, StoreProduct } from './store-types';
export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    variantId?: string;
    variantName?: string;
    price: number;
    product: StoreProduct;
}
interface StoreContextType {
    store: StoreConfig | null;
    isLoading: boolean;
    error: string | null;
    cart: CartItem[];
    addToCart: (product: StoreProduct, quantity?: number, variantId?: string) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    updateCartQuantity: (cartItemId: string, quantity: number) => Promise<void>;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    isCartLoading: boolean;
    buyNowItem: CartItem | null;
    setBuyNowItem: (item: CartItem | null) => void;
    clearBuyNowItem: () => void;
    wishlist: string[];
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    isWishlistLoading: boolean;
}
export declare const StoreContext: import("react").Context<StoreContextType>;
export declare function StoreProvider({ children, storeSlug, initialConfig }: {
    children: React.ReactNode;
    storeSlug?: string;
    initialConfig?: StoreConfig | null;
}): import("react/jsx-runtime").JSX.Element;
export declare const useStore: () => StoreContextType;
export {};
//# sourceMappingURL=store-context.d.ts.map
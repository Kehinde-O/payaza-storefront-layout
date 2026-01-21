import { useState, useEffect, useCallback } from 'react';
// Note: cartService removed - using StoreContext only (localStorage-based)
// This hook now uses StoreContext for all cart operations
import { StoreConfig } from '@/lib/store-types';
import { useStore } from '@/lib/store-context';

// Types for cart (no longer from service)
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
export function useCartApi(storeConfig: StoreConfig | null): UseCartApiResult {
  const { cart: localCart, addToCart: localAddToCart, updateCartQuantity, removeFromCart: localRemoveFromCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert localCart to Cart format
  const apiCart: Cart | null = localCart.length > 0 ? {
    items: localCart.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: item.product,
    })),
    total: localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  } : null;

  const syncCart = useCallback(async () => {
    // No-op: cart is managed by StoreContext (localStorage-based)
    // This function exists for API compatibility
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity: number, options?: Record<string, any>) => {
      if (!storeConfig) return;

      try {
        setLoading(true);
        setError(null);
        // Find product from storeConfig
        const product = storeConfig.products?.find(p => p.id === productId);
        if (!product) {
          throw new Error('Product not found');
        }
        // Use StoreContext addToCart (localStorage-based)
        await localAddToCart(product, quantity, options?.variantId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeConfig, localAddToCart]
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      if (!storeConfig) return;

      try {
        setLoading(true);
        setError(null);
        // Use StoreContext updateCartQuantity (localStorage-based)
        await updateCartQuantity(itemId, quantity);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeConfig, updateCartQuantity]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!storeConfig) return;

      try {
        setLoading(true);
        setError(null);
        // Use StoreContext removeFromCart (localStorage-based)
        await localRemoveFromCart(itemId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeConfig, localRemoveFromCart]
  );

  const clearCart = useCallback(async () => {
    if (!storeConfig) return;

    try {
      setLoading(true);
      setError(null);
      // Remove all items from cart
      const itemsToRemove = [...localCart];
      for (const item of itemsToRemove) {
        await localRemoveFromCart(item.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storeConfig, localCart, localRemoveFromCart]);

  return {
    cart: apiCart,
    loading,
    error,
    syncCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
}


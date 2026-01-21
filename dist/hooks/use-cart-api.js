import { useState, useCallback } from 'react';
import { useStore } from '../lib/store-context';
/**
 * Hook to manage cart - uses StoreContext only (localStorage-based)
 * Note: cartService removed - all cart operations use StoreContext
 */
export function useCartApi(storeConfig) {
    const { cart: localCart, addToCart: localAddToCart, updateCartQuantity, removeFromCart: localRemoveFromCart } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Convert localCart to Cart format
    const apiCart = localCart.length > 0 ? {
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
    const addItem = useCallback(async (productId, quantity, options) => {
        if (!storeConfig)
            return;
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [storeConfig, localAddToCart]);
    const updateItem = useCallback(async (itemId, quantity) => {
        if (!storeConfig)
            return;
        try {
            setLoading(true);
            setError(null);
            // Use StoreContext updateCartQuantity (localStorage-based)
            await updateCartQuantity(itemId, quantity);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [storeConfig, updateCartQuantity]);
    const removeItem = useCallback(async (itemId) => {
        if (!storeConfig)
            return;
        try {
            setLoading(true);
            setError(null);
            // Use StoreContext removeFromCart (localStorage-based)
            await localRemoveFromCart(itemId);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [storeConfig, localRemoveFromCart]);
    const clearCart = useCallback(async () => {
        if (!storeConfig)
            return;
        try {
            setLoading(true);
            setError(null);
            // Remove all items from cart
            const itemsToRemove = [...localCart];
            for (const item of itemsToRemove) {
                await localRemoveFromCart(item.id);
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
            setError(errorMessage);
            throw err;
        }
        finally {
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

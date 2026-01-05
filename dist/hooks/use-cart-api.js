import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../lib/services/cart.service';
import { shouldUseAPI } from '../lib/utils/demo-detection';
import { useStore } from '../lib/store-context';
/**
 * Hook to manage cart with API sync for non-demo stores
 */
export function useCartApi(storeConfig) {
    const { cart: localCart, addToCart: localAddToCart, updateCartQuantity, removeFromCart: localRemoveFromCart } = useStore();
    const [apiCart, setApiCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const syncCart = useCallback(async () => {
        if (!storeConfig || !shouldUseAPI(storeConfig.slug)) {
            return; // Use local storage for demo stores
        }
        try {
            setLoading(true);
            setError(null);
            const cart = await cartService.getCart();
            setApiCart(cart);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sync cart';
            setError(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }, [storeConfig]);
    const addItem = useCallback(async (productId, quantity, options) => {
        if (!storeConfig)
            return;
        if (shouldUseAPI(storeConfig.slug)) {
            try {
                setLoading(true);
                await cartService.addItem(productId, quantity, options);
                await syncCart();
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
                setError(errorMessage);
                throw err;
            }
            finally {
                setLoading(false);
            }
        }
        else {
            // Use local storage for demo stores
            // This will be handled by the StoreContext
        }
    }, [storeConfig, syncCart]);
    const updateItem = useCallback(async (itemId, quantity) => {
        if (!storeConfig)
            return;
        if (shouldUseAPI(storeConfig.slug)) {
            try {
                setLoading(true);
                await cartService.updateItem(itemId, quantity);
                await syncCart();
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
                setError(errorMessage);
                throw err;
            }
            finally {
                setLoading(false);
            }
        }
        else {
            // Use local storage for demo stores
            updateCartQuantity(itemId, quantity);
        }
    }, [storeConfig, syncCart, updateCartQuantity]);
    const removeItem = useCallback(async (itemId) => {
        if (!storeConfig)
            return;
        if (shouldUseAPI(storeConfig.slug)) {
            try {
                setLoading(true);
                await cartService.removeItem(itemId);
                await syncCart();
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
                setError(errorMessage);
                throw err;
            }
            finally {
                setLoading(false);
            }
        }
        else {
            // Use local storage for demo stores
            localRemoveFromCart(itemId);
        }
    }, [storeConfig, syncCart, localRemoveFromCart]);
    const clearCart = useCallback(async () => {
        if (!storeConfig)
            return;
        if (shouldUseAPI(storeConfig.slug)) {
            try {
                setLoading(true);
                await cartService.clearCart();
                await syncCart();
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
                setError(errorMessage);
                throw err;
            }
            finally {
                setLoading(false);
            }
        }
    }, [storeConfig, syncCart]);
    useEffect(() => {
        if (storeConfig && shouldUseAPI(storeConfig.slug)) {
            syncCart();
        }
    }, [storeConfig, syncCart]);
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

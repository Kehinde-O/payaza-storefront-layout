import { useState, useEffect, useCallback } from 'react';
import { productService } from '../lib/services/product.service';
import { shouldUseAPI } from '../lib/utils/demo-detection';
import { useLoading } from '../lib/loading-context';
/**
 * Hook to fetch products from API or use mock data for demo stores
 */
export function useProductsApi(storeConfig, params = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    // Get loading context if available
    let loadingContext = null;
    try {
        loadingContext = useLoading();
    }
    catch {
        // LoadingProvider not available, continue without it
    }
    const startBackendLoading = loadingContext?.startBackendLoading;
    const stopBackendLoading = loadingContext?.stopBackendLoading;
    const fetchProducts = useCallback(async () => {
        if (!storeConfig) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            if (shouldUseAPI(storeConfig.slug) && storeConfig.id) {
                // Use API for non-demo stores - signal backend loading
                startBackendLoading?.();
                const apiParams = {
                    storeId: storeConfig.id,
                    ...params,
                };
                const result = await productService.getProducts(apiParams);
                setProducts(result.data);
                setPagination(result.meta);
            }
            else {
                // Use mock data for demo stores
                const mockProducts = storeConfig.products || [];
                setProducts(mockProducts);
                setPagination({
                    page: 1,
                    limit: mockProducts.length,
                    total: mockProducts.length,
                    totalPages: 1,
                });
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
            setError(errorMessage);
            // Fallback to mock data on error
            if (storeConfig) {
                const mockProducts = storeConfig.products || [];
                setProducts(mockProducts);
                setPagination({
                    page: 1,
                    limit: mockProducts.length,
                    total: mockProducts.length,
                    totalPages: 1,
                });
            }
        }
        finally {
            setLoading(false);
            stopBackendLoading?.();
        }
    }, [storeConfig, params, startBackendLoading, stopBackendLoading]);
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    return {
        products,
        loading,
        error,
        pagination,
        refetch: fetchProducts,
    };
}

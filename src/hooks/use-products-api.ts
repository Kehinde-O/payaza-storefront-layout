import { useState, useEffect, useCallback } from 'react';
import { productService, Product, ProductListParams, PaginatedResponse } from '@/lib/services/product.service';
import { shouldUseAPI } from '@/lib/utils/demo-detection';
import { StoreConfig, StoreProduct } from '@/lib/store-types';
import { useLoading } from '@/lib/loading-context';

export interface UseProductsApiResult {
  products: Product[] | StoreProduct[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch products from API or use mock data for demo stores
 */
export function useProductsApi(
  storeConfig: StoreConfig | null,
  params: Partial<ProductListParams> = {}
): UseProductsApiResult {
  const [products, setProducts] = useState<Product[] | StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  
  // Get loading context if available
  let loadingContext: ReturnType<typeof useLoading> | null = null;
  try {
    loadingContext = useLoading();
  } catch {
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
        const apiParams: ProductListParams = {
          storeId: storeConfig.id,
          ...params,
        };
        const result: PaginatedResponse<Product> = await productService.getProducts(apiParams);
        setProducts(result.data);
        setPagination(result.meta);
      } else {
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
    } catch (err) {
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
    } finally {
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


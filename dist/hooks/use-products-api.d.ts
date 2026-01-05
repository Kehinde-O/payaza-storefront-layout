import { Product, ProductListParams } from '../lib/services/product.service';
import { StoreConfig, StoreProduct } from '../lib/store-types';
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
export declare function useProductsApi(storeConfig: StoreConfig | null, params?: Partial<ProductListParams>): UseProductsApiResult;
//# sourceMappingURL=use-products-api.d.ts.map
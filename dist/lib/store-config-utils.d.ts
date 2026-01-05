import { type Category } from './services/category.service';
import { type Product } from './services/product.service';
import { type Service } from './services/service.service';
import type { StoreConfig, StoreCategory, StoreProduct, StoreService } from './store-types';
/**
 * Comprehensive function to extract and validate image URLs from any format
 * Handles: strings, objects, arrays, JSON-encoded, comma-separated, fragmented JSON
 * @param input - Can be string, object, array, or any combination
 * @returns Array of valid absolute image URLs
 */
export declare function extractImageUrls(input: any): string[];
/**
 * Transforms API Category to StoreCategory format
 * Uses dedicated category image extraction function for independent validation
 */
export declare function transformCategoryToStoreCategory(apiCategory: Category): StoreCategory;
/**
 * Transforms API Product to StoreProduct format
 * Calculates inStock based on trackInventory and inventory data
 */
export declare function transformProductToStoreProduct(apiProduct: Product): StoreProduct;
/**
 * Transforms API Service to StoreService format
 */
export declare function transformServiceToStoreService(apiService: Service): StoreService;
/**
 * Result type for getStoreConfigAsync
 */
export interface StoreConfigResult {
    storeConfig: StoreConfig | null;
    maintenanceMode: boolean;
}
/**
 * Async function to get store configuration
 * - For demo stores: uses mock data from mock-stores
 * - For real stores: fetches from API and transforms to StoreConfig
 * - Returns null storeConfig if store not found (for 404 handling)
 * - Returns maintenanceMode flag when store exists but is not published/active
 */
export declare function getStoreConfigAsync(storeSlug: string): Promise<StoreConfigResult>;
//# sourceMappingURL=store-config-utils.d.ts.map
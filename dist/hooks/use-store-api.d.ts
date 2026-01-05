import { StoreResponse } from '../lib/services/store.service';
import { StoreConfig } from '../lib/store-config';
export interface UseStoreApiResult {
    store: StoreConfig | StoreResponse | null;
    loading: boolean;
    error: string | null;
}
/**
 * Hook to fetch store data from API or use mock data for demo stores
 */
export declare function useStoreApi(storeSlug: string | undefined): UseStoreApiResult;
//# sourceMappingURL=use-store-api.d.ts.map
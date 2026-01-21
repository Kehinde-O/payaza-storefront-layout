// Re-export functions from mock-stores for convenience
// Import first, then export to ensure webpack can resolve properly
import { getStoreConfig, getAllStores, isValidStoreSlug } from './mock-stores';
export { getStoreConfig, getAllStores, isValidStoreSlug };
export type { StoreConfig } from './store-types';


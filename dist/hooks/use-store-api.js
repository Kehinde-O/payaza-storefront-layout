import { useEffect, useState } from 'react';
import { storeService } from '../lib/services/store.service';
import { shouldUseAPI, getBaseStoreSlug } from '../lib/utils/demo-detection';
import { getStoreConfig } from '../lib/store-config';
import { useLoading } from '../lib/loading-context';
/**
 * Hook to fetch store data from API or use mock data for demo stores
 */
export function useStoreApi(storeSlug) {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    useEffect(() => {
        if (!storeSlug) {
            setLoading(false);
            return;
        }
        const fetchStore = async () => {
            try {
                setLoading(true);
                setError(null);
                if (shouldUseAPI(storeSlug)) {
                    // Use API for non-demo stores - signal backend loading
                    startBackendLoading?.();
                    const baseSlug = getBaseStoreSlug(storeSlug);
                    const storeData = await storeService.getStoreBySlug(baseSlug);
                    // Transform API response to StoreConfig format if needed
                    setStore(storeData);
                }
                else {
                    // Use mock data for demo stores
                    const baseSlug = getBaseStoreSlug(storeSlug);
                    const mockStore = getStoreConfig(baseSlug);
                    if (mockStore) {
                        setStore(mockStore);
                    }
                    else {
                        setError('Store not found');
                    }
                }
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch store';
                setError(errorMessage);
                // Fallback to mock data on error
                if (storeSlug) {
                    const baseSlug = getBaseStoreSlug(storeSlug);
                    const mockStore = getStoreConfig(baseSlug);
                    if (mockStore) {
                        setStore(mockStore);
                        setError(null);
                    }
                }
            }
            finally {
                setLoading(false);
                stopBackendLoading?.();
            }
        };
        fetchStore();
    }, [storeSlug, startBackendLoading, stopBackendLoading]);
    return { store, loading, error };
}

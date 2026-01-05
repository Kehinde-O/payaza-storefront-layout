import { useEffect, useState } from 'react';
import { storeService, StoreResponse } from '@/lib/services/store.service';
import { shouldUseAPI, getBaseStoreSlug } from '@/lib/utils/demo-detection';
import { getStoreConfig, StoreConfig } from '@/lib/store-config';
import { useLoading } from '@/lib/loading-context';

export interface UseStoreApiResult {
  store: StoreConfig | StoreResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch store data from API or use mock data for demo stores
 */
export function useStoreApi(storeSlug: string | undefined): UseStoreApiResult {
  const [store, setStore] = useState<StoreConfig | StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get loading context if available
  let loadingContext: ReturnType<typeof useLoading> | null = null;
  try {
    loadingContext = useLoading();
  } catch {
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
          setStore(storeData as any);
        } else {
          // Use mock data for demo stores
          const baseSlug = getBaseStoreSlug(storeSlug);
          const mockStore = getStoreConfig(baseSlug);
          if (mockStore) {
            setStore(mockStore);
          } else {
            setError('Store not found');
          }
        }
      } catch (err) {
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
      } finally {
        setLoading(false);
        stopBackendLoading?.();
      }
    };

    fetchStore();
  }, [storeSlug, startBackendLoading, stopBackendLoading]);

  return { store, loading, error };
}


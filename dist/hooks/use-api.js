import { useState, useEffect, useCallback } from 'react';
import { useLoading } from '../lib/loading-context';
/**
 * Generic API hook for async operations
 */
export function useApi(apiFunction, options = {}) {
    const { immediate = false, onSuccess, onError } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
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
    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        startBackendLoading?.();
        try {
            const result = await apiFunction(...args);
            setData(result);
            onSuccess?.(result);
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            onError?.(error);
            throw error;
        }
        finally {
            setLoading(false);
            stopBackendLoading?.();
        }
    }, [apiFunction, onSuccess, onError, startBackendLoading, stopBackendLoading]);
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return { data, loading, error, execute, reset };
}

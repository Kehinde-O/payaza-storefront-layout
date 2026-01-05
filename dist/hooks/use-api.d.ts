export interface UseApiOptions<T> {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}
export interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    execute: (...args: any[]) => Promise<T | undefined>;
    reset: () => void;
}
/**
 * Generic API hook for async operations
 */
export declare function useApi<T>(apiFunction: (...args: any[]) => Promise<T>, options?: UseApiOptions<T>): UseApiResult<T>;
//# sourceMappingURL=use-api.d.ts.map
interface UseContentReadyOptions {
    pathname: string;
    enabled?: boolean;
    minDisplayTime?: number;
    maxWaitTime?: number;
    checkInterval?: number;
}
/**
 * Hook to detect when page content is ready for display
 * Uses DOM observation to verify key content elements are present
 */
export declare function useContentReady({ pathname, enabled, minDisplayTime, maxWaitTime, checkInterval, }: UseContentReadyOptions): {
    isContentReady: boolean;
    contentPercentage: number;
};
export {};
//# sourceMappingURL=use-content-ready.d.ts.map
import 'nprogress/nprogress.css';
interface LoadingContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    loadingActions: Set<string>;
    setActionLoading: (actionId: string, loading: boolean) => void;
    isActionLoading: (actionId: string) => boolean;
    startPageLoading: (targetPathname?: string) => void;
    stopPageLoading: () => void;
    isBackendLoading: boolean;
    startBackendLoading: () => void;
    stopBackendLoading: () => void;
}
export declare function LoadingProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useLoading(): LoadingContextType;
export {};
//# sourceMappingURL=loading-context.d.ts.map
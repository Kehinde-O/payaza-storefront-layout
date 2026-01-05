'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { PageLoader } from '@/components/ui/page-loader';
import { RouteSkeletonLoader } from '@/components/ui/route-skeleton-loader';
import { useContentReady } from '@/hooks/use-content-ready';

// Configure NProgress
if (typeof window !== 'undefined') {
  NProgress.configure({ 
    showSpinner: true,
    trickleSpeed: 200,
    minimum: 0.08,
    easing: 'ease',
    speed: 500
  });
}

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

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [targetPathname, setTargetPathname] = useState<string | null>(null);
  const [backendLoadingCount, setBackendLoadingCount] = useState(0);
  const pathname = usePathname();
  
  // Safely get searchParams - may not be available during static generation
  let searchParams: ReturnType<typeof useSearchParams> | null = null;
  try {
    searchParams = useSearchParams();
  } catch {
    // useSearchParams not available (e.g., during static generation)
    searchParams = null;
  }
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathnameRef = useRef<string | null>(null);
  const skeletonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use content detection to determine when page content is ready
  const { isContentReady } = useContentReady({
    pathname: targetPathname || pathname,
    enabled: isPageTransitioning,
    minDisplayTime: 300,
    maxWaitTime: 5000,
    checkInterval: 100,
  });

  // Track route changes for page transitions with progress bar
  useEffect(() => {
    // Only trigger on actual pathname changes, not initial mount
    if (previousPathnameRef.current === null) {
      previousPathnameRef.current = pathname;
      return;
    }

    if (previousPathnameRef.current !== pathname) {
      // Route changed - start loading
      setIsPageTransitioning(true);
      setTargetPathname(pathname); // Set target pathname for skeleton
      if (typeof window !== 'undefined') {
        NProgress.start();
      }
      previousPathnameRef.current = pathname;

      // Clear any existing timeouts
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }

      // Note: Content detection will handle hiding the skeleton
      // This timeout is now a fallback only
      skeletonTimeoutRef.current = setTimeout(() => {
        // Fallback: hide after 3 seconds regardless (reduced from 5)
        setIsPageTransitioning(false);
        setIsLoading(false); // Also reset isLoading
        setTargetPathname(null);
        if (typeof window !== 'undefined') {
          NProgress.done();
        }
      }, 3000); // Fallback timeout - reduced to 3 seconds
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, [pathname, searchParams?.toString()]);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (typeof window !== 'undefined') {
      if (loading) {
        NProgress.start();
      } else {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          NProgress.done();
        }, 100);
      }
    }
  }, []);

  const startPageLoading = useCallback((targetPathnameParam?: string) => {
    setIsPageTransitioning(true);
    setIsLoading(true);
    // Use provided target pathname or current pathname
    setTargetPathname(targetPathnameParam || pathname);
    if (typeof window !== 'undefined') {
      NProgress.start();
    }
  }, [pathname]);

  const stopPageLoading = useCallback(() => {
    // Clear any pending timeouts
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
    }
    setIsPageTransitioning(false);
    setIsLoading(false);
    setTargetPathname(null);
    if (typeof window !== 'undefined') {
      NProgress.done();
    }
  }, []);

  const setActionLoading = useCallback((actionId: string, loading: boolean) => {
    setLoadingActions(prev => {
      const next = new Set(prev);
      if (loading) {
        next.add(actionId);
      } else {
        next.delete(actionId);
      }
      return next;
    });
  }, []);

  const isActionLoading = useCallback((actionId: string) => {
    return loadingActions.has(actionId);
  }, [loadingActions]);

  const startBackendLoading = useCallback(() => {
    setBackendLoadingCount(prev => prev + 1);
  }, []);

  const stopBackendLoading = useCallback(() => {
    setBackendLoadingCount(prev => Math.max(0, prev - 1));
  }, []);

  const isBackendLoading = backendLoadingCount > 0;

  // Hide skeleton when content is ready AND backend loading is complete
  // This ensures spinner and blurred background close together
  useEffect(() => {
    if (isPageTransitioning && isContentReady && !isBackendLoading) {
      // Content is ready AND backend loading is complete, hide skeleton and loader together
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
      setIsPageTransitioning(false);
      setIsLoading(false); // Also reset isLoading
      setTargetPathname(null);
      if (typeof window !== 'undefined') {
        NProgress.done();
      }
    }
  }, [isPageTransitioning, isContentReady, isBackendLoading]);

  // Additional safety: Hide loader if page transition completes but content detection didn't trigger
  useEffect(() => {
    if (!isPageTransitioning && isLoading) {
      // If we're not transitioning but still loading, check if we should hide
      // This handles cases where content detection might have missed
      const hideTimeout = setTimeout(() => {
        setIsLoading(false);
        if (typeof window !== 'undefined') {
          NProgress.done();
        }
      }, 1000); // Give it 1 second after transition ends

      return () => clearTimeout(hideTimeout);
    }
  }, [isPageTransitioning, isLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingActions,
        setActionLoading,
        isActionLoading,
        startPageLoading,
        stopPageLoading,
        isBackendLoading,
        startBackendLoading,
        stopBackendLoading,
      }}
    >
      {children}
      {/* Show skeleton loader during page transitions */}
      {isPageTransitioning && targetPathname && (
        <RouteSkeletonLoader pathname={targetPathname} />
      )}
      {/* Show simple loader for other loading states */}
      {isLoading && !isPageTransitioning && <PageLoader fullPage />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}


'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StoreConfig, StoreLayoutType } from '@/lib/store-types';
import { getPreviewDataByLayout } from '@/lib/preview-data';
import {
  ToastProvider,
  AlertModalProvider,
  StoreProvider,
  LoadingProvider,
} from '../index';
import { PreviewRouter } from './PreviewRouter';

interface LayoutPreviewProps {
  layout: StoreLayoutType | string;
  className?: string;
  initialRoute?: string;
  onRouteChange?: (route: string) => void;
  config?: StoreConfig | null;
}

/**
 * LayoutPreview Component
 * 
 * Optimized for memory efficiency and performance.
 */
function LayoutPreviewWithRouter({ 
  layout, 
  className,
  initialRoute,
  onRouteChange,
  config
}: LayoutPreviewProps) {
  const [currentRoute, setCurrentRoute] = useState<string>(initialRoute || '/');
  const [isClient, setIsClient] = useState(false);

  // Memoize preview data to prevent unnecessary recalculations
  const previewData = useMemo(() => {
    const layoutString = typeof layout === 'string' ? layout : String(layout || 'clothing');
    
    if (config) {
      return {
        ...config,
        layout: ((typeof config.layout === 'string' ? config.layout : layoutString) || layoutString) as StoreLayoutType,
      };
    }
    return getPreviewDataByLayout(layoutString);
  }, [config, layout]);

  // Read route from URL safely
  const getRouteFromUrl = useCallback((): string => {
    if (typeof window === 'undefined') return '/';
    const urlParams = new URLSearchParams(window.location.search);
    const routeParam = urlParams.get('route');
    if (!routeParam) return '/';
    
    try {
      const decoded = decodeURIComponent(routeParam);
      return decoded.startsWith('/') ? decoded : `/${decoded}`;
    } catch {
      return routeParam.startsWith('/') ? routeParam : `/${routeParam}`;
    }
  }, []);

  // Sync initial route from URL or prop
  useEffect(() => {
    setIsClient(true);
    const urlRoute = getRouteFromUrl();
    if (urlRoute !== '/') {
      setCurrentRoute(urlRoute);
    } else if (initialRoute) {
      setCurrentRoute(initialRoute.startsWith('/') ? initialRoute : `/${initialRoute}`);
    }
  }, []);

  // CRITICAL: Update route when initialRoute prop changes (e.g., from UPDATE_ROUTE message)
  // This ensures the preview updates when the editor switches pages
  useEffect(() => {
    if (!isClient) return;
    if (initialRoute) {
      const normalizedRoute = initialRoute.startsWith('/') ? initialRoute : `/${initialRoute}`;
      if (currentRoute !== normalizedRoute) {
        setCurrentRoute(normalizedRoute);
      }
    }
  }, [initialRoute, isClient, currentRoute]);

  // Single source of truth for URL changes
  useEffect(() => {
    if (!isClient) return;

    const syncRoute = () => {
      const newRoute = getRouteFromUrl();
      setCurrentRoute(prev => {
        if (prev !== newRoute) {
          onRouteChange?.(newRoute);
          return newRoute;
        }
        return prev;
      });
    };

    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [isClient, getRouteFromUrl, onRouteChange]);

  const handleNavigate = useCallback((route: string) => {
    const normalized = route.startsWith('/') ? route : `/${route}`;
    setCurrentRoute(normalized);
    onRouteChange?.(normalized);
    
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('route', normalized);
      window.history.pushState({ route: normalized }, '', newUrl.toString());
      // Only dispatch if necessary to avoid excessive cycles
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [onRouteChange]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/10">
        <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // CSS variables for theming
  const themeStyle = {
    '--store-primary': previewData?.branding.primaryColor || '#000',
    '--store-secondary': previewData?.branding.secondaryColor || previewData?.branding.primaryColor || '#000',
    '--store-accent': previewData?.branding.accentColor || previewData?.branding.primaryColor || '#000',
  } as React.CSSProperties;

  return (
    <div style={themeStyle} className={`min-h-screen w-full flex flex-col ${className || ''}`}>
      <ToastProvider>
        <AlertModalProvider>
          <StoreProvider initialConfig={previewData} storeSlug={previewData?.slug || ''}>
            <LoadingProvider>
              <PreviewRouter 
                storeConfig={previewData!} 
                route={currentRoute}
                onNavigate={handleNavigate}
              />
            </LoadingProvider>
          </StoreProvider>
        </AlertModalProvider>
      </ToastProvider>
    </div>
  );
}

export const LayoutPreview = React.memo(function LayoutPreview(props: LayoutPreviewProps) {
  return <LayoutPreviewWithRouter {...props} />;
});

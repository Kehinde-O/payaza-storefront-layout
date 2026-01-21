import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StoreConfig } from '../../lib/store-types';
import { isDeepEqual } from '../../lib/utils';

interface IframePreviewProps {
  layoutId: string;
  config: StoreConfig;
  activePageId: string;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  selectedSection?: string | null;
  className?: string;
}

export const IframePreview: React.FC<IframePreviewProps> = ({
  layoutId,
  config,
  activePageId,
  viewMode,
  selectedSection,
  className = '',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  
  // Force iframe reload when viewMode changes to ensure proper viewport
  useEffect(() => {
    setIframeKey(prev => prev + 1);
    setIsReady(false);
  }, [viewMode]);

  // Map the pageId to a route for the preview
  const route = activePageId === 'home' ? '/' : `/${activePageId}`;

  // Handle preview readiness and configuration updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_READY') {
        setIsReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update iframe when config, route, or viewMode changes
  const lastSentConfigRef = useRef<StoreConfig | null>(null);
  const requestRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      // Use requestAnimationFrame to throttle updates to the iframe
      // This prevents "flooding" the iframe with messages during rapid typing
      // while still feeling instantaneous (max 60fps)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      requestRef.current = requestAnimationFrame(() => {
        if (!iframeRef.current?.contentWindow) return;

        // Only send config update if it has changed to reduce iframe re-renders
        // Use isDeepEqual to avoid expensive JSON.stringify on every update
        if (!lastSentConfigRef.current || !isDeepEqual(config, lastSentConfigRef.current)) {
          // Ensure isPreview is set to true for preview mode
          const previewConfig = {
            ...config,
            isPreview: true,
            // Set headerConfig.show to false by default in preview unless explicitly set
            headerConfig: {
              ...config.headerConfig,
              show: config.headerConfig?.show ?? false
            }
          };
          iframeRef.current.contentWindow.postMessage(
            { type: 'UPDATE_CONFIG', config: previewConfig },
            '*'
          );
          lastSentConfigRef.current = config;
        }

        iframeRef.current.contentWindow.postMessage(
          { type: 'UPDATE_ROUTE', route },
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          { type: 'UPDATE_VIEW_MODE', viewMode },
          '*'
        );
      });
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [config, route, viewMode, isReady]);

  // Sync selection state
  useEffect(() => {
    if (isReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SECTION_SELECTED_SYNC', section: selectedSection },
        '*'
      );
    }
  }, [selectedSection, isReady]);

  // Construct iframe URL - include viewMode for proper viewport handling
  const previewUrl = useMemo(() => {
    const params = new URLSearchParams({
      route: route,
      iframe: 'true',
      viewMode: viewMode
    });
    
    // Include storeId from config if available (for store-setup preview)
    if (config?.id) {
      params.set('storeId', config.id);
    }
    
    // Include storeSlug from config if available
    if (config?.slug) {
      params.set('storeSlug', config.slug);
    }
    
    // Include includeDraft flag for store-setup previews
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/dashboard/store-setup')) {
        params.set('includeDraft', 'true');
      }
    }
    
    // Dynamically determine the base path for the preview
    // Priority order:
    // 1. Dashboard context (storefront-admin): /dashboard/store-setup/preview/ (always use this for dashboard)
    // 2. Standalone (store-layout-preview app): /preview/
    // 
    // CRITICAL: All dashboard previews MUST use store-setup preview endpoint
    // The old /dashboard/layout-content/preview endpoint is completely removed
    let basePath = '/preview'; // Default for standalone store-layout-preview app
    
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      
      // Priority 1: If we have store config with id, we're definitely in store-setup context
      // This is the most reliable indicator
      if (config?.id) {
        basePath = '/dashboard/store-setup/preview';
      }
      // Priority 2: If we're specifically in store-setup context, use store-setup preview
      // This is the most specific check for store-setup routes (editor, preview, etc.)
      else if (pathname.includes('/dashboard/store-setup')) {
        basePath = '/dashboard/store-setup/preview';
      }
      // Priority 3: If we're in any other dashboard context, use store-setup preview
      // This ensures ALL dashboard previews use the store-setup endpoint
      // NOTE: This explicitly replaces the old layout-content endpoint
      else if (pathname.includes('/dashboard')) {
        basePath = '/dashboard/store-setup/preview';
      }
    }
    
    // Final safety check: NEVER use layout-content path
    if (basePath.includes('layout-content')) {
      basePath = '/dashboard/store-setup/preview';
    }
    
    return `${basePath}/${layoutId}?${params.toString()}`;
  }, [layoutId, route, viewMode, config?.id, config?.slug]);

  // Define actual device dimensions for true device experience
  const deviceDimensions = useMemo(() => {
    switch (viewMode) {
      case 'mobile':
        // Standard mobile: iPhone 12/13/14 (390x844) or iPhone SE (375x667)
        return { width: 390, height: 844, rounded: 'rounded-[3.5rem]', border: 'border-[14px]' };
      case 'tablet':
        // Standard tablet: iPad (768x1024) or iPad Pro (1024x1366)
        return { width: 768, height: 1024, rounded: 'rounded-2xl', border: 'border-[8px]' };
      case 'desktop':
      default:
        // Desktop: Full width, no constraints - use actual viewport
        return { width: '100%', height: '100%', rounded: '', border: '' };
    }
  }, [viewMode]);

  return (
    <div className={`relative w-full h-full ${viewMode === 'desktop' ? '' : 'flex items-center justify-center bg-slate-100 p-4 md:p-8'} ${className}`}>
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden flex flex-col ${
          viewMode === 'desktop' 
            ? `w-full h-full shadow-none`
            : `bg-white shadow-2xl ${deviceDimensions.rounded} ${deviceDimensions.border} border-slate-900`
        }`}
        style={
          viewMode === 'desktop' 
            ? { 
                width: '100%', 
                height: '100%',
                margin: 0,
                padding: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }
            : { 
                width: `${deviceDimensions.width}px`, 
                height: `${deviceDimensions.height}px` 
              }
        }
      >
        <div className={`flex-1 relative overflow-hidden ${viewMode === 'desktop' ? '' : 'bg-white'}`} style={viewMode === 'desktop' ? { width: '100%', height: '100%' } : undefined}>
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Preview</p>
              </div>
            </div>
          )}
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-none"
            title="Layout Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox"
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block',
              border: 'none',
              margin: 0,
              padding: 0
            }}
          />
        </div>
      </div>
    </div>
  );
};

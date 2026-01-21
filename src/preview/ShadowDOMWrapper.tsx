'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ShadowDOMWrapperProps {
  children: ReactNode;
  className?: string;
  onReady?: () => void;
  onLinkClick?: (href: string) => void;
  storeSlug?: string;
}

/**
 * ShadowDOMWrapper Component
 * 
 * Wraps children in a Shadow DOM for complete style and DOM isolation using React Portals.
 * This ensures that React Contexts (like Router, Theme, Auth) are preserved from the parent tree,
 * while styles remain encapsulated.
 */
export function ShadowDOMWrapper({ children, className, onReady, onLinkClick, storeSlug }: ShadowDOMWrapperProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  // Initialize Shadow Root on mount
  useEffect(() => {
    if (hostRef.current && !shadowRoot) {
      // Create shadow root if it doesn't exist
      const root = hostRef.current.attachShadow({ mode: 'open' });
      setShadowRoot(root);
      onReady?.();
    }
  }, [onReady, shadowRoot]);

  // Handle link clicks via React Event Capture
  // Capturing allows us to intercept the click BEFORE internal Link components handle it
  const handleLinkClickCapture = (e: React.MouseEvent) => {
    if (!onLinkClick) return;

    // Find closest anchor tag
    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (!link || !link.href) return;

    try {
      const url = new URL(link.href, window.location.origin);
      const pathname = url.pathname;

      // Only intercept internal links
      if (url.origin !== window.location.origin) {
        return;
      }

      // Extract route logic
      let route = pathname;

      // Check if pathname starts with store slug (e.g., /modern-eats/contact)
      if (storeSlug && pathname.startsWith(`/${storeSlug}`)) {
        route = pathname.slice(storeSlug.length + 1);
        if (!route || route === '') {
          route = '/';
        }
      } else if (pathname === '/' || pathname === '') {
        route = '/';
      }

      // Normalize route
      if (route && !route.startsWith('/')) {
        route = `/${route}`;
      }

      if (!route) route = '/';

      // Intercept navigation
      e.preventDefault();
      e.stopPropagation();
      onLinkClick(route);

    } catch (err) {
      console.warn('[ShadowDOMWrapper] Failed to parse link URL:', err);
    }
  };

  return (
    <div ref={hostRef} className={className} style={{ width: '100%', minHeight: '100%' }}>
      {shadowRoot && createPortal(
        <>
          <style>{`
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            #shadow-preview-container {
              width: 100%;
              min-height: 100%;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
          `}</style>
          <div
            id="shadow-preview-container"
            onClickCapture={handleLinkClickCapture}
          >
            {children}
          </div>
        </>,
        shadowRoot as any
      )}
    </div>
  );
}


'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getContentSelectors, detectRouteType, type RouteType } from '@/lib/content-selectors';

interface UseContentReadyOptions {
  pathname: string;
  enabled?: boolean;
  minDisplayTime?: number; // Minimum time to show skeleton (ms)
  maxWaitTime?: number; // Maximum time to wait (ms)
  checkInterval?: number; // How often to check (ms)
}

/**
 * Hook to detect when page content is ready for display
 * Uses DOM observation to verify key content elements are present
 */
export function useContentReady({
  pathname,
  enabled = true,
  minDisplayTime = 300,
  maxWaitTime = 5000,
  checkInterval = 100,
}: UseContentReadyOptions) {
  const [isContentReady, setIsContentReady] = useState(false);
  const [contentPercentage, setContentPercentage] = useState(0);
  const observerRef = useRef<MutationObserver | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const minTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkContent = useCallback(() => {
    if (!enabled || typeof window === 'undefined') {
      return false;
    }

    // Quick check: if document is ready and has substantial content, consider it ready
    if (document.readyState === 'complete') {
      const bodyHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      // If body has more than viewport height, likely content is loaded
      if (bodyHeight > viewportHeight * 0.5) {
        const routeType = detectRouteType(pathname);
        const config = getContentSelectors(routeType);
        
        // For generic pages, be more lenient
        if (routeType === 'generic') {
          return true; // If document is complete and has height, consider ready
        }
      }
    }

    const routeType = detectRouteType(pathname);
    const config = getContentSelectors(routeType);
    
    // Check required selectors first
    if (config.requiredSelectors && config.requiredSelectors.length > 0) {
      const allRequiredPresent = config.requiredSelectors.every(selector => {
        const elements = document.querySelectorAll(selector);
        return elements.length > 0 && Array.from(elements).some(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        });
      });
      
      if (!allRequiredPresent) {
        setContentPercentage(0);
        return false;
      }
    }

    // Check all selectors and count visible elements
    let totalFound = 0;
    let totalExpected = 0;

    for (const selector of config.selectors) {
      const elements = document.querySelectorAll(selector);
      totalExpected += elements.length;
      
      const visibleElements = Array.from(elements).filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          style.opacity !== '0'
        );
      });
      
      totalFound += visibleElements.length;
    }

    // Calculate percentage
    const percentage = totalExpected > 0 ? (totalFound / totalExpected) * 100 : 0;
    setContentPercentage(percentage);

    // Check if content is ready based on config
    let isReady = false;

    if (config.minElements !== undefined) {
      isReady = totalFound >= config.minElements;
    }

    if (config.minPercentage !== undefined) {
      isReady = isReady || percentage >= config.minPercentage;
    }

    // If no specific requirements, just check if any content is present
    if (config.minElements === undefined && config.minPercentage === undefined) {
      isReady = totalFound > 0;
    }

    // For generic pages, also check if main content area exists (more lenient)
    if (routeType === 'generic' && !isReady) {
      // Check if there's any substantial content on the page
      const mainContent = document.querySelector('main, [data-content-ready], .container, article');
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect();
        if (rect.height > 100) { // At least 100px of content
          isReady = true;
        }
      }
    }

    return isReady;
  }, [pathname, enabled]);

  useEffect(() => {
    if (!enabled) {
      setIsContentReady(false);
      setContentPercentage(0);
      return;
    }

    // Reset state when pathname changes
    setIsContentReady(false);
    setContentPercentage(0);
    startTimeRef.current = Date.now();

    // Clear any existing timeouts/intervals
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    if (minTimeTimeoutRef.current) {
      clearTimeout(minTimeTimeoutRef.current);
    }
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Wait a bit for initial render, but check immediately if document is already ready
    const checkImmediately = document.readyState === 'complete';
    const delay = checkImmediately ? 50 : 100;
    
    const initialDelay = setTimeout(() => {
      // Start checking content
      const performCheck = () => {
        const now = Date.now();
        const elapsed = startTimeRef.current ? now - startTimeRef.current : 0;

        // Check if max wait time exceeded
        if (elapsed >= maxWaitTime) {
          setIsContentReady(true);
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
          }
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
          return;
        }

        // Check if content is ready
        const ready = checkContent();

        // If ready and minimum time has passed, mark as ready immediately
        if (ready && elapsed >= minDisplayTime) {
          setIsContentReady(true);
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
          }
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
          return; // Exit early
        } 
        
        // If ready but minimum time hasn't passed, wait for minDisplayTime
        if (ready && elapsed < minDisplayTime) {
          // Content is ready but minimum display time hasn't passed
          // Set a timeout to mark as ready after minDisplayTime
          if (minTimeTimeoutRef.current) {
            clearTimeout(minTimeTimeoutRef.current);
          }
          minTimeTimeoutRef.current = setTimeout(() => {
            setIsContentReady(true);
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
            }
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }, minDisplayTime - elapsed);
        }
      };

      // Perform initial check
      performCheck();

      // Set up interval checking
      checkIntervalRef.current = setInterval(performCheck, checkInterval);

      // Set up MutationObserver to watch for DOM changes
      observerRef.current = new MutationObserver(() => {
        performCheck();
      });

      // Observe the entire document body for changes
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }, 100);

    return () => {
      clearTimeout(initialDelay);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (minTimeTimeoutRef.current) {
        clearTimeout(minTimeTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname, enabled, minDisplayTime, maxWaitTime, checkInterval, checkContent]);

  return {
    isContentReady,
    contentPercentage,
  };
}


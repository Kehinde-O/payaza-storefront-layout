'use client';
import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsService } from '../lib/services/analytics.service';
import { useStore } from '../lib/store-context';
import { useAuth } from '../lib/auth-context';
/**
 * React hook for analytics tracking
 * Automatically tracks page views and provides trackEvent function
 */
export function useAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { store } = useStore();
    const { user } = useAuth();
    const lastTrackedPath = useRef(null);
    /**
     * Track a custom event
     */
    const trackEvent = useCallback(async (options) => {
        if (!store?.id) {
            console.warn('Analytics: Cannot track event, store not loaded');
            return;
        }
        try {
            await analyticsService.trackEvent({
                storeId: store.id,
                eventType: options.eventType,
                userId: user?.id || null,
                metadata: options.metadata,
            });
        }
        catch (error) {
            // Silently fail - analytics should not break the app
            console.warn('Analytics tracking error:', error);
        }
    }, [store?.id, user?.id]);
    /**
     * Track page view
     */
    useEffect(() => {
        if (!store?.id) {
            return;
        }
        const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        // Only track if path changed (avoid duplicate tracking)
        if (currentPath === lastTrackedPath.current) {
            return;
        }
        lastTrackedPath.current = currentPath;
        // Small delay to ensure page is fully loaded
        const timeoutId = setTimeout(() => {
            trackEvent({
                eventType: 'page_view',
                metadata: {
                    path: pathname,
                    query: searchParams?.toString() || undefined,
                },
            });
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [pathname, searchParams, store?.id, trackEvent]);
    return {
        trackEvent,
    };
}

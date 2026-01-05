export type EventType = 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'search' | 'category_view' | 'checkout_start' | 'checkout_complete' | 'wishlist_add' | 'wishlist_remove';
export interface TrackEventParams {
    storeId: string;
    eventType: EventType;
    userId?: string | null;
    metadata?: Record<string, any>;
}
/**
 * Analytics service for tracking user events
 */
declare class AnalyticsService {
    private sessionId;
    private eventQueue;
    private isProcessingQueue;
    private readonly QUEUE_FLUSH_INTERVAL;
    private readonly MAX_QUEUE_SIZE;
    /**
     * Get or create session ID
     */
    getSessionId(): string;
    /**
     * Detect device type
     */
    detectDeviceType(): 'mobile' | 'desktop' | 'tablet' | null;
    /**
     * Extract UTM parameters from URL
     */
    getUTMParams(): {
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
        utmTerm?: string;
        utmContent?: string;
    };
    /**
     * Get referrer
     */
    getReferrer(): string | null;
    /**
     * Track an event
     */
    trackEvent(params: TrackEventParams): Promise<void>;
    /**
     * Queue an event for later sending
     */
    private queueEvent;
    /**
     * Process queued events
     */
    private processQueue;
    /**
     * Clear session (for logout)
     */
    clearSession(): void;
}
export declare const analyticsService: AnalyticsService;
export {};
//# sourceMappingURL=analytics.service.d.ts.map
import { EventType } from '../lib/services/analytics.service';
interface TrackEventOptions {
    eventType: EventType;
    metadata?: Record<string, any>;
}
/**
 * React hook for analytics tracking
 * Automatically tracks page views and provides trackEvent function
 */
export declare function useAnalytics(): {
    trackEvent: (options: TrackEventOptions) => Promise<void>;
};
export {};
//# sourceMappingURL=use-analytics.d.ts.map
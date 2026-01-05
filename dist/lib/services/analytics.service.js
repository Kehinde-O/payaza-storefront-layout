import { api } from '../api';
/**
 * Analytics service for tracking user events
 */
class AnalyticsService {
    constructor() {
        this.sessionId = null;
        this.eventQueue = [];
        this.isProcessingQueue = false;
        this.QUEUE_FLUSH_INTERVAL = 5000; // 5 seconds
        this.MAX_QUEUE_SIZE = 50;
    }
    /**
     * Get or create session ID
     */
    getSessionId() {
        if (typeof window === 'undefined') {
            return `server-${Date.now()}`;
        }
        if (!this.sessionId) {
            // Try to get from localStorage first
            const stored = localStorage.getItem('analytics_session_id');
            if (stored) {
                this.sessionId = stored;
            }
            else {
                // Generate new session ID
                this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('analytics_session_id', this.sessionId);
            }
        }
        return this.sessionId;
    }
    /**
     * Detect device type
     */
    detectDeviceType() {
        if (typeof window === 'undefined') {
            return null;
        }
        const width = window.innerWidth;
        const ua = navigator.userAgent.toLowerCase();
        if (/tablet|ipad|playbook|silk/i.test(ua)) {
            return 'tablet';
        }
        if (width < 768 || /mobile|iphone|ipod|android|blackberry|opera|mini|windows\s+phone|palm|iemobile/i.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }
    /**
     * Extract UTM parameters from URL
     */
    getUTMParams() {
        if (typeof window === 'undefined') {
            return {};
        }
        const params = new URLSearchParams(window.location.search);
        return {
            utmSource: params.get('utm_source') || undefined,
            utmMedium: params.get('utm_medium') || undefined,
            utmCampaign: params.get('utm_campaign') || undefined,
            utmTerm: params.get('utm_term') || undefined,
            utmContent: params.get('utm_content') || undefined,
        };
    }
    /**
     * Get referrer
     */
    getReferrer() {
        if (typeof window === 'undefined') {
            return null;
        }
        return document.referrer || null;
    }
    /**
     * Track an event
     */
    async trackEvent(params) {
        try {
            const sessionId = this.getSessionId();
            const utmParams = this.getUTMParams();
            // Merge UTM params into metadata
            const metadata = {
                ...params.metadata,
                ...utmParams,
            };
            const eventData = {
                storeId: params.storeId,
                eventType: params.eventType,
                sessionId,
                userId: params.userId || null,
                metadata,
            };
            // Add UTM params to query string for backend to extract
            const queryParams = new URLSearchParams();
            if (utmParams.utmSource)
                queryParams.set('utm_source', utmParams.utmSource);
            if (utmParams.utmMedium)
                queryParams.set('utm_medium', utmParams.utmMedium);
            if (utmParams.utmCampaign)
                queryParams.set('utm_campaign', utmParams.utmCampaign);
            if (utmParams.utmTerm)
                queryParams.set('utm_term', utmParams.utmTerm);
            if (utmParams.utmContent)
                queryParams.set('utm_content', utmParams.utmContent);
            const url = `/analytics/track${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            // Try to send immediately, but don't block on errors
            try {
                await api.post(url, eventData);
            }
            catch (error) {
                // If offline or error, queue the event
                console.warn('Failed to send analytics event, queuing for retry:', error);
                this.queueEvent(params);
            }
        }
        catch (error) {
            // Silently fail - analytics should not break the app
            console.warn('Analytics tracking error:', error);
            this.queueEvent(params);
        }
    }
    /**
     * Queue an event for later sending
     */
    queueEvent(params) {
        if (this.eventQueue.length >= this.MAX_QUEUE_SIZE) {
            // Remove oldest event
            this.eventQueue.shift();
        }
        this.eventQueue.push({
            params,
            timestamp: Date.now(),
        });
        // Start processing queue if not already processing
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }
    /**
     * Process queued events
     */
    async processQueue() {
        if (this.isProcessingQueue || this.eventQueue.length === 0) {
            return;
        }
        this.isProcessingQueue = true;
        try {
            while (this.eventQueue.length > 0) {
                const event = this.eventQueue.shift();
                if (!event)
                    break;
                try {
                    await this.trackEvent(event.params);
                }
                catch (error) {
                    // If still failing, put it back at the end
                    this.eventQueue.push(event);
                    break; // Stop processing if we hit an error
                }
            }
        }
        finally {
            this.isProcessingQueue = false;
            // Schedule next processing if queue is not empty
            if (this.eventQueue.length > 0) {
                setTimeout(() => this.processQueue(), this.QUEUE_FLUSH_INTERVAL);
            }
        }
    }
    /**
     * Clear session (for logout)
     */
    clearSession() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('analytics_session_id');
            this.sessionId = null;
        }
    }
}
export const analyticsService = new AnalyticsService();

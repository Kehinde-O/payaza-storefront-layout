/**
 * Video platform detection and URL conversion utilities
 */
export type VideoPlatform = 'youtube' | 'vimeo' | 'instagram' | 'tiktok' | 'direct' | 'unknown';
export interface VideoInfo {
    platform: VideoPlatform;
    videoId?: string;
    embedUrl?: string;
    directUrl?: string;
    thumbnailUrl?: string;
}
/**
 * Detects the video platform from a URL
 */
export declare function detectVideoPlatform(url: string): VideoPlatform;
/**
 * Parses a video URL and returns platform information
 */
export declare function parseVideoUrl(url: string): VideoInfo;
/**
 * Gets embed URL for background video (autoplay, muted, loop, no controls)
 */
export declare function getBackgroundVideoEmbedUrl(url: string): string | null;
/**
 * Gets embed URL for embedded video (with controls, no autoplay by default)
 */
export declare function getEmbedVideoUrl(url: string, autoplay?: boolean): string | null;
/**
 * Checks if a URL is a video URL (any platform)
 */
export declare function isVideoUrl(url: string): boolean;
//# sourceMappingURL=video-helpers.d.ts.map
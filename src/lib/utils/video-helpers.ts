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
export function detectVideoPlatform(url: string): VideoPlatform {
  if (!url || typeof url !== 'string') return 'unknown';

  const normalizedUrl = url.trim().toLowerCase();

  // YouTube detection
  if (
    normalizedUrl.includes('youtube.com') ||
    normalizedUrl.includes('youtu.be') ||
    normalizedUrl.includes('youtube-nocookie.com')
  ) {
    return 'youtube';
  }

  // Vimeo detection
  if (normalizedUrl.includes('vimeo.com')) {
    return 'vimeo';
  }

  // Instagram detection
  if (normalizedUrl.includes('instagram.com') || normalizedUrl.includes('instagr.am')) {
    return 'instagram';
  }

  // TikTok detection
  if (normalizedUrl.includes('tiktok.com')) {
    return 'tiktok';
  }

  // Direct video file detection (common video extensions)
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.m4v'];
  if (videoExtensions.some(ext => normalizedUrl.includes(ext))) {
    return 'direct';
  }

  return 'unknown';
}

/**
 * Extracts video ID from YouTube URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts video ID from Vimeo URL
 */
function extractVimeoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts video ID from Instagram URL
 */
function extractInstagramId(url: string): string | null {
  // Instagram URLs can be: instagram.com/p/VIDEO_ID or instagram.com/reel/VIDEO_ID
  const patterns = [
    /instagram\.com\/p\/([^\/\?]+)/,
    /instagram\.com\/reel\/([^\/\?]+)/,
    /instagr\.am\/p\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts video ID from TikTok URL
 */
function extractTikTokId(url: string): string | null {
  // TikTok URLs: tiktok.com/@username/video/VIDEO_ID
  const patterns = [
    /tiktok\.com\/.*\/video\/(\d+)/,
    /vm\.tiktok\.com\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parses a video URL and returns platform information
 */
export function parseVideoUrl(url: string): VideoInfo {
  if (!url || typeof url !== 'string') {
    return { platform: 'unknown' };
  }

  const platform = detectVideoPlatform(url);

  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return { platform: 'unknown' };
      }
      return {
        platform: 'youtube',
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    }

    case 'vimeo': {
      const videoId = extractVimeoId(url);
      if (!videoId) {
        return { platform: 'unknown' };
      }
      return {
        platform: 'vimeo',
        videoId,
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=1&background=1&controls=0`,
        thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
      };
    }

    case 'instagram': {
      const videoId = extractInstagramId(url);
      if (!videoId) {
        return { platform: 'unknown' };
      }
      // Instagram embeds require oEmbed API, so we'll use the direct URL
      return {
        platform: 'instagram',
        videoId,
        embedUrl: `https://www.instagram.com/p/${videoId}/embed/`,
        directUrl: url,
      };
    }

    case 'tiktok': {
      const videoId = extractTikTokId(url);
      if (!videoId) {
        return { platform: 'unknown' };
      }
      // TikTok embeds are complex, return direct URL
      return {
        platform: 'tiktok',
        videoId,
        directUrl: url,
      };
    }

    case 'direct': {
      return {
        platform: 'direct',
        directUrl: url,
      };
    }

    default:
      return { platform: 'unknown', directUrl: url };
  }
}

/**
 * Gets embed URL for background video (autoplay, muted, loop, no controls)
 */
export function getBackgroundVideoEmbedUrl(url: string): string | null {
  const videoInfo = parseVideoUrl(url);
  
  if (videoInfo.embedUrl) {
    return videoInfo.embedUrl;
  }

  if (videoInfo.directUrl && videoInfo.platform === 'direct') {
    return videoInfo.directUrl;
  }

  return null;
}

/**
 * Gets embed URL for embedded video (with controls, no autoplay by default)
 */
export function getEmbedVideoUrl(url: string, autoplay: boolean = false): string | null {
  const videoInfo = parseVideoUrl(url);
  
  if (videoInfo.platform === 'youtube' && videoInfo.videoId) {
    return `https://www.youtube.com/embed/${videoInfo.videoId}?autoplay=${autoplay ? 1 : 0}&controls=1&modestbranding=1&rel=0`;
  }

  if (videoInfo.platform === 'vimeo' && videoInfo.videoId) {
    return `https://player.vimeo.com/video/${videoInfo.videoId}?autoplay=${autoplay ? 1 : 0}&controls=1`;
  }

  if (videoInfo.embedUrl) {
    return videoInfo.embedUrl;
  }

  if (videoInfo.directUrl && videoInfo.platform === 'direct') {
    return videoInfo.directUrl;
  }

  return null;
}

/**
 * Checks if a URL is a video URL (any platform)
 */
export function isVideoUrl(url: string): boolean {
  const platform = detectVideoPlatform(url);
  return platform !== 'unknown';
}


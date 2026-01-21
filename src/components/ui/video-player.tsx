'use client';

import { useEffect, useRef, useState } from 'react';
import { parseVideoUrl, VideoInfo, getBackgroundVideoEmbedUrl, getEmbedVideoUrl } from '@/lib/utils/video-helpers';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  /**
   * Video URL - can be YouTube, Vimeo, Instagram, TikTok, or direct video file
   */
  src: string;

  /**
   * Poster image URL (for direct video files)
   */
  poster?: string;

  /**
   * Video context - determines behavior
   * - 'background': Autoplay, muted, loop, no controls (for hero backgrounds)
   * - 'embedded': With controls, optional autoplay (for content sections)
   * - 'inline': Standard video player with controls
   */
  context?: 'background' | 'embedded' | 'inline';

  /**
   * Whether to autoplay (only applies to embedded/inline contexts)
   */
  autoplay?: boolean;

  /**
   * Whether to show controls (only applies to embedded/inline contexts)
   */
  controls?: boolean;

  /**
   * Whether to loop the video
   */
  loop?: boolean;

  /**
   * Whether video is muted
   */
  muted?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Aspect ratio for embedded videos (e.g., '16/9', '4/3')
   */
  aspectRatio?: string;

  /**
   * Callback when video fails to load
   */
  onError?: (error: Error) => void;
}

export function VideoPlayer({
  src,
  poster,
  context = 'inline',
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  className,
  aspectRatio,
  onError,
}: VideoPlayerProps) {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    const info = parseVideoUrl(src);
    setVideoInfo(info);
    setHasError(info.platform === 'unknown' && !info.directUrl);
  }, [src]);

  // Handle error
  useEffect(() => {
    if (hasError && onError) {
      onError(new Error(`Failed to load video from: ${src}`));
    }
  }, [hasError, onError, src]);

  // Background video context - use iframe for YouTube/Vimeo, video tag for direct
  if (context === 'background') {
    // Helper to render poster fallback
    const renderFallback = () => {
      if (poster) {
        return (
          <img
            src={poster}
            alt="Hero Background"
            className={cn('absolute inset-0 w-full h-full object-cover', className)}
          />
        );
      }
      return null;
    };

    if (hasError) return renderFallback();
    if (!videoInfo) return renderFallback();

    // YouTube or Vimeo - use iframe
    if (videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') {
      const embedUrl = getBackgroundVideoEmbedUrl(src);
      if (!embedUrl) return renderFallback();

      return (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className={cn('absolute inset-0 w-full h-full', className)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ border: 'none', pointerEvents: 'none' }}
          title="Background video"
        />
      );
    }

    // Direct video file - use video tag
    if (videoInfo.platform === 'direct' && videoInfo.directUrl) {
      return (
        <video
          ref={videoRef}
          src={videoInfo.directUrl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className={cn('absolute inset-0 w-full h-full object-cover', className)}
          onError={() => setHasError(true)}
        />
      );
    }

    // Instagram/TikTok or unknown - not supported for background, use fallback
    return renderFallback();
  }

  // Embedded context - use iframe with controls
  if (context === 'embedded') {
    if (!videoInfo) return null;

    const embedUrl = getEmbedVideoUrl(src, autoplay);
    if (!embedUrl) return null;

    // YouTube or Vimeo - use iframe
    if (videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') {
      const aspectRatioStyle = aspectRatio
        ? { aspectRatio: aspectRatio.replace('-', '/') }
        : { aspectRatio: '16/9' };

      return (
        <div className={cn('relative w-full', className)} style={aspectRatioStyle}>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 'none' }}
            title="Video player"
            onError={() => setHasError(true)}
          />
        </div>
      );
    }

    // Direct video - use video tag
    if (videoInfo.platform === 'direct' && videoInfo.directUrl) {
      return (
        <video
          ref={videoRef}
          src={videoInfo.directUrl}
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          className={cn('w-full h-full', className)}
          onError={() => setHasError(true)}
        />
      );
    }

    // Instagram/TikTok - use embed iframe
    if (videoInfo.platform === 'instagram' && videoInfo.embedUrl) {
      const aspectRatioStyle = aspectRatio
        ? { aspectRatio: aspectRatio.replace('-', '/') }
        : { aspectRatio: '1/1' };

      return (
        <div className={cn('relative w-full', className)} style={aspectRatioStyle}>
          <iframe
            ref={iframeRef}
            src={videoInfo.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 'none' }}
            title="Instagram video"
            onError={() => setHasError(true)}
          />
        </div>
      );
    }

    return null;
  }

  // Inline context - standard video player
  if (context === 'inline') {
    if (!videoInfo) return null;

    // For YouTube/Vimeo in inline mode, we can use iframe or fallback to embed
    if (videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') {
      const embedUrl = getEmbedVideoUrl(src, autoplay);
      if (!embedUrl) return null;

      const aspectRatioStyle = aspectRatio
        ? { aspectRatio: aspectRatio.replace('-', '/') }
        : { aspectRatio: '16/9' };

      return (
        <div className={cn('relative w-full', className)} style={aspectRatioStyle}>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 'none' }}
            title="Video player"
            onError={() => setHasError(true)}
          />
        </div>
      );
    }

    // Direct video - use video tag
    if (videoInfo.platform === 'direct' && videoInfo.directUrl) {
      return (
        <video
          ref={videoRef}
          src={videoInfo.directUrl}
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          className={cn('w-full h-full', className)}
          onError={() => setHasError(true)}
        />
      );
    }

    return null;
  }

  return null;
}


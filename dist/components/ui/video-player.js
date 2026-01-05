'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { parseVideoUrl, getBackgroundVideoEmbedUrl, getEmbedVideoUrl } from '../../lib/utils/video-helpers';
import { cn } from '../../lib/utils';
export function VideoPlayer({ src, poster, context = 'inline', autoplay = false, controls = true, loop = false, muted = false, className, aspectRatio, onError, }) {
    const [videoInfo, setVideoInfo] = useState(null);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);
    const iframeRef = useRef(null);
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
        if (!videoInfo)
            return null;
        // YouTube or Vimeo - use iframe
        if (videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') {
            const embedUrl = getBackgroundVideoEmbedUrl(src);
            if (!embedUrl)
                return null;
            return (_jsx("iframe", { ref: iframeRef, src: embedUrl, className: cn('absolute inset-0 w-full h-full', className), allow: "autoplay; encrypted-media", allowFullScreen: true, style: { border: 'none' }, title: "Background video" }));
        }
        // Direct video file - use video tag
        if (videoInfo.platform === 'direct' && videoInfo.directUrl) {
            return (_jsx("video", { ref: videoRef, src: videoInfo.directUrl, poster: poster, autoPlay: true, muted: true, loop: true, playsInline: true, className: cn('absolute inset-0 w-full h-full object-cover', className), onError: () => setHasError(true) }));
        }
        // Instagram/TikTok - not ideal for background, but try to render
        if (videoInfo.platform === 'instagram' || videoInfo.platform === 'tiktok') {
            // For these platforms, we might want to show a placeholder or fallback
            return null;
        }
        return null;
    }
    // Embedded context - use iframe with controls
    if (context === 'embedded') {
        if (!videoInfo)
            return null;
        const embedUrl = getEmbedVideoUrl(src, autoplay);
        if (!embedUrl)
            return null;
        // YouTube or Vimeo - use iframe
        if (videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') {
            const aspectRatioStyle = aspectRatio
                ? { aspectRatio: aspectRatio.replace('-', '/') }
                : { aspectRatio: '16/9' };
            return (_jsx("div", { className: cn('relative w-full', className), style: aspectRatioStyle, children: _jsx("iframe", { ref: iframeRef, src: embedUrl, className: "absolute inset-0 w-full h-full", allow: "autoplay; encrypted-media", allowFullScreen: true, style: { border: 'none' }, title: "Video player", onError: () => setHasError(true) }) }));
        }
        // Direct video - use video tag
        if (videoInfo.platform === 'direct' && videoInfo.directUrl) {
            return (_jsx("video", { ref: videoRef, src: videoInfo.directUrl, poster: poster, autoPlay: autoplay, muted: muted, loop: loop, controls: controls, playsInline: true, className: cn('w-full h-full', className), onError: () => setHasError(true) }));
        }
        // Instagram/TikTok - use embed iframe
        if (videoInfo.platform === 'instagram' && videoInfo.embedUrl) {
            const aspectRatioStyle = aspectRatio
                ? { aspectRatio: aspectRatio.replace('-', '/') }
                : { aspectRatio: '1/1' };
            return (_jsx("div", { className: cn('relative w-full', className), style: aspectRatioStyle, children: _jsx("iframe", { ref: iframeRef, src: videoInfo.embedUrl, className: "absolute inset-0 w-full h-full", allow: "autoplay; encrypted-media", allowFullScreen: true, style: { border: 'none' }, title: "Instagram video", onError: () => setHasError(true) }) }));
        }
        return null;
    }
    // Inline context - standard video player
    if (context === 'inline') {
        if (!videoInfo)
            return null;
        // For YouTube/Vimeo in inline mode, we can use iframe or fallback to embed
        if (videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo') {
            const embedUrl = getEmbedVideoUrl(src, autoplay);
            if (!embedUrl)
                return null;
            const aspectRatioStyle = aspectRatio
                ? { aspectRatio: aspectRatio.replace('-', '/') }
                : { aspectRatio: '16/9' };
            return (_jsx("div", { className: cn('relative w-full', className), style: aspectRatioStyle, children: _jsx("iframe", { ref: iframeRef, src: embedUrl, className: "absolute inset-0 w-full h-full", allow: "autoplay; encrypted-media", allowFullScreen: true, style: { border: 'none' }, title: "Video player", onError: () => setHasError(true) }) }));
        }
        // Direct video - use video tag
        if (videoInfo.platform === 'direct' && videoInfo.directUrl) {
            return (_jsx("video", { ref: videoRef, src: videoInfo.directUrl, poster: poster, autoPlay: autoplay, muted: muted, loop: loop, controls: controls, playsInline: true, className: cn('w-full h-full', className), onError: () => setHasError(true) }));
        }
        return null;
    }
    return null;
}

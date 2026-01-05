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
export declare function VideoPlayer({ src, poster, context, autoplay, controls, loop, muted, className, aspectRatio, onError, }: VideoPlayerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=video-player.d.ts.map
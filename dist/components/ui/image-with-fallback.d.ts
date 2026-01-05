interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    fallbackText?: string;
    skeletonAspectRatio?: 'square' | '3/4' | '4/3' | '4/5' | '16/9' | 'auto';
    showSkeletonOnError?: boolean;
}
export declare function ImageWithFallback({ src, alt, className, fallbackSrc, fallbackText, skeletonAspectRatio, showSkeletonOnError, ...props }: ImageWithFallbackProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=image-with-fallback.d.ts.map
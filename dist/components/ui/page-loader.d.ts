interface PageLoaderProps {
    fullPage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}
export declare function PageLoader({ fullPage, size, className, text }: PageLoaderProps): import("react/jsx-runtime").JSX.Element;
interface InlineLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    color?: string;
}
export declare function InlineLoader({ size, className, color }: InlineLoaderProps): import("react/jsx-runtime").JSX.Element;
interface ButtonLoaderProps {
    className?: string;
    color?: string;
}
export declare function ButtonLoader({ className, color }: ButtonLoaderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=page-loader.d.ts.map
import { PromoBannerSection } from '../../../lib/store-types';
interface PromoBannerProps {
    config: PromoBannerSection | null | undefined;
    layoutStyle?: 'food' | 'electronics' | 'clothing' | 'default';
    className?: string;
}
export declare function PromoBanner({ config, layoutStyle, className }: PromoBannerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PromoBanner.d.ts.map
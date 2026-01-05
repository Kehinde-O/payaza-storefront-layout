import { StoreProduct } from '../../lib/store-types';
interface ProductCardProps {
    product: StoreProduct;
    storeSlug: string;
    onAddToCart: (product: StoreProduct) => void;
    onQuickView: (product: StoreProduct) => void;
    className?: string;
}
export declare function ProductCard({ product, storeSlug, onAddToCart, onQuickView, className }: ProductCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=product-card.d.ts.map
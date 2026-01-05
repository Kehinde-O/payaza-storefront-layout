import { StoreProduct } from '../../../lib/store-types';
interface ElectronicsGridProductCardProps {
    product: StoreProduct;
    storeSlug: string;
    onAddToCart: (product: StoreProduct) => void;
    index: number;
}
export declare function ElectronicsGridProductCard({ product, storeSlug, onAddToCart, index }: ElectronicsGridProductCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ElectronicsGridProductCard.d.ts.map
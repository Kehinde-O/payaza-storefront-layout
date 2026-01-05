import { jsx as _jsx } from "react/jsx-runtime";
import { ProductCardSkeleton } from './product-card-skeleton';
export function ProductGridSkeleton({ count = 8, columns = 4 }) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    };
    return (_jsx("div", { className: `grid ${gridCols[columns] || gridCols[4]} gap-6 mb-8`, children: Array.from({ length: count }).map((_, i) => (_jsx(ProductCardSkeleton, {}, i))) }));
}

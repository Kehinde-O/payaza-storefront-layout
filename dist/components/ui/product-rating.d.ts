interface ProductRatingProps {
    rating?: number | null;
    reviewCount?: number | null;
    size?: 'sm' | 'md' | 'lg';
    showReviewCount?: boolean;
    className?: string;
    showEmptyState?: boolean;
}
/**
 * Smart product rating component that handles:
 * - Products with reviews: Shows rating and review count
 * - Products without reviews: Shows "No reviews yet" or hides completely
 * - Zero ratings: Never shows "0.0", shows appropriate empty state instead
 */
export declare function ProductRating({ rating, reviewCount, size, showReviewCount, className, showEmptyState, }: ProductRatingProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=product-rating.d.ts.map
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';
/**
 * Smart product rating component that handles:
 * - Products with reviews: Shows rating and review count
 * - Products without reviews: Shows "No reviews yet" or hides completely
 * - Zero ratings: Never shows "0.0", shows appropriate empty state instead
 */
export function ProductRating({ rating, reviewCount, size = 'md', showReviewCount = true, className, showEmptyState = false, }) {
    // Determine if we should show anything
    const hasRating = rating !== undefined && rating !== null && rating > 0;
    const hasReviews = reviewCount !== undefined && reviewCount !== null && reviewCount > 0;
    const shouldShow = hasRating || hasReviews || showEmptyState;
    // If no rating/reviews and empty state is disabled, don't render
    if (!shouldShow) {
        return null;
    }
    // Size configurations
    const sizeConfig = {
        sm: {
            star: 'h-3 w-3',
            text: 'text-xs',
            gap: 'gap-0.5',
        },
        md: {
            star: 'h-4 w-4',
            text: 'text-sm',
            gap: 'gap-1',
        },
        lg: {
            star: 'h-5 w-5',
            text: 'text-base',
            gap: 'gap-1.5',
        },
    };
    const config = sizeConfig[size];
    // If no reviews and no rating, show empty state or hide
    if (!hasReviews && !hasRating) {
        if (!showEmptyState) {
            return null;
        }
        return (_jsx("div", { className: cn('flex items-center', config.gap, className), children: _jsx("span", { className: cn('text-gray-400', config.text), children: "No reviews yet" }) }));
    }
    // If we have reviews or rating, show them
    const displayRating = hasRating ? Number(rating).toFixed(1) : '0.0';
    const displayReviewCount = hasReviews ? reviewCount : 0;
    // Don't show rating if it's 0.0 and there are no reviews
    if (!hasRating && !hasReviews) {
        return null;
    }
    return (_jsxs("div", { className: cn('flex items-center', config.gap, className), children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Star, { className: cn(config.star, 'text-amber-400 fill-amber-400') }), _jsx("span", { className: cn('font-medium text-gray-900 ml-0.5', config.text), children: displayRating })] }), showReviewCount && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-300", children: "\u2022" }), _jsx("span", { className: cn('text-gray-600', config.text), children: displayReviewCount === 1 ? '1 review' : `${displayReviewCount} reviews` })] }))] }));
}

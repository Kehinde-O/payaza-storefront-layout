'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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
export function ProductRating({
  rating,
  reviewCount,
  size = 'md',
  showReviewCount = true,
  className,
  showEmptyState = false,
}: ProductRatingProps) {
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
    return (
      <div className={cn('flex items-center', config.gap, className)}>
        <span className={cn('text-gray-400', config.text)}>No reviews yet</span>
      </div>
    );
  }

  // If we have reviews or rating, show them
  const displayRating = hasRating ? Number(rating).toFixed(1) : '0.0';
  const displayReviewCount = hasReviews ? reviewCount : 0;

  // Don't show rating if it's 0.0 and there are no reviews
  if (!hasRating && !hasReviews) {
    return null;
  }

  return (
    <div className={cn('flex items-center', config.gap, className)}>
      {/* Star Rating */}
      <div className="flex items-center">
        <Star className={cn(
          config.star,
          'text-amber-400 fill-amber-400'
        )} />
        <span className={cn('font-medium text-gray-900 ml-0.5', config.text)}>
          {displayRating}
        </span>
      </div>

      {/* Review Count */}
      {showReviewCount && (
        <>
          <span className="text-gray-300">•</span>
          <span className={cn('text-gray-600', config.text)}>
            {displayReviewCount === 1 ? '1 review' : `${displayReviewCount} reviews`}
          </span>
        </>
      )}
    </div>
  );
}


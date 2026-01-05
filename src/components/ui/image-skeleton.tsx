'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: 'square' | '3/4' | '4/3' | '4/5' | '16/9' | 'auto';
}

export function ImageSkeleton({ className, aspectRatio = 'square' }: ImageSkeletonProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    '3/4': 'aspect-[3/4]',
    '4/3': 'aspect-[4/3]',
    '4/5': 'aspect-[4/5]',
    '16/9': 'aspect-video',
    auto: '',
  };

  return (
    <div className={cn('relative overflow-hidden bg-gray-100', aspectRatioClasses[aspectRatio], className)}>
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}


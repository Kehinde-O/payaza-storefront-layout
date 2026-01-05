'use client';

import { RouteSkeletonLoader } from './route-skeleton-loader';

/**
 * Client component wrapper for Next.js loading.tsx files
 * Uses pathname to determine which skeleton to show
 */
export function LoadingSkeletonWrapper() {
  return <RouteSkeletonLoader />;
}


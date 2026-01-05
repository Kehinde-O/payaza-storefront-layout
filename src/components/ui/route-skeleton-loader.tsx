'use client';

import { usePathname } from 'next/navigation';
import { ProductDetailSkeleton } from './skeletons/product-detail-skeleton';
import { ProductGridSkeleton } from './skeletons/product-grid-skeleton';
import { CategoryGridSkeleton } from './skeletons/category-grid-skeleton';
import { PageSkeleton } from './skeletons/page-skeleton';
import { CheckoutSkeleton } from './skeletons/checkout-skeleton';
import { cn } from '@/lib/utils';

interface RouteSkeletonLoaderProps {
  className?: string;
  pathname?: string; // Optional pathname prop, falls back to usePathname
}

export function RouteSkeletonLoader({ className, pathname: pathnameProp }: RouteSkeletonLoaderProps) {
  const pathnameFromHook = usePathname();
  const pathname = pathnameProp || pathnameFromHook;

  // Detect route type from pathname
  const getRouteType = (path: string): 'product-detail' | 'products' | 'categories' | 'category-detail' | 'checkout' | 'homepage' | 'generic' => {
    // Remove leading slash and split
    const segments = path.split('/').filter(Boolean);
    
    // Homepage: /[storeName] (only one segment after store name)
    if (segments.length === 1) {
      return 'homepage';
    }
    
    // Store routes: [storeName, ...segments]
    // segments[0] = storeName, segments[1] = first route segment, segments[2] = second route segment
    if (segments.length >= 2) {
      const firstSegment = segments[1];
      const secondSegment = segments[2];
      
      // Checkout: /[storeName]/checkout
      if (firstSegment === 'checkout') {
        return 'checkout';
      }
      
      // Product detail: /[storeName]/products/[slug]
      if (firstSegment === 'products' && secondSegment) {
        return 'product-detail';
      }
      
      // Products list: /[storeName]/products
      if (firstSegment === 'products' && !secondSegment) {
        return 'products';
      }
      
      // Category detail: /[storeName]/categories/[slug]
      if (firstSegment === 'categories' && secondSegment) {
        return 'category-detail';
      }
      
      // Categories list: /[storeName]/categories
      if (firstSegment === 'categories' && !secondSegment) {
        return 'categories';
      }
    }
    
    return 'generic';
  };

  const routeType = getRouteType(pathname);

  const renderSkeleton = () => {
    switch (routeType) {
      case 'homepage':
        // Use spinner loader for homepage instead of skeleton
        // Spinner is centered in fixed position overlay
        return null; // Will be handled by the fixed overlay structure
      case 'product-detail':
        return <ProductDetailSkeleton />;
      case 'products':
        return (
          <div className="min-h-[calc(100vh-200px)] bg-white py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 h-4 bg-gray-200 rounded w-48 animate-pulse" />
              <ProductGridSkeleton count={12} columns={3} />
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="min-h-[calc(100vh-200px)] bg-white py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 h-4 bg-gray-200 rounded w-48 animate-pulse" />
              <CategoryGridSkeleton count={6} />
            </div>
          </div>
        );
      case 'category-detail':
        return (
          <div className="min-h-[calc(100vh-200px)] bg-white py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 h-4 bg-gray-200 rounded w-48 animate-pulse" />
              <ProductGridSkeleton count={8} columns={3} />
            </div>
          </div>
        );
      case 'checkout':
        return <CheckoutSkeleton />;
      default:
        return <PageSkeleton />;
    }
  };

  // For homepage, center spinner in fixed position
  if (routeType === 'homepage') {
    return (
      <div className={cn('fixed inset-0 bg-white z-[9999] flex items-center justify-center', className)}>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-solid border-gray-200 border-t-gray-900 border-r-gray-900 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('fixed inset-0 bg-white z-[9999] overflow-y-auto', className)}>
      <div className="pt-20 pb-32 min-h-screen">
        {renderSkeleton()}
      </div>
    </div>
  );
}


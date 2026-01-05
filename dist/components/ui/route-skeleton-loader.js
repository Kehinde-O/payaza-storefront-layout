'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePathname } from 'next/navigation';
import { ProductDetailSkeleton } from './skeletons/product-detail-skeleton';
import { ProductGridSkeleton } from './skeletons/product-grid-skeleton';
import { CategoryGridSkeleton } from './skeletons/category-grid-skeleton';
import { PageSkeleton } from './skeletons/page-skeleton';
import { CheckoutSkeleton } from './skeletons/checkout-skeleton';
import { cn } from '../../lib/utils';
export function RouteSkeletonLoader({ className, pathname: pathnameProp }) {
    const pathnameFromHook = usePathname();
    const pathname = pathnameProp || pathnameFromHook;
    // Detect route type from pathname
    const getRouteType = (path) => {
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
                return _jsx(ProductDetailSkeleton, {});
            case 'products':
                return (_jsx("div", { className: "min-h-[calc(100vh-200px)] bg-white py-8 lg:py-12", children: _jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "mb-6 h-4 bg-gray-200 rounded w-48 animate-pulse" }), _jsx(ProductGridSkeleton, { count: 12, columns: 3 })] }) }));
            case 'categories':
                return (_jsx("div", { className: "min-h-[calc(100vh-200px)] bg-white py-8 lg:py-12", children: _jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "mb-6 h-4 bg-gray-200 rounded w-48 animate-pulse" }), _jsx(CategoryGridSkeleton, { count: 6 })] }) }));
            case 'category-detail':
                return (_jsx("div", { className: "min-h-[calc(100vh-200px)] bg-white py-8 lg:py-12", children: _jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "mb-6 h-4 bg-gray-200 rounded w-48 animate-pulse" }), _jsx(ProductGridSkeleton, { count: 8, columns: 3 })] }) }));
            case 'checkout':
                return _jsx(CheckoutSkeleton, {});
            default:
                return _jsx(PageSkeleton, {});
        }
    };
    // For homepage, center spinner in fixed position
    if (routeType === 'homepage') {
        return (_jsx("div", { className: cn('fixed inset-0 bg-white z-[9999] flex items-center justify-center', className), children: _jsx("div", { className: "flex flex-col items-center justify-center gap-3", children: _jsx("div", { className: "w-12 h-12 rounded-full border-4 border-solid border-gray-200 border-t-gray-900 border-r-gray-900 animate-spin" }) }) }));
    }
    return (_jsx("div", { className: cn('fixed inset-0 bg-white z-[9999] overflow-y-auto', className), children: _jsx("div", { className: "pt-20 pb-32 min-h-screen", children: renderSkeleton() }) }));
}

'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
/**
 * Calculate optimal grid span classes based on category count and index
 * Ensures visual balance and hierarchy for any number of categories
 */
function getCategoryGridLayout(index, totalCount) {
    // Always make first category prominent (hero treatment)
    if (index === 0) {
        if (totalCount === 1) {
            return 'md:col-span-3 md:row-span-2'; // Full width for single category
        }
        if (totalCount === 2) {
            return 'md:col-span-2 md:row-span-2'; // Large hero, second category fills remaining space
        }
        return 'md:col-span-2 md:row-span-2'; // Standard hero treatment
    }
    // Handle different category count ranges
    if (totalCount === 1) {
        return ''; // Won't be reached, but safe fallback
    }
    if (totalCount === 2) {
        // Second category fills remaining space
        return 'md:col-span-1 md:row-span-2';
    }
    if (totalCount === 3) {
        // After hero, two equal categories
        if (index === 1)
            return 'md:col-span-1 md:row-span-2';
        if (index === 2)
            return 'md:col-span-1 md:row-span-2';
        return '';
    }
    if (totalCount === 4) {
        // Hero + 3 categories: one tall, two standard
        if (index === 1)
            return 'md:col-span-1 md:row-span-2';
        if (index === 2)
            return 'md:col-span-1';
        if (index === 3)
            return 'md:col-span-1';
        return '';
    }
    if (totalCount === 5) {
        // Hero + 4 categories: balanced distribution
        if (index === 1)
            return 'md:col-span-1 md:row-span-2';
        if (index === 2)
            return 'md:col-span-1';
        if (index === 3)
            return 'md:col-span-1';
        if (index === 4)
            return 'md:col-span-1';
        return '';
    }
    if (totalCount === 6) {
        // Hero + 5 categories: create visual rhythm
        if (index === 1)
            return 'md:col-span-1 md:row-span-2';
        if (index === 2)
            return 'md:col-span-1';
        if (index === 3)
            return 'md:col-span-1';
        if (index === 4)
            return 'md:col-span-2'; // Wide category
        if (index === 5)
            return 'md:col-span-1';
        return '';
    }
    if (totalCount >= 7 && totalCount <= 9) {
        // Hero + masonry-style grid
        if (index === 1)
            return 'md:col-span-1 md:row-span-2';
        if (index === 2)
            return 'md:col-span-1';
        if (index === 3)
            return 'md:col-span-1';
        if (index === 4)
            return 'md:col-span-2'; // Wide category
        if (index === 5)
            return 'md:col-span-1';
        if (index === 6)
            return 'md:col-span-1 md:row-span-2';
        if (index === 7)
            return 'md:col-span-1';
        if (index === 8)
            return 'md:col-span-1';
        return '';
    }
    // 10+ categories: uniform grid with occasional emphasis
    // Create a repeating pattern for visual interest
    const patternIndex = (index - 1) % 8; // Pattern repeats every 8 items (after hero)
    if (patternIndex === 0)
        return 'md:col-span-1 md:row-span-2'; // Tall
    if (patternIndex === 3)
        return 'md:col-span-2'; // Wide
    if (patternIndex === 6)
        return 'md:col-span-1 md:row-span-2'; // Tall
    return ''; // Standard 1x1
}
/**
 * Get optimal grid container class based on category count
 */
function getGridContainerClass(totalCount) {
    if (totalCount === 1) {
        return 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]';
    }
    if (totalCount <= 3) {
        return 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]';
    }
    // For 4+ categories, use standard 3-column grid
    return 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]';
}
export function CategoriesPage({ storeConfig }) {
    const categories = storeConfig.categories || [];
    // Breadcrumbs
    const breadcrumbItems = [
        { label: storeConfig.name, href: `/${storeConfig.slug}` },
        { label: 'Categories', href: `/${storeConfig.slug}/categories` },
    ];
    return (_jsxs("div", { "data-content-ready": true, className: "min-h-screen bg-white text-slate-900 font-sans", children: [_jsx("div", { className: "bg-gray-50 border-b border-gray-200", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16", children: _jsxs("div", { className: "max-w-3xl animate-fade-in-up", children: [_jsx("div", { className: "mb-6", children: _jsx(Breadcrumbs, { items: breadcrumbItems }) }), _jsx("h1", { className: "text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6", children: "Shop by Category" }), _jsx("p", { className: "text-lg text-gray-600 leading-relaxed max-w-2xl", children: "Explore our comprehensive collection of premium products across various departments. Dive into our curated selections designed to match your style and needs." })] }) }) }), _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-16", children: categories.length === 0 ? (_jsxs("div", { className: "text-center py-20", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No categories available" }), _jsx("p", { className: "text-gray-500", children: "Categories will appear here once they are added to the store." })] })) : (_jsx("div", { className: getGridContainerClass(categories.length), children: categories.map((category, index) => {
                        // Get adaptive grid layout based on position and total count
                        const spanClass = getCategoryGridLayout(index, categories.length);
                        // Validate category image - handle all formats independently
                        const extractCategoryImage = (image) => {
                            if (!image)
                                return undefined;
                            // If already a string, validate
                            if (typeof image === 'string') {
                                const trimmed = image.trim();
                                return trimmed.length > 0 ? trimmed : undefined;
                            }
                            // If object, extract url
                            if (typeof image === 'object' && image !== null) {
                                if ('url' in image && image.url) {
                                    const url = typeof image.url === 'string' ? image.url.trim() : String(image.url).trim();
                                    return url.length > 0 ? url : undefined;
                                }
                                // Check for other common property names
                                for (const key of ['src', 'image', 'imageUrl', 'image_url', 'value']) {
                                    if (key in image && image[key]) {
                                        const url = typeof image[key] === 'string' ? image[key].trim() : String(image[key]).trim();
                                        if (url.length > 0) {
                                            return url;
                                        }
                                    }
                                }
                            }
                            // If array, take first valid item
                            if (Array.isArray(image) && image.length > 0) {
                                return extractCategoryImage(image[0]);
                            }
                            return undefined;
                        };
                        const categoryImage = extractCategoryImage(category.image);
                        return (_jsxs(Link, { "data-category-card": true, href: `/${storeConfig.slug}/products?category=${category.slug}`, className: `group relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 min-h-[300px] ${spanClass}`, children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx(ImageWithFallback, { src: categoryImage, alt: category.name, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", skeletonAspectRatio: "auto" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-70" })] }), _jsx("div", { className: "absolute inset-0 flex flex-col justify-end p-6 lg:p-8", children: _jsxs("div", { className: "transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0", children: [_jsx("h2", { className: "font-bold text-white mb-2 text-2xl md:text-3xl", children: category.name }), category.description && (_jsx("p", { className: "text-gray-200 mb-6 line-clamp-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 text-sm md:text-base", children: category.description })), _jsxs("div", { className: "flex items-center gap-2 text-white font-medium text-sm tracking-wide uppercase", children: [_jsx("span", { className: "border-b border-transparent group-hover:border-white transition-colors", children: "Explore Collection" }), _jsx(ArrowRight, { className: "w-4 h-4 transform transition-transform group-hover:translate-x-1" })] })] }) })] }, category.id));
                    }) })) })] }));
}

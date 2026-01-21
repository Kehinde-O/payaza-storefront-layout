'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { useStore } from '../../../lib/store-context';
import { ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast';
import { useAnalytics } from '../../../hooks/use-analytics';
import { useEffect } from 'react';
import { ProductCard } from '../../../components/ui/product-card';
import { filterActiveProducts } from '../../../lib/utils';
export function CategoryPage({ storeConfig, categorySlug }) {
    const categories = storeConfig.categories || [];
    const category = categories.find(c => c.slug === categorySlug);
    const products = filterActiveProducts(storeConfig.products?.filter(p => p.categoryId === category?.id) || []);
    const { addToCart } = useStore();
    const { addToast } = useToast();
    const { trackEvent } = useAnalytics();
    // Track category view
    useEffect(() => {
        if (category && storeConfig?.id) {
            trackEvent({
                eventType: 'category_view',
                metadata: {
                    categoryId: category.id,
                    categoryName: category.name,
                    categorySlug: category.slug,
                },
            });
        }
    }, [category?.id, storeConfig?.id, trackEvent]);
    const hasItems = products.length > 0;
    const handleAddToCart = (product) => {
        addToCart(product);
        addToast(`${product.name} added to cart`, 'success');
    };
    const handleQuickView = (product) => {
        addToast(`Quick view for ${product.name}`, 'info');
    };
    if (!category) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Category Not Found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "The category you're looking for doesn't exist." }), _jsx(Link, { href: `/${storeConfig.slug}/categories`, children: _jsx(Button, { children: "Back to Categories" }) })] }) }));
    }
    // Modern / Dark Theme Logic (e.g. for Modern Eats)
    const isDarkTheme = storeConfig.type === 'food-modern' || storeConfig.branding.theme === 'dark';
    const bgColor = isDarkTheme ? 'bg-[#0F0F0F]' : 'bg-gray-50';
    const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300", children: [_jsxs("div", { className: "relative h-[40vh] overflow-hidden", children: [_jsx(ImageWithFallback, { src: category.image, alt: category.name, className: "w-full h-full object-cover", skeletonAspectRatio: "16/9" }), _jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-[2px]" }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white", children: [_jsx("h1", { className: "text-5xl md:text-7xl font-bold tracking-tight mb-4", children: category.name }), category.description && (_jsx("p", { className: "text-lg md:text-xl max-w-2xl opacity-90 font-light", children: category.description }))] })] }), _jsxs("div", { className: "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center mb-10 gap-4", children: [_jsxs(Link, { href: `/${storeConfig.slug}/categories`, className: "inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to All Categories"] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs(Button, { variant: "outline", className: "bg-white", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), " Filter"] }) })] }), !hasItems ? (_jsxs("div", { className: "text-center py-20 border border-dashed border-gray-300 rounded-3xl", children: [_jsx("p", { className: "text-gray-500 text-lg", children: "No products found in this category." }), _jsx(Button, { className: "mt-4", onClick: () => window.history.back(), children: "Go Back" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", children: products.map((product) => (_jsx(ProductCard, { product: product, storeSlug: storeConfig.slug, onAddToCart: handleAddToCart, onQuickView: handleQuickView }, product.id))) }))] })] }));
}

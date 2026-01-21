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
import { formatCurrency } from '../../../lib/utils';
export function CategoryPage({ storeConfig: initialConfig, categorySlug }) {
    const { store, addToCart } = useStore();
    const storeConfig = store || initialConfig;
    const categories = storeConfig.categories || [];
    const category = categories.find(c => c.slug === categorySlug);
    const menuItems = (storeConfig.menuItems || []).filter(item => item.categoryId === category?.id);
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
    const hasItems = menuItems.length > 0;
    const handleAddToCart = (item) => {
        const product = {
            ...item,
            slug: item.id,
            images: item.image ? [item.image] : [],
            variants: [],
            specifications: {},
            rating: 0,
            reviewCount: 0,
            categoryId: item.categoryId || '',
            inStock: true
        };
        addToCart(product);
        addToast(`${item.name} added to order`, 'success');
    };
    if (!category) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Category Not Found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "The category you're looking for doesn't exist." }), _jsx(Link, { href: `/${storeConfig.slug}/categories`, children: _jsx(Button, { children: "Back to Categories" }) })] }) }));
    }
    // Modern / Dark Theme Logic (e.g. for Modern Eats)
    const isDarkTheme = storeConfig.type === 'food-modern' || storeConfig.branding.theme === 'dark';
    const bgColor = isDarkTheme ? 'bg-[#0F0F0F]' : 'bg-gray-50';
    const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
    return (_jsxs("div", { className: `min-h-screen ${bgColor} ${textColor} transition-colors duration-300`, children: [_jsxs("div", { className: "relative h-[40vh] overflow-hidden", children: [_jsx(ImageWithFallback, { src: category.image, alt: category.name, className: "w-full h-full object-cover", skeletonAspectRatio: "16/9" }), _jsx("div", { className: `absolute inset-0 ${isDarkTheme ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-[2px]` }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white", children: [_jsx("h1", { className: "text-5xl md:text-7xl font-bold tracking-tight mb-4", children: category.name }), category.description && (_jsx("p", { className: "text-lg md:text-xl max-w-2xl opacity-90 font-light", children: category.description }))] })] }), _jsxs("div", { className: "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center mb-10 gap-4", children: [_jsxs(Link, { href: `/${storeConfig.slug}/categories`, className: `inline-flex items-center text-sm font-medium ${isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to All Categories"] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs(Button, { variant: "outline", className: `${isDarkTheme ? 'border-white/20 text-white hover:bg-white/10' : 'bg-white'}`, children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), " Filter"] }) })] }), !hasItems ? (_jsxs("div", { className: "text-center py-20 border border-dashed border-gray-300 rounded-3xl", children: [_jsx("p", { className: "text-gray-500 text-lg", children: "No items found in this category." }), _jsx(Button, { className: "mt-4", onClick: () => window.history.back(), children: "Go Back" })] })) : (_jsx("div", { className: "space-y-12", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", children: menuItems.map((item) => (_jsxs("div", { className: "group bg-[#1A1A1A] rounded-none overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all duration-500 flex flex-col h-full", children: [_jsxs("div", { className: "relative aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all duration-700", children: [_jsx(ImageWithFallback, { src: item.image, alt: item.name, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", skeletonAspectRatio: "square" }), _jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center", children: _jsx(Button, { className: "rounded-none bg-white text-black hover:bg-orange-600 hover:text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg font-bold px-8 uppercase tracking-widest text-xs", onClick: () => handleAddToCart(item), children: "Order Now" }) })] }), _jsxs("div", { className: "p-8 flex flex-col flex-1 text-center", children: [_jsx("h3", { className: "font-bold text-xl text-white uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors", children: item.name }), _jsx("p", { className: "text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1 font-light italic", children: item.description }), _jsx("span", { className: "text-2xl font-serif text-white", children: formatCurrency(item.price, storeConfig.settings?.currency || 'USD') })] })] }, item.id))) }) }))] })] }));
}

'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ShoppingCart, Search, Star, Flame, Leaf, Wheat, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../lib/store-context';
import { cn, formatCurrency } from '../../../lib/utils';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
export function MenuPage({ storeConfig: initialConfig, categorySlug }) {
    const { store } = useStore();
    const storeConfig = store || initialConfig;
    const categories = storeConfig.categories || [];
    const menuItems = storeConfig.menuItems || [];
    const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef(null);
    const [showLeftGradient, setShowLeftGradient] = useState(false);
    const [showRightGradient, setShowRightGradient] = useState(true);
    const primaryColor = storeConfig.branding.primaryColor;
    const menuConfig = storeConfig.layoutConfig?.pages?.menu;
    // Icons mapping for dietary info
    const dietaryIcons = {
        'spicy': Flame,
        'vegan': Leaf,
        'vegetarian': Leaf,
        'gluten-free': Wheat,
        'popular': Star
    };
    const filteredItems = menuItems.filter(item => {
        // Category Filter
        if (selectedCategory) {
            const category = categories.find(c => c.id === item.categoryId);
            if (category?.slug !== selectedCategory)
                return false;
        }
        // Search Filter
        if (searchQuery) {
            return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftGradient(scrollLeft > 0);
            setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);
    const scrollCategories = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-20", children: [menuConfig?.menuHeader?.show !== false && (_jsxs("div", { "data-section": "hero", className: "relative bg-black text-white py-16 px-4 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" }), _jsxs("div", { className: "relative z-10 container mx-auto text-center max-w-4xl", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-black mb-4 tracking-tight", children: menuConfig?.menuHeader?.title || "Our Menu" }), _jsx("p", { className: "text-lg text-gray-200 max-w-2xl mx-auto", children: menuConfig?.menuHeader?.subtitle || "Discover our wide range of delicious dishes, crafted with passion and the finest ingredients." })] })] })), menuConfig?.menuGrid?.show !== false && (_jsxs(_Fragment, { children: [_jsx("div", { "data-section": "menu-list", className: "sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm py-4 transition-all border-b border-gray-200 shadow-sm", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center", children: [_jsxs("div", { className: "relative w-full md:max-w-xs flex-shrink-0", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search menu...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm" })] }), _jsxs("div", { className: "relative flex-1 w-full overflow-hidden group", children: [_jsx("button", { onClick: () => scrollCategories('left'), className: cn("absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-600 transition-opacity hover:bg-white md:flex hidden", !showLeftGradient && "opacity-0 pointer-events-none"), children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => scrollCategories('right'), className: cn("absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-600 transition-opacity hover:bg-white md:flex hidden", !showRightGradient && "opacity-0 pointer-events-none"), children: _jsx(ChevronRight, { className: "w-4 h-4" }) }), _jsx("div", { className: cn("absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-0 pointer-events-none transition-opacity", showLeftGradient ? "opacity-100" : "opacity-0") }), _jsx("div", { className: cn("absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-0 pointer-events-none transition-opacity", showRightGradient ? "opacity-100" : "opacity-0") }), _jsxs("div", { ref: scrollContainerRef, onScroll: checkScroll, className: "flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1 scroll-smooth", children: [_jsx("button", { onClick: () => setSelectedCategory(''), className: cn("px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex-shrink-0 select-none", !selectedCategory
                                                            ? "text-white border-transparent shadow-md transform scale-105"
                                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"), style: !selectedCategory ? { backgroundColor: primaryColor } : {}, children: "All Items" }), categories.map((category) => (_jsx("button", { onClick: () => setSelectedCategory(category.slug), className: cn("px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex-shrink-0 select-none", selectedCategory === category.slug
                                                            ? "text-white border-transparent shadow-md transform scale-105"
                                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"), style: selectedCategory === category.slug ? { backgroundColor: primaryColor } : {}, children: category.name }, category.id)))] })] })] }) }) }), _jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [selectedCategory && (_jsx("div", { className: "mb-8 animate-fade-in", children: _jsxs("h2", { className: "text-2xl font-bold text-gray-900 capitalize flex items-center gap-3", children: [categories.find(c => c.slug === selectedCategory)?.name || 'Category', _jsxs("span", { className: "text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full", children: [filteredItems.length, " items"] })] }) })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", children: filteredItems.map((item, index) => (_jsxs(Card, { className: "group overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-100 flex flex-col h-full bg-white rounded-2xl", children: [_jsxs("div", { className: "relative aspect-[4/3] overflow-hidden", children: [_jsx(ImageWithFallback, { src: item.image, alt: item.name, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", skeletonAspectRatio: "4/3" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6", children: _jsx(Button, { className: "rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300", style: { backgroundColor: primaryColor, color: 'white' }, children: "Quick Add" }) }), index % 3 === 0 && (_jsxs("div", { className: "absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1", children: [_jsx(Star, { className: "w-3 h-3 fill-yellow-400 text-yellow-400" }), " Popular"] }))] }), _jsxs(CardContent, { className: "p-6 flex-1 flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "font-bold text-lg text-gray-900 leading-tight", children: item.name }), _jsx("span", { className: "font-black text-lg text-gray-900 whitespace-nowrap ml-2", children: formatCurrency(item.price, item.currency || storeConfig.settings?.currency || 'USD') })] }), _jsx("p", { className: "text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1", children: item.description }), item.dietaryInfo && item.dietaryInfo.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: item.dietaryInfo.map((info) => {
                                                        const Icon = dietaryIcons[info.toLowerCase()] || Info;
                                                        return (_jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-1 rounded bg-gray-50 text-gray-500 border border-gray-100", children: [_jsx(Icon, { className: "w-3 h-3" }), info] }, info));
                                                    }) })), _jsxs(Button, { className: "w-full rounded-xl font-bold h-11 shadow-sm hover:shadow-md transition-all active:scale-[0.98]", style: {
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                    }, children: [_jsx(ShoppingCart, { className: "h-4 w-4 mr-2" }), "Add to Cart"] })] })] }, item.id))) }), filteredItems.length === 0 && (_jsxs("div", { className: "text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200", children: [_jsx("div", { className: "w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Search, { className: "w-8 h-8 text-gray-300" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "No items found" }), _jsx("p", { className: "text-gray-500", children: "Try adjusting your search or category filter." }), _jsx(Button, { variant: "outline", className: "mt-6", onClick: () => {
                                            setSearchQuery('');
                                            setSelectedCategory('');
                                        }, children: "Clear Filters" })] }))] })] }))] }));
}

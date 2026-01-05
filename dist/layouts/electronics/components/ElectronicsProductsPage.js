'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { CategoryTree } from '../../../components/ui/category-tree';
import { useStore } from '../../../lib/store-context';
import { useToast } from '../../../components/ui/toast';
import { Filter, ChevronDown, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { ElectronicsStoreHeader } from './ElectronicsStoreHeader';
import { ElectronicsStoreFooter } from './ElectronicsStoreFooter';
import { ElectronicsGridProductCard } from './ElectronicsGridProductCard';
import { Sheet } from '../../../components/ui/sheet';
import { AnimatePresence } from 'framer-motion';
import { formatCurrency, filterActiveProducts } from '../../../lib/utils';
import { buildCategoryTree, getAllCategoryIds, flattenCategoryTree } from '../../../lib/utils/category-tree';
function ElectronicsProductsPageContent({ storeConfig }) {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [products, setProducts] = useState(filterActiveProducts(storeConfig.products || []));
    const categories = useMemo(() => storeConfig.categories || [], [storeConfig.categories]);
    const { addToCart } = useStore();
    const { addToast } = useToast();
    // Filter States
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(categoryParam);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortBy, setSortBy] = useState('featured');
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // Initialize products
    useEffect(() => {
        const initialProducts = storeConfig.products || [];
        setProducts(initialProducts);
    }, [storeConfig.products]);
    // Build category tree for filtering
    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
    // Get selected category IDs (including children if parent is selected)
    const selectedCategoryIds = useMemo(() => {
        if (!selectedCategoryFilter)
            return [];
        const flatCategories = flattenCategoryTree(categoryTree);
        const selectedCategory = flatCategories.find(c => c.slug === selectedCategoryFilter);
        if (!selectedCategory)
            return [];
        // Return all category IDs including children
        return getAllCategoryIds(selectedCategory);
    }, [selectedCategoryFilter, categoryTree]);
    // Filter Logic
    const filteredAndSortedProducts = useMemo(() => {
        const result = products.filter(product => {
            if (selectedCategoryFilter) {
                // Check if product's category is in the selected category or its children
                if (!selectedCategoryIds.includes(product.categoryId)) {
                    return false;
                }
            }
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }
            return true;
        });
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.reverse();
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
        }
        return result;
    }, [products, selectedCategoryFilter, selectedCategoryIds, priceRange, sortBy]);
    const displayedProducts = filteredAndSortedProducts.slice(0, visibleProducts);
    const hasMore = visibleProducts < filteredAndSortedProducts.length;
    const handleAddToCart = (product) => {
        addToCart(product);
        addToast(`${product.name} added to cart`, 'success');
    };
    const breadcrumbItems = [
        { label: storeConfig.name, href: `/${storeConfig.slug}` },
        { label: 'Products', href: `/${storeConfig.slug}/products` },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white", children: [_jsx(ElectronicsStoreHeader, { storeConfig: storeConfig }), _jsxs("main", { className: "pt-24 pb-20", children: [_jsxs("div", { className: "bg-slate-950 text-white mb-10 overflow-hidden relative", children: [_jsx("div", { className: "absolute inset-0 bg-blue-600/10 pointer-events-none" }), _jsx("div", { className: "absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" }), _jsxs("div", { className: "container mx-auto px-6 py-16 relative z-10", children: [_jsx("div", { className: "mb-6 opacity-60", children: _jsx(Breadcrumbs, { items: breadcrumbItems }) }), _jsx("h1", { className: "text-4xl md:text-5xl font-black tracking-tight mb-4", children: "All Products" }), _jsx("p", { className: "text-slate-400 max-w-xl text-lg font-light", children: "Explore our complete catalog of premium electronics." })] })] }), _jsx("div", { className: "container mx-auto px-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-12", children: [_jsx("aside", { className: "hidden lg:block w-64 shrink-0 space-y-10 sticky top-32 self-start h-fit", children: _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-slate-900 mb-4 flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4" }), " Filters"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-3", children: "Categories" }), _jsx(CategoryTree, { categories: categories, selectedCategoryIds: selectedCategoryFilter ? [categories.find(c => c.slug === selectedCategoryFilter)?.id || ''] : [], onCategorySelect: (slug) => setSelectedCategoryFilter(selectedCategoryFilter === slug ? null : slug), mode: "button", showAllOption: true, onAllSelect: () => setSelectedCategoryFilter(null), isAllSelected: !selectedCategoryFilter })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-3", children: "Price Range" }), _jsxs("div", { className: "px-2", children: [_jsx("input", { type: "range", min: "0", max: "5000", step: "50", value: priceRange[1], onChange: (e) => setPriceRange([0, parseInt(e.target.value)]), className: "w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" }), _jsxs("div", { className: "flex justify-between mt-2 text-xs font-bold text-slate-600", children: [_jsx("span", { children: formatCurrency(0, storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }), _jsxs("span", { children: [formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), "+"] })] })] })] })] })] }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 mb-8", children: [_jsxs("div", { className: "text-sm font-medium text-slate-500", children: ["Showing ", _jsx("span", { className: "text-slate-900 font-bold", children: displayedProducts.length }), " results"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "outline", className: "lg:hidden rounded-full border-slate-200", onClick: () => setIsFilterOpen(true), children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), " Filters"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-slate-500 hidden sm:inline", children: "Sort by:" }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "appearance-none bg-white border border-slate-200 rounded-full pl-4 pr-10 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-slate-50 transition-colors", children: [_jsx("option", { value: "featured", children: "Featured" }), _jsx("option", { value: "newest", children: "Newest" }), _jsx("option", { value: "price-asc", children: "Price: Low to High" }), _jsx("option", { value: "price-desc", children: "Price: High to Low" }), _jsx("option", { value: "rating", children: "Top Rated" })] }), _jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" })] })] })] })] }), displayedProducts.length > 0 ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6", children: _jsx(AnimatePresence, { mode: 'popLayout', children: displayedProducts.map((product, index) => (_jsx(ElectronicsGridProductCard, { product: product, storeSlug: storeConfig.slug, onAddToCart: handleAddToCart, index: index }, product.id))) }) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-slate-200", children: [_jsx("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6", children: _jsx(Search, { className: "h-6 w-6 text-slate-400" }) }), _jsx("h3", { className: "text-lg font-bold text-slate-900 mb-2", children: "No products found" }), _jsx("p", { className: "text-slate-500 max-w-sm mx-auto mb-8 text-sm", children: "Try adjusting your filters or search criteria." }), _jsx(Button, { onClick: () => {
                                                        setSelectedCategoryFilter(null);
                                                        setPriceRange([0, 5000]);
                                                    }, variant: "outline", className: "rounded-full px-8 border-slate-200", children: "Clear Filters" })] })), hasMore && (_jsx("div", { className: "mt-16 text-center", children: _jsx(Button, { onClick: () => setVisibleProducts(prev => prev + 12), variant: "outline", className: "rounded-full px-10 h-12 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-sm font-bold uppercase tracking-wide", children: "Load More" }) }))] })] }) })] }), _jsx(ElectronicsStoreFooter, { storeConfig: storeConfig }), _jsx(Sheet, { isOpen: isFilterOpen, onClose: () => setIsFilterOpen(false), title: "Filters", side: "right", className: "w-[300px]", children: _jsxs("div", { className: "py-6 space-y-8 h-full flex flex-col", children: [_jsxs("div", { className: "flex-1 space-y-8 overflow-y-auto", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-wider mb-4 text-slate-900", children: "Categories" }), _jsx(CategoryTree, { categories: categories, selectedCategoryIds: selectedCategoryFilter ? [categories.find(c => c.slug === selectedCategoryFilter)?.id || ''] : [], onCategorySelect: (slug) => setSelectedCategoryFilter(selectedCategoryFilter === slug ? null : slug), mode: "button", showAllOption: true, onAllSelect: () => setSelectedCategoryFilter(null), isAllSelected: !selectedCategoryFilter })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-wider mb-4 text-slate-900", children: "Price Range" }), _jsxs("div", { className: "px-2", children: [_jsx("input", { type: "range", min: "0", max: "5000", step: "50", value: priceRange[1], onChange: (e) => setPriceRange([0, parseInt(e.target.value)]), className: "w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" }), _jsxs("div", { className: "flex justify-between mt-4 text-sm font-bold text-slate-900", children: [_jsx("span", { children: formatCurrency(0, storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }), _jsxs("span", { children: [formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), "+"] })] })] })] })] }), _jsxs("div", { className: "flex gap-4 pt-6 border-t border-slate-100", children: [_jsx(Button, { variant: "outline", className: "flex-1 h-12 rounded-full border-slate-200", onClick: () => {
                                        setPriceRange([0, 5000]);
                                        setSelectedCategoryFilter(null);
                                        setIsFilterOpen(false);
                                    }, children: "Reset" }), _jsx(Button, { className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full", onClick: () => setIsFilterOpen(false), children: "Show Results" })] })] }) })] }));
}
export function ElectronicsProductsPage(props) {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" }) }), children: _jsx(ElectronicsProductsPageContent, { ...props }) }));
}

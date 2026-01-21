'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { Sheet } from '../../../components/ui/sheet';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { ProductGridSkeleton } from '../../../components/ui/skeletons';
import { useStore } from '../../../lib/store-context';
import { useToast } from '../../../components/ui/toast';
import { useLoading } from '../../../lib/loading-context';
import { useAnalytics } from '../../../hooks/use-analytics';
import { Check, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { formatCurrency } from '../../../lib/utils';
import { getBannerImage, getLayoutText } from '../../../lib/utils/asset-helpers';
import { shouldUseAPI } from '../../../lib/utils/demo-detection';
function ProductsPageContent({ storeConfig: initialConfig }) {
    const { store, addToCart } = useStore();
    const storeConfig = store || initialConfig;
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const menuItems = storeConfig.menuItems || [];
    const categories = storeConfig.categories || [];
    const { addToast } = useToast();
    const { startBackendLoading, stopBackendLoading } = useLoading();
    const { trackEvent } = useAnalytics();
    const productsConfig = storeConfig.layoutConfig?.pages?.products;
    // State for filters & sort
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    // Initialize filters from URL
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategoryFilter(categoryParam);
        }
    }, [categoryParam]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('featured');
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [isFiltering, setIsFiltering] = useState(false);
    // Track filter changes and show loading
    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => setIsFiltering(false), 300);
        return () => clearTimeout(timer);
    }, [selectedCategories, priceRange, selectedCategoryFilter, sortBy, searchQuery]);
    // Filter & Sort Logic
    const filteredAndSortedItems = useMemo(() => {
        let result = menuItems.filter(item => {
            // Search Filter
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Category filter (Sidebar)
            if (selectedCategories.length > 0) {
                if (!selectedCategories.includes(item.categoryId)) {
                    return false;
                }
            }
            // Price filter
            if (item.price < priceRange[0] || item.price > priceRange[1]) {
                return false;
            }
            // Category Filter (Top Buttons)
            if (selectedCategoryFilter) {
                const category = categories.find(c => c.slug === selectedCategoryFilter);
                if (category && item.categoryId !== category.id) {
                    return false;
                }
            }
            return true;
        });
        // Sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            default:
                // Featured - keep original order
                break;
        }
        return result;
    }, [menuItems, selectedCategories, priceRange, selectedCategoryFilter, sortBy, searchQuery, categories]);
    const displayedItems = filteredAndSortedItems.slice(0, visibleProducts);
    const hasMore = visibleProducts < filteredAndSortedItems.length;
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
    const clearAllFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 100]);
        setSelectedCategoryFilter(null);
        setSearchQuery('');
    };
    const hasActiveFilters = selectedCategories.length > 0 ||
        priceRange[1] < 100 ||
        searchQuery !== '';
    // Breadcrumbs
    const breadcrumbItems = [
        { label: storeConfig.name, href: `/${storeConfig.slug}` },
        { label: 'Products', href: `/${storeConfig.slug}/products` },
    ];
    // Get layout config and category header image
    const layoutConfig = storeConfig.layoutConfig;
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // Debug logging for category header
    console.log('[ProductsPage] LayoutConfig:', {
        hasLayoutConfig: !!layoutConfig,
        hasAssignedAssets: !!layoutConfig?.assignedAssets,
        categoryHeaderFromAssets: layoutConfig?.assignedAssets?.category_header ? 'found' : 'not found',
        hasAssignedText: !!layoutConfig?.assignedText,
        categoryHeaderTitle: layoutConfig?.assignedText?.['category_header:title'],
    });
    // Get category header image from assignedAssets
    const categoryHeaderImage = layoutConfig?.assignedAssets?.category_header ||
        getBannerImage(storeConfig, 'category_header', '');
    console.log('[ProductsPage] Category header image:', categoryHeaderImage ? 'found' : 'not found', categoryHeaderImage);
    // Get category header title from assignedText
    const categoryHeaderTitle = layoutConfig?.assignedText?.['category_header:title'] ||
        getLayoutText(storeConfig, 'category_header:title', `Explore The Collections of ${storeConfig.name}`);
    // Get category header buttons from configuration (if available)
    // assignedText values are always strings
    const categoryHeaderPrimaryButton = layoutConfig?.assignedText?.['category_header:primaryButton'];
    const categoryHeaderSecondaryButton = layoutConfig?.assignedText?.['category_header:secondaryButton'];
    // Determine button text - use database value if available and not empty, otherwise use fallback
    // If database explicitly provides empty string, button will be hidden
    const hasPrimaryButtonFromConfig = categoryHeaderPrimaryButton !== undefined && categoryHeaderPrimaryButton !== null;
    const hasSecondaryButtonFromConfig = categoryHeaderSecondaryButton !== undefined && categoryHeaderSecondaryButton !== null;
    const primaryButtonText = hasPrimaryButtonFromConfig
        ? (categoryHeaderPrimaryButton && categoryHeaderPrimaryButton.trim() !== '' ? categoryHeaderPrimaryButton.trim() : null)
        : getLayoutText(storeConfig, 'common.shopNow', 'Start Shopping');
    const secondaryButtonText = hasSecondaryButtonFromConfig
        ? (categoryHeaderSecondaryButton && categoryHeaderSecondaryButton.trim() !== '' ? categoryHeaderSecondaryButton.trim() : null)
        : getLayoutText(storeConfig, 'sections.categories.viewAll', 'View Categories');
    return (_jsxs("div", { className: "min-h-screen bg-white font-sans text-slate-900", children: [_jsxs("div", { className: "relative overflow-hidden bg-white", children: [categoryHeaderImage && (_jsxs("div", { className: "absolute inset-0 z-0", children: [_jsx(ImageWithFallback, { src: categoryHeaderImage, alt: categoryHeaderTitle || storeConfig.name, className: "w-full h-full object-cover", skeletonAspectRatio: "16/9" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" })] })), !categoryHeaderImage && (_jsxs("div", { className: "absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow" }), _jsx("div", { className: "absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow", style: { animationDelay: '2s' } })] })), _jsx("div", { className: `container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-16 lg:pt-20 lg:pb-24 ${categoryHeaderImage ? 'min-h-[500px] flex items-center' : ''}`, children: _jsx("div", { className: "flex flex-col items-center w-full max-w-4xl mx-auto", children: _jsxs("div", { className: `w-full text-center lg:text-left animate-fade-in-up ${categoryHeaderImage ? 'text-white' : ''}`, children: [_jsx("div", { className: "flex justify-center lg:justify-start mb-6", children: _jsx("div", { className: categoryHeaderImage ? 'bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20' : '', children: _jsx(Breadcrumbs, { items: breadcrumbItems, variant: categoryHeaderImage ? 'light' : 'default' }) }) }), _jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-6 ${categoryHeaderImage ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' : 'bg-black/5 text-gray-900'}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full animate-pulse ${categoryHeaderImage ? 'bg-white' : 'bg-black'}` }), getLayoutText(storeConfig, 'common.newArrivals', 'New Arrivals 2024')] }), _jsx("h1", { className: `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] ${categoryHeaderImage ? 'text-white' : 'text-gray-900'}`, children: categoryHeaderTitle || (_jsxs(_Fragment, { children: ["Explore The Collections of ", _jsx("br", {}), _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900", children: storeConfig.name })] })) }), _jsx("p", { className: `text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 ${categoryHeaderImage ? 'text-white/90' : 'text-gray-600'}`, children: getLayoutText(storeConfig, 'category_header:description', "Don't miss out on shopping our latest collection! curated for quality and style. Experience the perfect blend of modern aesthetics and premium craftsmanship.") }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start", children: [primaryButtonText && primaryButtonText.trim() !== '' && (_jsx(Button, { className: `h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${categoryHeaderImage ? 'bg-white text-gray-900 hover:bg-gray-100' : ''}`, onClick: () => {
                                                    const element = document.getElementById('product-grid');
                                                    element?.scrollIntoView({ behavior: 'smooth' });
                                                }, children: primaryButtonText })), secondaryButtonText && secondaryButtonText.trim() !== '' && (_jsx(Button, { className: `h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${categoryHeaderImage ? 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'}`, onClick: () => {
                                                    window.location.href = `/${storeConfig.slug}/categories`;
                                                }, children: secondaryButtonText }))] })] }) }) })] }), _jsxs("div", { "data-content-ready": true, className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide", children: [_jsx("button", { onClick: () => setSelectedCategoryFilter(null), className: `px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${!selectedCategoryFilter
                                    ? 'bg-gray-900 text-white hover:bg-blue-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`, children: "All" }), categories.map((category) => (_jsx("button", { onClick: () => setSelectedCategoryFilter(selectedCategoryFilter === category.slug ? null : category.slug), className: `px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${selectedCategoryFilter === category.slug
                                    ? 'bg-gray-900 text-white hover:bg-blue-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`, children: category.name }, category.id)))] }), _jsxs("div", { id: "product-grid", className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsxs("aside", { className: "hidden lg:block col-span-1 space-y-8 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-white/5", children: [_jsx("h2", { className: "text-xl font-bold text-white uppercase tracking-tight", children: "Filters" }), hasActiveFilters && (_jsxs("button", { onClick: clearAllFilters, className: "text-xs font-medium text-orange-500 hover:text-orange-400 flex items-center gap-1 uppercase tracking-widest", children: [_jsx(RotateCcw, { className: "h-3 w-3" }), " Reset"] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4", children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" }), _jsx("input", { type: "text", placeholder: "Search menu...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-orange-500 transition-all" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4", children: "Categories" }), _jsx("div", { className: "space-y-2", children: categories.map((category) => (_jsxs("label", { className: "flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-none hover:bg-white/5 transition-colors", children: [_jsx("div", { className: `w-5 h-5 rounded-none border flex items-center justify-center transition-colors ${selectedCategories.includes(category.id) ? 'bg-orange-600 border-orange-600' : 'border-white/20 group-hover:border-white/40'}`, children: selectedCategories.includes(category.id) && _jsx(Check, { className: "h-3 w-3 text-white" }) }), _jsx("input", { type: "checkbox", className: "hidden", checked: selectedCategories.includes(category.id), onChange: () => setSelectedCategories(prev => prev.includes(category.id) ? prev.filter(id => id !== category.id) : [...prev, category.id]) }), _jsx("span", { className: "text-sm text-gray-400 font-medium group-hover:text-white transition-colors uppercase tracking-wide", children: category.name })] }, category.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-xs font-bold text-gray-500 uppercase tracking-[0.2em]", children: "Max Price" }), priceRange[1] < 100 && (_jsx("button", { onClick: () => setPriceRange([0, 100]), className: "text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors uppercase tracking-widest", children: "Reset" }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "range", min: "0", max: "100", step: "5", value: priceRange[1], onChange: (e) => setPriceRange([priceRange[0], parseInt(e.target.value)]), className: "w-full h-1 bg-white/10 rounded-none appearance-none cursor-pointer accent-orange-600" }), _jsxs("div", { className: "flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest", children: [_jsx("span", { children: "$0" }), _jsx("span", { className: "text-white", children: formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) })] })] })] })] }), _jsxs("div", { className: "lg:col-span-3", children: [_jsxs("div", { className: "lg:hidden mb-6 flex items-center justify-between", children: [_jsxs(Button, { onClick: () => setIsFilterOpen(true), variant: "outline", className: "flex items-center gap-2 border-white/10 text-white rounded-none uppercase tracking-widest text-xs", children: [_jsx(SlidersHorizontal, { className: "h-4 w-4" }), " Filters"] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-transparent text-xs font-bold text-gray-400 uppercase tracking-widest focus:outline-none", children: [_jsx("option", { value: "featured", children: "Featured" }), _jsx("option", { value: "price-asc", children: "Price: Low-High" }), _jsx("option", { value: "price-desc", children: "Price: High-Low" })] })] }), _jsxs("div", { className: "hidden lg:flex items-center justify-between mb-8", children: [_jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-[0.2em]", children: ["Showing ", _jsx("span", { className: "text-white", children: filteredAndSortedItems.length }), " delicacies"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]", children: "Sort by" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-transparent text-xs font-bold text-white uppercase tracking-widest focus:outline-none cursor-pointer hover:text-orange-500 transition-colors", children: [_jsx("option", { value: "featured", children: "Featured" }), _jsx("option", { value: "price-asc", children: "Price: Low to High" }), _jsx("option", { value: "price-desc", children: "Price: High to Low" })] })] })] }), isFiltering ? (_jsx(ProductGridSkeleton, { count: 12, columns: 3 })) : displayedItems.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8", children: displayedItems.map((item) => (_jsxs("div", { className: "group bg-[#1A1A1A] rounded-none overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500 flex flex-col h-full", children: [_jsxs("div", { className: "relative aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all duration-700", children: [_jsx(ImageWithFallback, { src: item.image, alt: item.name, className: "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110", skeletonAspectRatio: "square" }), _jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center", children: _jsx(Button, { className: "rounded-none bg-white text-black hover:bg-orange-600 hover:text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl font-bold px-8 uppercase tracking-widest text-[10px]", onClick: () => handleAddToCart(item), children: "Add to Order" }) })] }), _jsxs("div", { className: "p-8 flex flex-col flex-1 text-center", children: [_jsx("h3", { className: "font-bold text-lg text-white uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors transition-all", children: item.name }), _jsx("p", { className: "text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1 font-light italic", children: item.description }), _jsx("span", { className: "text-2xl font-serif text-white", children: formatCurrency(item.price, storeConfig.settings?.currency || 'USD') })] })] }, item.id))) }), hasMore && (_jsx("div", { className: "mt-16 text-center", children: _jsx(Button, { onClick: () => setVisibleProducts(prev => prev + 12), variant: "outline", className: "min-w-[240px] rounded-none font-bold h-14 border-white/10 text-white hover:bg-white hover:text-black uppercase tracking-[0.2em] text-xs transition-all", children: "Load More" }) }))] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-32 bg-[#1A1A1A] rounded-none border border-white/5 text-center", children: [_jsx("div", { className: "w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 text-gray-600", children: _jsx(Search, { className: "h-10 w-10" }) }), _jsx("h3", { className: "text-2xl font-bold text-white uppercase tracking-tight mb-4", children: "Nothing Found" }), _jsx("p", { className: "text-gray-500 mb-10 max-w-sm mx-auto font-light italic", children: "Our culinary team couldn't find any items matching your criteria." }), _jsx(Button, { onClick: clearAllFilters, className: "rounded-none px-12 h-14 bg-white text-black hover:bg-orange-600 hover:text-white uppercase tracking-widest font-bold text-xs", children: "Reset Filters" })] }))] })] })] }), _jsxs(Sheet, { isOpen: isFilterOpen, onClose: () => setIsFilterOpen(false), title: "Filters", side: "right", className: "bg-[#0F0F0F] text-white border-white/10", children: [_jsxs("div", { className: "flex flex-col h-full overflow-y-auto pb-24 space-y-10 p-1", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6", children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" }), _jsx("input", { type: "text", placeholder: "Search menu...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-4 bg-[#1A1A1A] border border-white/10 rounded-none text-sm text-white outline-none focus:border-orange-500" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6", children: "Categories" }), _jsx("div", { className: "space-y-4", children: categories.map((category) => (_jsxs("label", { className: "flex items-center gap-4", children: [_jsx("input", { type: "checkbox", checked: selectedCategories.includes(category.id), onChange: () => setSelectedCategories(prev => prev.includes(category.id) ? prev.filter(id => id !== category.id) : [...prev, category.id]), className: "w-5 h-5 rounded-none border-white/20 bg-transparent text-orange-600 focus:ring-orange-500" }), _jsx("span", { className: "text-sm text-gray-400 font-medium uppercase tracking-wider", children: category.name })] }, category.id))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6", children: "Max Price" }), _jsx("input", { type: "range", min: "0", max: "100", step: "5", value: priceRange[1], onChange: (e) => setPriceRange([priceRange[0], parseInt(e.target.value)]), className: "w-full h-1 bg-white/10 rounded-none appearance-none cursor-pointer accent-orange-600 mb-6" }), _jsxs("div", { className: "flex justify-between font-bold text-[10px] text-gray-500 uppercase tracking-widest", children: [_jsx("span", { children: "$0" }), _jsx("span", { className: "text-white", children: formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) })] })] })] }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 bg-[#0F0F0F] border-t border-white/10 flex gap-4", children: [_jsx(Button, { onClick: clearAllFilters, variant: "outline", className: "flex-1 h-14 font-bold rounded-none border-white/10 text-white uppercase tracking-widest text-[10px]", children: "Reset" }), _jsx(Button, { onClick: () => setIsFilterOpen(false), className: "flex-[2] bg-white text-black hover:bg-orange-600 hover:text-white h-14 font-bold rounded-none transition-colors uppercase tracking-widest text-[10px]", children: "Apply" })] })] })] }));
}
export function ProductsPage(props) {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" }) }), children: _jsx(ProductsPageContent, { ...props }) }));
}

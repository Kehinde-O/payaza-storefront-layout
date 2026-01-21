'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { Sheet } from '../../../components/ui/sheet';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { ProductCard } from '../../../components/ui/product-card';
import { ProductGridSkeleton } from '../../../components/ui/skeletons';
import { CategoryTree } from '../../../components/ui/category-tree';
import { useStore } from '../../../lib/store-context';
import { useToast } from '../../../components/ui/toast';
import { useLoading } from '../../../lib/loading-context';
import { useAnalytics } from '../../../hooks/use-analytics';
import { ChevronDown, ChevronUp, Star, Check, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { formatCurrency, filterActiveProducts } from '../../../lib/utils';
import { getAllCategoryIds, flattenCategoryTree, buildCategoryTree } from '../../../lib/utils/category-tree';
import { getBannerImage, getLayoutText } from '../../../lib/utils/asset-helpers';
import { shouldUseAPI } from '../../../lib/utils/demo-detection';
function ProductsPageContent({ storeConfig: initialConfig }) {
    const { store, addToCart } = useStore();
    const storeConfig = store || initialConfig;
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [products, setProducts] = useState(() => {
        // Filter out inactive/deleted products first
        let initialProducts = filterActiveProducts(storeConfig.products || []);
        // Ensure all products have unique IDs just in case mock data has duplicates
        // or if we are artificially duplicating for grid demo
        if (initialProducts.length > 0) {
            // If very few products, duplicate them to show grid structure
            if (initialProducts.length < 4) {
                initialProducts = [...initialProducts, ...initialProducts].map((p, i) => ({
                    ...p,
                    id: `${p.id}-copy-${i}`,
                    name: `${p.name} ${i > 0 ? '(Copy)' : ''}`
                }));
            }
            else {
                // Even if enough products, ensure IDs are unique strings
                // (Mock data usually is fine, but this is a safeguard)
                const seenIds = new Set();
                initialProducts = initialProducts.map((p, i) => {
                    if (seenIds.has(p.id)) {
                        return { ...p, id: `${p.id}-${i}` };
                    }
                    seenIds.add(p.id);
                    return p;
                });
            }
        }
        return initialProducts;
    });
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const categories = storeConfig.categories || [];
    // Update products when storeConfig.products changes (e.g., after async load)
    useEffect(() => {
        if (storeConfig.products && storeConfig.products.length > 0) {
            setProducts(storeConfig.products);
        }
        else if (storeConfig.products && storeConfig.products.length === 0 && !isLoadingProducts) {
            // If products array is empty, try to fetch from API
            const fetchProducts = async () => {
                setIsLoadingProducts(true);
                startBackendLoading();
                try {
                    const { productService } = await import('../../../lib/services/product.service');
                    const { transformProductToStoreProduct } = await import('../../../lib/store-config-utils');
                    const response = await productService.getProducts({
                        storeId: storeConfig.id,
                        limit: 1000,
                    });
                    const fetchedProducts = response.data.map(transformProductToStoreProduct);
                    setProducts(fetchedProducts);
                }
                catch (error) {
                    console.error('Failed to fetch products:', error);
                    // Keep empty array on error
                }
                finally {
                    setIsLoadingProducts(false);
                    stopBackendLoading();
                }
            };
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeConfig.products, storeConfig.id]); // Removed isLoadingProducts from deps to prevent infinite loops
    const { addToast } = useToast();
    const { startBackendLoading, stopBackendLoading } = useLoading();
    const { trackEvent } = useAnalytics();
    // State for filters & sort
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
    // Initialize filters from URL
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategoryFilter(categoryParam);
        }
    }, [categoryParam]);
    const [minRating, setMinRating] = useState(null);
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('featured');
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [isFiltering, setIsFiltering] = useState(false);
    // Extract unique brands
    const brands = useMemo(() => {
        const brandSet = new Set();
        products.forEach(product => {
            // First check specifications for Brand
            if (product.specifications?.Brand) {
                brandSet.add(product.specifications.Brand);
            }
            else {
                // Fallback to regex matching common brand names
                const brandMatch = product.name.match(/\b(Reebok|Nike|Adidas|Puma|Zara|Dickies|Vans|Uniqlo|New Balance|Converse|Sony|Samsung|Apple|Dell|HP|Gucci|Prada|Versace|Armani|Calvin Klein|Tommy Hilfiger|Levi's|Gap|H&M|Forever 21|ASOS|Shein|Amazon|Microsoft|LG|Canon|Nikon|Bose|JBL|Beats|Ray-Ban|Oakley)\b/i);
                if (brandMatch) {
                    brandSet.add(brandMatch[1]);
                }
            }
        });
        return Array.from(brandSet).sort();
    }, [products]);
    // Track filter changes and show loading
    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => setIsFiltering(false), 300);
        return () => clearTimeout(timer);
    }, [selectedBrands, selectedCategories, priceRange, selectedCategoryFilter, minRating, showInStockOnly, sortBy]);
    // Build category tree for filtering
    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
    // Get all category IDs to filter (including children of selected parent categories)
    const effectiveCategoryIds = useMemo(() => {
        if (selectedCategories.length === 0)
            return [];
        const allIds = new Set();
        const flatCategories = flattenCategoryTree(categoryTree);
        selectedCategories.forEach(selectedId => {
            allIds.add(selectedId);
            // Find the category and add all its children
            const category = flatCategories.find(c => c.id === selectedId);
            if (category) {
                const childIds = getAllCategoryIds(category);
                childIds.forEach(id => allIds.add(id));
            }
        });
        return Array.from(allIds);
    }, [selectedCategories, categoryTree]);
    // Filter & Sort Logic
    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter(product => {
            // Brand filter
            if (selectedBrands.length > 0) {
                const productBrand = product.specifications?.Brand ||
                    product.name.match(/\b(Reebok|Nike|Adidas|Puma|Zara|Dickies|Vans|Uniqlo|New Balance|Converse|Sony|Samsung|Apple|Dell|HP|Gucci|Prada|Versace|Armani|Calvin Klein|Tommy Hilfiger|Levi's|Gap|H&M|Forever 21|ASOS|Shein|Amazon|Microsoft|LG|Canon|Nikon|Bose|JBL|Beats|Ray-Ban|Oakley)\b/i)?.[1];
                if (!productBrand || !selectedBrands.includes(productBrand)) {
                    return false;
                }
            }
            // Category filter (Sidebar) - includes parent and child categories
            if (effectiveCategoryIds.length > 0) {
                if (!effectiveCategoryIds.includes(product.categoryId)) {
                    return false;
                }
            }
            // Price filter
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }
            // Category Filter (Top Buttons)
            if (selectedCategoryFilter) {
                const category = categories.find(c => c.slug === selectedCategoryFilter);
                if (category && product.categoryId !== category.id) {
                    return false;
                }
            }
            // Rating Filter
            if (minRating !== null) {
                const productRating = product.rating || 0;
                if (productRating < minRating) {
                    return false;
                }
            }
            // Availability Filter
            if (showInStockOnly) {
                if (!product.inStock) {
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
            case 'newest':
                // Simulating newness by ID or reverse original order
                result.reverse();
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                // Featured - keep original order
                break;
        }
        return result;
    }, [products, selectedBrands, effectiveCategoryIds, priceRange, selectedCategoryFilter, minRating, showInStockOnly, sortBy, categories]);
    const displayedProducts = filteredAndSortedProducts.slice(0, visibleProducts);
    const hasMore = visibleProducts < filteredAndSortedProducts.length;
    const handleAddToCart = (product) => {
        addToCart(product);
        addToast(`${product.name} added to cart`, 'success');
    };
    const handleQuickView = (product) => {
        addToast(`Quick view for ${product.name}`, 'info');
    };
    const clearAllFilters = () => {
        setSelectedBrands([]);
        setSelectedCategories([]);
        setPriceRange([0, 5000]);
        setSelectedCategoryFilter(null);
        setMinRating(null);
        setShowInStockOnly(false);
    };
    const hasActiveFilters = selectedBrands.length > 0 ||
        selectedCategories.length > 0 ||
        priceRange[1] < 5000 ||
        minRating !== null ||
        showInStockOnly;
    // Breadcrumbs
    const breadcrumbItems = [
        { label: storeConfig.name, href: `/${storeConfig.slug}` },
        { label: 'Products', href: `/${storeConfig.slug}/products` },
    ];
    // Get layout config and category header image
    const layoutConfig = storeConfig.layoutConfig;
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // Get products header config - check pages.products.productsHeader first, then fallback to sections.productsHeader
    const productsHeaderConfig = layoutConfig?.pages?.products?.productsHeader ||
        layoutConfig?.sections?.productsHeader;
    // Get category header image from assignedAssets (legacy support)
    const categoryHeaderImage = layoutConfig?.assignedAssets?.category_header ||
        getBannerImage(storeConfig, 'category_header', '');
    // Get category header title from assignedText (legacy support)
    const categoryHeaderTitle = layoutConfig?.assignedText?.['category_header:title'] ||
        getLayoutText(storeConfig, 'category_header:title', `Explore The Collections of ${storeConfig.name}`);
    // Get category header buttons from configuration (legacy support)
    const categoryHeaderPrimaryButton = layoutConfig?.assignedText?.['category_header:primaryButton'];
    const categoryHeaderSecondaryButton = layoutConfig?.assignedText?.['category_header:secondaryButton'];
    // Determine button text - use config value if available and not empty, otherwise use fallback
    const hasPrimaryButtonFromConfig = categoryHeaderPrimaryButton !== undefined && categoryHeaderPrimaryButton !== null;
    const hasSecondaryButtonFromConfig = categoryHeaderSecondaryButton !== undefined && categoryHeaderSecondaryButton !== null;
    const primaryButtonText = hasPrimaryButtonFromConfig
        ? (categoryHeaderPrimaryButton && categoryHeaderPrimaryButton.trim() !== '' ? categoryHeaderPrimaryButton.trim() : null)
        : getLayoutText(storeConfig, 'common.shopNow', 'Start Shopping');
    const secondaryButtonText = hasSecondaryButtonFromConfig
        ? (categoryHeaderSecondaryButton && categoryHeaderSecondaryButton.trim() !== '' ? categoryHeaderSecondaryButton.trim() : null)
        : getLayoutText(storeConfig, 'sections.categories.viewAll', 'View Categories');
    return (_jsxs("div", { className: "min-h-screen bg-white font-sans text-slate-900", children: [productsHeaderConfig?.show !== false && (_jsxs("div", { className: "relative overflow-hidden bg-white", children: [(productsHeaderConfig?.image || categoryHeaderImage) && (_jsxs("div", { className: "absolute inset-0 z-0", children: [_jsx(ImageWithFallback, { src: productsHeaderConfig?.image || categoryHeaderImage, alt: productsHeaderConfig?.title || categoryHeaderTitle || storeConfig.name, className: "w-full h-full object-cover", skeletonAspectRatio: "16/9" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" })] })), !(productsHeaderConfig?.image || categoryHeaderImage) && (_jsxs("div", { className: "absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow" }), _jsx("div", { className: "absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow", style: { animationDelay: '2s' } })] })), _jsx("div", { className: `container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-16 lg:pt-20 lg:pb-24 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'min-h-[500px] flex items-center' : ''}`, children: _jsx("div", { className: "flex flex-col items-center w-full max-w-4xl mx-auto", children: _jsxs("div", { className: `w-full text-center lg:text-left animate-fade-in-up ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'text-white' : ''}`, children: [_jsx("div", { className: "flex justify-center lg:justify-start mb-6", children: _jsx("div", { className: (productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20' : '', children: _jsx(Breadcrumbs, { items: breadcrumbItems, variant: (productsHeaderConfig?.image || categoryHeaderImage) ? 'light' : 'default' }) }) }), _jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-6 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' : 'bg-black/5 text-gray-900'}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full animate-pulse ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white' : 'bg-black'}` }), productsHeaderConfig?.badge || getLayoutText(storeConfig, 'common.newArrivals', 'New Arrivals 2024')] }), _jsx("h1", { className: `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'text-white' : 'text-gray-900'}`, children: productsHeaderConfig?.title || categoryHeaderTitle || (_jsxs(_Fragment, { children: ["Explore The Collections of ", _jsx("br", {}), _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900", children: storeConfig.name })] })) }), _jsx("p", { className: `text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'text-white/90' : 'text-gray-600'}`, children: productsHeaderConfig?.description || getLayoutText(storeConfig, 'category_header:description', "Don't miss out on shopping our latest collection! curated for quality and style. Experience the perfect blend of modern aesthetics and premium craftsmanship.") }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start", children: [(productsHeaderConfig?.primaryButtonText || primaryButtonText) && (productsHeaderConfig?.primaryButtonText || primaryButtonText).trim() !== '' && (_jsx(Button, { className: `h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white text-gray-900 hover:bg-gray-100' : ''}`, onClick: () => {
                                                    const element = document.getElementById('product-grid');
                                                    element?.scrollIntoView({ behavior: 'smooth' });
                                                }, children: productsHeaderConfig?.primaryButtonText || primaryButtonText })), (productsHeaderConfig?.secondaryButtonText || secondaryButtonText) && (productsHeaderConfig?.secondaryButtonText || secondaryButtonText).trim() !== '' && (_jsx(Button, { className: `h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'}`, onClick: () => {
                                                    window.location.href = `/${storeConfig.slug}/categories`;
                                                }, children: productsHeaderConfig?.secondaryButtonText || secondaryButtonText }))] })] }) }) })] })), _jsxs("div", { "data-content-ready": true, className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide", children: [_jsx("button", { onClick: () => setSelectedCategoryFilter(null), className: `px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${!selectedCategoryFilter
                                    ? 'bg-gray-900 text-white hover:bg-blue-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`, children: "All" }), categories.map((category) => (_jsx("button", { onClick: () => setSelectedCategoryFilter(selectedCategoryFilter === category.slug ? null : category.slug), className: `px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${selectedCategoryFilter === category.slug
                                    ? 'bg-gray-900 text-white hover:bg-blue-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`, children: category.name }, category.id)))] }), _jsxs("div", { id: "product-grid", className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsxs("aside", { className: "hidden lg:block col-span-1 space-y-8 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-gray-100", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Filters" }), hasActiveFilters && (_jsxs("button", { onClick: clearAllFilters, className: "text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1", children: [_jsx(RotateCcw, { className: "h-3 w-3" }), " Reset"] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4", children: "Availability" }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx("div", { className: `w-5 h-5 rounded border flex items-center justify-center transition-colors ${showInStockOnly ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`, children: showInStockOnly && _jsx(Check, { className: "h-3 w-3 text-white" }) }), _jsx("input", { type: "checkbox", className: "hidden", checked: showInStockOnly, onChange: () => setShowInStockOnly(!showInStockOnly) }), _jsx("span", { className: "text-sm text-gray-700 font-medium", children: "In Stock Only" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 uppercase tracking-wide", children: "Brand" }), selectedBrands.length > 0 && (_jsx("button", { onClick: () => setSelectedBrands([]), className: "text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors", children: "Clear" }))] }), brands.length > 0 ? (_jsxs("div", { className: "space-y-2", children: [(showMoreBrands ? brands : brands.slice(0, 6)).map((brand) => (_jsx("label", { className: "flex items-center justify-between cursor-pointer group hover:bg-blue-50 hover:text-blue-600 p-2 rounded-lg -ml-2 -mr-2 transition-colors", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: selectedBrands.includes(brand), onChange: () => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700 font-medium group-hover:text-blue-600", children: brand })] }) }, brand))), brands.length > 6 && (_jsx("button", { onClick: () => setShowMoreBrands(!showMoreBrands), className: "text-sm text-gray-600 hover:text-blue-600 font-medium mt-2 flex items-center gap-1 transition-colors", children: showMoreBrands ? _jsxs(_Fragment, { children: ["Show less ", _jsx(ChevronUp, { className: "h-4 w-4" })] }) : _jsxs(_Fragment, { children: ["Show more ", _jsx(ChevronDown, { className: "h-4 w-4" })] }) }))] })) : (_jsx("p", { className: "text-xs text-gray-500 italic", children: "No brands available" }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4", children: "Category" }), _jsx(CategoryTree, { categories: categories, selectedCategoryIds: selectedCategories, onCategoryToggle: (categoryId, isSelected) => {
                                                    setSelectedCategories(prev => isSelected
                                                        ? [...prev, categoryId]
                                                        : prev.filter(id => id !== categoryId));
                                                }, mode: "checkbox" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 uppercase tracking-wide", children: "Price Range" }), (priceRange[0] > 0 || priceRange[1] < 5000) && (_jsx("button", { onClick: () => setPriceRange([0, 5000]), className: "text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors", children: "Reset" }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx("input", { type: "range", min: "0", max: "5000", step: "50", value: priceRange[1], onChange: (e) => setPriceRange([priceRange[0], parseInt(e.target.value)]), className: "flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900" }) }), _jsxs("div", { className: "flex items-center justify-between text-sm font-medium", children: [_jsx("span", { className: "text-gray-900", children: formatCurrency(priceRange[0], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }), _jsx("span", { className: "text-gray-900", children: formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => setPriceRange([0, 100]), className: "px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors", children: "$0 - $100" }), _jsx("button", { onClick: () => setPriceRange([0, 500]), className: "px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors", children: "$0 - $500" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4", children: "Rating" }), _jsx("div", { className: "space-y-2", children: [4, 3, 2, 1].map((rating) => (_jsxs("label", { className: "flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors", children: [_jsx("div", { className: `w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${minRating === rating ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`, children: minRating === rating && _jsx("div", { className: "w-2.5 h-2.5 bg-white rounded-full" }) }), _jsx("input", { type: "radio", name: "rating", checked: minRating === rating, onChange: () => setMinRating(minRating === rating ? null : rating), className: "hidden" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "flex text-yellow-400", children: Array.from({ length: 5 }).map((_, i) => (_jsx(Star, { className: `h-3.5 w-3.5 ${i < rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}` }, i))) }), _jsx("span", { className: "text-sm text-gray-600", children: "& Up" })] })] }, rating))) })] })] }), _jsxs("div", { className: "lg:col-span-3", children: [_jsxs("div", { className: "lg:hidden mb-6 flex items-center justify-between", children: [_jsxs(Button, { onClick: () => setIsFilterOpen(true), variant: "outline", className: "flex items-center gap-2", children: [_jsx(SlidersHorizontal, { className: "h-4 w-4" }), " Filters"] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-transparent text-sm font-medium text-gray-700 focus:outline-none", children: [_jsx("option", { value: "featured", children: "Sort by: Featured" }), _jsx("option", { value: "newest", children: "Sort by: Newest" }), _jsx("option", { value: "price-asc", children: "Sort by: Price Low-High" }), _jsx("option", { value: "price-desc", children: "Sort by: Price High-Low" })] })] }), _jsxs("div", { className: "hidden lg:flex items-center justify-between mb-6", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", _jsx("span", { className: "font-semibold text-gray-900", children: filteredAndSortedProducts.length }), " products"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-500", children: "Sort by:" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer hover:text-blue-600 transition-colors", children: [_jsx("option", { value: "featured", children: "Featured" }), _jsx("option", { value: "newest", children: "Newest Arrivals" }), _jsx("option", { value: "price-asc", children: "Price: Low to High" }), _jsx("option", { value: "price-desc", children: "Price: High to Low" }), _jsx("option", { value: "rating", children: "Top Rated" })] })] })] }), isLoadingProducts || isFiltering ? (_jsx(ProductGridSkeleton, { count: 12, columns: 3 })) : displayedProducts.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: displayedProducts.map((product) => (_jsx(ProductCard, { product: product, storeSlug: storeConfig.slug, onAddToCart: handleAddToCart, onQuickView: handleQuickView }, product.id))) }), hasMore && (_jsx("div", { className: "mt-12 text-center", children: _jsx(Button, { onClick: () => setVisibleProducts(prev => prev + 12), variant: "outline", className: "min-w-[200px]", children: "Load More" }) }))] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-200 text-center", children: [_jsx("div", { className: "w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400", children: _jsx(Search, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: "No products found" }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Try adjusting your filters or search criteria." }), _jsx(Button, { onClick: clearAllFilters, variant: "outline", children: "Clear All Filters" })] }))] })] })] }), _jsxs(Sheet, { isOpen: isFilterOpen, onClose: () => setIsFilterOpen(false), title: "Filters", side: "right", children: [_jsxs("div", { className: "flex flex-col h-full overflow-y-auto pb-20 space-y-8 p-1", children: [_jsxs("div", { className: "pb-6 border-b border-gray-100", children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-widest mb-4", children: "Availability" }), _jsxs("label", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: showInStockOnly, onChange: () => setShowInStockOnly(!showInStockOnly), className: "rounded border-gray-300 text-black focus:ring-black" }), _jsx("span", { className: "text-sm text-gray-700", children: "In Stock Only" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-widest mb-4", children: "Price Range" }), _jsx("input", { type: "range", min: "0", max: "5000", step: "50", value: priceRange[1], onChange: (e) => setPriceRange([priceRange[0], parseInt(e.target.value)]), className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-4" }), _jsxs("div", { className: "flex justify-between font-bold text-sm", children: [_jsx("span", { children: formatCurrency(0, storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }), _jsxs("span", { children: [formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), "+"] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-widest mb-4", children: "Categories" }), _jsx(CategoryTree, { categories: categories, selectedCategoryIds: selectedCategories, onCategoryToggle: (categoryId, isSelected) => {
                                            setSelectedCategories(prev => isSelected
                                                ? [...prev, categoryId]
                                                : prev.filter(id => id !== categoryId));
                                        }, mode: "checkbox" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-widest mb-4", children: "Brand" }), brands.length > 0 ? (_jsx("div", { className: "space-y-3", children: brands.map(brand => (_jsxs("label", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: selectedBrands.includes(brand), onChange: () => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]), className: "rounded border-gray-300 text-black focus:ring-black" }), _jsx("span", { className: "text-sm text-gray-700", children: brand })] }, brand))) })) : (_jsx("p", { className: "text-xs text-gray-500 italic", children: "No brands available" }))] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-widest mb-4", children: "Rating" }), _jsx("div", { className: "space-y-3", children: [4, 3, 2, 1].map(rating => (_jsxs("label", { className: "flex items-center gap-3", children: [_jsx("input", { type: "radio", name: "mobile-rating", checked: minRating === rating, onChange: () => setMinRating(minRating === rating ? null : rating), className: "rounded-full border-gray-300 text-black focus:ring-black" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "flex text-yellow-400", children: Array.from({ length: 5 }).map((_, i) => (_jsx(Star, { className: `h-3 w-3 ${i < rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}` }, i))) }), _jsx("span", { className: "text-sm text-gray-600", children: "& Up" })] })] }, rating))) })] })] }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3", children: [_jsx(Button, { onClick: clearAllFilters, variant: "outline", className: "flex-1 h-12 font-bold rounded-lg border-gray-300", children: "Reset" }), _jsx(Button, { onClick: () => setIsFilterOpen(false), className: "flex-[2] bg-black text-white hover:bg-blue-600 h-12 font-bold rounded-lg transition-colors", children: "View Results" })] })] })] }));
}
export function ProductsPage(props) {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" }) }), children: _jsx(ProductsPageContent, { ...props }) }));
}

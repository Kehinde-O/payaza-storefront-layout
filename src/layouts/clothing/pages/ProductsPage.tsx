'use client';

import { StoreConfig, StoreProduct } from '../../../lib/store-types';
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
import { ShoppingCart, Heart, ChevronDown, ChevronUp, Star, Check, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { formatCurrency, filterActiveProducts } from '../../../lib/utils';
import { getAllCategoryIds, flattenCategoryTree, buildCategoryTree } from '../../../lib/utils/category-tree';
import { getBannerImage, getLayoutText } from '../../../lib/utils/asset-helpers';
import { shouldUseAPI } from '../../../lib/utils/demo-detection';

interface ProductsPageProps {
  storeConfig: StoreConfig;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

function ProductsPageContent({ storeConfig: initialConfig }: ProductsPageProps) {
  const { store, addToCart } = useStore();
  const storeConfig = store || initialConfig;
  
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<StoreProduct[]>(() => {
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
       } else {
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
    } else if (storeConfig.products && storeConfig.products.length === 0 && !isLoadingProducts) {
      // If products array is empty, try to fetch from API
      const fetchProducts = async () => {
        setIsLoadingProducts(true);
        startBackendLoading();
        try {
          const { productService } = await import('@/lib/services/product.service');
          const { transformProductToStoreProduct } = await import('@/lib/store-config-utils');
          const response = await productService.getProducts({
            storeId: storeConfig.id,
            limit: 1000,
          });
          const fetchedProducts = response.data.map(transformProductToStoreProduct);
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Failed to fetch products:', error);
          // Keep empty array on error
        } finally {
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Initialize filters from URL
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategoryFilter(categoryParam);
    }
  }, [categoryParam]);

  const [minRating, setMinRating] = useState<number | null>(null);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isFiltering, setIsFiltering] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(product => {
      // First check specifications for Brand
      if (product.specifications?.Brand) {
        brandSet.add(product.specifications.Brand);
      } else {
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
    if (selectedCategories.length === 0) return [];
    
    const allIds = new Set<string>();
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

  const handleAddToCart = (product: StoreProduct) => {
    addToCart(product);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleQuickView = (product: StoreProduct) => {
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
  const categoryHeaderPrimaryButton = layoutConfig?.assignedText?.['category_header:primaryButton'] as string | undefined;
  const categoryHeaderSecondaryButton = layoutConfig?.assignedText?.['category_header:secondaryButton'] as string | undefined;
  
  // Determine button text - use config value if available and not empty, otherwise use fallback
  const hasPrimaryButtonFromConfig = categoryHeaderPrimaryButton !== undefined && categoryHeaderPrimaryButton !== null;
  const hasSecondaryButtonFromConfig = categoryHeaderSecondaryButton !== undefined && categoryHeaderSecondaryButton !== null;
  
  const primaryButtonText = hasPrimaryButtonFromConfig
    ? (categoryHeaderPrimaryButton && categoryHeaderPrimaryButton.trim() !== '' ? categoryHeaderPrimaryButton.trim() : null)
    : getLayoutText(storeConfig, 'common.shopNow', 'Start Shopping');
  const secondaryButtonText = hasSecondaryButtonFromConfig
    ? (categoryHeaderSecondaryButton && categoryHeaderSecondaryButton.trim() !== '' ? categoryHeaderSecondaryButton.trim() : null)
    : getLayoutText(storeConfig, 'sections.categories.viewAll', 'View Categories');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* Header Section */}
      {productsHeaderConfig?.show !== false && (
        <div className="relative overflow-hidden bg-white">
          {/* Category Header Image Background - if available */}
          {(productsHeaderConfig?.image || categoryHeaderImage) && (
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src={productsHeaderConfig?.image || categoryHeaderImage}
                alt={productsHeaderConfig?.title || categoryHeaderTitle || storeConfig.name}
                className="w-full h-full object-cover"
                skeletonAspectRatio="16/9"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
            </div>
          )}
          
          {/* Decorative background elements - only show if no category header image */}
          {!(productsHeaderConfig?.image || categoryHeaderImage) && (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
               <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>
          )}

          <div className={`container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-16 lg:pt-20 lg:pb-24 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'min-h-[500px] flex items-center' : ''}`}>
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
              
              {/* Text Content */}
              <div className={`w-full text-center lg:text-left animate-fade-in-up ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'text-white' : ''}`}>
                <div className="flex justify-center lg:justify-start mb-6">
                  {/* Breadcrumb with backdrop for image visibility */}
                  <div className={(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20' : ''}>
                    <Breadcrumbs items={breadcrumbItems} variant={(productsHeaderConfig?.image || categoryHeaderImage) ? 'light' : 'default'} />
                  </div>
                </div>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-6 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' : 'bg-black/5 text-gray-900'}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white' : 'bg-black'}`}></span>
                  {productsHeaderConfig?.badge || getLayoutText(storeConfig, 'common.newArrivals', 'New Arrivals 2024')}
              </div>
                
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'text-white' : 'text-gray-900'}`}>
                  {productsHeaderConfig?.title || categoryHeaderTitle || (
                    <>
                      Explore The Collections of <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">{storeConfig.name}</span>
                    </>
                  )}
                </h1>
                
                <p className={`text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'text-white/90' : 'text-gray-600'}`}>
                  {productsHeaderConfig?.description || getLayoutText(storeConfig, 'category_header:description', "Don't miss out on shopping our latest collection! curated for quality and style. Experience the perfect blend of modern aesthetics and premium craftsmanship.")}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                   {/* Primary button - only show if text is not empty */}
                   {(productsHeaderConfig?.primaryButtonText || primaryButtonText) && (productsHeaderConfig?.primaryButtonText || primaryButtonText).trim() !== '' && (
                     <Button 
                        className={`h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white text-gray-900 hover:bg-gray-100' : ''}`}
                        onClick={() => {
                          const element = document.getElementById('product-grid');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                     >
                       {productsHeaderConfig?.primaryButtonText || primaryButtonText}
                     </Button>
                   )}
                   {/* Secondary button - only show if text is not empty, matches Start Shopping design */}
                   {(productsHeaderConfig?.secondaryButtonText || secondaryButtonText) && (productsHeaderConfig?.secondaryButtonText || secondaryButtonText).trim() !== '' && (
                     <Button 
                        className={`h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${(productsHeaderConfig?.image || categoryHeaderImage) ? 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'}`}
                        onClick={() => {
                          window.location.href = `/${storeConfig.slug}/categories`;
                        }}
                     >
                       {productsHeaderConfig?.secondaryButtonText || secondaryButtonText}
                     </Button>
                   )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <div data-content-ready className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Category Filter Buttons */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button
            onClick={() => setSelectedCategoryFilter(null)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              !selectedCategoryFilter
                ? 'bg-gray-900 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === category.slug ? null : category.slug)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategoryFilter === category.slug
                  ? 'bg-gray-900 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div id="product-grid" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block col-span-1 space-y-8 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters} 
                  className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            {/* Availability Filter */}
            <div>
               <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Availability</h3>
               <label className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showInStockOnly ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                     {showInStockOnly && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <input 
                     type="checkbox" 
                     className="hidden" 
                     checked={showInStockOnly} 
                     onChange={() => setShowInStockOnly(!showInStockOnly)}
                  />
                  <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
               </label>
            </div>

            {/* Brand Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Brand</h3>
                  {selectedBrands.length > 0 && (
                    <button onClick={() => setSelectedBrands([])} className="text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors">
                      Clear
                    </button>
                  )}
                </div>
              {brands.length > 0 ? (
                <div className="space-y-2">
                  {(showMoreBrands ? brands : brands.slice(0, 6)).map((brand) => (
                    <label key={brand} className="flex items-center justify-between cursor-pointer group hover:bg-blue-50 hover:text-blue-600 p-2 rounded-lg -ml-2 -mr-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600">{brand}</span>
                      </div>
                    </label>
                  ))}
                  {brands.length > 6 && (
                    <button onClick={() => setShowMoreBrands(!showMoreBrands)} className="text-sm text-gray-600 hover:text-blue-600 font-medium mt-2 flex items-center gap-1 transition-colors">
                      {showMoreBrands ? <>Show less <ChevronUp className="h-4 w-4" /></> : <>Show more <ChevronDown className="h-4 w-4" /></>}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No brands available</p>
              )}
              </div>

            {/* Category Filter */}
            <div>
               <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Category</h3>
               <CategoryTree
                  categories={categories}
                  selectedCategoryIds={selectedCategories}
                  onCategoryToggle={(categoryId, isSelected) => {
                    setSelectedCategories(prev => 
                      isSelected 
                        ? [...prev, categoryId]
                        : prev.filter(id => id !== categoryId)
                    );
                  }}
                  mode="checkbox"
               />
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price Range</h3>
                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                  <button onClick={() => setPriceRange([0, 5000])} className="text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                  />
                </div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-gray-900">{formatCurrency(priceRange[0], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  <span className="text-gray-900">{formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => setPriceRange([0, 100])} className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">$0 - $100</button>
                   <button onClick={() => setPriceRange([0, 500])} className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">$0 - $500</button>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
               <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Rating</h3>
               <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                     <label key={rating} className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${minRating === rating ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                           {minRating === rating && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                        <input 
                           type="radio" 
                           name="rating"
                           checked={minRating === rating}
                           onChange={() => setMinRating(minRating === rating ? null : rating)}
                           className="hidden"
                        />
                        <div className="flex items-center gap-1">
                           <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                 <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                              ))}
                           </div>
                           <span className="text-sm text-gray-600">& Up</span>
                        </div>
                     </label>
                  ))}
               </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
             {/* Mobile Filter Trigger */}
             <div className="lg:hidden mb-6 flex items-center justify-between">
                <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="flex items-center gap-2">
                   <SlidersHorizontal className="h-4 w-4" /> Filters
                </Button>
                <select 
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value as SortOption)}
                   className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                >
                   <option value="featured">Sort by: Featured</option>
                   <option value="newest">Sort by: Newest</option>
                   <option value="price-asc">Sort by: Price Low-High</option>
                   <option value="price-desc">Sort by: Price High-Low</option>
                </select>
             </div>

             {/* Desktop Sort & Results Count */}
             <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                   Showing <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> products
                </p>
                <div className="flex items-center gap-2">
                   <span className="text-sm text-gray-500">Sort by:</span>
                   <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer hover:text-blue-600 transition-colors"
                   >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                   </select>
                </div>
             </div>

             {/* The Grid */}
             {isLoadingProducts || isFiltering ? (
                <ProductGridSkeleton count={12} columns={3} />
             ) : displayedProducts.length > 0 ? (
                <>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedProducts.map((product) => (
                         <ProductCard 
                            key={product.id}
                            product={product}
                            storeSlug={storeConfig.slug}
                            onAddToCart={handleAddToCart}
                            onQuickView={handleQuickView}
                         />
                      ))}
                   </div>

                   {/* Load More */}
                   {hasMore && (
                      <div className="mt-12 text-center">
                         <Button 
                            onClick={() => setVisibleProducts(prev => prev + 12)}
                            variant="outline"
                            className="min-w-[200px]"
                         >
                            Load More
                         </Button>
                      </div>
                   )}
                </>
             ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-200 text-center">
                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                      <Search className="h-6 w-6" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                   <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
                   <Button 
                      onClick={clearAllFilters}
                      variant="outline"
                   >
                      Clear All Filters
                   </Button>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Filter Sheet (Mobile) */}
      <Sheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters" side="right">
         <div className="flex flex-col h-full overflow-y-auto pb-20 space-y-8 p-1">
            
            {/* Availability Mobile */}
            <div className="pb-6 border-b border-gray-100">
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Availability</h3>
               <label className="flex items-center gap-3">
                  <input 
                     type="checkbox" 
                     checked={showInStockOnly} 
                     onChange={() => setShowInStockOnly(!showInStockOnly)}
                     className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
               </label>
            </div>

            {/* Price Mobile */}
            <div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Price Range</h3>
               <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-4"
               />
               <div className="flex justify-between font-bold text-sm">
                  <span>{formatCurrency(0, storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  <span>{formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+</span>
               </div>
            </div>

            {/* Categories Mobile */}
            <div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Categories</h3>
               <CategoryTree
                  categories={categories}
                  selectedCategoryIds={selectedCategories}
                  onCategoryToggle={(categoryId, isSelected) => {
                    setSelectedCategories(prev => 
                      isSelected 
                        ? [...prev, categoryId]
                        : prev.filter(id => id !== categoryId)
                    );
                  }}
                  mode="checkbox"
               />
            </div>

            {/* Brands Mobile */}
               <div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Brand</h3>
               {brands.length > 0 ? (
                  <div className="space-y-3">
                     {brands.map(brand => (
                        <label key={brand} className="flex items-center gap-3">
                           <input 
                              type="checkbox" 
                              checked={selectedBrands.includes(brand)}
                              onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                              className="rounded border-gray-300 text-black focus:ring-black"
                           />
                           <span className="text-sm text-gray-700">{brand}</span>
                        </label>
                     ))}
                  </div>
               ) : (
                  <p className="text-xs text-gray-500 italic">No brands available</p>
               )}
               </div>

            {/* Rating Mobile */}
            <div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Rating</h3>
               <div className="space-y-3">
                  {[4, 3, 2, 1].map(rating => (
                     <label key={rating} className="flex items-center gap-3">
                        <input 
                           type="radio" 
                           name="mobile-rating"
                           checked={minRating === rating}
                           onChange={() => setMinRating(minRating === rating ? null : rating)}
                           className="rounded-full border-gray-300 text-black focus:ring-black"
                        />
                        <div className="flex items-center gap-1">
                           <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                 <Star key={i} className={`h-3 w-3 ${i < rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                              ))}
                           </div>
                           <span className="text-sm text-gray-600">& Up</span>
                        </div>
                     </label>
                  ))}
               </div>
            </div>
         </div>
         <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3">
            <Button onClick={clearAllFilters} variant="outline" className="flex-1 h-12 font-bold rounded-lg border-gray-300">
               Reset
            </Button>
            <Button onClick={() => setIsFilterOpen(false)} className="flex-[2] bg-black text-white hover:bg-blue-600 h-12 font-bold rounded-lg transition-colors">
               View Results
            </Button>
         </div>
      </Sheet>
    </div>
  );
}

export function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>}>
       <ProductsPageContent {...props} />
    </Suspense>
  );
}

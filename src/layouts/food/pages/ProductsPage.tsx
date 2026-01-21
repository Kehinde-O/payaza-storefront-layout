'use client';

import { StoreConfig, StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Sheet } from '@/components/ui/sheet';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { ProductCard } from '@/components/ui/product-card';
import { ProductGridSkeleton } from '@/components/ui/skeletons';
import { CategoryTree } from '@/components/ui/category-tree';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { useLoading } from '@/lib/loading-context';
import { useAnalytics } from '@/hooks/use-analytics';
import { ShoppingCart, Heart, ChevronDown, ChevronUp, Star, Check, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { formatCurrency, filterActiveProducts } from '@/lib/utils';
import { getAllCategoryIds, flattenCategoryTree, buildCategoryTree } from '@/lib/utils/category-tree';
import { getBannerImage, getLayoutText } from '@/lib/utils/asset-helpers';
import { shouldUseAPI } from '@/lib/utils/demo-detection';

interface ProductsPageProps {
  storeConfig: StoreConfig;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

function ProductsPageContent({ storeConfig: initialConfig }: ProductsPageProps) {
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize filters from URL
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategoryFilter(categoryParam);
    }
  }, [categoryParam]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
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

  const handleAddToCart = (item: any) => {
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
  const categoryHeaderPrimaryButton = layoutConfig?.assignedText?.['category_header:primaryButton'] as string | undefined;
  const categoryHeaderSecondaryButton = layoutConfig?.assignedText?.['category_header:secondaryButton'] as string | undefined;
  
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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* Header Section */}
      {productsConfig?.productsHeader?.show !== false && (
        <div className="relative overflow-hidden bg-white">
          {/* Category Header Image Background - if available */}
          {categoryHeaderImage && (
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src={categoryHeaderImage}
                alt={productsConfig?.productsHeader?.title || categoryHeaderTitle || storeConfig.name}
                className="w-full h-full object-cover"
                skeletonAspectRatio="16/9"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
            </div>
          )}
          
          {/* Decorative background elements - only show if no category header image */}
          {!categoryHeaderImage && (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
               <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>
          )}

          <div className={`container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-16 lg:pt-20 lg:pb-24 ${categoryHeaderImage ? 'min-h-[500px] flex items-center' : ''}`}>
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
              
              {/* Text Content */}
              <div className={`w-full text-center lg:text-left animate-fade-in-up ${categoryHeaderImage ? 'text-white' : ''}`}>
                <div className="flex justify-center lg:justify-start mb-6">
                  {/* Breadcrumb with backdrop for image visibility */}
                  <div className={categoryHeaderImage ? 'bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20' : ''}>
                    <Breadcrumbs items={breadcrumbItems} variant={categoryHeaderImage ? 'light' : 'default'} />
                  </div>
                </div>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-6 ${categoryHeaderImage ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' : 'bg-black/5 text-gray-900'}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${categoryHeaderImage ? 'bg-white' : 'bg-black'}`}></span>
                  {getLayoutText(storeConfig, 'common.newArrivals', 'New Arrivals 2024')}
              </div>
                
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] ${categoryHeaderImage ? 'text-white' : 'text-gray-900'}`}>
                  {productsConfig?.productsHeader?.title || categoryHeaderTitle || (
                    <>
                      Explore The Collections of <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">{storeConfig.name}</span>
                    </>
                  )}
                </h1>
                
                <p className={`text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 ${categoryHeaderImage ? 'text-white/90' : 'text-gray-600'}`}>
                  {getLayoutText(storeConfig, 'category_header:description', "Don't miss out on shopping our latest collection! curated for quality and style. Experience the perfect blend of modern aesthetics and premium craftsmanship.")}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                   {/* Primary button - only show if text is not empty */}
                   {primaryButtonText && primaryButtonText.trim() !== '' && (
                     <Button 
                        className={`h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${categoryHeaderImage ? 'bg-white text-gray-900 hover:bg-gray-100' : ''}`}
                        onClick={() => {
                          const element = document.getElementById('product-grid');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                     >
                       {primaryButtonText}
                     </Button>
                   )}
                   {/* Secondary button - only show if text is not empty, matches Start Shopping design */}
                   {secondaryButtonText && secondaryButtonText.trim() !== '' && (
                     <Button 
                        className={`h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${categoryHeaderImage ? 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'}`}
                        onClick={() => {
                          window.location.href = `/${storeConfig.slug}/categories`;
                        }}
                     >
                       {secondaryButtonText}
                     </Button>
                   )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {productsConfig?.productsGrid?.show !== false && (
        <>
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

            {/* Search Filter */}
            <div>
               <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Search</h3>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search items..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                 />
               </div>
            </div>

            {/* Category Filter */}
            <div>
               <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Category</h3>
               <div className="space-y-2">
                 {categories.map((category) => (
                   <label key={category.id} className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(category.id) ? 'bg-orange-500 border-orange-500' : 'border-gray-300 group-hover:border-orange-400'}`}>
                       {selectedCategories.includes(category.id) && <Check className="h-3 w-3 text-white" />}
                     </div>
                     <input 
                       type="checkbox" 
                       className="hidden" 
                       checked={selectedCategories.includes(category.id)} 
                       onChange={() => setSelectedCategories(prev => prev.includes(category.id) ? prev.filter(id => id !== category.id) : [...prev, category.id])}
                     />
                     <span className="text-sm text-gray-700 font-medium">{category.name}</span>
                   </label>
                 ))}
               </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Max Price</h3>
                {priceRange[1] < 100 && (
                  <button onClick={() => setPriceRange([0, 100])} className="text-xs text-gray-600 hover:text-orange-600 font-medium transition-colors">
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-gray-900">$0</span>
                  <span className="text-gray-900">{formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
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
                   <option value="price-asc">Sort by: Price Low-High</option>
                   <option value="price-desc">Sort by: Price High-Low</option>
                </select>
             </div>

             {/* Desktop Sort & Results Count */}
             <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                   Showing <span className="font-semibold text-gray-900">{filteredAndSortedItems.length}</span> items
                </p>
                <div className="flex items-center gap-2">
                   <span className="text-sm text-gray-500">Sort by:</span>
                   <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer hover:text-orange-600 transition-colors"
                   >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                   </select>
                </div>
             </div>

             {/* The Grid */}
             {isFiltering ? (
                <ProductGridSkeleton count={12} columns={3} />
             ) : displayedItems.length > 0 ? (
                <>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedItems.map((item) => (
                         <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                            <div className="relative aspect-square overflow-hidden">
                               <ImageWithFallback 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  skeletonAspectRatio="square"
                               />
                               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <Button 
                                     className="rounded-full bg-white text-black hover:bg-orange-600 hover:text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg font-bold px-8"
                                     onClick={() => handleAddToCart(item)}
                                  >
                                     Add to Order
                                  </Button>
                               </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                               <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h3>
                                  <span className="font-black text-lg text-gray-900 ml-2">{formatCurrency(item.price, storeConfig.settings?.currency || 'USD')}</span>
                               </div>
                               <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1">{item.description}</p>
                            </div>
                         </div>
                      ))}
                   </div>

                   {/* Load More */}
                   {hasMore && (
                      <div className="mt-12 text-center">
                         <Button 
                            onClick={() => setVisibleProducts(prev => prev + 12)}
                            variant="outline"
                            className="min-w-[200px] rounded-full font-bold h-12 border-gray-200 hover:border-orange-500 hover:text-orange-600"
                         >
                            Load More
                         </Button>
                      </div>
                   )}
                </>
             ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                      <Search className="h-8 w-8" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                   <p className="text-gray-500 mb-8 max-w-sm mx-auto">We couldn&apos;t find anything matching your filters. Try adjusting your search or clearing filters.</p>
                   <Button 
                      onClick={clearAllFilters}
                      className="rounded-full px-8 bg-gray-900 hover:bg-orange-600"
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
         <div className="flex flex-col h-full overflow-y-auto pb-24 space-y-8 p-1">
            
            {/* Search Mobile */}
            <div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Search</h3>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search items..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                 />
               </div>
            </div>

            {/* Categories Mobile */}
            <div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Categories</h3>
               <div className="space-y-3">
                 {categories.map((category) => (
                   <label key={category.id} className="flex items-center gap-3">
                     <input 
                       type="checkbox" 
                       checked={selectedCategories.includes(category.id)} 
                       onChange={() => setSelectedCategories(prev => prev.includes(category.id) ? prev.filter(id => id !== category.id) : [...prev, category.id])}
                       className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                     />
                     <span className="text-sm text-gray-700 font-medium">{category.name}</span>
                   </label>
                 ))}
               </div>
            </div>

            {/* Price Mobile */}
            <div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Max Price</h3>
               <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 mb-4"
               />
               <div className="flex justify-between font-bold text-sm">
                  <span>$0</span>
                  <span>{formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
               </div>
            </div>
         </div>
         <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3">
            <Button onClick={clearAllFilters} variant="outline" className="flex-1 h-12 font-bold rounded-xl border-gray-300">
               Reset
            </Button>
            <Button onClick={() => setIsFilterOpen(false)} className="flex-[2] bg-orange-600 text-white hover:bg-orange-700 h-12 font-bold rounded-xl transition-colors">
               View Results
            </Button>
         </div>
      </Sheet>
      </>
      )}
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

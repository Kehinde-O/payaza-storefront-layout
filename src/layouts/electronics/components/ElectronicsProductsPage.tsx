'use client';

import { StoreConfig, StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { CategoryTree } from '@/components/ui/category-tree';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { Filter, ChevronDown, Search, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { ElectronicsStoreHeader } from './ElectronicsStoreHeader';
import { ElectronicsStoreFooter } from './ElectronicsStoreFooter';
import { ElectronicsGridProductCard } from './ElectronicsGridProductCard';
import { Sheet } from '@/components/ui/sheet';
import { AnimatePresence } from 'framer-motion';
import { cn, formatCurrency, filterActiveProducts } from '@/lib/utils';
import { buildCategoryTree, getAllCategoryIds, flattenCategoryTree } from '@/lib/utils/category-tree';

interface ElectronicsProductsPageProps {
  storeConfig: StoreConfig;
}

function ElectronicsProductsPageContent({ storeConfig }: ElectronicsProductsPageProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<StoreProduct[]>(filterActiveProducts(storeConfig.products || []));
  const categories = useMemo(() => storeConfig.categories || [], [storeConfig.categories]);
  
  const { addToCart } = useStore();
  const { addToast } = useToast();

  // Filter States
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>('featured');
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
    if (!selectedCategoryFilter) return [];
    
    const flatCategories = flattenCategoryTree(categoryTree);
    const selectedCategory = flatCategories.find(c => c.slug === selectedCategoryFilter);
    if (!selectedCategory) return [];
    
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
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.reverse(); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }

    return result;
  }, [products, selectedCategoryFilter, selectedCategoryIds, priceRange, sortBy]);

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleProducts);
  const hasMore = visibleProducts < filteredAndSortedProducts.length;

  const handleAddToCart = (product: StoreProduct) => {
    addToCart(product);
    addToast(`${product.name} added to cart`, 'success');
  };

  const breadcrumbItems = [
    { label: storeConfig.name, href: `/${storeConfig.slug}` },
    { label: 'Products', href: `/${storeConfig.slug}/products` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ElectronicsStoreHeader storeConfig={storeConfig} />

      <main className="pt-24 pb-20">
         {/* Hero Section */}
         <div className="bg-slate-950 text-white mb-10 overflow-hidden relative">
             <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
             
             <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="mb-6 opacity-60">
                   <Breadcrumbs items={breadcrumbItems} />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                   All Products
                </h1>
                <p className="text-slate-400 max-w-xl text-lg font-light">
                   Explore our complete catalog of premium electronics.
                </p>
             </div>
         </div>

         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters (Desktop) */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-10 sticky top-32 self-start h-fit">
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </h3>
                        
                        <div className="space-y-6">
                            {/* Categories */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h4>
                                <CategoryTree
                                    categories={categories}
                                    selectedCategoryIds={selectedCategoryFilter ? [categories.find(c => c.slug === selectedCategoryFilter)?.id || ''] : []}
                                    onCategorySelect={(slug) => setSelectedCategoryFilter(selectedCategoryFilter === slug ? null : slug)}
                                    mode="button"
                                    showAllOption={true}
                                    onAllSelect={() => setSelectedCategoryFilter(null)}
                                    isAllSelected={!selectedCategoryFilter}
                                />
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Range</h4>
                                <div className="px-2">
                                   <input
                                      type="range"
                                      min="0"
                                      max="5000"
                                      step="50"
                                      value={priceRange[1]}
                                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                   />
                                   <div className="flex justify-between mt-2 text-xs font-bold text-slate-600">
                                      <span>{formatCurrency(0, storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                      <span>{formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+</span>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Grid */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="text-sm font-medium text-slate-500">
                            Showing <span className="text-slate-900 font-bold">{displayedProducts.length}</span> results
                        </div>

                        <div className="flex items-center gap-4">
                             <Button 
                                variant="outline" 
                                className="lg:hidden rounded-full border-slate-200"
                                onClick={() => setIsFilterOpen(true)}
                             >
                                <Filter className="h-4 w-4 mr-2" /> Filters
                             </Button>

                             <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500 hidden sm:inline">Sort by:</span>
                                <div className="relative">
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-white border border-slate-200 rounded-full pl-4 pr-10 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="newest">Newest</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {displayedProducts.length > 0 ? (
                       <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                          <AnimatePresence mode='popLayout'>
                            {displayedProducts.map((product, index) => (
                               <ElectronicsGridProductCard 
                                  key={product.id}
                                  product={product}
                                  storeSlug={storeConfig.slug}
                                  onAddToCart={handleAddToCart}
                                  index={index}
                               />
                            ))}
                          </AnimatePresence>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                             <Search className="h-6 w-6 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">No products found</h3>
                          <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm">
                             Try adjusting your filters or search criteria.
                          </p>
                          <Button onClick={() => {
                             setSelectedCategoryFilter(null);
                             setPriceRange([0, 5000]);
                          }} variant="outline" className="rounded-full px-8 border-slate-200">
                             Clear Filters
                          </Button>
                       </div>
                    )}

                    {hasMore && (
                       <div className="mt-16 text-center">
                          <Button 
                             onClick={() => setVisibleProducts(prev => prev + 12)}
                             variant="outline"
                             className="rounded-full px-10 h-12 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-sm font-bold uppercase tracking-wide"
                          >
                             Load More
                          </Button>
                       </div>
                    )}
                </div>
            </div>
         </div>
      </main>

      <ElectronicsStoreFooter storeConfig={storeConfig} />
      
      {/* Mobile Filter Sheet */}
      <Sheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters" side="right" className="w-[300px]">
          <div className="py-6 space-y-8 h-full flex flex-col">
             <div className="flex-1 space-y-8 overflow-y-auto">
                 <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-900">Categories</h3>
                    <CategoryTree
                        categories={categories}
                        selectedCategoryIds={selectedCategoryFilter ? [categories.find(c => c.slug === selectedCategoryFilter)?.id || ''] : []}
                        onCategorySelect={(slug) => setSelectedCategoryFilter(selectedCategoryFilter === slug ? null : slug)}
                        mode="button"
                        showAllOption={true}
                        onAllSelect={() => setSelectedCategoryFilter(null)}
                        isAllSelected={!selectedCategoryFilter}
                    />
                 </div>

                 <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-900">Price Range</h3>
                    <div className="px-2">
                       <input
                          type="range"
                          min="0"
                          max="5000"
                          step="50"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                       />
                       <div className="flex justify-between mt-4 text-sm font-bold text-slate-900">
                          <span>{formatCurrency(0, storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                          <span>{formatCurrency(priceRange[1], storeConfig.settings?.currency || 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+</span>
                       </div>
                    </div>
                 </div>
             </div>

             <div className="flex gap-4 pt-6 border-t border-slate-100">
                <Button variant="outline" className="flex-1 h-12 rounded-full border-slate-200" onClick={() => {
                   setPriceRange([0, 5000]);
                   setSelectedCategoryFilter(null);
                   setIsFilterOpen(false);
                }}>Reset</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full" onClick={() => setIsFilterOpen(false)}>
                   Show Results
                </Button>
             </div>
          </div>
      </Sheet>
    </div>
  );
}

export function ElectronicsProductsPage(props: ElectronicsProductsPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div></div>}>
       <ElectronicsProductsPageContent {...props} />
    </Suspense>
  );
}

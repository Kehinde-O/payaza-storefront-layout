'use client';

import { StoreConfig, StoreProduct, StoreService } from '../../../lib/store-types';
import { Button } from '../../../components/ui/button';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { useStore } from '../../../lib/store-context';
import { ArrowLeft, Filter, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast';
import { useAnalytics } from '../../../hooks/use-analytics';
import { useEffect } from 'react';
import { ProductCard } from '../../../components/ui/product-card';
import { getLayoutText, getTextContent } from '../../../lib/utils/asset-helpers';
import { formatCurrency, filterActiveProducts, filterActiveServices } from '../../../lib/utils';
import Image from 'next/image';

interface CategoryPageProps {
  storeConfig: StoreConfig;
  categorySlug: string;
}

export function CategoryPage({ storeConfig: initialConfig, categorySlug }: CategoryPageProps) {
  const { store, addToCart } = useStore();
  const storeConfig = store || initialConfig;
  
  const categories = storeConfig.categories || [];
  const category = categories.find(c => c.slug === categorySlug);
  const { addToast } = useToast();
  const { trackEvent } = useAnalytics();
  const categoryDetailConfig = storeConfig.layoutConfig?.pages?.categoryDetail;

  const products = (storeConfig.products || []).filter(p => p.categoryId === category?.id);
  const hasItems = products.length > 0;

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

  const handleAddToCart = (product: StoreProduct) => {
    addToCart(product);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleQuickView = (product: StoreProduct) => {
    addToast(`Quick view for ${product.name}`, 'info');
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-4">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href={`/${storeConfig.slug}/categories`}>
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Modern / Dark Theme Logic (e.g. for Modern Eats)
  const isDarkTheme = storeConfig.type === 'food-modern' || storeConfig.branding.theme === 'dark';
  const bgColor = isDarkTheme ? 'bg-[#0F0F0F]' : 'bg-gray-50';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
      {/* Header Banner */}
      {categoryDetailConfig?.showBanner !== false && (
        <div className="relative h-[40vh] overflow-hidden">
           <ImageWithFallback 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover"
              skeletonAspectRatio="16/9"
           />
           <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">{category.name}</h1>
              {category.description && categoryDetailConfig?.showDescription !== false && (
                <p className="text-lg md:text-xl max-w-2xl opacity-90 font-light">{category.description}</p>
              )}
           </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <Link 
          href={`/${storeConfig.slug}/categories`}
             className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
             Back to All Categories
        </Link>

           {categoryDetailConfig?.showFilters !== false && (
             <div className="flex items-center gap-4">
                <Button variant="outline" className="bg-white">
                   <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
             </div>
           )}
        </div>

        {!hasItems || categoryDetailConfig?.showProducts === false ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-3xl">
            <p className="text-gray-500 text-lg">
              {categoryDetailConfig?.showProducts === false ? 'Products are currently hidden for this category.' : 'No products found in this category.'}
            </p>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard
                   key={product.id}
                   product={product}
                   storeSlug={storeConfig.slug}
                   onAddToCart={handleAddToCart}
                   onQuickView={handleQuickView}
                />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

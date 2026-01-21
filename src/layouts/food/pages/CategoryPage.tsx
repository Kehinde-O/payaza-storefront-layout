'use client';

import { StoreConfig, StoreProduct, StoreService } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useStore } from '@/lib/store-context';
import { ArrowLeft, Filter, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { useAnalytics } from '@/hooks/use-analytics';
import { useEffect } from 'react';
import { ProductCard } from '@/components/ui/product-card';
import { getLayoutText, getTextContent } from '@/lib/utils/asset-helpers';
import { formatCurrency, filterActiveProducts, filterActiveServices } from '@/lib/utils';
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
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header Banner */}
      <div className="relative h-[40vh] overflow-hidden">
         <ImageWithFallback 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover"
            skeletonAspectRatio="16/9"
         />
         <div className={`absolute inset-0 ${isDarkTheme ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-[2px]`} />
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg md:text-xl max-w-2xl opacity-90 font-light">{category.description}</p>
            )}
         </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <Link 
          href={`/${storeConfig.slug}/categories`}
             className={`inline-flex items-center text-sm font-medium ${isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
             Back to All Categories
        </Link>

           <div className="flex items-center gap-4">
              <Button variant="outline" className={`${isDarkTheme ? 'border-white/20 text-white hover:bg-white/10' : 'bg-white'}`}>
                 <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
           </div>
        </div>

        {!hasItems ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-3xl">
            <p className="text-gray-500 text-lg">
              No items found in this category.
            </p>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {menuItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full border ${isDarkTheme ? 'border-white/10' : 'border-gray-100'}`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      skeletonAspectRatio="square"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        className="rounded-full bg-white text-black hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg font-bold px-8"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Order
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-black text-lg text-gray-900 whitespace-nowrap ml-2">
                        {formatCurrency(item.price, storeConfig.settings?.currency || 'USD')}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

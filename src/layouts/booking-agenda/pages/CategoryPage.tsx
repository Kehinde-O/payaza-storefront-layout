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

export function CategoryPage({ storeConfig, categorySlug }: CategoryPageProps) {
  const categories = storeConfig.categories || [];
  const category = categories.find(c => c.slug === categorySlug);
  const services = filterActiveServices(storeConfig.services?.filter(s => s.categoryId === category?.id) || []);
  const { addToCart } = useStore();
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

  const hasItems = services.length > 0;

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
            {category.description && (
              <p className="text-lg md:text-xl max-w-2xl opacity-90 font-light">{category.description}</p>
            )}
         </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <Link 
          href={`/${storeConfig.slug}/categories`}
             className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
             Back to All Categories
        </Link>

           <div className="flex items-center gap-4">
              <Button variant="outline" className="bg-white">
                 <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
           </div>
        </div>

        {!hasItems ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-3xl">
            <p className="text-gray-500 text-lg">
              No services found in this category.
            </p>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <Link 
                    href={`/${storeConfig.slug}/book?service=${service.slug}`}
                    className="block relative aspect-[4/3] overflow-hidden"
                  >
                    <Image 
                      src={service.image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60'} 
                      alt={service.name} 
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-sm text-gray-900">
                      {formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD')}
                    </div>
                  </Link>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-500 mb-6 line-clamp-2 leading-relaxed text-sm flex-1">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-blue-500" /> 
                          {service.duration} mins
                        </div>
                      </div>
                      <Link 
                        href={`/${storeConfig.slug}/book?service=${service.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group/btn"
                      >
                        Book Now <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
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

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
  const products = filterActiveProducts(storeConfig.products?.filter(p => p.categoryId === category?.id) || []);
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

  // Determine if this is a service-based store
  const isServiceStore = storeConfig.type === 'booking' || 
                        storeConfig.layout === 'booking' || 
                        storeConfig.layout === 'booking-agenda' ||
                        (storeConfig.services && storeConfig.services.length > 0);
  
  // Show services if it's a service store, or if there are services for this category
  const shouldShowServices = isServiceStore || services.length > 0;
  const shouldShowProducts = !isServiceStore || products.length > 0;
  
  const hasItems = (shouldShowServices && services.length > 0) || (shouldShowProducts && products.length > 0);

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
              {(() => {
                const itemType = isServiceStore ? 'services' : 'products';
                const defaultMessage = isServiceStore 
                  ? 'No services found in this category.'
                  : 'No products found in this category.';
                
                // Try to get from layout config, fallback to default
                return getLayoutText(
                  storeConfig,
                  `sections.categories.emptyState.${itemType}`,
                  getTextContent(
                    storeConfig,
                    `category_empty_${itemType}`,
                    defaultMessage
                  )
                );
              })()}
            </p>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Services Section */}
            {shouldShowServices && services.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {isServiceStore ? 'Services' : 'Services in this Category'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service) => (
                    <div key={service.id} className="group flex flex-col h-full">
                      {/* Service Card Image */}
                      <Link 
                        href={`/${storeConfig.slug}/book?service=${service.slug}`}
                        className="block relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500"
                      >
                        <Image 
                          src={service.image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60'} 
                          alt={service.name} 
                          fill
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Price Badge */}
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-sm text-gray-900">
                          {formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD')}
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button className="rounded-full bg-white text-black hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg font-bold px-8">
                            Book Now
                          </Button>
                        </div>
                      </Link>
                      
                      {/* Service Content */}
                      <div className="flex flex-col flex-1">
                        <Link href={`/${storeConfig.slug}/book?service=${service.slug}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                            {service.name}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-500 mb-4 line-clamp-2 leading-relaxed text-sm flex-1">
                          {service.description}
                        </p>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm font-medium text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" /> 
                              {service.duration} mins
                            </div>
                            {service.provider && service.provider.rating && (
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-gray-200 text-gray-200" />
                                {service.provider.rating}
                              </div>
                            )}
                          </div>
                          
                          <Link 
                            href={`/${storeConfig.slug}/book?service=${service.slug}`}
                            className="flex items-center gap-2 text-black font-bold group/link"
                          >
                            Book <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            {shouldShowProducts && products.length > 0 && (
              <div>
                {shouldShowServices && services.length > 0 && (
                  <h2 className="text-2xl font-bold mb-6">Products in this Category</h2>
                )}
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

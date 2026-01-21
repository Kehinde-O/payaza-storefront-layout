'use client';

import { StoreConfig } from '../../../lib/store-types';
import Link from 'next/link';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { useStore } from '../../../lib/store-context';

interface CategoriesPageProps {
  storeConfig: StoreConfig;
}

/**
 * Calculate optimal grid span classes based on category count and index
 * Ensures visual balance and hierarchy for any number of categories
 */
function getCategoryGridLayout(index: number, totalCount: number): string {
  // Always make first category prominent (hero treatment)
  if (index === 0) {
    if (totalCount === 1) {
      return 'md:col-span-3 md:row-span-2'; // Full width for single category
    }
    if (totalCount === 2) {
      return 'md:col-span-2 md:row-span-2'; // Large hero, second category fills remaining space
    }
    return 'md:col-span-2 md:row-span-2'; // Standard hero treatment
  }

  // Handle different category count ranges
  if (totalCount === 1) {
    return ''; // Won't be reached, but safe fallback
  }

  if (totalCount === 2) {
    // Second category fills remaining space
    return 'md:col-span-1 md:row-span-2';
  }

  if (totalCount === 3) {
    // After hero, two equal categories
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    if (index === 2) return 'md:col-span-1 md:row-span-2';
    return '';
  }

  if (totalCount === 4) {
    // Hero + 3 categories: one tall, two standard
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    if (index === 2) return 'md:col-span-1';
    if (index === 3) return 'md:col-span-1';
    return '';
  }

  if (totalCount === 5) {
    // Hero + 4 categories: balanced distribution
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    if (index === 2) return 'md:col-span-1';
    if (index === 3) return 'md:col-span-1';
    if (index === 4) return 'md:col-span-1';
    return '';
  }

  if (totalCount === 6) {
    // Hero + 5 categories: create visual rhythm
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    if (index === 2) return 'md:col-span-1';
    if (index === 3) return 'md:col-span-1';
    if (index === 4) return 'md:col-span-2'; // Wide category
    if (index === 5) return 'md:col-span-1';
    return '';
  }

  if (totalCount >= 7 && totalCount <= 9) {
    // Hero + masonry-style grid
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    if (index === 2) return 'md:col-span-1';
    if (index === 3) return 'md:col-span-1';
    if (index === 4) return 'md:col-span-2'; // Wide category
    if (index === 5) return 'md:col-span-1';
    if (index === 6) return 'md:col-span-1 md:row-span-2';
    if (index === 7) return 'md:col-span-1';
    if (index === 8) return 'md:col-span-1';
    return '';
  }

  // 10+ categories: uniform grid with occasional emphasis
  // Create a repeating pattern for visual interest
  const patternIndex = (index - 1) % 8; // Pattern repeats every 8 items (after hero)
  
  if (patternIndex === 0) return 'md:col-span-1 md:row-span-2'; // Tall
  if (patternIndex === 3) return 'md:col-span-2'; // Wide
  if (patternIndex === 6) return 'md:col-span-1 md:row-span-2'; // Tall
  return ''; // Standard 1x1
}

/**
 * Get optimal grid container class based on category count
 */
function getGridContainerClass(totalCount: number): string {
  if (totalCount === 1) {
    return 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]';
  }
  if (totalCount <= 3) {
    return 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]';
  }
  // For 4+ categories, use standard 3-column grid
  return 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]';
}

export function CategoriesPage({ storeConfig: initialConfig }: CategoriesPageProps) {
  const { store } = useStore();
  const storeConfig = store || initialConfig;
  
  const categories = storeConfig.categories || [];
  const categoriesConfig = storeConfig.layoutConfig?.pages?.categories;
  
  // Breadcrumbs
  const breadcrumbItems = [
    { label: storeConfig.name, href: `/${storeConfig.slug}` },
    { label: 'Categories', href: `/${storeConfig.slug}/categories` },
  ];

  return (
    <div data-content-ready className="min-h-screen bg-white text-slate-900 font-sans">
       {/* Header */}
       {categoriesConfig?.categoriesHeader?.show !== false && (
         <div className="bg-gray-50 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
               <div className="max-w-3xl animate-fade-in-up">
                  <div className="mb-6">
                    <Breadcrumbs items={breadcrumbItems} />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                    {categoriesConfig?.categoriesHeader?.title || "Shop by Category"}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                    {categoriesConfig?.categoriesHeader?.description || "Explore our comprehensive collection of premium products across various departments. Dive into our curated selections designed to match your style and needs."}
                  </p>
               </div>
            </div>
         </div>
       )}

       {/* Categories Grid */}
       {categoriesConfig?.categoryGrid?.show !== false && (
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {categories.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories available</h3>
                <p className="text-gray-500">Categories will appear here once they are added to the store.</p>
              </div>
            ) : (
              <div className={getGridContainerClass(categories.length)}>
               {categories.map((category, index) => {
                  // Get adaptive grid layout based on position and total count
                  const spanClass = getCategoryGridLayout(index, categories.length);
                  
                  // Validate category image - handle all formats independently
                  const extractCategoryImage = (image: unknown): string | undefined => {
                    if (!image) return undefined;
                    
                    // If already a string, validate
                    if (typeof image === 'string') {
                      const trimmed = image.trim();
                      return trimmed.length > 0 ? trimmed : undefined;
                    }
                    
                    // If object, extract url
                    if (typeof image === 'object' && image !== null) {
                      if ('url' in image && image.url) {
                        const url = typeof image.url === 'string' ? image.url.trim() : String(image.url).trim();
                        return url.length > 0 ? url : undefined;
                      }
                      // Check for other common property names
                      for (const key of ['src', 'image', 'imageUrl', 'image_url', 'value']) {
                        if (key in image && (image as any)[key]) {
                          const url = typeof (image as any)[key] === 'string' ? (image as any)[key].trim() : String((image as any)[key]).trim();
                          if (url.length > 0) {
                            return url;
                          }
                        }
                      }
                    }
                    
                    // If array, take first valid item
                    if (Array.isArray(image) && image.length > 0) {
                      return extractCategoryImage(image[0]);
                    }
                    
                    return undefined;
                  };
                  
                  const categoryImage = categoriesConfig?.categoryGrid?.showImages !== false ? extractCategoryImage(category.image) : undefined;
                  
                  return (
              <Link
                key={category.id}
                data-category-card
                       href={`/${storeConfig.slug}/products?category=${category.slug}`}
                       className={`group relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 min-h-[300px] ${spanClass}`}
                     >
                       {/* Background Image */}
                       <div className="absolute inset-0">
                          <ImageWithFallback
                             src={categoryImage}
                        alt={category.name} 
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                             skeletonAspectRatio="auto"
                      />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-70" />
                  </div>
  
                       {/* Content */}
                       <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                          <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                             <h2 className="font-bold text-white mb-2 text-2xl md:text-3xl">{category.name}</h2>
                    {category.description && categoriesConfig?.categoryGrid?.showDescriptions !== false && (
                                <p className="text-gray-200 mb-6 line-clamp-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 text-sm md:text-base">
                                   {category.description}
                                </p>
                    )}
                             <div className="flex items-center gap-2 text-white font-medium text-sm tracking-wide uppercase">
                                <span className="border-b border-transparent group-hover:border-white transition-colors">Explore Collection</span>
                                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                             </div>
                          </div>
                       </div>
              </Link>
                  );
               })}
              </div>
            )}
         </div>
       )}
    </div>
  );
}


'use client';

import { StoreConfig } from '@/lib/store-types';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface ElectronicsGridCategoriesPageProps {
  storeConfig: StoreConfig;
}

export function ElectronicsGridCategoriesPage({ storeConfig }: ElectronicsGridCategoriesPageProps) {
  const categories = storeConfig.categories || [];
  
  const breadcrumbItems = [
    { label: storeConfig.name, href: `/${storeConfig.slug}` },
    { label: 'Categories', href: `/${storeConfig.slug}/categories` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
           <div className="mb-8">
              <Breadcrumbs items={breadcrumbItems} />
           </div>
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="max-w-4xl"
           >
             <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
               Tech <span className="text-blue-600">Categories</span>
             </h1>
             <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
               Discover cutting-edge technology across our specialized departments. 
               Engineered for performance, designed for you.
             </p>
           </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
                <Link 
                href={`/${storeConfig.slug}/categories/${category.slug}`}
                className="group relative block h-[320px] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-slate-100 hover:border-blue-200/60"
              >
                {/* Image Background with Gradient */}
                <div className="absolute inset-0 z-0">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:blur-[2px]"
                    skeletonAspectRatio="auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                  {/* Icon/Badge Area */}
                  <div className="mb-auto transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                      <Layers className="w-5 h-5" />
                    </span>
                  </div>

                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                      {category.name}
                    </h2>
                    
                    {category.description && (
                      <p className="text-slate-200 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                        Browse <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Tech Lines */}
                <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                   <div className="flex gap-1">
                      <div className="w-1 h-8 bg-blue-500/50 rounded-full transform rotate-12" />
                      <div className="w-1 h-12 bg-blue-400/50 rounded-full transform rotate-12" />
                      <div className="w-1 h-6 bg-blue-300/50 rounded-full transform rotate-12" />
                   </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


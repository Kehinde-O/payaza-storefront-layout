'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Clock, Star, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn, formatCurrency, filterActiveServices } from '@/lib/utils';
import Image from 'next/image';

interface ServicesPageProps {
  storeConfig: StoreConfig;
  initialCategory?: string;
  titleOverride?: string;
}

export function ServicesPage({ storeConfig, initialCategory, titleOverride }: ServicesPageProps) {
  const categories = storeConfig.categories || [];
  const services = filterActiveServices(storeConfig.services || []);
  const [activeCategory, setActiveCategory] = useState(initialCategory || categories[0]?.slug || '');
  const primaryColor = storeConfig.branding.primaryColor;
  const servicesConfig = storeConfig.layoutConfig?.pages?.services;

  // Booking-agenda (medical) specific labels
  const categoryLabel = 'Departments';
  const serviceLabel = 'Procedures';

  const filteredServices = activeCategory
    ? services.filter(s => {
      const cat = categories.find(c => c.id === s.categoryId);
      return cat?.slug === activeCategory;
    })
    : services;

  const getServiceLink = (slug: string) => {
    return `/${storeConfig.slug}/book?service=${slug}`;
  };

  const pageTitle = titleOverride || servicesConfig?.title || (
    <>
      Signature <span className="font-bold font-sans" style={{ color: primaryColor }}>{serviceLabel}</span>
    </>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Premium Hero Header */}
      <div data-section="hero" className="relative bg-gray-900 py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop"
            alt="Service Menu"
            fill
            className="w-full h-full object-cover opacity-60"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white mb-6 shadow-sm">
            {storeConfig.name}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 tracking-tight text-white leading-tight">
            {pageTitle}
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            {servicesConfig?.description || storeConfig.description || `Explore our curated selection of premium ${serviceLabel.toLowerCase()} designed for your success.`}
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide no-scrollbar">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-4 border-r border-gray-100 hidden md:flex shrink-0">
              <Filter className="w-3.5 h-3.5" />
              {categoryLabel}
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border flex-shrink-0",
                  activeCategory === cat.slug
                    ? "text-white shadow-lg scale-105 border-transparent"
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-black"
                )}
                style={activeCategory === cat.slug ? { backgroundColor: primaryColor } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div data-section="services-list" className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {filteredServices.map((service) => (
            <div key={service.id} className="group flex flex-col h-full">
              {/* Card Image Area */}
              <Link
                href={getServiceLink(service.slug)}
                className="block relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500"
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
                  {service.price > 0 ? formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD') : 'Free'}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button className="rounded-full bg-white text-black hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg font-bold px-8">
                    Book Now
                  </Button>
                </div>
              </Link>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <Link href={getServiceLink(service.slug)}>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                      {service.name}
                    </h3>
                  </Link>
                </div>

                <p className="text-gray-500 mb-6 line-clamp-2 leading-relaxed text-base flex-1">
                  {service.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-6">
                    {service.duration > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {service.duration} mins
                      </div>
                    )}
                    {(service as any).contentType && (
                      <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black">
                        {(service as any).contentType}
                      </div>
                    )}
                  </div>

                  <Link
                    href={getServiceLink(service.slug)}
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
    </div>
  );
}


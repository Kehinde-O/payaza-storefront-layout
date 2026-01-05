'use client';

import { StoreConfig } from '@/lib/store-types';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PortfolioPageProps {
  storeConfig: StoreConfig;
}

export function PortfolioPage({ storeConfig }: PortfolioPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const portfolioConfig = storeConfig.layoutConfig?.pages?.portfolio;
  
  // Use config projects or fallback to mock data
  const portfolioItems = portfolioConfig?.projects?.map((item, index) => ({
    id: `p${index}`,
    title: item.title,
    category: item.category || 'General',
    image: item.image,
    date: item.date || '2024',
    description: item.description,
    featured: index === 0 || index === 5, // Simple logic for featured
  })) || [
    {
      id: 'p1',
      title: 'Bridal Makeup Collection',
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
      date: '2024',
      description: 'A stunning collection of bridal looks showcasing elegance and sophistication.',
      featured: true,
    },
    // ... other fallback items
    {
      id: 'p2',
      title: 'Editorial Beauty',
      category: 'Editorial',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
      date: '2024',
      description: 'High-fashion editorial work for magazines and campaigns.',
      featured: false,
    },
    {
      id: 'p3',
      title: 'Evening Glamour',
      category: 'Special Occasion',
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
      date: '2024',
      description: 'Red carpet ready looks for special events and galas.',
      featured: false,
    },
    {
      id: 'p4',
      title: 'Natural Beauty',
      category: 'Natural',
      image: 'https://images.unsplash.com/photo-1503236823255-94308829887f?w=800&q=80',
      date: '2024',
      description: 'Soft, natural looks that enhance your best features.',
      featured: false,
    },
    {
      id: 'p5',
      title: 'Creative Transformations',
      category: 'Creative',
      image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
      date: '2024',
      description: 'Bold and creative makeup artistry for photoshoots.',
      featured: false,
    },
    {
      id: 'p6',
      title: 'Traditional Elegance',
      category: 'Traditional',
      image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&q=80',
      date: '2024',
      description: 'Celebrating cultural beauty with traditional makeup styles.',
      featured: true,
    },
  ];

  const categories = Array.from(new Set(portfolioItems.map(item => item.category)));

  // Filter portfolio items based on active category
  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % filteredItems.length));
  }, [selectedIndex, filteredItems.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length));
  }, [selectedIndex, filteredItems.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white pt-32 pb-20 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-gray-900">
          {portfolioConfig?.title || "Our Portfolio"}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          {portfolioConfig?.description || `Explore our work and see the artistry behind ${storeConfig.name}.`}
        </p>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
            <button 
              onClick={() => setActiveCategory('All')}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all",
                activeCategory === 'All'
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all",
                  activeCategory === category
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
                style={activeCategory === category ? { backgroundColor: primaryColor } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/80 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-full z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-all hover:bg-white/10 rounded-full z-50 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-all hover:bg-white/10 rounded-full z-50 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Main Content */}
          <div 
            className="relative w-full h-full max-w-7xl mx-auto p-4 md:p-12 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={filteredItems[selectedIndex].image}
                alt={filteredItems[selectedIndex].title}
                fill
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                unoptimized
              />
            </div>
            
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 pb-10 flex flex-col items-center justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32 pointer-events-none">
              <div className="text-center max-w-3xl mx-auto pointer-events-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                  {filteredItems[selectedIndex].title}
                </h3>
                <p className="text-white/90 text-base md:text-lg drop-shadow-md leading-relaxed max-w-2xl mx-auto">
                  {filteredItems[selectedIndex].description}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/10 shadow-sm">
                    {filteredItems[selectedIndex].category}
                  </span>
                  <span className="text-white/70 text-sm font-medium drop-shadow-md">
                    {selectedIndex + 1} / {filteredItems.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gray-50 py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Ready to Create Your Look?
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Book a consultation and let us bring your vision to life.
          </p>
          <Link href={`/${storeConfig.slug}/book`}>
            <button
              className="h-14 px-10 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              style={{ backgroundColor: primaryColor, color: 'white' }}
            >
              Book Appointment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}


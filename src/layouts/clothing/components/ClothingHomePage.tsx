'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { ProductRating } from '@/components/ui/product-rating';
import { ShoppingCart, Heart, ArrowRight, Truck, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useState, useEffect } from 'react';
import { formatCurrency, filterActiveProducts } from '@/lib/utils';
import { getLayoutText, getBannerImage } from '../../../lib/utils/asset-helpers';
import { shouldUseAPI } from '../../../lib/utils/demo-detection';
import { PromoBanner } from '../../shared/components/PromoBanner';

interface ClothingHomePageProps {
  storeConfig: StoreConfig;
}

interface HeroSlide {
  image: string;
  badge?: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function ClothingHomePage({ storeConfig }: ClothingHomePageProps) {
  const layoutConfig = storeConfig.layoutConfig;
  const categories = storeConfig.categories || [];

  // Randomly select max 2 categories on every page load
  const [displayedCategories, setDisplayedCategories] = useState<typeof categories>([]);

  useEffect(() => {
    // Shuffle and select max 2 categories
    if (categories.length > 0) {
      const shuffled = [...categories].sort(() => Math.random() - 0.5);
      setDisplayedCategories(shuffled.slice(0, 2));
    } else {
      setDisplayedCategories([]);
    }
  }, []); // Empty deps = run on mount only

  // Debug logging for configuration
  console.log('[ClothingHomePage] Full storeConfig:', {
    storeId: storeConfig.id,
    storeSlug: storeConfig.slug,
    hasLayoutConfig: !!layoutConfig,
    layoutConfigType: typeof layoutConfig,
  });
  console.log('[ClothingHomePage] LayoutConfig structure:', {
    hasSections: !!layoutConfig?.sections,
    hasHero: !!layoutConfig?.sections?.hero,
    hasHeroSliders: !!layoutConfig?.sections?.hero?.sliders,
    sliderCount: layoutConfig?.sections?.hero?.sliders?.length || 0,
    topLevelHero: !!layoutConfig?.hero,
    topLevelHeroSliders: !!layoutConfig?.hero?.sliders,
    topLevelSliderCount: layoutConfig?.hero?.sliders?.length || 0,
  });
  console.log('[ClothingHomePage] Full LayoutConfig:', JSON.stringify(layoutConfig, null, 2));
  console.log('[ClothingHomePage] Editorial config:', layoutConfig?.sections?.marketing?.editorial);

  // Deduplicate products to avoid key warnings and filter out inactive/deleted products
  const uniqueProducts = (storeConfig.products || []).filter((product, index, self) =>
    index === self.findIndex((t) => t.id === product.id)
  );
  const products = filterActiveProducts(uniqueProducts);

  // Hero slides data - use new slider structure with fallback to old format
  // For demo stores, helpers will return fallbacks; for real stores, try layoutConfig first, then helpers
  const isRealStore = shouldUseAPI(storeConfig.slug);

  // Debug logging for slider configuration
  console.log('[ClothingHomePage] LayoutConfig sections.hero:', layoutConfig?.sections?.hero);
  console.log('[ClothingHomePage] LayoutConfig hero (top-level):', layoutConfig?.hero);
  console.log('[ClothingHomePage] Sliders found:', layoutConfig?.sections?.hero?.sliders?.length || 0);

  // Try new structure first (sections.hero.sliders)
  let heroSlides: HeroSlide[] = [];
  if (layoutConfig?.sections?.hero?.sliders && Array.isArray(layoutConfig.sections.hero.sliders) && layoutConfig.sections.hero.sliders.length > 0) {
    console.log('[ClothingHomePage] Using sections.hero.sliders structure');
    heroSlides = layoutConfig.sections.hero.sliders
      .filter((slider) => slider && slider.image) // Filter out invalid sliders
      .map((slider) => {
        // Extract button text - only use if not empty
        const primaryButtonText = slider.primaryButton?.text?.trim() || '';
        const secondaryButtonText = slider.secondaryButton?.text?.trim() || '';

        console.log('[ClothingHomePage] Slider:', {
          id: slider.id,
          image: slider.image ? 'present' : 'missing',
          title: slider.title,
          primaryButtonText,
          secondaryButtonText,
        });

        // Check badge visibility - use sections.hero.showBadges first, fallback to top-level hero.showBadges
        const showBadges = layoutConfig?.sections?.hero?.showBadges !== false &&
          (layoutConfig?.hero?.showBadges !== false || layoutConfig?.sections?.hero?.showBadges === undefined);

        return {
          image: slider.image || '',
          badge: (showBadges && slider.badge && slider.badge.trim() !== '') ? slider.badge : undefined,
          title: slider.title || storeConfig.name,
          description: slider.description || storeConfig.description || '',
          // Only set button text if it's not empty - this allows button visibility logic to work
          primaryButtonText: primaryButtonText || getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
          primaryButtonLink: slider.primaryButton?.link || `/${storeConfig.slug}/products`,
          secondaryButtonText: secondaryButtonText || undefined, // Don't provide fallback for secondary
          secondaryButtonLink: slider.secondaryButton?.link || `/${storeConfig.slug}/categories`,
        };
      });
  } else if (layoutConfig?.hero?.sliders && Array.isArray(layoutConfig.hero.sliders) && layoutConfig.hero.sliders.length > 0) {
    // Fallback to top-level hero.sliders
    console.log('[ClothingHomePage] Using top-level hero.sliders structure');
    heroSlides = layoutConfig.hero.sliders
      .filter((slider) => slider && slider.image) // Filter out invalid sliders
      .map((slider) => {
        const primaryButtonText = slider.primaryButton?.text?.trim() || '';
        const secondaryButtonText = slider.secondaryButton?.text?.trim() || '';

        // Check badge visibility - use sections.hero.showBadges first, fallback to top-level hero.showBadges
        const showBadges = layoutConfig?.sections?.hero?.showBadges !== false &&
          (layoutConfig?.hero?.showBadges !== false || layoutConfig?.sections?.hero?.showBadges === undefined);

        return {
          image: slider.image || '',
          badge: (showBadges && slider.badge && slider.badge.trim() !== '') ? slider.badge : undefined,
          title: slider.title || storeConfig.name,
          description: slider.description || storeConfig.description || '',
          primaryButtonText: primaryButtonText || getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
          primaryButtonLink: slider.primaryButton?.link || `/${storeConfig.slug}/products`,
          secondaryButtonText: secondaryButtonText || undefined,
          secondaryButtonLink: slider.secondaryButton?.link || `/${storeConfig.slug}/categories`,
        };
      });
  } else {
    // Fallback to old format (backward compatibility)
    heroSlides = [
      {
        image: getBannerImage(storeConfig, 'hero_slide_1', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop'),
        badge: layoutConfig?.hero?.showBadges
          ? (isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.badge ? layoutConfig.text.hero.slides[0].badge : getLayoutText(storeConfig, 'hero.badge', 'New Season'))
          : undefined,
        title: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.title ? layoutConfig.text.hero.slides[0].title : (getLayoutText(storeConfig, 'hero.slide1.title', storeConfig.name) || storeConfig.name),
        description: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.description ? layoutConfig.text.hero.slides[0].description : (getLayoutText(storeConfig, 'hero.slide1.description', storeConfig.description) || storeConfig.description),
        primaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.primaryButton ? layoutConfig.text.hero.slides[0].primaryButton : getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
        primaryButtonLink: `/${storeConfig.slug}/products`,
        secondaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.secondaryButton ? layoutConfig.text.hero.slides[0].secondaryButton : getLayoutText(storeConfig, 'common.explore', 'Explore'),
        secondaryButtonLink: `/${storeConfig.slug}/categories`,
      },
      {
        image: getBannerImage(storeConfig, 'hero_slide_2', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop'),
        badge: layoutConfig?.hero?.showBadges
          ? (isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.badge ? layoutConfig.text.hero.slides[1].badge : getLayoutText(storeConfig, 'common.trending', 'Trending Now'))
          : undefined,
        title: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.title ? layoutConfig.text.hero.slides[1].title : getLayoutText(storeConfig, 'hero.slide2.title', 'Discover Your Style'),
        description: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.description ? layoutConfig.text.hero.slides[1].description : getLayoutText(storeConfig, 'hero.slide2.description', 'Explore our curated collection of timeless pieces and contemporary designs.'),
        primaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.primaryButton ? layoutConfig.text.hero.slides[1].primaryButton : getLayoutText(storeConfig, 'common.viewAll', 'View Collection'),
        primaryButtonLink: `/${storeConfig.slug}/products`,
        secondaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.secondaryButton ? layoutConfig.text.hero.slides[1].secondaryButton : undefined,
        secondaryButtonLink: `/${storeConfig.slug}/categories/men`,
      },
      {
        image: getBannerImage(storeConfig, 'hero_slide_3', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop'),
        badge: layoutConfig?.hero?.showBadges
          ? (isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.badge ? layoutConfig.text.hero.slides[2].badge : getLayoutText(storeConfig, 'common.limited', 'Limited Edition'))
          : undefined,
        title: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.title ? layoutConfig.text.hero.slides[2].title : getLayoutText(storeConfig, 'hero.slide3.title', 'Premium Quality'),
        description: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.description ? layoutConfig.text.hero.slides[2].description : getLayoutText(storeConfig, 'hero.slide3.description', 'Crafted with attention to detail and premium materials for lasting elegance.'),
        primaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.primaryButton ? layoutConfig.text.hero.slides[2].primaryButton : getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
        primaryButtonLink: `/${storeConfig.slug}/products`,
        secondaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.secondaryButton ? layoutConfig.text.hero.slides[2].secondaryButton : undefined,
        secondaryButtonLink: `/${storeConfig.slug}/categories/men`,
      },
    ];
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(layoutConfig?.hero?.autoPlay !== false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || layoutConfig?.hero?.autoPlay === false || heroSlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length, layoutConfig?.hero?.autoPlay]);

  const goToSlide = (index: number) => {
    if (heroSlides.length === 0) return;
    setCurrentSlide(Math.min(index, heroSlides.length - 1));
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    if (layoutConfig?.hero?.autoPlay !== false) {
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }
  };

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    if (layoutConfig?.hero?.autoPlay !== false) {
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    if (layoutConfig?.hero?.autoPlay !== false) {
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }
  };

  // Determine grid layout - always use 2-column layout since we limit to 2 categories
  const getCategoryGridClass = () => {
    return 'grid-cols-1 md:grid-cols-2';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Carousel with Multiple Slides */}
      {layoutConfig?.hero?.show !== false && heroSlides.length > 0 && (
        <section
          className="relative h-[85vh] w-full overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => layoutConfig?.hero?.autoPlay !== false && setIsAutoPlaying(true)}
        >
          {/* Slides Container */}
          <div className="relative h-full w-full">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center z-20">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                      className={`max-w-3xl text-white space-y-8 transition-all duration-1000 ${index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                        }`}
                    >
                      <div>
                        {slide.badge && (
                          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/30 uppercase tracking-wider mb-4">
                            {slide.badge}
                          </span>
                        )}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4">
                          {slide.title}
                        </h1>
                        <div className="h-1 w-24 bg-white/80 rounded-full" />
                      </div>

                      <p className="text-xl sm:text-2xl text-gray-100 font-light leading-relaxed max-w-lg">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap gap-4 pt-4">
                        {/* Primary button - only show if showCTA is enabled AND button text is not empty */}
                        {layoutConfig?.sections?.hero?.showCTA !== false &&
                          layoutConfig?.hero?.showCTA !== false &&
                          slide.primaryButtonText &&
                          slide.primaryButtonText.trim() !== '' && (
                            <Link href={slide.primaryButtonLink}>
                              <Button
                                size="lg"
                                className="h-14 px-10 text-base rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105 font-semibold"
                              >
                                {slide.primaryButtonText}
                              </Button>
                            </Link>
                          )}
                        {/* Secondary button - only show if showSecondaryCTA is enabled AND button text is not empty */}
                        {(layoutConfig?.sections?.hero?.showSecondaryCTA !== false || layoutConfig?.hero?.showSecondaryCTA !== false) &&
                          slide.secondaryButtonText &&
                          slide.secondaryButtonText.trim() !== '' &&
                          slide.secondaryButtonLink && (
                            <Link href={slide.secondaryButtonLink}>
                              <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-10 text-base rounded-full border-white bg-transparent text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-300"
                                style={{ color: 'white' }}
                              >
                                {slide.secondaryButtonText}
                              </Button>
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-110 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white group-hover:text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-110 group"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white group-hover:text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentSlide
                  ? 'w-12 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Benefits Strip */}
      {layoutConfig?.features?.show !== false && (
        <section className="py-8 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <Truck className="h-6 w-6 text-gray-900" />
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-500">On all orders over ${storeConfig.settings.freeShippingThreshold}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <RefreshCw className="h-6 w-6 text-gray-900" />
                <h3 className="font-semibold text-gray-900">Free Returns</h3>
                <p className="text-sm text-gray-500">30-day money back guarantee</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <ShieldCheck className="h-6 w-6 text-gray-900" />
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-500">100% secure checkout process</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid - Adaptive */}
      {layoutConfig?.sections?.categories?.show !== false && (
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  {getLayoutText(storeConfig, 'sections.categories.title', 'Shop by Category')}
                </h2>
                <p className="text-gray-500 text-lg">
                  {getLayoutText(storeConfig, 'sections.categories.subtitle', 'Curated collections for every style')}
                </p>
              </div>
              {layoutConfig?.sections?.categories?.showViewAll !== false && (
                <Link href={`/${storeConfig.slug}/categories`} className="group flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors pb-1 border-b border-transparent hover:border-gray-300">
                  {getLayoutText(storeConfig, 'sections.categories.viewAll', 'View All Categories')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>

            <div className={`grid ${getCategoryGridClass()} gap-6`}>
              {displayedCategories.map((category) => {
                // Validate category image - handle all formats
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
                  }

                  // If array, take first valid item
                  if (Array.isArray(image) && image.length > 0) {
                    return extractCategoryImage(image[0]);
                  }

                  return undefined;
                };

                const categoryImage = extractCategoryImage(category.image);

                return (
                  <Link
                    key={category.id}
                    href={`/${storeConfig.slug}/categories/${category.slug}`}
                    className={`group relative overflow-hidden rounded-2xl aspect-[3/4]`}
                  >
                    <div className="absolute inset-0 bg-gray-200">
                      {/* Use category image if available */}
                      <ImageWithFallback
                        src={categoryImage}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        skeletonAspectRatio="auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-0 transition-transform duration-300">{category.name}</h3>
                      <div className="h-0.5 w-12 bg-white/0 group-hover:bg-white/100 transition-all duration-500 mb-4" />
                      <span className="inline-flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {getLayoutText(storeConfig, 'common.shopNow', 'Shop Now')} <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lookbook / Style Guide Section */}
      {layoutConfig?.sections?.marketing?.show !== false && (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-lg overflow-hidden relative">
                  <ImageWithFallback
                    src={layoutConfig?.sections?.marketing?.editorial?.image}
                    alt="Editorial Lookbook"
                    className="w-full h-full object-cover"
                    skeletonAspectRatio="4/5"
                  />
                </div>
                {/* Decorative elements */}
                {layoutConfig?.sections?.marketing?.editorial?.detailImage && (
                  <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white p-4 shadow-xl rounded-lg hidden md:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="w-full h-full relative">
                      <ImageWithFallback
                        src={layoutConfig.sections.marketing.editorial.detailImage}
                        alt="Detail Shot"
                        className="w-full h-full object-cover rounded"
                        skeletonAspectRatio="square"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-8">
                <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                  {layoutConfig?.sections?.marketing?.editorial?.label || "Editorial"}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900">
                  {layoutConfig?.sections?.marketing?.editorial?.title ? (
                    layoutConfig.sections.marketing.editorial.title.split('\n').map((line, idx, arr) => (
                      <span key={idx}>
                        {line}
                        {idx < arr.length - 1 && <br />}
                      </span>
                    ))
                  ) : (
                    <>
                      Redefining Modern <br />
                      <span className="italic font-serif">Elegance</span>
                    </>
                  )}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {layoutConfig?.sections?.marketing?.editorial?.description || "Explore our latest editorial featuring timeless pieces crafted for the contemporary wardrobe. From essential basics to statement outwear, find your signature look."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {/* Primary button - only show if text exists */}
                  {layoutConfig?.sections?.marketing?.editorial?.primaryButtonText && layoutConfig.sections.marketing.editorial.primaryButtonText.trim() !== '' && (
                    <Link href={layoutConfig.sections.marketing.editorial.primaryButtonLink || `/${storeConfig.slug}/style-guide`}>
                      <Button className="rounded-full px-8 py-6 bg-gray-900 hover:bg-black text-white transition-all">
                        {layoutConfig.sections.marketing.editorial.primaryButtonText}
                      </Button>
                    </Link>
                  )}
                  {/* Secondary button - only show if text exists */}
                  {layoutConfig?.sections?.marketing?.editorial?.secondaryButtonText && layoutConfig.sections.marketing.editorial.secondaryButtonText.trim() !== '' && (
                    <Link href={layoutConfig.sections.marketing.editorial.secondaryButtonLink || `/${storeConfig.slug}/about`}>
                      <Button variant="outline" className="rounded-full px-8 py-6 border-gray-300 hover:bg-white hover:border-gray-900 transition-all">
                        {layoutConfig.sections.marketing.editorial.secondaryButtonText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Products Carousel/Grid */}
      {layoutConfig?.sections?.featuredProducts?.show !== false && (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
              <span className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-3 block">
                Curated For You
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                {layoutConfig?.sections?.featuredProducts?.title || getLayoutText(storeConfig, 'sections.featuredProducts.title', 'Trending Now')}
              </h2>
              <div className="h-1 w-20 bg-gray-900 mx-auto mb-6" />
              <p className="text-gray-600 text-lg">
                {getLayoutText(storeConfig, 'sections.featuredProducts.subtitle', 'Discover the latest trends and essential pieces that define this season\'s style.')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {products.slice(0, 4).map((product) => {
                // Comprehensive image extraction - handles all formats
                const extractProductImages = (images: any): string[] => {
                  if (!images) return [];

                  // If already an array of strings, validate and return
                  if (Array.isArray(images)) {
                    const firstItem = images[0];
                    if (typeof firstItem === 'string') {
                      return images
                        .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
                        .map((img: string) => img.trim());
                    }

                    // If array of objects, extract URLs
                    if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
                      const result: string[] = [];
                      for (const item of images) {
                        if (!item) continue;

                        if (typeof item === 'object' && item !== null) {
                          // Check for url property
                          if ('url' in item && item.url) {
                            const url = typeof item.url === 'string' ? item.url.trim() : String(item.url).trim();
                            if (url.length > 0) {
                              result.push(url);
                            }
                          }
                          // Check for nested url
                          else if (item.url && typeof item.url === 'object' && 'url' in item.url) {
                            const url = typeof item.url.url === 'string' ? item.url.url.trim() : String(item.url.url).trim();
                            if (url.length > 0) {
                              result.push(url);
                            }
                          }
                        } else if (typeof item === 'string') {
                          const trimmed = item.trim();
                          if (trimmed.length > 0) {
                            result.push(trimmed);
                          }
                        }
                      }
                      return result;
                    }
                  }

                  // Handle single object
                  if (typeof images === 'object' && images !== null && !Array.isArray(images)) {
                    if ('url' in images && images.url) {
                      const url = typeof images.url === 'string' ? images.url.trim() : String(images.url).trim();
                      return url.length > 0 ? [url] : [];
                    }
                  }

                  // Handle single string
                  if (typeof images === 'string') {
                    const trimmed = images.trim();
                    return trimmed.length > 0 ? [trimmed] : [];
                  }

                  return [];
                };

                const validImages = extractProductImages(product.images);
                const firstImage = validImages.length > 0 ? validImages[0] : undefined;

                return (
                  <div key={product.id} className="group">
                    <Link href={`/${storeConfig.slug}/products/${product.slug}`}>
                      {/* Versatile aspect ratio container */}
                      <div className="relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden mb-4">
                        <ImageWithFallback
                          src={firstImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          skeletonAspectRatio="3/4"
                        />
                        {/* Second image on hover if available */}
                        {validImages[1] && (
                          <ImageWithFallback
                            src={validImages[1]}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            skeletonAspectRatio="3/4"
                          />
                        )}

                        {/* Minimal Overlay Actions - Desktop */}
                        <div className="hidden lg:flex absolute bottom-4 right-4 flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          {storeConfig.features.wishlist && (
                            <Button
                              variant="secondary"
                              size="icon"
                              className="bg-white hover:bg-black hover:text-white shadow-md rounded-full transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="icon"
                            className="bg-white hover:bg-black hover:text-white shadow-md rounded-full transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Mobile Quick Add */}
                        <Button
                          variant="secondary"
                          size="icon"
                          className="lg:hidden absolute bottom-3 right-3 bg-white text-black h-10 w-10 rounded-full shadow-lg z-10 active:scale-95 transition-transform"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>

                        {product.compareAtPrice && (
                          <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {getLayoutText(storeConfig, 'common.sale', 'Sale')}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors text-lg">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{formatCurrency(product.price, product.currency || 'USD')}</span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.compareAtPrice, product.currency || 'USD')}
                            </span>
                          )}
                        </div>
                        <ProductRating
                          rating={product.rating}
                          reviewCount={product.reviewCount}
                          size="sm"
                          showReviewCount={false}
                          className="shrink-0"
                        />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {layoutConfig?.sections?.featuredProducts?.showViewAll !== false && (
              <div className="mt-16 text-center">
                <Link href={`/${storeConfig.slug}/products`}>
                  <Button variant="outline" className="rounded-full px-10 py-6 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all text-base font-medium">
                    {getLayoutText(storeConfig, 'sections.featuredProducts.viewAll', 'View All Products')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <PromoBanner config={layoutConfig?.sections?.promoBanner} layoutStyle="clothing" />
    </div>
  );
}
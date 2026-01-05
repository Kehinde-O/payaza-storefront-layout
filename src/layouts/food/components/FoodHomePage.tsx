'use client';

import { StoreConfig, StoreMenuItem } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { Clock, Star, Utensils, ChevronRight, Flame, ChefHat, Award, ArrowRight, Smartphone, Truck, Calendar, Users, Mail, Phone, MessageSquare, CheckCircle, ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { getLayoutText, getBannerImage, getTextContent, getTeamMemberImage } from '../../../lib/utils/asset-helpers';
import { shouldUseAPI } from '../../../lib/utils/demo-detection';
import { TestimonialCard } from '../../shared/components/TestimonialCard';
import { PromoBanner } from '../../shared/components/PromoBanner';

interface FoodHomePageProps {
  storeConfig: StoreConfig;
}

export function FoodHomePage({ storeConfig }: FoodHomePageProps) {
  const categories = storeConfig.categories || [];
  const menuItems = storeConfig.menuItems || [];
  const { addToCart } = useStore();
  const { addToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleAddToCart = (item: StoreMenuItem) => {
    const product = {
      ...item,
      slug: item.id,
      images: item.image ? [item.image] : [],
      variants: [],
      specifications: {},
      rating: 0,
      reviewCount: 0,
      categoryId: '', // Provide default or derived value
      inStock: true // Assume in stock
    };
    addToCart(product);
    addToast(`${item.name} added to order`, 'success');
  };

  const handleSubscribe = () => {
    if (newsletterEmail) {
      addToast('Thank you for subscribing!', 'success');
      setNewsletterEmail('');
    }
  };

  // Hero Slides Configuration - use new slider structure with fallback to old format
  // For demo stores, helpers will return fallbacks; for real stores, try layoutConfig first, then helpers
  const layoutConfig = storeConfig.layoutConfig;
  const isRealStore = shouldUseAPI(storeConfig.slug);

  // Debug logging for slider configuration
  console.log('[FoodHomePage] LayoutConfig sections.hero:', layoutConfig?.sections?.hero);
  console.log('[FoodHomePage] LayoutConfig hero (top-level):', layoutConfig?.hero);
  console.log('[FoodHomePage] Sliders found:', layoutConfig?.sections?.hero?.sliders?.length || 0);

  // Try new structure first (sections.hero.sliders)
  let heroSlides: any[] = [];
  if (layoutConfig?.sections?.hero?.sliders && Array.isArray(layoutConfig.sections.hero.sliders) && layoutConfig.sections.hero.sliders.length > 0) {
    console.log('[FoodHomePage] Using sections.hero.sliders structure');
    heroSlides = layoutConfig.sections.hero.sliders
      .filter((slider) => slider && slider.image) // Filter out invalid sliders
      .map((slider) => {
        // Extract button text - only use if not empty
        const primaryButtonText = slider.primaryButton?.text?.trim() || '';
        const secondaryButtonText = slider.secondaryButton?.text?.trim() || '';

        console.log('[FoodHomePage] Slider:', {
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
          badge: (showBadges && slider.badge && slider.badge.trim() !== '') ? slider.badge : "#1 Food Delivery in Town",
          title: slider.title || "Taste the",
          highlight: slider.highlight || "Extraordinary", // Food layout specific
          description: slider.description || `${storeConfig.description} Experience culinary excellence delivered straight to your doorstep.`,
          // Only set button text if it's not empty - this allows button visibility logic to work
          primaryBtn: primaryButtonText || getLayoutText(storeConfig, 'common.orderNow', "Order Now"),
          primaryBtnLink: slider.primaryButton?.link || `/${storeConfig.slug}/menu`,
          secondaryBtn: secondaryButtonText || undefined, // Don't provide fallback for secondary
          secondaryBtnLink: slider.secondaryButton?.link || `/${storeConfig.slug}/menu`,
        };
      });
  } else if (layoutConfig?.hero?.sliders && Array.isArray(layoutConfig.hero.sliders) && layoutConfig.hero.sliders.length > 0) {
    // Fallback to top-level hero.sliders
    console.log('[FoodHomePage] Using top-level hero.sliders structure');
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
          badge: (showBadges && slider.badge && slider.badge.trim() !== '') ? slider.badge : "#1 Food Delivery in Town",
          title: slider.title || "Taste the",
          highlight: slider.highlight || "Extraordinary", // Food layout specific
          description: slider.description || `${storeConfig.description} Experience culinary excellence delivered straight to your doorstep.`,
          primaryBtn: primaryButtonText || getLayoutText(storeConfig, 'common.orderNow', "Order Now"),
          primaryBtnLink: slider.primaryButton?.link || `/${storeConfig.slug}/menu`,
          secondaryBtn: secondaryButtonText || undefined,
          secondaryBtnLink: slider.secondaryButton?.link || `/${storeConfig.slug}/menu`,
        };
      });
  } else {
    // Fallback to old format (backward compatibility)
    heroSlides = [
      {
        image: getBannerImage(storeConfig, 'hero_slide_1', "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"),
        badge: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.badge ? layoutConfig.text.hero.slides[0].badge : getTextContent(storeConfig, 'hero_slide_1:badge', "#1 Food Delivery in Town"),
        title: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.title ? layoutConfig.text.hero.slides[0].title : getTextContent(storeConfig, 'hero_slide_1:title', "Taste the"),
        highlight: getTextContent(storeConfig, 'hero_slide_1:highlight', "Extraordinary"),
        description: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.description ? layoutConfig.text.hero.slides[0].description : getTextContent(storeConfig, 'hero_slide_1:description', `${storeConfig.description} Experience culinary excellence delivered straight to your doorstep.`),
        primaryBtn: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.primaryButton ? layoutConfig.text.hero.slides[0].primaryButton : getLayoutText(storeConfig, 'common.orderNow', "Order Now"),
        secondaryBtn: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.secondaryButton ? layoutConfig.text.hero.slides[0].secondaryButton : getLayoutText(storeConfig, 'common.viewMenu', "View Menu")
      },
      {
        image: getBannerImage(storeConfig, 'hero_slide_2', "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"),
        badge: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.badge ? layoutConfig.text.hero.slides[1].badge : getTextContent(storeConfig, 'hero_slide_2:badge', "Fresh & Authentic"),
        title: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.title ? layoutConfig.text.hero.slides[1].title : getTextContent(storeConfig, 'hero_slide_2:title', "Ingredients of"),
        highlight: getTextContent(storeConfig, 'hero_slide_2:highlight', "Quality"),
        description: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.description ? layoutConfig.text.hero.slides[1].description : getTextContent(storeConfig, 'hero_slide_2:description', "We use only the finest, locally sourced ingredients to create dishes that tell a story."),
        primaryBtn: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.primaryButton ? layoutConfig.text.hero.slides[1].primaryButton : getLayoutText(storeConfig, 'common.exploreMenu', "Explore Menu"),
        secondaryBtn: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.secondaryButton ? layoutConfig.text.hero.slides[1].secondaryButton : getLayoutText(storeConfig, 'common.ourStory', "Our Story")
      },
      {
        image: getBannerImage(storeConfig, 'hero_slide_3', "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"),
        badge: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.badge ? layoutConfig.text.hero.slides[2].badge : getTextContent(storeConfig, 'hero_slide_3:badge', "Chef's Special"),
        title: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.title ? layoutConfig.text.hero.slides[2].title : getTextContent(storeConfig, 'hero_slide_3:title', "Crafted with"),
        highlight: getTextContent(storeConfig, 'hero_slide_3:highlight', "Passion"),
        description: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.description ? layoutConfig.text.hero.slides[2].description : getTextContent(storeConfig, 'hero_slide_3:description', "Every dish is a masterpiece, prepared with love and attention to detail by our expert chefs."),
        primaryBtn: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.primaryButton ? layoutConfig.text.hero.slides[2].primaryButton : getLayoutText(storeConfig, 'common.reserveTable', "Reserve Table"),
        secondaryBtn: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.secondaryButton ? layoutConfig.text.hero.slides[2].secondaryButton : getLayoutText(storeConfig, 'common.viewSpecials', "View Specials")
      }
    ];
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  // Reservation form state
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Generate available time slots from backend storeHours or use fallback
  const generateTimeSlots = (): string[] => {
    // For demo stores, always use fallback; for real stores, try backend config
    const isRealStore = shouldUseAPI(storeConfig.slug);
    if (!isRealStore) {
      return [
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
        '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
      ];
    }
    // Try to get time slots from storeHours config (may exist at runtime even if not in type)
    const storeHours = (storeConfig as any).storeHours;
    if (storeHours && typeof storeHours === 'object') {
      // Check if there's a timeSlots array or similar structure
      if (Array.isArray(storeHours.timeSlots)) {
        return storeHours.timeSlots;
      }
      // Try to extract from day-based structure (e.g., monday: { slots: [...] })
      const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of dayKeys) {
        if (storeHours[day]?.slots && Array.isArray(storeHours[day].slots)) {
          // Convert 24h format to 12h format if needed, or use as-is
          return storeHours[day].slots.map((slot: string) => {
            // If slot is in format "HH:MM-HH:MM", extract start time
            if (slot.includes('-')) {
              const startTime = slot.split('-')[0];
              // Convert 24h to 12h if needed
              const [hours, minutes] = startTime.split(':').map(Number);
              if (hours >= 12) {
                const hour12 = hours === 12 ? 12 : hours - 12;
                return `${hour12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
              } else {
                return `${hours}:${minutes.toString().padStart(2, '0')} ${hours === 0 ? 'AM' : 'AM'}`;
              }
            }
            return slot;
          });
        }
      }
    }
    // Fallback to default time slots
    return [
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
      '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
      '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
    ];
  };
  const timeSlots = generateTimeSlots();

  // Get minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Get maximum date (90 days from now)
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      setReservationData({
        date: '',
        time: '',
        guests: '2',
        name: '',
        email: '',
        phone: '',
        specialRequests: '',
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setReservationData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section - Slider */}
      {heroSlides.length > 0 && (
        <section
          className="relative h-[90vh] w-full overflow-hidden bg-black"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
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
                  className={`object-cover transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'
                    }`}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className={`max-w-3xl space-y-8 transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-orange-500 text-white rounded-full text-sm font-bold shadow-[0_0_20px_rgba(249,115,22,0.4)] backdrop-blur-md border border-orange-400/50 w-fit">
                      <Flame className="h-4 w-4 fill-white animate-bounce" /> {slide.badge}
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] drop-shadow-2xl">
                      {slide.title} <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-gray-200 max-w-xl font-medium leading-relaxed drop-shadow-lg">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-5 pt-4">
                      {/* Primary button - only show if showCTA is enabled AND button text is not empty */}
                      {(layoutConfig?.sections?.hero?.showCTA !== false || layoutConfig?.hero?.showCTA !== false) &&
                        slide.primaryBtn &&
                        slide.primaryBtn.trim() !== '' && (
                          <Link href={slide.primaryBtnLink || `/${storeConfig.slug}/menu`}>
                            <Button
                              size="lg"
                              className="h-16 px-10 text-lg font-bold rounded-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all hover:scale-105 hover:-translate-y-1"
                            >
                              {slide.primaryBtn}
                            </Button>
                          </Link>
                        )}
                      {/* Secondary button - only show if showSecondaryCTA is enabled AND button text is not empty */}
                      {(layoutConfig?.sections?.hero?.showSecondaryCTA !== false || layoutConfig?.hero?.showSecondaryCTA !== false) &&
                        slide.secondaryBtn &&
                        slide.secondaryBtn.trim() !== '' &&
                        slide.secondaryBtnLink && (
                          <Link href={slide.secondaryBtnLink}>
                            <Button
                              size="lg"
                              variant="outline"
                              className="h-16 px-10 text-lg font-bold rounded-full border-2 border-white text-white bg-black/20 hover:bg-white hover:text-black hover:border-white transition-all backdrop-blur-md"
                            >
                              {slide.secondaryBtn}
                            </Button>
                          </Link>
                        )}
                    </div>

                    {/* Trust Indicators (Only on first slide to avoid layout shift or redundancy, or keep dynamic if relevant) */}
                    <div className="flex flex-wrap gap-6 text-white/90 text-sm font-semibold pt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-400" /> <span>30-45 min Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" /> <span>4.9 (2k+ Reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 group border border-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-8 sm:w-8 text-white group-hover:text-orange-400 transition-colors" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 group border border-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-8 sm:w-8 text-white group-hover:text-orange-400 transition-colors" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                }}
                className={`transition-all duration-500 rounded-full ${index === currentSlide
                    ? 'w-12 h-3 bg-orange-500 shadow-lg shadow-orange-500/50'
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories - Visual Navigation */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-32 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/5 p-8 md:p-14 border border-white/20">
            <div className="text-center mb-8 md:mb-12">
              <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3 block">Menu Categories</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">What are you craving?</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${storeConfig.slug}/menu/${category.slug}`}
                  className="group flex flex-col items-center gap-5 min-w-[120px]"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_40px_rgba(249,115,22,0.2)] flex items-center justify-center transition-all duration-500 group-hover:-translate-y-2 border-4 border-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* In a real app, use category icons/images here */}
                    <Utensils className="h-10 w-10 md:h-12 md:w-12 text-gray-400 group-hover:text-orange-500 transition-colors relative z-10" />
                  </div>
                  <span className="font-bold text-gray-600 group-hover:text-orange-600 transition-colors text-base md:text-lg tracking-tight">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Visual Process */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3 block">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-gray-200 via-orange-200 to-gray-200 -z-10 border-t-2 border-dashed border-gray-300/50" />

            <div className="flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-[2rem] bg-white flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] group-hover:-translate-y-2 transition-all duration-500 relative z-10 border border-gray-100">
                <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors duration-500">
                  <Smartphone className="h-10 w-10 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">1</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Dish</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs font-medium">
                Browse our diverse menu and select your favorite meals with just a few taps.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-[2rem] bg-white flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] group-hover:-translate-y-2 transition-all duration-500 relative z-10 border border-gray-100">
                <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors duration-500">
                  <ChefHat className="h-10 w-10 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">2</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">We Cook It Fresh</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs font-medium">
                Our expert chefs prepare your order using the finest, freshest ingredients.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-[2rem] bg-white flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] group-hover:-translate-y-2 transition-all duration-500 relative z-10 border border-gray-100">
                <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors duration-500">
                  <Truck className="h-10 w-10 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">3</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs font-medium">
                Receive your hot and delicious meal at your doorstep in record time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items - Grid */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3 block">Our Menu</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{getLayoutText(storeConfig, 'food.chefRecommendations', 'Chef\'s Recommendations')}</h2>
            </div>
            <Link href={`/${storeConfig.slug}/menu`} className="group flex items-center gap-2 text-gray-600 hover:text-orange-600 font-bold transition-colors">
              {getLayoutText(storeConfig, 'food.viewMenu', 'View Full Menu')} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-[1.5rem]">
                  {item.image ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Utensils className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full font-black text-gray-900 shadow-lg border border-white/50">
                    {formatCurrency(item.price, storeConfig.settings?.currency || 'USD')}
                  </div>

                  {/* Quick Add Button Overlay - Desktop */}
                  <div className="hidden lg:block absolute bottom-4 left-4 right-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <Button onClick={() => handleAddToCart(item)} className="w-full h-12 rounded-xl bg-white hover:bg-orange-600 text-gray-900 hover:text-white font-bold shadow-xl border-0 transition-colors">
                      Add to Order
                    </Button>
                  </div>

                  {/* Mobile Add Button */}
                  <button onClick={() => handleAddToCart(item)} className="lg:hidden absolute bottom-3 right-3 bg-white text-orange-600 w-10 h-10 rounded-full shadow-lg flex items-center justify-center font-bold z-10 active:scale-95 transition-transform">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 pt-2 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-50">
                      {item.dietaryInfo.map((info) => (
                        <span key={info} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-700 transition-colors">
                          {info}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef's Story / About Section - Conditionally rendered */}
      {layoutConfig?.sections?.story?.show !== false && (
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50" />
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                    <Image
                      src={layoutConfig?.sections?.story?.image || getBannerImage(storeConfig, 'chef_image', "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2077&auto=format&fit=crop")}
                      alt="Chef Cooking"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl animate-fade-in-up hidden md:block">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                        <ChefHat className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Master Chef</p>
                        <p className="text-sm text-gray-500">15+ Years Experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">
                  {layoutConfig?.sections?.story?.label || getLayoutText(storeConfig, 'chef_image:section_title', 'Our Story')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  {layoutConfig?.sections?.story?.title || getLayoutText(storeConfig, 'chef_image:chef_name', 'Crafted with Love, Served with Passion')}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {layoutConfig?.sections?.story?.description || getLayoutText(storeConfig, 'chef_image:chef_bio', 'We believe that great food brings people together. Our chefs use only the freshest, locally-sourced ingredients to create dishes that not only taste amazing but also tell a story of tradition and innovation.')}
                </p>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-gray-900">15k+</h4>
                    <p className="text-gray-500 font-medium">Happy Customers</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-gray-900">100%</h4>
                    <p className="text-gray-500 font-medium">Fresh Ingredients</p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href={`/${storeConfig.slug}/about`}>
                    <Button variant="outline" className="rounded-full px-8 py-6 border-gray-200 hover:border-orange-600 hover:text-orange-600 text-base font-bold">
                      Read More About Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section - Conditionally rendered */}
      {layoutConfig?.sections?.testimonials?.show !== false && (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-orange-50/30 to-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 md:mb-20">
              <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3 block">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                {layoutConfig?.sections?.testimonials?.title || getLayoutText(storeConfig, 'sections.testimonials.title', 'What Our Customers Say')}
              </h2>
              <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
                {layoutConfig?.sections?.testimonials?.subtitle || getLayoutText(storeConfig, 'sections.testimonials.subtitle', 'Real experiences from food lovers who trust us')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(() => {
                // Use backend testimonials if available
                const backendTestimonials = layoutConfig?.sections?.testimonials?.items || [];
                const fallbackTestimonials = [
                  {
                    id: '1',
                    name: "Sarah Johnson",
                    role: "Food Blogger",
                    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                    quote: "The flavors are absolutely incredible! Every bite reminds me of authentic home cooking but with a gourmet twist. Highly recommended!",
                    rating: 5,
                    order: 1
                  },
                  {
                    id: '2',
                    name: "Michael Chen",
                    role: "Regular Customer",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                    quote: "Fastest delivery in town without compromising on quality. The food arrives hot and fresh every single time. My go-to for dinner.",
                    rating: 5,
                    order: 2
                  },
                  {
                    id: '3',
                    name: "Emily Davis",
                    role: "Chef",
                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                    quote: "As a chef myself, I'm impressed by the attention to detail and ingredient quality. The seasonal specials are always a delight to try.",
                    rating: 5,
                    order: 3
                  }
                ];

                // If backend has testimonials, use them; otherwise use fallback
                const testimonials = backendTestimonials.length > 0
                  ? backendTestimonials
                  : fallbackTestimonials;

                return testimonials.slice(0, 3);
              })().map((testimonial) => (
                <TestimonialCard key={testimonial.id || testimonial.name} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <PromoBanner config={layoutConfig?.sections?.promoBanner} layoutStyle="food" />

      {/* Reservation Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50/20 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-20 -z-10" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            {/* Left Side - Visual & Info */}
            <div className="space-y-10">
              <div>
                <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-4 block">Reservations</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
                  {getLayoutText(storeConfig, 'food.reserveTable', 'Reserve Your Table')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Perfect Table</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  {getLayoutText(storeConfig, 'food.ourPhilosophy', 'Experience our exceptional dining atmosphere. Book a table in advance to ensure the best experience for you and your guests.')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300">
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <Calendar className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5">Flexible Booking</h3>
                    <p className="text-sm text-gray-600 font-medium">Book up to 90 days in advance</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300">
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <Users className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5">Group Dining</h3>
                    <p className="text-sm text-gray-600 font-medium">Accommodate parties of all sizes</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300">
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5">Quick Confirmation</h3>
                    <p className="text-sm text-gray-600 font-medium">Instant booking confirmation</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300">
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <Award className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5">Special Occasions</h3>
                    <p className="text-sm text-gray-600 font-medium">Perfect for celebrations</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <Phone className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Prefer to call?</p>
                    <span className="text-lg font-bold text-gray-900">(555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Reservation Form */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-gray-100 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -z-10" />
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
                  <p className="text-gray-600">We&apos;ve sent a confirmation email to {reservationData.email}</p>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        <Calendar className="h-4 w-4 inline mr-2 text-orange-500" />
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        max={maxDateString}
                        value={reservationData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        <Clock className="h-4 w-4 inline mr-2 text-orange-500" />
                        Time
                      </label>
                      <select
                        required
                        value={reservationData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      <Users className="h-4 w-4 inline mr-2 text-orange-500" />
                      {getLayoutText(storeConfig, 'booking.selectDate', 'Number of Guests')}
                    </label>
                    <select
                      required
                      value={reservationData.guests}
                      onChange={(e) => handleInputChange('guests', e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                      <option value="13+">13+ Guests (Large Party)</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">{getLayoutText(storeConfig, 'common.account', 'Full Name')}</label>
                    <input
                      type="text"
                      required
                      value={reservationData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        <Mail className="h-4 w-4 inline mr-2 text-orange-500" />
                        {getLayoutText(storeConfig, 'common.account', 'Email')}
                      </label>
                      <input
                        type="email"
                        required
                        value={reservationData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        <Phone className="h-4 w-4 inline mr-2 text-orange-500" />
                        {getLayoutText(storeConfig, 'common.account', 'Phone')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={reservationData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      <MessageSquare className="h-4 w-4 inline mr-2 text-orange-500" />
                      {getLayoutText(storeConfig, 'common.account', 'Special Requests (Optional)')}
                    </label>
                    <textarea
                      value={reservationData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Dietary restrictions, celebration details, seating preferences..."
                      rows={4}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-lg shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        {getLayoutText(storeConfig, 'common.account', 'Processing...')}
                      </>
                    ) : (
                      <>
                        <Calendar className="h-5 w-5 mr-2" />
                        {getLayoutText(storeConfig, 'food.reserveTable', 'Reserve Table')}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 font-medium">
                    By submitting, you agree to our reservation policy. Cancellations must be made 24 hours in advance.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Promo Banner */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 text-white isolate">
            <div className="absolute inset-0 opacity-20">
              <Image
                src={getBannerImage(storeConfig, 'newsletter_bg', "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop")}
                alt="Pattern"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-12 lg:p-20 gap-12">
              <div className="max-w-xl space-y-6">
                <span className="inline-block px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30">
                  Limited Time
                </span>
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  Get 20% Off Your <br /> First Order
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Join our food lover&apos;s community and get exclusive access to new menu items and special offers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1 min-w-[300px]"
                  />
                  <Button onClick={handleSubscribe} size="lg" className="rounded-full px-8 py-6 bg-orange-600 hover:bg-orange-700 font-bold text-lg shadow-lg shadow-orange-600/30">
                    Subscribe
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500 p-1 animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center p-8 text-center">
                    <div>
                      <span className="block text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">20%</span>
                      <span className="text-2xl font-bold text-white tracking-widest uppercase">OFF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

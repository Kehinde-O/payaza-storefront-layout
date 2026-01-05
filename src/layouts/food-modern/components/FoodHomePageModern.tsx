'use client';

import { StoreConfig, StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useToast } from '@/components/ui/toast';
import { useStore } from '@/lib/store-context';
import { Star, Clock, MapPin, ChefHat, ArrowRight, Instagram, Facebook, Twitter, Utensils, Search, Menu as MenuIcon, Calendar, Users, Mail, Phone, CheckCircle, Flame, Wine, Coffee, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { getLayoutText, getBannerImage, getTextContent, getTeamMemberImage, getLogoUrl, getAssetUrl } from '@/lib/utils/asset-helpers';
import { StoreLogo } from '@/components/ui/store-logos';
import { shouldUseAPI } from '../../../lib/utils/demo-detection';
import { VideoPlayer } from '../../../components/ui/video-player';
import { PromoBanner } from '../../shared/components/PromoBanner';

interface FoodHomePageModernProps {
   storeConfig: StoreConfig;
}

export function FoodHomePageModern({ storeConfig }: FoodHomePageModernProps) {
   const categories = storeConfig.categories || [];
   const menuItems = storeConfig.menuItems || [];
   const layoutConfig = storeConfig.layoutConfig;
   const { addToCart } = useStore();
   const { addToast } = useToast();
   const [scrolled, setScrolled] = useState(false);
   const [isReservationOpen, setIsReservationOpen] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [reservationStep, setReservationStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [activeTab, setActiveTab] = useState('all');
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const [newsletterEmail, setNewsletterEmail] = useState('');

   useEffect(() => {
      const handleScroll = () => {
         setScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const handleReservationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
         setIsSubmitting(false);
         setReservationStep(2);
         addToast('Table reserved successfully!', 'success');
      }, 1500);
   };

   const closeReservation = () => {
      setIsReservationOpen(false);
      setTimeout(() => setReservationStep(1), 300);
   };

   const scrollToMenu = () => {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
         menuSection.scrollIntoView({ behavior: 'smooth' });
      }
   };

   const filteredItems = activeTab === 'all'
      ? menuItems
      : menuItems.filter(item => item.categoryId === activeTab);

   // Get testimonials from layoutConfig sections or use fallback
   const isRealStore = shouldUseAPI(storeConfig.slug);
   const testimonialsSection = layoutConfig?.sections?.testimonials;
   const backendTestimonials = testimonialsSection?.items || [];
   const fallbackTestimonials = [
      { id: '1', name: "Emily Clark", role: "Food Critic", comment: "An absolute masterpiece of culinary art. The flavors are balanced to perfection.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
      { id: '2', name: "James Wilson", role: "Regular Guest", comment: "The atmosphere, the service, and the food - everything is just 10/10. My favorite spot in the city.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
      { id: '3', name: "Sarah & Mike", role: "Couple", comment: "We celebrated our anniversary here and it was magical. Highly recommend the tasting menu.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
   ];

   const testimonials = backendTestimonials.length > 0
      ? backendTestimonials.map((t: any, idx: number) => ({
         id: t.id || String(idx + 1),
         name: t.name || fallbackTestimonials[idx]?.name || 'Customer',
         role: t.role || fallbackTestimonials[idx]?.role || 'Customer',
         comment: t.quote || t.comment || fallbackTestimonials[idx]?.comment || '',
         image: t.image || fallbackTestimonials[idx]?.image || '',
      }))
      : fallbackTestimonials;

   return (
      <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-orange-500 selection:text-white">
         {/* Navigation Overlay */}
         <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
               {/* Show logo if available, otherwise show store name */}
               {getLogoUrl(storeConfig) ? (
                  <Link href={`/${storeConfig.slug}`} className="relative z-50">
                     <StoreLogo
                        storeConfig={storeConfig}
                        className="h-10 w-10 transition-all duration-300 hover:opacity-90"
                        alt={storeConfig.name}
                     />
                  </Link>
               ) : (
                  <Link href={`/${storeConfig.slug}`} className="text-2xl font-black tracking-tighter uppercase relative z-50 group">
                     {storeConfig.name}
                     <span className="text-orange-500 group-hover:text-white transition-colors duration-300">.</span>
                  </Link>
               )}

               <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-[0.2em] uppercase">
                  <button onClick={scrollToMenu} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Menu</button>
                  <button onClick={() => setIsReservationOpen(true)} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Reservations</button>
                  <Link href={`/${storeConfig.slug}/about`} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Story</Link>
                  <Link href={`/${storeConfig.slug}/contact`} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Contact</Link>
               </div>

               <div className="flex items-center gap-6">
                  <Button variant="ghost" size="icon" className="text-white hover:text-orange-500 hover:bg-white/5 rounded-full md:hidden" onClick={() => setIsMenuOpen(true)}>
                     <MenuIcon className="h-6 w-6" />
                  </Button>
                  {storeConfig.features.search && (
                     <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white hover:text-orange-500 hover:bg-white/5 rounded-full hidden md:flex">
                        <Search className="h-5 w-5" />
                     </Button>
                  )}
                  <Button
                     onClick={() => setIsReservationOpen(true)}
                     className="bg-white text-black hover:bg-orange-500 hover:text-white rounded-full px-8 font-bold uppercase tracking-wider text-xs h-10 transition-all duration-300 hidden sm:flex"
                  >
                     Book Table
                  </Button>
               </div>
            </div>
         </nav>

         {/* Search Overlay */}
         {isSearchOpen && storeConfig.features.search && (
            <div className="fixed inset-0 z-50 bg-[#0F0F0F]/98 backdrop-blur-xl pt-20">
               <div className="container mx-auto px-6">
                  <div className="relative max-w-2xl mx-auto">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                     <input
                        type="text"
                        placeholder={getLayoutText(storeConfig, 'header.searchPlaceholder', 'Search menu items...')}
                        autoFocus
                        className="w-full pl-14 pr-4 py-6 text-xl bg-transparent border-b-2 border-orange-500/50 text-white focus:outline-none focus:border-orange-500"
                        onBlur={() => setIsSearchOpen(false)}
                     />
                  </div>
               </div>
            </div>
         )}

         {/* Mobile Menu Overlay */}
         <div className={`fixed inset-0 z-50 bg-[#0F0F0F] transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full p-8">
               <div className="flex justify-between items-center mb-12">
                  {/* Only show store name if no custom logo is present */}
                  {!getLogoUrl(storeConfig) ? (
                     <span className="text-2xl font-black uppercase">{storeConfig.name}<span className="text-orange-500">.</span></span>
                  ) : (
                     <StoreLogo
                        storeConfig={storeConfig}
                        className="h-10 w-10"
                        alt={storeConfig.name}
                     />
                  )}
                  <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-orange-500">
                     <X className="h-8 w-8" />
                  </button>
               </div>
               <div className="flex flex-col gap-8 text-2xl font-black uppercase tracking-tight">
                  <button onClick={() => { scrollToMenu(); setIsMenuOpen(false); }} className="text-left hover:text-orange-500">Menu</button>
                  <button onClick={() => { setIsReservationOpen(true); setIsMenuOpen(false); }} className="text-left hover:text-orange-500">Reservations</button>
                  <Link href={`/${storeConfig.slug}/about`} onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500">Story</Link>
                  <Link href={`/${storeConfig.slug}/contact`} onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500">Contact</Link>
               </div>
            </div>
         </div>

         {/* Hero Section - Video Background */}
         <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0">
               <VideoPlayer
                  src={getAssetUrl(storeConfig, 'hero_video', "https://cdn.coverr.co/videos/coverr-chef-preparing-food-in-kitchen-5379/1080p.mp4")}
                  poster={getBannerImage(storeConfig, 'hero_video_poster', "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop")}
                  context="background"
                  className="w-full h-full opacity-50 scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-black/30" />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-10">
               <div className="flex justify-center items-center gap-6 animate-fade-in-up">
                  <span className="h-px w-16 bg-white/30"></span>
                  <div className="flex items-center gap-2 text-orange-500 uppercase tracking-[0.3em] text-xs font-bold">
                     <Star className="h-3 w-3 fill-current" /> {getLayoutText(storeConfig, 'food.ourPhilosophy', 'Michelin Star 2024')}
                  </div>
                  <span className="h-px w-16 bg-white/30"></span>
               </div>

               <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none uppercase text-white animate-fade-in-up delay-100">
                  {getLayoutText(storeConfig, 'food.ourPhilosophy', 'Taste the Extraordinary')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Extraordinary</span>
               </h1>

               <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200 tracking-wide">
                  {storeConfig.description} Where culinary art meets exceptional atmosphere.
               </p>

               <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in-up delay-300">
                  <Button
                     onClick={() => setIsReservationOpen(true)}
                     className="h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(234,88,12,0.3)]"
                  >
                     {getLayoutText(storeConfig, 'food.reserveTable', 'Reserve Table')}
                  </Button>
                  <div onClick={scrollToMenu} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all group">
                     <ArrowRight className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  </div>
               </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-pulse">
               <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll</span>
               <div className="w-px h-16 bg-gradient-to-b from-orange-500 to-transparent"></div>
            </div>
         </section>

         {/* About Section - Parallaxish - Conditionally rendered */}
         {layoutConfig?.sections?.story?.show !== false && (
            <section className="py-20 px-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20 pointer-events-none" />
               <div className="container mx-auto max-w-6xl relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                     <div className="relative">
                        <div className="aspect-[4/5] rounded-none overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                           <ImageWithFallback
                              src={getBannerImage(storeConfig, 'about_section_image', "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80")}
                              alt="Chef"
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="absolute -bottom-10 -right-10 bg-[#1A1A1A] p-8 border border-white/5 max-w-xs hidden md:block">
                           <p className="font-serif italic text-2xl text-white mb-4">&quot;Cooking is an art, but patience is the key ingredient.&quot;</p>
                           <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">— Head Chef Marco</p>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">
                           {layoutConfig?.sections?.story?.label || getLayoutText(storeConfig, 'food.ourPhilosophy', 'Our Philosophy')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                           {layoutConfig?.sections?.story?.title || getLayoutText(storeConfig, 'food.ourPhilosophy', 'Crafting Memories Through Flavor')}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                           {layoutConfig?.sections?.story?.description || getLayoutText(storeConfig, 'food.ourPhilosophy', 'We believe that dining is more than just eating; it\'s an experience that engages all senses. Our seasonal menu is carefully curated using locally sourced ingredients to bring you the freshest flavors of the region.')}
                        </p>
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                           <div>
                              <Flame className="h-8 w-8 text-orange-500 mb-4" />
                              <h4 className="font-bold text-lg">Wood Fired</h4>
                              <p className="text-sm text-gray-500 mt-2">Authentic taste</p>
                           </div>
                           <div>
                              <Wine className="h-8 w-8 text-orange-500 mb-4" />
                              <h4 className="font-bold text-lg">Fine Wines</h4>
                              <p className="text-sm text-gray-500 mt-2">Curated selection</p>
                           </div>
                           <div>
                              <Coffee className="h-8 w-8 text-orange-500 mb-4" />
                              <h4 className="font-bold text-lg">Artisan Coffee</h4>
                              <p className="text-sm text-gray-500 mt-2">Roasted in-house</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         )}

         {/* Promotional Banner - Conditionally rendered */}
         {layoutConfig?.sections?.promoBanner?.show !== false && layoutConfig?.sections?.promoBanner && (
            <PromoBanner config={layoutConfig.sections.promoBanner} layoutStyle="food" className="my-20" />
         )}

         {/* Menu Categories - Tabbed */}
         <section id="menu-section" className="py-20 bg-[#141414] border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
               <div className="text-center mb-12">
                  <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-4 block">Discover</span>
                  <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">{getLayoutText(storeConfig, 'food.menuCategories', 'Our Menu')}</h2>

                  <div className="flex flex-wrap justify-center gap-4">
                     <button
                        onClick={() => setActiveTab('all')}
                        className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${activeTab === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
                     >
                        All
                     </button>
                     {categories.map((cat) => (
                        <button
                           key={cat.id}
                           onClick={() => setActiveTab(cat.id)}
                           className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${activeTab === cat.id ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
                        >
                           {cat.name}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {filteredItems.map((item) => (
                     <div key={item.id} className="group cursor-pointer">
                        <div className="aspect-square overflow-hidden rounded-full mb-6 border border-white/10 relative">
                           <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                              skeletonAspectRatio="square"
                           />
                           <div className="hidden lg:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                              <Button
                                 className="bg-orange-600 rounded-full px-6 hover:bg-orange-700"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Adapt menu item to product for cart
                                    const product: StoreProduct = {
                                       ...item,
                                       slug: item.id,
                                       images: item.image ? [item.image] : [],
                                       variants: [],
                                       specifications: {},
                                       rating: 0,
                                       reviewCount: 0
                                    };
                                    addToCart(product);
                                    addToast(`${item.name} added to order`, 'success');
                                 }}
                              >Order Now</Button>
                           </div>

                           {/* Mobile Order Button */}
                           <button
                              className="lg:hidden absolute bottom-2 right-2 bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-10 active:scale-95 transition-transform"
                              onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 const product: StoreProduct = {
                                    ...item,
                                    slug: item.id,
                                    images: item.image ? [item.image] : [],
                                    variants: [],
                                    specifications: {},
                                    rating: 0,
                                    reviewCount: 0
                                 };
                                 addToCart(product);
                                 addToast(`${item.name} added to order`, 'success');
                              }}
                           >
                              <Utensils className="h-5 w-5" />
                           </button>
                        </div>
                        <div className="text-center px-4">
                           <h3 className="text-xl font-bold uppercase tracking-wide mb-2 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                           <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                           <span className="text-2xl font-serif text-white block">{formatCurrency(item.price, (item as any).currency || storeConfig.settings?.currency || 'USD')}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Testimonials - Conditionally rendered */}
         {testimonialsSection?.show !== false && (
            <section className="py-20 px-6 bg-[#0F0F0F] border-t border-white/5">
               <div className="container mx-auto max-w-6xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase tracking-tight">
                     {testimonialsSection?.title || getLayoutText(storeConfig, 'sections.testimonials.title', 'Guest Stories')}
                  </h2>
                  {testimonialsSection?.subtitle && (
                     <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                        {testimonialsSection.subtitle}
                     </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {testimonials.slice(0, 3).map((t) => (
                        <div key={t.id} className="bg-[#1A1A1A] p-8 rounded-none border border-white/5 relative hover:-translate-y-2 transition-transform duration-300">
                           <div className="absolute -top-5 left-8 text-6xl text-orange-500/20 font-serif">&quot;</div>
                           <p className="text-gray-300 leading-relaxed mb-8 relative z-10 italic font-light">
                              {t.comment}
                           </p>
                           <div className="flex items-center gap-4">
                              <ImageWithFallback src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover grayscale" />
                              <div>
                                 <h4 className="font-bold text-white text-sm uppercase tracking-wide">{t.name}</h4>
                                 <span className="text-xs text-orange-500 font-bold uppercase tracking-widest">{t.role}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {/* Reservation / CTA */}
         <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center fixed-bg opacity-30 grayscale" style={{ backgroundImage: `url('${getBannerImage(storeConfig, 'reservation_bg', "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop")}')` }} />
            <div className="absolute inset-0 bg-[#0F0F0F]/80" />

            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
               <ChefHat className="h-12 w-12 md:h-16 md:w-16 text-white/20 mx-auto mb-6 md:mb-8" />
               <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight mb-6 md:mb-8">
                  Your Table Awaits
               </h2>
               <p className="text-lg md:text-xl text-gray-300 mb-10 md:mb-12 font-light">
                  Experience the art of fine dining in the heart of the city.
               </p>
               <Button
                  onClick={() => setIsReservationOpen(true)}
                  className="h-16 px-12 bg-white text-black hover:bg-orange-500 hover:text-white text-lg font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
               >
                  Make a Reservation
               </Button>
            </div>
         </section>

         {/* Modern Footer */}
         <footer className="bg-black pt-24 pb-12 border-t border-white/5">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                  <div className="space-y-8">
                     <Link href={`/${storeConfig.slug}`} className="text-3xl font-black tracking-tighter uppercase block">
                        {storeConfig.name}<span className="text-orange-500">.</span>
                     </Link>
                     <p className="text-gray-500 leading-relaxed text-sm">
                        {storeConfig.description || getLayoutText(storeConfig, 'footer.description', 'Redefining the art of dining through innovation, passion, and uncompromising quality.')}
                     </p>
                     {(storeConfig.branding.socialMedia || storeConfig.socialLinks) && (
                        <div className="flex gap-4">
                           {(storeConfig.branding.socialMedia?.instagram || storeConfig.socialLinks?.instagram) && (
                              <a href={storeConfig.branding.socialMedia?.instagram || storeConfig.socialLinks?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-full">
                                 <Instagram className="h-4 w-4" />
                              </a>
                           )}
                           {(storeConfig.branding.socialMedia?.facebook || storeConfig.socialLinks?.facebook) && (
                              <a href={storeConfig.branding.socialMedia?.facebook || storeConfig.socialLinks?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-full">
                                 <Facebook className="h-4 w-4" />
                              </a>
                           )}
                           {(storeConfig.branding.socialMedia?.twitter || storeConfig.socialLinks?.twitter) && (
                              <a href={storeConfig.branding.socialMedia?.twitter || storeConfig.socialLinks?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-full">
                                 <Twitter className="h-4 w-4" />
                              </a>
                           )}
                        </div>
                     )}
                  </div>

                  <div>
                     <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white">
                        {getLayoutText(storeConfig, 'footer.quickLinks.title', 'Quick Links')}
                     </h4>
                     <ul className="space-y-4 text-gray-500 text-sm">
                        {storeConfig.navigation?.footer && storeConfig.navigation.footer.length > 0 ? (
                           storeConfig.navigation.footer.map((section, idx) => (
                              section.links?.map((link, linkIdx) => (
                                 <li key={`${idx}-${linkIdx}`}>
                                    <Link href={link.href} className="hover:text-orange-500 transition-colors">{link.label}</Link>
                                 </li>
                              ))
                           )).flat()
                        ) : (
                           <>
                              <li><Link href={`/${storeConfig.slug}/menu`} className="hover:text-orange-500 transition-colors">{getLayoutText(storeConfig, 'footer.quickLinks.menu', 'Our Menu')}</Link></li>
                              <li><button onClick={() => setIsReservationOpen(true)} className="hover:text-orange-500 transition-colors text-left">{getLayoutText(storeConfig, 'footer.quickLinks.reservations', 'Reservations')}</button></li>
                              <li><Link href={`/${storeConfig.slug}/contact`} className="hover:text-orange-500 transition-colors">{getLayoutText(storeConfig, 'footer.quickLinks.privateDining', 'Private Dining')}</Link></li>
                              <li><Link href={`/${storeConfig.slug}/contact`} className="hover:text-orange-500 transition-colors">{getLayoutText(storeConfig, 'footer.quickLinks.giftCards', 'Gift Cards')}</Link></li>
                           </>
                        )}
                     </ul>
                  </div>

                  <div>
                     <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white">
                        {getLayoutText(storeConfig, 'footer.contact.title', 'Contact')}
                     </h4>
                     <ul className="space-y-4 text-gray-500 text-sm">
                        {storeConfig.contactInfo?.address && (
                           (storeConfig.contactInfo.address.street ||
                              storeConfig.contactInfo.address.city ||
                              storeConfig.contactInfo.address.state ||
                              storeConfig.contactInfo.address.zipCode) && (
                              <li className="flex items-start gap-3">
                                 <MapPin className="h-5 w-5 text-orange-500 mt-1 shrink-0" />
                                 <span>
                                    {storeConfig.contactInfo.address.street && `${storeConfig.contactInfo.address.street}, `}
                                    {storeConfig.contactInfo.address.city && `${storeConfig.contactInfo.address.city}, `}
                                    {storeConfig.contactInfo.address.state && `${storeConfig.contactInfo.address.state} `}
                                    {storeConfig.contactInfo.address.zipCode && storeConfig.contactInfo.address.zipCode}
                                 </span>
                              </li>
                           )
                        )}
                        {storeConfig.contactInfo?.phone && (
                           <li className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                              <a href={`tel:${storeConfig.contactInfo.phone}`} className="hover:text-orange-500 transition-colors">{storeConfig.contactInfo.phone}</a>
                           </li>
                        )}
                        {storeConfig.contactInfo?.email && (
                           <li className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                              <a href={`mailto:${storeConfig.contactInfo.email}`} className="hover:text-orange-500 transition-colors">{storeConfig.contactInfo.email}</a>
                           </li>
                        )}
                        {storeConfig.locations && storeConfig.locations.length > 0 && storeConfig.locations[0].openingHours && (
                           <li className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-orange-500 shrink-0" />
                              <span>{storeConfig.locations[0].openingHours}</span>
                           </li>
                        )}
                        {!storeConfig.contactInfo?.address && !storeConfig.contactInfo?.phone && !storeConfig.contactInfo?.email && (!storeConfig.locations || storeConfig.locations.length === 0 || !storeConfig.locations[0].openingHours) && (
                           <li className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-orange-500 shrink-0" />
                              <span>{getLayoutText(storeConfig, 'footer.contact.openingHours', 'Mon-Sun: 11am - 11pm')}</span>
                           </li>
                        )}
                     </ul>
                  </div>

                  <div>
                     <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white">
                        {getLayoutText(storeConfig, 'footer.newsletter.title', 'Newsletter')}
                     </h4>
                     <p className="text-gray-500 mb-6 text-sm">
                        {getLayoutText(storeConfig, 'footer.newsletter.description', getLayoutText(storeConfig, 'sections.marketing.newsletter.subtitle', 'Subscribe for seasonal updates and exclusive invitations.'))}
                     </p>
                     <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (newsletterEmail && newsletterEmail.includes('@')) {
                           await new Promise(resolve => setTimeout(resolve, 500));
                           addToast('Thank you for subscribing!', 'success');
                           setNewsletterEmail('');
                        }
                     }} className="flex border-b border-white/20 pb-2">
                        <input
                           type="email"
                           placeholder={getLayoutText(storeConfig, 'footer.newsletter.placeholder', getLayoutText(storeConfig, 'sections.marketing.newsletter.placeholder', 'Email Address'))}
                           value={newsletterEmail}
                           onChange={(e) => setNewsletterEmail(e.target.value)}
                           required
                           className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-600 text-sm"
                        />
                        <button type="submit" className="text-orange-500 font-bold uppercase text-xs hover:text-white transition-colors">
                           {getLayoutText(storeConfig, 'footer.newsletter.button', getLayoutText(storeConfig, 'sections.marketing.newsletter.button', 'Join'))}
                        </button>
                     </form>
                  </div>
               </div>

               <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 uppercase tracking-wider">
                  <p>
                     {getLayoutText(storeConfig, 'footer.copyright', `© ${new Date().getFullYear()} ${storeConfig.name}. All rights reserved.`)}
                  </p>
                  <div className="flex gap-8">
                     <Link href={`/${storeConfig.slug}/privacy`} className="hover:text-white transition-colors">
                        {getLayoutText(storeConfig, 'footer.privacyPolicy', 'Privacy Policy')}
                     </Link>
                     <Link href={`/${storeConfig.slug}/terms`} className="hover:text-white transition-colors">
                        {getLayoutText(storeConfig, 'footer.termsOfService', 'Terms of Service')}
                     </Link>
                  </div>
               </div>
            </div>
         </footer>

         {/* Reservation Modal */}
         <Modal isOpen={isReservationOpen} onClose={closeReservation} title="Table Reservation" className="bg-[#1A1A1A] text-white border border-white/10 rounded-none">
            {reservationStep === 1 ? (
               <form onSubmit={handleReservationSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Date</label>
                        <div className="relative">
                           <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <input type="date" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Time</label>
                        <div className="relative">
                           <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <select required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm text-gray-300">
                              <option>18:00</option>
                              <option>18:30</option>
                              <option>19:00</option>
                              <option>19:30</option>
                              <option>20:00</option>
                              <option>20:30</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Guests</label>
                     <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm text-gray-300">
                           {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} People</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Contact Details</label>
                     <div className="space-y-3">
                        <div className="relative">
                           <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <input type="text" placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                        </div>
                        <div className="relative">
                           <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <input type="email" placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                        </div>
                        <div className="relative">
                           <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <input type="tel" placeholder="Phone Number" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                        </div>
                     </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-[0.2em] rounded-none mt-4">
                     {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                  </Button>
               </form>
            ) : (
               <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                     <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Confirmed</h3>
                  <p className="text-gray-400">Your table has been reserved. Check your email for details.</p>
                  <Button onClick={closeReservation} className="bg-white text-black hover:bg-gray-200 rounded-none px-10 h-12 uppercase tracking-wider font-bold">
                     Close
                  </Button>
               </div>
            )}
         </Modal>
      </div>
   );
}

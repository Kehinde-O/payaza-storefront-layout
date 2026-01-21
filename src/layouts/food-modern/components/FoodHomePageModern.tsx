'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useToast } from '@/components/ui/toast';
import { useStore } from '@/lib/store-context';
import { Star, ArrowRight, Utensils, Calendar, Users, Mail, Phone, CheckCircle, Flame, Wine, Coffee, ChefHat, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { getLayoutText, getBannerImage, shouldUseAPI, getAssetUrl } from '@/lib/utils/asset-helpers';
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
   // const [scrolled, setScrolled] = useState(false); // Handled by Header
   const [isReservationOpen, setIsReservationOpen] = useState(false);
   // const [isMenuOpen, setIsMenuOpen] = useState(false); // Handled by Header
   const [reservationStep, setReservationStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [activeTab, setActiveTab] = useState('all');
   // const [isSearchOpen, setIsSearchOpen] = useState(false); // Handled by Header
   // const [newsletterEmail, setNewsletterEmail] = useState(''); // Footer removed

   // Scroll listener removed as it was for header transparency

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
      <div className="bg-[#0F0F0F] text-white font-sans selection:bg-orange-500 selection:text-white">
         {/* Navigation Overlay - Removed (Handled by Wrapper) */}
         {/* Search Overlay - Removed (Handled by Wrapper) */}
         {/* Mobile Menu Overlay - Removed (Handled by Wrapper) */}

         {/* Hero Section - Video Background */}
         <section
            data-section="hero"
            className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0F0F0F]"
         >
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
                                    const product = {
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
                                 const product = {
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

         {/* Modern Footer - Removed (Handled by Wrapper) */}

         {/* Reservation Modal - Kept for Hero CTA */}
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

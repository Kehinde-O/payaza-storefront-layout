'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useToast } from '@/components/ui/toast';
import { usePayazaCheckout } from '@/hooks/use-payaza-checkout';
import { Calendar, Clock, User, ChevronRight, CheckCircle, Search, Filter, MoreHorizontal, X, Star, Heart, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatCurrency, filterActiveServices } from '@/lib/utils';
import { useAuth } from '../../../lib/auth-context';
import { getBannerImage, getServiceImage, getTeamMemberImage, getTextContent, getLayoutText, getThemeColor } from '../../../lib/utils/asset-helpers';
import { isDemoStore, shouldUseAPI } from '../../../lib/utils/demo-detection';
import { TestimonialCard } from '../../shared/components/TestimonialCard';

interface BookingHomePageAgendaProps {
   storeConfig: StoreConfig;
}

export function BookingHomePageAgenda({ storeConfig }: BookingHomePageAgendaProps) {
   const layoutConfig = storeConfig.layoutConfig;
   const categories = storeConfig.categories || [];
   const services = filterActiveServices(storeConfig.services || []);

   const [selectedDate, setSelectedDate] = useState<number>(0); // 0 = Today
   const [selectedTime, setSelectedTime] = useState<string | null>(null);
   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
   const [selectedService, setSelectedService] = useState<string | null>(null);
   const [bookingStep, setBookingStep] = useState(1);
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const { addToast } = useToast();
   const { user, isAuthenticated } = useAuth();

   const [guestInfo, setGuestInfo] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
   });

   // Pre-fill form data for authenticated users
   useEffect(() => {
      if (isAuthenticated && user) {
         setGuestInfo(prev => ({
            firstName: user.firstName || prev.firstName,
            lastName: user.lastName || prev.lastName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
         }));
      }
   }, [isAuthenticated, user]);

   // Do not hardcode a live key in code; require configuration via storeConfig/env.
   const payazaPublicKey = storeConfig.payment?.payazaPublicKey || process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '';

   const { checkout, isLoading: isPaymentLoading } = usePayazaCheckout({
      publicKey: payazaPublicKey,
      onSuccess: () => {
         setBookingStep(4); // Success
         addToast('Payment successful & Booking confirmed!', 'success');
      },
      onError: (error) => {
         addToast(error, 'error');
         setBookingStep(2); // Stay on payment step
      },
      onClose: () => {
         // User closed popup
      }
   });

   // Generate next 7 days
   const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
         date: d,
         dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
         dayNumber: d.getDate(),
         fullDate: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
   });

   const handleBookClick = (serviceId?: string) => {
      if (serviceId) setSelectedService(serviceId);
      setSelectedTime(null);
      setBookingStep(1);
      setIsBookingModalOpen(true);
   };

   const handlePaymentSubmit = async () => {
      if (!selectedService) return;

      const service = services.find(s => s.id === selectedService);
      if (!service) return;

      setBookingStep(3); // Loading

      // DEMO MODE BYPASS
      if (storeConfig.slug.startsWith('demo/')) {
         setTimeout(() => {
            setBookingStep(4);
            addToast('Payment successful & Booking confirmed!', 'success');
         }, 1500);
         return;
      }

      if (!payazaPublicKey) {
         addToast('Payment gateway not configured', 'error');
         setBookingStep(2);
         return;
      }

      // Use authenticated user info if available, otherwise use guest info
      const customerEmail = isAuthenticated && user ? user.email : guestInfo.email;
      const customerFirstName = isAuthenticated && user ? user.firstName : guestInfo.firstName;
      const customerLastName = isAuthenticated && user ? user.lastName : guestInfo.lastName;
      const customerPhone = isAuthenticated && user ? (user.phone || '') : guestInfo.phone;

      await checkout({
         amount: service.price,
         email: customerEmail,
         firstName: customerFirstName,
         lastName: customerLastName,
         phone: customerPhone,
         reference: `BK-${Date.now()}`,
         currency: storeConfig.settings.currency || 'USD',
      });
   };

   // Get providers from backend team data if available, otherwise use fallback (only for demo stores)
   const isRealStore = shouldUseAPI(storeConfig.slug);
   const teamMembers = isRealStore ? (storeConfig.layoutConfig?.pages?.team?.members || []) : [];
   const isDemo = isDemoStore(storeConfig.slug);
   const fallbackProviderImages = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
   ];

   const providers = teamMembers.length > 0
      ? teamMembers.slice(0, 4).map((member, index) => {
         // Use member photo if available, otherwise use helper to check assignedAssets, then fallback
         const memberPhoto = member.photo && member.photo.trim()
            ? member.photo.trim()
            : getTeamMemberImage(storeConfig, member.name, `provider_${index + 1}`, fallbackProviderImages[index] || fallbackProviderImages[0]);

         return {
            id: index + 1,
            name: member.name,
            role: member.role || "Specialist",
            rating: 4.9,
            reviews: 100,
            image: memberPhoto
         };
      })
      : isDemo
         ? [
            { id: 1, name: "Sarah Mitchell", role: "Senior Stylist", rating: 4.9, reviews: 120, image: fallbackProviderImages[0] },
            { id: 2, name: "Michael Chen", role: "Color Specialist", rating: 5.0, reviews: 85, image: fallbackProviderImages[1] },
            { id: 3, name: "Jessica Lee", role: "Nail Artist", rating: 4.8, reviews: 210, image: fallbackProviderImages[2] },
            { id: 4, name: "David Kim", role: "Massage Therapist", rating: 4.9, reviews: 150, image: fallbackProviderImages[3] },
         ]
         : []; // For real stores with no team members, show empty state

   // Get theme colors with fallbacks
   const bgPrimary = getThemeColor(storeConfig, 'background', 'primary', '#FAFAFA');
   const bgSecondary = getThemeColor(storeConfig, 'background', 'secondary', '#FFFFFF');
   const bgOverlay = getThemeColor(storeConfig, 'background', 'overlay', 'rgba(255,255,255,0.5)');
   const textPrimary = getThemeColor(storeConfig, 'text', 'primary', '#1E293B');
   const blob1 = getThemeColor(storeConfig, 'layoutSpecific', 'blob1', '#FECDD3');
   const blob2 = getThemeColor(storeConfig, 'layoutSpecific', 'blob2', '#DDD6FE');
   const blob3 = getThemeColor(storeConfig, 'layoutSpecific', 'blob3', '#E9D5FF');
   const sidebarBg = getThemeColor(storeConfig, 'layoutSpecific', 'sidebar', 'rgba(255,255,255,0.8)');
   const buttonBg = getThemeColor(storeConfig, 'layoutSpecific', 'button', '#1E293B');
   const borderPrimary = getThemeColor(storeConfig, 'border', 'primary', 'rgba(0,0,0,0.05)');

   return (
      <div className="min-h-screen font-sans" style={{ backgroundColor: bgPrimary, color: textPrimary }}>

         {/* Soft Gradient Background Mesh */}
         <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ backgroundColor: blob1 }}></div>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" style={{ backgroundColor: blob2 }}></div>
            <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" style={{ backgroundColor: blob3 }}></div>
         </div>

         <div className="relative z-10 flex flex-col md:flex-row max-w-[1600px] mx-auto backdrop-blur-xl min-h-screen shadow-[0_0_100px_rgba(0,0,0,0.05)]" style={{ backgroundColor: bgOverlay }}>

            {/* Elegant Sidebar Navigation */}
            <aside className="w-full md:w-72 border-r flex-shrink-0 md:h-screen md:sticky md:top-0 z-30 flex flex-col backdrop-blur-md" style={{ backgroundColor: sidebarBg, borderRightColor: borderPrimary }}>
               <div className="p-8 border-b border-gray-100/50 flex items-center justify-between md:block">
                  <Link href={`/${storeConfig.slug}`} className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                     <span className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white">
                        <Sparkles className="h-4 w-4" />
                     </span>
                     {storeConfig.name}
                  </Link>
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                     {isMobileMenuOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
                  </Button>
               </div>

               <div className={`p-6 space-y-8 overflow-y-auto md:flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
                  <Button
                     onClick={() => handleBookClick()}
                     className="w-full justify-center text-white hover:opacity-90 h-12 rounded-xl font-medium shadow-lg transition-all hover:scale-[1.02]"
                     style={{ backgroundColor: buttonBg }}
                  >
                     <Calendar className="mr-2 h-4 w-4" /> {getLayoutText(storeConfig, 'booking.bookAppointment', 'Book Appointment')}
                  </Button>

                  <div className="space-y-1">
                     <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Menu</h3>
                     <Link href={`/${storeConfig.slug}/services`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
                        <Search className="h-4 w-4" /> Discover
                     </Link>
                     <Link href={`/${storeConfig.slug}/account`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
                        <User className="h-4 w-4" /> My Profile
                     </Link>
                     {storeConfig.features.wishlist ? (
                        <Link href={`/${storeConfig.slug}/wishlist`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
                           <Heart className="h-4 w-4" /> Favorites
                        </Link>
                     ) : (
                        <Link href={`/${storeConfig.slug}/services`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
                           <Heart className="h-4 w-4" /> Favorites
                        </Link>
                     )}
                  </div>

                  <div className="space-y-1">
                     <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Categories</h3>
                     {categories.map(cat => (
                        <Link key={cat.id} href={`/${storeConfig.slug}/categories/${cat.slug}`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors group">
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-rose-500 transition-colors" />
                           {cat.name}
                        </Link>
                     ))}
                  </div>
               </div>

               <div className={`p-6 border-t border-gray-100/50 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
                  <Link href={`/${storeConfig.slug}/account`}>
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 text-xs font-bold">JD</div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-slate-700 truncate">Jane Doe</p>
                           <p className="text-xs text-slate-500 truncate">View Profile</p>
                        </div>
                     </div>
                  </Link>
               </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto">

               {/* Header & Date Picker */}
               <div className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-20">
                  <div className="px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-1">{getTextContent(storeConfig, 'booking_page_title', 'Book an Appointment')}</h1>
                        <p className="text-slate-500 text-sm">{getLayoutText(storeConfig, 'booking.pageSubtitle', getTextContent(storeConfig, 'booking_page_subtitle', 'Select a date and service to continue'))}</p>
                     </div>
                     <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="w-full md:w-auto rounded-full border-gray-200 hover:bg-gray-50">
                        <Filter className="h-4 w-4 mr-2" /> {getLayoutText(storeConfig, 'booking.filters', 'Filters')}
                     </Button>
                  </div>

                  {/* Styled Date Scroller */}
                  <div className="flex overflow-x-auto px-4 md:px-8 pb-4 md:pb-6 gap-3 no-scrollbar scroll-smooth">
                     {days.map((day, idx) => (
                        <button
                           key={idx}
                           onClick={() => setSelectedDate(idx)}
                           className={`flex flex-col items-center justify-center min-w-[70px] p-4 rounded-2xl border transition-all duration-300 ${selectedDate === idx
                                 ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 transform -translate-y-1'
                                 : 'bg-white text-slate-600 border-gray-100 hover:border-rose-200 hover:shadow-md'
                              }`}
                        >
                           <span className="text-xs font-medium uppercase tracking-wider opacity-80">{day.dayName}</span>
                           <span className="text-xl font-bold mt-1">{day.dayNumber}</span>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-4 md:p-10 max-w-5xl space-y-8 md:space-y-12">

                  {/* Featured Promo Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-900/20 group cursor-pointer" onClick={() => handleBookClick()}>
                     <div className="absolute inset-0">
                        <ImageWithFallback
                           src={getBannerImage(storeConfig, 'promo_banner', "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80")}
                           alt="Spa treatment"
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                     </div>
                     <div className="relative z-10 p-6 md:p-14 text-white max-w-2xl">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 border border-white/30">
                           {getTextContent(storeConfig, 'promo_badge', 'Summer Exclusive')}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                           {getTextContent(storeConfig, 'promo_title', 'Total Renewal\nPackage').split('\n').map((line, i) => (
                              <span key={i}>
                                 {line}
                                 {i === 0 && <br />}
                              </span>
                           ))}
                        </h2>
                        <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 font-light leading-relaxed max-w-lg">
                           {getTextContent(storeConfig, 'promo_desc', 'Indulge in a 90-minute holistic treatment including a full body massage, organic facial, and aromatherapy session.')}
                        </p>
                        <div className="flex items-center gap-4">
                           <Button className="bg-white text-slate-900 hover:bg-rose-50 h-12 px-8 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
                              {getLayoutText(storeConfig, 'booking.bookAppointment', 'Book Now')} • $120
                           </Button>
                           <span className="text-sm font-medium text-white/80">Limited availability</span>
                        </div>
                     </div>
                  </div>

                  {/* Services List - Refined */}
                  <div>
                     <div className="flex items-end justify-between mb-8">
                        <h3 className="text-2xl font-serif font-bold text-slate-900">{getLayoutText(storeConfig, 'booking.availableServices', getTextContent(storeConfig, 'services_list_title', 'Available Services'))}</h3>
                        <span className="text-sm text-slate-500 font-medium">{getTextContent(storeConfig, 'services_list_count', `Showing ${services.length} results`)}</span>
                     </div>

                     <div className="grid grid-cols-1 gap-6">
                        {services.map((service) => (
                           <div key={service.id} className="group bg-white rounded-3xl p-4 border border-gray-100 hover:border-rose-100 shadow-sm hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 rounded-2xl overflow-hidden relative">
                                 <ImageWithFallback
                                    src={getServiceImage(service.image, storeConfig, "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80")}
                                    alt={service.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                 />
                                 <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-rose-500" />
                                    {service.duration} min
                                 </div>
                              </div>

                              <div className="flex-1 py-2 pr-4 flex flex-col">
                                 <div className="flex justify-between items-start mb-3">
                                    <div>
                                       <h4 className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors mb-2">
                                          {service.name}
                                       </h4>
                                       <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 max-w-xl">
                                          {service.description}
                                       </p>
                                    </div>
                                    <span className="text-2xl font-serif font-bold text-slate-900">{formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD')}</span>
                                 </div>

                                 <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                                       {['09:00', '10:30', '13:00', '15:45'].map(time => (
                                          <button key={time} onClick={() => handleBookClick(service.id)} className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap flex-shrink-0">
                                             {time}
                                          </button>
                                       ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                       {service.provider && (
                                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-2 rounded-full">
                                             <div className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-bold">
                                                {service.provider.name.charAt(0)}
                                             </div>
                                             {service.provider.name}
                                          </div>
                                       )}
                                       <Button onClick={() => handleBookClick(service.id)} className="flex-1 md:flex-none rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium px-6">
                                          {getLayoutText(storeConfig, 'booking.bookAppointment', 'Book Now')}
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Top Professionals Carousel */}
                  {/* Our Experts Section - Conditionally rendered */}
                  {layoutConfig?.sections?.team?.show !== false && (
                     <section>
                        <div className="flex items-end justify-between mb-8">
                           <h3 className="text-2xl font-serif font-bold text-slate-900">
                              {layoutConfig?.sections?.team?.title || getTextContent(storeConfig, 'experts_section_title', 'Our Experts')}
                           </h3>
                           <Link
                              href={storeConfig.pageFeatures?.teamPage ? `/${storeConfig.slug}/team` : `/${storeConfig.slug}/services`}
                              className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                           >
                              {getTextContent(storeConfig, 'experts_view_all', 'View All')} <ChevronRight className="h-4 w-4" />
                           </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                           {providers.map((provider) => (
                              <div key={provider.id} className="group bg-white p-4 rounded-3xl border border-gray-100 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-900/5 transition-all text-center">
                                 <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg relative group-hover:scale-105 transition-transform">
                                    <ImageWithFallback
                                       src={provider.image}
                                       alt={provider.name}
                                       className="w-full h-full object-cover"
                                    />
                                 </div>
                                 <h4 className="font-bold text-slate-900 mb-1">{provider.name}</h4>
                                 <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mb-3">{provider.role}</p>
                                 <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 py-1.5 rounded-full mx-4">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    {provider.rating} <span className="text-slate-300">•</span> {provider.reviews} reviews
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>
                  )}

                  {/* Testimonials Section - Conditionally rendered */}
                  {layoutConfig?.sections?.testimonials?.show !== false && (
                     <section className="py-12">
                        <div className="mb-8">
                           <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                              {layoutConfig?.sections?.testimonials?.title || getLayoutText(storeConfig, 'sections.testimonials.title', 'What Our Clients Say')}
                           </h3>
                           {layoutConfig?.sections?.testimonials?.subtitle && (
                              <p className="text-slate-500 text-sm">
                                 {layoutConfig.sections.testimonials.subtitle}
                              </p>
                           )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {(() => {
                              const backendTestimonials = layoutConfig?.sections?.testimonials?.items || [];
                              const fallbackTestimonials = [
                                 {
                                    id: '1',
                                    name: 'Emily Davis',
                                    role: 'Bridal Client',
                                    quote: "I've never felt more beautiful. The makeup was flawless and lasted all night. Absolutely stunning work!",
                                    rating: 5,
                                    order: 1
                                 }
                              ];
                              const testimonials = backendTestimonials.length > 0 ? backendTestimonials : fallbackTestimonials;
                              return testimonials.slice(0, 3).map((testimonial) => (
                                 <div key={testimonial.id || testimonial.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <TestimonialCard testimonial={testimonial} />
                                 </div>
                              ));
                           })()}
                        </div>
                     </section>
                  )}

               </div>
            </main>
         </div>

         {/* Booking Modal - Polished with Payment */}
         <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title={bookingStep === 2 ? getLayoutText(storeConfig, 'booking.completePayment', 'Complete Payment') : getLayoutText(storeConfig, 'booking.confirmBooking', 'Confirm Appointment')} className="max-w-md bg-white rounded-3xl overflow-hidden">
            {bookingStep === 1 && (
               <div className="space-y-6">
                  <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                     <h4 className="font-bold text-rose-900 text-sm uppercase tracking-wide mb-3">Summary</h4>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-rose-700">Date</span>
                           <span className="font-bold text-slate-900">{days[selectedDate].fullDate}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-rose-700">Service</span>
                           <span className="font-bold text-slate-900">{selectedService ? services.find(s => s.id === selectedService)?.name : 'Select a service'}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-rose-200/50">
                           <span className="text-rose-900 font-bold">Total</span>
                           <span className="font-bold text-slate-900 text-lg">{formatCurrency(selectedService ? (services.find(s => s.id === selectedService)?.price || 0) : 0, (selectedService ? services.find(s => s.id === selectedService)?.currency : null) || storeConfig.settings?.currency || 'USD')}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Available Times</label>
                        <div className="grid grid-cols-3 gap-2">
                           {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map(time => (
                              <button
                                 key={time}
                                 onClick={() => setSelectedTime(time)}
                                 className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${selectedTime === time ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50 focus:ring-2 focus:ring-rose-500 focus:outline-none'}`}
                              >
                                 {time}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Details</label>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                           <input
                              type="text"
                              placeholder="First Name"
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                              value={guestInfo.firstName}
                              onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                           />
                           <input
                              type="text"
                              placeholder="Last Name"
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                              value={guestInfo.lastName}
                              onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <input
                              type="email"
                              placeholder="Email"
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                              value={guestInfo.email}
                              onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                           />
                           <input
                              type="tel"
                              placeholder="Phone"
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                              value={guestInfo.phone}
                              onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                           />
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Special Requests</label>
                        <textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 resize-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all" placeholder="Any allergies or preferences?"></textarea>
                     </div>
                  </div>

                  <Button
                     onClick={() => {
                        if (!guestInfo.email || !guestInfo.firstName || !guestInfo.lastName) {
                           addToast('Please fill in your details', 'error');
                           return;
                        }
                        if (!selectedTime) {
                           addToast('Please select a time', 'error');
                           return;
                        }
                        setBookingStep(2);
                     }}
                     className="w-full bg-slate-900 hover:bg-slate-800 h-12 rounded-xl text-lg font-medium shadow-lg"
                  >
                     Continue to Payment
                  </Button>
               </div>
            )}

            {bookingStep === 2 && (
               <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
                     <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Amount to Pay</p>
                        <p className="text-3xl font-serif font-bold">{formatCurrency(selectedService ? (services.find(s => s.id === selectedService)?.price || 0) : 0, (selectedService ? services.find(s => s.id === selectedService)?.currency : null) || storeConfig.settings?.currency || 'USD')}</p>
                        <div className="flex items-center gap-2 mt-4 text-xs text-slate-300">
                           <Lock className="h-3 w-3" /> Secure Payaza Transaction
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <h4 className="font-bold text-sm mb-2 text-slate-900">Billing Details</h4>
                     <div className="text-sm text-slate-600 space-y-1">
                        <p><span className="font-medium text-slate-900">Name:</span> {guestInfo.firstName} {guestInfo.lastName}</p>
                        <p><span className="font-medium text-slate-900">Email:</span> {guestInfo.email}</p>
                        <p><span className="font-medium text-slate-900">Phone:</span> {guestInfo.phone}</p>
                     </div>
                  </div>

                  <Button onClick={handlePaymentSubmit} disabled={isPaymentLoading} className="w-full bg-rose-600 hover:bg-rose-700 h-12 rounded-xl text-lg font-medium shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2">
                     {isPaymentLoading ? (
                        <>
                           <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Processing...
                        </>
                     ) : (
                        <>Pay & Confirm Booking</>
                     )}
                  </Button>
                  <button type="button" onClick={() => setBookingStep(1)} className="w-full text-sm text-slate-500 font-medium hover:text-slate-800">Back to Details</button>
               </div>
            )}

            {bookingStep === 3 && (
               <div className="py-16 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                     <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-rose-600 animate-pulse" />
                     </div>
                  </div>
                  <p className="text-slate-500 font-medium">Processing secure payment...</p>
               </div>
            )}

            {bookingStep === 4 && (
               <div className="py-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-900/10 animate-in zoom-in duration-300">
                     <CheckCircle className="h-10 w-10" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-serif font-bold text-slate-900">Payment Successful!</h3>
                     <p className="text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">Your appointment is confirmed. We&apos;ve sent a receipt to your email.</p>
                  </div>
                  <Button onClick={() => setIsBookingModalOpen(false)} className="w-full bg-slate-900 hover:bg-black h-12 rounded-xl font-medium">Done</Button>
               </div>
            )}
         </Modal>

         {/* Filter Modal */}
         <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filter Services" className="max-w-sm rounded-3xl">
            <div className="space-y-8 py-2">
               <div>
                  <h4 className="font-bold text-sm mb-4">Price Range</h4>
                  <div className="flex items-center gap-4">
                     <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                        <input type="number" placeholder="0" className="w-full bg-gray-50 rounded-xl px-7 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500" />
                     </div>
                     <span className="text-gray-400">-</span>
                     <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                        <input type="number" placeholder="500" className="w-full bg-gray-50 rounded-xl px-7 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500" />
                     </div>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold text-sm mb-4">Duration</h4>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-rose-200 cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded-md border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-sm font-medium text-slate-700">Quick (30 min or less)</span>
                     </label>
                     <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-rose-200 cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded-md border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-sm font-medium text-slate-700">Standard (1 hour)</span>
                     </label>
                     <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-rose-200 cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded-md border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="text-sm font-medium text-slate-700">Extended (1.5 hours+)</span>
                     </label>
                  </div>
               </div>
               <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl h-12 border-gray-200" onClick={() => setIsFilterOpen(false)}>Reset</Button>
                  <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 shadow-lg" onClick={() => setIsFilterOpen(false)}>Show Results</Button>
               </div>
            </div>
         </Modal>
      </div>
   );
}

'use client';

import { StoreConfig, StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { ArrowRight, ShoppingCart, Zap, Shield, Smartphone, Laptop, Headphones, Watch, Camera, Cpu, Battery, Wifi } from 'lucide-react';
import Link from 'next/link';
import { ElectronicsStoreHeader } from './ElectronicsStoreHeader';
import { ElectronicsStoreFooter } from './ElectronicsStoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { formatCurrency, filterActiveProducts } from '../../../lib/utils';
import { getLayoutText } from '../../../lib/utils/asset-helpers';
import { PromoBanner } from '../../shared/components/PromoBanner';

interface ElectronicsHomePageProps {
   storeConfig: StoreConfig;
}

export function ElectronicsHomePage({ storeConfig }: ElectronicsHomePageProps) {
   const { addToCart } = useStore();
   const { addToast } = useToast();
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const [email, setEmail] = useState('');

   // Layout Visibility
   const layout = storeConfig.layoutConfig;

   const scrollLeft = () => {
      if (scrollContainerRef.current) {
         scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
   };

   const scrollRight = () => {
      if (scrollContainerRef.current) {
         scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
   };

   const handleAddToCart = (e: React.MouseEvent, product: StoreProduct) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product);
      addToast(`${product.name} added to cart`, 'success');
   };

   const handleSubscribe = () => {
      if (email) {
         addToast('Thank you for subscribing!', 'success');
         setEmail('');
      }
   };

   // Use categories directly from backend - no duplication
   const categories = storeConfig.categories || [];

   // Use products directly from backend - no duplication, filter out inactive/deleted
   const products = filterActiveProducts(storeConfig.products || []);

   const targetRef = useRef(null);
   const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start start", "end start"]
   });

   const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
   const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

   // Helper for category icons
   const getCategoryIcon = (slug: string) => {
      if (slug.includes('phone')) return <Smartphone className="h-6 w-6" />;
      if (slug.includes('laptop') || slug.includes('computer')) return <Laptop className="h-6 w-6" />;
      if (slug.includes('audio') || slug.includes('headphone')) return <Headphones className="h-6 w-6" />;
      if (slug.includes('watch') || slug.includes('wearable')) return <Watch className="h-6 w-6" />;
      if (slug.includes('camera')) return <Camera className="h-6 w-6" />;
      return <Zap className="h-6 w-6" />;
   };

   return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">

         <ElectronicsStoreHeader storeConfig={storeConfig} />

         {/* Hero Section - Dark Mode Tech Theme */}
         {layout?.hero?.show !== false && (
            <section ref={targetRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-950">
               {/* Animated Background */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
                  <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
                  <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px]" />
               </div>

               <div className="container mx-auto px-6 relative z-10 py-20">
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                     <motion.div
                        style={{ opacity, scale }}
                        className="space-y-8 relative z-20"
                     >
                        {layout?.hero?.showBadges !== false && (
                           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                              {getLayoutText(storeConfig, 'electronics.newArrivals', 'Next Gen • 2025 Series')}
                           </div>
                        )}

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                           {getLayoutText(storeConfig, 'hero.title', 'Future Realized')} <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                              Realized.
                           </span>
                        </h1>

                        <div className="lg:hidden w-full max-w-[300px] mx-auto py-8">
                           <div className="relative aspect-square bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/30">
                              <ImageWithFallback
                                 src={products[0]?.images?.[0]}
                                 alt="Hero Product"
                                 className="w-full h-full object-contain drop-shadow-2xl"
                                 skeletonAspectRatio="square"
                              />
                           </div>
                        </div>

                        <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-medium">
                           {storeConfig.description} Experience the pinnacle of engineering with our curated collection of premium electronics.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                           {layout?.hero?.showCTA !== false && (
                              <Link href={`/${storeConfig.slug}/products`}>
                                 <Button className="h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] border-0 ring-0">
                                    {getLayoutText(storeConfig, 'common.shopNow', 'Shop Now')} <ArrowRight className="ml-2 h-5 w-5" />
                                 </Button>
                              </Link>
                           )}
                           {layout?.sections?.featuredProducts?.show !== false && (
                              <div className="flex items-center gap-4 text-slate-400 text-sm font-medium ml-4">
                                 <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                       <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs text-white">
                                          <span className="sr-only">User</span>
                                       </div>
                                    ))}
                                 </div>
                                 <div>
                                    <p className="text-white font-bold">{getLayoutText(storeConfig, 'common.account', '10k+ Happy')}</p>
                                    <p>{getLayoutText(storeConfig, 'common.account', 'Customers')}</p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </motion.div>

                     <div className="relative h-[600px] hidden lg:block perspective-1000">
                        <motion.div
                           initial={{ opacity: 0, x: 100, rotateY: -20 }}
                           animate={{ opacity: 1, x: 0, rotateY: 0 }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className="relative z-10 w-full h-full"
                        >
                           {/* Main Hero Image/Card */}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-700/50 p-8 shadow-2xl shadow-blue-900/20 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700">
                              <div className="absolute top-8 right-8">
                                 <Zap className="text-blue-500 w-8 h-8" />
                              </div>
                              <ImageWithFallback
                                 src={products[0]?.images?.[0]}
                                 alt="Hero Product"
                                 className="w-full h-3/4 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                 skeletonAspectRatio="square"
                              />
                              <div className="absolute bottom-8 left-8 right-8">
                                 <div className="flex justify-between items-end">
                                    <div>
                                       <p className="text-blue-400 font-bold text-sm mb-1">New Arrival</p>
                                       <h3 className="text-white text-2xl font-bold">{products[0]?.name}</h3>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-white text-2xl font-bold">{formatCurrency(products[0]?.price || 0, products[0]?.currency || storeConfig?.settings?.currency || 'USD')}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Floating Elements */}
                           <motion.div
                              animate={{ y: [0, -20, 0] }}
                              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                              className="absolute top-20 right-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="bg-green-500/20 p-2 rounded-lg">
                                    <Battery className="text-green-400 w-5 h-5" />
                                 </div>
                                 <div>
                                    <p className="text-xs text-slate-400">Battery Life</p>
                                    <p className="text-sm font-bold text-white">24 Hours</p>
                                 </div>
                              </div>
                           </motion.div>

                           <motion.div
                              animate={{ y: [0, 20, 0] }}
                              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                              className="absolute bottom-40 left-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <Wifi className="text-blue-400 w-5 h-5" />
                                 </div>
                                 <div>
                                    <p className="text-xs text-slate-400">Connectivity</p>
                                    <p className="text-sm font-bold text-white">5G Ultra</p>
                                 </div>
                              </div>
                           </motion.div>
                        </motion.div>
                     </div>
                  </div>
               </div>
            </section>
         )}

         {/* Brands Ticker */}
         {layout?.sections?.brands?.show !== false && (
            <div className="bg-slate-950 border-y border-slate-900 overflow-hidden py-10">
               <div className="flex gap-16 items-center animate-scroll whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity duration-300">
                  {[...Array(2)].map((_, i) => (
                     <div key={i} className="flex gap-16 items-center">
                        {['SONY', 'SAMSUNG', 'APPLE', 'DELL', 'LG', 'ASUS', 'HP', 'BOSE', 'CANON', 'NIKON'].map((brand) => (
                           <span key={brand} className="text-3xl font-black text-slate-800 tracking-tight hover:text-slate-600 transition-colors cursor-default select-none">{brand}</span>
                        ))}
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Bento Grid Categories */}
         {layout?.sections?.categories?.show !== false && (
            <section className="py-16 md:py-32 bg-slate-50">
               <div className="container mx-auto px-6">
                  <div className="flex justify-between items-end mb-10 md:mb-16">
                     <div>
                        <h2 className="text-4xl font-bold mb-4 text-slate-900 tracking-tight">Ecosystems</h2>
                        <p className="text-lg text-slate-500">Curated collections for every aspect of your digital life.</p>
                     </div>
                     {layout?.sections?.categories?.showViewAll !== false && (
                        <Link href={`/${storeConfig.slug}/categories`} className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                           View All <ArrowRight className="h-5 w-5" />
                        </Link>
                     )}
                  </div>

                  {categories.length === 0 ? (
                     <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No categories available</h3>
                        <p className="text-slate-500">Categories will appear here once they are added to the store.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                        {categories.slice(0, layout?.sections?.categories?.limit || 5).map((category, idx) => {
                           const isLarge = idx === 0 || idx === 3;
                           return (
                              <Link
                                 key={idx}
                                 href={`/${storeConfig.slug}/categories/${category.slug}`}
                                 className={`group relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
                              >
                                 <ImageWithFallback
                                    src={category.image}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    skeletonAspectRatio="auto"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                 <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className="mb-3 text-white/80 group-hover:text-blue-400 transition-colors">
                                       {getCategoryIcon(category.slug)}
                                    </div>
                                    <h3 className={`font-bold text-white mb-2 ${isLarge ? 'text-3xl' : 'text-xl'}`}>{category.name}</h3>
                                    <div className="w-10 h-1 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                                 </div>
                              </Link>
                           );
                        })}
                     </div>
                  )}
               </div>
            </section>
         )}

         {/* Featured Products - Horizontal Snap Scroll */}
         {layout?.sections?.featuredProducts?.show !== false && (
            <section className="py-16 md:py-32 bg-white relative overflow-hidden">
               <div className="container mx-auto px-6 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-6">
                     <div className="max-w-2xl">
                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3 block">Latest Drops</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                           {layout?.sections?.featuredProducts?.title || "Performance Redefined"}
                        </h2>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full border-slate-200 hover:bg-slate-100 hover:text-slate-900">
                           <ArrowRight className="h-5 w-5 rotate-180" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full border-slate-200 hover:bg-slate-100 hover:text-slate-900">
                           <ArrowRight className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>

                  <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 -mx-6 px-6 scrollbar-hide">
                     {products.map((product) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center group">
                           <div className="relative aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden mb-6 border border-slate-100">
                              <div className="absolute top-4 left-4 z-20">
                                 {product.compareAtPrice && (
                                    <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">SALE</span>
                                 )}
                              </div>
                              {layout?.sections?.featuredProducts?.showAddToCart !== false && (
                                 <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" onClick={(e) => handleAddToCart(e, product)} className="rounded-full bg-white text-slate-900 hover:bg-blue-600 hover:text-white shadow-lg">
                                       <ShoppingCart className="h-4 w-4" />
                                    </Button>
                                 </div>
                              )}

                              <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-white to-slate-50">
                                 <ImageWithFallback
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    skeletonAspectRatio="square"
                                 />
                              </div>
                           </div>

                           <div className="space-y-1 px-2">
                              <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-blue-600 transition-colors">{product.name}</h3>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-slate-900 font-bold">{formatCurrency(product.price, product.currency || 'USD')}</span>
                                 {product.compareAtPrice && <span className="text-slate-400 text-sm line-through">{formatCurrency(product.compareAtPrice, product.currency || 'USD')}</span>}
                              </div>
                           </div>
                           <Link href={`/${storeConfig.slug}/products/${product.slug}`} className="absolute inset-0 z-10" />
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {/* Tech Features */}
         {layout?.features?.show !== false && (
            <section className="py-16 md:py-32 bg-slate-950 text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

               <div className="container mx-auto px-6 relative z-10">
                  <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                     {[
                        { icon: Cpu, title: "Neural Processing", desc: "Advanced AI capabilities built into every device for smarter performance." },
                        { icon: Shield, title: "Military Grade", desc: "Tested against rigorous standards to ensure durability in any environment." },
                        { icon: Zap, title: "Hyper Charge", desc: "Next-generation battery technology for all-day power in minutes." }
                     ].map((feature, i) => (
                        <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-[2rem] hover:bg-slate-800/50 transition-colors">
                           <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-6 text-blue-400">
                              {layout?.features?.showIcons !== false && <feature.icon className="h-7 w-7" />}
                           </div>
                           <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                           <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {/* Newsletter */}
         {layout?.sections?.marketing?.showNewsletter !== false && (
            <section className="py-16 md:py-32 bg-white">
               <div className="container mx-auto px-6">
                  <div className="bg-blue-600 rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
                     <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                     <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Stay Ahead of the Curve</h2>
                        <p className="text-blue-100 text-lg">Join our exclusive community for early access to drops and special offers.</p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                           <input
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="flex-1 h-14 px-6 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:bg-white/20 focus:border-white transition-all backdrop-blur-md"
                           />
                           <Button onClick={handleSubscribe} className="h-14 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg shadow-xl">
                              Subscribe
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         )}

         {/* Promotional Banner */}
         <PromoBanner config={layout?.sections?.promoBanner} layoutStyle="electronics" />

         <ElectronicsStoreFooter storeConfig={storeConfig} />

      </div>
   );
}

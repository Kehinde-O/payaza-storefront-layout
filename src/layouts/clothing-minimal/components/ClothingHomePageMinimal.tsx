'use client';

import { StoreConfig, StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { CheckoutButton } from '@/components/ui/checkout-button';
import { useStore } from '@/lib/store-context';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useToast } from '@/components/ui/toast';
import { Search, ShoppingBag, Menu, ArrowUpRight, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatCurrency, filterActiveProducts } from '@/lib/utils';
import { getLayoutText, getBannerImage, getTextContent, getLogoUrl } from '../../../lib/utils/asset-helpers';
import { StoreLogo } from '../../../components/ui/store-logos';
import { PromoBanner } from '../../shared/components/PromoBanner';

interface ClothingHomePageMinimalProps {
   storeConfig: StoreConfig;
}

export function ClothingHomePageMinimal({ storeConfig }: ClothingHomePageMinimalProps) {
   const layoutConfig = storeConfig.layoutConfig;
   const categories = storeConfig.categories || [];
   const products = filterActiveProducts(storeConfig.products || []);

   const { cart, addToCart, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, cartTotal, cartCount } = useStore();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isClient, setIsClient] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const { addToast } = useToast();

   useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setIsClient(true);
   }, []);

   const handleAddToCart = (product: StoreProduct) => {
      addToCart(product);
      addToast(`${product.name} added to cart`, 'success');
   };

   return (
      <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
         {/* Centered Minimal Header */}
         <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-sm transition-all duration-300 border-b border-transparent hover:border-gray-100">
            <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="hover:bg-gray-100 rounded-full">
                     <Menu className="h-5 w-5" />
                  </Button>
                  {storeConfig.features.search && (
                     <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:flex hover:bg-gray-100 rounded-full">
                        <Search className="h-5 w-5" />
                     </Button>
                  )}
               </div>

               {/* Only show store name if no custom logo is present */}
               {!getLogoUrl(storeConfig) && (
                  <Link href={`/${storeConfig.slug}`} className="text-xl md:text-2xl font-bold tracking-tight absolute left-1/2 -translate-x-1/2 uppercase whitespace-nowrap">
                     {storeConfig.name}
                  </Link>
               )}
               {/* Show logo if available */}
               {getLogoUrl(storeConfig) && (
                  <Link href={`/${storeConfig.slug}`} className="absolute left-1/2 -translate-x-1/2">
                     <StoreLogo
                        storeConfig={storeConfig}
                        className="h-10 w-10 transition-all duration-300 hover:opacity-90"
                        alt={storeConfig.name}
                     />
                  </Link>
               )}

               <div className="flex items-center gap-6">
                  <Link href={`/${storeConfig.slug}/account`} className="hidden md:block text-sm font-medium hover:text-gray-600">{getLayoutText(storeConfig, 'common.account', 'Account')}</Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative hover:bg-gray-100 rounded-full">
                     <ShoppingBag className="h-5 w-5" />
                     {isClient && cartCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 bg-black rounded-full animate-pulse" />
                     )}
                  </Button>
               </div>
            </div>
         </header>

         {/* Search Overlay */}
         {isSearchOpen && storeConfig.features.search && (
            <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md pt-20">
               <div className="container mx-auto px-4 md:px-8">
                  <div className="relative max-w-2xl mx-auto">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder={getLayoutText(storeConfig, 'header.searchPlaceholder', 'Search products...')}
                        autoFocus
                        className="w-full pl-12 pr-4 py-4 text-lg border-b-2 border-black focus:outline-none"
                        onBlur={() => setIsSearchOpen(false)}
                     />
                  </div>
               </div>
            </div>
         )}

         {/* Hero Section - Split Layout */}
         <section className="pt-20 lg:h-screen h-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
               <div className="relative bg-[#F4F4F4] flex flex-col justify-center px-12 md:px-24 lg:order-1 order-2 py-20 lg:py-0">
                  <div className="space-y-6 md:space-y-8 max-w-lg animate-fade-in-up">
                     <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{getTextContent(storeConfig, 'hero_badge', 'New Collection 2024')}</span>
                     <h1 className="text-4xl md:text-7xl font-light tracking-tight leading-[1.1]">
                        {(() => {
                           const titleText = getLayoutText(storeConfig, 'hero.title', 'Simplicity is the ultimate sophistication.');
                           // If title contains "sophistication", preserve the italic styling
                           if (titleText.includes('sophistication')) {
                              const parts = titleText.split('sophistication');
                              return (
                                 <>
                                    {parts[0]}
                                    <span className="font-serif italic">sophistication</span>
                                    {parts[1]}
                                 </>
                              );
                           }
                           return titleText;
                        })()}
                     </h1>
                     <p className="text-gray-600 text-lg leading-relaxed">
                        {getLayoutText(storeConfig, 'hero.subtitle', storeConfig.description ? `${storeConfig.description} Discover our latest arrivals, crafted for the modern individual who values quality and timeless design.` : 'Discover our latest arrivals, crafted for the modern individual who values quality and timeless design.')}
                     </p>
                     <div className="pt-4">
                        <Link href={`/${storeConfig.slug}/products`}>
                           <Button className="h-14 px-10 rounded-full bg-black text-white hover:bg-gray-800 text-base transition-all hover:scale-105">
                              {getLayoutText(storeConfig, 'common.shopNow', 'Shop Collection')}
                           </Button>
                        </Link>
                     </div>
                  </div>
               </div>
               <div className="relative h-[60vh] lg:h-full w-full lg:order-2 order-1 overflow-hidden group">
                  <ImageWithFallback
                     src={getBannerImage(storeConfig, 'hero_main', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1887&auto=format&fit=crop')}
                     alt="Minimal Fashion"
                     className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s]"
                  />
                  <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-4 rounded-lg hidden md:block">
                     <p className="text-xs font-bold uppercase tracking-wider mb-1">Featured Look</p>
                     <p className="text-sm text-gray-600">Linen Blend Blazer - $299</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Featured Categories - Clean Grid */}
         <section className="py-16 md:py-24 px-4 md:px-8">
            <div className="container mx-auto">
               <div className="flex justify-between items-end mb-8 md:mb-12">
                  <h2 className="text-3xl font-light">{getLayoutText(storeConfig, 'sections.categories.title', 'Categories')}</h2>
                  <Link href={`/${storeConfig.slug}/categories`} className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                     {getLayoutText(storeConfig, 'sections.categories.viewAll', 'View All')}
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {categories.slice(0, 3).map((category, idx) => (
                     <Link key={category.id} href={`/${storeConfig.slug}/categories/${category.slug}`} className="group block cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F4F4] mb-4">
                           <ImageWithFallback
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              skeletonAspectRatio="3/4"
                           />
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                           <div className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              <ArrowUpRight className="h-5 w-5" />
                           </div>
                        </div>
                        <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-500">{12 + idx * 5} Items</p>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* Essentials / Products Scroll */}
         <section className="py-16 md:py-24 bg-[#FAFAFA]">
            <div className="container mx-auto px-4 md:px-8">
               <div className="max-w-2xl mx-auto text-center mb-10 md:mb-16">
                  <h2 className="text-3xl md:text-4xl font-light mb-4">The Essentials</h2>
                  <p className="text-gray-500">Timeless pieces designed to build the foundation of your wardrobe.</p>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-8">
                  {products.slice(0, 4).map((product) => (
                     <div key={product.id} className="group">
                        <Link href={`/${storeConfig.slug}/products/${product.slug}`}>
                           <div className="aspect-[3/4] bg-white overflow-hidden relative mb-4">
                              <ImageWithFallback
                                 src={product.images[0]}
                                 alt={product.name}
                                 className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                 skeletonAspectRatio="3/4"
                              />

                              {/* Quick View / Add Overlay - Desktop */}
                              <div className="hidden lg:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity items-end justify-center pb-6">
                                 <button
                                    onClick={(e) => {
                                       e.preventDefault();
                                       handleAddToCart(product);
                                    }}
                                    className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
                                 >
                                    Quick Add
                                 </button>
                              </div>

                              {/* Mobile Quick Add */}
                              <button
                                 onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                 }}
                                 className="lg:hidden absolute bottom-3 right-3 bg-white text-black h-10 w-10 flex items-center justify-center rounded-full shadow-lg z-10 active:scale-95 transition-transform"
                              >
                                 <Plus className="h-5 w-5" />
                              </button>

                              {product.compareAtPrice && (
                                 <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-1">{getLayoutText(storeConfig, 'common.sale', 'Sale')}</span>
                              )}
                           </div>
                           <div className="flex justify-between items-start">
                              <div>
                                 <h3 className="font-medium text-base mb-1 group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
                                 <div className="flex gap-2 mb-2">
                                    {['#D4D4D4', '#171717', '#737373'].map((color, i) => (
                                       <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                                    ))}
                                 </div>
                              </div>
                              <span className="font-medium text-sm">{formatCurrency(product.price, product.currency || 'USD')}</span>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Shop the Look - Interactive */}
         <section className="py-16 md:py-24 px-4 md:px-8 border-t border-gray-100">
            <div className="container mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                  <div className="relative aspect-[4/5] bg-gray-100 group overflow-hidden">
                     <ImageWithFallback
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                        alt="Shop the look"
                        className="w-full h-full object-cover"
                     />
                     {/* Hotspots */}
                     <div className="absolute top-[30%] left-[45%] group/spot">
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse cursor-pointer relative z-10 hover:scale-125 transition-transform" />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded shadow-lg w-48 opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none group-hover/spot:pointer-events-auto">
                           <p className="font-bold text-xs mb-1">Oversized Wool Coat</p>
                           <p className="text-xs text-gray-500">$299.00</p>
                        </div>
                     </div>
                     <div className="absolute bottom-[25%] right-[40%] group/spot">
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse cursor-pointer relative z-10 hover:scale-125 transition-transform" />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded shadow-lg w-48 opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none group-hover/spot:pointer-events-auto">
                           <p className="font-bold text-xs mb-1">Leather Ankle Boots</p>
                           <p className="text-xs text-gray-500">$189.00</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h2 className="text-4xl font-light">Winter <span className="font-serif italic">Layering</span></h2>
                     <p className="text-gray-600 leading-relaxed max-w-md">
                        Master the art of layering with our winter collection. Combining warmth with style, these pieces are designed to work together seamlessly.
                     </p>

                     <div className="space-y-4">
                        {products.slice(0, 3).map((item, i) => (
                           <div key={i} className="flex gap-4 items-center p-2 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer">
                              <div className="w-16 h-20 bg-white relative">
                                 <ImageWithFallback src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                                 <p className="text-xs text-gray-500">{formatCurrency(item.price, item.currency || storeConfig.settings?.currency || 'USD')}</p>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleAddToCart(item)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Plus className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>

                     <Link href={`/${storeConfig.slug}/products`}>
                        <Button className="w-full bg-black text-white hover:bg-gray-800 h-12 rounded-none uppercase tracking-widest text-xs font-bold">
                           {getLayoutText(storeConfig, 'common.shopNow', 'Shop The Edit')}
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>
         </section>

         {/* Footer Minimal */}
         <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-4 md:px-8">
            <div className="container mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="md:col-span-1">
                     <Link href={`/${storeConfig.slug}`} className="text-xl font-bold uppercase tracking-tight block mb-6">
                        {storeConfig.name}
                     </Link>
                     <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Quality materials, ethical production, and timeless design. Made for the modern world.
                     </p>
                  </div>

                  <div>
                     <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Shop</h4>
                     <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link href={`/${storeConfig.slug}/products`} className="hover:text-black transition-colors">New Arrivals</Link></li>
                        <li><Link href={`/${storeConfig.slug}/products`} className="hover:text-black transition-colors">Clothing</Link></li>
                        <li><Link href={`/${storeConfig.slug}/categories`} className="hover:text-black transition-colors">Accessories</Link></li>
                        <li><Link href={`/${storeConfig.slug}/products`} className="hover:text-black transition-colors">Sale</Link></li>
                     </ul>
                  </div>

                  <div>
                     <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Support</h4>
                     <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link href={`/${storeConfig.slug}/help-center`} className="hover:text-black transition-colors">FAQ</Link></li>
                        <li><Link href={`/${storeConfig.slug}/shipping-returns`} className="hover:text-black transition-colors">Shipping & Returns</Link></li>
                        <li><Link href={`/${storeConfig.slug}/style-guide`} className="hover:text-black transition-colors">Size Guide</Link></li>
                        <li><Link href={`/${storeConfig.slug}/contact`} className="hover:text-black transition-colors">Contact Us</Link></li>
                     </ul>
                  </div>

                  <div>
                     <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Newsletter</h4>
                     <p className="text-sm text-gray-500 mb-4">Subscribe to receive news and updates.</p>
                     <div className="flex border-b border-gray-300 focus-within:border-black transition-colors pb-2">
                        <input type="email" placeholder="Email Address" className="w-full outline-none text-sm placeholder:text-gray-400" />
                        <button className="text-xs font-bold uppercase hover:opacity-70">Submit</button>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-8">
                  <p>&copy; 2024 {storeConfig.name}.</p>
                  {storeConfig.branding.socialMedia && (
                     <div className="flex gap-6 mt-4 md:mt-0">
                        {storeConfig.branding.socialMedia.instagram && (
                           <a href={storeConfig.branding.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black">Instagram</a>
                        )}
                        {storeConfig.branding.socialMedia.pinterest && (
                           <a href={storeConfig.branding.socialMedia.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-black">Pinterest</a>
                        )}
                        {storeConfig.branding.socialMedia.twitter && (
                           <a href={storeConfig.branding.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-black">Twitter</a>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </footer>

         {/* Cart Sheet */}
         <Sheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title={`Shopping Bag (${cartCount})`} side="right">
            {cart.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag className="h-12 w-12 text-gray-300" />
                  <p className="text-gray-500">{getLayoutText(storeConfig, 'header.cartEmpty', 'Your bag is empty.')}</p>
                  <Button onClick={() => setIsCartOpen(false)} variant="outline" className="mt-4">
                     {getLayoutText(storeConfig, 'common.continueShopping', 'Continue Shopping')}
                  </Button>
               </div>
            ) : (
               <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto py-4 space-y-6">
                     {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                           <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden relative">
                              <ImageWithFallback src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 flex flex-col justify-between">
                              <div>
                                 <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                                 <p className="text-gray-500 text-xs mt-1">{item.variantName}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center border border-gray-200 rounded-full">
                                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 rounded-full"><Minus className="h-3 w-3" /></button>
                                    <span className="text-xs font-medium px-2">{item.quantity}</span>
                                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded-full"><Plus className="h-3 w-3" /></button>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity, item.product?.currency || storeConfig.settings?.currency || 'USD')}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="border-t pt-4 space-y-4">
                     <div className="flex justify-between font-medium text-lg">
                        <span>Subtotal</span>
                        <span>{formatCurrency(cartTotal, storeConfig.settings?.currency || 'USD')}</span>
                     </div>
                     <p className="text-xs text-gray-500 text-center">Shipping and taxes calculated at checkout.</p>
                     <CheckoutButton
                        storeConfig={storeConfig}
                        className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-full font-bold"
                     />
                  </div>
               </div>
            )}
         </Sheet>

         {/* Menu Sheet */}
         <Sheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menu" side="left">
            <div className="pt-4 pb-6">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search..."
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                  />
               </div>
            </div>
            <nav className="flex flex-col space-y-6 text-lg font-medium">
               <Link href={`/${storeConfig.slug}/products`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500">Shop All</Link>
               <Link href={`/${storeConfig.slug}/categories`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500">Categories</Link>
               <div className="h-px bg-gray-100 my-2" />
               <Link href={`/${storeConfig.slug}/about`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500 text-base font-normal">Our Story</Link>
               <Link href={`/${storeConfig.slug}/contact`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500 text-base font-normal">Contact</Link>
               <div className="mt-auto pt-12 text-sm font-normal text-gray-500">
                  <p>Sign in</p>
                  <p className="mt-2">Create Account</p>
               </div>
            </nav>
         </Sheet>

         {/* Promotional Banner */}
         <PromoBanner config={layoutConfig?.sections?.promoBanner} layoutStyle="clothing" />
      </div>
   );
}

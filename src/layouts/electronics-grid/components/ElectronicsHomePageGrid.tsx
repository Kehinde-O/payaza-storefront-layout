'use client';

import { StoreConfig, StoreProduct, StoreCategory } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { CheckoutButton } from '@/components/ui/checkout-button';
import { CategoryTree } from '@/components/ui/category-tree';
import { useStore } from '@/lib/store-context';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useToast } from '@/components/ui/toast';
import { ShoppingCart, Star, Heart, Menu, Search, User, Smartphone, ChevronRight, ChevronDown, Grid, CheckCircle2, Package, Tag, Filter, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatCurrency, cn, filterActiveProducts } from '@/lib/utils';
import { getLayoutText, getBannerImage, getLogoUrl } from '../../../lib/utils/asset-helpers';
import { StoreLogo } from '../../../components/ui/store-logos';
import { PromoBanner } from '../../shared/components/PromoBanner';

import { ElectronicsGridProductCard } from './ElectronicsGridProductCard';

interface ElectronicsHomePageGridProps {
   storeConfig: StoreConfig;
}

const ElectronicsFilterContent = ({ categories, storeSlug }: { categories: StoreCategory[], storeSlug: string }) => (
   <div className="space-y-6">
      {/* Category Tree */}
      <div className="bg-white border-b border-gray-100 overflow-hidden">
         <div className="bg-white px-4 py-3 border-b border-gray-100 font-normal text-sm text-gray-900 flex justify-between items-center">
            Browse by <ChevronDown className="h-4 w-4 text-gray-400" />
         </div>
         <div className="py-2">
            <CategoryTree
               categories={categories}
               mode="link"
               storeSlug={storeSlug}
               linkBasePath=""
            />
         </div>
      </div>

      {/* Filters Block */}
      <div className="bg-white p-6 space-y-8">
         <div>
            <h3 className="font-medium text-sm text-gray-900 mb-4">Availability</h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 p-2 -ml-2 transition-colors">
               <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-400" defaultChecked />
               In Stock
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 p-2 -ml-2 transition-colors mt-2">
               <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-400" />
               On Sale
            </label>
         </div>

         <div className="border-t border-gray-100 pt-6">
            <h3 className="font-medium text-sm text-gray-900 mb-4">Price</h3>
            <div className="flex items-center gap-2 mb-3">
               <div className="relative flex-1">
                  <span className="absolute left-2 top-1.5 text-gray-400 text-xs">$</span>
                  <input type="number" className="w-full pl-5 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400" placeholder="Min" />
               </div>
               <span className="text-gray-400">-</span>
               <div className="relative flex-1">
                  <span className="absolute left-2 top-1.5 text-gray-400 text-xs">$</span>
                  <input type="number" className="w-full pl-5 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400" placeholder="Max" />
               </div>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs font-normal border-gray-300 text-gray-700 hover:bg-gray-50">Apply Price</Button>
         </div>

         <div className="border-t border-gray-100 pt-6">
            <h3 className="font-medium text-sm text-gray-900 mb-4">Brands</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
               {['Apple'].map(brand => (
                  <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 p-2 -ml-2 transition-colors">
                     <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-400" defaultChecked />
                     {brand}
                  </label>
               ))}
            </div>
         </div>

         <div className="border-t border-gray-100 pt-6">
            <h3 className="font-medium text-sm text-gray-900 mb-4">Rating</h3>
            {[4, 3, 2].map(stars => (
               <label key={stars} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 p-2 -ml-2 transition-colors mb-1.5">
                  <input type="radio" name="rating" className="border-gray-300 text-gray-900 focus:ring-gray-400" />
                  <div className="flex text-yellow-400">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < stars ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                     ))}
                  </div>
                  <span className="text-xs">& Up</span>
               </label>
            ))}
         </div>
      </div>
   </div>
);

export function ElectronicsHomePageGrid({ storeConfig }: ElectronicsHomePageGridProps) {
   const layoutConfig = storeConfig.layoutConfig;
   const categories = storeConfig.categories || [];
   const products = filterActiveProducts(storeConfig.products || []);

   const { cart, addToCart, updateCartQuantity, isCartOpen, setIsCartOpen, cartTotal, cartCount, wishlist } = useStore();
   const wishlistCount = wishlist.length;
   const [searchQuery, setSearchQuery] = useState('');
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const { addToast } = useToast();

   // Pagination / Load More state
   const INITIAL_DISPLAY_COUNT = 12;
   const LOAD_MORE_INCREMENT = 12;
   const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);

   const handleAddToCart = (product: StoreProduct) => {
      addToCart(product);
      addToast(`${product.name} added to cart`, 'success');
   };

   const filteredProducts = searchQuery
      ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : products;

   const [isFilterOpen, setIsFilterOpen] = useState(false);

   return (
      <div className="min-h-screen font-sans text-gray-900 bg-white">

         {/* Top Bar - Clean & Minimal */}
         <div className="bg-white text-gray-500 text-xs font-normal py-3 px-4 md:px-8 border-b border-gray-100/50">
            <div className="container mx-auto flex justify-between items-center">
               <div className="hidden md:flex gap-8">
                  <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5 text-gray-400" /> Free Express Shipping Nationwide</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-gray-400" /> Authentic Apple Products</span>
               </div>
               <div className="flex gap-6 ml-auto">
                  <Link href={`/${storeConfig.slug}/track-order`} className="hover:text-gray-900 transition-colors">Track Order</Link>
                  <Link href={`/${storeConfig.slug}/contact`} className="hover:text-gray-900 transition-colors">Business Direct</Link>
                  <Link href={`/${storeConfig.slug}/help-center`} className="hover:text-gray-900 transition-colors">Support</Link>
               </div>
            </div>
         </div>

         {/* Main Header - Clean Apple Style */}
         <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center gap-8">

               {/* Logo */}
               <Link href={`/${storeConfig.slug}`} className="flex flex-col leading-none shrink-0 group">
                  {/* Show logo if available, otherwise show store name */}
                  {getLogoUrl(storeConfig) ? (
                     <StoreLogo
                        storeConfig={storeConfig}
                        className="h-10 w-10 transition-all duration-300 hover:opacity-90"
                        alt={storeConfig.name}
                     />
                  ) : (
                     <>
                        <span className="text-xl font-medium tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">{storeConfig.name}</span>
                        <span className="text-[9px] font-normal tracking-wide text-gray-400 mt-0.5">Premium Apple Products</span>
                     </>
                  )}
               </Link>

               {/* Search Bar - Professional & Wide */}
               <div className="hidden md:flex flex-1 max-w-3xl relative">
                  <div className="relative w-full flex">
                     <div className="relative flex-1">
                        <input
                           type="text"
                           placeholder="Search by keyword, model number, or SKU..."
                           value={searchQuery}
                           onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setVisibleCount(INITIAL_DISPLAY_COUNT);
                           }}
                           className="w-full h-10 pl-4 pr-12 rounded-l-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
                        />
                     </div>
                     <button className="h-10 px-6 bg-gray-900 hover:bg-gray-800 text-white font-normal text-sm rounded-r-lg border border-gray-900 border-l-0 transition-colors flex items-center gap-2">
                        <Search className="h-4 w-4" /> Search
                     </button>
                  </div>
               </div>

               {/* Right Actions */}
               <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 text-slate-600" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                     {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
                  </Button>

                  <Link href={`/${storeConfig.slug}/account`}>
                     <Button variant="ghost" className="hidden sm:flex flex-col items-center justify-center h-auto py-1 px-2 text-gray-500 hover:text-gray-900 hover:bg-transparent gap-0.5 transition-colors">
                        <User className="h-5 w-5" />
                        <span className="text-[10px] font-normal">Account</span>
                     </Button>
                  </Link>
                  {storeConfig.features.wishlist && (
                     <Link href={`/${storeConfig.slug}/wishlist`}>
                        <Button variant="ghost" className="hidden sm:flex flex-col items-center justify-center h-auto py-1 px-2 text-gray-500 hover:text-gray-900 hover:bg-transparent gap-0.5 relative">
                           <div className="relative">
                              <Heart className={cn(
                                 "h-5 w-5 transition-all",
                                 wishlistCount > 0 && "fill-current text-red-500"
                              )} />
                              {wishlistCount > 0 && (
                                 <span className="absolute -top-1 -right-1 h-3.5 w-3.5 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-white"
                                    style={{ backgroundColor: storeConfig.branding.primaryColor || '#ef4444' }}
                                 >
                                    {wishlistCount > 9 ? '9+' : wishlistCount}
                                 </span>
                              )}
                           </div>
                           <span className="text-[10px] font-normal">Saved</span>
                        </Button>
                     </Link>
                  )}
                  <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />
                  <Button
                     className="relative bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-normal h-10 px-4 rounded-lg flex items-center gap-2 transition-colors"
                     onClick={() => setIsCartOpen(true)}
                  >
                     <ShoppingCart className="h-4 w-4 text-gray-600" />
                     <span className="text-sm">{cartCount}</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="md:hidden h-10 w-10" onClick={() => setIsMobileMenuOpen(true)}>
                     <Menu className="h-6 w-6" />
                  </Button>
               </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
               <div className="md:hidden p-4 bg-white border-b border-gray-200 animate-in slide-in-from-top-2 absolute w-full top-20 z-40 shadow-lg">
                  <div className="relative">
                     <input
                        type="text"
                        placeholder="Search by keyword..."
                        value={searchQuery}
                        onChange={(e) => {
                           setSearchQuery(e.target.value);
                           setVisibleCount(INITIAL_DISPLAY_COUNT);
                        }}
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 text-base"
                        autoFocus
                     />
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
               </div>
            )}

            {/* Secondary Nav / Categories Bar - Clean */}
            <div className="hidden md:block bg-white border-b border-gray-100/50">
               <div className="container mx-auto px-6 h-12 flex items-center gap-8 text-sm font-normal text-gray-600">
                  {categories.slice(0, 8).map(cat => (
                     <Link key={cat.id} href={`/${storeConfig.slug}/categories/${cat.slug}`} className="hover:text-gray-900 transition-colors py-1">
                        {cat.name}
                     </Link>
                  ))}
                  <Link href={`/${storeConfig.slug}/products?sale=true`} className="ml-auto flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                     <Tag className="h-3.5 w-3.5" /> Special Offers
                  </Link>
               </div>
            </div>
         </header>

         {/* Main Content */}
         <main className="container mx-auto px-4 md:px-6 py-6">

            {/* Breadcrumbs (Visual) */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
               <Link href={`/${storeConfig.slug}`} className="hover:text-black transition-colors">Home</Link>
               <ChevronRight className="h-3 w-3" />
               <span className="font-semibold text-gray-900">Apple Products</span>
            </div>

            {/* Layout: Sidebar + Grid */}
            <div className="flex flex-col lg:flex-row gap-6">

               {/* Professional Sidebar Filters */}
               <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6 sticky top-32 self-start h-fit z-30">
                  <ElectronicsFilterContent categories={categories} storeSlug={storeConfig.slug} />
               </aside>

               {/* Product Grid Area */}
               <div className="flex-1">

                  {/* Banner inside Grid Area - Clean Apple Style with Background */}
                  {(() => {
                     const bannerImage = getBannerImage(
                        storeConfig,
                        'sale_banner',
                        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=400&fit=crop&q=80'
                     );

                     // Get banner text from backend - check multiple sources
                     // Priority: 1. sections.marketing.promoBanner, 2. text.sections.marketing.promoBanner, 3. generic layout text, 4. layout requirements defaults
                     const promoBanner = storeConfig.layoutConfig?.sections?.marketing?.promoBanner;
                     const promoBannerText = storeConfig.layoutConfig?.text?.sections?.marketing?.promoBanner;

                     // Fallback values match layout config defaults
                     const defaultTitle = 'New Arrivals';
                     const defaultSubtitle = 'Discover the latest products. Authentic. Authorized. Exclusive.';
                     const defaultButtonText = 'Shop Now';

                     const bannerTitle =
                        promoBanner?.title ||
                        promoBannerText?.title ||
                        getLayoutText(storeConfig, 'electronics.newArrivals', defaultTitle) ||
                        getLayoutText(storeConfig, 'sections.marketing.promoBanner.title', defaultTitle) ||
                        defaultTitle;

                     const bannerSubtitle =
                        promoBanner?.subtitle ||
                        promoBannerText?.subtitle ||
                        getLayoutText(storeConfig, 'sections.featuredProducts.subtitle', defaultSubtitle) ||
                        getLayoutText(storeConfig, 'sections.marketing.promoBanner.subtitle', defaultSubtitle) ||
                        defaultSubtitle;

                     const bannerButtonText =
                        promoBanner?.buttonText ||
                        promoBannerText?.button ||
                        getLayoutText(storeConfig, 'common.shopNow', defaultButtonText) ||
                        getLayoutText(storeConfig, 'sections.marketing.promoBanner.button', defaultButtonText) ||
                        defaultButtonText;

                     const bannerButtonLink = promoBanner?.buttonLink ||
                        `/${storeConfig.slug}/products`;

                     return (
                        <div className="mb-8 rounded-lg bg-white text-gray-900 py-12 px-6 flex items-center justify-between relative overflow-hidden min-h-[200px]">
                           {/* Background Image */}
                           <div className="absolute inset-0 z-0">
                              <Image
                                 src={bannerImage}
                                 alt={bannerTitle}
                                 fill
                                 className="object-cover"
                                 unoptimized
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
                           </div>

                           {/* Content */}
                           <div className="relative z-10 max-w-2xl">
                              <h2 className="text-4xl font-light mb-4 text-white tracking-tight">{bannerTitle}</h2>
                              <p className="text-gray-200 text-lg mb-8 leading-relaxed font-light">{bannerSubtitle}</p>
                              <Link href={bannerButtonLink}>
                                 <Button size="sm" className="bg-white hover:bg-gray-100 text-gray-900 font-normal border-none transition-colors px-6 py-2.5 text-sm shadow-lg">{bannerButtonText}</Button>
                              </Link>
                           </div>
                        </div>
                     );
                  })()}

                  {/* Toolbar - Clean */}
                  <div className="bg-white py-4 mb-6 flex flex-wrap items-center gap-4 justify-between border-b border-gray-100">
                     <div className="flex items-center gap-6">
                        <span className="text-sm font-normal text-gray-600">{filteredProducts.length} Items</span>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-gray-500 font-normal">Sort:</span>
                           <select className="text-sm border-none bg-transparent font-normal text-gray-900 focus:ring-0 cursor-pointer p-0 pr-6 appearance-none">
                              <option>Best Match</option>
                              <option>Price Low-High</option>
                              <option>Price High-Low</option>
                              <option>Highest Rated</option>
                           </select>
                        </div>
                     </div>

                     <div className="flex items-center gap-2">
                        <Button
                           variant="ghost"
                           size="sm"
                           className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900"
                           onClick={() => setIsFilterOpen(true)}
                        >
                           <Filter className="h-4 w-4" /> Filters
                        </Button>
                     </div>
                  </div>

                  {/* Mobile Filters Sheet */}
                  <Sheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters" side="left">
                     <ElectronicsFilterContent categories={categories} storeSlug={storeConfig.slug} />
                  </Sheet>

                  {/* The Grid - Spacious */}
                  <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                     {filteredProducts.slice(0, visibleCount).map((product, index) => (
                        // Grid View Card - High Density Info
                        <ElectronicsGridProductCard
                           key={product.id}
                           product={product}
                           storeSlug={storeConfig.slug}
                           onAddToCart={handleAddToCart}
                           index={index}
                        />
                     ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < filteredProducts.length && (
                     <div className="mt-16 flex justify-center border-t border-gray-100 pt-12">
                        <Button
                           variant="outline"
                           onClick={() => setVisibleCount(prev => prev + LOAD_MORE_INCREMENT)}
                           className="min-w-[200px] border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-normal transition-colors"
                        >
                           Load More Products
                        </Button>
                     </div>
                  )}
               </div>
            </div>
         </main>

         {/* Footer - Clean Apple Style */}
         <footer className="bg-white border-t border-gray-100 pt-16 pb-12 mt-20">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                  <div className="lg:col-span-1">
                     <div className="mb-6">
                        <span className="text-lg font-medium text-gray-900">{storeConfig.name}</span>
                     </div>
                     <p className="text-sm text-gray-500 leading-relaxed mb-6 font-light">
                        {storeConfig.description || "Nigeria's premier destination for authentic Apple products. Authorized reseller with genuine warranty and exceptional service."}
                     </p>
                     <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400"><Smartphone className="h-4 w-4" /></div>
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400"><Tag className="h-4 w-4" /></div>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-medium text-gray-900 text-sm mb-4">Shop</h4>
                     <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link href={`/${storeConfig.slug}/products`} className="hover:text-gray-900 transition-colors">All Products</Link></li>
                        <li><Link href={`/${storeConfig.slug}/categories`} className="hover:text-gray-900 transition-colors">Categories</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-medium text-gray-900 text-sm mb-4">Support</h4>
                     <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link href={`/${storeConfig.slug}/help-center`} className="hover:text-gray-900 transition-colors">Help Center</Link></li>
                        <li><Link href={`/${storeConfig.slug}/shipping-returns`} className="hover:text-gray-900 transition-colors">Shipping & Returns</Link></li>
                        <li><Link href={`/${storeConfig.slug}/track-order`} className="hover:text-gray-900 transition-colors">Track Order</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-medium text-gray-900 text-sm mb-4">Account</h4>
                     <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link href={`/${storeConfig.slug}/account`} className="hover:text-gray-900 transition-colors">My Account</Link></li>
                        <li><Link href={`/${storeConfig.slug}/track-order`} className="hover:text-gray-900 transition-colors">Track Order</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-medium text-gray-900 text-sm mb-4">Stay Connected</h4>
                     <form onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                        if (emailInput && emailInput.value) {
                           // Simulate newsletter subscription
                           await new Promise(resolve => setTimeout(resolve, 500));
                           addToast('Thank you for subscribing!', 'success');
                           emailInput.value = '';
                        }
                     }} className="flex flex-col gap-3">
                        <input type="email" placeholder="Enter email for deals" required className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500 transition-colors bg-white" />
                        <Button type="submit" size="sm" className="bg-gray-900 hover:bg-gray-800 text-white w-full font-normal">Subscribe</Button>
                     </form>
                  </div>
               </div>

               <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                  <p>&copy; 2024 {storeConfig.name}. All rights reserved.</p>
                  <div className="flex gap-6">
                     <Link href={`/${storeConfig.slug}/privacy`} className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                     <Link href={`/${storeConfig.slug}/terms`} className="hover:text-gray-600 transition-colors">Terms & Conditions</Link>
                     <Link href={`/${storeConfig.slug}/help-center`} className="hover:text-gray-600 transition-colors">Accessibility</Link>
                  </div>
               </div>
            </div>
         </footer>

         {/* Cart Sheet */}
         <Sheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title={`My Cart (${cartCount})`} side="right">
            <div className="flex flex-col h-full">
               {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
                     <ShoppingCart className="h-12 w-12 mb-4 text-gray-300" />
                     <p className="font-medium mb-1">Your cart is empty</p>
                     <Button onClick={() => setIsCartOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
                        Start Shopping
                     </Button>
                  </div>
               ) : (
                  <>
                     <div className="flex-1 overflow-y-auto py-4">
                        {cart.map(item => (
                           <div key={item.id} className="flex gap-4 p-4 border-b border-gray-100">
                              <div className="h-16 w-16 bg-white border border-gray-200 rounded flex-shrink-0 overflow-hidden">
                                 <ImageWithFallback
                                    src={item.product.images?.[0]}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                    skeletonAspectRatio="square"
                                 />
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{item.product.name}</h4>
                                 <div className="flex justify-between items-center mt-2">
                                    <p className="text-blue-600 font-bold text-sm">{formatCurrency(item.price, item.product?.currency || storeConfig.settings?.currency || 'USD')}</p>
                                    <div className="flex items-center border border-gray-200 rounded bg-white">
                                       <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-2 py-0.5 hover:bg-gray-50 text-gray-500">-</button>
                                       <span className="px-2 text-xs font-medium">{item.quantity}</span>
                                       <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 hover:bg-gray-50 text-gray-500">+</button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                           <span>Total</span>
                           <span>{formatCurrency(cartTotal, storeConfig.settings?.currency || 'USD')}</span>
                        </div>
                        <CheckoutButton storeConfig={storeConfig} className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold" />
                     </div>
                  </>
               )}
            </div>
         </Sheet>

         {/* Mobile Menu */}
         <Sheet isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} title="Menu" side="left">
            <div className="py-2">
               {categories.map(cat => (
                  <Link key={cat.id} href={`/${storeConfig.slug}/categories/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100">
                     {cat.name}
                  </Link>
               ))}
            </div>
         </Sheet>

         {/* Promotional Banner */}
         <PromoBanner config={layoutConfig?.sections?.promoBanner} layoutStyle="electronics" />
      </div>
   );
}

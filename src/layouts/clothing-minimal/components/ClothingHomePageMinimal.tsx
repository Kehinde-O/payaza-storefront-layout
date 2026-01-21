'use client';

import { StoreConfig, StoreProduct } from '../../../lib/store-types';
import { Button } from '../../../components/ui/button';
import { useStore } from '../../../lib/store-context';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { useToast } from '../../../components/ui/toast';
import { ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, filterActiveProducts } from '../../../lib/utils';
import { getLayoutText, getBannerImage, getTextContent } from '../../../lib/utils/asset-helpers';
import { PromoBanner } from '../../shared/components/PromoBanner';
import { DynamicIcon } from '../../../components/ui/dynamic-icon';

interface ClothingHomePageMinimalProps {
  storeConfig: StoreConfig;
}

export function ClothingHomePageMinimal({ storeConfig: initialConfig }: ClothingHomePageMinimalProps) {
  const { store, addToCart } = useStore();
  const storeConfig = store || initialConfig;
  
  const layoutConfig = storeConfig.layoutConfig;
  
  // In preview mode, use mock data if none are available
  const isPreview = (typeof window !== 'undefined' && (window as any).__IS_PREVIEW__) || storeConfig.layoutConfig?.isPreview;

  const categories = (storeConfig.categories && storeConfig.categories.length > 0)
    ? storeConfig.categories
    : (isPreview ? [
      { id: 'cat1', name: 'Essentials', slug: 'essentials', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800' },
      { id: 'cat2', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800' },
      { id: 'cat3', name: 'Collections', slug: 'collections', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800' }
    ] : []);

  const rawProducts = storeConfig.products || [];
  const activeProducts = filterActiveProducts(rawProducts);
  
  // Use real active products if available, otherwise if in preview, use all products (including drafts), 
  // and if still none, use mock data
  const products = activeProducts.length > 0 
    ? activeProducts 
    : (isPreview && rawProducts.length > 0 
        ? rawProducts 
        : (isPreview ? [
            { id: 'p1', name: 'Minimal Tee', price: 40, currency: 'USD', images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'], slug: 'minimal-tee' },
            { id: 'p2', name: 'Cotton Shirt', price: 75, currency: 'USD', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800'], slug: 'cotton-shirt' },
            { id: 'p3', name: 'Wool Trousers', price: 120, currency: 'USD', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800'], slug: 'wool-trousers' },
            { id: 'p4', name: 'Linen Jacket', price: 180, currency: 'USD', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'], slug: 'linen-jacket' }
          ] : []));

  const { addToast } = useToast();

  const handleAddToCart = (product: StoreProduct) => {
    addToCart(product);
    addToast(`${product.name} added to cart`, 'success');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Header, Cart, Search, Menu are now handled by ClothingMinimalLayout wrapper */}

      {/* Hero Section - Split Layout */}
      {layoutConfig?.sections?.hero?.show !== false && (
        <section 
          data-section="hero"
          className="lg:h-screen h-auto w-full"
        >
           <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              <div className="relative bg-[#F4F4F4] flex flex-col justify-center px-12 md:px-24 lg:order-1 order-2 py-20 lg:py-0">
                 <div className="space-y-6 md:space-y-8 max-w-lg animate-fade-in-up">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      {layoutConfig?.sections?.hero?.badge || getTextContent(storeConfig, 'hero_badge', 'New Collection 2024')}
                    </span>
                    <h1 className="text-4xl md:text-7xl font-light tracking-tight leading-[1.1]">
                       {(() => {
                         const titleText = layoutConfig?.sections?.hero?.title || getLayoutText(storeConfig, 'hero.title', 'Simplicity is the ultimate sophistication.');
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
                       {layoutConfig?.sections?.hero?.subtitle || getLayoutText(storeConfig, 'hero.subtitle', storeConfig.description ? `${storeConfig.description} Discover our latest arrivals, crafted for the modern individual who values quality and timeless design.` : 'Discover our latest arrivals, crafted for the modern individual who values quality and timeless design.')}
                    </p>
                    <div className="pt-4">
                       <Link href={`/${storeConfig.slug}/products`}>
                          <Button className="h-14 px-10 rounded-full bg-black text-white hover:bg-gray-800 text-base transition-all hover:scale-105">
                             {layoutConfig?.sections?.hero?.primaryCTA || getLayoutText(storeConfig, 'common.shopNow', 'Shop Collection')}
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
      )}

      {/* Benefits Strip - Minimal */}
      {layoutConfig?.sections?.features?.show !== false && (
        <section data-section="features" className="py-12 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(layoutConfig?.sections?.features?.items || [
                { icon: 'Truck', title: 'Global Delivery', description: 'Free on orders over $200' },
                { icon: 'ShieldCheck', title: 'Secure Payment', description: '100% secure checkout' },
                { icon: 'RefreshCw', title: 'Easy Returns', description: '30-day return policy' }
              ]).map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <DynamicIcon name={item.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories - Clean Grid */}
      {layoutConfig?.sections?.categories?.show !== false && (
        <section 
          data-section="categories"
          className="py-16 md:py-24 px-4 md:px-8"
        >
           <div className="container mx-auto">
              <div className="flex justify-between items-end mb-8 md:mb-12">
                 <h2 className="text-3xl font-light">{layoutConfig?.sections?.categories?.title || getLayoutText(storeConfig, 'sections.categories.title', 'Categories')}</h2>
                 <Link href={`/${storeConfig.slug}/categories`} className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                    {layoutConfig?.sections?.categories?.viewAllLabel || getLayoutText(storeConfig, 'sections.categories.viewAll', 'View All')}
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
      )}

      {/* Essentials / Products Scroll */}
      {layoutConfig?.sections?.featuredProducts?.show !== false && (
        <section 
          data-section="featuredProducts"
          className="py-16 md:py-24 bg-[#FAFAFA]"
        >
           <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl mx-auto text-center mb-10 md:mb-16">
                 <h2 className="text-3xl md:text-4xl font-light mb-4">{layoutConfig?.sections?.featuredProducts?.title || 'The Essentials'}</h2>
                 <p className="text-gray-500">{layoutConfig?.sections?.featuredProducts?.subtitle || 'Timeless pieces designed to build the foundation of your wardrobe.'}</p>
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
      )}

      {/* Shop the Look - Interactive */}
      {layoutConfig?.sections?.about?.show !== false && (
        <section 
          data-section="about"
          className="py-16 md:py-24 px-4 md:px-8 border-t border-gray-100"
        >
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
                    <h2 className="text-4xl font-light">
                      {layoutConfig?.sections?.about?.title || (
                        <>Winter <span className="font-serif italic">Layering</span></>
                      )}
                    </h2>
                    <p className="text-gray-600 leading-relaxed max-w-md">
                      {layoutConfig?.sections?.about?.description || 'Master the art of layering with our winter collection. Combining warmth with style, these pieces are designed to work together seamlessly.'}
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
      )}

      {/* Footer Minimal - Handled by Wrapper (StoreFooter) */}
      {/* However, the original homepage had a custom minimal footer design.
          If I remove it here, it will use StoreFooter.
          The wrapper renders StoreFooter.
          So I should remove the footer from here to avoid duplication.
          If the design is significantly different, I should have extracted it to a custom Footer component.
          The Minimal footer had 4 columns (Brand, Shop, Support, Newsletter).
          Standard StoreFooter also has columns but structure might differ.
          For "Remediation", consistency is key. Using Standard Footer ensures consistency across inner pages.
          So I will remove the footer here.
      */}

      {/* Cart Sheet - Handled by Wrapper */}
      {/* Menu Sheet - Handled by Wrapper */}

      {/* Promotional Banner */}
      <PromoBanner config={layoutConfig?.sections?.promoBanner} layoutStyle="clothing" />
    </div>
  );
}

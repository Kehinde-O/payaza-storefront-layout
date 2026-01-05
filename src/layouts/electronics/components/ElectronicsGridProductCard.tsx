'use client';

import { StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { ProductRating } from '@/components/ui/product-rating';
import { Heart, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { ButtonLoader } from '@/components/ui/page-loader';
import { useLoading } from '@/lib/loading-context';
import { cn, formatCurrency } from '@/lib/utils';
import { OutOfStockOverlay } from '@/components/ui/out-of-stock-overlay';

interface ElectronicsGridProductCardProps {
  product: StoreProduct;
  storeSlug: string;
  onAddToCart: (product: StoreProduct) => void;
  index: number;
}

export function ElectronicsGridProductCard({ product, storeSlug, onAddToCart, index }: ElectronicsGridProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist, isWishlistLoading } = useStore();
  const { addToast } = useToast();
  const { startPageLoading } = useLoading();
  const [localWishlistLoading, setLocalWishlistLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleProductClick = () => {
    startPageLoading(`/${storeSlug}/products/${product.slug}`);
  };

  // Discount calculation
  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  const handleWishlistClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple clicks
    if (localWishlistLoading || isWishlistLoading) {
      console.log('[ElectronicsGridProductCard] Wishlist action already in progress');
      return;
    }
    
    const wasInWishlist = isInWishlist(product.id);
    
    console.log('[ElectronicsGridProductCard] Wishlist button clicked:', {
      productId: product.id,
      productName: product.name,
      isInWishlist: wasInWishlist
    });
    
    // Immediate visual feedback
    setJustAdded(!wasInWishlist);
    setLocalWishlistLoading(true);
    
    try {
      console.log('[ElectronicsGridProductCard] Toggling wishlist:', { productId: product.id, wasInWishlist });
      
      await toggleWishlist(product.id);
      
      // Verify the state was updated
      const nowInWishlist = isInWishlist(product.id);
      console.log('[ElectronicsGridProductCard] Wishlist toggled successfully. New state:', {
        productId: product.id,
        isInWishlist: nowInWishlist,
        wasInWishlist
      });
      
      // Show success message
      addToast(
        nowInWishlist 
          ? `✓ ${product.name} added to wishlist` 
          : `${product.name} removed from wishlist`,
        'success'
      );
      
      // Reset animation after a delay
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
      
    } catch (error) {
      console.error('[ElectronicsGridProductCard] Failed to toggle wishlist:', error);
      setJustAdded(false);
      addToast('Failed to update wishlist. Please try again.', 'error');
    } finally {
      setLocalWishlistLoading(false);
    }
  };
  
  const inWishlist = isInWishlist(product.id);
  const isLoading = localWishlistLoading || isWishlistLoading;
  const isOutOfStock = !product.inStock;

  return (
    <motion.div
      data-product-card
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group relative bg-white overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <Link 
          href={`/${storeSlug}/products/${product.slug}`} 
          onClick={handleProductClick} 
          className="block w-full h-full relative z-10"
          onMouseDown={(e) => {
            // Don't navigate if clicking on wishlist button area
            const target = e.target as HTMLElement;
            if (target.closest('[data-wishlist-button]')) {
              e.preventDefault();
            }
          }}
        >
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={product.images?.[0]}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                isOutOfStock && "grayscale"
              )}
              skeletonAspectRatio="4/5"
            />
          </motion.div>
        </Link>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <OutOfStockOverlay badgePosition="center" />
        )}

        {/* Wishlist Button - Always visible and functional */}
        <button
          type="button"
          data-wishlist-button
          onClick={handleWishlistClick}
          disabled={isLoading}
          onMouseDown={(e) => {
            // Prevent event bubbling to parent Link
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            // Prevent event bubbling
            e.stopPropagation();
          }}
          className={cn(
            "absolute top-4 right-4 z-50 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
            "pointer-events-auto transition-all duration-200",
            justAdded && "ring-2 ring-red-500 ring-offset-2 bg-red-50 scale-110",
            inWishlist 
              ? "text-red-500 bg-red-50/50 hover:bg-red-50 hover:scale-110" 
              : "text-gray-400 bg-white/95 hover:text-red-500 hover:bg-red-50/50 hover:scale-110"
          )}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isLoading ? (
            <ButtonLoader className={inWishlist ? "text-red-500" : "text-gray-400"} />
          ) : (
            <motion.div
              animate={{
                scale: justAdded ? [1, 1.2, 1] : 1,
                rotate: justAdded ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Heart className={cn(
                "w-5 h-5 transition-all",
                inWishlist && "fill-current",
                justAdded && "text-red-500 fill-current"
              )} />
            </motion.div>
          )}
        </button>

        {/* Badges - Clean & Minimal */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.compareAtPrice && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Add Overlay - Desktop */}
        <div className="hidden lg:block absolute inset-x-4 bottom-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out opacity-0 group-hover:opacity-100">
           <Button 
             onClick={(e) => {
               e.preventDefault();
               if (!isOutOfStock) {
                 onAddToCart(product);
               }
             }}
             disabled={isOutOfStock}
             className={cn(
               "w-full bg-gray-900 hover:bg-gray-800 text-white border-none rounded-none h-11 font-normal text-sm transition-colors",
               isOutOfStock && "opacity-50 cursor-not-allowed"
             )}
           >
             <Plus className="w-4 h-4 mr-2" /> Quick Add
           </Button>
        </div>

        {/* Quick Add Button - Mobile */}
        <button
           disabled={isOutOfStock}
           className={cn(
             "lg:hidden absolute bottom-3 right-3 z-30 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-colors",
             isOutOfStock && "opacity-50 cursor-not-allowed"
           )}
           onClick={(e) => {
             e.preventDefault();
             if (!isOutOfStock) {
               onAddToCart(product);
             }
           }}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
            <div>
                <p className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-1.5">{product.specifications?.Brand || 'Brand'}</p>
                <Link 
                  href={`/${storeSlug}/products/${product.slug}`} 
                  className="group/title"
                  onClick={() => startPageLoading(`/${storeSlug}/products/${product.slug}`)}
                >
                  <h3 className="font-normal text-gray-900 text-base leading-tight hover:text-gray-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
            </div>
            <ProductRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="sm"
              showReviewCount={false}
              className="shrink-0"
            />
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-medium text-gray-900">
            {formatCurrency(product.price, product.currency || 'USD')}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through font-normal">
              {formatCurrency(product.compareAtPrice, product.currency || 'USD')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

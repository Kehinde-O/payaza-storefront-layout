'use client';

import { useState } from 'react';
import { StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { ProductRating } from '@/components/ui/product-rating';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { ButtonLoader } from '@/components/ui/page-loader';
import { useLoading } from '@/lib/loading-context';
import { OutOfStockOverlay } from '@/components/ui/out-of-stock-overlay';

interface ProductCardProps {
  product: StoreProduct;
  storeSlug: string;
  onAddToCart: (product: StoreProduct) => void;
  onQuickView: (product: StoreProduct) => void;
  className?: string;
}

export function ProductCard({ product, storeSlug, onAddToCart, onQuickView, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist, isWishlistLoading } = useStore();
  const { addToast } = useToast();
  const { startPageLoading } = useLoading();
  const [localWishlistLoading, setLocalWishlistLoading] = useState(false);

  const handleProductClick = () => {
    startPageLoading();
  };
  
  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Debug logging for wishlist click
    if (process.env.NODE_ENV === 'development') {
      console.log('[ProductCard] Wishlist button clicked:', {
        productId: product.id,
        productName: product.name,
        isInWishlist: isInWishlist(product.id),
        isLoading: localWishlistLoading || isWishlistLoading
      });
    }
    
    if (localWishlistLoading || isWishlistLoading) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ProductCard] Wishlist action already in progress, ignoring click');
      }
      return;
    }
    
    setLocalWishlistLoading(true);
    try {
      const wasInWishlist = isInWishlist(product.id);
      if (process.env.NODE_ENV === 'development') {
        console.log('[ProductCard] Toggling wishlist:', { productId: product.id, wasInWishlist });
      }
      await toggleWishlist(product.id);
      if (process.env.NODE_ENV === 'development') {
        console.log('[ProductCard] Wishlist toggled successfully');
      }
      addToast(
        wasInWishlist 
          ? `${product.name} removed from wishlist` 
          : `${product.name} added to wishlist`,
        'success'
      );
    } catch (error) {
      console.error('[ProductCard] Failed to toggle wishlist:', error);
      addToast('Failed to update wishlist', 'error');
    } finally {
      setLocalWishlistLoading(false);
    }
  };
  
  const inWishlist = isInWishlist(product.id);
  const isLoading = localWishlistLoading || isWishlistLoading;
  const isOutOfStock = !product.inStock;
  
  // Validate and extract image URLs
  // Ensure images is an array of valid string URLs
  const validImages = Array.isArray(product.images) 
    ? product.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [];
  
  // Determine which image to show
  const hasSecondImage = validImages.length > 1;
  const currentImage = isHovered && hasSecondImage && validImages[1]
    ? validImages[1]
    : validImages[0] || undefined;

  // Debug logging for images (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    if (validImages.length === 0) {
      console.warn(`[ProductCard] Product "${product.name}" (${product.id}) has no valid images:`, {
        productId: product.id,
        productName: product.name,
        originalImages: product.images,
        validImagesCount: validImages.length
      });
    } else {
      console.log(`[ProductCard] Product "${product.name}" (${product.id}) images:`, {
        productId: product.id,
        validImagesCount: validImages.length,
        firstImage: validImages[0],
        currentImage: currentImage,
        hasSecondImage: hasSecondImage
      });
    }
  }

  return (
    <div 
      data-product-card
      className={cn("group relative flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        <Link href={`/${storeSlug}/products/${product.slug}`} onClick={handleProductClick} className="block w-full h-full">
          <ImageWithFallback 
            src={currentImage} 
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 ease-in-out",
              isHovered && !hasSecondImage ? "scale-110" : "scale-100",
              isOutOfStock && "grayscale"
            )}
            skeletonAspectRatio="3/4"
          />
        </Link>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <OutOfStockOverlay badgePosition="center" />
        )}
        
        {/* Badges */}
        {(product.compareAtPrice || (product.rating && product.rating >= 4.8)) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.compareAtPrice && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Sale
              </span>
            )}
            {!product.compareAtPrice && product.rating && product.rating >= 4.8 && (
              <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-gray-100">
                Top Rated
              </span>
            )}
          </div>
        )}

        {/* Wishlist Button - Always functional, even when out of stock */}
        <button 
          onClick={handleWishlistClick}
          disabled={isLoading}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 disabled:opacity-50 disabled:cursor-not-allowed z-30",
            inWishlist ? "text-red-500" : "text-slate-600 hover:text-red-500"
          )}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isLoading ? (
            <ButtonLoader className="text-red-500" />
          ) : (
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          )}
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-4 inset-x-4 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
          <Link
            href={`/${storeSlug}/products/${product.slug}`}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white border border-transparent shadow-lg transition-colors duration-200"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Button 
            onClick={async (e) => {
              e.preventDefault();
              if (!isOutOfStock) {
                await onAddToCart(product);
              }
            }}
            disabled={isOutOfStock}
            className={cn(
              "flex-1 h-10 bg-white text-slate-900 hover:bg-slate-900 hover:text-white font-bold border border-transparent shadow-lg rounded-full transition-colors duration-200",
              isOutOfStock && "opacity-50 cursor-not-allowed"
            )}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-2">
        <Link 
          href={`/${storeSlug}/products/${product.slug}`} 
          className="group-hover:text-blue-600 transition-colors duration-300"
          onClick={() => startPageLoading(`/${storeSlug}/products/${product.slug}`)}
        >
          <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.description && (
           <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(product.price, product.currency || 'USD')}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-slate-400 line-through font-medium">
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
      </div>
    </div>
  );
}

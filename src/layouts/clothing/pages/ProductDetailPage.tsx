'use client';

import { StoreConfig, ProductReview, StoreProduct, StoreCategory } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Modal } from '@/components/ui/modal';
import { ProductRating } from '@/components/ui/product-rating';
import { ShoppingCart, Heart, Star, Truck, CheckCircle, ThumbsUp, User, Minus, Plus, Ruler, Share2, Info, ChevronDown } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useAnalytics } from '@/hooks/use-analytics';
import { customerService, Address } from '@/lib/services/customer.service';
import { GuestCheckoutModal } from '@/components/ui/guest-checkout-modal';
import { getGuestUserInfo, saveGuestUserInfo, GuestUserInfo } from '@/lib/guest-user';
import { ProductCard } from '@/components/ui/product-card';
import Image from 'next/image';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { ButtonLoader } from '@/components/ui/page-loader';
import { extractImageUrls } from '@/lib/store-config-utils';
import { OutOfStockOverlay } from '@/components/ui/out-of-stock-overlay';
import { cn, formatCurrency, filterActiveProducts } from '@/lib/utils';
import { shippingService, ShippingMethod } from '@/lib/services/shipping.service';
import { countries, getCountryByName, getCitiesByCountry } from '@/lib/countries';

interface ProductDetailPageProps {
  storeConfig: StoreConfig;
  productSlug: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Star Rating Component with half-star support
function StarRating({ rating, size = 'md', className = '' }: { rating: number; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  };
  
  const starSize = sizeClasses[size];
  
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5 && fullStars === i;
        const isFull = starValue <= fullStars;
        const isHalf = hasHalfStar;
        
        return (
          <div key={i} className={`relative inline-block ${sizeClasses[size]}`}>
            {/* Background (empty) star */}
            <Star
              className={`w-full h-full absolute inset-0 text-gray-200 fill-gray-200`}
            />
            {/* Half star - clip left half */}
            {isHalf && (
              <div className="absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                <Star className={`w-full h-full text-gray-900 fill-gray-900`} />
              </div>
            )}
            {/* Full star */}
            {isFull && (
              <Star className={`w-full h-full absolute inset-0 text-gray-900 fill-gray-900`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Review Card Component
import { ReviewForm } from '@/components/ui/review-form';

function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <div className="border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm overflow-hidden">
            {review.userAvatar ? (
              <Image 
                src={review.userAvatar} 
                alt={review.userName} 
                fill
                className="w-full h-full object-cover" 
                unoptimized
              />
            ) : null}
            <User className="h-6 w-6 text-gray-600" style={{ display: review.userAvatar ? 'none' : 'flex' }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{review.userName}</span>
              {review.verified && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-3 text-lg">{review.title}</h4>
      )}
      
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
      
          {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <Image
                src={img}
                alt={`${review.userName}'s review image ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
                />
            </div>
          ))}
        </div>
      )}
      
      {review.helpful !== undefined && (
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors font-medium">
            <ThumbsUp className="h-4 w-4" />
            <span>Helpful ({review.helpful})</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductDetailPage({ storeConfig, productSlug }: ProductDetailPageProps) {
  const products = filterActiveProducts(storeConfig.products || []);
  const product = products.find(p => p.slug === productSlug);
  const { addToCart, isCartLoading, toggleWishlist, isInWishlist, isWishlistLoading, setBuyNowItem } = useStore();
  const { addToast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { trackEvent } = useAnalytics();

  // Related products logic
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        addToast('Link copied to clipboard!', 'success');
      } catch (err) {
        addToast('Failed to copy link', 'error');
      }
    }
  };

  const handleQuickView = (p: StoreProduct) => {
    // Navigate to product page for now
    router.push(`/${storeConfig.slug}/products/${p.slug}`);
  };

  const handleWishlistClick = async () => {
    if (!product) return;
    
    if (isWishlistLoading) {
      return; // Prevent multiple clicks
    }
    
    try {
      const wasInWishlist = isInWishlist(product.id);
      await toggleWishlist(product.id);
      addToast(
        wasInWishlist 
          ? `${product.name} removed from wishlist` 
          : `${product.name} added to wishlist`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      addToast('Failed to update wishlist', 'error');
    }
  };


  // Extract color and size variants
  const colorVariants = product?.variants?.filter(v => v.name === 'Color') || [];
  const sizeVariants = product?.variants?.filter(v => v.name === 'Size') || [];
  
  // Initialize state with defaults
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Ensure selectedImage is within bounds when images change
  useEffect(() => {
    if (product && product.images && product.images.length > 0 && selectedImage >= product.images.length) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setSelectedImage(0), 0);
    }
  }, [product, selectedImage]);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colorVariants.length > 0 ? colorVariants[0].value : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizeVariants.length > 0 ? sizeVariants[0].value : null
  );
  const [quantity, setQuantity] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  // Shipping calculation state
  const [shippingAddress, setShippingAddress] = useState({
    country: '',
    city: '',
    zipCode: '',
  });
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [freeShippingEligible, setFreeShippingEligible] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | undefined>(undefined);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to API
    addToast('Review submitted successfully!', 'success');
    setIsReviewModalOpen(false);
    setNewReview({ rating: 5, title: '', comment: '' });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Use SKU for display, fallback to generated SKU from slug if not available
  const displaySKU = product.sku || product.slug?.toUpperCase().replace(/-/g, '').substring(0, 12).padEnd(8, 'X') || 'N/A';

  // Build category breadcrumb path with all parent categories
  const buildCategoryPath = (categoryId: string | null): StoreCategory[] => {
    if (!categoryId) return [];
    
    const path: StoreCategory[] = [];
    let currentCategoryId: string | null = categoryId;
    
    // Traverse up the parent chain
    while (currentCategoryId) {
      const category = storeConfig.categories.find(c => c.id === currentCategoryId);
      if (!category) break;
      
      path.unshift(category); // Add to beginning to maintain root-to-leaf order
      currentCategoryId = category.parentId || null;
    }
    
    return path;
  };

  // Get category path for breadcrumbs
  const categoryPath = product.categoryId ? buildCategoryPath(product.categoryId) : [];
  const directCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : null;
  
  // Generate breadcrumbs with all parent categories
  const breadcrumbItems = [
    { label: storeConfig.name, href: `/${storeConfig.slug}` },
    // Add all parent categories
    ...categoryPath.map(cat => ({
      label: cat.name,
      href: `/${storeConfig.slug}/categories/${cat.slug || ''}`,
    })),
    // Add product name
    { label: product.name, href: `/${storeConfig.slug}/products/${product.slug}` },
  ];

  // Extract product images - product.images should already be string[] from transformation,
  // but handle edge cases where it might still be in object format
  // Use the comprehensive extraction utility from store-config-utils for consistency
  const productImages = (() => {
    // Debug: Log the raw product.images to understand its format
    if (process.env.NODE_ENV === 'development') {
      console.log('[ProductDetailPage] Raw product.images:', {
        productId: product.id,
        productName: product.name,
        images: product.images,
        imagesType: typeof product.images,
        imagesIsArray: Array.isArray(product.images),
        imagesLength: Array.isArray(product.images) ? product.images.length : 'N/A',
        firstItem: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'N/A',
        firstItemType: Array.isArray(product.images) && product.images.length > 0 ? typeof product.images[0] : 'N/A'
      });
    }
    
    // If already an array of strings (normal case after transformation)
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstItem = product.images[0];
      if (typeof firstItem === 'string') {
        const filtered = product.images.filter((img): img is string => 
          typeof img === 'string' && img.trim().length > 0
        );
        if (process.env.NODE_ENV === 'development') {
          console.log('[ProductDetailPage] Using string array directly:', { count: filtered.length, firstImage: filtered[0]?.substring(0, 100) });
        }
        return filtered;
      }
      // If array but not strings, extract using utility
      if (process.env.NODE_ENV === 'development') {
        console.log('[ProductDetailPage] Array but not strings, using extractImageUrls');
      }
    }
    // Use the comprehensive extraction utility for any other format (objects, nested structures, etc.)
    const extracted = extractImageUrls(product.images);
    if (process.env.NODE_ENV === 'development') {
      console.log('[ProductDetailPage] Extracted using utility:', { count: extracted.length, firstImage: extracted[0]?.substring(0, 100) });
    }
    return extracted;
  })();
  
  // For gallery, use actual images only (don't duplicate to fill 5 slots)
  const displayImages = productImages.slice(0, 5);
  const hasMoreImages = productImages.length > 5;

  // Debug logging for images (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    if (productImages.length === 0) {
      console.warn(`[ProductDetailPage] Product "${product.name}" (${product.id}) has no valid images:`, {
        productId: product.id,
        productName: product.name,
        originalImages: product.images,
        originalType: typeof product.images,
        originalIsArray: Array.isArray(product.images),
        validImagesCount: productImages.length
      });
    } else {
      console.log(`[ProductDetailPage] Product "${product.name}" (${product.id}) images:`, {
        productId: product.id,
        validImagesCount: productImages.length,
        displayImagesCount: displayImages.length,
        firstImage: productImages[0]?.substring(0, 100)
      });
    }
  }

  // Color swatch mapping
  const colorSwatches: Record<string, string> = {
    'White': '#FFFFFF',
    'Black': '#000000',
    'Gray': '#808080',
    'Grey': '#808080',
    'Blue': '#3B82F6',
    'Red': '#EF4444',
    'Green': '#10B981',
    'Yellow': '#FBBF24',
    'Brown': '#92400E',
    'Navy': '#1E3A8A',
    'Beige': '#F5F5DC',
  };

  // Get reviews
  const reviews = product.reviews || [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const hasMoreReviews = reviews.length > 3;
  
  // Out of stock check
  const isOutOfStock = !product.inStock;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    return {
      rating,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
    };
  });

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast('This product is currently out of stock', 'error');
      return;
    }
    
    // Find the matching variation UUID based on selected attributes
    // Note: StoreProduct uses 'variants' not 'variations'
    let variationId: string | undefined;
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      const matchingVariation = product.variants.find((variation: { id?: string; name?: string; value?: string; attributes?: Record<string, string> }) => {
        const attrs = variation.attributes || {};
        const colorMatch = !selectedColor || attrs.color === selectedColor;
        const sizeMatch = !selectedSize || attrs.size === selectedSize;
        return colorMatch && sizeMatch;
      });
      variationId = matchingVariation?.id;
    }
    
    // Fallback to composite string for backward compatibility if no variation found
    const variantId = variationId || (selectedColor || selectedSize 
      ? [selectedColor, selectedSize].filter(Boolean).join(' / ') 
      : undefined);

    addToCart(product, quantity, variantId);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) {
      addToast('This product is currently out of stock', 'error');
      return;
    }
    
    if (isBuyNowLoading || isCartLoading) {
      return; // Prevent multiple clicks
    }

    setIsBuyNowLoading(true);
    
    try {
      // Find the matching variation UUID based on selected attributes
      // Note: StoreProduct uses 'variants' not 'variations'
      let variationId: string | undefined;
      let variantName: string | undefined;
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        const matchingVariation = product.variants.find((variation: { id?: string; name?: string; value?: string; attributes?: Record<string, string> }) => {
          const attrs = variation.attributes || {};
          const colorMatch = !selectedColor || attrs.color === selectedColor;
          const sizeMatch = !selectedSize || attrs.size === selectedSize;
          return colorMatch && sizeMatch;
        });
        variationId = matchingVariation?.id;
        variantName = matchingVariation?.name || matchingVariation?.value;
      }
      
      // Fallback to composite string for backward compatibility if no variation found
      const variantId = variationId || (selectedColor || selectedSize 
        ? [selectedColor, selectedSize].filter(Boolean).join(' / ') 
        : undefined);

      // Create buy now item (don't add to cart)
      const buyNowItemId = variantId ? `${product.id}-${variantId}` : product.id;
      const buyNowItem = {
        id: buyNowItemId,
        productId: product.id,
        quantity,
        variantId,
        variantName: variantName || variantId,
        price: product.price,
        product
      };

      // Set buy now item and navigate directly to checkout
      setBuyNowItem(buyNowItem);
      
      // Navigate to checkout page for direct checkout
      router.push(`/${storeConfig.slug}/checkout`);
    } catch (error) {
      console.error('Buy Now error:', error);
      addToast('Failed to proceed to checkout. Please try again.', 'error');
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const handleGuestInfoSubmit = (userInfo: GuestUserInfo) => {
    // Save guest info to localStorage
    saveGuestUserInfo(userInfo);
    setShowGuestModal(false);
    
    // Note: This is now only used for other flows, not buy now
    // Buy now now redirects to checkout page
  };

  // Calculate shipping when address is provided
  const calculateShipping = async () => {
    if (!product || !shippingAddress.country || !shippingAddress.city) {
      setShippingError('Please provide country and city to calculate shipping');
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const currency = product.currency || storeConfig.settings?.currency || 'USD';
      const subtotal = product.price * quantity;
      
      const result = await shippingService.calculateShipping({
        storeId: storeConfig.id,
        address: {
          country: shippingAddress.country,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode,
        },
        items: [{
          productId: product.id,
          quantity: quantity,
        }],
        subtotal: subtotal,
        currency: currency,
      });

      setShippingMethods(result.methods || []);
      setFreeShippingEligible(result.freeShippingEligible || false);
      setFreeShippingThreshold(result.freeShippingThreshold);
    } catch (error: any) {
      console.error('Shipping calculation error:', error);
      setShippingError(error.message || 'Failed to calculate shipping. Please try again.');
      setShippingMethods([]);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Load saved addresses for authenticated users and auto-populate shipping address
  useEffect(() => {
    const loadAddresses = async () => {
      if (isAuthenticated) {
        try {
          const addresses = await customerService.getAddresses();
          setSavedAddresses(addresses);
          
          // Auto-populate with default address or first address if available
          if (addresses.length > 0) {
            const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
            if (defaultAddress) {
              setShippingAddress({
                country: defaultAddress.country || '',
                city: defaultAddress.city || '',
                zipCode: defaultAddress.zipCode || '',
              });
            }
          }
        } catch (error: any) {
          console.error('Failed to load addresses:', error);
          // Don't show error toast - addresses are optional
          // Users can still manually enter shipping address
        }
      }
    };

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Auto-calculate shipping when address fields are filled (debounced)
  useEffect(() => {
    if (!shippingAddress.country || !shippingAddress.city || !product) {
      return;
    }

    const timer = setTimeout(() => {
      calculateShipping();
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress.country, shippingAddress.city, shippingAddress.zipCode, quantity, product?.id, product?.price]);

  // Track product view
  useEffect(() => {
    if (product && storeConfig?.id) {
      trackEvent({
        eventType: 'product_view',
        metadata: {
          productId: product.id,
          productName: product.name,
          categoryId: product.categoryId,
          price: product.price,
        },
      });
    }
  }, [product?.id, storeConfig?.id, trackEvent]);

  return (
    <div className="min-h-screen bg-white">
      <div data-content-ready className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
          {/* Product Images Section */}
          <div className="relative lg:sticky lg:top-24 self-start z-0">
            {/* Main Product Image */}
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100 shadow-sm group">
              <ImageWithFallback
                data-product-image
                src={displayImages[selectedImage] || displayImages[0] || productImages[0]}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                  isOutOfStock && "grayscale"
                )}
                skeletonAspectRatio="square"
              />
              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <OutOfStockOverlay badgePosition="center" />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                    onClick={() => setSelectedImage(Math.min(index, displayImages.length - 1))}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ImageWithFallback 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`} 
                    className={cn(
                      "w-full h-full object-cover",
                      isOutOfStock && "grayscale"
                    )}
                    skeletonAspectRatio="square"
                  />
                </button>
              ))}
              {hasMoreImages && (
                <div className="aspect-square rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-medium">
                  +{productImages.length - 5} more
                </div>
              )}
            </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="flex flex-col">
            {/* Brand and Share */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {(() => {
                  const brandMatch = product.name.match(/\b(Reebok|Nike|Adidas|Puma|New Balance|Vans|Converse)\b/i);
                  return brandMatch ? brandMatch[1] : storeConfig.name;
                })()}
              </span>
              <button 
                onClick={handleShare}
                className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Share this product"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Product Name */}
            <h1 data-product-name className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Product SKU */}
            <p className="text-sm text-gray-500 mb-6 font-mono">
              SKU: {displaySKU}
            </p>

            {/* Stock Status */}
            <div className="mb-4 flex items-center gap-2">
              {product.inStock ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <Info className="w-3 h-3 mr-1" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4">
              <span data-product-price className="text-4xl lg:text-5xl font-bold text-gray-900">
                  {formatCurrency(product.price, product.currency || 'USD')}
                </span>
                {product.compareAtPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatCurrency(product.compareAtPrice, product.currency || 'USD')}
              </span>
                )}
              </div>
              {product.compareAtPrice && (
                 <span className="inline-block mt-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                    SAVE {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Color Selection */}
            {colorVariants.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-gray-900">Color:</span>
                  <span className="text-sm text-gray-600 capitalize">
                    {selectedColor || colorVariants[0]?.value}
                  </span>
                </div>
                <div className="flex gap-3">
                  {colorVariants.map((variant) => {
                    const colorValue = variant.value;
                    const swatchColor = colorSwatches[colorValue] || '#CCCCCC';
                    const isSelected = selectedColor === colorValue;
                    
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedColor(colorValue)}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                          isSelected 
                            ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2 scale-105' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: swatchColor }}
                        title={colorValue}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className={`h-5 w-5 ${['White', 'Beige', 'Yellow'].includes(colorValue) ? 'text-gray-900' : 'text-white'} drop-shadow-sm`} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizeVariants.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">Size:</span>
                    <span className="text-sm text-gray-600">
                      {selectedSize || 'Select Size'}
                    </span>
                  </div>
                  <a 
                    href={`/${storeConfig.slug}/size-guide`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 underline decoration-gray-400 underline-offset-4"
                  >
                    <Ruler className="h-3.5 w-3.5" /> Size guide
                  </a>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {sizeVariants.map((variant) => {
                    const isSelected = selectedSize === variant.value;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedSize(variant.value)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                          isSelected
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md transform -translate-y-0.5'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {variant.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="flex flex-col gap-4 mb-8">
               {/* Quantity Selector */}
               <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">Quantity</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                     <button 
                        className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                     >
                        <Minus className="h-4 w-4" />
                     </button>
                     <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                     <button 
                        className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                        onClick={() => setQuantity(quantity + 1)}
                     >
                        <Plus className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button
                data-add-to-cart
                size="lg"
                     onClick={handleAddToCart}
                     disabled={isCartLoading || isOutOfStock}
                     className="flex-1 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-full h-14 text-base font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCartLoading ? (
                  <>
                    <ButtonLoader className="mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
                  </Button>
                  <Button
                     size="lg"
                     onClick={handleBuyNow}
                     disabled={isOutOfStock || isBuyNowLoading || isCartLoading}
                     className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isBuyNowLoading || isCartLoading ? (
                       <>
                         <ButtonLoader className="mr-2" />
                         Adding...
                       </>
                     ) : (
                       'Buy Now'
                     )}
              </Button>
              {storeConfig.features.wishlist && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistClick}
                  disabled={isWishlistLoading || !product}
                  className={cn(
                    "h-14 w-14 rounded-full border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    product && isInWishlist(product.id)
                      ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {isWishlistLoading ? (
                    <ButtonLoader className="h-5 w-5" />
                  ) : (
                    <Heart className={cn("h-5 w-5", product && isInWishlist(product.id) && "fill-current")} />
                  )}
                </Button>
              )}
            </div>
            </div>

            {/* Shipping & Delivery Info */}
            <div className="mb-8 border-t border-b border-gray-100 py-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm mb-4 uppercase tracking-wider">
                 <Truck className="h-4 w-4" /> Delivery Information
              </h3>

              {/* Address Input for Shipping Calculation */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Calculate Shipping</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Country</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className={cn(
                          "w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium flex items-center justify-between text-left"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {(() => {
                            const selectedCountry = getCountryByName(shippingAddress.country);
                            return selectedCountry ? (
                              <>
                                <span className="text-base">{selectedCountry.flag}</span>
                                <span>{selectedCountry.name}</span>
                              </>
                            ) : (
                              <span className="text-gray-400">Select country</span>
                            );
                          })()}
                        </span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-gray-400 transition-transform",
                          isCountryDropdownOpen && "transform rotate-180"
                        )} />
                      </button>
                      {isCountryDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsCountryDropdownOpen(false)}
                          />
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setShippingAddress({...shippingAddress, country: country.name, city: ''}); // Clear city when country changes
                                  setIsCountryDropdownOpen(false);
                                  setIsCityDropdownOpen(false);
                                }}
                                className={cn(
                                  "w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 transition-colors",
                                  shippingAddress.country === country.name && "bg-gray-50 font-medium"
                                )}
                              >
                                <span className="text-base">{country.flag}</span>
                                <span>{country.name}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">City</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (shippingAddress.country) {
                            setIsCityDropdownOpen(!isCityDropdownOpen);
                          } else {
                            addToast('Please select a country first', 'error');
                          }
                        }}
                        disabled={!shippingAddress.country}
                        className={cn(
                          "w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium flex items-center justify-between text-left",
                          !shippingAddress.country && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span className={shippingAddress.city ? "text-gray-900" : "text-gray-400"}>
                          {shippingAddress.city || 'Select city'}
                        </span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-gray-400 transition-transform",
                          isCityDropdownOpen && "transform rotate-180"
                        )} />
                      </button>
                      {isCityDropdownOpen && shippingAddress.country && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsCityDropdownOpen(false)}
                          />
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                            {getCitiesByCountry(shippingAddress.country).length > 0 ? (
                              getCitiesByCountry(shippingAddress.country).map((city) => (
                                <button
                                  key={city}
                                  type="button"
                                  onClick={() => {
                                    setShippingAddress({...shippingAddress, city});
                                    setIsCityDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors",
                                    shippingAddress.city === city && "bg-gray-50 font-medium"
                                  )}
                                >
                                  {city}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No cities available for this country
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Zip/Postal Code</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
                {shippingError && (
                  <p className="text-xs text-red-600 mt-2">{shippingError}</p>
                )}
              </div>

              {/* Free Shipping Progress */}
              {freeShippingThreshold !== undefined && !freeShippingEligible && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 mb-1">
                    Spend {formatCurrency(freeShippingThreshold - (product.price * quantity), product.currency || storeConfig.settings?.currency || 'USD')} more for free shipping!
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ((product.price * quantity) / freeShippingThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Shipping Methods Display */}
              {isCalculatingShipping ? (
                <div className="flex items-center justify-center p-8">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span className="text-sm font-medium">Calculating shipping...</span>
                  </div>
                </div>
              ) : shippingMethods.length > 0 ? (
                <div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                  {shippingMethods.map((method, index) => (
                    <div
                      key={method.code || index}
                      className={cn(
                        "flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors group",
                        freeShippingEligible && method.cost === 0 && "bg-green-50 border-green-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full group-hover:bg-white transition-colors border",
                          freeShippingEligible && method.cost === 0
                            ? "bg-green-100 border-green-300"
                            : "bg-gray-50 border-gray-100"
                        )}>
                          {freeShippingEligible && method.cost === 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-700" />
                          ) : (
                            <Truck className="h-4 w-4 text-gray-900" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {method.name}
                            {freeShippingEligible && method.cost === 0 && (
                              <span className="ml-2 text-xs font-normal text-green-700 bg-green-100 px-2 py-0.5 rounded-full">FREE</span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {method.description || method.estimatedDays 
                              ? `${method.estimatedDaysMin || method.estimatedDays}-${method.estimatedDaysMax || method.estimatedDays} business days`
                              : 'Delivery estimate available'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          {freeShippingEligible && method.cost === 0
                            ? 'FREE'
                            : formatCurrency(method.cost, product.currency || storeConfig.settings?.currency || 'USD')}
                        </p>
                        {method.estimatedDays && (
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {method.estimatedDaysMin && method.estimatedDaysMax
                              ? `${method.estimatedDaysMin}-${method.estimatedDaysMax} days`
                              : `${method.estimatedDays} days`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : shippingAddress.country && shippingAddress.city ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-600">No shipping methods available for this location.</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Enter your address above to see shipping options.</p>
                </div>
              )}
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                   <p>{product.description}</p>
                   <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Premium quality material</li>
                      <li>Comfortable fit for all-day wear</li>
                      <li>Durable stitching and finish</li>
                   </ul>
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                      <dt className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{key}</dt>
                      <dd className="text-sm font-bold text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
          <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="max-w-4xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
                  {product.reviewCount && product.reviewCount > 0 && product.rating && product.rating > 0 ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={typeof product.rating === 'number' ? product.rating : Number(product.rating) || 0} size="lg" />
                        <span className="text-2xl font-bold text-gray-900">
                          {Number(product.rating).toFixed(1)}
                        </span>
                        <span className="text-lg text-gray-500">out of 5</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-lg text-gray-600">
                        {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <p className="text-base">Be the first to review this product</p>
                    </div>
                  )}
                </div>
              
                <Button 
                  onClick={() => setIsReviewModalOpen(true)} 
                  className="rounded-full shrink-0 bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {product.reviewCount && product.reviewCount > 0 ? 'Write a Review' : 'Be the First to Review'}
                </Button>
              </div>

              {/* Rating Distribution */}
              {ratingDistribution.some(r => r.count > 0) && (
                <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-5">Rating Breakdown</h3>
                  <div className="space-y-3">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 w-20">
                          <span className="text-sm font-semibold text-gray-900">{rating}</span>
                          <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Reviews List or Empty State */}
            {reviews.length > 0 ? (
              <>
              <div className="space-y-6">
                {displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Show More Reviews Button */}
              {hasMoreReviews && !showAllReviews && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllReviews(true)}
                      className="px-8 rounded-full h-12 border-gray-300"
                  >
                    Show All {reviews.length} Reviews
                  </Button>
                </div>
              )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-4">
                  <Star className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  Be the first to review this product and help other customers make informed decisions.
                </p>
                <Button onClick={() => setIsReviewModalOpen(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Write the First Review
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-200">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="h-[400px]">
                  <ProductCard
                    product={relatedProduct}
                    storeSlug={storeConfig.slug}
                    onAddToCart={(p) => addToCart(p, 1)}
                    onQuickView={handleQuickView}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative group">
                  {/* Left half hit target */}
                  <button
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star - 0.5 })}
                    className="absolute top-0 left-0 w-1/2 h-full z-20 focus:outline-none"
                    title={`${star - 0.5} stars`}
                  />
                  {/* Right half hit target */}
                  <button
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="absolute top-0 right-0 w-1/2 h-full z-20 focus:outline-none"
                    title={`${star} stars`}
                  />
                  
                  {/* Visual Star */}
                  <div className="relative pointer-events-none transition-transform group-hover:scale-110">
                    {/* Background */}
                    <Star className="h-8 w-8 text-gray-200 fill-gray-200" />
                    
                    {/* Half Star Overlay */}
                    {newReview.rating >= star - 0.5 && (
                      <div className="absolute inset-0 overflow-hidden" style={{ width: newReview.rating === star - 0.5 ? '50%' : '100%' }}>
                        <Star className="h-8 w-8 text-gray-900 fill-gray-900" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <span className="ml-3 text-lg font-medium text-gray-900 w-12">{newReview.rating}</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Review Title
            </label>
            <input
              type="text"
              id="title"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Summarize your thoughts"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              id="comment"
              required
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="What did you like or dislike?"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Submit Review
            </Button>
      </div>
        </form>
      </Modal>

      {/* Guest Checkout Modal */}
      <GuestCheckoutModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onSubmit={handleGuestInfoSubmit}
        initialData={getGuestUserInfo() || undefined}
      />
    </div>
  );
}

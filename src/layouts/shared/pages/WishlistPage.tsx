'use client';

import { StoreConfig, StoreProduct } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight, Heart, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store-context';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useToast } from '@/components/ui/toast';
import { ProductGridSkeleton } from '@/components/ui/skeletons';
import { formatCurrency } from '@/lib/utils';
// Note: wishlistService removed - using StoreContext instead
// This page is shared and not editable in the editor
interface WishlistItem {
  id: string;
  productId: string;
  product?: any;
}
import { transformProductToStoreProduct } from '@/lib/store-config-utils';
import { useAuth } from '@/lib/auth-context';
import { shouldUseAPI, getBaseStoreSlug } from '@/lib/utils/demo-detection';
import { useLoading } from '@/lib/loading-context';

interface WishlistPageProps {
  storeConfig: StoreConfig;
}

export function WishlistPage({ storeConfig }: WishlistPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;
  const { wishlist, toggleWishlist, addToCart, isWishlistLoading } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<StoreProduct[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const { startBackendLoading, stopBackendLoading } = useLoading();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch wishlist items with product data - single source of truth
  useEffect(() => {
    if (!isClient) return;

    const loadWishlistItems = async () => {
      setIsLoadingItems(true);
      const storeSlug = storeConfig.slug;
      const useAPI = shouldUseAPI(storeSlug);
      
      if (useAPI && isAuthenticated) {
        startBackendLoading();
      }
      
      try {
        // Note: wishlistService removed - using StoreContext wishlist (localStorage-based)
        // Use products from storeConfig filtered by wishlist product IDs
        if (storeConfig.products) {
          // For guests or demo stores, filter from storeConfig.products
          const allProducts = storeConfig.products || [];
          const allMenuItems = storeConfig.menuItems || [];
          
          // Transform menu items to StoreProduct format
          const transformedMenuItems: StoreProduct[] = allMenuItems.map(item => ({
            id: item.id,
            name: item.name,
            slug: item.id, // Use id as slug for menu items
            description: item.description,
            price: item.price,
            images: item.image ? [item.image] : [],
            categoryId: item.categoryId,
            inStock: item.inStock,
            currency: storeConfig.settings?.currency || 'USD',
            variants: [],
            specifications: {},
            rating: 0,
            reviewCount: 0
          }));
          
          const allItems = [...allProducts, ...transformedMenuItems];
          const filteredItems = allItems.filter(item => wishlist.includes(item.id));
          
          // Deduplicate items by product ID
          const uniqueItems = filteredItems.filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
          
          setWishlistItems(uniqueItems);
        }
      } catch (error) {
        console.error('Failed to load wishlist items:', error);
        // Fallback to filtering from storeConfig.products
        const allProducts = storeConfig.products || [];
        const allMenuItems = storeConfig.menuItems || [];
        
        // Transform menu items to StoreProduct format
        const transformedMenuItems: StoreProduct[] = allMenuItems.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.id, // Use id as slug for menu items
          description: item.description,
          price: item.price,
          images: item.image ? [item.image] : [],
          categoryId: item.categoryId,
          inStock: item.inStock,
          currency: storeConfig.settings?.currency || 'USD',
          variants: [],
          specifications: {},
          rating: 0,
          reviewCount: 0
        }));
        
        const allItems = [...allProducts, ...transformedMenuItems];
        const filteredItems = allItems.filter(item => wishlist.includes(item.id));
        
        // Deduplicate items by product ID
        const uniqueItems = filteredItems.filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        );
        
        setWishlistItems(uniqueItems);
      } finally {
        setIsLoadingItems(false);
        if (useAPI && isAuthenticated) {
          stopBackendLoading();
        }
      }
    };

    // Debounce to prevent multiple rapid calls
    const timeoutId = setTimeout(loadWishlistItems, 100);
    return () => clearTimeout(timeoutId);
  }, [isClient, isAuthenticated, wishlist.length, storeConfig.slug]);

  if (!isClient) {
    return <ProductGridSkeleton count={8} columns={4} />;
  }

  // Show loading skeleton while wishlist is loading
  if ((isWishlistLoading || isLoadingItems) && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
          </div>
          <ProductGridSkeleton count={8} columns={4} />
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0 && !isLoadingItems) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-fade-in-up">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Save items you love to your wishlist and revisit them later.
        </p>
        <Link href={`/${storeConfig.slug}`} className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Button 
            size="lg" 
            className="rounded-full px-8 h-12 text-base font-bold shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const handleMoveToCart = (item: any) => {
    // Create a product object compatible with addToCart
    const product = {
      ...item,
      slug: item.slug || item.id,
      images: item.images || (item.image ? [item.image] : []),
      variants: item.variants || [],
      specifications: item.specifications || {},
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0
    };
    
    addToCart(product);
    toggleWishlist(item.id); // Remove from wishlist after adding to cart
    addToast(`${item.name} moved to cart`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb / Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/${storeConfig.slug}`} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
              <p className="text-gray-500 text-sm mt-1">{wishlistItems.length} items saved</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const imageSrc = ('images' in item && item.images && item.images[0]) || ('image' in item ? item.image : '') || '';
            const imageUrl = imageSrc && typeof imageSrc === 'string' && imageSrc.length > 0 ? imageSrc : undefined;
            
            return (
              <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group transition-all hover:shadow-md hover:border-gray-200 flex flex-col">
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                  <ImageWithFallback 
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    skeletonAspectRatio="4/5"
                  />
                  <button 
                    onClick={async () => {
                      try {
                        await toggleWishlist(item.id);
                        // The useEffect will automatically refresh the wishlist items
                        // No need to manually refresh here to avoid duplicates
                        addToast('Removed from wishlist', 'success');
                      } catch (error) {
                        console.error('Failed to remove from wishlist:', error);
                        addToast('Failed to remove from wishlist', 'error');
                      }
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white text-red-500 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="font-black text-lg text-gray-900">{formatCurrency(item.price, item.currency || 'USD')}</span>
                    
                    <Button 
                      onClick={() => handleMoveToCart(item)}
                      size="sm"
                      className="rounded-full px-4 font-bold transition-transform hover:scale-105"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getStoreConfig } from './store-config';
import type { StoreConfig, StoreProduct } from './store-types';
import { shouldUseAPI, getBaseStoreSlug } from './utils/demo-detection';
import { storeService } from './services/store.service';
import { cartService } from './services/cart.service';
import { wishlistService } from './services/wishlist.service';
import { categoryService } from './services/category.service';
import { productService } from './services/product.service';
import { serviceService } from './services/service.service';
import { transformCategoryToStoreCategory, transformProductToStoreProduct, transformServiceToStoreService } from './store-config-utils';
import { useLoading } from './loading-context';
import { normalizePrice, getUserFriendlyErrorMessage } from './utils';
import { useAuth } from './auth-context';
import { analyticsService } from './services/analytics.service';

export interface CartItem {
  id: string; // generated unique id for the cart item (e.g. product_id + variant_id)
  productId: string;
  quantity: number;
  variantId?: string;
  variantName?: string; // For display
  price: number;
  product: StoreProduct;
}

interface StoreContextType {
  store: StoreConfig | null;
  isLoading: boolean;
  error: string | null;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: StoreProduct, quantity?: number, variantId?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCartLoading: boolean;

  // Buy Now (temporary single-item checkout)
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  clearBuyNowItem: () => void;

  // Wishlist
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isWishlistLoading: boolean;
}

const StoreContext = createContext<StoreContextType>({
  store: null,
  isLoading: true,
  error: null,
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateCartQuantity: async () => {},
  cartTotal: 0,
  cartCount: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  isCartLoading: false,
  buyNowItem: null,
  setBuyNowItem: () => {},
  clearBuyNowItem: () => {},
  wishlist: [],
  toggleWishlist: async () => {},
  isInWishlist: () => false,
  isWishlistLoading: false,
});

export function StoreProvider({ 
  children, 
  storeSlug,
  initialConfig 
}: { 
  children: React.ReactNode; 
  storeSlug?: string;
  initialConfig?: StoreConfig | null;
}) {
  const [store, setStore] = useState<StoreConfig | null>(initialConfig || null);
  const [isLoading, setIsLoading] = useState(!initialConfig);
  const [error, setError] = useState<string | null>(null);
  
  // Get auth context for analytics
  let authContext: ReturnType<typeof useAuth> | null = null;
  try {
    authContext = useAuth();
  } catch {
    // AuthProvider not available, continue without it
  }
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  
  // Use loading context - it should be available since LoadingProvider wraps the app
  // If not available, the hook will throw and we'll handle it gracefully
  let loadingContext: ReturnType<typeof useLoading> | null = null;
  try {
    loadingContext = useLoading();
  } catch {
    // LoadingProvider not available in this context, continue without it
  }
  const setLoading = loadingContext?.setLoading;
  const stopPageLoading = loadingContext?.stopPageLoading;
  const startBackendLoading = loadingContext?.startBackendLoading;
  const stopBackendLoading = loadingContext?.stopBackendLoading;
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  
  // Buy Now State (temporary single-item for direct checkout)
  // Initialize from sessionStorage to persist across navigation
  const [buyNowItem, setBuyNowItemState] = useState<CartItem | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem('buyNowItem');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Wrapper to persist to sessionStorage
  const setBuyNowItem = (item: CartItem | null) => {
    setBuyNowItemState(item);
    if (typeof window !== 'undefined') {
      if (item) {
        sessionStorage.setItem('buyNowItem', JSON.stringify(item));
      } else {
        sessionStorage.removeItem('buyNowItem');
      }
    }
  };

  const clearBuyNowItem = () => {
    setBuyNowItemState(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('buyNowItem');
    }
  };
  
  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    if (initialConfig) {
      setStore(initialConfig);
      setIsLoading(false);
      return;
    }

    if (!storeSlug) {
      setIsLoading(false);
      return;
    }

    const loadStore = async () => {
      try {
        setIsLoading(true);
        setLoading?.(true);
        setError(null);

        if (shouldUseAPI(storeSlug)) {
          // Use API for non-demo stores - signal backend loading
          startBackendLoading?.();
          const baseSlug = getBaseStoreSlug(storeSlug);
          console.log('[StoreContext] Loading store from API (client-side):', baseSlug);
          const { store: apiStore } = await storeService.getStoreBySlug(baseSlug);
          
          // Fetch categories, products, and services in parallel
          const [categoriesResult, productsResult, servicesResult] = await Promise.allSettled([
            categoryService.getCategories(apiStore.id).then((apiCategories) =>
              apiCategories.map(transformCategoryToStoreCategory)
            ),
            productService
              .getProducts({
                storeId: apiStore.id,
                limit: 1000,
              })
              .then((response) => response.data.map(transformProductToStoreProduct)),
            serviceService
              .getServices(apiStore.id)
              .then((apiServices) => apiServices.map(transformServiceToStoreService)),
          ]);

          // Extract results with graceful degradation
          const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
          const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
          const services = servicesResult.status === 'fulfilled' ? servicesResult.value : [];

          // Log errors if any occurred
          if (categoriesResult.status === 'rejected') {
            console.error('[StoreContext] Failed to fetch categories:', categoriesResult.reason);
          } else {
            console.log(`[StoreContext] Fetched ${categories.length} categories`);
          }
          if (productsResult.status === 'rejected') {
            console.error('[StoreContext] Failed to fetch products:', productsResult.reason);
          } else {
            console.log(`[StoreContext] Fetched ${products.length} products`);
          }
          if (servicesResult.status === 'rejected') {
            console.error('[StoreContext] Failed to fetch services:', servicesResult.reason);
          } else {
            console.log(`[StoreContext] Fetched ${services.length} services`);
          }

          // Build contactInfo from various sources
          let contactInfo = apiStore.contactInfo || {
            email: apiStore.contactEmail,
            phone: apiStore.contactPhone,
            address: apiStore.address,
          };

          // If contactInfo exists but doesn't have an address, merge Store's address if available
          if (contactInfo && !contactInfo.address && apiStore.address) {
            contactInfo = {
              ...contactInfo,
              address: apiStore.address,
            };
          }

          // Transform API response to StoreConfig format
          const storeConfig: StoreConfig = {
            id: apiStore.id,
            slug: apiStore.slug,
            name: apiStore.name,
            description: apiStore.description || '',
            type: 'generic' as any,
            layout: 'generic' as any,
            branding: {
              primaryColor: apiStore.branding?.primaryColor || '#000000',
              secondaryColor: apiStore.branding?.secondaryColor,
              accentColor: apiStore.branding?.secondaryColor || apiStore.branding?.primaryColor || '#000000',
              logo: apiStore.branding?.logo || apiStore.logo, // Check branding.logo first, then root logo
            },
            navigation: {
              main: [],
              footer: [],
            },
            features: {
              cart: true,
              wishlist: true,
              reviews: true,
              search: true,
              filters: true,
              booking: false,
              delivery: true,
            },
            products,
            categories,
            services,
            settings: {
              currency: apiStore.settings?.currency || 'USD',
              taxRate: apiStore.settings?.taxRate, // Deprecated: kept for backward compatibility
              vat: apiStore.settings?.vat,
              serviceCharge: apiStore.settings?.serviceCharge,
            },
            contactInfo: (contactInfo.email || contactInfo.phone || contactInfo.address) ? contactInfo : undefined,
          } as StoreConfig;
          setStore(storeConfig);
        } else {
          // Use mock data for demo stores
          const baseSlug = getBaseStoreSlug(storeSlug);
          const storeConfig = getStoreConfig(baseSlug);
          if (storeConfig) {
            setStore(storeConfig);
          } else {
            setStore(null);
            setError('Store not found');
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load store';
        setError(errorMessage);
        // Fallback to mock data on error
        const baseSlug = getBaseStoreSlug(storeSlug);
        const storeConfig = getStoreConfig(baseSlug);
        if (storeConfig) {
          setStore(storeConfig);
          setError(null);
        }
      } finally {
        setIsLoading(false);
        setLoading?.(false);
        stopBackendLoading?.();
        // Don't call stopPageLoading here - let content detection handle it
        // Content detection will verify that page content is actually rendered
        // before hiding the skeleton
      }
    };

    loadStore();
  }, [storeSlug, initialConfig]);

  // Load cart/wishlist from API or local storage
  useEffect(() => {
    if (typeof window === 'undefined' || !storeSlug || !store) return;

    const loadCartAndWishlist = async () => {
      if (shouldUseAPI(storeSlug)) {
        // Load from API for non-demo stores - signal backend loading
        startBackendLoading?.();
        try {
          const apiCart = await cartService.getCart();
          if (apiCart?.items) {
            // Transform API cart items to local format
            const transformedCart = apiCart.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              variantId: item.options?.variantId,
              variantName: item.options?.variantName,
              price: normalizePrice(item.price),
              product: item.product ? transformProductToStoreProduct(item.product) : { 
                id: item.productId, 
                name: 'Product', 
                images: [],
                slug: '',
                description: '',
                price: normalizePrice(item.price),
                categoryId: '',
                inStock: true
              },
            }));
            setCart(transformedCart);
          }

          // Load wishlist - use API for authenticated users, localStorage for guests
          if (isAuthenticated) {
            try {
              const apiWishlist = await wishlistService.getWishlist();
              if (apiWishlist) {
                setWishlist(apiWishlist.map((item: any) => item.productId));
              }
            } catch (wishlistError) {
              console.error('Failed to load wishlist from API:', wishlistError);
              // Fallback to localStorage on error
              const savedWishlist = localStorage.getItem(`wishlist_${storeSlug}`);
              if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
            }
          } else {
            // For guests, load from localStorage
            const savedWishlist = localStorage.getItem(`wishlist_${storeSlug}`);
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
          }
        } catch (error) {
          // Fallback to local storage on API error
          const savedCart = localStorage.getItem(`cart_${storeSlug}`);
          const savedWishlist = localStorage.getItem(`wishlist_${storeSlug}`);
          if (savedCart) setCart(JSON.parse(savedCart));
          if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        } finally {
          stopBackendLoading?.();
        }
      } else {
        // Load from local storage for demo stores (no backend loading needed)
        const savedCart = localStorage.getItem(`cart_${storeSlug}`);
        const savedWishlist = localStorage.getItem(`wishlist_${storeSlug}`);
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      }
    };

    loadCartAndWishlist();
  }, [storeSlug, store, isAuthenticated]);
  
  // Sync guest wishlist to backend when user logs in
  useEffect(() => {
    if (isAuthenticated && storeSlug && shouldUseAPI(storeSlug)) {
      const syncGuestWishlist = async () => {
        try {
          // Get guest wishlist from localStorage
          const guestWishlist = localStorage.getItem(`wishlist_${storeSlug}`);
          if (guestWishlist) {
            const productIds = JSON.parse(guestWishlist);
            if (Array.isArray(productIds) && productIds.length > 0) {
              // Get current backend wishlist
              try {
                const apiWishlist = await wishlistService.getWishlist();
                const backendProductIds = apiWishlist.map((item: any) => item.productId);
                
                // Add guest items that aren't in backend
                for (const productId of productIds) {
                  if (!backendProductIds.includes(productId)) {
                    try {
                      await wishlistService.addToWishlist(productId);
                    } catch (error) {
                      console.error(`Failed to sync product ${productId} to wishlist:`, error);
                    }
                  }
                }
                
                // Reload wishlist from API
                const updatedWishlist = await wishlistService.getWishlist();
                setWishlist(updatedWishlist.map((item: any) => item.productId));
                
                // Clear localStorage wishlist after sync
                localStorage.removeItem(`wishlist_${storeSlug}`);
              } catch (error) {
                console.error('Failed to sync guest wishlist:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error syncing guest wishlist:', error);
        }
      };
      
      syncGuestWishlist();
    }
  }, [isAuthenticated, storeSlug]);

  // Sync cart/wishlist to API or local storage
  useEffect(() => {
    if (typeof window === 'undefined' || !storeSlug || !store) return;

    if (shouldUseAPI(storeSlug)) {
      // Sync to API for non-demo stores (debounced)
      const syncTimeout = setTimeout(async () => {
        try {
          // Sync cart items
          const currentApiCart = await cartService.getCart();
          // Compare and sync differences
          // This is a simplified version - in production, you'd want more sophisticated sync logic
        } catch (error) {
          // Fallback to local storage on sync error
          localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
        }
      }, 1000);

      return () => clearTimeout(syncTimeout);
    } else {
      // Save to local storage for demo stores or guests
      localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
      localStorage.setItem(`wishlist_${storeSlug}`, JSON.stringify(wishlist));
    }
    
    // Also save wishlist to localStorage for guests (even when using API)
    if (shouldUseAPI(storeSlug || '') && !isAuthenticated) {
      localStorage.setItem(`wishlist_${storeSlug}`, JSON.stringify(wishlist));
    }
  }, [cart, wishlist, storeSlug, store, isAuthenticated]);

  const addToCart = async (product: StoreProduct, quantity = 1, variantId?: string) => {
    // Validate product is in stock
    if (!product.inStock) {
      console.warn('[StoreContext] Attempted to add out-of-stock product to cart:', product.id);
      // Note: Error message should be shown by the calling component
      throw new Error('This product is currently out of stock');
    }
    
    setIsCartLoading(true);
    startBackendLoading?.();
    try {
      if (shouldUseAPI(storeSlug || '')) {
        // Use API for non-demo stores
        try {
          await cartService.addItem(product.id, quantity, variantId ? { variantId } : {});
          // Reload cart from API
          const apiCart = await cartService.getCart();
          if (apiCart?.items) {
            const transformedCart = apiCart.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              variantId: item.options?.variantId,
              variantName: item.options?.variantName,
              price: normalizePrice(item.price),
              product: item.product ? transformProductToStoreProduct(item.product) : { 
                id: item.productId, 
                name: 'Product', 
                images: [],
                slug: '',
                description: '',
                price: normalizePrice(item.price),
                categoryId: '',
                inStock: true
              },
            }));
            setCart(transformedCart);
          }
          setIsCartOpen(true);
          
          // Track add to cart event
          if (store?.id) {
            analyticsService.trackEvent({
              storeId: store.id,
              eventType: 'add_to_cart',
              userId: isAuthenticated ? (user?.id || null) : null,
              metadata: {
                productId: product.id,
                productName: product.name,
                categoryId: product.categoryId,
                quantity,
                price: product.price,
                variantId,
              },
            }).catch(err => console.warn('Failed to track add to cart:', err));
          }
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          // Fallback to local storage on error
          setCart(prev => {
            const cartItemId = variantId ? `${product.id}-${variantId}` : product.id;
            const existingItem = prev.find(item => item.id === cartItemId);
            if (existingItem) {
              return prev.map(item => 
                item.id === cartItemId 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            }
            return [...prev, {
              id: cartItemId,
              productId: product.id,
              quantity,
              variantId,
              price: product.price,
              product
            }];
          });
          setIsCartOpen(true);
        }
      } else {
        // Use local storage for demo stores
        setCart(prev => {
          const cartItemId = variantId ? `${product.id}-${variantId}` : product.id;
          const existingItem = prev.find(item => item.id === cartItemId);
          if (existingItem) {
            return prev.map(item => 
              item.id === cartItemId 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, {
            id: cartItemId,
            productId: product.id,
            quantity,
            variantId,
            price: product.price,
            product
          }];
        });
        setIsCartOpen(true);
        
        // Track add to cart event for demo stores
        if (store?.id) {
          analyticsService.trackEvent({
            storeId: store.id,
            eventType: 'add_to_cart',
            userId: isAuthenticated ? (user?.id || null) : null,
            metadata: {
              productId: product.id,
              productName: product.name,
              categoryId: product.categoryId,
              quantity,
              price: product.price,
              variantId,
            },
          }).catch(err => console.warn('Failed to track add to cart:', err));
        }
      }
    } finally {
      setIsCartLoading(false);
      stopBackendLoading?.();
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    setIsCartLoading(true);
    startBackendLoading?.();
    try {
      // Get item details before removing for analytics
      const removedItem = cart.find(item => item.id === cartItemId);
      
      if (shouldUseAPI(storeSlug || '')) {
        try {
          await cartService.removeItem(cartItemId);
          // Reload cart from API
          const apiCart = await cartService.getCart();
          if (apiCart?.items) {
            const transformedCart = apiCart.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              variantId: item.options?.variantId,
              variantName: item.options?.variantName,
              price: item.price,
              product: item.product || { id: item.productId, name: 'Product', images: [] },
            }));
            setCart(transformedCart);
          }
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          // Fallback to local storage on error
          setCart(prev => prev.filter(item => item.id !== cartItemId));
        }
      } else {
        setCart(prev => prev.filter(item => item.id !== cartItemId));
      }
      
      // Track remove_from_cart event
      if (removedItem && store?.id) {
        analyticsService.trackEvent({
          storeId: store.id,
          eventType: 'remove_from_cart',
          userId: isAuthenticated ? (user?.id || null) : null,
          metadata: {
            productId: removedItem.productId,
            productName: removedItem.product.name,
            quantity: removedItem.quantity,
            price: removedItem.price,
            variantId: removedItem.variantId,
          },
        }).catch(err => console.warn('Failed to track remove_from_cart:', err));
      }
    } finally {
      setIsCartLoading(false);
      stopBackendLoading?.();
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    setIsCartLoading(true);
    startBackendLoading?.();
    try {
      if (shouldUseAPI(storeSlug || '')) {
        try {
          await cartService.updateItem(cartItemId, quantity);
          // Reload cart from API
          const apiCart = await cartService.getCart();
          if (apiCart?.items) {
            const transformedCart = apiCart.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              variantId: item.options?.variantId,
              variantName: item.options?.variantName,
              price: normalizePrice(item.price),
              product: item.product ? transformProductToStoreProduct(item.product) : { 
                id: item.productId, 
                name: 'Product', 
                images: [],
                slug: '',
                description: '',
                price: normalizePrice(item.price),
                categoryId: '',
                inStock: true
              },
            }));
            setCart(transformedCart);
          }
        } catch (error) {
          console.error('Failed to update cart item:', error);
          // Fallback to local storage on error
          setCart(prev => prev.map(item => 
            item.id === cartItemId ? { ...item, quantity } : item
          ));
        }
      } else {
        setCart(prev => prev.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        ));
      }
    } finally {
      setIsCartLoading(false);
      stopBackendLoading?.();
    }
  };

  const toggleWishlist = async (productId: string) => {
    // REMOVE IN PRODUCTION: Log wishlist toggle
    console.log('[StoreContext] toggleWishlist called:', {
      productId,
      currentWishlist: wishlist,
      isInWishlist: wishlist.includes(productId),
      isAuthenticated,
      storeSlug,
      shouldUseAPI: shouldUseAPI(storeSlug || '')
    });
    
    setIsWishlistLoading(true);
    if (shouldUseAPI(storeSlug || '') && isAuthenticated) {
      startBackendLoading?.();
    }
    try {
      const isInWishlist = wishlist.includes(productId);
      const product = store?.products?.find(p => p.id === productId);
      const productName = product?.name || 'Product';

      if (shouldUseAPI(storeSlug || '')) {
        // For authenticated users, use API
        if (isAuthenticated) {
          try {
            console.log('[StoreContext] Using API for authenticated user');
            if (isInWishlist) {
              // Find wishlist item ID and remove
              const wishlistItems = await wishlistService.getWishlist();
              const item = wishlistItems.find((item: any) => item.productId === productId);
              if (item) {
                await wishlistService.removeFromWishlist(item.id);
              }
              // Track wishlist_remove event
              if (store?.id) {
                analyticsService.trackEvent({
                  storeId: store.id,
                  eventType: 'wishlist_remove',
                  userId: user?.id || null,
                  metadata: {
                    productId,
                    productName,
                  },
                }).catch(err => console.warn('Failed to track wishlist_remove:', err));
              }
            } else {
              await wishlistService.addToWishlist(productId);
              // Track wishlist_add event
              if (store?.id) {
                analyticsService.trackEvent({
                  storeId: store.id,
                  eventType: 'wishlist_add',
                  userId: user?.id || null,
                  metadata: {
                    productId,
                    productName,
                  },
                }).catch(err => console.warn('Failed to track wishlist_add:', err));
              }
            }
            // Reload wishlist from API
            const apiWishlist = await wishlistService.getWishlist();
            // Ensure we have an array before mapping
            const items = Array.isArray(apiWishlist) ? apiWishlist : [];
            const newWishlist = items.map((item: any) => item.productId);
            console.log('[StoreContext] Wishlist updated from API:', newWishlist);
            setWishlist(newWishlist);
          } catch (error) {
            console.error('[StoreContext] Failed to toggle wishlist via API:', error);
            // Fallback to local storage on error
            setWishlist(prev => {
              const updated = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
              // Save to localStorage
              if (storeSlug) {
                localStorage.setItem(`wishlist_${storeSlug}`, JSON.stringify(updated));
              }
              console.log('[StoreContext] Fallback to localStorage:', updated);
              return updated;
            });
            throw error;
          }
        } else {
          // For guests, use localStorage
          console.log('[StoreContext] Using localStorage for guest');
          const wasInWishlist = wishlist.includes(productId);
          setWishlist(prev => {
            const updated = prev.includes(productId)
              ? prev.filter(id => id !== productId)
              : [...prev, productId];
            // Save to localStorage
            if (storeSlug) {
              localStorage.setItem(`wishlist_${storeSlug}`, JSON.stringify(updated));
            }
            console.log('[StoreContext] Guest wishlist updated:', updated);
            return updated;
          });
          // Track wishlist events for guests too
          if (store?.id) {
            analyticsService.trackEvent({
              storeId: store.id,
              eventType: wasInWishlist ? 'wishlist_remove' : 'wishlist_add',
              userId: null,
              metadata: {
                productId,
                productName,
              },
            }).catch(err => console.warn('Failed to track wishlist event:', err));
          }
        }
      } else {
        // Demo stores - use localStorage
        console.log('[StoreContext] Using localStorage for demo store');
        const wasInWishlist = wishlist.includes(productId);
        setWishlist(prev => {
          const updated = prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId];
          // Save to localStorage
          if (storeSlug) {
            localStorage.setItem(`wishlist_${storeSlug}`, JSON.stringify(updated));
          }
          return updated;
        });
        // Track wishlist events for demo stores too
        if (store?.id) {
          analyticsService.trackEvent({
            storeId: store.id,
            eventType: wasInWishlist ? 'wishlist_remove' : 'wishlist_add',
            userId: isAuthenticated ? (user?.id || null) : null,
            metadata: {
              productId,
              productName,
            },
          }).catch(err => console.warn('Failed to track wishlist event:', err));
        }
      }
    } catch (error) {
      console.error('[StoreContext] Error in toggleWishlist:', error);
      throw error;
    } finally {
      setIsWishlistLoading(false);
      if (shouldUseAPI(storeSlug || '') && isAuthenticated) {
        stopBackendLoading?.();
      }
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartTotal = cart.reduce((total, item) => total + (normalizePrice(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider value={{ 
      store, 
      isLoading, 
      error,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      isCartLoading,
      buyNowItem,
      setBuyNowItem,
      clearBuyNowItem,
      wishlist,
      toggleWishlist,
      isInWishlist,
      isWishlistLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

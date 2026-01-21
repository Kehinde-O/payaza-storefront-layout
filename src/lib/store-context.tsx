'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { getStoreConfig } from './store-config';
import type { StoreConfig, StoreProduct } from './store-types';
import { shouldUseAPI, getBaseStoreSlug } from './utils/demo-detection';
import { storeService } from './services/store.service';
// Note: cartService and wishlistService removed - using localStorage only for cart/wishlist
// These services are only needed for shared pages (cart, wishlist, account) which aren't editable in the editor
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

export const StoreContext = createContext<StoreContextType>({
  store: null,
  isLoading: true,
  error: null,
  cart: [],
  addToCart: async () => { },
  removeFromCart: async () => { },
  updateCartQuantity: async () => { },
  cartTotal: 0,
  cartCount: 0,
  isCartOpen: false,
  setIsCartOpen: () => { },
  isCartLoading: false,
  buyNowItem: null,
  setBuyNowItem: () => { },
  clearBuyNowItem: () => { },
  wishlist: [],
  toggleWishlist: async () => { },
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
  const setBuyNowItem = useCallback((item: CartItem | null) => {
    setBuyNowItemState(item);
    if (typeof window !== 'undefined') {
      if (item) {
        sessionStorage.setItem('buyNowItem', JSON.stringify(item));
      } else {
        sessionStorage.removeItem('buyNowItem');
      }
    }
  }, []);

  const clearBuyNowItem = useCallback(() => {
    setBuyNowItemState(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('buyNowItem');
    }
  }, []);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    if (initialConfig) {
      // For live preview/editor, we want to update the store state immediately
      // when initialConfig (which is actually the dynamic config from the editor) changes
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
        // before hiding the skeleton
      }
    };

    loadStore();
  }, [storeSlug, initialConfig]);

  // Load cart/wishlist from local storage only
  // Note: cartService and wishlistService removed - using localStorage only
  // These services are only needed for shared pages (cart, wishlist, account) which aren't editable in the editor
  useEffect(() => {
    if (typeof window === 'undefined' || !storeSlug || !store) return;

    // Load from local storage only
    const savedCart = localStorage.getItem(`cart_${storeSlug}`);
    const savedWishlist = localStorage.getItem(`wishlist_${storeSlug}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse saved wishlist:', error);
      }
    }
  }, [storeSlug, store]);

  // Note: Guest wishlist sync removed - using localStorage only
  // cartService and wishlistService are not available

  // Sync cart/wishlist to local storage only
  // Note: cartService and wishlistService removed - using localStorage only
  useEffect(() => {
    if (typeof window === 'undefined' || !storeSlug || !store) return;

    // Save to local storage
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
    localStorage.setItem(`wishlist_${storeSlug}`, JSON.stringify(wishlist));
  }, [cart, wishlist, storeSlug, store]);

  const addToCart = useCallback(async (product: StoreProduct, quantity = 1, variantId?: string) => {
    // Validate product is in stock
    if (!product.inStock) {
      console.warn('[StoreContext] Attempted to add out-of-stock product to cart:', product.id);
      // Note: Error message should be shown by the calling component
      throw new Error('This product is currently out of stock');
    }

    setIsCartLoading(true);
    try {
      // Use local storage only (cartService removed)
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
    } finally {
      setIsCartLoading(false);
    }
  }, [store?.id, isAuthenticated, user?.id]);

  const removeFromCart = useCallback(async (cartItemId: string) => {
    setIsCartLoading(true);
    try {
      // Get item details before removing for analytics
      const removedItem = cart.find(item => item.id === cartItemId);

      // Use local storage only (cartService removed)
      setCart(prev => prev.filter(item => item.id !== cartItemId));

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
    }
  }, [cart, store?.id, isAuthenticated, user?.id]);

  const updateCartQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    setIsCartLoading(true);
    try {
      // Use local storage only (cartService removed)
      setCart(prev => prev.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      ));
    } finally {
      setIsCartLoading(false);
    }
  }, [removeFromCart]);

  const toggleWishlist = useCallback(async (productId: string) => {
    setIsWishlistLoading(true);
    try {
      const product = store?.products?.find(p => p.id === productId);
      const productName = product?.name || 'Product';
      const wasInWishlist = wishlist.includes(productId);

      // Use local storage only (wishlistService removed)
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

      // Track wishlist events
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
    } catch (error) {
      console.error('[StoreContext] Error in toggleWishlist:', error);
      throw error;
    } finally {
      setIsWishlistLoading(false);
    }
  }, [store?.id, store?.products, wishlist, storeSlug, isAuthenticated, user?.id]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const cartTotal = cart.reduce((total, item) => total + (normalizePrice(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const contextValue = useMemo(() => ({
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
  }), [
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
    isCartLoading,
    buyNowItem,
    setBuyNowItem,
    clearBuyNowItem,
    wishlist,
    toggleWishlist,
    isInWishlist,
    isWishlistLoading
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

'use client';

import React, { useMemo, Suspense } from 'react';
import { StoreConfig } from '@/lib/store-types';
import { useStore } from '@/lib/store-context';
import dynamic from 'next/dynamic';
import { BaseStoreLayout } from '../layouts/shared/components/BaseStoreLayout';

// Helper for dynamic imports with proper error handling and standard loading state
const dynamicPage = (importFn: () => Promise<any>) => dynamic(importFn, {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading experience...</p>
      </div>
    </div>
  ),
  ssr: false // Previews are primarily client-side
});

// Define dynamic components for each layout to avoid loading everything at once
// This significantly reduces RAM usage in development
const PAGES = {
  // Shared / Generic
  CartPage: dynamicPage(() => import('../index').then(mod => mod.CartPage)),
  WishlistPage: dynamicPage(() => import('../index').then(mod => mod.WishlistPage)),
  CheckoutPage: dynamicPage(() => import('../index').then(mod => mod.CheckoutPage)),
  AccountPage: dynamicPage(() => import('../index').then(mod => mod.AccountPage)),
  TeamPage: dynamicPage(() => import('../index').then(mod => mod.TeamPage)),
  PortfolioPage: dynamicPage(() => import('../index').then(mod => mod.PortfolioPage)),
  HelpCenterPage: dynamicPage(() => import('../index').then(mod => mod.HelpCenterPage)),
  ShippingReturnsPage: dynamicPage(() => import('../index').then(mod => mod.ShippingReturnsPage)),
  TrackOrderPage: dynamicPage(() => import('../index').then(mod => mod.TrackOrderPage)),
  TermsPage: dynamicPage(() => import('../index').then(mod => mod.TermsPage)),
  PrivacyPolicyPage: dynamicPage(() => import('../index').then(mod => mod.PrivacyPolicyPage)),
  CookiePolicyPage: dynamicPage(() => import('../index').then(mod => mod.CookiePolicyPage)),
  SizeGuidePage: dynamicPage(() => import('../index').then(mod => mod.SizeGuidePage)),
  GenericPageWrapper: dynamicPage(() => import('../index').then(mod => mod.GenericPageWrapper)),

  // Electronics
  ElectronicsCategoriesPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsCategoriesPage)),
  ElectronicsPageWrapper: dynamicPage(() => import('../index').then(mod => mod.ElectronicsPageWrapper)),
  ElectronicsProductsPageGeneric: dynamicPage(() => import('../index').then(mod => mod.ElectronicsProductsPagePage)),

  // Motivational Speaker
  ServiceDetailPage: dynamicPage(() => import('../index').then(mod => mod.ServiceDetailPage)),
  SubscriptionPage: dynamicPage(() => import('../index').then(mod => mod.SubscriptionPage)),
  MotivationalPageWrapper: dynamicPage(() => import('../index').then(mod => mod.MotivationalPageWrapper)),
};

// Layout-specific page map
const LAYOUT_PAGE_MAP = {
  food: {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.FoodHomePage)),
    ProductsPage: dynamicPage(() => import('../index').then(mod => mod.FoodProductsPage)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.FoodProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.FoodCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.FoodCategoriesPage)),
    MenuPage: dynamicPage(() => import('../index').then(mod => mod.FoodMenuPage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.FoodAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.FoodContactPage)),
  },
  'food-modern': {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.FoodHomePageModern)),
    ProductsPage: dynamicPage(() => import('../index').then(mod => mod.FoodModernProductsPage)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.FoodModernProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.FoodModernCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.FoodModernCategoriesPage)),
    MenuPage: dynamicPage(() => import('../index').then(mod => mod.FoodModernMenuPage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.FoodModernAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.FoodModernContactPage)),
  },
  clothing: {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.ClothingHomePage)),
    ProductsPage: dynamicPage(() => import('../index').then(mod => mod.ClothingProductsPage)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.ClothingProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.ClothingCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.ClothingCategoriesPage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.ClothingAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.ClothingContactPage)),
  },
  'clothing-minimal': {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.ClothingHomePageMinimal)),
    ProductsPage: dynamicPage(() => import('../index').then(mod => mod.ClothingMinimalProductsPage)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.ClothingMinimalProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.ClothingMinimalCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.ClothingMinimalCategoriesPage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.ClothingMinimalAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.ClothingMinimalContactPage)),
  },
  booking: {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.BookingHomePage)),
    BookPage: dynamicPage(() => import('../index').then(mod => mod.BookingBookPage)),
    ServicesPage: dynamicPage(() => import('../index').then(mod => mod.BookingServicesPage)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.BookingProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.BookingCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.BookingCategoriesPage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.BookingAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.BookingContactPage)),
  },
  'booking-agenda': {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.BookingHomePageAgenda)),
    BookPage: dynamicPage(() => import('../index').then(mod => mod.BookingAgendaBookPage)),
    ServicesPage: dynamicPage(() => import('../index').then(mod => mod.BookingAgendaServicesPage)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.BookingAgendaProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.BookingAgendaCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.BookingAgendaCategoriesPage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.BookingAgendaAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.BookingAgendaContactPage)),
  },
  electronics: {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsHomePage)),
    ProductsPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsProductsPagePage)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsCategoriesPagePage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsContactPage)),
  },
  'electronics-grid': {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsHomePageGrid)),
    ProductDetailPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsGridProductDetailPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsGridCategoryPage)),
    CategoriesPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsGridCategoriesPagePage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsGridAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.ElectronicsGridContactPage)),
  },
  'motivational-speaker': {
    HomePage: dynamicPage(() => import('../index').then(mod => mod.MotivationalHomePage)),
    ProductsPage: dynamicPage(() => import('../index').then(mod => mod.MotivationalProductsPage)),
    CategoryPage: dynamicPage(() => import('../index').then(mod => mod.MotivationalCategoryPage)),
    ServicesPage: dynamicPage(() => import('../index').then(mod => mod.MotivationalServicesPage)),
    AboutPage: dynamicPage(() => import('../index').then(mod => mod.MotivationalAboutPage)),
    ContactPage: dynamicPage(() => import('../index').then(mod => mod.MotivationalContactPage)),
  }
};

interface PreviewRouterProps {
  storeConfig: StoreConfig;
  route: string;
  onNavigate?: (route: string) => void;
}

/**
 * PreviewRouter Component
 * 
 * Handles client-side routing for layout previews.
 * Optimized with dynamic imports to reduce memory footprint.
 */
export function PreviewRouter({ storeConfig: initialStoreConfig, route, onNavigate }: PreviewRouterProps) {
  // Use the store from context which is updated in real-time by the editor
  const { store } = useStore();

  // Fallback to initialStoreConfig if store from context is not yet available
  const storeConfig = store || initialStoreConfig;

  const path = route.startsWith('/') ? route : `/${route}`;
  const pathSegments = path.split('/').filter(Boolean);
  const [firstSegment, secondSegment, thirdSegment] = pathSegments;

  const layoutType = storeConfig.layout as keyof typeof LAYOUT_PAGE_MAP;
  const isElectronics = layoutType === 'electronics' || layoutType === 'electronics-grid';
  const isMotivational = layoutType === 'motivational-speaker';

  // Get components for the current layout
  const layoutPages = useMemo(() => {
    return LAYOUT_PAGE_MAP[layoutType] || LAYOUT_PAGE_MAP.food;
  }, [layoutType]);

  // Routing Logic

  // Routing Logic

  // Wrapper for Suspense to ensure smooth loading between routes
  const renderPage = (Component: any, props: any = {}, { withLayout = true }: { withLayout?: boolean } = {}) => (
    <Suspense fallback={null}>
      {withLayout ? (
        <BaseStoreLayout storeConfig={storeConfig}>
          <Component {...props} storeConfig={storeConfig} />
        </BaseStoreLayout>
      ) : (
        <Component {...props} storeConfig={storeConfig} />
      )}
    </Suspense>
  );

  // Homepage route
  if (!firstSegment || path === '/') {
    // booking-agenda homepage is self-contained with its own sidebar, so skip BaseStoreLayout wrapper
    const isBookingAgendaHomepage = layoutType === 'booking-agenda';
    return renderPage(layoutPages.HomePage, {}, { withLayout: !isBookingAgendaHomepage });
  }

  // Route: /account/certificates/[id]
  if (firstSegment === 'account' && secondSegment === 'certificates' && thirdSegment && isMotivational) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">C</div>
          <p className="text-lg font-semibold text-gray-900">Certificate Viewer</p>
          <p className="text-sm text-gray-500 mt-1 mb-6">Certificate ID: {thirdSegment}</p>
          <button
            onClick={() => onNavigate?.('/account')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
          >
            Back to Account
          </button>
        </div>
      </div>
    );
  }

  // Route: /products
  if (firstSegment === 'products' && !secondSegment) {
    if (isElectronics) {
      return renderPage(PAGES.ElectronicsProductsPageGeneric);
    }
    return renderPage((layoutPages as any).ProductsPage);
  }

  // Route: /products/[id]
  if (firstSegment === 'products' && secondSegment) {
    return renderPage((layoutPages as any).ProductDetailPage, { productSlug: secondSegment });
  }

  // Route: /categories
  if (firstSegment === 'categories' && !secondSegment) {
    if (isElectronics) {
      return renderPage(PAGES.ElectronicsCategoriesPage);
    }
    return renderPage((layoutPages as any).CategoriesPage);
  }

  // Route: /categories/[slug]
  if (firstSegment === 'categories' && secondSegment) {
    // ElectronicsPageWrapper is handled by BaseStoreLayout now
    return renderPage((layoutPages as any).CategoryPage, { categorySlug: secondSegment });
  }

  // Route: /menu (for food stores)
  if (firstSegment === 'menu') {
    return renderPage((layoutPages as any).MenuPage, { categorySlug: secondSegment });
  }

  // Common pages shared across layouts
  const COMMON_PAGE_WRAPPERS = {
    // Prefer layout-specific implementations if they exist
    cart: (layoutPages as any).CartPage || PAGES.CartPage,
    wishlist: (layoutPages as any).WishlistPage || PAGES.WishlistPage,
    checkout: (layoutPages as any).CheckoutPage || PAGES.CheckoutPage,
    account: (layoutPages as any).AccountPage || PAGES.AccountPage,

    team: PAGES.TeamPage,
    portfolio: PAGES.PortfolioPage,
    'help-center': PAGES.HelpCenterPage,
    'shipping-returns': PAGES.ShippingReturnsPage,
    'track-order': PAGES.TrackOrderPage,
    terms: PAGES.TermsPage,
    privacy: PAGES.PrivacyPolicyPage,
    'cookie-policy': PAGES.CookiePolicyPage,
    'size-guide': PAGES.SizeGuidePage,
    about: (layoutPages as any).AboutPage || PAGES.GenericPageWrapper,
    contact: (layoutPages as any).ContactPage || PAGES.GenericPageWrapper
  };

  if (firstSegment in COMMON_PAGE_WRAPPERS) {
    const Component = (COMMON_PAGE_WRAPPERS as any)[firstSegment];

    // Check if it's About/Contact which might need a generic wrapper if they are shared components
    // but layout-specific components usually have their own padding/structure
    if (firstSegment === 'about' || firstSegment === 'contact') {
      // If it's a layout-specific page (has 'Clothing' or 'Food' etc in the component name usually, 
      // but here we check if it's from layoutPages)
      const isLayoutSpecific = (layoutPages as any).AboutPage === Component || (layoutPages as any).ContactPage === Component;

      if (!isLayoutSpecific) {
        const Wrapper = PAGES.GenericPageWrapper as any;
        // The Wrapper is wrapped in BaseStoreLayout
        // The Component is passed as children to Wrapper
        return renderPage(Wrapper, {
          children: (
            <Component storeConfig={storeConfig} />
          )
        });
      }
    }

    return renderPage(Component);
  }

  // Special routes
  if (firstSegment === 'book' && (layoutPages as any).BookPage) {
    return renderPage((layoutPages as any).BookPage, { serviceSlug: secondSegment });
  }

  if (firstSegment === 'services' && storeConfig.pageFeatures?.servicesPage !== false) {
    if (isMotivational && secondSegment) {
      return renderPage(PAGES.ServiceDetailPage, { serviceSlug: secondSegment });
    }
    if ((layoutPages as any).ServicesPage) {
      return renderPage((layoutPages as any).ServicesPage);
    }
  }

  if (firstSegment === 'mentorship' && isMotivational && (layoutPages as any).ServicesPage) {
    return renderPage((layoutPages as any).ServicesPage, { initialCategory: 'mentorship', titleOverride: 'Premium Mentorship' });
  }

  if (firstSegment === 'subscription' && isMotivational) {
    return renderPage(PAGES.SubscriptionPage);
  }

  // Fallback for success/callback pages
  if (firstSegment === 'order' && secondSegment === 'success') {
    const primaryColor = storeConfig.branding.primaryColor;
    const Wrapper = PAGES.GenericPageWrapper as any;
    return renderPage(Wrapper, {
      children: (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div
                className="mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been received.</p>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate?.('/')}
                  className="w-full px-4 py-2.5 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => onNavigate?.('/account')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    });
  }

  // 404 Fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm mx-auto">
        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">!</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Page not found</h3>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">The page you're looking for doesn't exist in this preview experience.</p>
        <button
          onClick={() => onNavigate?.('/')}
          className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

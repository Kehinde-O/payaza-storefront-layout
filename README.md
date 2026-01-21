# payaza-storefront-layouts

A comprehensive package of shared layout components, utilities, and services for StoreFront applications. This package contains all layout components, UI components, hooks, contexts, and utility functions used across Payaza StoreFront applications.

## Overview

This package provides a complete set of reusable layout components that are data-agnostic and accept `storeConfig` as props, allowing multiple stores to use the same layout instances with different data. It includes:

- **9 Layout Types**: Food, Food Modern, Clothing, Clothing Minimal, Booking, Booking Agenda, Electronics, Electronics Grid, and Motivational Speaker
- **Shared Components**: Base layouts, headers, footers, and common page components
- **UI Components**: Buttons, modals, toasts, product cards, and more
- **Learning Components**: Certificate templates, mentorship progress, and certificate viewer
- **Services**: API services for checkout, payment, shipping, orders, and more
- **Utilities**: Asset helpers, currency formatting, demo detection, and more
- **Contexts**: Auth, Store, and Loading contexts

## Installation

```bash
npm install payaza-storefront-layouts
```

Or using npm workspaces:

```json
{
  "dependencies": {
    "payaza-storefront-layouts": "workspace:*"
  }
}
```

## Peer Dependencies

This package requires the following peer dependencies (must be installed in your project):

```json
{
  "@tailwindcss/postcss": "^4.0.0",
  "framer-motion": "^12.0.0",
  "next": "^16.0.3",
  "postcss": "^8.0.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tailwindcss": "^4.0.0"
}
```

## CSS Setup

This package includes a complete CSS file with Tailwind CSS v4, custom utilities, and styles. To use the layouts, you need to:

### 1. Install Peer Dependencies

```bash
npm install tailwindcss@^4.0.0 @tailwindcss/postcss@^4.0.0 postcss@^8.0.0
```

### 2. Configure PostCSS

Create or update `postcss.config.mjs` in your project root:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### 3. CSS is Automatically Imported

**No separate CSS import needed!** The styles are automatically imported when you import any component from the package:

```typescript
import { FoodHomePage } from 'payaza-storefront-layouts';
// Styles are automatically loaded - no additional import needed
```

If you need to import styles separately (e.g., in a CSS file), you can still use:

```css
@import "payaza-storefront-layouts/styles";
```

### 4. Configure Tailwind Content Paths

If you're using a traditional Tailwind config, ensure it scans the package files:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/payaza-storefront-layouts/dist/**/*.{js,jsx}',
  ],
  // ... rest of config
};

export default config;
```

**Note**: With Tailwind CSS v4, you typically don't need a `tailwind.config.ts` file. The `@import "tailwindcss"` directive in the CSS file handles everything automatically.

### Alternative: Use Your Own Tailwind Setup

If you prefer to use your own Tailwind configuration, you can:

1. Skip importing the package CSS file
2. Configure Tailwind to scan the package files as shown above
3. Ensure you have the required custom utilities and CSS variables in your own CSS

The package CSS includes:
- Tailwind CSS v4 base styles
- `tw-animate-css` animations
- Custom utility classes (glassmorphism, animations, scroll utilities)
- Custom NProgress styles
- CSS variables for theming

## Usage

### Basic Layout Usage

```typescript
import { FoodHomePage, FoodProductsPage, FoodProductDetailPage } from 'payaza-storefront-layouts';

export default function StorePage({ storeConfig }) {
  return <FoodHomePage storeConfig={storeConfig} />;
}
```

### Using Layout-Specific Pages

```typescript
import {
  FoodProductsPage,
  FoodProductDetailPage,
  FoodCategoryPage,
  FoodCategoriesPage,
  FoodMenuPage,
  FoodAboutPage,
  FoodContactPage
} from 'payaza-storefront-layouts';

// Use layout-specific pages
<FoodProductsPage storeConfig={storeConfig} />
<FoodProductDetailPage storeConfig={storeConfig} productId="123" />
```

### Using Shared Components

```typescript
import {
  BaseStoreLayout,
  GenericPageWrapper,
  StoreHeader,
  StoreFooter,
  AccountPage,
  CartPage,
  CheckoutPage
} from 'payaza-storefront-layouts';

<BaseStoreLayout storeConfig={storeConfig}>
  {/* Your content */}
</BaseStoreLayout>
```

### Using Learning Components

```typescript
import {
  CertificateCard,
  CertificateViewer,
  MentorshipProgress
} from 'payaza-storefront-layouts';

<CertificateCard 
  certificate={certificateData} 
  onDownload={(id) => console.log('Download', id)} 
/>
```

### Using Utilities

```typescript
import {
  formatCurrency,
  filterActiveServices,
  getBannerImage,
  getServiceImage,
  getThemeColor,
  isDemoStore,
  shouldUseAPI
} from 'payaza-storefront-layouts';

const price = formatCurrency(1000, 'NGN'); // "₦1,000.00"
const activeServices = filterActiveServices(services);
const bannerUrl = getBannerImage(storeConfig);
```

### Using JSON Layout Data

```typescript
import { getLayoutJSON, layoutJSONMap } from 'payaza-storefront-layouts/json';

const layoutData = getLayoutJSON('food');
// or
const layoutData = layoutJSONMap.get('food');
```

## Available Layouts

### Food Layouts
- `FoodHomePage` - Main homepage component
- `FoodProductsPage` - Products listing page
- `FoodProductDetailPage` - Product detail page
- `FoodCategoryPage` - Category detail page
- `FoodCategoriesPage` - Categories listing page
- `FoodMenuPage` - Menu page
- `FoodAboutPage` - About page
- `FoodContactPage` - Contact page

### Food Modern Layouts
- `FoodHomePageModern` - Modern food homepage
- `FoodModernProductsPage` - Modern products page
- `FoodModernProductDetailPage` - Modern product detail
- `FoodModernCategoryPage` - Modern category page
- `FoodModernCategoriesPage` - Modern categories page
- `FoodModernMenuPage` - Modern menu page
- `FoodModernAboutPage` - Modern about page
- `FoodModernContactPage` - Modern contact page

### Clothing Layouts
- `ClothingHomePage` - Clothing homepage
- `ClothingProductsPage` - Products page
- `ClothingProductDetailPage` - Product detail
- `ClothingCategoryPage` - Category page
- `ClothingCategoriesPage` - Categories page
- `ClothingAboutPage` - About page
- `ClothingContactPage` - Contact page

### Clothing Minimal Layouts
- `ClothingHomePageMinimal` - Minimal clothing homepage
- `ClothingMinimalProductsPage` - Minimal products page
- `ClothingMinimalProductDetailPage` - Minimal product detail
- `ClothingMinimalCategoryPage` - Minimal category page
- `ClothingMinimalCategoriesPage` - Minimal categories page
- `ClothingMinimalAboutPage` - Minimal about page
- `ClothingMinimalContactPage` - Minimal contact page

### Booking Layouts
- `BookingHomePage` - Booking homepage
- `BookingBookPage` - Book appointment page
- `BookingServicesPage` - Services listing page
- `BookingProductDetailPage` - Service detail page
- `BookingCategoryPage` - Category page
- `BookingCategoriesPage` - Categories page
- `BookingAboutPage` - About page
- `BookingContactPage` - Contact page

### Booking Agenda Layouts
- `BookingHomePageAgenda` - Agenda-based booking homepage
- `BookingAgendaBookPage` - Agenda book page
- `BookingAgendaServicesPage` - Agenda services page
- `BookingAgendaProductDetailPage` - Agenda service detail
- `BookingAgendaCategoryPage` - Agenda category page
- `BookingAgendaCategoriesPage` - Agenda categories page
- `BookingAgendaAboutPage` - Agenda about page
- `BookingAgendaContactPage` - Agenda contact page

### Electronics Layouts
- `ElectronicsHomePage` - Electronics homepage
- `ElectronicsProductsPage` - Products page
- `ElectronicsProductDetailPage` - Product detail
- `ElectronicsCategoryPage` - Category page
- `ElectronicsCategoriesPage` - Categories page
- `ElectronicsAboutPage` - About page
- `ElectronicsContactPage` - Contact page
- `ElectronicsHelpCenterPage` - Help center page
- `ElectronicsPrivacyPolicyPage` - Privacy policy page
- `ElectronicsShippingReturnsPage` - Shipping & returns page
- `ElectronicsTermsPage` - Terms page
- `ElectronicsTrackOrderPage` - Track order page
- `ElectronicsPageWrapper` - Page wrapper component
- `ElectronicsStoreHeader` - Store header
- `ElectronicsStoreFooter` - Store footer

### Electronics Grid Layouts
- `ElectronicsHomePageGrid` - Grid-based electronics homepage
- `ElectronicsGridProductsPage` - Grid products page
- `ElectronicsGridProductDetailPage` - Grid product detail
- `ElectronicsGridCategoryPage` - Grid category page
- `ElectronicsGridCategoriesPage` - Grid categories page
- `ElectronicsGridAboutPage` - Grid about page
- `ElectronicsGridContactPage` - Grid contact page
- `ElectronicsGridHelpCenterPage` - Grid help center page
- `ElectronicsGridPrivacyPolicyPage` - Grid privacy policy page
- `ElectronicsGridShippingReturnsPage` - Grid shipping & returns page
- `ElectronicsGridTermsPage` - Grid terms page
- `ElectronicsGridTrackOrderPage` - Grid track order page

### Motivational Speaker Layouts
- `MotivationalHomePage` - Motivational speaker homepage
- `MotivationalProductsPage` - Products page
- `MotivationalCategoryPage` - Category page
- `MotivationalServicesPage` - Services page
- `MotivationalServiceDetailPage` - Service detail page
- `MotivationalSubscriptionPage` - Subscription page
- `MotivationalAboutPage` - About page
- `MotivationalContactPage` - Contact page
- `MotivationalPageWrapper` - Page wrapper component

### Shared Components
- `BaseStoreLayout` - Base layout wrapper for all stores
- `GenericPageWrapper` - Generic page wrapper
- `StoreHeader` - Store header component
- `StoreFooter` - Store footer component
- `PromoBanner` - Promotional banner component
- `TestimonialCard` - Testimonial card component

### Shared Pages
- `AccountPage` - User account page with tabs (Profile, Orders, Bookings, Wishlist, Learning)
- `CartPage` - Shopping cart page
- `CheckoutPage` - Checkout page
- `WishlistPage` - Wishlist page
- `TeamPage` - Team members page
- `PortfolioPage` - Portfolio page
- `HelpCenterPage` - Help center page
- `ShippingReturnsPage` - Shipping & returns page
- `PrivacyPolicyPage` - Privacy policy page
- `TermsPage` - Terms of service page
- `CookiePolicyPage` - Cookie policy page
- `SizeGuidePage` - Size guide page
- `StyleGuidePage` - Style guide page
- `TrackOrderPage` - Track order page
- `MaintenancePage` - Maintenance mode page
- `FeatureDisabledPage` - Feature disabled page

### Learning Components
- `CertificateCard` - Certificate card component
- `CertificateViewer` - Certificate viewer component
- `MentorshipProgress` - Mentorship progress component

## Utilities

### Asset Helpers
```typescript
import {
  getBannerImage,
  getServiceImage,
  getTeamMemberImage,
  getTextContent,
  getLayoutText,
  getThemeColor,
  getLogoUrl
} from 'payaza-storefront-layouts';
```

### Currency & Formatting
```typescript
import {
  formatCurrency,
  normalizePrice,
  getCurrencySymbol,
  getCurrencySymbolInfo
} from 'payaza-storefront-layouts';
```

### Demo Detection
```typescript
import {
  isDemoStore,
  shouldUseAPI,
  getBaseStoreSlug
} from 'payaza-storefront-layouts';
```

### Filtering
```typescript
import {
  filterActiveProducts,
  filterActiveServices
} from 'payaza-storefront-layouts';
```

### Store Configuration
```typescript
import {
  getStoreConfigAsync,
  transformProductToStoreProduct,
  extractImageUrls
} from 'payaza-storefront-layouts';
```

## Services

The package includes service stubs for:
- `checkoutService` - Checkout operations
- `paymentService` - Payment processing
- `shippingService` - Shipping operations
- `orderService` - Order management
- `wishlistService` - Wishlist operations
- `customerService` - Customer management
- `bookingService` - Booking operations
- `cartService` - Cart operations
- `productService` - Product operations
- `categoryService` - Category operations
- `reviewService` - Review operations
- `analyticsService` - Analytics tracking

## Contexts

### Auth Context
```typescript
import { AuthProvider, useAuth } from 'payaza-storefront-layouts';

<AuthProvider>
  <YourApp />
</AuthProvider>

// In components
const { user, isAuthenticated, login, logout } = useAuth();
```

### Store Context
```typescript
import { StoreProvider, useStore } from 'payaza-storefront-layouts';

const { storeConfig, updateStoreConfig } = useStore();
```

### Loading Context
```typescript
import { LoadingProvider, useLoading } from 'payaza-storefront-layouts';

const { startBackendLoading, stopBackendLoading } = useLoading();
```

## Hooks

### Analytics Hook
```typescript
import { useAnalytics } from 'payaza-storefront-layouts';

const { trackEvent, trackPageView } = useAnalytics();
```

## TypeScript Configuration

Consuming apps need to configure TypeScript paths. The package uses relative imports internally, so no special path configuration is required for the package itself.

For your app's internal `@/` aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Next.js Configuration

Add to `next.config.ts`:

```typescript
const nextConfig = {
  transpilePackages: ['payaza-storefront-layouts'],
};
```

## Building

```bash
npm run build
```

This will:
1. Clean the `dist/` directory
2. Compile TypeScript to JavaScript
3. Transform path aliases using `tsc-alias`
4. Copy JSON files to the dist directory

## Package Structure

```
payaza-storefront-layouts/
├── dist/                    # Compiled output
│   ├── layouts/             # Layout components
│   ├── components/          # UI components
│   ├── lib/                 # Utilities, services, contexts
│   ├── hooks/               # Custom hooks
│   └── json/                # Layout JSON data
├── src/                     # Source files
└── package.json
```

## Dynamic Data Support

Layouts are designed to work with dynamic data:

- All layout components accept `storeConfig: StoreConfig` as props
- Layouts use hooks like `useStore()` from consuming apps
- No hardcoded data - all data comes from consuming apps
- Supports `preview_layout` query parameter for layout preview
- Demo store detection for mock data vs API data

## Features

- ✅ **9 Complete Layout Types** - Food, Clothing, Booking, Electronics, and more
- ✅ **Shared Components** - Reusable components across all layouts
- ✅ **Learning Components** - Certificate and mentorship features
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Utility Functions** - Currency formatting, asset helpers, filtering
- ✅ **Service Stubs** - Ready-to-use service interfaces
- ✅ **Context Providers** - Auth, Store, and Loading contexts
- ✅ **Custom Hooks** - Analytics and more
- ✅ **Responsive Design** - All components are mobile-responsive
- ✅ **Accessibility** - ARIA labels and keyboard navigation support

## Version

Current version: **1.0.0**

## License

ISC

## Support

For issues, questions, or contributions, please contact the Payaza development team.

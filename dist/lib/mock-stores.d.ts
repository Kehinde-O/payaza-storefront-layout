import { StoreConfig } from './store-types';
/**
 * Feature Flags System:
 *
 * Use `pageFeatures` to enable/disable specific pages based on business type:
 *
 * - `teamPage`: For businesses that showcase their team (wellness, spa, medical, etc.)
 * - `portfolioPage`: For creative businesses (makeup, photography, design, etc.)
 * - `servicesPage`: For booking/service-based stores
 * - `aboutPage`: For "About Us" page
 * - `helpCenterPage`: For customer support
 * - `shippingReturnsPage`: For e-commerce stores
 * - `trackOrderPage`: For order tracking
 *
 * Navigation items in `navigation.main` should match enabled pages.
 * Routing will automatically respect these flags and return 404 for disabled pages.
 */
export declare const mockStores: StoreConfig[];
export declare function getStoreConfig(slug: string): StoreConfig | null;
export declare function getAllStores(): Array<Pick<StoreConfig, 'slug' | 'name' | 'description' | 'type' | 'branding'>>;
export declare function isValidStoreSlug(slug: string): boolean;
//# sourceMappingURL=mock-stores.d.ts.map
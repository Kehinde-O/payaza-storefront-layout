/**
 * URL helper utilities for handling both custom domain and platform domain URLs
 */
/**
 * Get the store URL prefix based on whether we're on a custom domain
 * For custom domains: returns empty string (no slug in URL)
 * For platform domains: returns /{storeSlug}
 *
 * @param storeSlug - The store slug
 * @returns The URL prefix (empty for custom domains, /{slug} for platform)
 */
export declare function getStoreUrlPrefix(storeSlug: string): string;
/**
 * Generate a store-relative URL that works for both custom and platform domains
 *
 * @param storeSlug - The store slug
 * @param path - The path (e.g., '/products', '/account/orders/123')
 * @returns The full URL path
 */
export declare function getStoreUrl(storeSlug: string, path: string): string;
/**
 * Generate a store-relative URL with query parameters
 *
 * @param storeSlug - The store slug
 * @param path - The path
 * @param queryParams - Query parameters object
 * @returns The full URL path with query string
 */
export declare function getStoreUrlWithQuery(storeSlug: string, path: string, queryParams: Record<string, string | number | null | undefined>): string;
//# sourceMappingURL=url-helpers.d.ts.map
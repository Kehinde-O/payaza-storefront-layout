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
export function getStoreUrlPrefix(storeSlug) {
    // Check if we're on a custom domain by checking if hostname doesn't match platform domains
    if (typeof window === 'undefined') {
        // Server-side: we can't detect custom domain here, assume platform domain
        return `/${storeSlug}`;
    }
    const hostname = window.location.hostname;
    const isPlatformDomain = hostname.includes('store.payaza.africa') ||
        hostname.includes('localhost') ||
        hostname.endsWith('.vercel.app');
    // If on platform domain, include slug. If on custom domain, no slug.
    return isPlatformDomain ? `/${storeSlug}` : '';
}
/**
 * Generate a store-relative URL that works for both custom and platform domains
 *
 * @param storeSlug - The store slug
 * @param path - The path (e.g., '/products', '/account/orders/123')
 * @returns The full URL path
 */
export function getStoreUrl(storeSlug, path) {
    const prefix = getStoreUrlPrefix(storeSlug);
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${prefix}${normalizedPath}`;
}
/**
 * Generate a store-relative URL with query parameters
 *
 * @param storeSlug - The store slug
 * @param path - The path
 * @param queryParams - Query parameters object
 * @returns The full URL path with query string
 */
export function getStoreUrlWithQuery(storeSlug, path, queryParams) {
    const baseUrl = getStoreUrl(storeSlug, path);
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            params.append(key, String(value));
        }
    });
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

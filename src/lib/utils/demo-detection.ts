/**
 * Demo Detection Utility
 * 
 * Determines if a store is a demo store and whether to use API or mock data.
 * Demo stores are identified by:
 * - Routes starting with /demo/
 * - Store slugs starting with "demo/"
 */

/**
 * Check if a store slug represents a demo store
 */
export function isDemoStore(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return slug.startsWith('demo/') || slug.startsWith('demo-');
}

/**
 * Determine if API should be used for a given store slug
 * Returns false for demo stores (use mock data), true for real stores (use API)
 */
export function shouldUseAPI(slug: string | undefined | null): boolean {
  return !isDemoStore(slug);
}

/**
 * Extract the base store slug from a demo slug
 * e.g., "demo/savory-bites" -> "savory-bites"
 */
export function getBaseStoreSlug(slug: string): string {
  if (slug.startsWith('demo/')) {
    return slug.replace('demo/', '');
  }
  if (slug.startsWith('demo-')) {
    return slug.replace('demo-', '');
  }
  return slug;
}


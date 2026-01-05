/**
 * Content selectors for different route types
 * Used to detect when page content is ready for display
 */

export type RouteType = 'product-detail' | 'products' | 'categories' | 'category-detail' | 'generic';

export interface ContentSelectorConfig {
  selectors: string[];
  minElements?: number; // Minimum number of elements that must be visible
  minPercentage?: number; // Minimum percentage of expected elements (0-100)
  requiredSelectors?: string[]; // Selectors that must all be present
}

export const CONTENT_SELECTORS: Record<RouteType, ContentSelectorConfig> = {
  'product-detail': {
    selectors: [
      '[data-product-name]',
      '[data-product-image]',
      '[data-product-price]',
      '[data-add-to-cart]',
    ],
    requiredSelectors: [
      '[data-product-name]',
      '[data-product-image]',
      '[data-product-price]',
    ],
    minPercentage: 75, // At least 75% of required elements must be present
  },
  'products': {
    selectors: ['[data-product-card]'],
    minElements: 3, // At least 3 product cards must be visible
    minPercentage: 60, // Or 60% of expected cards
  },
  'categories': {
    selectors: ['[data-category-card]'],
    minElements: 2, // At least 2 category cards must be visible
    minPercentage: 50, // Or 50% of expected cards
  },
  'category-detail': {
    selectors: ['[data-product-card]'],
    minElements: 2, // At least 2 product cards must be visible
    minPercentage: 50,
  },
  'generic': {
    selectors: [
      '[data-content-ready]',
      'h1, h2, h3', // Any heading
      'main', // Main content area
      'article', // Article content
      '.container', // Container elements
    ],
    minElements: 1,
    minPercentage: 30, // Lower threshold for generic pages
  },
};

/**
 * Get content selectors for a given route type
 */
export function getContentSelectors(routeType: RouteType): ContentSelectorConfig {
  return CONTENT_SELECTORS[routeType] || CONTENT_SELECTORS.generic;
}

/**
 * Detect route type from pathname
 */
export function detectRouteType(pathname: string): RouteType {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length >= 2) {
    const firstSegment = segments[1];
    const secondSegment = segments[2];
    
    if (firstSegment === 'products' && secondSegment) {
      return 'product-detail';
    }
    
    if (firstSegment === 'products' && !secondSegment) {
      return 'products';
    }
    
    if (firstSegment === 'categories' && secondSegment) {
      return 'category-detail';
    }
    
    if (firstSegment === 'categories' && !secondSegment) {
      return 'categories';
    }
  }
  
  return 'generic';
}


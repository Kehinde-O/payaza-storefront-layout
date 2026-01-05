/**
 * Content selectors for different route types
 * Used to detect when page content is ready for display
 */
export type RouteType = 'product-detail' | 'products' | 'categories' | 'category-detail' | 'generic';
export interface ContentSelectorConfig {
    selectors: string[];
    minElements?: number;
    minPercentage?: number;
    requiredSelectors?: string[];
}
export declare const CONTENT_SELECTORS: Record<RouteType, ContentSelectorConfig>;
/**
 * Get content selectors for a given route type
 */
export declare function getContentSelectors(routeType: RouteType): ContentSelectorConfig;
/**
 * Detect route type from pathname
 */
export declare function detectRouteType(pathname: string): RouteType;
//# sourceMappingURL=content-selectors.d.ts.map
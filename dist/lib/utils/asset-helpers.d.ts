import { StoreConfig } from '../../lib/store-types';
/**
 * Gets text content from backend assignedText for real stores, or returns fallback for demo stores
 * @param storeConfig - The store configuration
 * @param textKey - Key to look up in layoutConfig.assignedText (e.g., 'hero_title', 'team_section_title')
 * @param fallbackText - Fallback text to use for demo stores or when text is missing
 * @returns Text content string
 */
export declare function getTextContent(storeConfig: StoreConfig | null | undefined, textKey: string, fallbackText: string): string;
/**
 * Gets an array of features/benefits from backend
 * Checks new structured text system first, then assignedText (legacy), or returns fallback array
 * @param storeConfig - The store configuration
 * @param textKeyPrefix - Prefix for feature keys (e.g., 'team_feature_' will look for 'team_feature_1', 'team_feature_2', etc.)
 * @param fallbackFeatures - Fallback array of features for demo stores or when features are missing
 * @returns Array of feature strings
 */
export declare function getFeaturesList(storeConfig: StoreConfig | null | undefined, textKeyPrefix: string, fallbackFeatures: string[]): string[];
/**
 * Gets an asset URL from the backend for real stores, or returns fallback for demo stores
 * @param storeConfig - The store configuration
 * @param assetKey - Key to look up in layoutConfig.assignedAssets
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export declare function getAssetUrl(storeConfig: StoreConfig | null | undefined, assetKey: string, fallbackUrl: string): string;
/**
 * Gets a hero/promo banner image from backend
 * Checks multiple sources: assignedAssets, banner, then fallback
 * @param storeConfig - The store configuration
 * @param assetKey - Key to look up in layoutConfig.assignedAssets (e.g., 'hero_bg', 'promo_banner')
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export declare function getBannerImage(storeConfig: StoreConfig | null | undefined, assetKey: string, fallbackUrl: string): string;
/**
 * Gets a team member image from backend
 * Checks team page members first, then assignedAssets
 * @param storeConfig - The store configuration
 * @param memberName - Optional name to match team member
 * @param assetKey - Key to look up in layoutConfig.assignedAssets (e.g., 'specialist_image')
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export declare function getTeamMemberImage(storeConfig: StoreConfig | null | undefined, memberName: string | null | undefined, assetKey: string, fallbackUrl: string): string;
/**
 * Gets a service image from backend, with fallback
 * @param serviceImage - Image from service object (may be from backend)
 * @param storeConfig - The store configuration
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export declare function getServiceImage(serviceImage: string | undefined | null, storeConfig: StoreConfig | null | undefined, fallbackUrl: string): string;
/**
 * Gets text content from layoutConfig.text hierarchy using dot notation path
 * Falls back to common text, then fallback parameter
 * @param storeConfig - The store configuration
 * @param path - Dot notation path (e.g., 'hero.title', 'sections.categories.viewAll', 'common.shopNow')
 * @param fallbackText - Fallback text to use when text is missing
 * @returns Text content string
 */
export declare function getLayoutText(storeConfig: StoreConfig | null | undefined, path: string, fallbackText: string): string;
/**
 * Gets text content with priority:
 * 1. layoutConfig.text (new system) - using getLayoutText
 * 2. layoutConfig.assignedText (legacy system)
 * 3. fallback
 * @param storeConfig - The store configuration
 * @param textKey - Key to look up (can be dot notation path for new system or legacy key)
 * @param fallbackText - Fallback text to use when text is missing
 * @returns Text content string
 */
export declare function getTextContentV2(storeConfig: StoreConfig | null | undefined, textKey: string, fallbackText: string): string;
/**
 * Gets logo URL from backend for real stores, or returns null for demo stores
 * @param storeConfig - The store configuration
 * @returns Logo URL string or null
 */
export declare function getLogoUrl(storeConfig: StoreConfig | null | undefined): string | null;
/**
 * Gets a theme color from layout configuration with fallback
 * @param storeConfig - The store configuration
 * @param category - Color category (background, text, border, gradient, accent, layoutSpecific)
 * @param key - Color key within the category (e.g., 'primary', 'secondary', 'blob1')
 * @param fallback - Fallback color value
 * @returns Color string
 */
export declare function getThemeColor(storeConfig: StoreConfig | null | undefined, category: 'background' | 'text' | 'border' | 'gradient' | 'accent' | 'layoutSpecific', key: string, fallback: string): string;
/**
 * Gets multiple theme colors at once
 * @param storeConfig - The store configuration
 * @param colorMap - Map of color keys to fallback values
 * @returns Object with color values
 */
export declare function getThemeColors<T extends Record<string, string>>(storeConfig: StoreConfig | null | undefined, colorMap: {
    [K in keyof T]: {
        category: 'background' | 'text' | 'border' | 'gradient' | 'accent' | 'layoutSpecific';
        key: string;
        fallback: string;
    };
}): T;
//# sourceMappingURL=asset-helpers.d.ts.map
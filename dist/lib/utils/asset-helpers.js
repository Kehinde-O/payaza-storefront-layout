import { shouldUseAPI } from './demo-detection';
function normalizeAssetUrl(url) {
    if (typeof url !== 'string')
        return null;
    const trimmed = url.trim();
    if (!trimmed)
        return null;
    // Basic sanity guard: avoid obvious non-urls like "undefined"/"null"
    if (trimmed === 'undefined' || trimmed === 'null')
        return null;
    return trimmed;
}
function pickFirstAssetUrl(...candidates) {
    for (const c of candidates) {
        const normalized = normalizeAssetUrl(c);
        if (normalized)
            return normalized;
    }
    return null;
}
/**
 * Gets text content from backend assignedText for real stores, or returns fallback for demo stores
 * @param storeConfig - The store configuration
 * @param textKey - Key to look up in layoutConfig.assignedText (e.g., 'hero_title', 'team_section_title')
 * @param fallbackText - Fallback text to use for demo stores or when text is missing
 * @returns Text content string
 */
export function getTextContent(storeConfig, textKey, fallbackText) {
    if (!storeConfig) {
        return fallbackText;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always use fallback
    if (!isRealStore) {
        return fallbackText;
    }
    // For real stores, try to get text from backend
    const assignedText = storeConfig.layoutConfig?.assignedText;
    if (assignedText && typeof assignedText === 'object') {
        const textValue = assignedText[textKey];
        if (textValue && typeof textValue === 'string' && textValue.trim()) {
            return textValue.trim();
        }
    }
    // If text not found, return fallback
    return fallbackText;
}
/**
 * Gets an array of features/benefits from backend
 * Checks new structured text system first, then assignedText (legacy), or returns fallback array
 * @param storeConfig - The store configuration
 * @param textKeyPrefix - Prefix for feature keys (e.g., 'team_feature_' will look for 'team_feature_1', 'team_feature_2', etc.)
 * @param fallbackFeatures - Fallback array of features for demo stores or when features are missing
 * @returns Array of feature strings
 */
export function getFeaturesList(storeConfig, textKeyPrefix, fallbackFeatures) {
    if (!storeConfig) {
        return fallbackFeatures;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always use fallback
    if (!isRealStore) {
        return fallbackFeatures;
    }
    // Try new structured text system first (e.g., sections.team.features)
    // Extract section name from prefix (e.g., 'team_feature_' -> 'team')
    const sectionMatch = textKeyPrefix.match(/^(\w+)_feature_/);
    if (sectionMatch && storeConfig.layoutConfig?.text) {
        const sectionName = sectionMatch[1];
        const textConfig = storeConfig.layoutConfig.text;
        // Try to get features from sections.{sectionName}.features array
        if (textConfig.sections &&
            typeof textConfig.sections === 'object' &&
            sectionName in textConfig.sections) {
            const section = textConfig.sections[sectionName];
            if (section && typeof section === 'object' && 'features' in section) {
                const features = section.features;
                if (Array.isArray(features) && features.length > 0) {
                    // Filter out empty strings and return valid features
                    const validFeatures = features
                        .filter((f) => typeof f === 'string' && f.trim())
                        .map((f) => f.trim());
                    if (validFeatures.length > 0) {
                        return validFeatures;
                    }
                }
            }
        }
    }
    // Fallback to legacy assignedText system
    const assignedText = storeConfig.layoutConfig?.assignedText;
    if (assignedText && typeof assignedText === 'object') {
        const features = [];
        let index = 1;
        // Try to get features sequentially (feature_1, feature_2, etc.)
        while (index <= 10) { // Limit to 10 features max
            const featureKey = `${textKeyPrefix}${index}`;
            const featureValue = assignedText[featureKey];
            if (featureValue && typeof featureValue === 'string' && featureValue.trim()) {
                features.push(featureValue.trim());
                index++;
            }
            else {
                break; // Stop when we hit a missing feature
            }
        }
        // If we found at least one feature, return them
        if (features.length > 0) {
            return features;
        }
    }
    // If no features found, return fallback
    return fallbackFeatures;
}
/**
 * Gets an asset URL from the backend for real stores, or returns fallback for demo stores
 * @param storeConfig - The store configuration
 * @param assetKey - Key to look up in layoutConfig.assignedAssets
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export function getAssetUrl(storeConfig, assetKey, fallbackUrl) {
    if (!storeConfig) {
        return fallbackUrl;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always use fallback
    if (!isRealStore) {
        return fallbackUrl;
    }
    // For real stores, try to get asset from backend
    const assignedAsset = storeConfig.layoutConfig?.assignedAssets?.[assetKey];
    if (assignedAsset && typeof assignedAsset === 'string' && assignedAsset.trim()) {
        return assignedAsset.trim();
    }
    // If asset not found in assignedAssets, return fallback
    return fallbackUrl;
}
/**
 * Gets a hero/promo banner image from backend
 * Checks multiple sources: assignedAssets, banner, then fallback
 * @param storeConfig - The store configuration
 * @param assetKey - Key to look up in layoutConfig.assignedAssets (e.g., 'hero_bg', 'promo_banner')
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export function getBannerImage(storeConfig, assetKey, fallbackUrl) {
    if (!storeConfig) {
        return fallbackUrl;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // Check multiple sources (supports both legacy assignedAssets and newer sections shapes)
    const assignedAssets = storeConfig.layoutConfig?.assignedAssets;
    // 1) Explicit key (expected: 'hero_bg')
    const explicit = pickFirstAssetUrl(assignedAssets?.[assetKey]);
    if (explicit)
        return explicit;
    // 2) Common alternate keys (defensive: backend/admin may use different naming)
    const alternates = pickFirstAssetUrl(assignedAssets?.hero_bg, assignedAssets?.hero_background, assignedAssets?.heroBg, assignedAssets?.hero_banner, assignedAssets?.heroBanner, assignedAssets?.hero_image, assignedAssets?.heroImage, assignedAssets?.banner, assignedAssets?.banner_image, assignedAssets?.bannerImage);
    if (alternates)
        return alternates;
    // 3) sections.hero shape (multi-slide heroes often store images in slides)
    const heroSection = storeConfig.layoutConfig?.sections?.hero;
    if (heroSection) {
        const sectionHeroUrl = pickFirstAssetUrl(heroSection.backgroundImage, heroSection.image, heroSection.bannerImage, heroSection.heroImage, heroSection.bg, heroSection.background, heroSection.media?.image, heroSection.media?.src, heroSection.slides?.[0]?.image, heroSection.slides?.[0]?.backgroundImage, heroSection.slides?.[0]?.bannerImage);
        if (sectionHeroUrl)
            return sectionHeroUrl;
    }
    // 4) Store-level banner if present (not in StoreConfig type, but may exist at runtime)
    const storeBanner = pickFirstAssetUrl(storeConfig?.banner);
    if (storeBanner)
        return storeBanner;
    // 5) Fallback if nothing found
    return isRealStore ? '' : fallbackUrl;
}
/**
 * Gets a team member image from backend
 * Checks team page members first, then assignedAssets
 * @param storeConfig - The store configuration
 * @param memberName - Optional name to match team member
 * @param assetKey - Key to look up in layoutConfig.assignedAssets (e.g., 'specialist_image')
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export function getTeamMemberImage(storeConfig, memberName, assetKey, fallbackUrl) {
    if (!storeConfig) {
        return fallbackUrl;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always use fallback
    if (!isRealStore) {
        return fallbackUrl;
    }
    // For real stores, check team members first if name provided
    if (memberName) {
        const teamMember = storeConfig.layoutConfig?.pages?.team?.members?.find((member) => member.name.toLowerCase() === memberName.toLowerCase());
        if (teamMember?.photo && teamMember.photo.trim()) {
            return teamMember.photo.trim();
        }
    }
    // Check assignedAssets
    const assignedAsset = storeConfig.layoutConfig?.assignedAssets?.[assetKey];
    if (assignedAsset && typeof assignedAsset === 'string' && assignedAsset.trim()) {
        return assignedAsset.trim();
    }
    // Return fallback if nothing found
    return fallbackUrl;
}
/**
 * Gets a service image from backend, with fallback
 * @param serviceImage - Image from service object (may be from backend)
 * @param storeConfig - The store configuration
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export function getServiceImage(serviceImage, storeConfig, fallbackUrl) {
    if (!storeConfig) {
        return fallbackUrl;
    }
    // If service has an image, use it
    if (serviceImage && serviceImage.trim()) {
        return serviceImage.trim();
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For real stores without service image, return empty string to trigger fallback placeholder
    return isRealStore ? '' : fallbackUrl;
}
/**
 * Gets text content from layoutConfig.text hierarchy using dot notation path
 * Falls back to common text, then fallback parameter
 * @param storeConfig - The store configuration
 * @param path - Dot notation path (e.g., 'hero.title', 'sections.categories.viewAll', 'common.shopNow')
 * @param fallbackText - Fallback text to use when text is missing
 * @returns Text content string
 */
export function getLayoutText(storeConfig, path, fallbackText) {
    if (!storeConfig || !storeConfig.layoutConfig?.text) {
        return fallbackText;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always use fallback
    if (!isRealStore) {
        return fallbackText;
    }
    const textConfig = storeConfig.layoutConfig.text;
    const pathParts = path.split('.');
    // Navigate through the path
    let current = textConfig;
    for (const part of pathParts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        }
        else {
            return fallbackText;
        }
    }
    // If we found a string value, return it
    if (typeof current === 'string' && current.trim()) {
        return current.trim();
    }
    // If not found, try common fallback for common UI labels
    if (pathParts.length > 1 && pathParts[0] !== 'common') {
        const commonPath = `common.${pathParts[pathParts.length - 1]}`;
        const commonValue = getLayoutText(storeConfig, commonPath, '');
        if (commonValue) {
            return commonValue;
        }
    }
    return fallbackText;
}
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
export function getTextContentV2(storeConfig, textKey, fallbackText) {
    if (!storeConfig) {
        return fallbackText;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always use fallback
    if (!isRealStore) {
        return fallbackText;
    }
    // Try new system first (if path contains dots, it's likely new system)
    if (textKey.includes('.')) {
        const newSystemValue = getLayoutText(storeConfig, textKey, '');
        if (newSystemValue) {
            return newSystemValue;
        }
    }
    // Try legacy assignedText system
    const assignedText = storeConfig.layoutConfig?.assignedText;
    if (assignedText && typeof assignedText === 'object') {
        const textValue = assignedText[textKey];
        if (textValue && typeof textValue === 'string' && textValue.trim()) {
            return textValue.trim();
        }
    }
    // Fallback
    return fallbackText;
}
/**
 * Gets logo URL from backend for real stores, or returns null for demo stores
 * @param storeConfig - The store configuration
 * @returns Logo URL string or null
 */
export function getLogoUrl(storeConfig) {
    if (!storeConfig) {
        return null;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always return null (use default SVG)
    if (!isRealStore) {
        return null;
    }
    // For real stores, check branding.logo
    const logoUrl = storeConfig.branding?.logo;
    if (logoUrl && typeof logoUrl === 'string' && logoUrl.trim()) {
        return logoUrl.trim();
    }
    // If logo not found, return null to use default SVG
    return null;
}
/**
 * Gets a theme color from layout configuration with fallback
 * @param storeConfig - The store configuration
 * @param category - Color category (background, text, border, gradient, accent, layoutSpecific)
 * @param key - Color key within the category (e.g., 'primary', 'secondary', 'blob1')
 * @param fallback - Fallback color value
 * @returns Color string
 */
export function getThemeColor(storeConfig, category, key, fallback) {
    if (!storeConfig) {
        return fallback;
    }
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // For demo stores, always use fallback
    if (!isRealStore) {
        return fallback;
    }
    // Try to get color from layoutConfig.themeColors
    const themeColors = storeConfig.layoutConfig?.themeColors;
    if (themeColors) {
        if (category === 'layoutSpecific') {
            const layoutSpecific = themeColors.layoutSpecific;
            if (layoutSpecific && typeof layoutSpecific === 'object') {
                const color = layoutSpecific[key];
                if (color && typeof color === 'string' && color.trim()) {
                    return color.trim();
                }
            }
        }
        else {
            const categoryColors = themeColors[category];
            if (categoryColors && typeof categoryColors === 'object') {
                const color = categoryColors[key];
                if (color && typeof color === 'string' && color.trim()) {
                    return color.trim();
                }
            }
        }
    }
    // Fallback to branding colors for certain keys
    if (category === 'accent' && key === 'hover') {
        return storeConfig.branding?.primaryColor || fallback;
    }
    if (category === 'accent' && key === 'focus') {
        const primaryColor = storeConfig.branding?.primaryColor;
        if (primaryColor) {
            // Convert hex to rgba for focus ring
            return primaryColor.includes('rgba') ? primaryColor : `${primaryColor}80`;
        }
    }
    // If color not found, return fallback
    return fallback;
}
/**
 * Gets multiple theme colors at once
 * @param storeConfig - The store configuration
 * @param colorMap - Map of color keys to fallback values
 * @returns Object with color values
 */
export function getThemeColors(storeConfig, colorMap) {
    const result = {};
    for (const [outputKey, config] of Object.entries(colorMap)) {
        result[outputKey] = getThemeColor(storeConfig, config.category, config.key, config.fallback);
    }
    return result;
}

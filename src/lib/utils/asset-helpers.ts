import { StoreConfig } from '@/lib/store-types';
import { shouldUseAPI } from './demo-detection';
export { shouldUseAPI };

function normalizeAssetUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Basic sanity guard: avoid obvious non-urls like "undefined"/"null"
  if (trimmed === 'undefined' || trimmed === 'null') return null;
  return trimmed;
}

/**
 * Normalizes store image URLs to absolute URLs
 * Handles both absolute URLs (R2/Cloudflare/etc.) and relative paths
 * @param raw - The raw image URL (can be relative or absolute)
 * @returns Normalized absolute URL or null if invalid
 */
export function normalizeStoreImageUrl(raw: unknown): string | null {
  // Handle null, undefined, or non-string values
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'string') return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed === 'undefined' || trimmed === 'null' || trimmed === '') return null;

  // Absolute URLs (R2/Cloudflare/etc.) - return as-is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Backend-served uploads (relative path)
  // Try to get API base URL from environment or use default
  const apiBase = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : (typeof window !== 'undefined'
      ? window.location.origin.replace(/:\d+$/, ':4002') // Try to infer from current origin
      : 'http://localhost:4002');

  // Handle paths starting with /uploads/
  if (trimmed.startsWith('/uploads/')) {
    return `${apiBase}${trimmed}`;
  }

  // Handle paths starting with uploads/ (no leading slash)
  if (trimmed.startsWith('uploads/')) {
    return `${apiBase}/${trimmed}`;
  }

  // Handle paths starting with / (other backend paths)
  if (trimmed.startsWith('/')) {
    return `${apiBase}${trimmed}`;
  }

  // As a last resort, return as-is (could already be a resolvable relative asset)
  return trimmed;
}

function pickFirstAssetUrl(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    const normalized = normalizeAssetUrl(c);
    if (normalized) return normalized;
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
export function getTextContent(
  storeConfig: StoreConfig | null | undefined,
  textKey: string,
  fallbackText: string
): string {
  if (!storeConfig) {
    return fallbackText;
  }

  // 1. Try to get text from new text hierarchy first
  if (storeConfig.layoutConfig?.text) {
    const value = getLayoutText(storeConfig, textKey, '');
    if (value) return value;
  }

  // 2. Try to get text from assignedText (legacy)
  const assignedText = storeConfig.layoutConfig?.assignedText;
  if (assignedText && typeof assignedText === 'object') {
    const textValue = assignedText[textKey];
    if (textValue && typeof textValue === 'string' && textValue.trim()) {
      return textValue.trim();
    }
  }

  // 3. Fallback to default
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
export function getFeaturesList(
  storeConfig: StoreConfig | null | undefined,
  textKeyPrefix: string,
  fallbackFeatures: string[]
): string[] {
  if (!storeConfig) {
    return fallbackFeatures;
  }

  // 1. Try new structured text system first (e.g., sections.team.features)
  const sectionMatch = textKeyPrefix.match(/^(\w+)_feature_/);
  if (sectionMatch && storeConfig.layoutConfig?.text) {
    const sectionName = sectionMatch[1];
    const textConfig = storeConfig.layoutConfig.text;

    if (textConfig.sections &&
      typeof textConfig.sections === 'object' &&
      sectionName in textConfig.sections) {
      const section = (textConfig.sections as any)[sectionName];
      if (section && typeof section === 'object' && 'features' in section) {
        const features = section.features;
        if (Array.isArray(features) && features.length > 0) {
          const validFeatures = features
            .filter((f: any) => typeof f === 'string' && f.trim())
            .map((f: string) => f.trim());
          if (validFeatures.length > 0) {
            return validFeatures;
          }
        }
      }
    }
  }

  // 2. Fallback to legacy assignedText system
  const assignedText = storeConfig.layoutConfig?.assignedText;
  if (assignedText && typeof assignedText === 'object') {
    const features: string[] = [];
    let index = 1;

    while (index <= 10) {
      const featureKey = `${textKeyPrefix}${index}`;
      const featureValue = assignedText[featureKey];

      if (featureValue && typeof featureValue === 'string' && featureValue.trim()) {
        features.push(featureValue.trim());
        index++;
      } else {
        break;
      }
    }

    if (features.length > 0) {
      return features;
    }
  }

  // 3. Check for benefit strip style items if textKeyPrefix matches
  const featuresSection = storeConfig.layoutConfig?.sections?.features;
  if (textKeyPrefix === 'features_item_' && featuresSection?.items && Array.isArray(featuresSection.items)) {
    return featuresSection.items.map((item: any) => item.title || item.text || '').filter(Boolean);
  }

  return fallbackFeatures;
}

/**
 * Gets an asset URL from the backend for real stores, or returns fallback for demo stores
 * @param storeConfig - The store configuration
 * @param assetKey - Key to look up in layoutConfig.assignedAssets
 * @param fallbackUrl - Fallback URL to use for demo stores or when asset is missing
 * @returns Asset URL string
 */
export function getAssetUrl(
  storeConfig: StoreConfig | null | undefined,
  assetKey: string,
  fallbackUrl: string
): string {
  if (!storeConfig) {
    return fallbackUrl;
  }

  // 1. Try to get asset from layoutConfig.assignedAssets
  const assignedAsset = storeConfig.layoutConfig?.assignedAssets?.[assetKey];
  if (assignedAsset && typeof assignedAsset === 'string' && assignedAsset.trim()) {
    return assignedAsset.trim();
  }

  // 2. Try to get asset from nested sections (common pattern)
  const sections = storeConfig.layoutConfig?.sections;
  if (sections) {
    // Try to find image in any section that might have it
    for (const section of Object.values(sections)) {
      if (section && typeof section === 'object' && (section as any).image === assetKey) {
        return (section as any).image;
      }
    }
  }

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
export function getBannerImage(
  storeConfig: StoreConfig | null | undefined,
  assetKey: string,
  fallbackUrl: string
): string {
  if (!storeConfig) {
    return fallbackUrl;
  }

  // Check multiple sources (supports both legacy assignedAssets and newer sections shapes)
  const assignedAssets = storeConfig.layoutConfig?.assignedAssets;

  // 1) Explicit key (expected: 'hero_bg')
  const explicit = pickFirstAssetUrl(assignedAssets?.[assetKey]);
  if (explicit) return explicit;

  // 2) Common alternate keys (defensive: backend/admin may use different naming)
  const alternates = pickFirstAssetUrl(
    assignedAssets?.hero_bg,
    assignedAssets?.hero_background,
    assignedAssets?.heroBg,
    assignedAssets?.hero_banner,
    assignedAssets?.heroBanner,
    assignedAssets?.hero_image,
    assignedAssets?.heroImage,
    assignedAssets?.banner,
    assignedAssets?.banner_image,
    assignedAssets?.bannerImage
  );
  if (alternates) return alternates;

  // 3) sections.hero shape (multi-slide heroes often store images in slides)
  const heroSection: any = (storeConfig.layoutConfig as any)?.sections?.hero || (storeConfig.layoutConfig as any)?.hero;
  if (heroSection) {
    const sectionHeroUrl = pickFirstAssetUrl(
      heroSection.backgroundImage,
      heroSection.image,
      heroSection.bannerImage,
      heroSection.heroImage,
      heroSection.bg,
      heroSection.background,
      heroSection.media?.image,
      heroSection.media?.src,
      heroSection.slides?.[0]?.image,
      heroSection.slides?.[0]?.backgroundImage,
      heroSection.slides?.[0]?.bannerImage
    );
    if (sectionHeroUrl) return sectionHeroUrl;
  }

  // 4) Store-level banner if present
  const storeBanner = pickFirstAssetUrl((storeConfig as any)?.banner);
  if (storeBanner) return storeBanner;

  // 5) Fallback if nothing found
  return fallbackUrl;
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
export function getTeamMemberImage(
  storeConfig: StoreConfig | null | undefined,
  memberName: string | null | undefined,
  assetKey: string,
  fallbackUrl: string
): string {
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
    const teamMember = storeConfig.layoutConfig?.pages?.team?.members?.find(
      (member) => member.name.toLowerCase() === memberName.toLowerCase()
    );
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
export function getServiceImage(
  serviceImage: string | undefined | null,
  storeConfig: StoreConfig | null | undefined,
  fallbackUrl: string
): string {
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
export function getLayoutText(
  storeConfig: StoreConfig | null | undefined,
  path: string,
  fallbackText: string
): string {
  if (!storeConfig || !storeConfig.layoutConfig) {
    return fallbackText;
  }

  // 1. Try to get text from layoutConfig.text hierarchy using dot notation path
  if (storeConfig.layoutConfig.text) {
    const textConfig = storeConfig.layoutConfig.text;
    const pathParts = path.split('.');

    // Navigate through the path
    let current: any = textConfig;
    let found = true;
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        found = false;
        break;
      }
    }

    if (found && typeof current === 'string' && current.trim()) {
      return current.trim();
    }
  }

  // 2. Try to get text from sections hierarchy (common for many layouts)
  // e.g. path 'sections.categories.title' -> layoutConfig.sections.categories.title
  const pathParts = path.split('.');
  if (pathParts.length > 0) {
    let current: any = storeConfig.layoutConfig;
    let found = true;
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        found = false;
        break;
      }
    }

    if (found && typeof current === 'string' && current.trim()) {
      return current.trim();
    }
  }

  // 3. Try to get from assignedText (legacy)
  const assignedText = storeConfig.layoutConfig.assignedText;
  if (assignedText && typeof assignedText === 'object') {
    const textValue = assignedText[path];
    if (textValue && typeof textValue === 'string' && textValue.trim()) {
      return textValue.trim();
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
export function getTextContentV2(
  storeConfig: StoreConfig | null | undefined,
  textKey: string,
  fallbackText: string
): string {
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
export function getLogoUrl(
  storeConfig: StoreConfig | null | undefined
): string | null {
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
export function getThemeColor(
  storeConfig: StoreConfig | null | undefined,
  category: 'background' | 'text' | 'border' | 'gradient' | 'accent' | 'layoutSpecific',
  key: string,
  fallback: string
): string {
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
    } else {
      const categoryColors = themeColors[category];
      if (categoryColors && typeof categoryColors === 'object') {
        const color = (categoryColors as Record<string, string | undefined>)[key];
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
export function getThemeColors<T extends Record<string, string>>(
  storeConfig: StoreConfig | null | undefined,
  colorMap: { [K in keyof T]: { category: 'background' | 'text' | 'border' | 'gradient' | 'accent' | 'layoutSpecific'; key: string; fallback: string } }
): T {
  const result = {} as T;
  for (const [outputKey, config] of Object.entries(colorMap)) {
    result[outputKey as keyof T] = getThemeColor(
      storeConfig,
      config.category,
      config.key,
      config.fallback
    ) as T[keyof T];
  }
  return result;
}


import { getStoreConfig } from './store-config';
import { shouldUseAPI, getBaseStoreSlug } from './utils/demo-detection';
import { storeService, type StoreResponse } from './services/store.service';
import { categoryService, type Category } from './services/category.service';
import { productService, type Product } from './services/product.service';
import { serviceService, type Service } from './services/service.service';
import type { StoreConfig, StoreLayoutType, StoreCategory, StoreProduct, StoreService, StoreLayoutConfig } from './store-types';
import { normalizePrice } from './utils';

// Simple ID generator fallback (doesn't require uuid package)
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Comprehensive function to extract and validate image URLs from any format
 * Handles: strings, objects, arrays, JSON-encoded, comma-separated, fragmented JSON
 * @param input - Can be string, object, array, or any combination
 * @returns Array of valid absolute image URLs
 */
export function extractImageUrls(input: any): string[] {
  if (!input) {
    return [];
  }

  // Handle arrays
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return [];
    }

    // Check if array contains objects with url property
    const firstItem = input[0];
    if (firstItem && typeof firstItem === 'object' && firstItem !== null && 'url' in firstItem) {
      // Array of objects: [{url: "...", isPrimary: true}, ...]
      return input
        .map((item) => extractImageUrls(item)) // Recursively extract from each object
        .flat()
        .filter((url): url is string => url.length > 0);
    }

    // Check if array contains fragmented JSON strings (TypeORM simple-array issue)
    if (typeof firstItem === 'string' && firstItem.trim().startsWith('[') && firstItem.includes('"url"')) {
      try {
        // Reconstruct fragmented JSON
        const reconstructedJson = input.join('');
        const parsed = JSON.parse(reconstructedJson);
        return extractImageUrls(parsed); // Recursively process parsed result
      } catch {
        // If reconstruction fails, treat as string array
      }
    }

    // Array of strings: ["url1", "url2", ...]
    return input
      .map((item) => extractImageUrls(item)) // Recursively extract from each item
      .flat()
      .filter((url): url is string => url.length > 0);
  }

  // Handle objects
  if (typeof input === 'object' && input !== null) {
    // Object with url property: {url: "...", isPrimary: true}
    if ('url' in input && typeof input.url === 'string') {
      const url = validateAndConvertUrl(input.url);
      return url ? [url] : [];
    }

    // Stringified object: '{"url":"..."}'
    if (typeof input === 'object' && Object.keys(input).length === 0) {
      return [];
    }

    // Try to find url in nested structure
    for (const key of ['url', 'image', 'src', 'imageUrl', 'image_url']) {
      if (key in input && typeof input[key] === 'string') {
        const url = validateAndConvertUrl(input[key]);
        if (url) return [url];
      }
    }

    return [];
  }

  // Handle strings
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return [];
    }

    // Check if it's JSON-encoded
    if ((trimmed.startsWith('[') || trimmed.startsWith('{')) && (trimmed.includes('"url"') || trimmed.includes('"image"'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractImageUrls(parsed); // Recursively process parsed result
      } catch {
        // Not valid JSON, continue as string
      }
    }

    // Check if it's comma-separated URLs
    if (trimmed.includes(',') && (trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('r2.dev'))) {
      return trimmed
        .split(',')
        .map((s) => s.trim())
        .map((url) => validateAndConvertUrl(url))
        .filter((url): url is string => url.length > 0);
    }

    // Single URL string
    const url = validateAndConvertUrl(trimmed);
    return url ? [url] : [];
  }

  return [];
}

/**
 * Validates a URL string (CDN URLs from Cloudflare Object Storage are used as-is)
 * @param url - URL string to validate
 * @returns Valid URL string or empty string
 */
function validateAndConvertUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return '';
  }

  // URLs from Cloudflare Object Storage (CDN) are already absolute - use as-is
  // Only validate that it's a non-empty string
  return trimmed;
}

/**
 * Validates a single image URL string
 * @param url - URL to validate
 * @returns Valid URL string or empty string
 */
function validateImageUrl(url: any): string {
  if (!url) {
    return '';
  }

  // Handle string URLs
  if (typeof url === 'string') {
    const trimmed = url.trim();
    return trimmed.length > 0 ? trimmed : '';
  }

  // Handle number (convert to string)
  if (typeof url === 'number') {
    return String(url).trim();
  }

  // Handle object with url property (nested structures)
  if (typeof url === 'object' && url !== null) {
    // Try common URL property names
    for (const key of ['url', 'src', 'image', 'imageUrl', 'image_url', 'value']) {
      if (key in url && url[key]) {
        const extracted = validateImageUrl(url[key]);
        if (extracted) return extracted;
      }
    }
  }

  return '';
}

/**
 * Product-specific image extraction function
 * Comprehensive function that handles all image storage formats
 * URLs are used as-is from CDN (Cloudflare Object Storage)
 * @param images - Can be:
 *   - Array of objects: [{url: string}, ...] or [{url: {url: string}}, ...]
 *   - Array of strings: ["url1", "url2"]
 *   - Single object: {url: string}
 *   - Single string: "url"
 *   - JSON string: '{"url":"..."}' or '[{"url":"..."}]'
 *   - null/undefined
 * @returns Array of valid URL strings
 */
function extractProductImageUrls(images: any): string[] {
  // Handle null/undefined
  if (!images) {
    return [];
  }

  // Handle JSON strings (parsed or unparsed)
  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (trimmed.length === 0) {
      return [];
    }

    // Try to parse as JSON (handles both single and double-stringified)
    if ((trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"')) && (trimmed.includes('"url"') || trimmed.includes('"image"'))) {
      try {
        let parsed = JSON.parse(trimmed);
        // Check if result is still a string (double-stringified)
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch (e) {
            // Not double-stringified, continue as string URL
          }
        }
        // Recursively process the parsed result
        return extractProductImageUrls(parsed);
      } catch (e) {
        // Not valid JSON, continue as string URL
      }
    }

    // Check if it's comma-separated URLs
    if (trimmed.includes(',') && (trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('r2.dev') || trimmed.includes('pub-'))) {
      return trimmed
        .split(',')
        .map((url) => validateImageUrl(url))
        .filter((url): url is string => url.length > 0);
    }

    // Single URL string
    const url = validateImageUrl(trimmed);
    return url ? [url] : [];
  }

  // Handle arrays - this is the most common case
  if (Array.isArray(images)) {
    if (images.length === 0) {
      return [];
    }

    const firstItem = images[0];
    
    // Case 1: Array of objects with url property: [{url: "...", isPrimary: true}, ...]
    // This is what backend normalizeProductImages returns
    // Also handles nested: [{url: {url: "..."}}]
    if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
      const result: string[] = [];
      for (const item of images) {
        if (!item) continue;

        // Handle object items
        if (typeof item === 'object' && item !== null) {
          // Check for direct url property
          if ('url' in item) {
            const url = validateImageUrl(item.url);
            if (url) {
              result.push(url);
              continue;
            }
          }

          // Check for other common property names
          for (const key of ['src', 'image', 'imageUrl', 'image_url', 'value']) {
            if (key in item) {
              const url = validateImageUrl(item[key]);
              if (url) {
                result.push(url);
                break;
              }
            }
          }
        }
        // Handle string items in mixed arrays
        else if (typeof item === 'string') {
          const url = validateImageUrl(item);
          if (url) {
            result.push(url);
          }
        }
      }
      if (result.length > 0) {
        return result;
      }
    }
    
    // Case 2: Array of string URLs: ["url1", "url2", ...]
    if (typeof firstItem === 'string') {
      return images
        .map((item) => validateImageUrl(item))
        .filter((url): url is string => url.length > 0);
    }

    // Case 3: Array of mixed types - try to extract from each
    const result: string[] = [];
    for (const item of images) {
      const url = validateImageUrl(item);
      if (url) {
        result.push(url);
      }
    }
    return result;
  }

  // Handle single object with url property
  if (typeof images === 'object' && images !== null && !Array.isArray(images)) {
    // Check for direct url property
    if ('url' in images) {
      const url = validateImageUrl(images.url);
      if (url) {
        return [url];
      }
    }

    // Check for other common property names
    for (const key of ['src', 'image', 'imageUrl', 'image_url', 'value']) {
      if (key in images) {
        const url = validateImageUrl(images[key]);
        if (url) {
          return [url];
        }
      }
    }
  }

  return [];
}

/**
 * Converts a relative URL to an absolute URL using the API base URL
 * @param url - The URL to convert (can be relative like /uploads/... or already absolute)
 * @returns Absolute URL string
 * @deprecated Use validateAndConvertUrl instead for better validation
 */
function convertToAbsoluteUrl(url: string): string {
  return validateAndConvertUrl(url);
}

/**
 * Valid StoreLayoutType values
 */
const VALID_LAYOUTS: StoreLayoutType[] = [
  'food',
  'food-modern',
  'clothing',
  'clothing-minimal',
  'booking',
  'booking-agenda',
  'electronics',
  'electronics-grid',
];

/**
 * Maps API layout string to StoreLayoutType
 * Falls back to 'food' if layout is invalid or missing
 */
function mapLayoutToStoreLayoutType(layout?: string): StoreLayoutType {
  if (!layout) {
    return 'food'; // Default fallback
  }

  // Check if layout is a valid StoreLayoutType
  if (VALID_LAYOUTS.includes(layout as StoreLayoutType)) {
    return layout as StoreLayoutType;
  }

  // Try to match by prefix for flexibility
  const normalizedLayout = layout.toLowerCase();
  for (const validLayout of VALID_LAYOUTS) {
    if (normalizedLayout.startsWith(validLayout) || validLayout.startsWith(normalizedLayout)) {
      return validLayout;
    }
  }

  // Default fallback
  return 'food';
}

/**
 * Category-specific image extraction function
 * Handles all category image storage formats independently
 * @param image - Can be:
 *   - String URL: "https://..."
 *   - Object: {url: "https://..."}
 *   - Array: ["https://..."] or [{url: "https://..."}]
 *   - JSON string: '{"url":"..."}' or '"https://..."'
 *   - null/undefined
 * @returns Single valid URL string or undefined
 */
function extractCategoryImageUrl(image: any): string | undefined {
  if (!image) {
    return undefined;
  }

  // Handle string URLs
  if (typeof image === 'string') {
    const trimmed = image.trim();
    if (trimmed.length === 0) {
      return undefined;
    }

    // Try to parse as JSON
    if ((trimmed.startsWith('[') || trimmed.startsWith('{')) && (trimmed.includes('"url"') || trimmed.includes('"image"'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractCategoryImageUrl(parsed);
      } catch {
        // Not valid JSON, continue as string URL
      }
    }

    // Validate and return single URL string
    const url = validateImageUrl(trimmed);
    return url || undefined;
  }

  // Handle arrays - take first valid URL
  if (Array.isArray(image)) {
    if (image.length === 0) {
      return undefined;
    }

    // Try to extract from first item
    for (const item of image) {
      const url = extractCategoryImageUrl(item);
      if (url) {
        return url;
      }
    }
    return undefined;
  }

  // Handle objects
  if (typeof image === 'object' && image !== null) {
    // Check for direct url property
    if ('url' in image) {
      const url = validateImageUrl(image.url);
      if (url) {
        return url;
      }
    }

    // Check for other common property names
    for (const key of ['src', 'image', 'imageUrl', 'image_url', 'value']) {
      if (key in image) {
        const url = validateImageUrl(image[key]);
        if (url) {
          return url;
        }
      }
    }
  }

  return undefined;
}

/**
 * Transforms API Category to StoreCategory format
 * Uses dedicated category image extraction function for independent validation
 */
export function transformCategoryToStoreCategory(apiCategory: Category): StoreCategory {
  // Use category-specific image extraction function
  // This ensures independent validation for category images
  const imageUrl = extractCategoryImageUrl(apiCategory.image);
  
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    description: apiCategory.description,
    image: imageUrl,
    parentId: apiCategory.parentId,
  };
}

/**
 * Transforms API Product to StoreProduct format
 * Calculates inStock based on trackInventory and inventory data
 */
export function transformProductToStoreProduct(apiProduct: Product): StoreProduct {
  // Calculate inStock
  let inStock = true; // Default to true
  if (apiProduct.trackInventory === true) {
    // If tracking inventory, check if any inventory item has quantity > 0
    if (apiProduct.inventory && Array.isArray(apiProduct.inventory)) {
      inStock = apiProduct.inventory.some((inv: any) => (inv.quantity || 0) > 0);
    } else {
      // If inventory data is unavailable but tracking is enabled, default to false for safety
      inStock = false;
    }
  } else {
    // If not tracking inventory, always in stock
    inStock = true;
  }

  // Convert price to number (API may return string from decimal type)
  const price = normalizePrice(apiProduct.price);
  
  // Convert compareAtPrice to number if it exists
  const compareAtPrice = apiProduct.compareAtPrice 
    ? normalizePrice(apiProduct.compareAtPrice)
    : undefined;

  // Use product-specific image extraction function
  // Backend returns: [{url: string, isPrimary?: boolean}]
  // Frontend needs: string[] (array of URL strings)
  let images = extractProductImageUrls(apiProduct.images);
  
  // Ensure all extracted URLs are valid (non-empty strings)
  images = images.filter((url: string) => url && typeof url === 'string' && url.trim().length > 0);
  
  // Enhanced logging for debugging image extraction issues
  if (images.length === 0 && apiProduct.images) {
    console.warn('[transformProductToStoreProduct] WARNING: No images extracted!', {
      productId: apiProduct.id,
      productName: apiProduct.name,
      inputImages: apiProduct.images,
      inputType: typeof apiProduct.images,
      inputIsArray: Array.isArray(apiProduct.images),
      inputLength: Array.isArray(apiProduct.images) ? apiProduct.images.length : 'N/A',
      inputStringified: typeof apiProduct.images === 'string' ? (apiProduct.images as string).substring(0, 200) : JSON.stringify(apiProduct.images || []).substring(0, 200)
    });
    
    // Try fallback extraction using the general extractImageUrls function
    const fallbackImages = extractImageUrls(apiProduct.images);
    if (fallbackImages.length > 0) {
      console.log('[transformProductToStoreProduct] Fallback extraction succeeded:', {
        productId: apiProduct.id,
        extractedCount: fallbackImages.length
      });
      images = fallbackImages.filter((url: string) => url && typeof url === 'string' && url.trim().length > 0);
    }
  } else if (images.length > 0) {
    // Log successful extraction in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[transformProductToStoreProduct] Successfully extracted images:', {
        productId: apiProduct.id,
        productName: apiProduct.name,
        imageCount: images.length,
        firstImage: images[0]?.substring(0, 100)
      });
    }
  }

  // Convert rating to number, handling undefined, null, or string values
  let rating: number | undefined;
  if (apiProduct.rating !== undefined && apiProduct.rating !== null) {
    if (typeof apiProduct.rating === 'number') {
      rating = apiProduct.rating;
    } else if (typeof apiProduct.rating === 'string') {
      const parsed = parseFloat(apiProduct.rating);
      rating = isNaN(parsed) ? undefined : parsed;
    } else {
      rating = undefined;
    }
  }

  // Generate SKU from slug or name if not provided
  const generateSKU = (product: Product): string => {
    // Try to get SKU from metadata first
    if (product.metadata?.sku) {
      return String(product.metadata.sku);
    }
    // Check if any variation has a SKU (use the first one found)
    if (product.variations && product.variations.length > 0) {
      const variationWithSKU = product.variations.find((v: any) => v.sku);
      if (variationWithSKU?.sku) {
        return String(variationWithSKU.sku);
      }
    }
    // Generate SKU from slug (uppercase, remove hyphens, take first 8-12 chars)
    if (product.slug) {
      const slugSKU = product.slug.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 12);
      return slugSKU.length >= 6 ? slugSKU : slugSKU.padEnd(8, 'X');
    }
    // Fallback: generate from name (uppercase, alphanumeric only, first 8-12 chars)
    const nameSKU = product.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 12);
    return nameSKU.length >= 6 ? nameSKU : nameSKU.padEnd(8, 'X');
  };

  // Extract reviewCount from API product (added by backend)
  const reviewCount = (apiProduct as any).reviewCount !== undefined 
    ? Number((apiProduct as any).reviewCount) 
    : undefined;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description || '',
    price,
    compareAtPrice,
    images,
    categoryId: apiProduct.categoryId || '',
    inStock,
    rating,
    reviewCount,
    sku: generateSKU(apiProduct),
    currency: apiProduct.currency || 'USD',
    variants: apiProduct.variations?.map((variation: any) => ({
      id: variation.id || variation.name || '',
      name: variation.name || '',
      value: variation.value || '',
      price: variation.price 
        ? (typeof variation.price === 'string' 
            ? parseFloat(variation.price) 
            : Number(variation.price))
        : undefined,
      sku: variation.sku,
    })),
    specifications: apiProduct.brand ? { brand: apiProduct.brand } : undefined,
    isActive: apiProduct.isActive,
    status: apiProduct.status,
  };
}

/**
 * Transforms API Service to StoreService format
 */
export function transformServiceToStoreService(apiService: Service): StoreService {
  // Convert price to number (API may return string from decimal type)
  const price = normalizePrice(apiService.price);
  
  // Extract image from images array or use image field
  let image: string | undefined;
  if (apiService.image) {
    image = apiService.image;
  } else if (apiService.images) {
    const imageUrls = extractImageUrls(apiService.images);
    image = imageUrls.length > 0 ? imageUrls[0] : undefined;
  }

  // Convert availability to StoreService format
  let availability: Array<{ day: string; slots: string[] }> | undefined;
  if (apiService.availability) {
    if (Array.isArray(apiService.availability)) {
      availability = apiService.availability.map((avail: any) => ({
        day: avail.day || '',
        slots: avail.slots || [],
      }));
    } else if (typeof apiService.availability === 'object') {
      // Handle object format - convert to array format
      const availObj = apiService.availability as any;
      if (availObj.days && Array.isArray(availObj.days)) {
        availability = availObj.days.map((day: string) => ({
          day,
          slots: availObj.timeSlots || [],
        }));
      } else if (availObj.day) {
        availability = [{
          day: availObj.day,
          slots: availObj.slots || [],
        }];
      }
    }
  }

  // Extract provider info if available (providerId exists but provider relation may not be loaded)
  const provider = apiService.providerId ? {
    id: apiService.providerId,
    name: apiService.provider?.name || 'Service Provider',
    avatar: apiService.provider?.avatar,
    rating: apiService.provider?.rating,
  } : undefined;

  return {
    id: apiService.id,
    name: apiService.name,
    slug: apiService.slug,
    description: apiService.description || '',
    price,
    currency: apiService.currency,
    duration: apiService.duration || 0,
    categoryId: apiService.categoryId || '',
    image,
    provider,
    availability,
    isActive: apiService.isActive,
    status: apiService.status,
  };
}

/**
 * Transforms API StoreResponse to StoreConfig format
 */
function transformStoreResponseToConfig(apiStore: StoreResponse): StoreConfig {
  const layout = mapLayoutToStoreLayoutType(apiStore.layout);

  // Debug logging for layoutConfig
  if (process.env.NODE_ENV === 'development') {
    console.log('[transformStoreResponseToConfig] Received apiStore.layoutConfig:', {
      exists: !!apiStore.layoutConfig,
      type: typeof apiStore.layoutConfig,
      hasSections: !!(apiStore.layoutConfig as any)?.sections,
      hasHeroSliders: !!(apiStore.layoutConfig as any)?.sections?.hero?.sliders,
      sliderCount: (apiStore.layoutConfig as any)?.sections?.hero?.sliders?.length || 0,
    });
  }

  // Build contactInfo from various sources
  let contactInfo = apiStore.contactInfo || {
    email: apiStore.contactEmail,
    phone: apiStore.contactPhone,
    address: apiStore.address,
  };

  // If contactInfo exists but doesn't have an address, merge Store's address if available
  if (contactInfo && !contactInfo.address && apiStore.address) {
    contactInfo = {
      ...contactInfo,
      address: apiStore.address,
    };
  }

  const transformedLayoutConfig = transformLayoutConfig(apiStore.layoutConfig, apiStore.slug);
  if (process.env.NODE_ENV === 'development') {
    console.log('[transformStoreResponseToConfig] Transformed layoutConfig:', {
      exists: !!transformedLayoutConfig,
      hasSections: !!transformedLayoutConfig?.sections,
      hasHeroSliders: !!transformedLayoutConfig?.sections?.hero?.sliders,
      sliderCount: transformedLayoutConfig?.sections?.hero?.sliders?.length || 0,
    });
  }

  return {
    id: apiStore.id,
    slug: apiStore.slug,
    name: apiStore.name,
    description: apiStore.description || '',
    type: layout,
    layout: layout,
    branding: {
      primaryColor: apiStore.branding?.primaryColor || '#000000',
      secondaryColor: apiStore.branding?.secondaryColor,
      accentColor: apiStore.branding?.secondaryColor || apiStore.branding?.primaryColor || '#000000',
      logo: (apiStore.branding?.logo || apiStore.logo) ? convertToAbsoluteUrl(apiStore.branding?.logo || apiStore.logo || '') : undefined,
    },
    navigation: {
      main: [],
      footer: [],
    },
    features: {
      cart: true,
      wishlist: true,
      reviews: true,
      search: true,
      filters: true,
      booking: layout.startsWith('booking'),
      delivery: true,
    },
    products: [],
    categories: [],
    settings: {
      currency: apiStore.settings?.currency || 'USD',
      taxRate: apiStore.settings?.taxRate, // Deprecated: kept for backward compatibility
      vat: apiStore.settings?.vat,
      serviceCharge: apiStore.settings?.serviceCharge,
    },
    contactInfo: (contactInfo.email || contactInfo.phone || contactInfo.address) ? contactInfo : undefined,
    layoutConfig: transformedLayoutConfig, // Transform layoutConfig to match frontend structure
    // Extract puckData from configuration if it exists
    puckData: ((apiStore as any).configuration as any)?.puck_configuration?.puckData || undefined,
  } as StoreConfig;
}

/**
 * Transforms backend layoutContent structure to frontend layoutConfig structure
 * Backend uses assignedAssets/assignedText, frontend expects sections structure
 */
function transformLayoutConfig(layoutContent: any, storeSlug?: string): StoreLayoutConfig | undefined {
  if (!layoutContent || typeof layoutContent !== 'object') {
    console.log('[transformLayoutConfig] No layoutContent provided or invalid');
    return undefined;
  }

  // If it already has the sections structure, return as-is but ensure assignedAssets/assignedText are preserved
  if (layoutContent.sections) {
    console.log('[transformLayoutConfig] Sections structure found, returning as-is');
    console.log('[transformLayoutConfig] Sections found:', {
      hero: !!layoutContent.sections.hero,
      heroSliders: layoutContent.sections?.hero?.sliders?.length || 0,
      categories: !!layoutContent.sections.categories,
      featuredProducts: !!layoutContent.sections.featuredProducts,
      marketing: !!layoutContent.sections.marketing,
      marketingEditorial: !!layoutContent.sections.marketing?.editorial,
      marketingPromoBanner: !!layoutContent.sections.marketing?.promoBanner,
      marketingNewsletter: !!layoutContent.sections.marketing?.newsletter,
      hasAssignedAssets: !!layoutContent.assignedAssets,
      hasAssignedText: !!layoutContent.assignedText,
    });
    // Return the entire structure as-is - all sections are already in the correct format
    // Ensure assignedAssets and assignedText are preserved for backward compatibility
    return {
      ...layoutContent,
      assignedAssets: layoutContent.assignedAssets || {},
      assignedText: layoutContent.assignedText || {},
    } as StoreLayoutConfig;
  }

  // Transform from assignedAssets/assignedText structure to sections structure
  const assignedAssets = layoutContent.assignedAssets || {};
  const assignedText = layoutContent.assignedText || {};

  // Build sections structure
  const sections: any = {};

  // Marketing section - migrate from old format to structured format
  if (layoutContent.sections?.marketing) {
    // New structure already exists - preserve it exactly as-is from database
    console.log('[transformLayoutConfig] Found sections.marketing, preserving structure');
    console.log('[transformLayoutConfig] Marketing sections:', {
      hasEditorial: !!layoutContent.sections.marketing.editorial,
      hasPromoBanner: !!layoutContent.sections.marketing.promoBanner,
      hasNewsletter: !!layoutContent.sections.marketing.newsletter,
    });
    
    sections.marketing = {
      show: layoutContent.sections.marketing.show !== false,
      showNewsletter: layoutContent.sections.marketing.showNewsletter !== false,
      showPromoBanner: layoutContent.sections.marketing.showPromoBanner === true,
      // Preserve all marketing subsections exactly as stored
      editorial: layoutContent.sections.marketing.editorial,
      promoBanner: layoutContent.sections.marketing.promoBanner,
      newsletter: layoutContent.sections.marketing.newsletter,
      shopTheLook: layoutContent.sections.marketing.shopTheLook,
      chefRecommendations: layoutContent.sections.marketing.chefRecommendations,
    };
  } else {
    // Migrate from old format
    const marketing: any = {
      show: true,
      showNewsletter: false,
      showPromoBanner: false,
    };

    // Editorial section (lookbook)
    if (assignedAssets.lookbook_main || assignedText['lookbook_main:section_header']) {
      marketing.editorial = {
        show: true,
        label: assignedText['lookbook_main:section_header'] || 'EDITORIAL',
        title: (assignedText['lookbook_main:main_caption'] && assignedText['lookbook_main:main_caption'].length < 50) 
          ? assignedText['lookbook_main:main_caption'] 
          : 'Redefining Modern\nElegance',
        description: assignedText['lookbook_main:main_caption']?.length >= 50
          ? assignedText['lookbook_main:main_caption']
          : assignedText['lookbook_detail:detail_caption'] || assignedText['lookbook_main:main_caption'] || 'Explore our latest editorial featuring timeless pieces crafted for the contemporary wardrobe. From essential basics to statement outwear, find your signature look.',
        image: assignedAssets.lookbook_main,
        detailImage: assignedAssets.lookbook_detail,
        primaryButtonText: 'View Lookbook',
        primaryButtonLink: '/style-guide',
        secondaryButtonText: 'Read Our Story',
        secondaryButtonLink: '/about',
      };
    }

    // Promo banner
    // Check for sale_banner (electronics-grid), promo_banner_image, seasonal_promo_banner, or promo_title text
    const hasPromoBanner = assignedAssets.sale_banner || 
                           assignedAssets.promo_banner_image || 
                           assignedAssets.seasonal_promo_banner || 
                           assignedText['promo_banner_title'] || 
                           assignedText['promo_title'] ||
                           assignedText['sale_banner:banner_title'];
    
    if (hasPromoBanner) {
      // Get banner image - prioritize sale_banner for electronics-grid
      const bannerImage = assignedAssets.sale_banner || 
                         assignedAssets.promo_banner_image || 
                         assignedAssets.seasonal_promo_banner;
      
      // Get banner text - check sale_banner textElements first, then other sources
      const bannerTitle = assignedText['sale_banner:banner_title'] ||
                         assignedText['promo_banner_title'] || 
                         assignedText['promo_title'] || 
                         assignedText['promo_headline'];
      
      const bannerSubtitle = assignedText['sale_banner:banner_subtitle'] ||
                            assignedText['promo_banner_subtitle'] || 
                            assignedText['promo_subtext'] || 
                            assignedText['promo_subhead'];
      
      const bannerButtonText = assignedText['sale_banner:cta_button'] ||
                              assignedText['promo_banner_button'] || 
                              assignedText['promo_cta'] || 
                              assignedText['cta_text'];
      
      const bannerButtonLink = assignedText['promo_banner_link'] ||
        assignedText['sale_banner:button_link'] ||
        '/products';

      marketing.showPromoBanner = false; // Disable by default
      marketing.promoBanner = {
        show: false, // Disable by default
        image: bannerImage,
        title: bannerTitle,
        subtitle: bannerSubtitle,
        buttonText: bannerButtonText,
        buttonLink: bannerButtonLink,
      };
    }

    // Newsletter
    if (assignedText['newsletter_title'] || assignedText['footer_newsletter_title']) {
      marketing.showNewsletter = true;
      marketing.newsletter = {
        show: true,
        title: assignedText['newsletter_title'] || assignedText['footer_newsletter_title'],
        subtitle: assignedText['newsletter_subtitle'] || assignedText['footer_newsletter_subtitle'],
        button: assignedText['newsletter_button'] || assignedText['footer_newsletter_button'],
        placeholder: assignedText['newsletter_placeholder'],
        disclaimer: assignedText['newsletter_disclaimer'],
      };
    }

    // Shop the look (clothing-minimal)
    if (assignedAssets.shop_the_look_image || assignedText['shop_the_look:section_title']) {
      marketing.shopTheLook = {
        show: true,
        image: assignedAssets.shop_the_look_image,
        title: assignedText['shop_the_look:section_title'] || assignedText['section_title'],
        description: assignedText['shop_the_look:look_desc'] || assignedText['look_desc'],
        products: [], // Will be populated from product data
      };
    }

    // Chef recommendations (food layout)
    if (assignedText['chef_recommendations_title'] || assignedAssets.chef_image) {
      marketing.chefRecommendations = {
        show: true,
        title: assignedText['chef_recommendations_title'] || 'Chef\'s Recommendations',
        description: assignedText['chef_recommendations_description'],
        items: [], // Will be populated from menu item data
      };
    }

    if (Object.keys(marketing).length > 3) { // More than just show, showNewsletter, showPromoBanner
      sections.marketing = marketing;
    }
  }

  // Hero section - migrate old format to new slider structure
  if (layoutContent.sections?.hero?.sliders && Array.isArray(layoutContent.sections.hero.sliders)) {
    // New structure already exists - preserve it exactly as-is from database
    // This ensures the slider structure with images, text, and buttons is not modified
    console.log('[transformLayoutConfig] Found sections.hero.sliders, preserving structure');
    console.log('[transformLayoutConfig] Sliders count:', layoutContent.sections.hero.sliders.length);
    
    // Log each slider for debugging
    layoutContent.sections.hero.sliders.forEach((slider: any, index: number) => {
      console.log(`[transformLayoutConfig] Slider ${index + 1}:`, {
        id: slider.id,
        hasImage: !!slider.image,
        imageUrl: slider.image ? (slider.image.substring(0, 50) + '...') : 'missing',
        hasTitle: !!slider.title,
        title: slider.title || 'missing',
        primaryButtonText: slider.primaryButton?.text || 'empty',
        secondaryButtonText: slider.secondaryButton?.text || 'empty',
      });
    });
    
    sections.hero = {
      ...layoutContent.sections.hero,
      show: layoutContent.sections.hero.show !== false,
      showCTA: layoutContent.sections.hero.showCTA !== false,
      showSecondaryCTA: layoutContent.sections.hero.showSecondaryCTA !== false,
      autoPlay: layoutContent.sections.hero.autoPlay !== false,
      showBadges: layoutContent.sections.hero.showBadges !== false,
      // Preserve sliders array exactly as stored - don't transform or modify
      sliders: layoutContent.sections.hero.sliders,
    };
  } else if (assignedAssets.hero_slide_1 || assignedAssets.hero_slide_2 || assignedAssets.hero_slide_3) {
    // Old format detected - migrate to new structure
    const sliders: any[] = [];
    
    // Build sliders array from old format (support up to 10 slides for future growth)
    for (let i = 1; i <= 10; i++) {
      const slideKey = `hero_slide_${i}`;
      const imageUrl = assignedAssets[slideKey];
      
      if (imageUrl) {
        // Determine store slug for default links (use passed parameter or fallback)
        const defaultProductsLink = storeSlug ? `/${storeSlug}/products` : '/products';
        const defaultCategoriesLink = storeSlug ? `/${storeSlug}/categories` : '/categories';
        
        const slider: any = {
          id: slideKey,
          image: imageUrl,
          order: i,
        };
        
        // Map old text keys to new structure
        // Support multiple key variations for backward compatibility
        const badgeKey = `${slideKey}:badge`;
        const headingKey = `${slideKey}:heading`;
        const titleKey = `${slideKey}:title`;
        const subheadingKey = `${slideKey}:subheading`;
        const descriptionKey = `${slideKey}:description`;
        const btnLabelKey = `${slideKey}:btn_label`;
        const primaryButtonKey = `${slideKey}:primaryButton`;
        const secondaryBtnKey = `${slideKey}:secondary_btn`;
        const secondaryButtonKey = `${slideKey}:secondaryButton`;
        const highlightKey = `${slideKey}:highlight`; // Food layout specific
        
        if (assignedText[badgeKey]) {
          slider.badge = assignedText[badgeKey];
        }
        
        slider.title = assignedText[headingKey] || assignedText[titleKey] || '';
        
        if (assignedText[subheadingKey] || assignedText[descriptionKey]) {
          slider.description = assignedText[subheadingKey] || assignedText[descriptionKey];
        }
        
        // Food layout specific: highlight field
        if (assignedText[highlightKey]) {
          slider.highlight = assignedText[highlightKey];
        }
        
        // Primary button - handle both string and object formats
        const primaryButtonText = assignedText[btnLabelKey] || assignedText[primaryButtonKey];
        if (primaryButtonText) {
          // Check if it's already an object (from new format migration)
          if (typeof primaryButtonText === 'object' && primaryButtonText !== null) {
            slider.primaryButton = primaryButtonText;
          } else {
            slider.primaryButton = {
              text: String(primaryButtonText),
              link: defaultProductsLink,
            };
          }
        }
        
        // Secondary button - handle both string and object formats
        const secondaryButtonText = assignedText[secondaryBtnKey] || assignedText[secondaryButtonKey];
        if (secondaryButtonText) {
          // Check if it's already an object (from new format migration)
          if (typeof secondaryButtonText === 'object' && secondaryButtonText !== null) {
            slider.secondaryButton = secondaryButtonText;
          } else {
            slider.secondaryButton = {
              text: String(secondaryButtonText),
              link: defaultCategoriesLink,
            };
          }
        }
        
        sliders.push(slider);
      }
    }
    
    // Only create hero section if we have at least one slider
    if (sliders.length > 0) {
      sections.hero = {
        show: true,
        showCTA: true,
        showSecondaryCTA: true,
        autoPlay: true,
        showBadges: true,
        sliders: sliders,
      };
    }
  } else if (assignedAssets.hero_bg || assignedAssets.hero_image || assignedAssets.hero_split_image || assignedAssets.hero_video) {
    // Single image/video hero (non-slider layouts)
    sections.hero = {
      show: true,
      showCTA: true,
      showSecondaryCTA: true,
      autoPlay: false,
      showBadges: true,
    };
  }

  // Categories section - migrate from old format to structured format
  if (layoutContent.sections?.categories) {
    // New structure already exists - use it
    sections.categories = {
      show: layoutContent.sections.categories.show !== false,
      showViewAll: layoutContent.sections.categories.showViewAll !== false,
      limit: layoutContent.sections.categories.limit || 4,
      title: layoutContent.sections.categories.title,
      subtitle: layoutContent.sections.categories.subtitle,
      viewAll: layoutContent.sections.categories.viewAll,
    };
  } else {
    // Migrate from old format
    sections.categories = {
      show: true,
      showViewAll: true,
      limit: 4,
      title: assignedText['categories_title'] || assignedText['sections.categories.title'],
      subtitle: assignedText['categories_subtitle'] || assignedText['sections.categories.subtitle'],
      viewAll: assignedText['categories_view_all'] || assignedText['sections.categories.viewAll'] || 'View All Categories',
    };
  }

  // Featured products section - migrate from old format to structured format
  if (layoutContent.sections?.featuredProducts) {
    // New structure already exists - use it
    sections.featuredProducts = {
      show: layoutContent.sections.featuredProducts.show !== false,
      title: layoutContent.sections.featuredProducts.title,
      subtitle: layoutContent.sections.featuredProducts.subtitle,
      showViewAll: layoutContent.sections.featuredProducts.showViewAll !== false,
      viewAll: layoutContent.sections.featuredProducts.viewAll,
      showAddToCart: layoutContent.sections.featuredProducts.showAddToCart !== false,
      showWishlist: layoutContent.sections.featuredProducts.showWishlist !== false,
      showRatings: layoutContent.sections.featuredProducts.showRatings !== false,
      emptyState: layoutContent.sections.featuredProducts.emptyState,
    };
  } else {
    // Migrate from old format
    sections.featuredProducts = {
      show: true,
      title: assignedText['featured_products_title'] || assignedText['trending_title'] || assignedText['sections.featuredProducts.title'] || 'Trending Now',
      subtitle: assignedText['featured_products_subtitle'] || assignedText['sections.featuredProducts.subtitle'],
      showViewAll: true,
      viewAll: assignedText['featured_products_view_all'] || assignedText['sections.featuredProducts.viewAll'] || 'View All Products',
      showAddToCart: true,
      showWishlist: true,
      showRatings: true,
      emptyState: assignedText['featured_products_empty'] || assignedText['sections.featuredProducts.emptyState'],
    };
  }

  // Testimonials section - migrate from old format to structured format
  if (layoutContent.sections?.testimonials) {
    const testimonialsData = layoutContent.sections.testimonials;
    sections.testimonials = {
      show: testimonialsData.show !== false,
      title: testimonialsData.title,
      subtitle: testimonialsData.subtitle,
      // Support both new items array and old single quote format
      items: testimonialsData.items && Array.isArray(testimonialsData.items)
        ? testimonialsData.items.map((item: any) => ({
            id: item.id || generateId(),
            name: item.name || 'Customer',
            role: item.role || 'Customer',
            image: item.image || '',
            quote: item.quote || '',
            rating: typeof item.rating === 'number' ? item.rating : 5,
            order: typeof item.order === 'number' ? item.order : 0,
          })).sort((a: any, b: any) => a.order - b.order)
        : testimonialsData.quote
        ? [{
            id: generateId(),
            name: testimonialsData.author || 'Customer',
            role: testimonialsData.role || 'Customer',
            image: '',
            quote: testimonialsData.quote,
            rating: 5,
            order: 0,
          }]
        : [],
      // Keep backward compatibility with old single quote format
      quote: testimonialsData.quote,
      author: testimonialsData.author,
      role: testimonialsData.role,
    };
  } else if (assignedText['testimonial_quote'] || assignedText['testimonials_title']) {
    sections.testimonials = {
      show: true,
      title: assignedText['testimonials_title'] || assignedText['sections.testimonials.title'],
      subtitle: assignedText['testimonials_subtitle'] || assignedText['sections.testimonials.subtitle'],
      items: assignedText['testimonial_quote'] ? [{
        id: generateId(),
        name: assignedText['testimonial_author'] || 'Customer',
        role: assignedText['testimonial_role'] || 'Customer',
        image: '',
        quote: assignedText['testimonial_quote'],
        rating: 5,
        order: 0,
      }] : [],
      // Keep backward compatibility
      quote: assignedText['testimonial_quote'],
      author: assignedText['testimonial_author'],
      role: assignedText['testimonial_role'],
    };
  }

  // Story section - new structured format
  if (layoutContent.sections?.story) {
    sections.story = {
      show: layoutContent.sections.story.show !== false,
      label: layoutContent.sections.story.label,
      title: layoutContent.sections.story.title || '',
      description: layoutContent.sections.story.description || '',
      image: layoutContent.sections.story.image,
      signature: layoutContent.sections.story.signature,
    };
  }

  // PromoBanner section - new structured format (directly in sections, not just in marketing)
  if (layoutContent.sections?.promoBanner) {
    sections.promoBanner = {
      show: layoutContent.sections.promoBanner.show === true,
      image: layoutContent.sections.promoBanner.image,
      title: layoutContent.sections.promoBanner.title || '',
      subtitle: layoutContent.sections.promoBanner.subtitle,
      buttonText: layoutContent.sections.promoBanner.buttonText,
      buttonLink: layoutContent.sections.promoBanner.buttonLink,
    };
  }

  // Team section - migrate from old format to structured format
  if (layoutContent.sections?.team) {
    sections.team = {
      show: layoutContent.sections.team.show !== false,
      title: layoutContent.sections.team.title,
      description: layoutContent.sections.team.description,
      showViewAll: layoutContent.sections.team.showViewAll !== false,
      viewAll: layoutContent.sections.team.viewAll,
      items: layoutContent.sections.team.items && Array.isArray(layoutContent.sections.team.items)
        ? layoutContent.sections.team.items.map((item: any) => ({
            id: item.id || generateId(),
            name: item.name || 'Team Member',
            role: item.role || 'Specialist',
            image: item.image || item.photo || '',
            rating: item.rating,
            reviews: item.reviews,
          }))
        : [],
    };
  } else if (assignedText['team_section_title'] || assignedText['team_title']) {
    sections.team = {
      show: true,
      title: assignedText['team_section_title'] || assignedText['team_title'] || assignedText['sections.team.title'],
      description: assignedText['team_section_subtitle'] || assignedText['team_description'] || assignedText['team_desc'] || assignedText['sections.team.description'],
      showViewAll: true,
      viewAll: assignedText['team_view_all'] || assignedText['sections.team.viewAll'] || 'View All Team',
      items: [],
    };
  }

  // Services section - migrate from old format to structured format (for booking layouts)
  if (layoutContent.sections?.services) {
    sections.services = {
      show: layoutContent.sections.services.show !== false,
      title: layoutContent.sections.services.title,
      subtitle: layoutContent.sections.services.subtitle,
      showViewAll: layoutContent.sections.services.showViewAll !== false,
      viewAll: layoutContent.sections.services.viewAll,
      limit: layoutContent.sections.services.limit,
    };
  } else if (assignedText['services_section_title'] || assignedText['services_title']) {
    sections.services = {
      show: true,
      title: assignedText['services_section_title'] || assignedText['services_title'] || assignedText['sections.services.title'],
      subtitle: assignedText['services_section_subtitle'] || assignedText['services_subtitle'] || assignedText['sections.services.subtitle'],
      showViewAll: true,
      viewAll: assignedText['services_view_all'] || assignedText['sections.services.viewAll'] || 'View All Services',
      limit: 5,
    };
  }

  // Process section - migrate from old format to structured format (for booking layouts)
  if (layoutContent.sections?.process) {
    sections.process = {
      show: layoutContent.sections.process.show !== false,
      title: layoutContent.sections.process.title,
      subtitle: layoutContent.sections.process.subtitle,
      steps: layoutContent.sections.process.steps,
    };
  } else if (assignedText['process_title'] || assignedText['how_it_works_title']) {
    sections.process = {
      show: true,
      title: assignedText['process_title'] || assignedText['how_it_works_title'] || assignedText['sections.process.title'] || 'How it Works',
      subtitle: assignedText['process_subtitle'] || assignedText['how_it_works_subtitle'] || assignedText['sections.process.subtitle'],
      steps: [], // Will be populated from layout-specific process steps if available
    };
  }

  // Transform assignedText to structured text config
  const textConfig: any = {
    hero: {
      badge: assignedText['hero_badge'],
      title: assignedText['hero_title'],
      subtitle: assignedText['hero_subtitle'],
      primaryButton: assignedText['hero_primary_button'] || assignedText['hero_btn_label'] || assignedText['book_btn'],
      secondaryButton: assignedText['hero_secondary_button'] || assignedText['view_services_btn'],
      // Support multi-slide heroes
      slides: assignedText['hero_slide_1:heading'] ? [
        {
          badge: assignedText['hero_slide_1:badge'] || assignedText['hero_badge'],
          title: assignedText['hero_slide_1:heading'] || assignedText['hero_title'],
          description: assignedText['hero_slide_1:subheading'] || assignedText['hero_subtitle'],
          primaryButton: assignedText['hero_slide_1:btn_label'] || assignedText['hero_primary_button'],
          secondaryButton: assignedText['hero_slide_1:secondary_btn'] || assignedText['hero_secondary_button'],
        },
        assignedText['hero_slide_2:heading'] ? {
          badge: assignedText['hero_slide_2:badge'],
          title: assignedText['hero_slide_2:heading'],
          description: assignedText['hero_slide_2:subheading'],
          primaryButton: assignedText['hero_slide_2:btn_label'],
          secondaryButton: assignedText['hero_slide_2:secondary_btn'],
        } : undefined,
        assignedText['hero_slide_3:heading'] ? {
          badge: assignedText['hero_slide_3:badge'],
          title: assignedText['hero_slide_3:heading'],
          description: assignedText['hero_slide_3:subheading'],
          primaryButton: assignedText['hero_slide_3:btn_label'],
          secondaryButton: assignedText['hero_slide_3:secondary_btn'],
        } : undefined,
      ].filter(Boolean) : undefined,
    },
    sections: {
      categories: {
        title: assignedText['categories_title'],
        subtitle: assignedText['categories_subtitle'],
        viewAll: assignedText['categories_view_all'],
      },
      services: {
        title: assignedText['services_section_title'],
        subtitle: assignedText['services_section_subtitle'],
        listTitle: assignedText['services_list_title'],
        listCount: assignedText['services_list_count'],
      },
      testimonials: {
        quote: assignedText['testimonial_quote'],
        author: assignedText['testimonial_author'],
        role: assignedText['testimonial_role'],
        title: assignedText['testimonials_title'],
        subtitle: assignedText['testimonials_subtitle'],
      },
      cta: {
        title: assignedText['cta_title'],
        description: assignedText['cta_description'],
      },
      promo: {
        badge: assignedText['promo_badge'],
        title: assignedText['promo_title'],
        description: assignedText['promo_desc'],
      },
      experts: {
        title: assignedText['experts_section_title'],
        viewAll: assignedText['experts_view_all'],
      },
      featuredProducts: {
        title: assignedText['featured_products_title'] || assignedText['trending_title'] || assignedText['hero_slide_2:heading'],
        subtitle: assignedText['featured_products_subtitle'],
        viewAll: assignedText['featured_products_view_all'],
        emptyState: assignedText['featured_products_empty'],
      },
      marketing: {
        newsletter: {
          title: assignedText['newsletter_title'] || assignedText['footer_newsletter_title'],
          subtitle: assignedText['newsletter_subtitle'] || assignedText['footer_newsletter_subtitle'],
          button: assignedText['newsletter_button'] || assignedText['footer_newsletter_button'],
          placeholder: assignedText['newsletter_placeholder'],
          disclaimer: assignedText['newsletter_disclaimer'],
        },
        promoBanner: {
          title: assignedText['promo_banner_title'] || assignedText['promo_title'],
          subtitle: assignedText['promo_banner_subtitle'] || assignedText['promo_subtext'],
          button: assignedText['promo_banner_button'] || assignedText['promo_cta'],
        },
      },
      team: {
        title: assignedText['team_section_title'] || assignedText['team_title'],
        subtitle: assignedText['team_section_subtitle'] || assignedText['team_description'] || assignedText['team_desc'],
        viewAll: assignedText['team_view_all'],
      },
      process: {
        title: assignedText['process_title'],
        subtitle: assignedText['process_subtitle'],
      },
    },
    common: {
      shopNow: assignedText['common_shop_now'],
      viewAll: assignedText['common_view_all'],
      addToCart: assignedText['common_add_to_cart'],
      buyNow: assignedText['common_buy_now'],
      learnMore: assignedText['common_learn_more'],
      readMore: assignedText['common_read_more'],
      seeMore: assignedText['common_see_more'],
      discover: assignedText['common_discover'],
      explore: assignedText['common_explore'],
      new: assignedText['common_new'],
      trending: assignedText['common_trending'],
      limited: assignedText['common_limited'],
      sale: assignedText['common_sale'],
      outOfStock: assignedText['common_out_of_stock'],
      inStock: assignedText['common_in_stock'],
      selectSize: assignedText['common_select_size'],
      selectColor: assignedText['common_select_color'],
      quantity: assignedText['common_quantity'],
      reviews: assignedText['common_reviews'],
      writeReview: assignedText['common_write_review'],
      customerReviews: assignedText['common_customer_reviews'],
      noReviews: assignedText['common_no_reviews'],
      search: assignedText['common_search'],
      searchPlaceholder: assignedText['common_search_placeholder'],
      cart: assignedText['common_cart'],
      wishlist: assignedText['common_wishlist'],
      account: assignedText['common_account'],
      login: assignedText['common_login'],
      logout: assignedText['common_logout'],
      signup: assignedText['common_signup'],
      checkout: assignedText['common_checkout'],
      continueShopping: assignedText['common_continue_shopping'],
      proceedToCheckout: assignedText['common_proceed_to_checkout'],
    },
    footer: {
      newsletter: {
        title: assignedText['footer_newsletter_title'],
        subtitle: assignedText['footer_newsletter_subtitle'],
        button: assignedText['footer_newsletter_button'],
        placeholder: assignedText['footer_newsletter_placeholder'],
        disclaimer: assignedText['footer_newsletter_disclaimer'],
      },
      copyright: assignedText['footer_copyright'],
      links: {
        about: assignedText['footer_link_about'],
        contact: assignedText['footer_link_contact'],
        privacy: assignedText['footer_link_privacy'],
        terms: assignedText['footer_link_terms'],
        shipping: assignedText['footer_link_shipping'],
        faq: assignedText['footer_link_faq'],
      },
    },
    header: {
      searchPlaceholder: assignedText['header_search_placeholder'],
      cartEmpty: assignedText['header_cart_empty'],
      wishlistEmpty: assignedText['header_wishlist_empty'],
      accountMenu: {
        profile: assignedText['header_account_profile'],
        orders: assignedText['header_account_orders'],
        wishlist: assignedText['header_account_wishlist'],
        logout: assignedText['header_account_logout'],
      },
    },
    booking: {
      pageTitle: assignedText['booking_page_title'],
      pageSubtitle: assignedText['booking_page_subtitle'],
      bookAppointment: assignedText['booking_book_appointment'] || assignedText['book_btn'],
      viewServices: assignedText['booking_view_services'] || assignedText['view_services_btn'],
      selectDate: assignedText['booking_select_date'],
      selectService: assignedText['booking_select_service'],
      selectTime: assignedText['booking_select_time'],
      confirmBooking: assignedText['booking_confirm'],
      completePayment: assignedText['booking_complete_payment'],
      bookingConfirmed: assignedText['booking_confirmed'],
      limitedAvailability: assignedText['booking_limited_availability'],
      availableServices: assignedText['booking_available_services'] || assignedText['services_list_title'],
      showingResults: assignedText['booking_showing_results'] || assignedText['services_list_count'],
      filters: assignedText['booking_filters'],
      providers: assignedText['booking_providers'],
    },
    food: {
      reserveTable: assignedText['food_reserveTable'] || assignedText['food_reserve_table'],
      viewMenu: assignedText['food_viewMenu'] || assignedText['food_view_menu'],
      chefRecommendations: assignedText['food_chefRecommendations'] || assignedText['food_chef_recommendations'],
      ourPhilosophy: assignedText['food_ourPhilosophy'] || assignedText['food_our_philosophy'],
      meetChef: assignedText['food_meetChef'] || assignedText['food_meet_chef'],
      menuCategories: assignedText['food_menuCategories'] || assignedText['food_menu_categories'],
    },
    electronics: {
      newArrivals: assignedText['electronics_new_arrivals'],
      techSpecs: assignedText['electronics_tech_specs'],
      compare: assignedText['electronics_compare'],
      addToCompare: assignedText['electronics_add_to_compare'],
      removeFromCompare: assignedText['electronics_remove_from_compare'],
      brands: assignedText['electronics_brands'],
    },
  };

  // Remove undefined values to keep the config clean
  const cleanConfig = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(cleanConfig).filter(v => v !== undefined);
    
    const newObj: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      const cleaned = cleanConfig(value);
      if (cleaned !== undefined && !(typeof cleaned === 'object' && cleaned !== null && Object.keys(cleaned).length === 0)) {
        newObj[key] = cleaned;
      }
    });
    return Object.keys(newObj).length > 0 ? newObj : undefined;
  };

  const cleanTextConfig = cleanConfig(textConfig);

  // Transform theme colors if provided
  let themeColors: StoreLayoutConfig['themeColors'] | undefined;
  if (layoutContent.themeColors && typeof layoutContent.themeColors === 'object') {
    themeColors = {
      background: layoutContent.themeColors.background || undefined,
      text: layoutContent.themeColors.text || undefined,
      border: layoutContent.themeColors.border || undefined,
      gradient: layoutContent.themeColors.gradient || undefined,
      accent: layoutContent.themeColors.accent || undefined,
      layoutSpecific: layoutContent.themeColors.layoutSpecific || undefined,
    };
    // Remove undefined categories
    if (Object.values(themeColors).every(v => v === undefined)) {
      themeColors = undefined;
    }
  }

  // Also set hero at top level for backward compatibility (if sections.hero exists)
  const hero = sections?.hero ? {
    show: sections.hero.show !== false,
    showCTA: sections.hero.showCTA !== false,
    showSecondaryCTA: sections.hero.showSecondaryCTA !== false,
    autoPlay: sections.hero.autoPlay !== false,
    showBadges: sections.hero.showBadges !== false,
    sliders: sections.hero.sliders,
  } : undefined;

  return {
    hero, // Top-level hero for backward compatibility
    sections,
    assignedAssets,
    assignedText, // Preserve assignedText for direct access via getTextContent()
    assetRequirements: layoutContent.assetRequirements,
    text: Object.keys(cleanTextConfig).length > 0 ? cleanTextConfig : undefined,
    themeColors,
    version: layoutContent.version, // Preserve version for layout version checking
  } as StoreLayoutConfig;
}

/**
 * Result type for getStoreConfigAsync
 */
export interface StoreConfigResult {
  storeConfig: StoreConfig | null;
  maintenanceMode: boolean;
}

/**
 * Async function to get store configuration
 * - For demo stores: uses mock data from mock-stores
 * - For real stores: fetches from API and transforms to StoreConfig
 * - Returns null storeConfig if store not found (for 404 handling)
 * - Returns maintenanceMode flag when store exists but is not published/active
 */
export async function getStoreConfigAsync(storeSlug: string): Promise<StoreConfigResult> {
  try {
    console.log(`[StoreConfig] Loading store config for slug: ${storeSlug}`);
    if (shouldUseAPI(storeSlug)) {
      // Use API for non-demo stores
      const baseSlug = getBaseStoreSlug(storeSlug);
      console.log(`[StoreConfig] Using API for store. Base slug: ${baseSlug}`);
      const { store: apiStore, maintenanceMode } = await storeService.getStoreBySlug(baseSlug);
      console.log(`[StoreConfig] Store loaded from API: ${apiStore.name} (ID: ${apiStore.id})`);
      const storeConfig = transformStoreResponseToConfig(apiStore);

      // Fetch categories, products, and services in parallel
      const [categoriesResult, productsResult, servicesResult] = await Promise.allSettled([
        // Fetch categories (backend Category entity doesn't have isActive field, so include all)
        categoryService.getCategories(apiStore.id).then((apiCategories) =>
          apiCategories.map(transformCategoryToStoreCategory)
        ),
        // Fetch products (backend already filters for isActive: true)
        productService
          .getProducts({
            storeId: apiStore.id,
            limit: 1000, // Fetch a large number to get all products for the store config
          })
          .then((response) => response.data.map(transformProductToStoreProduct)),
        // Fetch services (backend already filters for isActive: true)
        serviceService
          .getServices(apiStore.id)
          .then((apiServices) => apiServices.map(transformServiceToStoreService)),
      ]);

      // Extract results with graceful degradation
      const categories: StoreCategory[] =
        categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
      const products: StoreProduct[] =
        productsResult.status === 'fulfilled' ? productsResult.value : [];
      const services: StoreService[] =
        servicesResult.status === 'fulfilled' ? servicesResult.value : [];

      // Log errors if any occurred
      if (categoriesResult.status === 'rejected') {
        console.error('[StoreConfig] Failed to fetch categories:', categoriesResult.reason);
        console.error('[StoreConfig] Category error details:', {
          message: categoriesResult.reason?.message,
          status: categoriesResult.reason?.status,
          response: categoriesResult.reason?.response?.data,
        });
      } else {
        console.log(`[StoreConfig] Successfully fetched ${categories.length} categories for store ${apiStore.id} (${apiStore.slug})`);
        if (categories.length === 0) {
          console.warn(`[StoreConfig] WARNING: No categories found for store ${apiStore.id}. This may indicate missing data in the database.`);
        }
      }
      if (productsResult.status === 'rejected') {
        console.error('[StoreConfig] Failed to fetch products:', productsResult.reason);
        console.error('[StoreConfig] Product error details:', {
          message: productsResult.reason?.message,
          status: productsResult.reason?.status,
          response: productsResult.reason?.response?.data,
        });
      } else {
        console.log(`[StoreConfig] Successfully fetched ${products.length} products for store ${apiStore.id} (${apiStore.slug})`);
        if (products.length === 0) {
          console.warn(`[StoreConfig] WARNING: No products found for store ${apiStore.id}. This may indicate missing data in the database.`);
        }
      }
      if (servicesResult.status === 'rejected') {
        console.error('[StoreConfig] Failed to fetch services:', servicesResult.reason);
        console.error('[StoreConfig] Service error details:', {
          message: servicesResult.reason?.message,
          status: servicesResult.reason?.status,
          response: servicesResult.reason?.response?.data,
        });
      } else {
        console.log(`[StoreConfig] Successfully fetched ${services.length} services for store ${apiStore.id} (${apiStore.slug})`);
        if (services.length === 0) {
          console.warn(`[StoreConfig] WARNING: No services found for store ${apiStore.id}. This may indicate missing data in the database.`);
        }
      }

      // Populate categories, products, and services in storeConfig
      storeConfig.categories = categories;
      storeConfig.products = products;
      storeConfig.services = services;

      console.log(`[StoreConfig] Final storeConfig populated with ${categories.length} categories, ${products.length} products, and ${services.length} services`);

      return {
        storeConfig,
        maintenanceMode: maintenanceMode || false,
      };
    } else {
      // Use mock data for demo stores (always active and published)
      const baseSlug = getBaseStoreSlug(storeSlug);
      console.log(`[StoreConfig] Using mock data for demo store. Base slug: ${baseSlug}`);
      const storeConfig = getStoreConfig(baseSlug);
      if (storeConfig) {
        console.log(`[StoreConfig] Mock store loaded: ${storeConfig.name} with ${storeConfig.categories?.length || 0} categories and ${storeConfig.products?.length || 0} products`);
      }
      return {
        storeConfig,
        maintenanceMode: false, // Demo stores are always available
      };
    }
  } catch (error: any) {
    // Check if it's a 404 (store not found) vs other error
    const isNotFound = error?.status === 404 || error?.response?.status === 404;
    
    if (isNotFound) {
      // Store truly doesn't exist
      return {
        storeConfig: null,
        maintenanceMode: false,
      };
    }
    
    // Other API errors - log and return null
    console.error('Failed to fetch store config:', error);
    return {
      storeConfig: null,
      maintenanceMode: false,
    };
  }
}


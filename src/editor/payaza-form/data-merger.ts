import { OverlayLayoutJSON } from './engine';
import { StoreConfig } from '../../lib/store-types';
import { deepClone } from '../../lib/utils';
import { transformToStoreConfig } from './data-transformer';

/**
 * Deep merge two objects, with source taking precedence over target
 * Special handling for arrays: prefer source array if it has items, otherwise use target
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      // Handle arrays: prefer source if it has items, otherwise keep target
      if (Array.isArray(sourceValue)) {
        if (sourceValue.length > 0) {
          // Source array has items, use it
          result[key] = sourceValue as T[Extract<keyof T, string>];
        } else if (Array.isArray(targetValue) && targetValue.length > 0) {
          // Source is empty but target has items, keep target
          result[key] = targetValue;
        } else {
          // Both empty, use source (empty array)
          result[key] = sourceValue as T[Extract<keyof T, string>];
        }
      } else if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Recursively merge nested objects
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        // Use source value (takes precedence)
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Merge arrays by matching IDs or by index
 * Source (actual data) always takes precedence
 */
function mergeArrays(targetArray: any[], sourceArray: any[]): any[] {
  if (!sourceArray || sourceArray.length === 0) {
    return targetArray || [];
  }

  if (!targetArray || targetArray.length === 0) {
    return sourceArray;
  }

  // Source array (actual data from DB) is our primary source of truth for items
  const result: any[] = [];
  const usedTargetIndices = new Set<number>();

  for (let i = 0; i < sourceArray.length; i++) {
    const sourceItem = sourceArray[i];
    
    if (sourceItem && typeof sourceItem === 'object' && sourceItem.id) {
      // Try to find matching item in target (requirement defaults) by ID
      const targetIndex = targetArray.findIndex(
        (item, idx) => item && item.id === sourceItem.id && !usedTargetIndices.has(idx)
      );
      
      if (targetIndex !== -1) {
        // Merge actual data on top of requirement defaults
        result.push(deepMerge(targetArray[targetIndex], sourceItem));
        usedTargetIndices.add(targetIndex);
      } else {
        // No matching requirement item, use actual data as is
        result.push(sourceItem);
      }
    } else {
      // No ID, try to merge by index if target has item at this index
      if (i < targetArray.length && !usedTargetIndices.has(i)) {
        result.push(deepMerge(targetArray[i], sourceItem));
        usedTargetIndices.add(i);
      } else {
        result.push(sourceItem);
      }
    }
  }

  return result;
}

/**
 * Helper to resolve deep path from object
 */
function getValueByPath(obj: any, path: string): any {
  if (!path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Extract page-specific data from StoreConfig layoutConfig structure
 */
export function extractActualPageData(
  storeConfig: StoreConfig,
  pageId: string,
  requirement?: OverlayLayoutJSON
): Record<string, any> {
  const layoutConfig = storeConfig.layoutConfig;
  if (!layoutConfig) {
    return {};
  }

  const pageDataMap: Record<string, any> = {};

  // If requirement is provided, use its schema to find data paths
  // This is the PRIMARY method and should always be used when available
  if (requirement) {
    const requirementPage = requirement.pages.find(p => p.id === pageId);
    if (requirementPage) {
      const sections = requirementPage._schema;

      for (const sectionKey in sections) {
        const sectionSchema = sections[sectionKey];
        if (sectionSchema._sourcePath) {
          // Explicit source path mapping - this is the authoritative source
          const value = getValueByPath(storeConfig, sectionSchema._sourcePath);
          if (value !== undefined && value !== null) {
            pageDataMap[sectionKey] = deepClone(value);
          }
        }
      }
      
      return pageDataMap;
    }
  }

  // Fallback to traditional mapping logic for common sections
  // This ensures backward compatibility if _sourcePath is missing or requirement not provided
  const layoutSections = layoutConfig.sections || {};
  const pages = layoutConfig.pages || {};
  
  // Home page sections
  if (pageId === 'home') {
    if (layoutConfig.hero || layoutSections.hero) {
      const hero = layoutConfig.hero || layoutSections.hero;
      pageDataMap.hero = deepClone({
        ...hero,
        sliders: hero.sliders ? [...hero.sliders] : [],
      });
    }
    if (layoutSections.features) pageDataMap.benefitsStrip = layoutSections.features;
    if (layoutSections.categories) pageDataMap.categories = layoutSections.categories;
    if (layoutSections.featuredProducts) pageDataMap.featuredProducts = layoutSections.featuredProducts;
    if (layoutSections.marketing?.newsletter) pageDataMap.newsletter = layoutSections.marketing.newsletter;
    else if (layoutSections.subscription) pageDataMap.newsletter = layoutSections.subscription;
    if (layoutSections.marketing?.editorial) {
      pageDataMap.editorial = layoutSections.marketing.editorial;
      pageDataMap.lookbook = layoutSections.marketing.editorial;
    }
    if (layoutSections.marketing?.promoBanner) pageDataMap.promoBanner = layoutSections.marketing.promoBanner;
  }

  // Products page
  if (pageId === 'products') {
    const productsPage = pages.products || {};
    // Check pages.products first, then fallback to sections
    if (productsPage.productsHeader || layoutSections.productsHeader) {
      pageDataMap.productsHeader = {
        show: true,
        ...(productsPage.productsHeader || layoutSections.productsHeader || {}),
      };
    }
    if (productsPage.productsGrid || layoutSections.productsGrid) {
      pageDataMap.productsGrid = {
        show: true,
        ...(productsPage.productsGrid || layoutSections.productsGrid || {}),
      };
    }
  }

  // Product detail page
  if (pageId === 'productDetail') {
    if (layoutSections.productDetail) {
      pageDataMap.productDetail = {
        show: true,
        ...layoutSections.productDetail,
      };
    }
  }

  // Categories page
  if (pageId === 'categories') {
    const categoriesPage = pages.categories || {};
    // Check pages.categories first, then fallback to sections
    if (categoriesPage.categoriesHeader || layoutSections.categoriesHeader) {
      pageDataMap.categoriesHeader = {
        show: true,
        ...(categoriesPage.categoriesHeader || layoutSections.categoriesHeader || {}),
      };
    }
    if (categoriesPage.categoryGrid || layoutSections.categoryGrid) {
      pageDataMap.categoryGrid = {
        show: true,
        ...(categoriesPage.categoryGrid || layoutSections.categoryGrid || {}),
      };
    }
  }

  // Category detail page
  if (pageId === 'categoryDetail') {
    if (layoutSections.categoryDetail) {
      pageDataMap.categoryDetail = {
        show: true,
        ...layoutSections.categoryDetail,
      };
    }
  }

  // About page
  if (pageId === 'about') {
    const aboutPage = pages.about || {};
    // Check pages.about first, then fallback to sections
    // Hero section
    if (aboutPage.hero || layoutSections.hero) {
      pageDataMap.hero = {
        show: true,
        ...(aboutPage.hero || layoutSections.hero || {}),
      };
    }
    // Story section
    if (aboutPage.story || layoutSections.story) {
      pageDataMap.story = {
        show: true,
        ...(aboutPage.story || layoutSections.story || {}),
      };
    }
    // Stats section
    if (aboutPage.stats || layoutSections.stats) {
      pageDataMap.stats = {
        show: true,
        ...(aboutPage.stats || layoutSections.stats || {}),
      };
    }
    // Contact-info section (note: key has hyphen, so use bracket notation)
    if (aboutPage['contact-info'] || layoutSections['contact-info']) {
      pageDataMap['contact-info'] = {
        show: true,
        ...(aboutPage['contact-info'] || layoutSections['contact-info'] || {}),
      };
    }
    // Values section
    if (aboutPage.values || layoutSections.values) {
      pageDataMap.values = {
        show: true,
        ...(aboutPage.values || layoutSections.values || {}),
      };
    }
    
    // Legacy support for old structure
    if (layoutSections.aboutHeader) pageDataMap.aboutHeader = { show: true, ...layoutSections.aboutHeader };
    if (layoutSections.aboutContent) pageDataMap.aboutContent = { show: true, ...layoutSections.aboutContent };
    if (layoutSections.about) pageDataMap.aboutPage = { show: true, ...layoutSections.about };
  }

  // Contact page
  if (pageId === 'contact') {
    const contactPage = pages.contact || {};
    // Check pages.contact first, then fallback to sections
    if (contactPage.contactHeader || layoutSections.contactHeader) {
      pageDataMap.contactHeader = {
        show: true,
        ...(contactPage.contactHeader || layoutSections.contactHeader || {}),
      };
    }
    if (contactPage.contactForm || layoutSections.contactForm) {
      pageDataMap.contactForm = {
        show: true,
        ...(contactPage.contactForm || layoutSections.contactForm || {}),
      };
    }
    
    // Legacy support for minimal layout
    if (layoutSections.contact) pageDataMap.contactPage = { show: true, ...layoutSections.contact };
  }

  return pageDataMap;
}

/**
 * Merge requirement schema with actual layout data
 * Actual data takes precedence, but requirement provides structure and defaults
 */
export function mergeRequirementWithActualData(
  requirement: OverlayLayoutJSON,
  storeConfig: StoreConfig,
  pageId: string,
  options: { actualDataPrecedence?: boolean } = { actualDataPrecedence: true }
): OverlayLayoutJSON {
  // Find the page in requirement
  const requirementPage = requirement.pages.find(p => p.id === pageId);
  if (!requirementPage) {
    // Page not in requirement, return requirement as-is
    return requirement;
  }

  // Extract actual data for this page
  const actualPageData = extractActualPageData(storeConfig, pageId, requirement);
  
  // Create merged page data - start with requirement defaults
  const mergedPageData: Record<string, any> = { ...requirementPage.data };

  // If we want actual data to take precedence (normal loading)
  if (options.actualDataPrecedence) {
    // First, merge all sections that exist in requirement
    for (const sectionKey in requirementPage.data) {
      const requirementSection = requirementPage.data[sectionKey];
      const actualSection = actualPageData[sectionKey];

      if (actualSection) {
        // Special handling for hero section to ensure sliders are preserved
        if (sectionKey === 'hero' && 
            typeof requirementSection === 'object' &&
            typeof actualSection === 'object' &&
            !Array.isArray(requirementSection) &&
            !Array.isArray(actualSection)) {
          // For hero section, start with actual data (it has the real values)
          // Then merge requirement defaults for any missing properties
          const mergedHero = {
            ...requirementSection, // Start with requirement defaults
            ...actualSection,      // Override with actual data (takes precedence)
          };
          
          // Explicitly preserve sliders from actual data if they exist and have items
          // Otherwise, use requirement sliders if actual has none
          if (actualSection.sliders && Array.isArray(actualSection.sliders) && actualSection.sliders.length > 0) {
            mergedHero.sliders = [...actualSection.sliders]; // Deep copy
          } else if (requirementSection.sliders && Array.isArray(requirementSection.sliders)) {
            // Use requirement sliders if actual has none
            mergedHero.sliders = [...requirementSection.sliders];
          }
          
          mergedPageData[sectionKey] = mergedHero;
        } else if (Array.isArray(requirementSection) && Array.isArray(actualSection)) {
          // Merge arrays
          mergedPageData[sectionKey] = mergeArrays(requirementSection, actualSection);
        } else if (
          typeof requirementSection === 'object' &&
          requirementSection !== null &&
          !Array.isArray(requirementSection) &&
          typeof actualSection === 'object' &&
          actualSection !== null &&
          !Array.isArray(actualSection)
        ) {
          // Deep merge objects
          mergedPageData[sectionKey] = deepMerge(requirementSection, actualSection);
        } else {
          // Use actual value
          mergedPageData[sectionKey] = actualSection;
        }
      }
      // If no actual section, keep requirement default
    }

    // Also add any sections from actual data that don't exist in requirement
    // This ensures we don't lose any sections that exist in the store but not in requirement
    for (const sectionKey in actualPageData) {
      if (!mergedPageData[sectionKey] && actualPageData[sectionKey]) {
        // Section exists in actual data but not in requirement - add it
        mergedPageData[sectionKey] = actualPageData[sectionKey];
      }
    }
  } else {
    // AI Precedence mode: requirementPage.data (AI data) already contains the updates.
    // We just want to make sure we don't lose sections that WEREN'T updated by AI
    // but exist in actualPageData.
    for (const sectionKey in actualPageData) {
      if (mergedPageData[sectionKey] === undefined && actualPageData[sectionKey]) {
        mergedPageData[sectionKey] = actualPageData[sectionKey];
      }
    }
  }

  // Create merged page - preserve schema from requirement
  const mergedPage = {
    ...requirementPage,
    data: mergedPageData,
    // CRITICAL: Preserve the _schema from requirement - don't overwrite it!
    _schema: requirementPage._schema,
  };

  // Create merged layout JSON
  const mergedLayout: OverlayLayoutJSON = {
    ...requirement,
    pages: requirement.pages.map(p => (p.id === pageId ? mergedPage : p)),
  };
  
  return mergedLayout;
}

/**
 * Merge ALL pages in a requirement with actual data from StoreConfig
 * This ensures the StoreConfig is fully populated with defaults for all pages
 */
export function mergeAllPagesWithActualData(
  requirement: OverlayLayoutJSON,
  storeConfig: StoreConfig,
  options: { actualDataPrecedence?: boolean } = { actualDataPrecedence: true }
): StoreConfig {
  let currentStoreConfig = { ...storeConfig };

  // Iterate through all pages in the requirement and merge them one by one
  // transformToStoreConfig handles the projection back to StoreConfig
  requirement.pages.forEach(page => {
    const mergedLayout = mergeRequirementWithActualData(requirement, currentStoreConfig, page.id, options);
    currentStoreConfig = transformToStoreConfig(mergedLayout, page.id, currentStoreConfig);
  });

  return currentStoreConfig;
}

import { OverlayLayoutJSON, resolveDataPath, setDataPath } from './engine';
import { StoreConfig, StoreLayoutType } from '../../lib/store-types';
import { deepClone } from '../../lib/utils';

/**
 * Helper to set value at deep path in object
 */
function setValueByPath(obj: any, path: string, value: any): any {
  if (!path) return obj;
  const parts = path.split('.');
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current[part] = { ...current[part] };
    current = current[part];
  }

  // If the value is an object, merge it with existing data at that path
  // This prevents sibling sections from overwriting each other
  const existingValue = current[parts[parts.length - 1]];
  if (
    typeof value === 'object' && 
    value !== null && 
    !Array.isArray(value) && 
    typeof existingValue === 'object' && 
    existingValue !== null && 
    !Array.isArray(existingValue)
  ) {
    current[parts[parts.length - 1]] = {
      ...existingValue,
      ...value
    };
  } else {
  current[parts[parts.length - 1]] = value;
  }
  
  return result;
}

/**
 * Transform overlay JSON to StoreConfig format for preview
 * Merges page data into existing StoreConfig to preserve all properties
 */
export function transformToStoreConfig(
  layoutJson: OverlayLayoutJSON,
  pageId: string,
  baseStoreConfig?: StoreConfig
): StoreConfig {
  const page = layoutJson.pages.find(p => p.id === pageId);
  if (!page) {
    throw new Error(`Page ${pageId} not found in layout JSON`);
  }

  // If no baseStoreConfig, create a minimal one
  let storeConfig: StoreConfig = baseStoreConfig 
    ? { ...baseStoreConfig, layout: layoutJson.layoutId as StoreLayoutType }
    : ({ layout: layoutJson.layoutId as StoreLayoutType, layoutConfig: { sections: {} } } as StoreConfig);

  // Use schema to project data back to StoreConfig structure
  const sections = page._schema;
  const pageData = page.data;

  // Initialize layoutConfig structure
  if (!storeConfig.layoutConfig) storeConfig.layoutConfig = { sections: {} };
  if (!storeConfig.layoutConfig.sections) storeConfig.layoutConfig.sections = {};
  
  // For non-home pages, initialize pages structure
  if (pageId !== 'home') {
    if (!storeConfig.layoutConfig.pages) storeConfig.layoutConfig.pages = {};
    if (!storeConfig.layoutConfig.pages[pageId]) storeConfig.layoutConfig.pages[pageId] = {};
  }

  for (const sectionKey in sections) {
    const sectionSchema = sections[sectionKey];
    const sectionData = pageData[sectionKey];

    if (sectionData === undefined) continue;

    if (sectionSchema._sourcePath) {
      // Use explicit source path to project data back
      // This ensures data is saved to the exact same location it was loaded from
      const clonedData = deepClone(sectionData);
      storeConfig = setValueByPath(storeConfig, sectionSchema._sourcePath, clonedData);
    } else {
      // Fallback: Save to appropriate location based on pageId
      if (pageId === 'home') {
        // Home page: save to sections[sectionKey]
        storeConfig.layoutConfig.sections[sectionKey] = deepClone(sectionData);
      } else {
        // Non-home pages: save to pages[pageId][sectionKey]
        storeConfig.layoutConfig.pages![pageId][sectionKey] = deepClone(sectionData);
        // Also save to sections for backward compatibility
        storeConfig.layoutConfig.sections[sectionKey] = deepClone(sectionData);
      }
    }
  }
  
  return storeConfig;
}

/**
 * Update overlay JSON data from editor changes
 */
export function updateOverlayData(
  layoutJson: OverlayLayoutJSON,
  pageId: string,
  sectionKey: string,
  fieldPath: string[],
  value: any
): OverlayLayoutJSON {
  const updatedJson = { ...layoutJson };
  const pageIndex = updatedJson.pages.findIndex(p => p.id === pageId);
  
  if (pageIndex === -1) {
    throw new Error(`Page ${pageId} not found`);
  }

  const page = { ...updatedJson.pages[pageIndex] };
  const updatedData = { ...page.data };

  // Navigate to the section
  if (!updatedData[sectionKey]) {
    updatedData[sectionKey] = {};
  }

  // Set the value at the path
  let current = updatedData[sectionKey];
  for (let i = 0; i < fieldPath.length - 1; i++) {
    const key = fieldPath[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current[key] = { ...current[key] };
    current = current[key];
  }
  current[fieldPath[fieldPath.length - 1]] = value;

  page.data = updatedData;
  updatedJson.pages[pageIndex] = page;

  return updatedJson;
}

/**
 * Update array item in overlay data
 */
export function updateArrayItem(
  layoutJson: OverlayLayoutJSON,
  pageId: string,
  sectionKey: string,
  arrayPath: string[],
  index: number,
  itemValue: any
): OverlayLayoutJSON {
  const updatedJson = { ...layoutJson };
  const pageIndex = updatedJson.pages.findIndex(p => p.id === pageId);
  
  if (pageIndex === -1) {
    throw new Error(`Page ${pageId} not found`);
  }

  const page = { ...updatedJson.pages[pageIndex] };
  const updatedData = { ...page.data };

  // Navigate to the array
  let current = updatedData[sectionKey];
  for (const key of arrayPath) {
    if (!current[key]) {
      current[key] = [];
    }
    current[key] = [...current[key]];
    current = current[key];
  }

  // Update the item at index
  if (Array.isArray(current)) {
    current[index] = itemValue;
  }

  page.data = updatedData;
  updatedJson.pages[pageIndex] = page;

  return updatedJson;
}

/**
 * Add array item to overlay data
 */
export function addArrayItem(
  layoutJson: OverlayLayoutJSON,
  pageId: string,
  sectionKey: string,
  arrayPath: string[],
  newItem: any
): OverlayLayoutJSON {
  const updatedJson = { ...layoutJson };
  const pageIndex = updatedJson.pages.findIndex(p => p.id === pageId);
  
  if (pageIndex === -1) {
    throw new Error(`Page ${pageId} not found`);
  }

  const page = { ...updatedJson.pages[pageIndex] };
  const updatedData = { ...page.data };

  // Navigate to the array
  let current = updatedData[sectionKey];
  for (const key of arrayPath) {
    if (!current[key]) {
      current[key] = [];
    }
    current[key] = [...current[key]];
    current = current[key];
  }

  // Add the new item
  if (Array.isArray(current)) {
    current.push(newItem);
  }

  page.data = updatedData;
  updatedJson.pages[pageIndex] = page;

  return updatedJson;
}

/**
 * Remove array item from overlay data
 */
export function removeArrayItem(
  layoutJson: OverlayLayoutJSON,
  pageId: string,
  sectionKey: string,
  arrayPath: string[],
  index: number
): OverlayLayoutJSON {
  const updatedJson = { ...layoutJson };
  const pageIndex = updatedJson.pages.findIndex(p => p.id === pageId);
  
  if (pageIndex === -1) {
    throw new Error(`Page ${pageId} not found`);
  }

  const page = { ...updatedJson.pages[pageIndex] };
  const updatedData = { ...page.data };

  // Navigate to the array
  let current = updatedData[sectionKey];
  for (const key of arrayPath) {
    if (!current[key]) {
      return updatedJson; // Array doesn't exist
    }
    current[key] = [...current[key]];
    current = current[key];
  }

  // Remove the item at index
  if (Array.isArray(current)) {
    current.splice(index, 1);
  }

  page.data = updatedData;
  updatedJson.pages[pageIndex] = page;

  return updatedJson;
}

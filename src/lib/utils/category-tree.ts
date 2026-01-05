import { StoreCategory } from '@/lib/store-types';

/**
 * Builds a hierarchical category tree from a flat array of categories
 * Filters to show only root categories (no parentId) and recursively attaches children
 * 
 * @param categories - Flat array of categories with parentId references
 * @returns Array of root categories with nested children
 */
export function buildCategoryTree(categories: StoreCategory[]): StoreCategory[] {
  if (!categories || categories.length === 0) {
    return [];
  }

  // Create a map for quick lookup
  const categoryMap = new Map<string, StoreCategory>();
  const rootCategories: StoreCategory[] = [];

  // First pass: create copies of all categories and add to map
  categories.forEach(category => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  });

  // Second pass: build the tree structure
  categories.forEach(category => {
    const categoryCopy = categoryMap.get(category.id)!;
    
    if (category.parentId) {
      // This is a child category
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(categoryCopy);
      }
    } else {
      // This is a root category
      rootCategories.push(categoryCopy);
    }
  });

  // Sort root categories and recursively sort children
  const sortCategories = (cats: StoreCategory[]): StoreCategory[] => {
    return cats
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(cat => ({
        ...cat,
        children: cat.children ? sortCategories(cat.children) : undefined,
      }));
  };

  return sortCategories(rootCategories);
}

/**
 * Flattens a category tree back to a flat array (useful for filtering)
 * 
 * @param categoryTree - Hierarchical category tree
 * @returns Flat array of all categories including children
 */
export function flattenCategoryTree(categoryTree: StoreCategory[]): StoreCategory[] {
  const result: StoreCategory[] = [];
  
  const traverse = (categories: StoreCategory[]) => {
    categories.forEach(category => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        traverse(category.children);
      }
    });
  };
  
  traverse(categoryTree);
  return result;
}

/**
 * Gets all category IDs from a category and its children (recursively)
 * Useful for filtering products when a parent category is selected
 * 
 * @param category - Category to get IDs from
 * @returns Array of category IDs including the category itself and all descendants
 */
export function getAllCategoryIds(category: StoreCategory): string[] {
  const ids = [category.id];
  
  if (category.children && category.children.length > 0) {
    category.children.forEach(child => {
      ids.push(...getAllCategoryIds(child));
    });
  }
  
  return ids;
}


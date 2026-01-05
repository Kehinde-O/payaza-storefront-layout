import { StoreCategory } from '../../lib/store-types';
/**
 * Builds a hierarchical category tree from a flat array of categories
 * Filters to show only root categories (no parentId) and recursively attaches children
 *
 * @param categories - Flat array of categories with parentId references
 * @returns Array of root categories with nested children
 */
export declare function buildCategoryTree(categories: StoreCategory[]): StoreCategory[];
/**
 * Flattens a category tree back to a flat array (useful for filtering)
 *
 * @param categoryTree - Hierarchical category tree
 * @returns Flat array of all categories including children
 */
export declare function flattenCategoryTree(categoryTree: StoreCategory[]): StoreCategory[];
/**
 * Gets all category IDs from a category and its children (recursively)
 * Useful for filtering products when a parent category is selected
 *
 * @param category - Category to get IDs from
 * @returns Array of category IDs including the category itself and all descendants
 */
export declare function getAllCategoryIds(category: StoreCategory): string[];
//# sourceMappingURL=category-tree.d.ts.map
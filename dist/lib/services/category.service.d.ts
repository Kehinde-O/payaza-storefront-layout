export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    storeId: string;
    parentId?: string;
    isActive?: boolean;
}
export declare const categoryService: {
    /**
     * Get all categories for a store
     */
    getCategories(storeId: string): Promise<Category[]>;
    /**
     * Get category by slug
     */
    getCategoryBySlug(slug: string, storeId: string): Promise<Category>;
};
//# sourceMappingURL=category.service.d.ts.map
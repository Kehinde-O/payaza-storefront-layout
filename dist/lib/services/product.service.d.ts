export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    images: Array<{
        url: string;
        isPrimary?: boolean;
    }> | string[];
    isActive: boolean;
    isFeatured: boolean;
    status?: 'active' | 'inactive' | 'draft';
    productType: 'food' | 'retail' | 'service' | 'mixed';
    currency: string;
    storeId: string;
    categoryId?: string;
    subcategoryId?: string;
    subcategory?: any;
    locationId?: string;
    location?: any;
    sku?: string;
    barcode?: string;
    stock?: number;
    rating?: number;
    brand?: string;
    trackInventory?: boolean;
    lowStockThreshold?: number;
    variations?: any[];
    inventory?: any[];
    metadata?: Record<string, any>;
    merchantId?: string;
}
export interface ProductListParams {
    storeId: string;
    categoryId?: string;
    locationId?: string;
    productType?: string;
    checkoutType?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    rating?: number;
    inStock?: boolean;
    sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare const productService: {
    /**
     * Get products with filtering, sorting, and pagination
     */
    getProducts(params: ProductListParams): Promise<PaginatedResponse<Product>>;
    /**
     * Get product by ID
     */
    getProductById(id: string): Promise<Product>;
    /**
     * Get product by slug
     */
    getProductBySlug(slug: string, storeId: string): Promise<{
        product: Product;
        relatedProducts: Product[];
    }>;
    /**
     * Get related products
     */
    getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
    /**
     * Get trending products
     */
    getTrendingProducts(storeId: string, limit?: number): Promise<Product[]>;
    /**
     * Get featured products
     */
    getFeaturedProducts(storeId: string, limit?: number): Promise<Product[]>;
};
//# sourceMappingURL=product.service.d.ts.map
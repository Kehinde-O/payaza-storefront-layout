import { api } from '../api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{ url: string; isPrimary?: boolean }> | string[];
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

export const productService = {
  /**
   * Get products with filtering, sorting, and pagination
   */
  async getProducts(params: ProductListParams): Promise<PaginatedResponse<Product>> {
    try {
      console.log(`[ProductService] Fetching products with params:`, { storeId: params.storeId, limit: params.limit });
      const response = await api.get<{ status: string; data: Product[]; meta: any; message?: string }>('/products', { params });
      if (response.data.status === 'success') {
        console.log(`[ProductService] Successfully fetched ${response.data.data.length} products (total: ${response.data.meta?.total || 0})`);
        return {
          data: response.data.data,
          meta: response.data.meta || { page: 1, limit: 20, total: 0, totalPages: 0 },
        };
      }
      throw new Error(response.data.message || 'Failed to fetch products');
    } catch (error: any) {
      console.error('[ProductService] Error fetching products:', {
        params,
        message: error.message,
        status: error.status,
        response: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<{ status: string; data: Product; message?: string }>(`/products/${id}`);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch product');
  },

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string, storeId: string): Promise<{ product: Product; relatedProducts: Product[] }> {
    const response = await api.get<{ status: string; data: { product: Product; relatedProducts: Product[] }; message?: string }>(
      `/products/slug/${slug}`,
      { params: { storeId } }
    );
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch product');
  },

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    const response = await api.get<{ status: string; data: Product[]; message?: string }>(`/products/${productId}/related`, {
      params: { limit },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch related products');
  },

  /**
   * Get trending products
   */
  async getTrendingProducts(storeId: string, limit: number = 10): Promise<Product[]> {
    const response = await api.get<{ status: string; data: Product[]; message?: string }>('/products/trending', {
      params: { storeId, limit },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch trending products');
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(storeId: string, limit: number = 10): Promise<Product[]> {
    const response = await api.get<{ status: string; data: Product[]; message?: string }>('/products/featured', {
      params: { storeId, limit },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch featured products');
  },
};


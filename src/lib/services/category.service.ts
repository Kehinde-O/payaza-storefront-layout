import { api } from '../api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  storeId: string;
  parentId?: string;
  isActive?: boolean; // Optional - backend Category entity doesn't have this field
}

export const categoryService = {
  /**
   * Get all categories for a store
   */
  async getCategories(storeId: string): Promise<Category[]> {
    try {
      console.log(`[CategoryService] Fetching categories for storeId: ${storeId}`);
      const response = await api.get<{ status: string; data: Category[]; message?: string }>('/categories', {
        params: { storeId },
      });
      if (response.data.status === 'success') {
        console.log(`[CategoryService] Successfully fetched ${response.data.data.length} categories`);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch categories');
    } catch (error: any) {
      console.error('[CategoryService] Error fetching categories:', {
        storeId,
        message: error.message,
        status: error.status,
        response: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string, storeId: string): Promise<Category> {
    const response = await api.get<{ status: string; data: Category; message?: string }>(`/categories/slug/${slug}`, {
      params: { storeId },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch category');
  },
};


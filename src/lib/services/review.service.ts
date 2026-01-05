import { api } from '../api';

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  productId: string;
  customerId: string;
  customer?: any;
  createdAt: string;
}

export interface CreateReviewDto {
  rating: number;
  comment?: string;
  title?: string;
}

export interface PaginatedReviews {
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const reviewService = {
  /**
   * Get product reviews
   */
  async getProductReviews(productId: string, page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
    const response = await api.get<{ status: string; data: Review[]; meta: any; message?: string }>(
      `/products/${productId}/reviews`,
      { params: { page, limit } }
    );
    if (response.data.status === 'success') {
      return {
        data: response.data.data,
        meta: response.data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
    throw new Error(response.data.message || 'Failed to fetch reviews');
  },

  /**
   * Create a review (requires authentication)
   */
  async createReview(productId: string, data: CreateReviewDto): Promise<Review> {
    const response = await api.post<{ status: string; data: Review; message?: string }>(`/products/${productId}/reviews`, data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create review');
  },

  /**
   * Update a review (requires authentication, owner only)
   */
  async updateReview(productId: string, reviewId: string, data: Partial<CreateReviewDto>): Promise<Review> {
    const response = await api.put<{ status: string; data: Review; message?: string }>(
      `/products/${productId}/reviews/${reviewId}`,
      data
    );
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update review');
  },

  /**
   * Delete a review (requires authentication, owner only)
   */
  async deleteReview(productId: string, reviewId: string): Promise<void> {
    const response = await api.delete<{ status: string; message?: string }>(`/products/${productId}/reviews/${reviewId}`);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to delete review');
    }
  },

  /**
   * Mark review as helpful (requires authentication)
   */
  async markHelpful(productId: string, reviewId: string): Promise<void> {
    const response = await api.post<{ status: string; message?: string }>(`/products/${productId}/reviews/${reviewId}/helpful`);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to mark review as helpful');
    }
  },
};


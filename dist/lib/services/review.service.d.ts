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
export declare const reviewService: {
    /**
     * Get product reviews
     */
    getProductReviews(productId: string, page?: number, limit?: number): Promise<PaginatedReviews>;
    /**
     * Create a review (requires authentication)
     */
    createReview(productId: string, data: CreateReviewDto): Promise<Review>;
    /**
     * Update a review (requires authentication, owner only)
     */
    updateReview(productId: string, reviewId: string, data: Partial<CreateReviewDto>): Promise<Review>;
    /**
     * Delete a review (requires authentication, owner only)
     */
    deleteReview(productId: string, reviewId: string): Promise<void>;
    /**
     * Mark review as helpful (requires authentication)
     */
    markHelpful(productId: string, reviewId: string): Promise<void>;
};
//# sourceMappingURL=review.service.d.ts.map
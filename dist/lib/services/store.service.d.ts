export interface StoreResponse {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    banner?: string;
    layout?: string;
    /** Aggregated from product reviews (may be null when no reviews exist) */
    avgRating?: number | null;
    /** Aggregated from product reviews */
    reviewCount?: number;
    branding?: {
        primaryColor?: string;
        secondaryColor?: string;
        theme?: string;
        logo?: string;
    };
    settings?: {
        currency?: string;
        currencyPosition?: string;
        taxRate?: number;
        vat?: {
            type: 'flat' | 'percentage';
            value: number;
            enabled: boolean;
        };
        serviceCharge?: {
            type: 'flat' | 'percentage';
            value: number;
            enabled: boolean;
            applyTo: 'pos' | 'online' | 'both';
        };
    };
    isActive: boolean;
    isPublished?: boolean;
    layoutConfig?: unknown;
    contactInfo?: {
        email?: string;
        phone?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    };
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    contactEmail?: string;
    contactPhone?: string;
}
export interface StoreApiResponse {
    status: string;
    data: StoreResponse;
    maintenanceMode?: boolean;
    message?: string;
}
export declare const storeService: {
    /**
     * Get store by slug
     * Returns store data and maintenance mode status
     */
    getStoreBySlug(slug: string): Promise<{
        store: StoreResponse;
        maintenanceMode: boolean;
    }>;
    /**
     * Get store by domain
     * Returns store data and maintenance mode status
     */
    getStoreByDomain(domain: string): Promise<{
        store: StoreResponse;
        maintenanceMode: boolean;
    }>;
    /**
     * Get all published stores
     */
    getAllPublishedStores(): Promise<StoreResponse[]>;
};
//# sourceMappingURL=store.service.d.ts.map
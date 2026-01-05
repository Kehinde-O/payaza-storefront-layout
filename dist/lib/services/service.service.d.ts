export interface Service {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency?: string;
    pricingType?: 'fixed' | 'hourly';
    duration?: number;
    images?: Array<{
        url: string;
        isPrimary?: boolean;
    }> | string[];
    image?: string;
    categoryId?: string;
    category?: any;
    categoryName?: string;
    serviceType: 'appointment' | 'booking' | 'consultation' | 'treatment' | 'other';
    checkoutType?: 'online' | 'offline' | 'both';
    status?: 'active' | 'inactive' | 'draft';
    availability?: {
        days?: string[];
        startTime?: string;
        endTime?: string;
        timeSlots?: number[];
        day?: string;
        slots?: string[];
    };
    isActive: boolean;
    storeId: string;
    locationId?: string;
    location?: any;
    providerId?: string;
    provider?: any;
    merchantId?: string;
}
export declare const serviceService: {
    /**
     * Get services for a store
     */
    getServices(storeId: string, params?: {
        locationId?: string;
        serviceType?: string;
        categoryId?: string;
    }): Promise<Service[]>;
    /**
     * Get service by ID
     */
    getServiceById(id: string): Promise<Service>;
    /**
     * Get service by slug
     */
    getServiceBySlug(slug: string, storeId: string): Promise<Service>;
};
//# sourceMappingURL=service.service.d.ts.map
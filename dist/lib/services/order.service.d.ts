export interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus?: string;
    paymentMethod?: string;
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount?: number;
    currency?: string;
    carrier?: string;
    items: OrderItem[];
    shippingAddress: {
        firstName?: string;
        lastName?: string;
        address1?: string;
        address2?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        phone?: string;
        email?: string;
        street?: string;
        name?: string;
    };
    billingAddress?: {
        firstName?: string;
        lastName?: string;
        address1?: string;
        address2?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        phone?: string;
        street?: string;
    };
    orderType?: 'product' | 'service' | 'mixed';
    trackingNumber?: string;
    notes?: string;
    internalNotes?: Array<{
        note: string;
        createdAt: string;
        createdBy: string;
    }>;
    createdAt: string;
    updatedAt?: string;
}
export interface OrderItem {
    id: string;
    orderId: string;
    productId?: string;
    serviceId?: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    currency?: string;
    modifiers?: Record<string, any>;
    metadata?: Record<string, any>;
    product?: any;
    service?: any;
}
export interface TrackOrderResponse {
    orderNumber: string;
    trackingNumber?: string;
    status: string;
    paymentStatus?: string;
    subtotal?: number;
    tax?: number;
    shipping?: number;
    discount?: number;
    total: number;
    currency?: string;
    items: OrderItem[];
    shippingAddress: any;
    carrier?: string;
    createdAt: string;
    updatedAt?: string;
    timeline?: Array<{
        status: string;
        timestamp: string;
        message: string;
    }>;
}
export declare const orderService: {
    /**
     * Track order by order number and email, or by tracking number (guest access)
     */
    trackOrder(orderNumberOrTracking: string, email?: string): Promise<TrackOrderResponse>;
    /**
     * Get customer orders (requires authentication)
     */
    getOrders(): Promise<Order[]>;
    /**
     * Get order by ID (requires authentication)
     */
    getOrderById(id: string): Promise<Order>;
    /**
     * Get order timeline (requires authentication)
     */
    getOrderTimeline(orderId: string): Promise<any[]>;
};
//# sourceMappingURL=order.service.d.ts.map
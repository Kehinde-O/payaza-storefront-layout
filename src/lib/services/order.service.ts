import { api } from '../api';

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
    // App-backend structure
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
    // Admin-backend structure compatibility
    street?: string;
    name?: string;
  };
  billingAddress?: {
    // App-backend structure
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
    // Admin-backend structure compatibility
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

export const orderService = {
  /**
   * Track order by order number and email, or by tracking number (guest access)
   */
  async trackOrder(orderNumberOrTracking: string, email?: string): Promise<TrackOrderResponse> {
    const params: any = {};
    
    // If it looks like a tracking number (starts with TRK-), use tracking parameter
    if (orderNumberOrTracking.startsWith('TRK-')) {
      params.tracking = orderNumberOrTracking;
    } else {
      params.orderNumber = orderNumberOrTracking;
      if (email) {
        params.email = email;
      }
    }

    try {
      const response = await api.get<{ status: string; data: TrackOrderResponse; message?: string }>('/orders/track', {
        params,
      });
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to track order');
    } catch (error: any) {
      // Handle rate limit errors (429)
      if (error.response?.status === 429) {
        const apiError: any = new Error(error.response?.data?.message || 'Too many tracking requests. Please try again later.');
        apiError.status = 429;
        throw apiError;
      }
      // Handle status validation errors (403)
      if (error.response?.status === 403) {
        const apiError: any = new Error(error.response?.data?.message || 'Order tracking is only available for confirmed orders and above');
        apiError.status = 403;
        throw apiError;
      }
      // Handle not found errors (404)
      if (error.response?.status === 404) {
        const apiError: any = new Error(error.response?.data?.message || 'Order not found');
        apiError.status = 404;
        throw apiError;
      }
      // Re-throw with original message
      const apiError: any = new Error(error.response?.data?.message || error.message || 'Failed to track order');
      apiError.status = error.response?.status;
      throw apiError;
    }
  },

  /**
   * Get customer orders (requires authentication)
   */
  async getOrders(): Promise<Order[]> {
    const response = await api.get<{ status: string; data: Order[]; message?: string }>('/orders');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch orders');
  },

  /**
   * Get order by ID (requires authentication)
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<{ status: string; data: Order; message?: string }>(`/orders/${id}`);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch order');
  },

  /**
   * Get order timeline (requires authentication)
   */
  async getOrderTimeline(orderId: string): Promise<any[]> {
    const response = await api.get<{ status: string; data: any[]; message?: string }>(`/orders/${orderId}/timeline`);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch order timeline');
  },
};


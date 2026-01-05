import { api } from '../api';

export interface CheckoutItem {
  productId?: string;
  serviceId?: string;
  quantity: number;
  price: number;
  variationId?: string; // UUID of ProductVariation (preferred)
  variantId?: string; // Deprecated: kept for backward compatibility
  options?: {
    // Booking metadata for service items
    bookingDate?: string;
    startTime?: string;
    endTime?: string;
    customerNotes?: string;
  };
}

export interface CheckoutRequest {
  storeId: string;
  items: CheckoutItem[];
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  promoCode?: string;
  shippingMethod?: string;
  shippingCost?: number;
  customerId?: string; // Optional: for authenticated users, will be overridden by backend if user is authenticated
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber?: string;
  checkoutUrl?: string;
  transactionReference?: string;
  totalAmount?: number;
  currency?: string;
}

export const checkoutService = {
  /**
   * Process checkout
   */
  async processCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await api.post<{ status: string; data: CheckoutResponse; message?: string }>('/checkout/process', data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Checkout processing failed');
  },

  /**
   * Process payment
   */
  async processPayment(orderId: string, paymentMethod: string, transactionReference: string, amount: number): Promise<void> {
    const response = await api.post<{ status: string; message?: string }>('/checkout/payment', {
      orderId,
      paymentMethod,
      transactionReference,
      amount,
    });
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Payment processing failed');
    }
  },

  /**
   * Get checkout receipt
   */
  async getReceipt(orderId: string): Promise<{
    orderNumber: string;
    total: number;
    items: unknown[];
    paymentStatus: string;
    receiptUrl: string;
  }> {
    const response = await api.get<{ 
      status: string; 
      data: {
        orderNumber: string;
        total: number;
        items: unknown[];
        paymentStatus: string;
        receiptUrl: string;
      }; 
      message?: string 
    }>(`/checkout/receipt/${orderId}`);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch receipt');
  },
};


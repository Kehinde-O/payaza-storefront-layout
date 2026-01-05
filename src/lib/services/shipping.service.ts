import { api } from '../api';

export interface ShippingMethod {
  code: string;
  name: string;
  cost: number;
  estimatedDays: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  description?: string;
}

export interface ShippingCalculation {
  methods: ShippingMethod[];
  selectedMethod?: ShippingMethod;
  freeShippingEligible: boolean;
  freeShippingThreshold?: number;
}

export interface TaxCalculation {
  tax: number;
  taxRate: number;
  subtotal: number;
  total: number;
}

export const shippingService = {
  /**
   * Calculate shipping costs
   */
  async calculateShipping(data: {
    storeId: string;
    address: any;
    weight?: number;
    items?: any[];
    subtotal?: number;
    shippingMethod?: string;
    currency?: string;
  }): Promise<ShippingCalculation> {
    const response = await api.post<{ status: string; data: ShippingCalculation; message?: string }>('/shipping/calculate', data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to calculate shipping');
  },

  /**
   * Calculate tax
   */
  async calculateTax(data: { storeId: string; address: any; subtotal: number }): Promise<TaxCalculation> {
    const response = await api.post<{ status: string; data: TaxCalculation; message?: string }>('/tax/calculate', data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to calculate tax');
  },
};


import { api } from '../api';

export interface PromoValidation {
  valid: boolean;
  code: string;
  type: string;
  discountValue: number;
  discount: number;
  description?: string;
}

export interface Promo {
  id: string;
  code: string;
  type: string;
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  status: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export const promoService = {
  /**
   * Validate a promo code
   */
  async validatePromo(code: string, storeId: string, amount?: number): Promise<PromoValidation> {
    const response = await api.post<{ status: string; data: PromoValidation; message?: string }>('/promos/validate', {
      code,
      storeId,
      amount,
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Invalid promo code');
  },

  /**
   * Get active promo codes for a store
   */
  async getActivePromos(storeId: string): Promise<Promo[]> {
    const response = await api.get<{ status: string; data: Promo[]; message?: string }>('/promos', {
      params: { storeId },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch promos');
  },
};


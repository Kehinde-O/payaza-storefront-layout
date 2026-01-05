import { api } from '../api';

export interface FeeCalculationRequest {
  storeId: string;
  subtotal: number;
  currency: string;
  orderType?: 'product' | 'service' | 'mixed';
}

export interface FeeCalculationResponse {
  charges: Array<{
    label: string;
    type: string;
    amount: number;
    rate?: number;
    chargeId: string;
  }>;
  totalCharges: number;
}

export const feesService = {
  /**
   * Calculate fees for an order
   */
  async calculateFees(data: FeeCalculationRequest): Promise<FeeCalculationResponse> {
    const response = await api.post<{ status: string; data: FeeCalculationResponse; message?: string }>(
      '/fees/calculate',
      data
    );
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to calculate fees');
  },
};


import { api } from '../api';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency?: string;
  pricingType?: 'fixed' | 'hourly';
  duration?: number;
  images?: Array<{ url: string; isPrimary?: boolean }> | string[];
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

export const serviceService = {
  /**
   * Get services for a store
   */
  async getServices(storeId: string, params?: { locationId?: string; serviceType?: string; categoryId?: string }): Promise<Service[]> {
    const response = await api.get<{ status: string; data: Service[]; message?: string }>('/services', {
      params: { storeId, ...params },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch services');
  },

  /**
   * Get service by ID
   */
  async getServiceById(id: string): Promise<Service> {
    const response = await api.get<{ status: string; data: Service; message?: string }>(`/services/${id}`);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch service');
  },

  /**
   * Get service by slug
   */
  async getServiceBySlug(slug: string, storeId: string): Promise<Service> {
    const response = await api.get<{ status: string; data: Service; message?: string }>(`/services/slug/${slug}`, {
      params: { storeId },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch service');
  },
};


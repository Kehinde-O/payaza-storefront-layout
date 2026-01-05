import { api } from '../api';

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
    taxRate?: number; // Deprecated: use vat instead
    vat?: {
      type: 'flat' | 'percentage';
      value: number; // flat amount or percentage (0-100)
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
  layoutConfig?: unknown; // Layout configuration from StoreConfiguration
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

export const storeService = {
  /**
   * Get store by slug
   * Returns store data and maintenance mode status
   */
  async getStoreBySlug(slug: string): Promise<{ store: StoreResponse; maintenanceMode: boolean }> {
    const response = await api.get<StoreApiResponse>(`/stores/slug/${slug}`);
    if (response.data.status === 'success') {
      return {
        store: response.data.data,
        maintenanceMode: response.data.maintenanceMode || false,
      };
    }
    throw new Error(response.data.message || 'Failed to fetch store');
  },

  /**
   * Get store by domain
   * Returns store data and maintenance mode status
   */
  async getStoreByDomain(domain: string): Promise<{ store: StoreResponse; maintenanceMode: boolean }> {
    const response = await api.get<StoreApiResponse>(`/stores/domain/${domain}`);
    if (response.data.status === 'success') {
      return {
        store: response.data.data,
        maintenanceMode: response.data.maintenanceMode || false,
      };
    }
    throw new Error(response.data.message || 'Failed to fetch store');
  },

  /**
   * Get all published stores
   */
  async getAllPublishedStores(): Promise<StoreResponse[]> {
    const response = await api.get<{ status: string; data: StoreResponse[]; message?: string }>('/stores');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch stores');
  },
};


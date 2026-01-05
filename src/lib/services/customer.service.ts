import { api } from '../api';

export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  address?: any;
  createdAt?: string | Date;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  label?: string;
}

export const customerService = {
  /**
   * Get customer profile (requires authentication)
   */
  async getProfile(): Promise<CustomerProfile> {
    const response = await api.get<{ status: string; data: CustomerProfile; message?: string }>('/customers/profile');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch profile');
  },

  /**
   * Update customer profile (requires authentication)
   * Note: For file uploads, use FormData directly in the component
   */
  async updateProfile(data: Partial<CustomerProfile> | FormData): Promise<CustomerProfile> {
    // The API interceptor will handle FormData Content-Type automatically
    const response = await api.put<{ status: string; data: CustomerProfile; message?: string }>(
      '/customers/profile',
      data
    );
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update profile');
  },

  /**
   * Get customer addresses (requires authentication)
   */
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<{ status: string; data: Address[]; message?: string }>('/customers/addresses');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch addresses');
  },

  /**
   * Add address (requires authentication)
   */
  async addAddress(data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    const response = await api.post<{ status: string; data: Address; message?: string }>('/customers/addresses', data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to add address');
  },

  /**
   * Update address (requires authentication)
   */
  async updateAddress(id: string, data: Partial<Address>): Promise<Address> {
    const response = await api.put<{ status: string; data: Address; message?: string }>(`/customers/addresses/${id}`, data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update address');
  },

  /**
   * Delete address (requires authentication)
   */
  async deleteAddress(id: string): Promise<void> {
    const response = await api.delete<{ status: string; message?: string }>(`/customers/addresses/${id}`);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to delete address');
    }
  },
};


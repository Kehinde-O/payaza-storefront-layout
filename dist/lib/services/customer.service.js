import { api } from '../api';
export const customerService = {
    /**
     * Get customer profile (requires authentication)
     */
    async getProfile() {
        const response = await api.get('/customers/profile');
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch profile');
    },
    /**
     * Update customer profile (requires authentication)
     * Note: For file uploads, use FormData directly in the component
     */
    async updateProfile(data) {
        // The API interceptor will handle FormData Content-Type automatically
        const response = await api.put('/customers/profile', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update profile');
    },
    /**
     * Get customer addresses (requires authentication)
     */
    async getAddresses() {
        const response = await api.get('/customers/addresses');
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch addresses');
    },
    /**
     * Add address (requires authentication)
     */
    async addAddress(data) {
        const response = await api.post('/customers/addresses', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to add address');
    },
    /**
     * Update address (requires authentication)
     */
    async updateAddress(id, data) {
        const response = await api.put(`/customers/addresses/${id}`, data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update address');
    },
    /**
     * Delete address (requires authentication)
     */
    async deleteAddress(id) {
        const response = await api.delete(`/customers/addresses/${id}`);
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to delete address');
        }
    },
};

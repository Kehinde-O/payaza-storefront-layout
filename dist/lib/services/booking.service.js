import { api } from '../api';
export const bookingService = {
    /**
     * Create a booking (guest or authenticated)
     */
    async createBooking(data) {
        const response = await api.post('/bookings', data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create booking');
    },
    /**
     * Get customer bookings (requires authentication)
     */
    async getBookings() {
        const response = await api.get('/bookings');
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch bookings');
    },
    /**
     * Get booking by ID (requires authentication)
     */
    async getBookingById(id) {
        const response = await api.get(`/bookings/${id}`);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch booking');
    },
    /**
     * Update booking (requires authentication)
     */
    async updateBooking(id, data) {
        const response = await api.put(`/bookings/${id}`, data);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update booking');
    },
    /**
     * Cancel booking (requires authentication)
     */
    async cancelBooking(id) {
        const response = await api.delete(`/bookings/${id}`);
        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to cancel booking');
        }
    },
};

import { api } from '../api';

export interface Booking {
  id: string;
  serviceId: string;
  storeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  customerInfo?: any;
  customerNotes?: string;
}

export interface CreateBookingDto {
  serviceId: string;
  storeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  price: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  customerNotes?: string;
  customerId?: string; // Optional: for authenticated users, will be overridden by backend if user is authenticated
}

export const bookingService = {
  /**
   * Create a booking (guest or authenticated)
   */
  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const response = await api.post<{ status: string; data: Booking; message?: string }>('/bookings', data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create booking');
  },

  /**
   * Get customer bookings (requires authentication)
   */
  async getBookings(): Promise<Booking[]> {
    const response = await api.get<{ status: string; data: Booking[]; message?: string }>('/bookings');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch bookings');
  },

  /**
   * Get booking by ID (requires authentication)
   */
  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<{ status: string; data: Booking; message?: string }>(`/bookings/${id}`);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch booking');
  },

  /**
   * Update booking (requires authentication)
   */
  async updateBooking(id: string, data: { notes?: string; customerNotes?: string }): Promise<Booking> {
    const response = await api.put<{ status: string; data: Booking; message?: string }>(`/bookings/${id}`, data);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update booking');
  },

  /**
   * Cancel booking (requires authentication)
   */
  async cancelBooking(id: string): Promise<void> {
    const response = await api.delete<{ status: string; message?: string }>(`/bookings/${id}`);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to cancel booking');
    }
  },
};


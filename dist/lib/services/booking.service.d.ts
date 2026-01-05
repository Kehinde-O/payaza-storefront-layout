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
    customerId?: string;
}
export declare const bookingService: {
    /**
     * Create a booking (guest or authenticated)
     */
    createBooking(data: CreateBookingDto): Promise<Booking>;
    /**
     * Get customer bookings (requires authentication)
     */
    getBookings(): Promise<Booking[]>;
    /**
     * Get booking by ID (requires authentication)
     */
    getBookingById(id: string): Promise<Booking>;
    /**
     * Update booking (requires authentication)
     */
    updateBooking(id: string, data: {
        notes?: string;
        customerNotes?: string;
    }): Promise<Booking>;
    /**
     * Cancel booking (requires authentication)
     */
    cancelBooking(id: string): Promise<void>;
};
//# sourceMappingURL=booking.service.d.ts.map
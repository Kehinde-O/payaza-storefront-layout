import { api } from '../api';
export const orderService = {
    /**
     * Track order by order number and email, or by tracking number (guest access)
     */
    async trackOrder(orderNumberOrTracking, email) {
        const params = {};
        // If it looks like a tracking number (starts with TRK-), use tracking parameter
        if (orderNumberOrTracking.startsWith('TRK-')) {
            params.tracking = orderNumberOrTracking;
        }
        else {
            params.orderNumber = orderNumberOrTracking;
            if (email) {
                params.email = email;
            }
        }
        try {
            const response = await api.get('/orders/track', {
                params,
            });
            if (response.data.status === 'success') {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to track order');
        }
        catch (error) {
            // Handle rate limit errors (429)
            if (error.response?.status === 429) {
                const apiError = new Error(error.response?.data?.message || 'Too many tracking requests. Please try again later.');
                apiError.status = 429;
                throw apiError;
            }
            // Handle status validation errors (403)
            if (error.response?.status === 403) {
                const apiError = new Error(error.response?.data?.message || 'Order tracking is only available for confirmed orders and above');
                apiError.status = 403;
                throw apiError;
            }
            // Handle not found errors (404)
            if (error.response?.status === 404) {
                const apiError = new Error(error.response?.data?.message || 'Order not found');
                apiError.status = 404;
                throw apiError;
            }
            // Re-throw with original message
            const apiError = new Error(error.response?.data?.message || error.message || 'Failed to track order');
            apiError.status = error.response?.status;
            throw apiError;
        }
    },
    /**
     * Get customer orders (requires authentication)
     */
    async getOrders() {
        const response = await api.get('/orders');
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch orders');
    },
    /**
     * Get order by ID (requires authentication)
     */
    async getOrderById(id) {
        const response = await api.get(`/orders/${id}`);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch order');
    },
    /**
     * Get order timeline (requires authentication)
     */
    async getOrderTimeline(orderId) {
        const response = await api.get(`/orders/${orderId}/timeline`);
        if (response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch order timeline');
    },
};

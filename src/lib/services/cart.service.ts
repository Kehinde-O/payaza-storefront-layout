import { api } from '../api';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
  product?: any;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
}

export const cartService = {
  /**
   * Get cart (requires session ID header for guests or auth token)
   */
  async getCart(): Promise<Cart> {
    const response = await api.get<{ status: string; data: Cart; message?: string }>('/cart');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch cart');
  },

  /**
   * Add item to cart
   */
  async addItem(productId: string, quantity: number, options?: Record<string, any>): Promise<CartItem> {
    const response = await api.post<{ status: string; data: CartItem; message?: string }>('/cart/items', {
      productId,
      quantity,
      options,
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to add item to cart');
  },

  /**
   * Update cart item quantity
   */
  async updateItem(itemId: string, quantity: number): Promise<CartItem> {
    const response = await api.put<{ status: string; data: CartItem; message?: string }>(`/cart/items/${itemId}`, { quantity });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update cart item');
  },

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<void> {
    const response = await api.delete<{ status: string; message?: string }>(`/cart/items/${itemId}`);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to remove item from cart');
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const response = await api.delete<{ status: string; message?: string }>('/cart');
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to clear cart');
    }
  },
};


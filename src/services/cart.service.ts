import { apiClient } from './api';
import { Cart, AddToCartInput, UpdateCartItemInput, SyncCartInput, ApiResponse } from '@formerbench/shared';

export const cartService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    return apiClient.get('/cart');
  },

  async addToCart(data: AddToCartInput): Promise<ApiResponse<Cart>> {
    return apiClient.post('/cart/items', data);
  },

  async updateCartItem(itemId: string, data: UpdateCartItemInput): Promise<ApiResponse<Cart>> {
    return apiClient.put(`/cart/items/${itemId}`, data);
  },

  async removeCartItem(itemId: string): Promise<ApiResponse<Cart>> {
    return apiClient.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<ApiResponse<Cart>> {
    return apiClient.delete('/cart');
  },

  async syncCart(data: SyncCartInput): Promise<ApiResponse<Cart>> {
    return apiClient.post('/cart/sync', data);
  },
};

import { apiClient } from './api';
import {
  Order,
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderStatus,
  ApiResponse,
} from '@formerbench/shared';

export const orderService = {
  async createOrder(data: CreateOrderInput): Promise<ApiResponse<Order>> {
    return apiClient.post('/orders', data);
  },

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get('/orders/my-orders');
  },

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get(`/orders/${id}`);
  },

  async getAllOrders(params?: { page?: number; limit?: number; status?: OrderStatus }): Promise<ApiResponse<{ orders: Order[]; total: number; totalPages: number }>> {
    return apiClient.get('/orders', { params });
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput): Promise<ApiResponse<Order>> {
    return apiClient.put(`/orders/${id}/status`, data);
  },
};

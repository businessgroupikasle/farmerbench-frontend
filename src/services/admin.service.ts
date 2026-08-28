import { apiClient } from './api';
import { DashboardStats, Product, ApiResponse } from '@formerbench/shared';

export const adminService = {
  async getDashboardAnalytics(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get('/admin/analytics');
  },

  async updateInventoryStock(productId: string, stock: number): Promise<ApiResponse<Product>> {
    return apiClient.patch(`/admin/inventory/${productId}`, { stock });
  },
};

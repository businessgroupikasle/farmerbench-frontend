import { apiClient } from './api';
import { DashboardStats, Product, ApiResponse, CustomerQueryInput } from '@formerbench/shared';

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  crops: string;
  status: 'Verified' | 'Pending' | 'Active';
  avatarUrl?: string;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  registeredAt: string;
  ordersCount: number;
  reviewsCount: number;
}

export interface CustomersResponseData {
  customers: CustomerRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminService = {
  async getDashboardAnalytics(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get('/admin/analytics');
  },

  async updateInventoryStock(productId: string, stock: number): Promise<ApiResponse<Product>> {
    return apiClient.patch(`/admin/inventory/${productId}`, { stock });
  },

  async getCustomers(params?: CustomerQueryInput): Promise<ApiResponse<CustomersResponseData>> {
    return apiClient.get('/admin/customers', { params });
  },

  async createCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    crops?: string;
    status?: string;
  }): Promise<ApiResponse<CustomerRecord>> {
    return apiClient.post('/admin/customers', data);
  },

  async updateCustomer(
    id: string,
    data: {
      name?: string;
      phone?: string;
      location?: string;
      crops?: string;
      status?: string;
    }
  ): Promise<ApiResponse<CustomerRecord>> {
    return apiClient.patch(`/admin/customers/${id}`, data);
  },
};


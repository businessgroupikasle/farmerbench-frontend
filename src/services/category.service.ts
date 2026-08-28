import { apiClient } from './api';
import { Category, CreateCategoryInput, UpdateCategoryInput, ApiResponse } from '@formerbench/shared';

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get('/categories');
  },

  async getCategory(slugOrId: string): Promise<ApiResponse<Category>> {
    return apiClient.get(`/categories/${slugOrId}`);
  },

  async createCategory(data: CreateCategoryInput): Promise<ApiResponse<Category>> {
    return apiClient.post('/categories', data);
  },

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<ApiResponse<Category>> {
    return apiClient.put(`/categories/${id}`, data);
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/categories/${id}`);
  },
};

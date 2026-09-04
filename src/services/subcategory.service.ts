import { ApiResponse, CreateSubcategoryInput, Subcategory, UpdateSubcategoryInput } from '@formerbench/shared';
import { apiClient } from './api';

export const subcategoryService = {
  getSubcategories(categoryId?: string): Promise<ApiResponse<Subcategory[]>> {
    return apiClient.get('/subcategories', { params: { categoryId } });
  },
  getSubcategory(slugOrId: string): Promise<ApiResponse<Subcategory>> {
    return apiClient.get(`/subcategories/${slugOrId}`);
  },
  createSubcategory(data: CreateSubcategoryInput): Promise<ApiResponse<Subcategory>> {
    return apiClient.post('/subcategories', data);
  },
  updateSubcategory(id: string, data: UpdateSubcategoryInput): Promise<ApiResponse<Subcategory>> {
    return apiClient.put(`/subcategories/${id}`, data);
  },
  deleteSubcategory(id: string): Promise<ApiResponse<Subcategory>> {
    return apiClient.delete(`/subcategories/${id}`);
  },
};

import { ApiResponse, CreateHeroBannerInput, HeroBanner, HeroPage, UpdateHeroBannerInput } from '@formerbench/shared';
import { apiClient } from './api';

export const heroBannerService = {
  list(page: HeroPage): Promise<ApiResponse<HeroBanner[]>> { return apiClient.get('/hero-banners', { params: { page } }); },
  listAdmin(page?: HeroPage): Promise<ApiResponse<HeroBanner[]>> { return apiClient.get('/hero-banners/admin', { params: { page } }); },
  create(data: CreateHeroBannerInput): Promise<ApiResponse<HeroBanner>> { return apiClient.post('/hero-banners', data); },
  update(id: string, data: UpdateHeroBannerInput): Promise<ApiResponse<HeroBanner>> { return apiClient.put(`/hero-banners/${id}`, data); },
  remove(id: string): Promise<ApiResponse<HeroBanner>> { return apiClient.delete(`/hero-banners/${id}`); },
  reorder(ids: string[]): Promise<ApiResponse<HeroBanner[]>> { return apiClient.put('/hero-banners/reorder', { ids }); },
};

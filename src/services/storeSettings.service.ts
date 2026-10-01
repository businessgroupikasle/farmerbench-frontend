import { ApiResponse } from '@formerbench/shared';
import { apiClient } from './api';

export interface StoreShippingSettings {
  standardShippingFee: number;
  freeShippingThreshold: number;
}

export const storeSettingsService = {
  get(): Promise<ApiResponse<StoreShippingSettings>> {
    return apiClient.get('/store-settings');
  },

  update(settings: StoreShippingSettings): Promise<ApiResponse<StoreShippingSettings>> {
    return apiClient.put('/admin/store-settings', settings);
  },
};
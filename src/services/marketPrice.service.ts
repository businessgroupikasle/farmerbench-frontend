import { apiClient } from './api';

export interface MarketPrice {
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  arrivalDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  change: number | null;
  unit: 'quintal';
}

export const marketPriceService = {
  getLatest(limit = 6) {
    return apiClient.get('/market-prices', {
      params: { limit },
    }) as unknown as Promise<{ success: boolean; data: MarketPrice[] }>;
  },
};

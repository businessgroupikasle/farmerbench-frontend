import { apiClient } from './api';

export interface PostalLocation {
  postalCode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  postOffice: string;
  postOffices: string[];
}

export const postalCodeService = {
  async lookup(postalCode: string): Promise<PostalLocation> {
    const response = await apiClient.get(`/postal-codes/${postalCode}`) as unknown as { data: PostalLocation };
    return response.data;
  },
};

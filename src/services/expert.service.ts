import { ApiResponse } from '@formerbench/shared';
import { apiClient } from './api';
export interface AgronomyExpert { id:string; name:string; specialization:string; territory:string; avatar?:string|null; phone?:string|null; rating:number; consultations:number; status:string; isActive:boolean; createdAt:string; updatedAt:string; }
export interface CreateExpertPayload { name:string; specialization:string; territory:string; avatar?:string; phone?:string; }
export const expertService = {
  list(): Promise<ApiResponse<AgronomyExpert[]>> { return apiClient.get('/experts'); },
  create(payload: CreateExpertPayload): Promise<ApiResponse<AgronomyExpert>> { return apiClient.post('/experts', payload); },
};
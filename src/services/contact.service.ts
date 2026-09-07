import { ApiResponse } from '@formerbench/shared';
type ContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
interface ContactInquiry { id: string; name: string; email: string; phone: string; subject: string; message: string; status: ContactStatus; adminNotes?: string | null; repliedAt?: string | Date | null; createdAt: string | Date; updatedAt: string | Date; }
interface CreateContactInput { name: string; email: string; phone: string; subject: string; message: string; }
interface UpdateContactInput { status?: ContactStatus; adminNotes?: string | null; }
interface ContactQueryParams { page?: number; limit?: number; status?: ContactStatus | 'ALL'; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; }
import { apiClient } from './api';

export const contactService = {
  submitContact: (data: CreateContactInput): Promise<ApiResponse<ContactInquiry>> => apiClient.post('/contacts', data),
  getInquiries: (params?: ContactQueryParams): Promise<ApiResponse<any>> => apiClient.get('/contacts', { params }),
  getInquiryById: (id: string): Promise<ApiResponse<ContactInquiry>> => apiClient.get(`/contacts/${id}`),
  updateInquiry: (id: string, data: UpdateContactInput): Promise<ApiResponse<ContactInquiry>> => apiClient.patch(`/contacts/${id}`, data),
  deleteInquiry: (id: string): Promise<ApiResponse<null>> => apiClient.delete(`/contacts/${id}`),
};



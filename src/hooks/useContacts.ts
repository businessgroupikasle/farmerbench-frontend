import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useContacts = (page = 1, limit = 20) => useQuery({
  queryKey: ['contacts', page, limit],
  queryFn: async () => { const response: any = await apiClient.get('/contacts', { params: { page, limit } }); return response; },
  staleTime: 30000,
});

export const useContactStats = () => useQuery({
  queryKey: ['contactStats'],
  queryFn: async () => { const response: any = await apiClient.get('/contacts/dashboard/stats'); return response; },
  staleTime: 15000,
});

export const useContactMutations = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
    queryClient.invalidateQueries({ queryKey: ['contactStats'] });
  };
  const markAsRead = useMutation({ mutationFn: (id: string) => apiClient.put(`/contacts/${id}/mark-read`), onSuccess: refresh });
  const deleteContact = useMutation({ mutationFn: (id: string) => apiClient.delete(`/contacts/${id}`), onSuccess: refresh });
  return { markAsRead, deleteContact };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { CustomerQueryInput } from '@formerbench/shared';

export const useCustomers = (params?: CustomerQueryInput) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const response = await adminService.getCustomers(params);
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCustomerMutations = () => {
  const queryClient = useQueryClient();

  const createCustomerMutation = useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone?: string;
      location?: string;
      crops?: string;
      status?: string;
    }) => adminService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        phone?: string;
        location?: string;
        crops?: string;
        status?: string;
      };
    }) => adminService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    createCustomer: createCustomerMutation.mutateAsync,
    isCreating: createCustomerMutation.isPending,
    updateCustomer: updateCustomerMutation.mutateAsync,
    isUpdating: updateCustomerMutation.isPending,
  };
};

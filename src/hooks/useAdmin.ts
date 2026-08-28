import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { useUIStore } from '../store/uiStore';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await adminService.getDashboardAnalytics();
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminMutations = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  const updateInventoryStock = useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      adminService.updateInventoryStock(productId, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ type: 'success', message: 'Inventory updated successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  return {
    updateInventoryStock: updateInventoryStock.mutateAsync,
    isUpdatingStock: updateInventoryStock.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { useUIStore } from '../store/uiStore';
import { CreateOrderInput, UpdateOrderStatusInput, OrderStatus } from '@formerbench/shared';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders', 'my-orders'],
    queryFn: async () => {
      const res = await orderService.getMyOrders();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await orderService.getOrder(id);
      return res.data || null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminOrders = (params?: { page?: number; limit?: number; status?: OrderStatus }) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const res = await orderService.getAllOrders(params);
      return res.data;
    },
    staleTime: 1000 * 60,
  });
};

export const useOrderMutations = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  const createOrder = useMutation({
    mutationFn: (data: CreateOrderInput) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusInput }) =>
      orderService.updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      addToast({ type: 'success', message: 'Order status updated successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  return {
    createOrder: createOrder.mutateAsync,
    isCreatingOrder: createOrder.isPending,
    updateOrderStatus: updateOrderStatus.mutateAsync,
    isUpdatingStatus: updateOrderStatus.isPending,
  };
};

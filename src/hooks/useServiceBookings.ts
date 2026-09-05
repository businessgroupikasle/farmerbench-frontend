import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  serviceBookingService,
  ServiceBookingQueryParams,
  ServiceBookingStatus,
} from '../services/serviceBooking.service';
import { useUIStore } from '../store/uiStore';

export const useServiceBookings = (params?: ServiceBookingQueryParams) => {
  return useQuery({
    queryKey: ['service-bookings', params],
    queryFn: async () => {
      const res: any = await serviceBookingService.getAllBookings(params);
      return res.data || res;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useServiceBookingStats = () => {
  return useQuery({
    queryKey: ['service-booking-stats'],
    queryFn: async () => {
      const res: any = await serviceBookingService.getBookingStats();
      return res.data || res;
    },
    staleTime: 1000 * 30,
  });
};

export const useServiceBookingMutations = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: ServiceBookingStatus;
      adminNotes?: string | null;
    }) => serviceBookingService.updateBookingStatus(id, { status, adminNotes }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['service-booking-stats'] });
      addToast({
        type: 'success',
        message: `Booking status updated to ${variables.status}`,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: error.message || 'Failed to update booking status',
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (id: string) => serviceBookingService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['service-booking-stats'] });
      addToast({
        type: 'info',
        message: 'Service booking removed successfully',
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: error.message || 'Failed to delete service booking',
      });
    },
  });

  return {
    updateBookingStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteBooking: deleteBookingMutation.mutateAsync,
    isDeleting: deleteBookingMutation.isPending,
  };
};

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '../store/uiStore';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const rawUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const SOCKET_URL = rawUrl.replace(/\/api\/?$/, '') || 'http://localhost:5000';
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }
  return socket;
};

export const useSocketSync = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  useEffect(() => {
    const s = getSocket();

    const handleProductCreated = (product: any) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (product?.title) {
        addToast({ type: 'info', message: `⚡ Real-Time Sync: New product "${product.title}" added!` });
      }
    };

    const handleProductUpdated = (product: any) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (product?.id) queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      if (product?.slug) queryClient.invalidateQueries({ queryKey: ['product', product.slug] });
    };

    const handleProductDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    };

    const handleCategoryCreated = (category: any) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (category?.name) {
        addToast({ type: 'info', message: `⚡ Real-Time Sync: New Category "${category.name}" added!` });
      }
    };

    const handleCategoryUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    const handleCategoryDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    const handleBookingCreated = (booking: any) => {
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['service-booking-stats'] });
      if (booking?.name) {
        addToast({
          type: 'info',
          message: `⚡ Real-Time Alert: New Service Request — ${booking.name} (${booking.serviceName || 'Service'})`,
        });
      }
      window.dispatchEvent(new CustomEvent('booking:created', { detail: booking }));
    };

    const handleBookingUpdated = (booking: any) => {
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['service-booking-stats'] });
      if (booking?.id) {
        queryClient.invalidateQueries({ queryKey: ['service-booking', booking.id] });
      }
      window.dispatchEvent(new CustomEvent('booking:updated', { detail: booking }));
    };

    s.on('product:created', handleProductCreated);
    s.on('product:updated', handleProductUpdated);
    s.on('product:deleted', handleProductDeleted);
    s.on('category:created', handleCategoryCreated);
    s.on('category:updated', handleCategoryUpdated);
    s.on('category:deleted', handleCategoryDeleted);
    s.on('booking:created', handleBookingCreated);
    s.on('booking:updated', handleBookingUpdated);

    return () => {
      s.off('product:created', handleProductCreated);
      s.off('product:updated', handleProductUpdated);
      s.off('product:deleted', handleProductDeleted);
      s.off('category:created', handleCategoryCreated);
      s.off('category:updated', handleCategoryUpdated);
      s.off('category:deleted', handleCategoryDeleted);
      s.off('booking:created', handleBookingCreated);
      s.off('booking:updated', handleBookingUpdated);
    };
  }, [queryClient, addToast]);
};

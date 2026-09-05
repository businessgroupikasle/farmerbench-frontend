import { apiClient } from './api';
import { ApiResponse } from '@formerbench/shared';

export interface CreateServiceBookingPayload {
  serviceSlug: string;
  serviceName: string;
  name: string;
  phone: string;
  email?: string | null;
  location: string;
  farmSize?: string | null;
  cropType?: string | null;
  preferredDate?: string | null;
  message?: string | null;
}

export type ServiceBookingStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceBookingRecord {
  id: string;
  bookingReference: string;
  serviceSlug: string;
  serviceName: string;
  name: string;
  phone: string;
  email?: string | null;
  location: string;
  farmSize?: string | null;
  cropType?: string | null;
  preferredDate?: string | null;
  message?: string | null;
  adminNotes?: string | null;
  status: ServiceBookingStatus;
  userId?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceBookingsPaginatedData {
  bookings: ServiceBookingRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ServiceBookingStatsData {
  totalBookings: number;
  newBookings: number;
  contactedBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  recentBookings: ServiceBookingRecord[];
  serviceBreakdown: Array<{ serviceSlug: string; serviceName: string; count: number }>;
}

export interface ServiceBookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  serviceSlug?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest';
}

export const serviceBookingService = {
  /**
   * Public or authenticated booking creation
   */
  async createBooking(
    payload: CreateServiceBookingPayload
  ): Promise<ApiResponse<ServiceBookingRecord>> {
    return apiClient.post('/service-bookings', payload);
  },

  /**
   * Admin: List all bookings with search, status filtering, and pagination
   */
  async getAllBookings(
    params?: ServiceBookingQueryParams
  ): Promise<ApiResponse<ServiceBookingsPaginatedData>> {
    return apiClient.get('/service-bookings', { params });
  },

  /**
   * Admin: Summary metrics for dashboard KPI cards
   */
  async getBookingStats(): Promise<ApiResponse<ServiceBookingStatsData>> {
    return apiClient.get('/service-bookings/stats');
  },

  /**
   * Admin / Owner: Get single booking by ID
   */
  async getBookingById(id: string): Promise<ApiResponse<ServiceBookingRecord>> {
    return apiClient.get(`/service-bookings/${id}`);
  },

  /**
   * Admin: Update booking status and admin assignment notes
   */
  async updateBookingStatus(
    id: string,
    data: { status: ServiceBookingStatus; adminNotes?: string | null }
  ): Promise<ApiResponse<ServiceBookingRecord>> {
    return apiClient.patch(`/service-bookings/${id}/status`, data);
  },

  /**
   * Admin: Delete booking record
   */
  async deleteBooking(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/service-bookings/${id}`);
  },
};

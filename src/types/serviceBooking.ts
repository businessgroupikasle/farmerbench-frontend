export type ServiceBookingStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceBooking {
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

export type ServiceBookingRecord = ServiceBooking;

export interface ServiceBookingFilters {
  page?: number;
  limit?: number;
  status?: string;
  serviceSlug?: string;
  search?: string;
}

export interface ServiceBookingStats {
  total?: number;
  totalBookings?: number;
  newBookings?: number;
  contactedBookings?: number;
  inProgressBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  byStatus?: Record<ServiceBookingStatus, number>;
  serviceBreakdown?: Array<{ serviceSlug: string; serviceName: string; count: number }>;
}

export interface CreateServiceBookingInput {
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

export interface UpdateServiceBookingInput {
  status?: ServiceBookingStatus;
  adminNotes?: string | null;
}

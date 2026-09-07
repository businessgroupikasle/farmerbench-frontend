import { apiClient } from './api';
import { ApiResponse } from '@formerbench/shared';

export interface AppliedCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
}

export interface HomepageCouponOffer {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumSpend: number;
  validUntil?: string | null;
}

export const couponService = {
  getHomepageOffer(): Promise<ApiResponse<HomepageCouponOffer | null>> {
    return apiClient.get('/coupons/homepage-offer');
  },

  validate(code: string, subtotal: number): Promise<ApiResponse<AppliedCoupon>> {
    return apiClient.post('/coupons/validate', { code, subtotal });
  },
};

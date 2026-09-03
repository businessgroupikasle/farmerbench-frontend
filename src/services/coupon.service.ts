import { apiClient } from './api';
import { ApiResponse } from '@formerbench/shared';

export interface AppliedCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
}

export const couponService = {
  validate(code: string, subtotal: number): Promise<ApiResponse<AppliedCoupon>> {
    return apiClient.post('/coupons/validate', { code, subtotal });
  },
};

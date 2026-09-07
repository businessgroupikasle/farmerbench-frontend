import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BadgePercent, Copy, Leaf } from 'lucide-react';
import { couponService } from '../../services/coupon.service';

export const HomeCouponOffer: React.FC = () => {
  const { data: response } = useQuery({
    queryKey: ['coupons', 'homepage-offer'],
    queryFn: () => couponService.getHomepageOffer(),
    staleTime: 60_000,
  });
  const offer = response?.data;

  if (!offer) return null;

  const discount = offer.discountType === 'PERCENTAGE'
    ? `${offer.discountValue}% OFF`
    : `₹${offer.discountValue} OFF`;

  const copyCode = () => {
    void navigator.clipboard?.writeText(offer.code);
  };

  return (
    <section className="home-coupon-offer" aria-label="Special coupon offer">
      <div className="home-coupon-decoration home-coupon-decoration--left">
        <Leaf size={34} />
        <Leaf size={24} />
      </div>

      <div className="home-coupon-icon" aria-hidden="true">
        <BadgePercent size={34} />
      </div>

      <div className="home-coupon-copy">
        <span className="home-coupon-eyebrow">Special Offer</span>
        <h2>Get {discount} on Your Order!</h2>
        <div className="home-coupon-code-row">
          <span>Use code:</span>
          <button type="button" onClick={copyCode} title="Copy coupon code">
            {offer.code} <Copy size={13} />
          </button>
          {offer.minimumSpend > 0 && <small>Min. order ₹{offer.minimumSpend.toLocaleString('en-IN')}</small>}
        </div>
      </div>

      <Link to="/products" className="home-coupon-shop-btn">Shop Now</Link>

      <div className="home-coupon-decoration home-coupon-decoration--right" aria-hidden="true">
        <Leaf size={30} />
        <Leaf size={20} />
      </div>
    </section>
  );
};

export default HomeCouponOffer;

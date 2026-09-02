import React from 'react';
import { Lock, ShieldCheck, Headset, RotateCcw } from 'lucide-react';

export const TrustBadgesFooter: React.FC = () => {
  return (
    <div className="fb-trust-footer">
      <div className="fb-trust-item">
        <Lock size={20} color="#0F4726" />
        <span>Secure Payments</span>
      </div>

      <div className="fb-trust-item">
        <ShieldCheck size={20} color="#0F4726" />
        <span>Genuine Products</span>
      </div>

      <div className="fb-trust-item">
        <Headset size={20} color="#0F4726" />
        <span>Expert Support</span>
      </div>

      <div className="fb-trust-item">
        <RotateCcw size={20} color="#0F4726" />
        <span>Easy Returns</span>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, UserCheck, Truck, Lock } from 'lucide-react';
import './HomeTrustBadges.css';

export const HomeTrustBadges: React.FC = () => {
  return (
    <div className="trust-badges-wrapper">
      <div className="trust-badge">
        <div className="badge-icon badge-icon-yellow">
          <ShieldCheck size={24} />
        </div>
        <div className="badge-content">
          <div className="badge-title">100% Genuine</div>
          <div className="badge-desc">Quality Assured</div>
        </div>
      </div>
      
      <div className="badge-divider"></div>
      
      <div className="trust-badge">
        <div className="badge-icon badge-icon-green">
          <UserCheck size={24} />
        </div>
        <div className="badge-content">
          <div className="badge-title">Expert Support</div>
          <div className="badge-desc">24/7 Assistance</div>
        </div>
      </div>
      
      <div className="badge-divider"></div>
      
      <div className="trust-badge">
        <div className="badge-icon badge-icon-light">
          <Truck size={24} />
        </div>
        <div className="badge-content">
          <div className="badge-title">Free Delivery</div>
          <div className="badge-desc">Across India</div>
        </div>
      </div>
      
      <div className="badge-divider"></div>
      
      <div className="trust-badge">
        <div className="badge-icon badge-icon-gold">
          <Lock size={24} />
        </div>
        <div className="badge-content">
          <div className="badge-title">Secure Payment</div>
          <div className="badge-desc">100% Safe</div>
        </div>
      </div>
    </div>
  );
};

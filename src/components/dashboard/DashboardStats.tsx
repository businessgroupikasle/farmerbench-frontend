import React from 'react';
import { Truck, Heart, CalendarCheck, Sprout, ArrowRight } from 'lucide-react';

interface DashboardStatsProps {
  activeOrdersCount: number;
  wishlistCount: number;
  bookingsCount: number;
  rewardPoints?: number;
  onNavigateTab: (tab: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  activeOrdersCount,
  wishlistCount,
  bookingsCount,
  rewardPoints = 1240,
  onNavigateTab,
}) => {
  const rupeeValue = Math.round(rewardPoints / 10);

  return (
    <div className="fb-metrics-grid">
      {/* 1. Active Orders */}
      <div className="fb-metric-card">
        <div className="fb-metric-icon-box">
          <Truck size={24} />
        </div>
        <div className="fb-metric-info">
          <span className="fb-metric-title">Active Orders</span>
          <span className="fb-metric-value">{activeOrdersCount}</span>
          <a
            className="fb-metric-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab('orders');
            }}
          >
            Track Orders <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* 2. Wishlist Items */}
      <div className="fb-metric-card">
        <div className="fb-metric-icon-box">
          <Heart size={24} />
        </div>
        <div className="fb-metric-info">
          <span className="fb-metric-title">Wishlist Items</span>
          <span className="fb-metric-value">{wishlistCount}</span>
          <a
            className="fb-metric-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab('wishlist');
            }}
          >
            View Wishlist <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* 3. Service Bookings */}
      <div className="fb-metric-card">
        <div className="fb-metric-icon-box">
          <CalendarCheck size={24} />
        </div>
        <div className="fb-metric-info">
          <span className="fb-metric-title">Service Bookings</span>
          <span className="fb-metric-value">{bookingsCount}</span>
          <a
            className="fb-metric-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab('bookings');
            }}
          >
            View Bookings <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* 4. Reward Points */}
      <div className="fb-metric-card">
        <div className="fb-metric-icon-box">
          <Sprout size={24} />
        </div>
        <div className="fb-metric-info">
          <span className="fb-metric-title">Reward Points</span>
          <span className="fb-metric-value">{rewardPoints.toLocaleString()}</span>
          <span className="fb-metric-subtext">₹{rupeeValue} value</span>
        </div>
      </div>
    </div>
  );
};

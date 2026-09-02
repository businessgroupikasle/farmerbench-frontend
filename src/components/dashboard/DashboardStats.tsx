import React from 'react';
import { Truck, Heart, Star, Sprout, ArrowRight } from 'lucide-react';

interface DashboardStatsProps {
  activeOrdersCount: number;
  wishlistCount: number;
  reviewsCount?: number;
  rewardPoints?: number;
  onNavigateTab: (tab: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  activeOrdersCount = 0,
  wishlistCount = 0,
  reviewsCount = 0,
  rewardPoints = 0,
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

      {/* 3. My Reviews */}
      <div className="fb-metric-card">
        <div className="fb-metric-icon-box">
          <Star size={24} />
        </div>
        <div className="fb-metric-info">
          <span className="fb-metric-title">My Reviews</span>
          <span className="fb-metric-value">{reviewsCount}</span>
          <a
            className="fb-metric-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab('reviews');
            }}
          >
            View Reviews <ArrowRight size={14} />
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

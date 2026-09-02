import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CloudRain, Package, ArrowRight, ShieldAlert, BadgeCheck } from 'lucide-react';
import './HomeFooterUpdates.css';

export const HomeFooterUpdates: React.FC = () => {
  return (
    <div className="home-footer-updates">
      <div className="update-col">
        <div className="update-header">
          <MessageSquare size={20} color="#2E7D32" />
          <h3>Latest Updates & Announcements</h3>
        </div>
        <div className="update-content">
          <p className="update-desc">Check out the latest government scheme for farmers in your state.</p>
          <Link to="/news" className="update-link">
            Read More <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      
      <div className="update-divider"></div>

      <div className="update-col">
        <div className="update-header">
          <CloudRain size={20} color="#1976D2" />
          <h3>Rain Alert</h3>
        </div>
        <div className="update-content">
          <p className="update-desc">Heavy rainfall expected in South India. Take necessary precautions.</p>
          <Link to="/weather" className="update-link">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      
      <div className="update-divider"></div>

      <div className="update-col">
        <div className="update-header">
          <Package size={20} color="#F57F17" />
          <h3>New Arrivals</h3>
        </div>
        <div className="update-content">
          <p className="update-desc">Check out our latest range of high-quality seeds and farming products.</p>
          <Link to="/products?sort=newest" className="update-link">
            Explore Now <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Compass } from 'lucide-react';
import './HomeHero.css';
import heroBg from '../../assets/hero-bg.jpg';

export const HomeHero: React.FC = () => {
  return (
    <section className="farmer-hero-section">
      <div className="farmer-hero-bg" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="farmer-hero-overlay"></div>
      </div>
      
      <div className="container farmer-hero-container">
        <div className="farmer-hero-content">
          <h1 className="farmer-hero-title">
            Everything Your <br /> Farm Needs, <br />
            <span className="text-green">In One Place</span>
          </h1>
          <p className="farmer-hero-subtitle">
            Quality products, expert services and smart solutions for a better harvest and sustainable tomorrow.
          </p>
          <div className="farmer-hero-actions">
            <Link to="/products" className="btn-shop-products">
              <ShoppingCart size={18} /> Shop Products
            </Link>
            <Link to="/services" className="btn-explore-services">
              <Compass size={18} /> Explore Services
            </Link>
          </div>
        </div>

        <div className="farmer-hero-banner-wrapper">
          <div className="mega-sale-banner">
            <div className="sale-tag">LIMITED TIME OFFER</div>
            <h2 className="sale-title">MEGA SEASON SALE</h2>
            <div className="sale-discount">
              <span className="discount-number">25%</span>
              <span className="discount-text">OFF</span>
            </div>
            <p className="sale-desc">ON SEEDS & FERTILIZERS</p>
            <div className="sale-extra">
              + EXTRA 10% OFF <br /> ON FIRST ORDER
            </div>
            <div className="sale-code">
              Use Code: <strong>FARM10</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

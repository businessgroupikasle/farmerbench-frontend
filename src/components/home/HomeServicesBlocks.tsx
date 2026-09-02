import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import './HomeServicesBlocks.css';

// Reliable Local Assets
import localIrrigation from '../../assets/smart-irrigation.jpg';
import localFarmMaintenance from '../../assets/farming-practices.jpg';
import localCropSupport from '../../assets/services-sprout-left.jpg';
import localCropMonitoring from '../../assets/crop-monitoring.jpg';
import localFertilizer from '../../assets/bio-power-promoter.jpg';
import localFarmerVisit from '../../assets/farm-visit-inspection.jpg';

// Photography image sources
const wellImg = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80';
const pipelineImg = 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=400&q=80';
const farmMaintenanceImg = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80';
const cropSupportImg = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=400&q=80';

// Bento section images
const bulkProductsImg = 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=500&q=80';
const farmerPortraitImg = 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=500&q=80';
const appPhoneMockupImg = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80';

export const HomeServicesBlocks: React.FC = () => {
  return (
    <section className="home-solutions-section" aria-label="Solutions For Every Need">
      <div className="solutions-container">
        
        {/* =========================================================================
            ROW 1: OUR SERVICES & 4 SERVICE CARDS (Farm Trips Removed)
            ========================================================================= */}
        <div className="solutions-top-row">
          
          {/* Left Intro Block */}
          <div className="solutions-intro-block">
            <span className="solutions-gold-tag">OUR SERVICES</span>
            <h2 className="solutions-main-title">Solutions For Every Need</h2>
            <p className="solutions-desc-text">
              From farm maintenance to expert advisory, we are here to support you at every step.
            </p>
            <Link to="/services" className="solutions-view-all-btn">
              View All Services
            </Link>
          </div>

          {/* Right 4 White Service Cards */}
          <div className="solutions-cards-grid">
            
            {/* 1. Well Maintenance */}
            <div className="service-white-card">
              <div className="service-card-img-wrap">
                <img
                  src={wellImg}
                  alt="Well Maintenance"
                  className="service-card-photo"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = localCropMonitoring;
                  }}
                />
              </div>
              <h3 className="service-card-heading">Well Maintenance</h3>
              <Link to="/services" className="service-book-now-link">
                Book Now <ArrowRight size={13} strokeWidth={2.5} className="book-arrow" />
              </Link>
            </div>

            {/* 2. Pipeline & Irrigation */}
            <div className="service-white-card">
              <div className="service-card-img-wrap">
                <img
                  src={pipelineImg}
                  alt="Pipeline & Irrigation"
                  className="service-card-photo"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = localIrrigation;
                  }}
                />
              </div>
              <h3 className="service-card-heading">Pipeline &amp; Irrigation</h3>
              <Link to="/services" className="service-book-now-link">
                Book Now <ArrowRight size={13} strokeWidth={2.5} className="book-arrow" />
              </Link>
            </div>

            {/* 3. Farm Maintenance */}
            <div className="service-white-card">
              <div className="service-card-img-wrap">
                <img
                  src={farmMaintenanceImg}
                  alt="Farm Maintenance"
                  className="service-card-photo"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = localFarmMaintenance;
                  }}
                />
              </div>
              <h3 className="service-card-heading">Farm Maintenance</h3>
              <Link to="/services" className="service-book-now-link">
                Book Now <ArrowRight size={13} strokeWidth={2.5} className="book-arrow" />
              </Link>
            </div>

            {/* 4. Crop Support */}
            <div className="service-white-card">
              <div className="service-card-img-wrap">
                <img
                  src={cropSupportImg}
                  alt="Crop Support"
                  className="service-card-photo"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = localCropSupport;
                  }}
                />
              </div>
              <h3 className="service-card-heading">Crop Support</h3>
              <Link to="/services" className="service-book-now-link">
                Book Now <ArrowRight size={13} strokeWidth={2.5} className="book-arrow" />
              </Link>
            </div>

          </div>
        </div>


        {/* =========================================================================
            ROW 2: 3 BENTO CARDS (Bulk Order | Why Choose Us | Download App)
            ========================================================================= */}
        <div className="solutions-bento-bottom-row">
          
          {/* Bento Card 1: Bulk Order? */}
          <div className="bento-feature-card card-bulk-order">
            <div className="bento-bulk-content">
              <span className="bento-gold-pill">Bulk Order?</span>
              <h3 className="bento-card-title">Get Special Discounts</h3>
              <p className="bento-card-desc">Best prices for bulk orders on fertilizers, seeds &amp; more.</p>
              <Link to="/contact" className="bento-green-btn">
                Enquire Now
              </Link>
            </div>
            <div className="bento-bulk-image-box">
              <img src={bulkProductsImg} alt="Bulk Order Products" className="bento-products-img" loading="lazy" />
            </div>
          </div>

          {/* Bento Card 2: Why Choose Us? */}
          <div className="bento-feature-card card-why-choose">
            <div className="bento-why-content">
              <h3 className="bento-card-title">Why Choose Us?</h3>
              <ul className="bento-checklist">
                <li>
                  <CheckCircle2 size={16} className="bento-check-icon" />
                  <span>Quality Assured Products</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="bento-check-icon" />
                  <span>Affordable Prices</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="bento-check-icon" />
                  <span>Fast &amp; Safe Delivery</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="bento-check-icon" />
                  <span>Expert Farmer Support</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="bento-check-icon" />
                  <span>Trusted by Thousands</span>
                </li>
              </ul>
            </div>
            <div className="bento-farmer-image-box">
              <img src={farmerPortraitImg} alt="Farmer" className="bento-farmer-img" loading="lazy" />
            </div>
          </div>

          {/* Bento Card 3: Download Our App */}
          <div className="bento-feature-card card-download-app">
            <div className="bento-app-content">
              <h3 className="bento-app-title">Download Our App</h3>
              <p className="bento-app-desc">Shop easily, anytime!</p>
              <div className="app-download-badges">
                {/* Google Play Button */}
                <a href="#download-google" className="app-store-btn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186A2.25 2.25 0 0 1 3 20.6V3.4c0-.624.234-1.196.609-1.586zM15.207 13.414l2.121 2.122-12.046 6.949 9.925-9.071zm0-2.828L5.282 1.515l12.046 6.95-2.121 2.121zm1.414 1.414l3.197 1.844a1.5 1.5 0 0 1 0 2.572l-3.197 1.844-1.707-1.707 1.707-1.707z" />
                  </svg>
                  <div className="app-btn-text">
                    <span className="app-btn-sub">GET IT ON</span>
                    <span className="app-btn-main">Google Play</span>
                  </div>
                </a>

                {/* App Store Button */}
                <a href="#download-apple" className="app-store-btn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-.89 1.69-.76 2.72 1.01.08 2.05-.47 2.47-1.22z" />
                  </svg>
                  <div className="app-btn-text">
                    <span className="app-btn-sub">Download on the</span>
                    <span className="app-btn-main">App Store</span>
                  </div>
                </a>
              </div>
            </div>
            <div className="bento-app-image-box">
              <img src={appPhoneMockupImg} alt="Farmer App Mockup" className="bento-phone-img" loading="lazy" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};



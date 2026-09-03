import React from 'react';
import { Headphones, PackageCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/home-hero-farmer-products.png';

export const HomeHero: React.FC = () => {
  return (
    <section className="agriflow-hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="container agriflow-hero-content animate-fade-in">
        <h1 className="agriflow-hero-title">
          <span>Better Farming</span>
          <span>Starts Here</span>
        </h1>
        <p className="agriflow-hero-description">
          Quality agricultural products and trusted farming solutions – all in one place.
        </p>

        <div className="agriflow-hero-actions">
          <Link to="/products" className="agriflow-hero-btn agriflow-hero-btn-primary">Shop Products</Link>
          <Link to="/services" className="agriflow-hero-btn agriflow-hero-btn-secondary">Explore Services</Link>
        </div>

        <div className="agriflow-hero-trust" aria-label="AgriEra benefits">
          <div><PackageCheck size={22} /><span>100% Original<br />Products</span></div>
          <div><Headphones size={22} /><span>Expert<br />Support</span></div>
          <div><Truck size={22} /><span>Fast &amp; Safe<br />Delivery</span></div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

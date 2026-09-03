import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Headphones,
  Home,
  Leaf,
  PackageCheck,
  Search,
  ShieldCheck,
  Stethoscope,
  Truck,
} from 'lucide-react';
import heroImage from '../assets/hero-bg.jpg';
import './NotFoundPage.css';

const suggestions = [
  { to: '/products', icon: Leaf, title: 'Shop Products', copy: 'Explore quality agri products' },
  { to: '/services#crop-doctor', icon: Stethoscope, title: 'Crop Doctor', copy: 'Get expert crop advice' },
  { to: '/services#crop-calendar', icon: CalendarDays, title: 'Crop Calendar', copy: 'Plan every stage of your crop' },
  { to: '/contact', icon: Headphones, title: 'Contact Support', copy: "We're here to help you" },
];

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/products?search=${encodeURIComponent(value)}` : '/products');
  };

  return (
    <div className="not-found-page">
      <section className="not-found-hero" aria-labelledby="not-found-title">
        <img className="not-found-hero-image" src={heroImage} alt="Sunrise over green terraced farmland" />
        <div className="not-found-hero-shade" />

        <div className="not-found-content">
          <p className="not-found-eyebrow">Page not found</p>
          <p className="not-found-code" aria-hidden="true">404</p>
          <h1 id="not-found-title">Looks like this path ends here</h1>
          <p className="not-found-description">
            The page you’re looking for may have moved, been removed, or is temporarily unavailable.
          </p>

          <form className="not-found-search" onSubmit={handleSearch} role="search">
            <label className="sr-only" htmlFor="not-found-search-input">Search AgriEra</label>
            <input
              id="not-found-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, services or farming guides…"
            />
            <button type="submit"><Search size={18} /> <span>Search</span></button>
          </form>

          <div className="not-found-actions">
            <Link to="/" className="not-found-button not-found-button-primary"><Home size={18} /> Back to Home</Link>
            <Link to="/products" className="not-found-button not-found-button-secondary">Browse Products</Link>
          </div>

          <p className="not-found-support">Need help? <Link to="/contact">Contact Support</Link></p>
        </div>

        <div className="not-found-waypoint" aria-hidden="true">
          <span className="not-found-pin"><span /></span>
          <span>Wrong turn</span>
        </div>
      </section>

      <section className="not-found-suggestions" aria-labelledby="suggestion-title">
        <h2 id="suggestion-title">You may be<br />looking for</h2>
        <div className="not-found-suggestion-grid">
          {suggestions.map(({ to, icon: Icon, title, copy }) => (
            <Link to={to} className="not-found-suggestion-card" key={title}>
              <span className="not-found-suggestion-icon"><Icon size={26} strokeWidth={1.8} /></span>
              <span className="not-found-suggestion-copy"><strong>{title}</strong><small>{copy}</small></span>
              <ArrowRight className="not-found-suggestion-arrow" size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="not-found-trust" aria-label="AgriEra service benefits">
        <div><Headphones size={21} /><span>Expert Support</span></div>
        <div><ShieldCheck size={21} /><span>Quality Products</span></div>
        <div><Truck size={21} /><span>Fast Delivery</span></div>
        <div><PackageCheck size={21} /><span>Farmer First</span></div>
      </section>
    </div>
  );
};

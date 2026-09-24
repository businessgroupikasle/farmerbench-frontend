import React from 'react';
import { Home, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import notFoundIllustration from '../assets/illustrations/agri-404-field.png';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => (
  <main className="not-found-page">
    <section className="not-found-card" aria-labelledby="not-found-title">
      <div className="not-found-visual" aria-hidden="true">
        <img src={notFoundIllustration} alt="" decoding="async" fetchPriority="high" />
        <div className="not-found-code">
          <span>4</span>
          <span className="not-found-code-leaf">0<i /></span>
          <span>4</span>
        </div>
        <div className="not-found-sign">Page<br />not found</div>
      </div>

      <div className="not-found-copy">
        <span className="not-found-eyebrow">Lost in the fields?</span>
        <h1 id="not-found-title">Oops! This page has gone off the trail.</h1>
        <p>The page may have moved, been removed, or the address might be incorrect.</p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button not-found-button-primary">
            <Home size={17} /> Go Back Home
          </Link>
          <Link to="/products" className="not-found-button not-found-button-secondary">
            <ShoppingBag size={17} /> Browse Products
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default NotFoundPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import farmerLogo from '../../assets/AgriEra-logo.png';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="AgriEra-footer">
      <div className="AgriEra-footer-container">
        {/* Main 6-Column Footer Grid */}
        <div className="AgriEra-footer-grid">
          {/* 1. Brand Logo & Description */}
          <div className="AgriEra-brand-col">
            <Link to="/" className="AgriEra-brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <img
                src={farmerLogo}
                alt="AgriEra Logo"
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'contain', backgroundColor: '#FFFFFF', padding: '2px' }}
              />
              <div className="AgriEra-brand-name-group">
                <span className="AgriEra-brand-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>AgriEra</span>
                <span className="AgriEra-brand-tagline">Grow Better, Live Better</span>
              </div>
            </Link>

            <p className="AgriEra-brand-desc">
              Your one-stop online store for quality agricultural products and trusted farming solutions.
            </p>

            {/* Social Icons */}
            <div className="AgriEra-social-links">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="AgriEra-social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="AgriEra-social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="AgriEra-social-icon" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#123C22"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="AgriEra-social-icon" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 2. Company Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Company</h4>
            <ul className="AgriEra-footer-links-list">
              <li><Link to="/about" className="AgriEra-footer-link">About Us</Link></li>
              <li><Link to="/about#mission" className="AgriEra-footer-link">Our Mission</Link></li>
              {/* <li><Link to="/about#careers" className="AgriEra-footer-link">Careers</Link></li> */}
              <li><Link to="/privacy" className="AgriEra-footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="AgriEra-footer-link">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* 3. Products Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Products</h4>
            <ul className="AgriEra-footer-links-list">
              <li><Link to="/products?category=fertilizers" className="AgriEra-footer-link">Fertilizers</Link></li>
              <li><Link to="/products?category=biostimulants" className="AgriEra-footer-link">Biostimulants</Link></li>
              <li><Link to="/products?category=pesticides" className="AgriEra-footer-link">Pesticides</Link></li>
              <li><Link to="/products?category=crop-nutrition" className="AgriEra-footer-link">Crop Nutrition</Link></li>
              <li><Link to="/products" className="AgriEra-footer-link">All Products</Link></li>
            </ul>
          </div>

          {/* 4. Services Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Services</h4>
            <ul className="AgriEra-footer-links-list">
              <li><Link to="/services" className="AgriEra-footer-link">Crop Consultation</Link></li>
              <li><Link to="/services" className="AgriEra-footer-link">Soil Testing</Link></li>
              <li><Link to="/services" className="AgriEra-footer-link">Crop Nutrition</Link></li>
              <li><Link to="/services" className="AgriEra-footer-link">Pest Control</Link></li>
              <li><Link to="/services" className="AgriEra-footer-link">All Services</Link></li>
            </ul>
          </div>

          {/* 5. Resources Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Resources</h4>
            <ul className="AgriEra-footer-links-list">
              <li><Link to="/about#blog" className="AgriEra-footer-link">Blog</Link></li>
              <li><Link to="/faq" className="AgriEra-footer-link">FAQs</Link></li>
              <li><Link to="/shipping" className="AgriEra-footer-link">Shipping Policy</Link></li>
              <li><Link to="/returns" className="AgriEra-footer-link">Return Policy</Link></li>
              {/* <li><Link to="/dashboard?tab=orders" className="AgriEra-footer-link">Track Order</Link></li> */}
            </ul>
          </div>

          {/* 6. Contact Us Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Contact Us</h4>
            <ul className="AgriEra-contact-list">
              <li className="AgriEra-contact-item">
                <Phone size={15} className="AgriEra-contact-icon" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li className="AgriEra-contact-item">
                <Mail size={15} className="AgriEra-contact-icon" />
                <a href="mailto:support@AgriEra.in">support@AgriEra.in</a>
              </li>
              <li className="AgriEra-contact-item">
                <MapPin size={16} className="AgriEra-contact-icon" />
                <span>123, Green Fields, Coimbatore - 641001, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Payment Badges */}
        <div className="AgriEra-footer-bottom-bar">
          <p className="AgriEra-copyright">
            © 2024 AgriEra. All Rights Reserved.
          </p>

          <div className="AgriEra-payment-badges">
            {/* VISA */}
            <div className="AgriEra-payment-badge" title="Visa">
              <svg width="34" height="14" viewBox="0 0 36 12" fill="none">
                <path d="M14.8 11.5L16.8 0.5H19.5L17.5 11.5H14.8ZM27.7 0.8C27.1 0.6 26.2 0.4 25.1 0.4C22.2 0.4 20.2 1.9 20.2 4.1C20.2 5.7 21.7 6.6 22.8 7.1C23.9 7.6 24.3 8 24.3 8.5C24.3 9.3 23.3 9.6 22.4 9.6C21.4 9.6 20.8 9.5 20.0 9.1L19.6 8.9L19.2 11.3C19.9 11.6 21.1 11.8 22.3 11.8C25.4 11.8 27.4 10.3 27.4 8.0C27.4 6.2 25.8 5.2 24.4 4.5C23.6 4.1 23.1 3.8 23.1 3.2C23.1 2.6 23.8 2.0 25.1 2.0C26.0 2.0 26.7 2.2 27.2 2.4L27.5 2.5L27.7 0.8ZM35.8 0.5H33.7C33.0 0.5 32.5 0.7 32.2 1.4L27.5 11.5H30.4L31.0 9.9H34.5L34.8 11.5H37.3L35.8 0.5ZM31.8 7.6L33.2 3.6L34.1 7.6H31.8ZM12.1 0.5L9.6 7.9L9.3 6.4C8.8 4.7 7.3 2.8 5.6 1.9L8.1 11.5H11.0L15.3 0.5H12.1ZM6.0 0.5H0.6L0.5 0.8C4.5 1.8 7.2 4.3 8.3 7.2L7.1 1.2C6.9 0.7 6.5 0.5 6.0 0.5Z" fill="#1A1F71"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="AgriEra-payment-badge" title="Mastercard">
              <svg width="28" height="18" viewBox="0 0 32 20" fill="none">
                <circle cx="11" cy="10" r="9" fill="#EB001B"/>
                <circle cx="21" cy="10" r="9" fill="#F79E1B"/>
                <path d="M16 3.5C18 5.2 19.3 7.5 19.3 10C19.3 12.5 18 14.8 16 16.5C14 14.8 12.7 12.5 12.7 10C12.7 7.5 14 5.2 16 3.5Z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* BHIM / Pay */}
            <div className="AgriEra-payment-badge" title="BHIM">
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#5B2C6F', fontStyle: 'italic' }}>BHIM</span>
            </div>

            {/* RuPay */}
            <div className="AgriEra-payment-badge" title="RuPay">
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#097938', letterSpacing: '-0.02em' }}>Ru<span style={{ color: '#F37021' }}>Pay</span></span>
            </div>

            {/* UPI */}
            <div className="AgriEra-payment-badge" title="UPI">
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#097938', letterSpacing: '0.04em' }}>UPI<span style={{ color: '#F37021' }}>▶</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

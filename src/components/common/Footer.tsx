import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import farmerLogo from '../../assets/AgriEra-logo-optimized1.png';
import { useCategories } from '../../hooks/useCategories';
import './Footer.css';

const formatCategoryName = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const Footer: React.FC = () => {
  const { data: categories = [] } = useCategories();
  const activeCategories = (categories || []).filter((c) => c.isActive !== false);

  return (
    <footer
      className="AgriEra-footer"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        // Only scroll for internal links, not external links like social media
        if (anchor && !anchor.getAttribute('target')) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
        }
      }}
    >
      <div className="AgriEra-footer-container">
        {/* Main 6-Column Footer Grid */}
        <div className="AgriEra-footer-grid">
          {/* 1. Brand Logo & Description */}
          <div className="AgriEra-brand-col">
            <Link to="/" className="AgriEra-brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <img
                src={farmerLogo}
                alt="AgriEra Logo"
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'contain', backgroundColor: '#FFFFFF', padding: '2px' }}
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
              <a href={import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com'} target="_blank" rel="noreferrer" className="AgriEra-social-icon" aria-label="YouTube">
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
              <li><Link to="/privacy" className="AgriEra-footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="AgriEra-footer-link">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* 3. Categories / Products Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Categories</h4>
            <ul className="AgriEra-footer-links-list">
              {activeCategories.length > 0 ? (
                activeCategories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?category=${cat.slug || cat.id}`}
                      className="AgriEra-footer-link"
                    >
                      {formatCategoryName(cat.name)}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/products?category=organic-farming" className="AgriEra-footer-link">Organic Farming</Link></li>
                  <li><Link to="/products?category=chemical" className="AgriEra-footer-link">Chemical</Link></li>
                  <li><Link to="/products?category=traps" className="AgriEra-footer-link">Traps</Link></li>
                  <li><Link to="/products?category=Seedlings" className="AgriEra-footer-link">Seedlings</Link></li>
                  <li><Link to="/products?category=seeds" className="AgriEra-footer-link">Seeds</Link></li>
                  <li><Link to="/products?category=farm-equipment" className="AgriEra-footer-link">Farm Equipment</Link></li>
                </>
              )}
              <li><Link to="/products" className="AgriEra-footer-link">All Products</Link></li>
            </ul>
          </div>

          {/* 4. Services Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Services</h4>
            <ul className="AgriEra-footer-links-list">
              <li><Link to="/services/farm-development" className="AgriEra-footer-link">Farm Development</Link></li>
              <li><Link to="/services/well-development" className="AgriEra-footer-link">Well Development</Link></li>
              <li><Link to="/services/drip-irrigation" className="AgriEra-footer-link">Drip Irrigation</Link></li>
              <li><Link to="/services/farm-consultancy" className="AgriEra-footer-link">Farm Consultancy</Link></li>
              <li><Link to="/crop-doctor" className="AgriEra-footer-link">Crop Doctor</Link></li>
              <li><Link to="/services" className="AgriEra-footer-link">All Services</Link></li>
            </ul>
          </div>

          {/* 5. Resources Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Resources</h4>
            <ul className="AgriEra-footer-links-list">
              <li><Link to="/blog" className="AgriEra-footer-link">Blog</Link></li>
              <li><Link to="/faq" className="AgriEra-footer-link">FAQs</Link></li>
              <li><Link to="/shipping" className="AgriEra-footer-link">Shipping Policy</Link></li>
              <li><Link to="/returns" className="AgriEra-footer-link">Return Policy</Link></li>
            </ul>
          </div>

          {/* 6. Contact Us Column */}
          <div>
            <h4 className="AgriEra-footer-col-title">Contact Us</h4>
            <ul className="AgriEra-contact-list">
              <li className="AgriEra-contact-item">
                <Phone size={15} className="AgriEra-contact-icon" />
                <a href="tel:+919360763060">+91 93607 63060</a>
              </li>
              <li className="AgriEra-contact-item">
                <Mail size={15} className="AgriEra-contact-icon" />
                <a href="mailto:support@AgriEra.in">support@AgriEra.in</a>
              </li>
              <li className="AgriEra-contact-item">
                <MapPin size={16} className="AgriEra-contact-icon" />
                <a href="https://www.google.com/maps/search/?api=1&query=123%2C+Green+Fields%2C+Coimbatore+641001%2C+Tamil+Nadu%2C+India" target="_blank" rel="noreferrer">123, Green Fields, Coimbatore - 641001, Tamil Nadu, India</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Payment Badges */}
        <div className="AgriEra-footer-bottom-bar">
          <p className="AgriEra-copyright">
            © {new Date().getFullYear()} AgriEra. All Rights Reserved.
          </p>

          <p className="AgriEra-footer-credit">
            Crafted and Maintained by <a href="https://ikasleinnovations.com/" target="_blank" rel="noopener noreferrer">Ikasle Business Group</a>
          </p>
          <div className="AgriEra-payment-badges" aria-label="Accepted payment gateway">
            <div className="AgriEra-payment-badge AgriEra-razorpay-badge" title="Razorpay">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
                <path d="M10.3 1L3 12.1H8.2L5.4 19L15 7H9.5L12.7 1H10.3Z" fill="#3395FF" />
              </svg>
              <span>Razorpay</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;


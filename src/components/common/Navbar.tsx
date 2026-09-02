import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useUIStore } from '../../store/uiStore';
import {
  ShoppingCart,
  ChevronDown,
  User as UserIcon,
  Menu,
  X,
  Send,
  Sparkles,
  Tractor,
  Droplets,
  CloudRain,
  Briefcase,
  Stethoscope,
  CalendarDays,
} from 'lucide-react';
import farmerLogo from '../../assets/farmerbench-logo.png';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { openAuthModal } = useUIStore();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isServices = location.pathname === '/services';
  const isCropServices = location.pathname.includes('crop') || location.hash.includes('crop');
  const isProducts = location.pathname === '/products' || location.pathname === '/catalog' || location.pathname.startsWith('/product');
  const isBlog = location.pathname === '/blog';
  const isContact = location.pathname === '/contact';

  return (
    <>
      <header className="agriflow-header">
        {/* Top Bar */}
        <div className="agriflow-topbar hide-mobile">
          <div className="container agriflow-topbar-container">
            <div className="topbar-left">
              <Sparkles size={14} className="topbar-icon" />
              <span>Supporting Farmers, Growing Together</span>
            </div>
            <div className="topbar-center">
              <span className="topbar-item">
                <Tractor size={14} className="topbar-icon" /> Free Delivery on Orders Above ₹999
              </span>
              <span className="topbar-item">
                <UserIcon size={14} className="topbar-icon" /> 24/7 Farmer Support
              </span>
            </div>
            <div className="topbar-right">
              <span className="topbar-item">
                <Stethoscope size={14} className="topbar-icon" /> +91 98765-43210
              </span>
              <div className="topbar-socials">
                <span className="social-icon">f</span>
                <span className="social-icon">i</span>
                <span className="social-icon">y</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container agriflow-nav-container">
          {/* Brand Logo - FarmerBench */}
          <Link to="/" className="agriflow-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <img
              src={farmerLogo}
              alt="FarmerBench Logo"
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'contain' }}
            />
            <span className="agriflow-brand-text" style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#165B33' }}>
              FarmerBench
            </span>
          </Link>

          {/* Desktop Navigation & Actions */}
          <div className="agriflow-nav-wrapper hide-mobile">
            <nav className="agriflow-nav-links">
              <Link to="/" className={`agriflow-nav-link ${isHome ? 'active-pill' : ''}`}>
                Home
              </Link>
              <Link to="/about" className={`agriflow-nav-link ${isAbout ? 'active-text' : ''}`}>
                About
              </Link>

              {/* 1. Services Dropdown on Hover */}
              <div className="agriflow-dropdown-wrapper">
                <Link
                  to="/services"
                  className={`agriflow-nav-link agriflow-dropdown-trigger ${isServices ? 'active-text' : ''}`}
                >
                  <span>Services</span>
                  <ChevronDown size={14} className="agriflow-dropdown-chevron" />
                </Link>
                <div className="agriflow-nav-dropdown-menu">
                  <Link to="/services/farm-development" className="agriflow-dropdown-subitem">
                    <div className="agriflow-dropdown-icon-box">
                      <Tractor size={17} />
                    </div>
                    <div className="agriflow-dropdown-info">
                      <span className="agriflow-dropdown-title">Farm Development</span>
                      <span className="agriflow-dropdown-sub">Land planning, leveling & setup</span>
                    </div>
                  </Link>
                  <Link to="/services/well-development" className="agriflow-dropdown-subitem">
                    <div className="agriflow-dropdown-icon-box">
                      <Droplets size={17} />
                    </div>
                    <div className="agriflow-dropdown-info">
                      <span className="agriflow-dropdown-title">Well Development</span>
                      <span className="agriflow-dropdown-sub">Borewell & groundwater recharge</span>
                    </div>
                  </Link>
                  <Link to="/services/drip-irrigation" className="agriflow-dropdown-subitem">
                    <div className="agriflow-dropdown-icon-box">
                      <CloudRain size={17} />
                    </div>
                    <div className="agriflow-dropdown-info">
                      <span className="agriflow-dropdown-title">Drip Irrigation</span>
                      <span className="agriflow-dropdown-sub">Micro-drip & fertigation network</span>
                    </div>
                  </Link>
                  <Link to="/services/farm-consultancy" className="agriflow-dropdown-subitem">
                    <div className="agriflow-dropdown-icon-box">
                      <Briefcase size={17} />
                    </div>
                    <div className="agriflow-dropdown-info">
                      <span className="agriflow-dropdown-title">Farm Consultancy</span>
                      <span className="agriflow-dropdown-sub">Expert agronomy & yield guidance</span>
                    </div>
                  </Link>
                </div>
              </div>

              <Link to="/products" className={`agriflow-nav-link ${isProducts ? 'active-text' : ''}`}>
                Products
              </Link>

              {/* 2. Crop Services Dropdown on Hover */}
              <div className="agriflow-dropdown-wrapper">
                <Link
                  to="/services"
                  className={`agriflow-nav-link agriflow-dropdown-trigger ${isCropServices ? 'active-text' : ''}`}
                >
                  <span>Crop Services</span>
                  <ChevronDown size={14} className="agriflow-dropdown-chevron" />
                </Link>
                <div className="agriflow-nav-dropdown-menu">
                  <Link to="/services#crop-doctor" className="agriflow-dropdown-subitem">
                    <div className="agriflow-dropdown-icon-box">
                      <Stethoscope size={17} />
                    </div>
                    <div className="agriflow-dropdown-info">
                      <span className="agriflow-dropdown-title">Crop Doctor</span>
                      <span className="agriflow-dropdown-sub">AI & expert disease, pest diagnostics</span>
                    </div>
                  </Link>
                  <Link to="/services#crop-calendar" className="agriflow-dropdown-subitem">
                    <div className="agriflow-dropdown-icon-box">
                      <CalendarDays size={17} />
                    </div>
                    <div className="agriflow-dropdown-info">
                      <span className="agriflow-dropdown-title">Crop Calendar</span>
                      <span className="agriflow-dropdown-sub">Sowing, irrigation & harvest tracker</span>
                    </div>
                  </Link>
                </div>
              </div>

              <Link to="/blog" className={`agriflow-nav-link ${isBlog ? 'active-text' : ''}`}>
                Blog
              </Link>
            </nav>

            {/* CTA Button: Contact Us */}
            <Link to="/contact" className={`agriflow-btn-contact ${isContact ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              Contact Us
            </Link>

            {/* Right Action Group: Search, Cart, Enquire Now */}
            <div className="agriflow-header-actions">
              {/* Search Icon */}
              <button className="agriflow-account-btn" title="Search">
                <div className="agriflow-icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </button>

              {/* Cart Widget */}
              <Link to="/cart" className="agriflow-cart-widget-btn" aria-label="View shopping cart" style={{ textDecoration: 'none' }}>
                <div className="agriflow-cart-icon-box">
                  <ShoppingCart size={20} strokeWidth={2.2} />
                  <span className="agriflow-cart-green-badge" style={{ backgroundColor: '#F6B748', color: '#17251E', border: '1px solid #fff' }}>{totalItems}</span>
                </div>
              </Link>

              {/* Enquire Now Button */}
              <Link to="/contact" className="agriflow-btn-contact" style={{ textDecoration: 'none', backgroundColor: '#123C22', color: '#ffffff', borderRadius: '20px', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                Enquire Now
              </Link>
            </div>
          </div>

          {/* Mobile Menu & Cart */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="show-mobile-flex">
            <Link to="/cart" className="agriflow-cart-widget-btn" aria-label="View shopping cart" style={{ textDecoration: 'none' }}>
              <div className="agriflow-cart-icon-box">
                <ShoppingCart size={18} strokeWidth={2.2} />
                <span className="agriflow-cart-green-badge">{totalItems}</span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="agriflow-mobile-menu animate-fade-in">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`agriflow-nav-link ${isHome ? 'active-text' : ''}`}>
              Home
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`agriflow-nav-link ${isAbout ? 'active-text' : ''}`}>
              About
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={`agriflow-nav-link ${isServices ? 'active-text' : ''}`} style={{ fontWeight: 700 }}>
                Services
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.75rem', borderLeft: '2px solid rgba(136, 207, 58, 0.3)' }}>
                <Link to="/services/farm-development" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#CBD5E1', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tractor size={14} color="#88CF3A" /> Farm Development
                </Link>
                <Link to="/services/well-development" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#CBD5E1', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Droplets size={14} color="#88CF3A" /> Well Development
                </Link>
                <Link to="/services/drip-irrigation" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#CBD5E1', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CloudRain size={14} color="#88CF3A" /> Drip Irrigation
                </Link>
                <Link to="/services/farm-consultancy" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#CBD5E1', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={14} color="#88CF3A" /> Farm Consultancy
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={`agriflow-nav-link ${isCropServices ? 'active-text' : ''}`} style={{ fontWeight: 700 }}>
                Crop Services
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.75rem', borderLeft: '2px solid rgba(136, 207, 58, 0.3)' }}>
                <Link to="/services#crop-doctor" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#CBD5E1', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Stethoscope size={14} color="#88CF3A" /> Crop Doctor
                </Link>
                <Link to="/services#crop-calendar" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#CBD5E1', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarDays size={14} color="#88CF3A" /> Crop Calendar
                </Link>
              </div>
            </div>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={`agriflow-nav-link ${isProducts ? 'active-text' : ''}`}>
              Products
            </Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className={`agriflow-nav-link ${isBlog ? 'active-text' : ''}`}>
              Blog
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="agriflow-btn-contact"
              style={{ marginTop: '0.5rem', textDecoration: 'none', textAlign: 'center' }}
            >
              Contact Us
            </Link>
            {!isAuthenticated ? (
              <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal('login'); }} className="agriflow-auth-btn" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                Sign In / Register
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                  Dashboard
                </Link>
                <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="btn btn-danger" style={{ padding: '0.65rem 1rem' }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Interactive Contact Modal */}
      {isContactModalOpen && (
        <div className="agriflow-modal-overlay" onClick={() => setIsContactModalOpen(false)}>
          <div className="agriflow-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsContactModalOpen(false)} className="agriflow-modal-close">
              <X size={22} />
            </button>

            {contactSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(136, 207, 58, 0.2)', color: '#88CF3A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Sparkles size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>Thank You for Reaching Out!</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Your message has been sent to the AgriFlow team. We will get back to you within 24 hours.</p>
                <button onClick={() => { setContactSubmitted(false); setIsContactModalOpen(false); }} className="agriflow-btn-contact">Close</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#88CF3A' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#88CF3A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Get in Touch</span>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Contact AgriFlow</h2>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Have questions about agricultural solutions, wholesale orders, or equipment? Send us a message.</p>
                <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>Full Name</label>
                    <input required type="text" placeholder="e.g. John Doe" className="agriflow-input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>Email Address</label>
                    <input required type="email" placeholder="john@example.com" className="agriflow-input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>Message</label>
                    <textarea required rows={3} placeholder="How can AgriFlow assist your farming & business operations?" className="agriflow-input" style={{ resize: 'none' }} />
                  </div>
                  <button type="submit" className="agriflow-btn-contact" style={{ marginTop: '0.5rem', width: '100%', gap: '0.5rem' }}>
                    <Send size={16} /> Send Message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import {
  ShoppingCart,
  ChevronDown,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  PackageCheck,
  Menu,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { openDrawer } = useCartStore();
  const { openAuthModal } = useUIStore();
  const location = useLocation();

  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const pagesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pagesRef.current && !pagesRef.current.contains(event.target as Node)) {
        setIsPagesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isProducts = location.pathname === '/products' || location.pathname === '/catalog' || location.pathname.startsWith('/product');
  const isBlog = location.pathname === '/blog';
  const isContact = location.pathname === '/contact';

  return (
    <>
      <header className="agriflow-header">
        <div className="container agriflow-nav-container">
          {/* Brand Logo - AgriFlow */}
          <Link to="/" className="agriflow-brand">
            <div className="agriflow-logo-icon">
              <svg width="36" height="28" viewBox="0 0 38 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="skewX(-24) translate(8, 0)">
                  <rect x="0" y="2" width="22" height="2.8" rx="1.4" fill="#78B833" />
                  <rect x="0" y="7.5" width="22" height="2.8" rx="1.4" fill="#88CF3A" />
                  <rect x="0" y="13" width="22" height="2.8" rx="1.4" fill="#F1F5F9" />
                  <rect x="0" y="18.5" width="22" height="2.8" rx="1.4" fill="#CBD5E1" />
                  <rect x="0" y="24" width="22" height="2.8" rx="1.4" fill="#94A3B8" />
                  <line x1="5.5" y1="1" x2="5.5" y2="27" stroke="#17251E" strokeWidth="1.4" />
                  <line x1="11" y1="1" x2="11" y2="27" stroke="#17251E" strokeWidth="1.4" />
                  <line x1="16.5" y1="1" x2="16.5" y2="27" stroke="#17251E" strokeWidth="1.4" />
                </g>
              </svg>
            </div>
            <span className="agriflow-brand-text">AgriFlow</span>
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
              <Link to="/products" className={`agriflow-nav-link ${isProducts ? 'active-text' : ''}`}>
                Products
              </Link>
              <Link to="/#services" className="agriflow-nav-link">
                Services
              </Link>
              <Link to="/blog" className={`agriflow-nav-link ${isBlog ? 'active-text' : ''}`}>
                Blog
              </Link>
            </nav>

            {/* CTA Button: Contact Us */}
            <Link to="/contact" className={`agriflow-btn-contact ${isContact ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              Contact Us
            </Link>

            {/* Right Action Group: My Account & Cart matching reference image */}
            <div className="agriflow-header-actions">
              {/* Account Widget */}
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    if (isAuthenticated && user) {
                      setIsUserMenuOpen(!isUserMenuOpen);
                    } else {
                      openAuthModal('login');
                    }
                  }}
                  className="agriflow-account-btn"
                  title="My Account"
                >
                  <div className="agriflow-icon-box">
                    {isAuthenticated && user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                    ) : (
                      <UserIcon size={18} strokeWidth={2.2} />
                    )}
                  </div>
                  <div className="agriflow-account-text">
                    <span className="agriflow-account-subtext">
                      {isAuthenticated && user ? `Hi, ${user.name.split(' ')[0]}` : 'Login / Register'}
                    </span>
                    <span className="agriflow-account-title">
                      My Account <ChevronDown size={13} strokeWidth={2.6} />
                    </span>
                  </div>
                </button>

                {/* Dropdown menu when logged in */}
                {isAuthenticated && user && isUserMenuOpen && (
                  <div className="agriflow-user-menu animate-fade-in">
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                      </p>
                    </div>

                    <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="agriflow-user-menu-item">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/dashboard?tab=orders" onClick={() => setIsUserMenuOpen(false)} className="agriflow-user-menu-item">
                      <PackageCheck size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="agriflow-user-menu-item" style={{ color: '#F6B748', fontWeight: 600 }}>
                        <ShieldCheck size={15} /> Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="agriflow-user-menu-item"
                      style={{ background: 'transparent', border: 'none', color: '#f87171', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%', cursor: 'pointer' }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Vertical Divider */}
              <div className="agriflow-actions-divider" />

              {/* Cart Widget */}
              <button onClick={openDrawer} className="agriflow-cart-widget-btn" aria-label="View shopping cart">
                <div className="agriflow-cart-icon-box">
                  <ShoppingCart size={18} strokeWidth={2.2} />
                  <span className="agriflow-cart-green-badge">{totalItems}</span>
                </div>
                <span className="agriflow-cart-widget-title">Cart</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu & Cart */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="show-mobile-flex">
            <button onClick={openDrawer} className="agriflow-cart-widget-btn" aria-label="View shopping cart">
              <div className="agriflow-cart-icon-box">
                <ShoppingCart size={18} strokeWidth={2.2} />
                <span className="agriflow-cart-green-badge">{totalItems}</span>
              </div>
            </button>
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
            <Link to="/#services" onClick={() => setIsMobileMenuOpen(false)} className="agriflow-nav-link">
              Services
            </Link>
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

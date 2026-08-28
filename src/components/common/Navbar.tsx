import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { useFilterStore } from '../../store/filterStore';
import {
  ShoppingBag,
  Sun,
  Moon,
  Search,
  User as UserIcon,
  Layers,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { openDrawer } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const { openAuthModal } = useUIStore();
  const { filters, setSearch } = useFilterStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchQuery);
    navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Layers size={20} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FormerBench
          </span>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="hide-mobile"
        >
          <Link
            to="/catalog"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Catalog
          </Link>
          <Link
            to="/catalog?featured=true"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Featured
          </Link>
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: '1',
            maxWidth: '360px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search audio, watches, apparel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '2.4rem',
              paddingRight: '0.85rem',
              height: '38px',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-subtle)',
              borderColor: 'transparent',
            }}
          />
        </form>

        {/* Actions (Theme, Cart, Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon"
            style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-full)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openDrawer}
            className="btn btn-secondary btn-icon"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              position: 'relative',
            }}
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile / Auth Modal */}
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <UserIcon size={16} />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }} className="hide-mobile">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="card animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
                  >
                    <LayoutDashboard size={15} /> Dashboard & Profile
                  </Link>

                  <Link
                    to="/dashboard?tab=orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
                  >
                    <PackageCheck size={15} /> Order History
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        justifyContent: 'flex-start',
                        border: 'none',
                        background: 'var(--brand-primary-light)',
                        color: 'var(--brand-primary)',
                        fontWeight: 700,
                      }}
                    >
                      <ShieldCheck size={15} /> Admin Portal
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      justifyContent: 'flex-start',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--color-danger)',
                      borderTop: '1px solid var(--border-color)',
                      marginTop: '0.25rem',
                      paddingTop: '0.5rem',
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="gradient"
              size="sm"
              onClick={() => openAuthModal('login')}
              leftIcon={<UserIcon size={15} />}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

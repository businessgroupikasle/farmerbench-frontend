import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Heart,
  Star,
  MapPin,
  Shield,
  LogOut,
  CheckCircle2,
  Stethoscope,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { User } from '@formerbench/shared';

export interface DashboardMobileBarProps {
  user: User | null;
  activeTab: string;
  ordersCount: number;
  wishlistCount: number;
  doctorRequestsCount?: number;
  onOpenMenu: () => void;
}

export const DashboardMobileBar: React.FC<DashboardMobileBarProps> = ({
  user,
  activeTab,
  ordersCount = 0,
  wishlistCount = 0,
  doctorRequestsCount = 0,
  onOpenMenu,
}) => {
  const displayName = user?.name || 'Farmer Member';
  const avatarSrc = user?.avatarUrl;

  const tabLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    orders: 'My Orders',
    wishlist: 'Wishlist',
    reviews: 'My Reviews',
    'crop-doctor': 'Crop Doctor Requests',
    addresses: 'Addresses',
    profile: 'Profile & Security',
  };

  const activeLabel = tabLabels[activeTab] || 'Dashboard';
  const totalBadges = (ordersCount || 0) + (wishlistCount || 0) + (doctorRequestsCount || 0);

  return (
    <div
      className="fb-mobile-sidebar-trigger-bar"
      onClick={onOpenMenu}
      role="button"
      tabIndex={0}
      aria-label="Open navigation menu"
    >
      <div className="fb-mobile-trigger-user">
        <div className="fb-mobile-trigger-avatar">
          {avatarSrc ? (
            <img src={avatarSrc} alt={displayName} />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="fb-mobile-trigger-info">
          <span className="fb-mobile-trigger-name">{displayName}</span>
          <span className="fb-mobile-trigger-active">{activeLabel}</span>
        </div>
      </div>

      <button
        type="button"
        className="fb-mobile-trigger-btn"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label="Toggle navigation menu"
      >
        <Menu size={17} />
        <span>Menu</span>
        {totalBadges > 0 && (
          <span className="fb-mobile-trigger-badge">{totalBadges}</span>
        )}
      </button>
    </div>
  );
};

interface DashboardSidebarProps {
  user: User | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  ordersCount: number;
  wishlistCount: number;
  doctorRequestsCount?: number;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  activeTab,
  onSelectTab,
  onLogout,
  ordersCount = 0,
  wishlistCount = 0,
  doctorRequestsCount = 0,
  isMobileOpen: controlledMobileOpen,
  setIsMobileOpen: setControlledMobileOpen,
}) => {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const isMobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;
  const setIsMobileOpen = setControlledMobileOpen || setInternalMobileOpen;

  const displayName = user?.name || 'Farmer Member';
  const displayPhone = user?.phone || user?.email || 'Contact Info';
  const avatarSrc = user?.avatarUrl;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={18} />, badge: ordersCount },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} />, badge: wishlistCount },
    { id: 'reviews', label: 'My Reviews', icon: <Star size={18} /> },
    { id: 'crop-doctor', label: 'Crop Doctor Requests', icon: <Stethoscope size={18} />, badge: doctorRequestsCount },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'profile', label: 'Profile & Security', icon: <Shield size={18} /> },
  ];

  const totalBadges = (ordersCount || 0) + (wishlistCount || 0) + (doctorRequestsCount || 0);

  // Lock background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, setIsMobileOpen]);

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileOpen(false);
  };

  const handleLogoutClick = () => {
    setIsMobileOpen(false);
    onLogout();
  };

  return (
    <>
      {/* Floating Action Button for easy thumb access on mobile when scrolled */}
      <button
        type="button"
        className="fb-mobile-floating-menu-btn"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
        <span>Menu</span>
        {totalBadges > 0 && (
          <span className="fb-mobile-floating-badge">{totalBadges}</span>
        )}
      </button>

      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`fb-mobile-sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden={!isMobileOpen}
      />

      {/* Sidebar: Desktop sticky left column / Mobile slide-out drawer */}
      <aside className={`fb-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile-only Drawer Header */}
        <div className="fb-sidebar-drawer-header">
          <div className="fb-drawer-title">
            <LayoutDashboard size={18} color="#166534" />
            <span>Farmer Navigation</span>
          </div>
          <button
            type="button"
            className="fb-sidebar-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="fb-user-profile-card">
          <div className="fb-user-avatar-wrap">
            {avatarSrc ? (
              <img src={avatarSrc} alt={displayName} />
            ) : (
              <div className="fb-user-avatar-fallback">{displayName.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="fb-user-details">
            <span className="fb-user-name" title={displayName}>
              {displayName}
            </span>
            <span className="fb-user-phone">{displayPhone}</span>
            <div className="fb-verified-badge">
              <CheckCircle2 size={12} color="#16a34a" />
              <span>{user?.emailVerified ? 'Verified Account' : 'Active Member'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="fb-sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`fb-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(item.id)}
              >
                <div className="fb-nav-left">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="fb-nav-badge">{item.badge}</span>
                )}
                <ChevronRight size={14} className="fb-nav-arrow" />
              </button>
            );
          })}

          <button className="fb-logout-btn" onClick={handleLogoutClick}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};


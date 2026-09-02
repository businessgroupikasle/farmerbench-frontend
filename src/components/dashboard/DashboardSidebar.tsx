import React from 'react';
import {
  LayoutDashboard,
  Package,
  Heart,
  Star,
  MapPin,
  Shield,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { User } from '@formerbench/shared';

interface DashboardSidebarProps {
  user: User | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  ordersCount: number;
  wishlistCount: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  activeTab,
  onSelectTab,
  onLogout,
  ordersCount = 0,
  wishlistCount = 0,
}) => {
  const displayName = user?.name || 'Farmer Member';
  const displayPhone = user?.phone || user?.email || 'Contact Info';
  const avatarSrc = user?.avatarUrl;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={18} />, badge: ordersCount },
    // { id: 'tracking', label: 'Track Orders', icon: <Truck size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} />, badge: wishlistCount },
    // { id: 'saved', label: 'Saved for Later', icon: <Bookmark size={18} /> },
    { id: 'reviews', label: 'My Reviews', icon: <Star size={18} /> },
    // { id: 'bookings', label: 'Service Bookings', icon: <CalendarCheck size={18} />, badge: bookingsCount },
    // { id: 'crop-doctor', label: 'Crop Doctor Requests', icon: <Stethoscope size={18} />, badge: doctorRequestsCount },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'profile', label: 'Profile & Security', icon: <Shield size={18} /> },
    // { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <aside className="fb-sidebar">
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
              onClick={() => onSelectTab(item.id)}
            >
              <div className="fb-nav-left">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="fb-nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}

        <button className="fb-logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

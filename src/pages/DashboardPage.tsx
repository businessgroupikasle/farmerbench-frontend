import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Package, User as UserIcon, Lock, ExternalLink, Calendar } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, changePassword, isUpdatingProfile, isChangingPassword } = useAuth();
  const { data: orders = [], isLoading: isOrdersLoading } = useOrders();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'security'>('orders');

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('formerbench_auth_token')) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders' || tab === 'profile' || tab === 'security') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, avatarUrl: avatarUrl || null });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await changePassword({ currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
  };

  const storedUser = (() => {
    try {
      const d = localStorage.getItem('formerbench_auth_user');
      return d ? JSON.parse(d) : null;
    } catch {
      return null;
    }
  })();

  const activeUser = user || storedUser;

  if (!activeUser) {
    return <LoadingSpinner fullPage message="Loading your dashboard..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'var(--brand-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {activeUser.avatarUrl ? (
            <img src={activeUser.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            activeUser.name[0]
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{activeUser.name}</h1>
            <Badge variant={activeUser.role === 'ADMIN' ? 'primary' : 'neutral'}>{activeUser.role}</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activeUser.email}</p>
        </div>

        {activeUser.role === 'ADMIN' && (
          <div style={{ marginLeft: 'auto' }}>
            <Link
              to="/admin"
              className="btn btn-primary"
              style={{
                backgroundColor: '#0F4726',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700,
              }}
            >
              Open FarmerBench Admin Portal →
            </Link>
          </div>
        )}
      </div>

      {/* Tabs Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Navigation Sidebar */}
        <aside className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            onClick={() => setActiveTab('orders')}
            className="btn btn-secondary btn-sm"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'orders' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--brand-primary)' : 'var(--text-primary)',
              border: 'none',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              padding: '0.65rem 0.85rem',
            }}
          >
            <Package size={17} /> Order History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="btn btn-secondary btn-sm"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'profile' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--brand-primary)' : 'var(--text-primary)',
              border: 'none',
              fontWeight: activeTab === 'profile' ? 700 : 500,
              padding: '0.65rem 0.85rem',
            }}
          >
            <UserIcon size={17} /> Profile Details
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className="btn btn-secondary btn-sm"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'security' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'security' ? 'var(--brand-primary)' : 'var(--text-primary)',
              border: 'none',
              fontWeight: activeTab === 'security' ? 700 : 500,
              padding: '0.65rem 0.85rem',
            }}
          >
            <Lock size={17} /> Password & Security
          </button>
        </aside>

        {/* Tab Content */}
        <main>
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order History</h2>

              {isOrdersLoading ? (
                <LoadingSpinner message="Fetching your orders..." />
              ) : orders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="When you purchase items, your orders will appear here with live tracking."
                  actionText="Browse Products"
                  onAction={() => navigate('/products')}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {orders.map((ord) => (
                    <div key={ord.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--border-color)',
                          paddingBottom: '0.75rem',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>
                            Order #{ord.id.slice(0, 8)}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Calendar size={14} />
                            {new Date(ord.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Badge
                            variant={
                              ord.orderStatus === 'DELIVERED'
                                ? 'success'
                                : ord.orderStatus === 'CANCELLED'
                                ? 'danger'
                                : 'primary'
                            }
                          >
                            {ord.orderStatus}
                          </Badge>
                          <Link to={`/order-confirmation/${ord.id}`}>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem' }}
                            >
                              <ExternalLink size={14} /> Receipt
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {ord.items.map((it) => (
                          <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {it.imageUrl && (
                                <img
                                  src={it.imageUrl}
                                  alt=""
                                  style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{it.title}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {it.quantity}</p>
                              </div>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                              ${(it.price * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div
                        style={{
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payment: {ord.paymentMethod}</span>
                        <span style={{ fontSize: '1.1rem', color: 'var(--brand-primary)' }}>
                          Total: ${ord.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>Profile Information</h2>

              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '520px' }}>
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address"
                  value={activeUser.email}
                  disabled
                  helperText="Email cannot be changed directly."
                />

                <Input
                  label="Avatar URL (Optional)"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isUpdatingProfile}
                  style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                >
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>Change Password</h2>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '440px' }}>
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Must be at least 6 characters."
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isChangingPassword}
                  style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                >
                  Update Password
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

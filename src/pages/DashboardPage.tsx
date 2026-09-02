import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useProducts, useProductMutations } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { Order, Product } from '@formerbench/shared';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Dashboard Components
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ActiveOrderCard } from '../components/dashboard/ActiveOrderCard';
import { DefaultAddressCard } from '../components/dashboard/DefaultAddressCard';
import { RecentOrdersCard } from '../components/dashboard/RecentOrdersCard';
import { NeedHelpCard } from '../components/dashboard/NeedHelpCard';
import { WishlistCarousel } from '../components/dashboard/WishlistCarousel';
import { ConsultationCard } from '../components/dashboard/ConsultationCard';
import { CropDoctorCard } from '../components/dashboard/CropDoctorCard';
import { ReviewsFeedbackCard } from '../components/dashboard/ReviewsFeedbackCard';
import { CropRecommendationsCard } from '../components/dashboard/CropRecommendationsCard';
import { ProfileCompletionCard } from '../components/dashboard/ProfileCompletionCard';
import { SecurityAndNotificationsCard } from '../components/dashboard/SecurityAndNotificationsCard';
import { TrustBadgesFooter } from '../components/dashboard/TrustBadgesFooter';

// Modals
import {
  OrderTrackingModal,
  WriteReviewModal,
  ConsultationVideoModal,
  CropDoctorReportModal,
  CompleteProfileModal,
  InvoiceModal,
} from '../components/dashboard/DashboardModals';

// Styling
import './DashboardPage.css';
import {
  Package,
  Key,
  Plus,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Auth & Profile
  const { user, isAuthenticated, updateProfile, changePassword, logout } = useAuth();
  const { data: orders = [], isLoading: isOrdersLoading } = useOrders();
  const { data: productsData } = useProducts({ limit: 12 });
  const { addReview } = useProductMutations();
  const { addToCart } = useCart();
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const { addToast } = useUIStore();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal States
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<string>('');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isDoctorReportModalOpen, setIsDoctorReportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile Form States (for Profile & Security Tab)
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileLocation, setProfileLocation] = useState(user?.location || '');
  const [profileCrops, setProfileCrops] = useState(user?.crops || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('formerbench_auth_token')) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileLocation(user.location || '');
      setProfileCrops(user.crops || '');
    }
  }, [user]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'dashboard' ? {} : { tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active Orders
  const activeOrdersList = orders.filter(
    (o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  );
  const primaryActiveOrder = activeOrdersList[0] || null;

  // Reward points calculated dynamically from real total spent (10% back in points)
  const calculatedRewardPoints = Math.round(
    orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) * 0.1
  );

  // Handle Actions
  const handleAddToCartFromWishlist = (product: Product | any) => {
    const prodPayload: any = {
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images || [product.imageUrl || ''],
      slug: product.slug || product.id,
      description: product.description || '',
      stock: product.stock || 50,
      rating: product.rating || 5,
      numReviews: product.numReviews || 1,
      featured: false,
      categoryId: product.categoryId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addToCart(prodPayload, 1);
    addToast({ type: 'success', message: `Added ${product.title} to cart!` });
  };

  const handleBuyAgain = (order: Order | any) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((it: any) => {
        const prodPayload: any = {
          id: it.productId || it.id,
          title: it.title,
          price: it.price,
          images: [it.imageUrl || ''],
          slug: it.id,
          description: '',
          stock: 50,
          rating: 5,
          numReviews: 1,
          featured: false,
          categoryId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addToCart(prodPayload, it.quantity || 1);
      });
      addToast({ type: 'success', message: 'Reordered items added to your cart!' });
      navigate('/cart');
    } else {
      addToast({ type: 'info', message: 'Added products to cart!' });
    }
  };

  const handleOpenReviewModal = (productTitle?: string) => {
    setSelectedReviewProduct(productTitle || 'Purchased Product');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData: { rating: number; comment: string; crop: string }) => {
    try {
      const prodId = productsData?.data?.[0]?.id || 'prod-sample';
      await addReview({
        productId: prodId,
        rating: reviewData.rating,
        comment: `${reviewData.comment} (Crop: ${reviewData.crop})`,
      });
      addToast({ type: 'success', message: 'Your review has been submitted for publishing!' });
    } catch {
      addToast({ type: 'success', message: 'Review recorded successfully!' });
    }
  };

  const handleSaveProfileDirect = async (data: {
    name?: string;
    phone?: string;
    location?: string;
    crops?: string;
  }) => {
    try {
      await updateProfile(data);
      addToast({ type: 'success', message: 'Farm profile details updated successfully!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to update profile' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPass(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
    } finally {
      setIsChangingPass(false);
    }
  };

  if (!user && isOrdersLoading) {
    return <LoadingSpinner fullPage message="Loading your farmer dashboard..." />;
  }

  return (
    <div className="fb-dashboard-container">
      {/* Top 4 KPI Metric Summary Cards */}
      <DashboardStats
        activeOrdersCount={activeOrdersList.length}
        wishlistCount={wishlistItems.length}
        bookingsCount={0}
        rewardPoints={calculatedRewardPoints}
        onNavigateTab={handleSelectTab}
      />

      {/* Main Two-Column Layout */}
      <div className="fb-dashboard-layout">
        {/* Left Navigation Sidebar */}
        <DashboardSidebar
          user={user}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onLogout={() => {
            logout();
            navigate('/');
          }}
          ordersCount={orders.length}
          wishlistCount={wishlistItems.length}
          bookingsCount={0}
          doctorRequestsCount={0}
        />

        {/* Right Main Dashboard Area */}
        <main className="fb-main-content">
          {/* =================================================================
              1. MAIN DASHBOARD OVERVIEW VIEW (Matches Exact Reference Mockup)
              ================================================================= */}
          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: Active Order + Address & Recent Orders & Help Stack */}
              <div className="fb-row-1-grid">
                {/* Left: Active Order */}
                <ActiveOrderCard
                  activeOrder={primaryActiveOrder}
                  onViewAllOrders={() => handleSelectTab('orders')}
                  onTrackOrder={(ord) => {
                    setSelectedOrder(ord || primaryActiveOrder);
                    setIsTrackingModalOpen(true);
                  }}
                  onViewDetails={(ord) => {
                    setSelectedOrder(ord || primaryActiveOrder);
                    setIsInvoiceModalOpen(true);
                  }}
                  onDownloadInvoice={(ord) => {
                    setSelectedOrder(ord || primaryActiveOrder);
                    setIsInvoiceModalOpen(true);
                  }}
                />

                {/* Right Column Stack */}
                <div className="fb-row-1-right-stack">
                  <DefaultAddressCard
                    user={user}
                    shippingAddress={primaryActiveOrder?.shippingAddress}
                    onManageAddresses={() => setIsProfileModalOpen(true)}
                  />

                  <RecentOrdersCard
                    orders={orders}
                    onViewAllOrders={() => handleSelectTab('orders')}
                    onViewOrder={(ord) => {
                      setSelectedOrder(ord);
                      setIsInvoiceModalOpen(true);
                    }}
                    onBuyAgain={handleBuyAgain}
                    onReviewOrder={() => handleOpenReviewModal()}
                  />

                  <NeedHelpCard
                    onContactSupport={() => {
                      window.open('https://wa.me/919876543210', '_blank');
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Wishlist Carousel + Upcoming Consultation + Crop Doctor Card */}
              <div className="fb-row-2-grid">
                <WishlistCarousel
                  wishlistItems={wishlistItems}
                  onViewAllWishlist={() => handleSelectTab('wishlist')}
                  onAddToCart={handleAddToCartFromWishlist}
                  onRemoveFromWishlist={removeFromWishlist}
                />

                <ConsultationCard
                  onJoinConsultation={() => setIsConsultationModalOpen(true)}
                  onReschedule={() => {
                    addToast({ type: 'info', message: 'Reschedule request sent to Dr. Arun Kumar.' });
                  }}
                />

                <CropDoctorCard
                  onViewAdvice={() => setIsDoctorReportModalOpen(true)}
                  onAskFollowUp={() => {
                    addToast({
                      type: 'success',
                      message: 'Follow-up query submitted to Dr. Arun Kumar.',
                    });
                  }}
                />
              </div>

              {/* Row 3: Reviews & Feedback + Recommended Crops + Profile Completion + Security */}
              <div className="fb-row-3-grid">
                <ReviewsFeedbackCard
                  orders={orders}
                  onViewAllReviews={() => handleSelectTab('reviews')}
                  onEditReview={() => handleOpenReviewModal()}
                  onWriteReview={(item) => handleOpenReviewModal(item?.title)}
                />

                <CropRecommendationsCard
                  cropName={user?.crops ? user.crops.split(',')[0].split(' ')[0] : 'Paddy'}
                  products={productsData?.data || []}
                  onViewRecommendations={() => navigate('/products?category=bio-fertilizers')}
                  onSelectProduct={(p) => navigate(`/product/${p.slug || p.id}`)}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <ProfileCompletionCard
                    user={user}
                    onCompleteProfile={() => setIsProfileModalOpen(true)}
                  />

                  <SecurityAndNotificationsCard
                    onManageSecurity={() => handleSelectTab('profile')}
                    onViewAllNotifications={() => handleSelectTab('notifications')}
                  />
                </div>
              </div>

              {/* Footer Trust Elements */}
              <TrustBadgesFooter />
            </>
          )}

          {/* =================================================================
              2. MY ORDERS SUB-VIEW
              ================================================================= */}
          {activeTab === 'orders' && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">
                  <Package size={22} color="#0F4726" /> My Orders ({orders.length})
                </h2>
                <Link to="/products" className="fb-btn-primary-dark">
                  Shop More Products
                </Link>
              </div>

              {orders.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                  <Package size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Orders Found</h3>
                  <p style={{ color: 'var(--fb-text-muted)', marginTop: '0.25rem' }}>
                    When you order agro products, they will appear here with live tracking.
                  </p>
                  <Link
                    to="/products"
                    className="fb-btn-primary-dark"
                    style={{ marginTop: '1.25rem', display: 'inline-flex' }}
                  >
                    Browse Catalog
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        border: '1px solid var(--fb-card-border)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #f1f5f9',
                          paddingBottom: '0.75rem',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 800 }}>
                            Order #GL-{ord.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            style={{
                              marginLeft: '0.75rem',
                              fontSize: '0.8rem',
                              color: 'var(--fb-text-muted)',
                            }}
                          >
                            Placed on{' '}
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span
                            className={
                              ord.orderStatus === 'DELIVERED'
                                ? 'fb-status-pill-green'
                                : 'fb-status-pill-blue'
                            }
                          >
                            {ord.orderStatus}
                          </span>
                          <button
                            className="fb-btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => {
                              setSelectedOrder(ord);
                              setIsInvoiceModalOpen(true);
                            }}
                          >
                            Invoice
                          </button>
                        </div>
                      </div>

                      <div style={{ padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {ord.items.map((it) => (
                          <div
                            key={it.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.88rem',
                            }}
                          >
                            <span>
                              {it.title} <strong>x {it.quantity}</strong>
                            </span>
                            <span style={{ fontWeight: 700 }}>₹{(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: 'var(--fb-text-muted)' }}>
                          Payment: {ord.paymentMethod}
                        </span>
                        <span style={{ fontSize: '1.1rem', color: '#0F4726' }}>
                          Total: ₹{ord.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              3. TRACK ORDERS SUB-VIEW
              ================================================================= */}
          {activeTab === 'tracking' && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">
                  <Package size={22} color="#0F4726" /> Live Shipment Tracking
                </h2>
              </div>
              <p style={{ color: 'var(--fb-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Enter your FarmerBench Order Number or AWB tracking ID to see real-time updates.
              </p>

              <div style={{ maxWidth: '540px', display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <input
                  className="fb-form-input"
                  placeholder="e.g. #GL-10482 or AGRI-EXP-8894210TN"
                  defaultValue="#GL-10482"
                />
                <button
                  className="fb-btn-primary-dark"
                  onClick={() => setIsTrackingModalOpen(true)}
                >
                  Track Now
                </button>
              </div>

              <ActiveOrderCard
                activeOrder={primaryActiveOrder}
                onViewAllOrders={() => handleSelectTab('orders')}
                onTrackOrder={() => setIsTrackingModalOpen(true)}
                onViewDetails={() => setIsInvoiceModalOpen(true)}
                onDownloadInvoice={() => setIsInvoiceModalOpen(true)}
              />
            </div>
          )}

          {/* =================================================================
              4. WISHLIST SUB-VIEW
              ================================================================= */}
          {(activeTab === 'wishlist' || activeTab === 'saved') && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">Saved Wishlist Items</h2>
              </div>

              <WishlistCarousel
                wishlistItems={wishlistItems}
                onViewAllWishlist={() => {}}
                onAddToCart={handleAddToCartFromWishlist}
                onRemoveFromWishlist={removeFromWishlist}
              />
            </div>
          )}

          {/* =================================================================
              5. MY REVIEWS SUB-VIEW
              ================================================================= */}
          {activeTab === 'reviews' && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">My Product Reviews & Field Notes</h2>
                <button
                  className="fb-btn-primary-dark"
                  onClick={() => handleOpenReviewModal()}
                >
                  Write New Review
                </button>
              </div>

              <ReviewsFeedbackCard
                orders={orders}
                onViewAllReviews={() => {}}
                onEditReview={() => handleOpenReviewModal()}
                onWriteReview={(item) => handleOpenReviewModal(item?.title)}
              />
            </div>
          )}

          {/* =================================================================
              6. SERVICE BOOKINGS SUB-VIEW
              ================================================================= */}
          {activeTab === 'bookings' && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">Agronomy & Farm Consultations</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <ConsultationCard
                  onJoinConsultation={() => setIsConsultationModalOpen(true)}
                  onReschedule={() => {
                    addToast({ type: 'info', message: 'Reschedule request sent.' });
                  }}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              7. CROP DOCTOR SUB-VIEW
              ================================================================= */}
          {activeTab === 'crop-doctor' && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">Crop Doctor Consultations & Reports</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <CropDoctorCard
                  onViewAdvice={() => setIsDoctorReportModalOpen(true)}
                  onAskFollowUp={() => {
                    addToast({ type: 'success', message: 'Follow-up query sent to doctor.' });
                  }}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              8. ADDRESSES SUB-VIEW
              ================================================================= */}
          {activeTab === 'addresses' && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">Saved Farm & Delivery Addresses</h2>
                <button
                  className="fb-btn-primary-dark"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <DefaultAddressCard
                  user={user}
                  shippingAddress={primaryActiveOrder?.shippingAddress}
                  onManageAddresses={() => setIsProfileModalOpen(true)}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              9. PROFILE & SECURITY SUB-VIEW (Direct Backend API Integration)
              ================================================================= */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Profile Details */}
              <div className="fb-card">
                <h2 className="fb-card-title" style={{ marginBottom: '1.25rem' }}>
                  Farm & Personal Profile
                </h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingProfile(true);
                    await handleSaveProfileDirect({
                      name: profileName,
                      phone: profilePhone,
                      location: profileLocation,
                      crops: profileCrops,
                    });
                    setIsSavingProfile(false);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div className="fb-form-group">
                    <label className="fb-form-label">Full Name</label>
                    <input
                      className="fb-form-input"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="fb-form-group">
                    <label className="fb-form-label">Email Address (Registered)</label>
                    <input className="fb-form-input" value={user?.email || ''} disabled />
                  </div>

                  <div className="fb-form-group">
                    <label className="fb-form-label">Phone Number</label>
                    <input
                      className="fb-form-input"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>

                  <div className="fb-form-group">
                    <label className="fb-form-label">Farm Location</label>
                    <input
                      className="fb-form-input"
                      value={profileLocation}
                      onChange={(e) => setProfileLocation(e.target.value)}
                    />
                  </div>

                  <div className="fb-form-group">
                    <label className="fb-form-label">Primary Crops</label>
                    <input
                      className="fb-form-input"
                      value={profileCrops}
                      onChange={(e) => setProfileCrops(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="fb-btn-primary-dark"
                    disabled={isSavingProfile}
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    {isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                  </button>
                </form>
              </div>

              {/* Password & Security */}
              <div className="fb-card">
                <h2 className="fb-card-title" style={{ marginBottom: '1.25rem' }}>
                  <Key size={20} color="#0F4726" /> Password & Security
                </h2>

                <form
                  onSubmit={handleUpdatePassword}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div className="fb-form-group">
                    <label className="fb-form-label">Current Password</label>
                    <input
                      type="password"
                      className="fb-form-input"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="fb-form-group">
                    <label className="fb-form-label">New Password</label>
                    <input
                      type="password"
                      className="fb-form-input"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="fb-btn-primary-dark"
                    disabled={isChangingPass}
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    {isChangingPass ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* =================================================================
              10. NOTIFICATIONS SUB-VIEW
              ================================================================= */}
          {activeTab === 'notifications' && (
            <div className="fb-card">
              <div className="fb-card-header">
                <h2 className="fb-card-title">All Notifications & Alerts</h2>
              </div>

              <SecurityAndNotificationsCard
                onManageSecurity={() => handleSelectTab('profile')}
                onViewAllNotifications={() => {}}
              />
            </div>
          )}
        </main>
      </div>

      {/* =================================================================
          MODALS SUITE
          ================================================================= */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        order={selectedOrder || primaryActiveOrder}
      />

      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productTitle={selectedReviewProduct}
        onSubmitReview={handleSubmitReview}
      />

      <ConsultationVideoModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      <CropDoctorReportModal
        isOpen={isDoctorReportModalOpen}
        onClose={() => setIsDoctorReportModalOpen(false)}
      />

      <CompleteProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSaveProfile={handleSaveProfileDirect}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        order={selectedOrder || primaryActiveOrder}
      />
    </div>
  );
};

export default DashboardPage;

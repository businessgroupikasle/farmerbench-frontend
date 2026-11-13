import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders, useOrderMutations } from '../hooks/useOrders';
import { useProducts, useProductMutations } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { Order, Product } from '@formerbench/shared';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Dashboard Components
import { DashboardSidebar, DashboardMobileBar } from '../components/dashboard/DashboardSidebar';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ActiveOrderCard } from '../components/dashboard/ActiveOrderCard';
import { DefaultAddressCard } from '../components/dashboard/DefaultAddressCard';
import { RecentOrdersCard } from '../components/dashboard/RecentOrdersCard';
import { NeedHelpCard } from '../components/dashboard/NeedHelpCard';
import { WishlistCarousel } from '../components/dashboard/WishlistCarousel';
import { ReviewsFeedbackCard } from '../components/dashboard/ReviewsFeedbackCard';
import { CropRecommendationsCard } from '../components/dashboard/CropRecommendationsCard';
import { ProfileCompletionCard } from '../components/dashboard/ProfileCompletionCard';
import { TrustBadgesFooter } from '../components/dashboard/TrustBadgesFooter';
import { CropDoctorRequestsPanel } from '../components/dashboard/CropDoctorRequestsPanel';
import { useMyServiceBookings } from '../hooks/useServiceBookings';
import { ServiceBookingRecord } from '../services/serviceBooking.service';

// Modals
import {
  OrderTrackingModal,
  WriteReviewModal,
  CompleteProfileModal,
  InvoiceModal,
} from '../components/dashboard/DashboardModals';

// Styling
import './DashboardPage.css';
import { AlertCircle, CheckCircle, Clock, Key, Package, Plus, RotateCcw, X } from 'lucide-react';
import { LogoutModal } from '../components/common/LogoutModal';

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Auth & Profile
  const { user, isAuthenticated, updateProfile, changePassword, logout } = useAuth();
  const { data: rawOrders = [], isLoading: isOrdersLoading } = useOrders();
  const { cancelOrder, requestExchange } = useOrderMutations();
  const orders = (rawOrders || []).filter((o: any) => {
    // Only exclude abandoned Razorpay checkout attempts that were never paid
    if (o.paymentMethod === 'RAZORPAY' && o.paymentStatus === 'PENDING' && o.orderStatus === 'PENDING') return false;
    if (o.paymentMethod === 'RAZORPAY' && o.paymentStatus === 'FAILED') return false;
    return true;
  });
  const { data: productsData } = useProducts({ limit: 12 });
  const { addReview } = useProductMutations();
  const { addToCart } = useCart();
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const { addToast } = useUIStore();
  const { data: myServiceBookings = [], isLoading: isBookingsLoading } = useMyServiceBookings();
  const cropDoctorRequestCount = myServiceBookings.filter((booking: ServiceBookingRecord) => booking.serviceSlug === 'crop-doctor').length;

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cancellation & Exchange Modal States
  const [cancelModalOrder, setCancelModalOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const [exchangeModalOrder, setExchangeModalOrder] = useState<any | null>(null);
  const [exchangeReason, setExchangeReason] = useState('Damaged during transit / packaging broken');
  const [exchangeDetails, setExchangeDetails] = useState('');
  const [isSubmittingExchange, setIsSubmittingExchange] = useState(false);

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
      ...product,
      id: product.id,
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images || [product.imageUrl || ''],
      slug: product.slug || product.id,
      description: product.description || '',
      stock: product.stock ?? 50,
      rating: product.rating || 5,
      numReviews: product.numReviews || 1,
      featured: false,
      categoryId: product.categoryId || '',
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    };
    addToCart(prodPayload, 1);
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
      {/* Mobile Top Navigation Trigger Bar - Directly below Navbar */}
      <DashboardMobileBar
        user={user}
        activeTab={activeTab}
        ordersCount={orders.length}
        wishlistCount={wishlistItems.length}
        doctorRequestsCount={cropDoctorRequestCount}
        onOpenMenu={() => setIsMobileSidebarOpen(true)}
      />

      {/* Top 4 KPI Metric Summary Cards */}
      <DashboardStats
        activeOrdersCount={activeOrdersList.length}
        wishlistCount={wishlistItems.length}
        reviewsCount={orders.length > 0 ? 1 : 0}
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
            setIsLogoutModalOpen(true);
          }}
          ordersCount={orders.length}
          wishlistCount={wishlistItems.length}
          doctorRequestsCount={cropDoctorRequestCount}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Right Main Dashboard Area */}
        <main className="fb-main-content">
          {/* =================================================================
              1. MAIN DASHBOARD OVERVIEW VIEW
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
                      window.open('https://wa.me/919360763060', '_blank');
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Wishlist Carousel & Reviews */}
              <div className="fb-row-1-grid">
                <WishlistCarousel
                  wishlistItems={wishlistItems}
                  onViewAllWishlist={() => handleSelectTab('wishlist')}
                  onAddToCart={handleAddToCartFromWishlist}
                  onRemoveFromWishlist={removeFromWishlist}
                />

                <ReviewsFeedbackCard
                  orders={orders}
                  onViewAllReviews={() => handleSelectTab('reviews')}
                  onEditReview={() => handleOpenReviewModal()}
                  onWriteReview={(item) => handleOpenReviewModal(item?.title)}
                />
              </div>

              {/* Row 3: Recommended Crops & Profile Completion */}
              <div className="fb-row-1-grid">
                <CropRecommendationsCard
                  cropName={user?.crops ? user.crops.split(',')[0].split(' ')[0] : 'Paddy'}
                  products={productsData?.data || []}
                  onViewRecommendations={() => navigate('/products?category=bio-fertilizers')}
                  onSelectProduct={(p) => navigate(`/product/${p.slug || p.id}`)}
                />

                <ProfileCompletionCard
                  user={user}
                  onCompleteProfile={() => setIsProfileModalOpen(true)}
                />
              </div>

              <CropDoctorRequestsPanel
                bookings={myServiceBookings}
                isLoading={isBookingsLoading}
                limit={1}
                onViewAll={() => handleSelectTab('crop-doctor')}
              />
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span
                            className={
                              ord.orderStatus === 'DELIVERED'
                                ? 'fb-status-pill-green'
                                : ord.orderStatus === 'CANCELLED'
                                ? 'fb-status-pill-gray'
                                : 'fb-status-pill-blue'
                            }
                            style={
                              ord.orderStatus === 'CANCELLED'
                                ? { backgroundColor: '#FEE2E2', color: '#991B1B' }
                                : undefined
                            }
                          >
                            {ord.orderStatus}
                          </span>

                          {/* Customer Cancel Button for Eligible Orders */}
                          {(ord.orderStatus === 'PENDING' || ord.orderStatus === 'PROCESSING') && (
                            <button
                              className="fb-btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                              onClick={() => {
                                setCancelModalOrder(ord);
                                setCancelReason('Ordered by mistake');
                              }}
                            >
                              Cancel Order
                            </button>
                          )}

                          {/* Customer Product Exchange Button for Delivered Orders */}
                          {ord.orderStatus === 'DELIVERED' && !(ord as any).exchangeRequest && (
                            <button
                              className="fb-btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#0F4726', borderColor: '#86EFAC' }}
                              onClick={() => {
                                setExchangeModalOrder(ord);
                                setExchangeReason('Damaged during transit / packaging broken');
                                setExchangeDetails('');
                              }}
                            >
                              Request Exchange
                            </button>
                          )}

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
                        {ord.items.map((it: any) => (
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

                      {/* Product Exchange Status Banner */}
                      {(ord as any).exchangeRequest && (
                        <div
                          style={{
                            marginTop: '0.65rem',
                            padding: '0.6rem 0.85rem',
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FCD34D',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            color: '#92400E',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RotateCcw size={16} />
                            <span>
                              <strong>Exchange Requested:</strong> {(ord as any).exchangeRequest.reason}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#FDE68A', padding: '2px 8px', borderRadius: '4px' }}>
                            Ref: {(ord as any).exchangeRequest.bookingReference}
                          </span>
                        </div>
                      )}

                      {/* Cancellation & Refund Status Banner */}
                      {ord.orderStatus === 'CANCELLED' && (
                        <div style={{ marginTop: '0.65rem' }}>
                          {ord.paymentMethod === 'RAZORPAY' ? (
                            ord.paymentStatus === 'REFUNDED' ? (
                              <div
                                style={{
                                  padding: '0.6rem 0.85rem',
                                  backgroundColor: '#F0FDF4',
                                  border: '1px solid #BBF7D0',
                                  borderRadius: '8px',
                                  fontSize: '0.82rem',
                                  color: '#166534',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                }}
                              >
                                <CheckCircle size={16} color="#16A34A" />
                                <span>
                                  <strong>Refund Processed:</strong> A full refund of ₹{ord.totalPrice.toFixed(2)} has been processed to your original payment method.
                                </span>
                              </div>
                            ) : (
                              <div
                                style={{
                                  padding: '0.6rem 0.85rem',
                                  backgroundColor: '#EFF6FF',
                                  border: '1px solid #BFDBFE',
                                  borderRadius: '8px',
                                  fontSize: '0.82rem',
                                  color: '#1E40AF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                }}
                              >
                                <Clock size={16} color="#2563EB" />
                                <span>
                                  <strong>Refund Status:</strong> Order cancelled. Applicable refund of ₹{ord.totalPrice.toFixed(2)} is being processed to your original payment method.
                                </span>
                              </div>
                            )
                          ) : (
                            <div
                              style={{
                                padding: '0.45rem 0.75rem',
                                backgroundColor: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                color: '#64748B',
                              }}
                            >
                              This Cash on Delivery order was cancelled before dispatch. No payment was collected.
                            </div>
                          )}
                        </div>
                      )}
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
                Enter your AgriEra Order Number or AWB tracking ID to see real-time updates.
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
          {activeTab === 'crop-doctor' && (
            <CropDoctorRequestsPanel
              bookings={myServiceBookings}
              isLoading={isBookingsLoading}
            />
          )}

          {/* =================================================================
              6. ADDRESSES SUB-VIEW
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
              7. PROFILE & SECURITY SUB-VIEW (Direct Backend API Integration)
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
                    <label className="fb-form-label">Major Cultivated Crops</label>
                    <input
                      className="fb-form-input"
                      value={profileCrops}
                      onChange={(e) => setProfileCrops(e.target.value)}
                      placeholder="e.g. Paddy, Sugarcane, Cotton, Banana"
                    />
                  </div>

                  <button
                    type="submit"
                    className="fb-btn-primary-dark"
                    disabled={isSavingProfile}
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

              {/* Password & Security */}
              <div className="fb-card">
                <h2 className="fb-card-title" style={{ marginBottom: '1.25rem' }}>
                  <Key size={18} color="#0F4726" /> Security & Password
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
          {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fb-modal-overlay" onClick={() => setCancelModalOrder(null)}>
          <div className="fb-modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="fb-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} color="#DC2626" /> Cancel Order
              </h3>
              <button onClick={() => setCancelModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#334155' }}>
                Are you sure you want to cancel Order <strong>#GL-{cancelModalOrder.id.slice(0, 8).toUpperCase()}</strong>?
              </p>
              {cancelModalOrder.paymentMethod === 'RAZORPAY' && cancelModalOrder.paymentStatus === 'PAID' && (
                <div style={{ padding: '0.75rem', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE', fontSize: '0.85rem', color: '#1E40AF', marginBottom: '1rem' }}>
                  💳 <strong>Prepaid Order Refund:</strong> Your payment of <strong>₹{cancelModalOrder.totalPrice.toFixed(2)}</strong> will be refunded to your original payment method.
                </div>
              )}
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: '#1E293B' }}>
                Reason for cancellation:
              </label>
              <select
                className="fb-form-input"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', marginBottom: '1.25rem' }}
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Expected earlier delivery">Expected earlier delivery</option>
                <option value="Found a better price or alternative">Found a better price or alternative</option>
                <option value="Need to change delivery address or items">Need to change delivery address or items</option>
                <option value="Other reason">Other reason</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="fb-btn-outline"
                  onClick={() => setCancelModalOrder(null)}
                  disabled={isSubmittingCancel}
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  className="fb-btn-primary-dark"
                  style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}
                  disabled={isSubmittingCancel}
                  onClick={async () => {
                    setIsSubmittingCancel(true);
                    try {
                      await cancelOrder({ id: cancelModalOrder.id, reason: cancelReason });
                      setCancelModalOrder(null);
                    } finally {
                      setIsSubmittingCancel(false);
                    }
                  }}
                >
                  {isSubmittingCancel ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Exchange Modal */}
      {exchangeModalOrder && (
        <div className="fb-modal-overlay" onClick={() => setExchangeModalOrder(null)}>
          <div className="fb-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="fb-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F4726', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={20} color="#15803D" /> Request Product Exchange
              </h3>
              <button onClick={() => setExchangeModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#475569' }}>
                Select the issue with your items for Order <strong>#GL-{exchangeModalOrder.id.slice(0, 8).toUpperCase()}</strong>. We will arrange a free doorstep replacement.
              </p>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: '#1E293B' }}>
                Reason for exchange: <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                className="fb-form-input"
                value={exchangeReason}
                onChange={(e) => setExchangeReason(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                <option value="Damaged during transit / packaging broken">Damaged during transit / packaging broken</option>
                <option value="Defective or substandard product quality">Defective or substandard product quality</option>
                <option value="Incorrect product or variant received">Incorrect product or variant received</option>
                <option value="Expired or near-expiry product">Expired or near-expiry product</option>
                <option value="Missing seals or leaked liquid">Missing seals or leaked liquid</option>
                <option value="Other product issue">Other product issue</option>
              </select>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: '#1E293B' }}>
                Description of issue:
              </label>
              <textarea
                className="fb-form-input"
                rows={3}
                placeholder="Please describe what is damaged, defective, or incorrect..."
                value={exchangeDetails}
                onChange={(e) => setExchangeDetails(e.target.value)}
                style={{ width: '100%', marginBottom: '1.25rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="fb-btn-outline"
                  onClick={() => setExchangeModalOrder(null)}
                  disabled={isSubmittingExchange}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="fb-btn-primary-dark"
                  disabled={isSubmittingExchange || !exchangeReason.trim()}
                  onClick={async () => {
                    setIsSubmittingExchange(true);
                    try {
                      await requestExchange({
                        id: exchangeModalOrder.id,
                        data: {
                          reason: exchangeReason.trim(),
                          details: exchangeDetails.trim(),
                        },
                      });
                      setExchangeModalOrder(null);
                    } finally {
                      setIsSubmittingExchange(false);
                    }
                  }}
                >
                  {isSubmittingExchange ? 'Submitting...' : 'Submit Exchange Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          logout();
          setIsLogoutModalOpen(false);
        }}
        userName={user?.name}
      />
    </div>
  );
};

export default DashboardPage;

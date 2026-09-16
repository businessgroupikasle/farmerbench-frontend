import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/Toast';
import { ChatWidget } from './components/chat/ChatWidget';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PageLoader } from './components/common/PageLoader';
import { useThemeStore } from './store/themeStore';
import { LanguageProvider } from './context/LanguageContext';
import { AlertTriangle, Clock3, Sprout } from 'lucide-react';

// Keep the landing page in the initial bundle; load secondary pages on demand.
import { HomePage } from './pages/HomePage';
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then((module) => ({ default: module.OrderConfirmationPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const FarmDevelopmentPage = lazy(() => import('./pages/FarmDevelopmentPage'));
const WellDevelopmentPage = lazy(() => import('./pages/WellDevelopmentPage'));
const DripIrrigationPage = lazy(() => import('./pages/DripIrrigationPage'));
const FarmConsultancyPage = lazy(() => import('./pages/FarmConsultancyPage'));
const CropDoctorPage = lazy(() => import('./pages/CropDoctorPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
import { useSocketSync } from './socket';

interface MaintenanceSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  storeName: string;
  businessHours: string;
  supportEmail: string;
}

const getMaintenanceSettings = (): MaintenanceSettings => {
  const defaults: MaintenanceSettings = {
    maintenanceMode: false,
    maintenanceMessage: 'We are currently upgrading our warehouse systems. Back shortly!',
    storeName: 'AgriEra Agricultural Commerce & Services',
    businessHours: 'Mon - Sat: 8:00 AM - 8:00 PM IST',
    supportEmail: 'support@AgriEra.agri',
  };
  try {
    const saved = localStorage.getItem('formerbench_store_settings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
};

const MaintenanceScreen: React.FC<{ settings: MaintenanceSettings }> = ({ settings }) => (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: 'linear-gradient(145deg, #f4fbf2 0%, #ffffff 48%, #eef7e9 100%)' }}>
    <section style={{ width: 'min(680px, 100%)', padding: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center', borderRadius: '28px', background: 'rgba(255,255,255,.94)', border: '1px solid #d9e9d4', boxShadow: '0 24px 70px rgba(20,70,35,.12)' }}>
      <div style={{ width: 76, height: 76, margin: '0 auto 1.5rem', borderRadius: 22, display: 'grid', placeItems: 'center', color: '#176b37', background: '#eaf7e8' }}><Sprout size={40} /></div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', padding: '.45rem .8rem', borderRadius: 999, color: '#9a6700', background: '#fff8db', fontWeight: 800, fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.06em' }}><AlertTriangle size={15} /> Scheduled maintenance</div>
      <h1 style={{ margin: '1.25rem 0 .8rem', color: '#123d24', fontSize: 'clamp(2rem, 6vw, 3.4rem)', lineHeight: 1.05 }}>We’ll be back growing soon.</h1>
      <p style={{ maxWidth: 530, margin: '0 auto', color: '#52675a', fontSize: '1.05rem', lineHeight: 1.75 }}>{settings.maintenanceMessage}</p>
      <div style={{ margin: '1.8rem auto', padding: '1rem', borderRadius: 14, background: '#f7faf6', color: '#486052', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.5rem' }}><Clock3 size={18} /> {settings.businessHours}</div>
      <p style={{ color: '#758278', fontSize: '.9rem' }}>Need assistance? <a href={`mailto:${settings.supportEmail}`} style={{ color: '#176b37', fontWeight: 800 }}>{settings.supportEmail}</a></p>
      <Link to="/admin" style={{ display: 'inline-block', marginTop: '1rem', color: '#176b37', fontWeight: 800, textDecoration: 'none' }}>Administrator access →</Link>
    </section>
  </main>
);

const AppContent: React.FC = () => {
  useSocketSync();
  const location = useLocation();
  const [maintenanceSettings, setMaintenanceSettings] = useState(getMaintenanceSettings);

  useEffect(() => {
    const refreshMaintenanceSettings = (event?: Event) => {
      const customSettings = (event as CustomEvent)?.detail;
      setMaintenanceSettings(customSettings ? { ...getMaintenanceSettings(), ...customSettings } : getMaintenanceSettings());
    };
    window.addEventListener('storage', refreshMaintenanceSettings);
    window.addEventListener('store-settings:updated', refreshMaintenanceSettings);
    return () => {
      window.removeEventListener('storage', refreshMaintenanceSettings);
      window.removeEventListener('store-settings:updated', refreshMaintenanceSettings);
    };
  }, []);
  const isAuthPage = ['/login', '/signin', '/signup', '/register'].some((path) =>
    location.pathname.startsWith(path)
  );
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideNavAndFooter = isAuthPage || isAdminPage;
  if (maintenanceSettings.maintenanceMode && !isAdminPage && !isAuthPage) {
    return <MaintenanceScreen settings={maintenanceSettings} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      {!hideNavAndFooter && <Navbar />}

      <main className="main-content" style={{ padding: 0, flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/farm-development" element={<FarmDevelopmentPage />} />
          <Route path="/services/development" element={<Navigate to="/services/farm-development" replace />} />
          <Route path="/services/well-development" element={<WellDevelopmentPage />} />
          <Route path="/services/well" element={<Navigate to="/services/well-development" replace />} />
          <Route path="/services/drip-irrigation" element={<DripIrrigationPage />} />
          <Route path="/services/drip" element={<Navigate to="/services/drip-irrigation" replace />} />
          <Route path="/services/irrigation" element={<Navigate to="/services/drip-irrigation" replace />} />
          <Route path="/services/farm-consultancy" element={<FarmConsultancyPage />} />
          <Route path="/services/consultancy" element={<Navigate to="/services/farm-consultancy" replace />} />
          <Route path="/services/consult" element={<Navigate to="/services/farm-consultancy" replace />} />
          <Route path="/services/crop-doctor" element={<CropDoctorPage />} />
          <Route path="/crop-doctor" element={<CropDoctorPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:idOrSlug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping" element={<ShippingPolicyPage />} />
          <Route path="/returns" element={<ReturnPolicyPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/catalog" element={<Navigate to="/products" replace />} />
          <Route path="/shop" element={<Navigate to="/products" replace />} />
          <Route
            path="/product/:idOrSlug"
            element={
              <div className="container" style={{ padding: '2rem 1.5rem' }}>
                <ProductDetailPage />
              </div>
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <div className="container" style={{ padding: '2rem 1.5rem' }}>
                <CheckoutPage />
              </div>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <div className="container" style={{ padding: '2rem 1.5rem' }}>
                <OrderConfirmationPage />
              </div>
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!hideNavAndFooter && <Footer />}
      <CartDrawer />
      <AuthModal />
      <ToastContainer />
      {!isAdminPage && <ChatWidget />}
    </div>
  );
};

export const App: React.FC = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
};

export default App;

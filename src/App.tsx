import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/Toast';
import { useThemeStore } from './store/themeStore';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { ServicesPage } from './pages/ServicesPage';
import { FarmDevelopmentPage } from './pages/FarmDevelopmentPage';
import { WellDevelopmentPage } from './pages/WellDevelopmentPage';
import { DripIrrigationPage } from './pages/DripIrrigationPage';
import { FarmConsultancyPage } from './pages/FarmConsultancyPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useSocketSync } from './socket';

const AppContent: React.FC = () => {
  useSocketSync();
  const location = useLocation();
  const isAuthPage = ['/login', '/signin', '/signup', '/register'].some(path => 
    location.pathname.startsWith(path)
  );
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideNavAndFooter = isAuthPage || isAdminPage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavAndFooter && <Navbar />}

      <main className="main-content" style={{ padding: 0, flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
          <Route path="/products" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><ProductsPage /></div>} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:idOrSlug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/catalog" element={<Navigate to="/products" replace />} />
          <Route path="/shop" element={<Navigate to="/products" replace />} />
          <Route path="/product/:idOrSlug" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><ProductDetailPage /></div>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><CheckoutPage /></div>} />
          <Route path="/order-confirmation/:orderId" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><OrderConfirmationPage /></div>} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="*" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><NotFoundPage /></div>} />
        </Routes>
      </main>

      {!hideNavAndFooter && <Footer />}
      <CartDrawer />
      <AuthModal />
      <ToastContainer />
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
      <AppContent />
    </Router>
  );
};

export default App;

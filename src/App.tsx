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
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signin', '/signup', '/register'].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthPage && <Navbar />}

      <main className="main-content" style={{ padding: 0, flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
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
          <Route path="/dashboard" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><DashboardPage /></div>} />
          <Route path="/admin" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><AdminPage /></div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="*" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><NotFoundPage /></div>} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
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

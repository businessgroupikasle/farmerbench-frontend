import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <main className="main-content" style={{ padding: 0 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><ProductsPage /></div>} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:idOrSlug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/catalog" element={<Navigate to="/products" replace />} />
            <Route path="/shop" element={<Navigate to="/products" replace />} />
            <Route path="/product/:idOrSlug" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><ProductDetailPage /></div>} />
            <Route path="/cart" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><CartPage /></div>} />
            <Route path="/checkout" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><CheckoutPage /></div>} />
            <Route path="/order-confirmation/:orderId" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><OrderConfirmationPage /></div>} />
            <Route path="/dashboard" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><DashboardPage /></div>} />
            <Route path="/admin" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><AdminPage /></div>} />
            <Route path="*" element={<div className="container" style={{ padding: '2rem 1.5rem' }}><NotFoundPage /></div>} />
          </Routes>
        </main>

        <Footer />
        <CartDrawer />
        <AuthModal />
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;

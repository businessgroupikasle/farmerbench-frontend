import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Truck,
  Check,
  MapPin,
  Headphones,
  MessageSquare,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useUIStore } from '../store/uiStore';
import './CartPage.css';

// Product images
import growthBoosterImg from '../assets/growth-booster.jpg';
import neemOilImg from '../assets/neem-oil-bottle.jpg';
import humicPowerImg from '../assets/humic-power.jpg';
import bioPowerImg from '../assets/bio-power-promoter.jpg';
import seaweedExtractImg from '../assets/seaweed-extract.jpg';
import trichodermaImg from '../assets/trichoderma-fungicide.jpg';

interface CartItemData {
  id: string;
  productId: string;
  title: string;
  category: string;
  rating: number;
  reviewsCount: number;
  stockStatus: 'in-stock' | 'low-stock';
  stockLabel: string;
  packSize: string;
  availableSizes: string[];
  price: number;
  quantity: number;
  image: string;
}

interface SavedItemData {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  stockStatus: 'in-stock' | 'low-stock';
}

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const { clearCart: hookClearCart } = useCart();

  // Local cart items initialized to match reference design exactly
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    {
      id: 'cart-item-1',
      productId: 'growth-booster',
      title: 'Growth Booster for All Crops',
      category: 'Crop Nutrition',
      rating: 4.8,
      reviewsCount: 124,
      stockStatus: 'in-stock',
      stockLabel: 'In Stock',
      packSize: '1 kg',
      availableSizes: ['500 g', '1 kg', '5 kg', '10 kg'],
      price: 580,
      quantity: 2,
      image: growthBoosterImg,
    },
    {
      id: 'cart-item-2',
      productId: 'neem-oil',
      title: 'Neem Oil 100% Cold Pressed',
      category: 'Plant Protection',
      rating: 4.7,
      reviewsCount: 112,
      stockStatus: 'in-stock',
      stockLabel: 'In Stock',
      packSize: '500 ml',
      availableSizes: ['250 ml', '500 ml', '1 L', '5 L'],
      price: 320,
      quantity: 1,
      image: neemOilImg,
    },
    {
      id: 'cart-item-3',
      productId: 'humic-power',
      title: 'Humic Power Soil Conditioner',
      category: 'Crop Nutrition',
      rating: 4.6,
      reviewsCount: 76,
      stockStatus: 'low-stock',
      stockLabel: 'Only 4 left',
      packSize: '1 kg',
      availableSizes: ['1 kg', '2.5 kg', '5 kg'],
      price: 650,
      quantity: 1,
      image: humicPowerImg,
    },
  ]);

  // Saved for Later items
  const [savedItems, setSavedItems] = useState<SavedItemData[]>([
    {
      id: 'saved-item-1',
      productId: 'bio-power',
      title: 'Bio Power Organic Growth Promoter',
      price: 450,
      image: bioPowerImg,
      stockStatus: 'in-stock',
    },
    {
      id: 'saved-item-2',
      productId: 'seaweed-extract',
      title: 'Seaweed Extract Plant Enhancer',
      price: 550,
      image: seaweedExtractImg,
      stockStatus: 'in-stock',
    },
  ]);

  // Coupon state
  const [couponCode, setCouponCode] = useState('FARMERBENCH120');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('FARMERBENCH120');
  const [discountAmount, setDiscountAmount] = useState(120);

  // Delivery checker state
  const [pincode, setPincode] = useState('641001');
  const [deliveryChecked, setDeliveryChecked] = useState(true);

  // Recommended Products ("You May Also Like")
  const recommendedProducts = [
    {
      id: 'rec-1',
      productId: 'trichoderma-fungicide',
      title: 'Trichoderma Bio Fungicide',
      category: 'Bio Fungicides',
      rating: 4.8,
      reviewsCount: 88,
      price: 480,
      image: trichodermaImg,
      packSize: '1 L',
      availableSizes: ['500 ml', '1 L', '5 L'],
    },
    {
      id: 'rec-2',
      productId: 'flowering-booster',
      title: 'Flowering Booster',
      category: 'Crop Nutrition',
      rating: 4.7,
      reviewsCount: 53,
      price: 540,
      image: growthBoosterImg,
      packSize: '500 ml',
      availableSizes: ['250 ml', '500 ml', '1 L'],
    },
    {
      id: 'rec-3',
      productId: 'organic-root-developer',
      title: 'Organic Root Developer',
      category: 'Bio Stimulants',
      rating: 4.6,
      reviewsCount: 66,
      price: 480,
      image: humicPowerImg,
      packSize: '1 kg',
      availableSizes: ['500 g', '1 kg', '5 kg'],
    },
    {
      id: 'rec-4',
      productId: 'plant-shield-pesticide',
      title: 'Plant Shield Bio Pesticide',
      category: 'Bio Pesticides',
      rating: 4.5,
      reviewsCount: 64,
      price: 460,
      image: bioPowerImg,
      packSize: '1 L',
      availableSizes: ['500 ml', '1 L', '5 L'],
    },
    {
      id: 'rec-5',
      productId: 'seaweed-extract-enhancer',
      title: 'Seaweed Extract Plant Enhancer',
      category: 'Plant Growth Promoter',
      rating: 4.9,
      reviewsCount: 142,
      price: 550,
      image: seaweedExtractImg,
      packSize: '1 L',
      availableSizes: ['500 ml', '1 L', '5 L'],
    },
    {
      id: 'rec-6',
      productId: 'cold-pressed-neem-oil',
      title: 'Neem Oil 100% Cold Pressed',
      category: 'Plant Protection',
      rating: 4.7,
      reviewsCount: 112,
      price: 320,
      image: neemOilImg,
      packSize: '500 ml',
      availableSizes: ['250 ml', '500 ml', '1 L'],
    },
  ];

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [recStartIndex, setRecStartIndex] = useState(0);

  const handleToggleWishlist = (id: string, title: string) => {
    setWishlistIds((prev) => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        addToast({ type: 'info', message: `${title} removed from wishlist` });
        return prev.filter((item) => item !== id);
      } else {
        addToast({ type: 'success', message: `${title} added to wishlist` });
        return [...prev, id];
      }
    });
  };

  const handleAddRecommendedToCart = (prod: typeof recommendedProducts[0]) => {
    const existingIndex = cartItems.findIndex((i) => i.productId === prod.productId);
    if (existingIndex > -1) {
      setCartItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          productId: prod.productId,
          title: prod.title,
          category: prod.category,
          rating: prod.rating,
          reviewsCount: prod.reviewsCount,
          stockStatus: 'in-stock',
          stockLabel: 'In Stock',
          packSize: prod.packSize,
          availableSizes: prod.availableSizes,
          price: prod.price,
          quantity: 1,
          image: prod.image,
        },
      ]);
    }
    addToast({ type: 'success', message: `${prod.title} added to cart!` });
  };

  const handleNextRec = () => {
    setRecStartIndex((prev) => (prev + 1) % (recommendedProducts.length - 3));
  };

  const handlePrevRec = () => {
    setRecStartIndex((prev) => (prev - 1 + (recommendedProducts.length - 3)) % (recommendedProducts.length - 3));
  };

  // Calculations
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 999;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery || cartItems.length === 0 ? 0 : 80;
  const estimatedTax = 0;
  const grandTotal = Math.max(0, subtotal - (appliedCoupon ? discountAmount : 0) + deliveryFee + estimatedTax);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  // Handlers
  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handlePackSizeChange = (itemId: string, newSize: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, packSize: newSize } : item))
    );
    addToast({ type: 'info', message: `Pack size updated to ${newSize}` });
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = cartItems.find((i) => i.id === itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    if (itemToRemove) {
      addToast({ type: 'info', message: `${itemToRemove.title} removed from cart` });
    }
  };

  const handleSaveForLater = (itemId: string) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    setSavedItems((prev) => [
      ...prev,
      {
        id: `saved-${Date.now()}`,
        productId: item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
        stockStatus: 'in-stock',
      },
    ]);
    addToast({ type: 'success', message: `${item.title} moved to Saved for Later` });
  };

  const handleMoveToCart = (savedId: string) => {
    const item = savedItems.find((i) => i.id === savedId);
    if (!item) return;

    setSavedItems((prev) => prev.filter((i) => i.id !== savedId));
    setCartItems((prev) => [
      ...prev,
      {
        id: `cart-${Date.now()}`,
        productId: item.productId,
        title: item.title,
        category: 'Organic Farm Care',
        rating: 4.8,
        reviewsCount: 45,
        stockStatus: 'in-stock',
        stockLabel: 'In Stock',
        packSize: '1 L',
        availableSizes: ['500 ml', '1 L', '5 L'],
        price: item.price,
        quantity: 1,
        image: item.image,
      },
    ]);
    addToast({ type: 'success', message: `${item.title} moved to Cart` });
  };

  const handleRemoveSavedItem = (savedId: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== savedId));
    addToast({ type: 'info', message: 'Item removed from saved list' });
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items in your cart?')) {
      setCartItems([]);
      hookClearCart();
      addToast({ type: 'info', message: 'Cart has been cleared' });
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'FARMERBENCH120' || code === 'FARMER120' || code === 'AGRI120') {
      setAppliedCoupon(code);
      setDiscountAmount(120);
      addToast({ type: 'success', message: `Coupon ${code} applied! You saved ₹120.00` });
    } else if (code === 'FARMERBENCH20') {
      const discount = Math.round(subtotal * 0.2);
      setAppliedCoupon(code);
      setDiscountAmount(discount);
      addToast({ type: 'success', message: `Coupon ${code} applied! 20% discount (₹${discount})` });
    } else {
      addToast({ type: 'error', message: 'Invalid coupon code. Try FARMERBENCH120' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    addToast({ type: 'info', message: 'Coupon removed' });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length >= 6) {
      setDeliveryChecked(true);
      addToast({ type: 'success', message: `Delivery available for pincode ${pincode}` });
    } else {
      addToast({ type: 'error', message: 'Please enter a valid 6-digit pincode' });
    }
  };

  return (
    <div className="cart-page-layout">
      {/* 1. Breadcrumb */}
      <nav className="cart-breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="cart-breadcrumb-link">
          Home
        </Link>
        <span className="cart-breadcrumb-separator">/</span>
        <span className="cart-breadcrumb-current">Shopping Cart</span>
      </nav>

      {/* 2. Top Header & Action */}
      <div className="cart-header-row">
        <div>
          <h1 className="cart-title">Your Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <Link to="/products" className="cart-top-continue-btn">
          <ChevronLeft size={16} strokeWidth={2.4} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* 3. Step Checkout Progress Bar */}
      <div className="cart-progress-wrap">
        {/* Step 1: Cart */}
        <div className="cart-step-node">
          <div className="cart-step-circle active">1</div>
          <span className="cart-step-label active">Cart</span>
        </div>

        <div className="cart-step-line" />

        {/* Step 2: Delivery */}
        <div className="cart-step-node">
          <div className="cart-step-circle inactive">2</div>
          <span className="cart-step-label">Delivery</span>
        </div>

        <div className="cart-step-line" />

        {/* Step 3: Payment */}
        <div className="cart-step-node">
          <div className="cart-step-circle inactive">3</div>
          <span className="cart-step-label">Payment</span>
        </div>
      </div>

      {/* 4. Main Grid: Left Cart Items Table & Right Sticky Summary */}
      <div className="cart-main-grid">
        {/* Left Column */}
        <div className="cart-left-col">
          {/* Cart Table Card */}
          <div className="cart-table-card">
            {/* Table Headings */}
            <div className="cart-table-head">
              <span>Product</span>
              <span style={{ textAlign: 'center' }}>Pack Size</span>
              <span style={{ textAlign: 'center' }}>Quantity</span>
              <span style={{ textAlign: 'right' }}>Price</span>
              <span style={{ textAlign: 'right' }}>Total</span>
            </div>

            {/* Cart Item Rows */}
            {cartItems.length === 0 ? (
              <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Your shopping cart is currently empty.
                </p>
                <Link to="/products" className="cart-footer-continue-btn">
                  Browse Agricultural Products
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-table-row">
                  {/* Product Details Cell */}
                  <div className="cart-product-cell">
                    <img src={item.image} alt={item.title} className="cart-product-img" />
                    <div className="cart-product-details">
                      <Link to={`/products`} className="cart-product-title">
                        {item.title}
                      </Link>
                      <span className="cart-product-category">{item.category}</span>

                      {/* Star Rating */}
                      <div className="cart-product-rating">
                        <div className="cart-stars-wrap">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              fill={i < Math.floor(item.rating) ? '#F59E0B' : 'none'}
                              stroke="#F59E0B"
                            />
                          ))}
                        </div>
                        <span>{item.rating}</span>
                        <span className="cart-rating-count">({item.reviewsCount})</span>
                      </div>

                      {/* Stock Status */}
                      <div className={`cart-stock-badge ${item.stockStatus}`}>
                        <span className={`cart-stock-dot ${item.stockStatus}`} />
                        <span>{item.stockLabel}</span>
                      </div>

                      {/* Actions: Save for later & Remove */}
                      <div className="cart-item-actions">
                        <button
                          onClick={() => handleSaveForLater(item.id)}
                          className="cart-action-btn save"
                        >
                          <Heart size={14} />
                          <span>Save for Later</span>
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="cart-action-btn remove"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pack Size Selector */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <select
                      value={item.packSize}
                      onChange={(e) => handlePackSizeChange(item.id, e.target.value)}
                      className="cart-pack-select"
                    >
                      {item.availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Selector */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="cart-qty-control">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="cart-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="cart-qty-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div style={{ textAlign: 'right' }}>
                    <span className="cart-item-price">₹{item.price.toFixed(2)}</span>
                  </div>

                  {/* Line Total */}
                  <div style={{ textAlign: 'right' }}>
                    <span className="cart-item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Bottom Actions in Cart Card */}
            {cartItems.length > 0 && (
              <div className="cart-table-footer">
                <Link to="/products" className="cart-footer-continue-btn">
                  Continue Shopping
                </Link>
                <button onClick={handleClearCart} className="cart-clear-btn">
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* 5. Free Delivery Progress Card */}
          <div className="cart-free-delivery-card">
            <div className="cart-free-delivery-header">
              <div className="cart-free-delivery-left">
                <div className="cart-truck-icon-badge">
                  <Truck size={22} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="cart-free-delivery-title">
                    {isFreeDelivery
                      ? "You've unlocked FREE delivery!"
                      : `Add ₹${(freeDeliveryThreshold - subtotal).toFixed(2)} more for FREE delivery!`}
                  </h3>
                  <p className="cart-free-delivery-subtitle">
                    {isFreeDelivery
                      ? 'Your cart total is above ₹999.'
                      : 'Free delivery applied on orders above ₹999.'}
                  </p>
                </div>
              </div>

              {isFreeDelivery && (
                <div className="cart-free-delivery-check">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="cart-free-delivery-progress-track">
              <div
                className="cart-free-delivery-progress-fill"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* 6. Saved for Later Section */}
          {savedItems.length > 0 && (
            <div className="cart-saved-section">
              <h2 className="cart-saved-title">Saved for Later</h2>
              <div className="cart-saved-card">
                {savedItems.map((item) => (
                  <div key={item.id} className="cart-saved-row">
                    <div className="cart-saved-left">
                      <img src={item.image} alt={item.title} className="cart-saved-img" />
                      <div className="cart-saved-info">
                        <h4 className="cart-saved-item-title">{item.title}</h4>
                        <div className="cart-stock-badge in-stock">
                          <span className="cart-stock-dot in-stock" />
                          <span>In Stock</span>
                        </div>
                      </div>
                    </div>

                    <div className="cart-saved-right">
                      <span className="cart-saved-price">₹{item.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleMoveToCart(item.id)}
                        className="cart-move-btn"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveSavedItem(item.id)}
                        className="cart-saved-delete-btn"
                        aria-label="Delete saved item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="cart-sidebar">
          {/* Order Summary Card */}
          <div className="cart-sidebar-card">
            <h3 className="cart-sidebar-card-title">Order Summary</h3>

            <div className="cart-summary-breakdown">
              <div className="cart-summary-line">
                <span>Subtotal ({totalItemCount} items)</span>
                <span style={{ fontWeight: 700 }}>₹{subtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="cart-summary-line discount">
                  <span>Discount</span>
                  <span>− ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="cart-summary-line">
                <span>Delivery</span>
                <div className="cart-delivery-free">
                  <span className="cart-strike-price">₹80.00</span>
                  <span className="cart-free-tag">FREE</span>
                </div>
              </div>

              <div className="cart-summary-line">
                <span>Estimated Tax</span>
                <span style={{ fontWeight: 600 }}>₹{estimatedTax.toFixed(2)}</span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-price">₹{grandTotal.toFixed(2)}</span>
              </div>

              <span className="cart-tax-note">Inclusive of all taxes</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="cart-checkout-btn"
              id="proceed-to-checkout-btn"
            >
              <span>Proceed to Checkout</span>
            </button>

            <div className="cart-secure-text">
              <ShieldCheck size={16} style={{ color: '#165B2E' }} />
              <span>Safe & Secure Checkout</span>
            </div>

            {/* Payment Gateway Badges */}
            <div className="cart-payment-icons">
              {/* Visa */}
              <div className="cart-pay-badge" title="Visa">
                <svg width="34" height="12" viewBox="0 0 36 12" fill="none">
                  <path
                    d="M14.8 11.5L16.8 0.5H19.5L17.5 11.5H14.8ZM27.7 0.8C27.1 0.6 26.2 0.4 25.1 0.4C22.2 0.4 20.2 1.9 20.2 4.1C20.2 5.7 21.7 6.6 22.8 7.1C23.9 7.6 24.3 8 24.3 8.5C24.3 9.3 23.3 9.6 22.4 9.6C21.4 9.6 20.8 9.5 20.0 9.1L19.6 8.9L19.2 11.3C19.9 11.6 21.1 11.8 22.3 11.8C25.4 11.8 27.4 10.3 27.4 8.0C27.4 6.2 25.8 5.2 24.4 4.5C23.6 4.1 23.1 3.8 23.1 3.2C23.1 2.6 23.8 2.0 25.1 2.0C26.0 2.0 26.7 2.2 27.2 2.4L27.5 2.5L27.7 0.8ZM35.8 0.5H33.7C33.0 0.5 32.5 0.7 32.2 1.4L27.5 11.5H30.4L31.0 9.9H34.5L34.8 11.5H37.3L35.8 0.5ZM31.8 7.6L33.2 3.6L34.1 7.6H31.8ZM12.1 0.5L9.6 7.9L9.3 6.4C8.8 4.7 7.3 2.8 5.6 1.9L8.1 11.5H11.0L15.3 0.5H12.1ZM6.0 0.5H0.6L0.5 0.8C4.5 1.8 7.2 4.3 8.3 7.2L7.1 1.2C6.9 0.7 6.5 0.5 6.0 0.5Z"
                    fill="#1A1F71"
                  />
                </svg>
              </div>

              {/* Mastercard */}
              <div className="cart-pay-badge" title="Mastercard">
                <svg width="28" height="16" viewBox="0 0 32 20" fill="none">
                  <circle cx="11" cy="10" r="9" fill="#EB001B" />
                  <circle cx="21" cy="10" r="9" fill="#F79E1B" />
                  <path
                    d="M16 3.5C18 5.2 19.3 7.5 19.3 10C19.3 12.5 18 14.8 16 16.5C14 14.8 12.7 12.5 12.7 10C12.7 7.5 14 5.2 16 3.5Z"
                    fill="#FF5F00"
                  />
                </svg>
              </div>

              {/* RuPay */}
              <div className="cart-pay-badge" title="RuPay">
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#097938' }}>
                  Ru<span style={{ color: '#F37021' }}>Pay</span>
                </span>
              </div>

              {/* UPI */}
              <div className="cart-pay-badge" title="UPI">
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#097938', letterSpacing: '0.02em' }}>
                  UPI<span style={{ color: '#F37021' }}>▶</span>
                </span>
              </div>
            </div>
          </div>

          {/* Apply Coupon Card */}
          <div className="cart-sidebar-card">
            <h3 className="cart-sidebar-card-title">Apply Coupon</h3>
            <form onSubmit={handleApplyCoupon} className="cart-coupon-form">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="cart-coupon-input"
              />
              <button type="submit" className="cart-coupon-btn">
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="cart-coupon-applied-box">
                <div className="cart-coupon-applied-left">
                  <Check size={16} strokeWidth={3} style={{ color: '#165B2E' }} />
                  <div>
                    <span className="cart-coupon-code">{appliedCoupon}</span>
                    <div className="cart-coupon-saved-text">
                      You saved ₹{discountAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="cart-coupon-remove-btn"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Check Delivery Card */}
          <div className="cart-sidebar-card">
            <h3 className="cart-sidebar-card-title">Check Delivery</h3>
            <form onSubmit={handleCheckPincode} className="cart-delivery-form">
              <div className="cart-delivery-input-wrap">
                <MapPin size={16} className="cart-delivery-pin-icon" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  className="cart-delivery-input"
                />
              </div>
              <button type="submit" className="cart-delivery-btn">
                Check
              </button>
            </form>

            {deliveryChecked && (
              <div className="cart-delivery-result">
                <span className="cart-delivery-date">Delivery by Monday, 31 Aug</span>
                <span className="cart-delivery-cutoff">Order within 4 hrs 20 mins</span>
              </div>
            )}
          </div>

          {/* Need Help With Your Order? Card */}
          <div className="cart-help-card">
            <div className="cart-help-icon-box">
              <Headphones size={22} strokeWidth={2.4} />
            </div>
            <h4 className="cart-help-title">Need Help With Your Order?</h4>
            <a href="tel:+919876543210" className="cart-help-phone">
              +91 98765 43210
            </a>
            <a
              href="https://wa.me/919876543210?text=Hi%20FarmerBench,%20I%20have%20a%20question%20about%20my%20order"
              target="_blank"
              rel="noreferrer"
              className="cart-help-whatsapp"
            >
              <MessageSquare size={16} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </aside>
      </div>

      {/* 8. Recommended Products: You May Also Like */}
      <section className="cart-recommendations-section">
        <div className="cart-rec-header">
          <h2 className="cart-rec-title">You May Also Like</h2>
          <div className="cart-rec-nav-arrows">
            <button
              onClick={handlePrevRec}
              className="cart-rec-nav-btn"
              aria-label="Previous recommended products"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextRec}
              className="cart-rec-nav-btn"
              aria-label="Next recommended products"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="cart-rec-grid">
          {recommendedProducts.slice(recStartIndex, recStartIndex + 4).map((prod) => {
            const isWishlisted = wishlistIds.includes(prod.id);
            return (
              <div key={prod.id} className="cart-rec-card">
                {/* Wishlist Button */}
                <button
                  onClick={() => handleToggleWishlist(prod.id, prod.title)}
                  className={`cart-rec-wish-btn ${isWishlisted ? 'active' : ''}`}
                  aria-label="Save to wishlist"
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? '#DC2626' : 'none'}
                    stroke={isWishlisted ? '#DC2626' : 'currentColor'}
                  />
                </button>

                {/* Product Image */}
                <div className="cart-rec-img-wrap">
                  <img src={prod.image} alt={prod.title} className="cart-rec-img" />
                </div>

                {/* Product Info */}
                <h3 className="cart-rec-item-title">{prod.title}</h3>
                <span className="cart-rec-item-cat">{prod.category}</span>

                {/* Star Rating */}
                <div className="cart-rec-rating">
                  <div className="cart-stars-wrap">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < Math.floor(prod.rating) ? '#F59E0B' : 'none'}
                        stroke="#F59E0B"
                      />
                    ))}
                  </div>
                  <span>{prod.rating}</span>
                  <span className="cart-rating-count">({prod.reviewsCount})</span>
                </div>

                {/* Price */}
                <div className="cart-rec-price">₹{prod.price.toFixed(2)}</div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddRecommendedToCart(prod)}
                  className="cart-rec-add-btn"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CartPage;


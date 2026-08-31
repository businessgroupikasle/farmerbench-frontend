import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useProductMutations } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import {
  Star,
  Check,
  ShoppingBag,
  Heart,
  ShieldCheck,
  CreditCard,
  Headphones,
  RotateCcw,
  Truck,
  Search,
  CheckCircle2,
  Sprout,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import './ProductDetailPage.css';

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(idOrSlug);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useUIStore();
  const { addReview, isSubmittingReview } = useProductMutations();

  // Dynamic attributes from PostgreSQL
  const attrs = (product?.attributes as Record<string, any>) || {};
  const availablePackSizes: string[] = Array.isArray(attrs.packSizes) && attrs.packSizes.length > 0
    ? attrs.packSizes
    : ['500 g', '1 kg', '5 kg'];

  // Component state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPackSize, setSelectedPackSize] = useState<string>(availablePackSizes[0] || '500 g');
  const [activeTab, setActiveTab] = useState<
    'description' | 'benefits' | 'how-to-use' | 'dosage' | 'ingredients' | 'faqs' | 'reviews'
  >('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Delivery pincode state
  const [pincodeInput, setPincodeInput] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  } | null>(null);

  // Zoom state for main image
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Crop Doctor Modal
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [expertSubmitted, setExpertSubmitted] = useState(false);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading FarmerBench catalog product..." />;
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Product Not Found"
        message="The agricultural input or product you requested could not be located in our catalog."
        actionText="Back to Products"
        onRetry={() => navigate('/products')}
      />
    );
  }

  const isDiscounted = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = isDiscounted && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock === 0;

  // SKU derived from database
  const skuCode = product.slug
    ? `GL-GB-${product.slug.slice(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, '')}`
    : `GL-GB-${product.id.slice(0, 6).toUpperCase()}`;

  // Image handling from database
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'];

  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, { packSize: selectedPackSize });
    addToast({
      type: 'success',
      message: `Added ${quantity} × ${product.title} (${selectedPackSize}) to bag!`,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, { packSize: selectedPackSize });
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    addToast({
      type: !isWishlisted ? 'success' : 'info',
      message: !isWishlisted
        ? `Added "${product.title}" to your Saved Items!`
        : `Removed "${product.title}" from Saved Items.`,
    });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pincodeInput.trim();
    if (!pin || pin.length < 6) {
      setDeliveryStatus({
        checked: true,
        available: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    setDeliveryStatus({
      checked: true,
      available: true,
      message: `✅ Express Rural & Urban Delivery Available to PIN ${pin} (Est. Delivery: 2-4 business days).`,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast({ type: 'warning', message: 'Please sign in to submit a verified product review.' });
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await addReview({
        productId: product.id,
        rating: newRating,
        comment: newComment.trim(),
      });
      setNewComment('');
      addToast({ type: 'success', message: 'Thank you! Your review has been published.' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to submit review' });
    }
  };

  // Structured content parsed from PostgreSQL
  const features: string[] = Array.isArray(attrs.features) ? attrs.features : [];
  const benefits: string[] = Array.isArray(attrs.benefits) ? attrs.benefits : [];
  const usageSteps: Array<{ stepNumber: number; title: string; description: string }> = Array.isArray(attrs.usageSteps) ? attrs.usageSteps : [];
  const dosageTable: Array<{ crop: string; foliarSpray: string; dripIrrigation: string }> = Array.isArray(attrs.dosageTable) ? attrs.dosageTable : [];
  const ingredients: string = typeof attrs.ingredients === 'string' ? attrs.ingredients : '';
  const specifications: Array<{ label: string; value: string }> = Array.isArray(attrs.specifications) ? attrs.specifications : [];
  const faqs: Array<{ question: string; answer: string }> = Array.isArray(attrs.faqs) ? attrs.faqs : [];
  const beforeAfter = attrs.beforeAfter || null;

  return (
    <div className="pdp-wrapper animate-fade-in">
      {/* 1. Breadcrumbs */}
      <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="pdp-breadcrumbs-sep">/</span>
        <Link to="/products">Products</Link>
        {product.category && (
          <>
            <span className="pdp-breadcrumbs-sep">/</span>
            <Link to={`/products?category=${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        <span className="pdp-breadcrumbs-sep">/</span>
        <span className="pdp-breadcrumbs-current">{product.title}</span>
      </nav>

      {/* 2. Top Main 2-Column Grid */}
      <div className="pdp-main-grid">
        {/* LEFT COLUMN: Gallery */}
        <div className="pdp-gallery-container">
          {/* Thumbnails Stack */}
          {galleryImages.length > 1 && (
            <div className="pdp-thumbnails-stack">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`pdp-thumbnail-item ${selectedImageIndex === idx ? 'active' : ''}`}
                  aria-label={`Select product image ${idx + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}

          {/* Main Stage Display Box */}
          <div className="pdp-main-stage">
            <div className="pdp-genuine-badge">
              <Sprout size={14} /> 100% Genuine
            </div>

            <div
              className="pdp-stage-img-wrap"
              ref={imageRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={currentImage}
                alt={product.title}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(1.45)' : 'scale(1)',
                }}
              />
            </div>

            <div className="pdp-zoom-indicator">
              <Search size={14} /> Hover to zoom
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details Panel */}
        <div className="pdp-info-panel">
          {/* Category Tag */}
          {product.category && (
            <Link to={`/products?category=${product.category.slug}`} className="pdp-category-link">
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="pdp-title">{product.title}</h1>

          {/* Rating & Review Header */}
          <div className="pdp-rating-row">
            <span className="pdp-rating-num">{product.rating.toFixed(1)}</span>
            <div className="pdp-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= Math.round(product.rating) ? '#F59E0B' : 'none'}
                  stroke={s <= Math.round(product.rating) ? '#F59E0B' : '#CBD5E1'}
                />
              ))}
            </div>
            <span className="pdp-reviews-count">
              ({product.numReviews} verified reviews)
            </span>
            <button
              type="button"
              className="pdp-write-review-btn"
              onClick={() => {
                setActiveTab('reviews');
                const el = document.getElementById('pdp-tabs-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Write a Review
            </button>
          </div>

          {/* SKU & Stock Row */}
          <div className="pdp-meta-row">
            <span>
              <strong>SKU:</strong> {skuCode}
            </span>
            <span>•</span>
            <span
              className={`pdp-stock-status ${
                isOutOfStock ? 'out-of-stock' : product.stock <= 10 ? 'low-stock' : 'in-stock'
              }`}
            >
              <span className="pdp-stock-dot" />
              {isOutOfStock
                ? 'Out of Stock'
                : product.stock <= 10
                ? `Only ${product.stock} units left in stock`
                : 'In Stock'}
            </span>
          </div>

          {/* Price Block */}
          <div className="pdp-price-block">
            <div className="pdp-price-main">
              <span className="pdp-current-price">
                ₹{(product.discountPrice || product.price).toFixed(2)}
              </span>
              {isDiscounted && (
                <>
                  <span className="pdp-mrp-price">₹{product.price.toFixed(2)}</span>
                  <span className="pdp-discount-tag">{discountPercent}% OFF</span>
                </>
              )}
            </div>
            <span className="pdp-tax-notice">Inclusive of all taxes & agricultural GST exemptions</span>
          </div>

          {/* Description */}
          <p className="pdp-short-desc">
            {product.description}
          </p>

          {/* Dynamic Feature Bullets from PostgreSQL */}
          {features.length > 0 && (
            <div className="pdp-feature-list">
              {features.map((feat, idx) => (
                <div key={idx} className="pdp-feature-item">
                  <div className="pdp-feature-icon">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pack Size Selector */}
          {availablePackSizes.length > 0 && (
            <div className="pdp-pack-size-section">
              <span className="pdp-section-label">Pack Size</span>
              <div className="pdp-pack-options">
                {availablePackSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedPackSize(size)}
                    className={`pdp-pack-btn ${selectedPackSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Row */}
          <div className="pdp-actions-row">
            <div className="pdp-qty-wrap">
              <span className="pdp-section-label">Quantity</span>
              <div className="pdp-qty-stepper">
                <button
                  type="button"
                  className="pdp-qty-btn"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="pdp-qty-value">{quantity}</span>
                <button
                  type="button"
                  className="pdp-qty-btn"
                  disabled={quantity >= product.stock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="pdp-btn-add-cart"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="pdp-btn-buy-now"
            >
              Buy Now
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`pdp-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          >
            <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
            {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Check Delivery Box */}
          <div className="pdp-delivery-card">
            <div className="pdp-delivery-header">
              <span className="pdp-section-label" style={{ color: '#166534' }}>
                Check Delivery
              </span>
            </div>
            <form onSubmit={handleCheckPincode} className="pdp-delivery-form">
              <input
                type="text"
                placeholder="Enter your 6-digit PIN code"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.slice(0, 6))}
                className="pdp-pincode-input"
              />
              <button type="submit" className="pdp-pincode-btn">
                Check
              </button>
            </form>
            {deliveryStatus && (
              <div
                className={`pdp-delivery-result ${
                  deliveryStatus.available ? 'available' : 'unavailable'
                }`}
              >
                {deliveryStatus.message}
              </div>
            )}
            <div className="pdp-delivery-estimate">
              <Truck size={14} style={{ color: '#16a34a' }} />
              <span>Usually delivered in 3–5 business days directly to your farm address</span>
            </div>
          </div>

          {/* Trust Indicators Row */}
          <div className="pdp-trust-row">
            <div className="pdp-trust-item">
              <ShieldCheck size={20} className="pdp-trust-icon" />
              <span>Genuine Product</span>
            </div>
            <div className="pdp-trust-item">
              <CreditCard size={20} className="pdp-trust-icon" />
              <span>Secure Payment</span>
            </div>
            <div className="pdp-trust-item">
              <Headphones size={20} className="pdp-trust-icon" />
              <span>Expert Support</span>
            </div>
            <div className="pdp-trust-item">
              <RotateCcw size={20} className="pdp-trust-icon" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Crop Expert Assistance Banner */}
      <div className="pdp-expert-banner">
        <div className="pdp-expert-left">
          <div className="pdp-expert-icon-wrap">🌱</div>
          <div>
            <h3 className="pdp-expert-title">Need help using this product?</h3>
            <p className="pdp-expert-sub">
              Ask our certified crop doctors for customized dosage, soil compatibility, and stage-wise application schedules.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpertModalOpen(true)}
          className="pdp-expert-btn"
        >
          Talk to Crop Expert
        </button>
      </div>

      {/* 4. Product Information Tabs */}
      <div id="pdp-tabs-section">
        <div className="pdp-tabs-container">
          <button
            type="button"
            className={`pdp-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          {benefits.length > 0 && (
            <button
              type="button"
              className={`pdp-tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
              onClick={() => setActiveTab('benefits')}
            >
              Benefits
            </button>
          )}
          {usageSteps.length > 0 && (
            <button
              type="button"
              className={`pdp-tab-btn ${activeTab === 'how-to-use' ? 'active' : ''}`}
              onClick={() => setActiveTab('how-to-use')}
            >
              How to Use
            </button>
          )}
          {dosageTable.length > 0 && (
            <button
              type="button"
              className={`pdp-tab-btn ${activeTab === 'dosage' ? 'active' : ''}`}
              onClick={() => setActiveTab('dosage')}
            >
              Dosage
            </button>
          )}
          {ingredients && (
            <button
              type="button"
              className={`pdp-tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
          )}
          {faqs.length > 0 && (
            <button
              type="button"
              className={`pdp-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
            </button>
          )}
          <button
            type="button"
            className={`pdp-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.numReviews})
          </button>
        </div>

        {/* Tab Content Panes */}
        {activeTab === 'description' && (
          <div className="pdp-tab-content-grid">
            {/* Left: Product Overview & How to Use Flow */}
            <div className="pdp-overview-block">
              <div>
                <h3 className="pdp-block-heading">Product Overview</h3>
                <p className="pdp-block-text">
                  {product.description}
                </p>
              </div>

              {/* How to Use Visual Step Flow */}
              {usageSteps.length > 0 && (
                <div>
                  <h4 className="pdp-block-heading" style={{ fontSize: '1.05rem' }}>How to Use</h4>
                  <div className="pdp-steps-row">
                    {usageSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="pdp-step-card">
                          <span className="pdp-step-num">{step.stepNumber || idx + 1}</span>
                          <span className="pdp-step-icon">
                            {idx === 0 ? '🥄' : idx === 1 ? '🪣' : '🌱'}
                          </span>
                          <div className="pdp-step-name">{step.title}</div>
                          <p className="pdp-step-desc">{step.description}</p>
                        </div>
                        {idx < usageSteps.length - 1 && <span className="pdp-step-arrow">›</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="pdp-dosage-notice">
                    <Sprout size={16} />
                    <span>Always follow the recommended dosage on the label for your specific crop.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Specifications Card */}
            {specifications.length > 0 && (
              <div className="pdp-specs-card">
                <h3 className="pdp-specs-title">Product Details</h3>
                <table className="pdp-specs-table">
                  <tbody>
                    {specifications.map((spec, idx) => (
                      <tr key={idx}>
                        <td className="pdp-specs-label">{spec.label}</td>
                        <td className="pdp-specs-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="pdp-tab-content-grid">
            <div className="pdp-overview-block">
              <h3 className="pdp-block-heading">Key Agricultural Benefits</h3>
              {benefits.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                  {benefits.map((b, idx) => (
                    <li key={idx}>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#64748b' }}>No benefits listed for this product.</p>
              )}
            </div>
            {specifications.length > 0 && (
              <div className="pdp-specs-card">
                <h3 className="pdp-specs-title">Product Details</h3>
                <table className="pdp-specs-table">
                  <tbody>
                    {specifications.slice(0, 4).map((spec, idx) => (
                      <tr key={idx}>
                        <td className="pdp-specs-label">{spec.label}</td>
                        <td className="pdp-specs-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'how-to-use' && (
          <div className="pdp-overview-block" style={{ maxWidth: '800px' }}>
            <h3 className="pdp-block-heading">How to Use Guidelines</h3>
            {usageSteps.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#475569' }}>
                {usageSteps.map((step, idx) => (
                  <div key={idx} style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <strong>Step {step.stepNumber || idx + 1}: {step.title}</strong>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>{step.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>Please refer to product label for specific application directions.</p>
            )}
          </div>
        )}

        {activeTab === 'dosage' && (
          <div className="pdp-specs-card" style={{ maxWidth: '800px' }}>
            <h3 className="pdp-specs-title">Recommended Crop Dosage Table</h3>
            {dosageTable.length > 0 ? (
              <table className="pdp-specs-table">
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#166534' }}>Crop Category</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#166534' }}>Foliar Spray</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#166534' }}>Drip Irrigation</th>
                  </tr>
                </thead>
                <tbody>
                  {dosageTable.map((row, idx) => (
                    <tr key={idx}>
                      <td className="pdp-specs-label">{row.crop}</td>
                      <td className="pdp-specs-value">{row.foliarSpray}</td>
                      <td className="pdp-specs-value">{row.dripIrrigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#64748b' }}>Consult agronomist for customized crop dosage.</p>
            )}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="pdp-overview-block" style={{ maxWidth: '800px' }}>
            <h3 className="pdp-block-heading">Active Bio-Active Ingredients</h3>
            <p style={{ color: '#475569', lineHeight: 1.6 }}>
              {ingredients || 'Formulated with organic bio-stimulants and active agricultural nutrients.'}
            </p>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="pdp-overview-block" style={{ maxWidth: '800px' }}>
            <h3 className="pdp-block-heading">Frequently Asked Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.length > 0 ? (
                faqs.map((faq, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ color: '#0f172a' }}>{faq.question}</strong>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b' }}>No FAQs available for this product yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="pdp-reviews-wrap">
            <div className="pdp-reviews-header">
              <div>
                <h3 className="pdp-block-heading">Customer Reviews</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{product.rating.toFixed(1)}</span>
                  <div className="pdp-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        fill={s <= Math.round(product.rating) ? '#F59E0B' : 'none'}
                        stroke={s <= Math.round(product.rating) ? '#F59E0B' : '#CBD5E1'}
                      />
                    ))}
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Based on {product.reviews?.length || product.numReviews || 0} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="pdp-add-review-card">
              <h4 className="pdp-review-form-title">Write a Customer Review</h4>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Your Rating
                </label>
                <div className="pdp-rating-input-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className={`pdp-star-btn ${star <= (hoverRating || newRating) ? 'filled' : ''}`}
                    >
                      <Star size={24} fill={star <= (hoverRating || newRating) ? '#F59E0B' : 'none'} stroke={star <= (hoverRating || newRating) ? '#F59E0B' : '#CBD5E1'} />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginLeft: '0.5rem' }}>
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Review Feedback & Crop Results
                </label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience on yield increase, application dosage, and crop health..."
                  className="pdp-review-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="pdp-review-submit-btn"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="pdp-reviews-list">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="pdp-review-item">
                    <div className="pdp-review-top">
                      <div className="pdp-reviewer-info">
                        <div className="pdp-reviewer-avatar">
                          {rev.user?.name ? rev.user.name[0] : 'F'}
                        </div>
                        <div>
                          <div className="pdp-reviewer-name">{rev.user?.name || 'Verified Farmer'}</div>
                          <span className="pdp-review-verified">
                            <CheckCircle2 size={13} /> Verified Buyer
                          </span>
                        </div>
                      </div>
                      <span className="pdp-review-date">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="pdp-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= rev.rating ? '#F59E0B' : 'none'}
                          stroke={s <= rev.rating ? '#F59E0B' : '#CBD5E1'}
                        />
                      ))}
                    </div>
                    <p className="pdp-review-comment">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No customer reviews yet. Be the first farmer to share your yield experience!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. Before / After Results Section (Rendered from DB if available) */}
      {beforeAfter && (beforeAfter.beforeImage || beforeAfter.afterImage) && (
        <section className="pdp-results-section">
          <h3 className="pdp-block-heading" style={{ fontSize: '1.3rem' }}>
            See the Difference 🌱
          </h3>
          <div className="pdp-results-grid">
            {beforeAfter.beforeImage && (
              <div className="pdp-result-card">
                <img src={beforeAfter.beforeImage} alt={beforeAfter.beforeTag || 'Before'} />
                <span className="pdp-result-tag">{beforeAfter.beforeTag || 'Before'}</span>
              </div>
            )}
            {beforeAfter.afterImage && (
              <div className="pdp-result-card">
                <img src={beforeAfter.afterImage} alt={beforeAfter.afterTag || 'After 30 Days'} />
                <span className="pdp-result-tag" style={{ background: 'rgba(21, 128, 61, 0.9)' }}>
                  {beforeAfter.afterTag || 'After 30 Days'}
                </span>
              </div>
            )}
          </div>
          {beforeAfter.disclaimer && (
            <p className="pdp-results-disclaimer">
              {beforeAfter.disclaimer}
            </p>
          )}
        </section>
      )}

      {/* 6. Crop Expert Advisory Modal */}
      {isExpertModalOpen && (
        <div className="agriflow-modal-overlay" onClick={() => setIsExpertModalOpen(false)}>
          <div className="agriflow-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsExpertModalOpen(false)} className="agriflow-modal-close">
              <X size={22} />
            </button>

            {expertSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(136, 207, 58, 0.2)',
                    color: '#88CF3A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <Sparkles size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                  Agronomist Consultation Booked!
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Our crop specialist will call you shortly regarding customized dosage for {product.title}.
                </p>
                <button
                  onClick={() => {
                    setExpertSubmitted(false);
                    setIsExpertModalOpen(false);
                  }}
                  className="agriflow-btn-contact"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  Talk to Crop Doctor
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Get real-time agronomic guidance on applying <strong>{product.title}</strong> for your field.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setExpertSubmitted(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Farmer Name
                    </label>
                    <input required type="text" placeholder="e.g. Ramanathan K." className="agriflow-input" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Phone Number (for call/WhatsApp)
                    </label>
                    <input required type="tel" placeholder="+91 98400 12345" className="agriflow-input" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Crop & Acreage
                    </label>
                    <input required type="text" placeholder="e.g. Paddy / 5 Acres / 25 Days Old" className="agriflow-input" />
                  </div>

                  <button
                    type="submit"
                    className="agriflow-btn-contact"
                    style={{ width: '100%', marginTop: '0.5rem', gap: '0.5rem' }}
                  >
                    <Send size={16} /> Request Call Back
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;

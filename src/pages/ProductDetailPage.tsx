import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useProductMutations } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { RatingStars } from '../components/product/RatingStars';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Star, CheckCircle } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(idOrSlug);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUIStore();
  const { addReview, isSubmittingReview } = useProductMutations();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading product details..." />;
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Product Not Found"
        message="The product you are looking for does not exist or has been removed."
        actionText="Back to Products"
        onRetry={() => navigate('/products')}
      />
    );
  }

  const isDiscounted = !!product.discountPrice && product.discountPrice < product.price;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    await addReview({
      productId: product.id,
      rating: newRating,
      comment: newComment,
    });

    setNewComment('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Top Product Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* Images Gallery */}
        <div>
          {/* Main Large Image */}
          <div
            style={{
              width: '100%',
              paddingTop: '85%',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              marginBottom: '1rem',
            }}
          >
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'var(--bg-surface)',
                    opacity: selectedImageIndex === idx ? 1 : 0.7,
                    transition: 'all 0.2s',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            {product.category && (
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--brand-primary)',
                  letterSpacing: '0.05em',
                }}
              >
                {product.category.name}
              </span>
            )}
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.2, marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              {product.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <RatingStars rating={product.rating} numReviews={product.numReviews} size={18} />
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              {isOutOfStock ? (
                <Badge variant="danger">Out of Stock</Badge>
              ) : (
                <Badge variant="success">In Stock ({product.stock} units)</Badge>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
            }}
          >
            {isDiscounted ? (
              <>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ${product.discountPrice?.toFixed(2)}
                </span>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.price.toFixed(2)}
                </span>
                <Badge variant="danger">Save ${(product.price - product.discountPrice!).toFixed(2)}</Badge>
              </>
            ) : (
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.975rem' }}>
            {product.description}
          </p>

          {/* Quantity and CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                max={product.stock}
                onChange={(q) => setQuantity(q)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button
                variant="gradient"
                size="lg"
                leftIcon={<ShoppingBag size={18} />}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                style={{ flex: 1, minWidth: '180px' }}
              >
                Add to Bag
              </Button>
              <Button
                variant="secondary"
                size="lg"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                style={{ flex: 1, minWidth: '180px' }}
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Benefits Bullet Points */}
          <div
            style={{
              marginTop: '1rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>Complimentary insured shipping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>30-day effortless returns</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>2-year full manufacturer warranty</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>Authenticity guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications vs Customer Reviews */}
      <div className="card" style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'specs' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'specs' ? '2px solid var(--brand-primary)' : 'none',
              paddingBottom: '0.5rem',
              marginBottom: '-1rem',
            }}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'reviews' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'reviews' ? '2px solid var(--brand-primary)' : 'none',
              paddingBottom: '0.5rem',
              marginBottom: '-1rem',
            }}
          >
            Customer Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div>
            {product.attributes && Object.keys(product.attributes).length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.925rem' }}>
                <tbody>
                  {Object.entries(product.attributes).map(([key, val], idx) => (
                    <tr
                      key={key}
                      style={{
                        backgroundColor: idx % 2 === 0 ? 'var(--bg-subtle)' : 'transparent',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '35%', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                        {String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Standard specifications apply for this handcrafted item.</p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Submit Review Form */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Write a Review</h3>
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="input-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Rating</label>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                        >
                          <Star
                            size={24}
                            style={{
                              color: s <= newRating ? '#fbbf24' : 'var(--border-color)',
                              fill: s <= newRating ? '#fbbf24' : 'transparent',
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Your Feedback</label>
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your detailed impressions with fellow collectors..."
                      className="input-field"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmittingReview}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Submit Review
                  </Button>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Please sign in to your verified account to leave a product review.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => openAuthModal('login')}>
                    Sign In
                  </Button>
                </div>
              )}
            </div>

            {/* Existing Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {rev.user?.avatarUrl ? (
                          <img
                            src={rev.user.avatarUrl}
                            alt=""
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--brand-primary-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: 'var(--brand-primary)',
                            }}
                          >
                            {rev.user?.name ? rev.user.name[0] : 'U'}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rev.user?.name || 'Verified Buyer'}</span>
                      </div>
                      <RatingStars rating={rev.rating} showText={false} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

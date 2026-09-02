import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Star, Check, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@formerbench/shared';

interface WishlistCarouselProps {
  wishlistItems: Product[];
  onViewAllWishlist: () => void;
  onAddToCart: (product: Product | any) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export const WishlistCarousel: React.FC<WishlistCarouselProps> = ({
  wishlistItems = [],
  onViewAllWishlist,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const totalCount = wishlistItems.length;

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">Your Wishlist</h3>
        {totalCount > 0 && (
          <div className="fb-wishlist-header-actions">
            <a
              className="fb-card-link"
              onClick={(e) => {
                e.preventDefault();
                onViewAllWishlist();
              }}
            >
              View All {totalCount} {totalCount === 1 ? 'Item' : 'Items'} <ArrowRight size={14} />
            </a>
            {totalCount > 3 && (
              <div className="fb-carousel-controls">
                <button className="fb-carousel-btn" onClick={scrollLeft} aria-label="Previous">
                  <ChevronLeft size={16} />
                </button>
                <button className="fb-carousel-btn" onClick={scrollRight} aria-label="Next">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {totalCount === 0 ? (
        <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--fb-green-50)',
              color: 'var(--fb-green-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <Heart size={22} />
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fb-text-dark)' }}>
            Your Wishlist is Empty
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--fb-text-muted)', marginTop: '0.25rem', maxWidth: '360px', margin: '0.25rem auto 1rem auto' }}>
            Click the heart icon on any fertilizer, bio-promoter, or equipment to save it here for later purchase.
          </p>
          <button
            className="fb-btn-primary-dark"
            onClick={() => navigate('/products')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
          >
            <ShoppingBag size={14} /> Explore Products
          </button>
        </div>
      ) : (
        <div className="fb-wishlist-scroll-track" ref={scrollRef}>
          {wishlistItems.map((item: any) => {
            const imgUrl =
              item.images?.[0] || item.imageUrl || '';
            const rating = item.rating || 5;
            const reviews = item.numReviews || 0;
            const inStock = (item.stock ?? 1) > 0;

            return (
              <div key={item.id} className="fb-wishlist-product-card">
                <button
                  className="fb-wishlist-heart-btn"
                  onClick={() => onRemoveFromWishlist(item.id)}
                  title="Remove from wishlist"
                >
                  <Heart size={14} fill="#ef4444" />
                </button>

                <div className="fb-wishlist-img-wrap">
                  {imgUrl ? (
                    <img src={imgUrl} alt={item.title} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        color: 'var(--fb-text-muted)',
                        fontSize: '0.75rem',
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

                <span className="fb-wishlist-title" title={item.title}>
                  {item.title}
                </span>

                <div className="fb-rating-stars-mini">
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <span>{rating.toFixed(1)}</span>
                  {reviews > 0 && (
                    <span style={{ color: '#94a3b8', fontWeight: 500 }}>({reviews})</span>
                  )}
                </div>

                <div className="fb-stock-pill-in">
                  <Check size={11} strokeWidth={3} />
                  <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>

                <div className="fb-wishlist-price-row">
                  <span className="fb-wishlist-price">
                    ₹{item.price ? Number(item.price).toFixed(2) : '0.00'}
                  </span>
                  <button
                    className="fb-btn-add-cart-mini"
                    onClick={() => onAddToCart(item)}
                    disabled={!inStock}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

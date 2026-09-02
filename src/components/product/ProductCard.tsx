import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@formerbench/shared';
import { RatingStars } from './RatingStars';
import { ShoppingBag, Heart, Check, Layers, Zap } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCompareStore } from '../../store/compareStore';
import { useUIStore } from '../../store/uiStore';
import { getUploadUrl } from '../../utils/image';
import { formatPrice } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, isInCompare } = useCompareStore();
  const { addToast } = useUIStore();

  const isDiscounted = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = isDiscounted && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Badge derivation based on real product properties
  const isOrganic = Boolean(
    product.attributes?.isOrganic ||
    product.category?.name?.toLowerCase().includes('organic') ||
    product.category?.name?.toLowerCase().includes('bio')
  );
  const isBestSeller = Boolean(product.rating >= 4.7 && product.numReviews >= 3);

  const packSize = product.attributes?.packSize || product.attributes?.unit || product.attributes?.weight || null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      navigate('/checkout');
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    addToast({
      type: added ? 'success' : 'info',
      message: added ? `${product.title} added to wishlist` : `${product.title} removed from wishlist`,
    });
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(product);
    if (result.limitReached) {
      addToast({
        type: 'warning',
        message: 'You can compare a maximum of 4 products at a time.',
      });
    } else {
      addToast({
        type: result.added ? 'success' : 'info',
        message: result.added ? `Added to comparison` : `Removed from comparison`,
      });
    }
  };

  const primaryImage = getUploadUrl(product.images?.[0], FALLBACK_IMAGE);

  return (
    <div className="fb-product-card">
      {/* Top Media Area */}
      <div className="fb-card-media-wrapper">
        <Link
          to={`/product/${product.slug || product.id}`}
          className="fb-card-image-link"
          aria-label={`View details of ${product.title}`}
        >
          <img
            src={primaryImage}
            alt={product.title}
            className="fb-card-image"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </Link>

        {/* Top Badges Stack (Left) */}
        <div className="fb-card-badges">
          {isOutOfStock && <span className="fb-badge fb-badge-danger">Out of Stock</span>}
          {!isOutOfStock && isDiscounted && (
            <span className="fb-badge fb-badge-discount">-{discountPercent}% OFF</span>
          )}
          {!isOutOfStock && isBestSeller && (
            <span className="fb-badge fb-badge-bestseller">Best Seller</span>
          )}
          {!isOutOfStock && product.featured && !isBestSeller && (
            <span className="fb-badge fb-badge-featured">Featured</span>
          )}
          {!isOutOfStock && isOrganic && (
            <span className="fb-badge fb-badge-organic">Organic</span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="fb-badge fb-badge-warning">Only {product.stock} left</span>
          )}
        </div>

        {/* Top Action Buttons (Right: Wishlist + Compare) */}
        <div className="fb-card-top-actions">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`fb-card-action-btn fb-wishlist-btn ${isWishlisted ? 'active' : ''}`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label="Wishlist"
          >
            <Heart
              size={17}
              fill={isWishlisted ? '#ef4444' : 'none'}
              color={isWishlisted ? '#ef4444' : '#52695c'}
              strokeWidth={2.2}
            />
          </button>

          {/* Quick Compare Button */}
          <button
            type="button"
            onClick={handleCompareClick}
            className={`fb-card-action-btn fb-compare-btn ${isCompared ? 'active' : ''}`}
            title={isCompared ? 'Remove from compare' : 'Compare product'}
            aria-label="Compare"
          >
            {isCompared ? (
              <Check size={16} color="#166534" strokeWidth={2.5} />
            ) : (
              <Layers size={16} color="#52695c" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="fb-card-content">
        {/* Category Name & Pack Size */}
        <div className="fb-card-meta-row">
          {product.category && (
            <span className="fb-card-category">{product.category.name}</span>
          )}
          {packSize && (
            <span className="fb-card-pack-size">{packSize}</span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="fb-card-title">
          <Link to={`/product/${product.slug || product.id}`}>
            {product.title}
          </Link>
        </h3>

        {/* Description snippet if present */}
        {product.description && (
          <p className="fb-card-description">
            {product.description.replace(/<[^>]*>?/gm, '').slice(0, 75)}
            {product.description.length > 75 ? '...' : ''}
          </p>
        )}

        {/* Rating Row */}
        {product.rating > 0 && (
          <div className="fb-card-rating-row">
            <RatingStars rating={product.rating} numReviews={product.numReviews} />
            <span className="fb-card-reviews-count">({product.numReviews || 0})</span>
          </div>
        )}

        {/* Bottom Pricing & CTA Area */}
        <div className="fb-card-footer">
          <div className="fb-card-price-group">
            {isDiscounted ? (
              <>
                <span className="fb-card-current-price">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="fb-card-original-price">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="fb-card-current-price">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Dual Action Buttons: Add to Cart + Buy Now */}
          <div className="fb-card-cta-group">
            <button
              type="button"
              className="fb-add-to-cart-btn"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingBag size={15} strokeWidth={2.2} />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>

            {!isOutOfStock && (
              <button
                type="button"
                className="fb-buy-now-btn"
                onClick={handleBuyNow}
                title="Instant Checkout"
                aria-label={`Buy ${product.title} now`}
              >
                <Zap size={14} strokeWidth={2.4} />
                <span>Buy Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

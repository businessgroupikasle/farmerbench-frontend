import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@formerbench/shared';
import { ShoppingBag, ExternalLink, Check } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { getUploadUrl } from '../../utils/image';
import { formatPrice } from '../../utils/currency';

interface ChatProductCardProps {
  product: Product;
  onNavigate?: () => void;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

export const ChatProductCard: React.FC<ChatProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isDiscounted = Boolean(product.discountPrice && product.discountPrice < product.price);
  const primaryImage = getUploadUrl(product.images?.[0], FALLBACK_IMG);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div className="fb-chat-product-card">
      <div className="fb-chat-product-img-wrap">
        <img
          src={primaryImage}
          alt={product.title}
          className="fb-chat-product-img"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
          }}
          loading="lazy"
        />
        {isDiscounted && (
          <span className="fb-chat-product-discount-badge">
            {Math.round(((product.price - (product.discountPrice || product.price)) / product.price) * 100)}% OFF
          </span>
        )}
      </div>

      <div className="fb-chat-product-info">
        {product.category && (
          <span className="fb-chat-product-category">{product.category.name}</span>
        )}
        <h4 className="fb-chat-product-title" title={product.title}>
          <Link to={`/product/${product.slug || product.id}`} onClick={onNavigate}>
            {product.title}
          </Link>
        </h4>

        <div className="fb-chat-product-price-row">
          {isDiscounted ? (
            <>
              <span className="fb-chat-product-sale-price">{formatPrice(product.discountPrice)}</span>
              <span className="fb-chat-product-orig-price">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="fb-chat-product-sale-price">{formatPrice(product.price)}</span>
          )}

          <span className={`fb-chat-stock-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? 'Out of stock' : 'In stock'}
          </span>
        </div>

        <div className="fb-chat-product-actions">
          <Link
            to={`/product/${product.slug || product.id}`}
            className="fb-chat-btn-view"
            onClick={onNavigate}
            title="View full product details"
          >
            <ExternalLink size={13} />
            <span>Details</span>
          </Link>

          <button
            type="button"
            className={`fb-chat-btn-add ${justAdded ? 'added' : ''}`}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            title={isOutOfStock ? 'Out of stock' : 'Add 1 unit to cart'}
          >
            {justAdded ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

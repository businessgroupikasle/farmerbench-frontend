import React from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';
import { getUploadUrl } from '../../utils/image';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500';

export const HomeOurProducts: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: response, isLoading } = useProducts({ limit: 4 });
  const products = response?.data || [];

  if (isLoading || products.length === 0) return null;

  const openProduct = (product: (typeof products)[number]) => {
    navigate(`/product/${product.slug || product.id}`);
  };

  return (
    <section className="agriflow-our-products-section" aria-labelledby="recommended-products-title">
      <div className="agriflow-products-header">
        <h2 id="recommended-products-title">Recommended for Your Farm</h2>
        <Link to="/products">View All Products</Link>
      </div>

      <button className="agriflow-products-arrow agriflow-products-arrow--left" type="button" aria-label="Previous products">
        <ChevronLeft size={18} />
      </button>

      <div className="agriflow-products-grid">
        {products.map((item) => {
          const image = getUploadUrl(item.images?.[0], FALLBACK_IMAGE);
          const discounted = Boolean(item.discountPrice && item.discountPrice < item.price);
          const currentPrice = discounted ? item.discountPrice! : item.price;
          const discount = discounted ? Math.round(((item.price - currentPrice) / item.price) * 100) : 0;
          const packSize = item.attributes?.packSize || item.attributes?.unit || item.attributes?.weight;

          return (
            <article
              key={item.id}
              className="agriflow-product-item"
              onClick={() => openProduct(item)}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') openProduct(item);
              }}
            >
              <div className="agriflow-product-img-box">
                <img src={image} alt={item.title} loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} />
                {discounted && <span className="agriflow-product-discount">{discount}% OFF</span>}
              </div>

              <div className="agriflow-product-info">
                <h3 className="agriflow-product-name">{item.title}</h3>
                <p className="agriflow-product-pack">{packSize || item.category?.name || 'Farm essential'}</p>
                <div className="agriflow-product-rating" aria-label={`${item.rating || 0} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} fill={star <= Math.round(item.rating || 0) ? 'currentColor' : 'none'} />)}
                  <span>({(item.rating || 0).toFixed(1)})</span>
                </div>
                <div className="agriflow-product-price">
                  <strong>{formatPrice(currentPrice)}</strong>
                  {discounted && <del>{formatPrice(item.price)}</del>}
                </div>
                <button
                  className="agriflow-product-cart"
                  type="button"
                  disabled={item.stock === 0}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (item.stock > 0) addToCart(item, 1);
                  }}
                >
                  <ShoppingCart size={14} />
                  {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <button className="agriflow-products-arrow agriflow-products-arrow--right" type="button" aria-label="Next products">
        <ChevronRight size={18} />
      </button>
    </section>
  );
};

export default HomeOurProducts;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { CURRENCY_SYMBOL } from '../../utils/currency';

export const HomeOurProducts: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading } = useProducts({ limit: 4 });
  const products = response?.data || [];

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <section className="agriflow-our-products-section">
      <div className="container">
        {/* Section Heading: Our products */}
        <h2 className="agriflow-our-products-title">Our products</h2>

        {/* Divider with Category Label */}
        <div className="agriflow-products-divider">
          <span className="agriflow-divider-line" />
          <span className="agriflow-category-label">Featured Products</span>
          <span className="agriflow-divider-line" />
        </div>

        {/* Products Grid */}
        <div className="agriflow-products-grid">
          {products.map((item) => {
            const imgUrl = item.images?.[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400';
            return (
              <div
                key={item.id}
                className="agriflow-product-item"
                onClick={() => navigate(`/product/${item.slug || item.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/product/${item.slug || item.id}`);
                  }
                }}
              >
                <div className="agriflow-product-img-box">
                  <img src={imgUrl} alt={item.title} />
                </div>
                <h3 className="agriflow-product-name">{item.title}</h3>
                <p className="agriflow-product-price">
                  {CURRENCY_SYMBOL} {item.price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeOurProducts;

import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/currency';
import { getUploadUrl } from '../../utils/image';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80';

export const HomeOurProducts: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('best-selling');
  const { data: response, isLoading } = useProducts({ limit: 100 });
  const { data: categories = [] } = useCategories();
  const products = response?.data || [];

  const categoryTabs = useMemo(() => categories
    .filter((category) => category.isActive !== false && products.some((product) => product.categoryId === category.id))
    .slice(0, 2), [categories, products]);

  const visibleProducts = useMemo(() => {
    const filtered = activeCategory === 'best-selling'
      ? [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
      : products.filter((product) => product.categoryId === activeCategory);
    return filtered.slice(0, 8);
  }, [activeCategory, products]);

  if (isLoading || products.length === 0) return null;

  return (
    <section className="agriflow-our-products-section" aria-labelledby="best-selling-products-title">
      <header className="agriflow-products-header">
        <span>OUR PRODUCTS</span>
        <h2 id="best-selling-products-title">Best Selling <strong>Products</strong></h2>
        <p>Our most loved, high-quality agricultural products recommended for your farm.</p>
      </header>

      <div className="agriflow-product-tabs" role="tablist" aria-label="Product categories">
        <button type="button" className={activeCategory === 'best-selling' ? 'active' : ''} onClick={() => setActiveCategory('best-selling')}>Best Seller</button>
        {categoryTabs.map((category) => (
          <button key={category.id} type="button" className={activeCategory === category.id ? 'active' : ''} onClick={() => setActiveCategory(category.id)}>{category.name}</button>
        ))}
      </div>

      <div className="agriflow-products-grid">
        {visibleProducts.map((item) => {
          const image = getUploadUrl(item.images?.[0], FALLBACK_IMAGE);
          const discounted = Boolean(item.discountPrice && item.discountPrice < item.price);
          const currentPrice = discounted ? item.discountPrice! : item.price;
          const discount = discounted ? Math.round(((item.price - currentPrice) / item.price) * 100) : 0;
          const packSize = item.attributes?.packSize || item.attributes?.unit || item.attributes?.weight || item.attributes?.packSizes?.[0];

          return (
            <article key={item.id} className="agriflow-product-item" onClick={() => navigate(`/product/${item.slug || item.id}`)} role="link" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/product/${item.slug || item.id}`); }}>
              <div className="agriflow-product-img-box">
                <img src={image} alt={item.title} loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} />
                {discounted && <span className="agriflow-product-discount">{discount}% off</span>}
              </div>
              <div className="agriflow-product-info">
                <div className="agriflow-product-meta">
                  <span>{item.subcategory?.name || item.category?.name || 'Farm Product'}</span>
                  <span><Star size={14} fill="currentColor" /> {(item.rating || 0).toFixed(1)}</span>
                </div>
                <h3 className="agriflow-product-name">{item.title}</h3>
                <p className="agriflow-product-pack">Pack: {packSize || 'Standard pack'}</p>
                <div className="agriflow-product-price">
                  <strong>{formatPrice(currentPrice)}</strong>
                  {discounted && <del>{formatPrice(item.price)}</del>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Link to="/products" className="agriflow-products-view-all">View All Products</Link>
    </section>
  );
};

export default HomeOurProducts;

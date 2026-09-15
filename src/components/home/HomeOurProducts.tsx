import React, { useMemo, useState } from 'react';
import { Star, Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/currency';
import { getUploadUrl } from '../../utils/image';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80';

export const HomeOurProducts: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: response, isLoading } = useProducts({ limit: 100 });
  const { data: categories = [] } = useCategories();
  const products = response?.data || [];

  const productSections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = (product: (typeof products)[number]) => !query ||
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.name?.toLowerCase().includes(query) ||
      product.subcategory?.name?.toLowerCase().includes(query);

    const activeCategories = categories.filter((category) =>
      category.isActive !== false && products.some((product) => product.categoryId === category.id)
    );

    const sections = [
      {
        id: 'best-selling',
        name: 'Best Seller',
        products: [...products]
          .filter(matchesSearch)
          .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
          .slice(0, 8),
      },
      ...activeCategories.map((category) => ({
        id: category.id,
        name: category.name,
        products: products
          .filter((product) => product.categoryId === category.id && matchesSearch(product))
          .slice(0, 8),
      })),
    ];

    return sections.filter((section) => section.products.length > 0);
  }, [categories, products, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isLoading || products.length === 0) return null;

  return (
    <section className="agriflow-our-products-section" aria-labelledby="best-selling-products-title">
      <header className="agriflow-products-header">
        <span>OUR PRODUCTS</span>
        <h2 id="best-selling-products-title">Best Selling <strong>Products</strong></h2>
        <p>Our most loved, high-quality agricultural products recommended for your farm.</p>
      </header>

      {/* Interactive Product Search Bar */}
      <form className="agriflow-products-search" onSubmit={handleSearchSubmit} role="search">
        <div className="agriflow-products-search-inner">
          <Search size={18} className="agriflow-products-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products (e.g. neem oil, seeds, traps)..."
            aria-label="Search best selling products"
          />
          {searchQuery && (
            <button
              type="button"
              className="agriflow-products-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
          <button type="submit" className="agriflow-products-search-btn">
            Search
          </button>
        </div>
      </form>

      {productSections.length === 0 && searchQuery.trim() && (
        <div className="agriflow-products-empty-search">
          <p>No products found matching &ldquo;{searchQuery}&rdquo;.</p>
          <button
            type="button"
            className="agriflow-search-catalog-btn"
            onClick={() => navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)}
          >
            Search all catalog for &ldquo;{searchQuery}&rdquo;
          </button>
        </div>
      )}

      <div className="agriflow-product-sections">
        {productSections.map((section) => (
          <section key={section.id} className="agriflow-product-category-section" aria-labelledby={`home-category-${section.id}`}>
            <div className="agriflow-product-category-heading">
              <h3 id={`home-category-${section.id}`}>{section.name}</h3>
              <span className="agriflow-category-product-count">{section.products.length} Products</span>
              <Link
                className="agriflow-category-view-all"
                to={section.id === 'best-selling' ? '/products?featured=true' : `/products?category=${encodeURIComponent(section.id)}`}
              >
                View All Products
              </Link>
            </div>

            <div className="agriflow-products-grid">
              {section.products.map((item) => {
                const image = getUploadUrl(item.images?.[0], FALLBACK_IMAGE);
                const discounted = Boolean(item.discountPrice && item.discountPrice < item.price);
                const currentPrice = discounted ? item.discountPrice! : item.price;
                const discount = discounted ? Math.round(((item.price - currentPrice) / item.price) * 100) : 0;

                return (
                  <article
                    key={item.id}
                    className="agriflow-product-item"
                    onClick={() => navigate(`/product/${item.slug || item.id}`)}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') navigate(`/product/${item.slug || item.id}`);
                    }}
                  >
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
                      <div className="agriflow-product-price">
                        <strong>{formatPrice(currentPrice)}</strong>
                        {discounted && <del>{formatPrice(item.price)}</del>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Link to="/products" className="agriflow-products-view-all">View All Products</Link>
    </section>
  );
};

export default HomeOurProducts;
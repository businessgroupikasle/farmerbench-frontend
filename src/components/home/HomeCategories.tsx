import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HomeCategoriesProps {
  categories: any[];
}

export const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
  return (
    <section id="categories">
      <div className="agriflow-categories-header">
        <div>
          <span className="agriflow-categories-tag">
            Browse Natural Categories
          </span>
          <h2 className="agriflow-categories-title">Explore Farm Categories</h2>
        </div>
        <Link to="/products" className="agriflow-categories-link">
          <span>View All</span> <ArrowRight size={16} />
        </Link>
      </div>

      <div className="agriflow-categories-grid">
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="card card-hover agriflow-category-card"
          >
            <div className="agriflow-category-img-wrapper">
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                alt={cat.name}
              />
            </div>
            <h3 className="agriflow-category-name">{cat.name}</h3>
            <p className="agriflow-category-count">
              {cat._count?.products ? `${cat._count.products} products` : 'Explore fresh items'}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCategories;

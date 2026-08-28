import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from '../product/ProductGrid';

interface HomeFeaturedProps {
  products: any[];
  isLoading: boolean;
}

export const HomeFeatured: React.FC<HomeFeaturedProps> = ({ products, isLoading }) => {
  return (
    <section id="store-catalog">
      <div className="agriflow-featured-header">
        <div>
          <span className="agriflow-featured-tag">
            Fresh Harvest & Top Picks
          </span>
          <h2 className="agriflow-featured-title">Featured Organic Goods</h2>
        </div>
        <Link to="/products" className="agriflow-featured-link">
          <span>See Full Store</span> <ArrowRight size={16} />
        </Link>
      </div>

      <ProductGrid products={products} isLoading={isLoading} />
    </section>
  );
};

export default HomeFeatured;

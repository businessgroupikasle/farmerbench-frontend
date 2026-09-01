import React from 'react';
import { Product } from '@formerbench/shared';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  isLoading = false,
  emptyTitle = 'No agricultural products found',
  emptyDescription = 'Try adjusting your search keywords, clearing categories, or resetting price filters.',
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="fb-products-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="fb-product-card fb-card-skeleton animate-pulse-subtle">
            <div className="fb-card-media-wrapper fb-skeleton-media" />
            <div className="fb-card-content">
              <div className="fb-skeleton-line fb-skeleton-category" />
              <div className="fb-skeleton-line fb-skeleton-title" />
              <div className="fb-skeleton-line fb-skeleton-desc" />
              <div className="fb-skeleton-footer">
                <div className="fb-skeleton-line fb-skeleton-price" />
                <div className="fb-skeleton-btn" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="fb-products-empty-wrapper">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionText={onResetFilters ? 'Reset Filters' : undefined}
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="fb-products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

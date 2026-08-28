import React from 'react';
import { Product } from '@formerbench/shared';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
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
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search or filter options.',
  onResetFilters,
}) => {
  if (isLoading) {
    return <LoadingSpinner size={36} message="Loading curated products..." />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? 'Reset Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid-products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

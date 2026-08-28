import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useFilterStore } from '../store/filterStore';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Pagination } from '../components/common/Pagination';

export const CatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { filters, setCategory, setSearch, setPage, resetFilters } = useFilterStore();

  // Sync URL search params to Zustand filter store on mount/param change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const urlFeatured = searchParams.get('featured') === 'true';

    if (urlCategory) {
      setCategory(urlCategory);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }
    if (urlFeatured) {
      useFilterStore.setState((state) => ({
        filters: { ...state.filters, featured: true, page: 1 },
      }));
    }
  }, [searchParams]);

  const { data: response, isLoading } = useProducts(filters);
  const products = response?.data || [];
  const pagination = response?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          {filters.search
            ? `Search Results for "${filters.search}"`
            : filters.category
            ? `Category: ${filters.category.replace(/-/g, ' ')}`
            : 'All Curated Products'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {pagination ? `Showing ${products.length} of ${pagination.total} items` : 'Loading items...'}
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '90px' }}>
          <ProductFilters />
        </aside>

        {/* Content Area */}
        <main>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onResetFilters={resetFilters}
          />

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => {
                setPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

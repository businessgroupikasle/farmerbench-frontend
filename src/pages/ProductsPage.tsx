import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useFilterStore } from '../store/filterStore';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Pagination } from '../components/common/Pagination';
import { Search, Sprout } from 'lucide-react';
import './ProductsPage.css';

const POPULAR_CATEGORIES = [
  { id: '', name: 'All Products' },
  { id: 'fertilizers', name: 'Fertilizers' },
  { id: 'biostimulants', name: 'Biostimulants' },
  { id: 'pesticides', name: 'Pesticides' },
  { id: 'crop-nutrition', name: 'Crop Nutrition' },
  { id: 'seeds-nuts', name: 'Seeds & Nuts' },
  { id: 'organic-produce', name: 'Organic Produce' },
];

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setCategory, setSearch, setPage, resetFilters } = useFilterStore();
  const { data: apiCategories = [] } = useCategories();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const urlFeatured = searchParams.get('featured') === 'true';

    if (urlCategory) {
      setCategory(urlCategory);
    }
    if (urlSearch) {
      setSearch(urlSearch);
      setSearchInput(urlSearch);
    }
    if (urlFeatured) {
      useFilterStore.setState((state) => ({
        filters: { ...state.filters, featured: true, page: 1 },
      }));
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim() || undefined);
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryClick = (catSlug: string) => {
    const nextCat = catSlug || undefined;
    setCategory(nextCat);
    if (nextCat) {
      setSearchParams({ category: nextCat });
    } else {
      setSearchParams({});
    }
  };

  const { data: response, isLoading } = useProducts(filters);
  const products = response?.data || [];
  const pagination = response?.pagination;

  // Merge API categories with defaults for pills
  const categoryPills = apiCategories.length > 0 
    ? [{ id: '', name: 'All Products', slug: '' }, ...apiCategories]
    : POPULAR_CATEGORIES.map(c => ({ id: c.id, name: c.name, slug: c.id }));

  return (
    <div className="products-page-layout">
      {/* 1. Header & Live Search */}
      <div className="products-page-header">
        <div className="products-header-top">
          <div className="products-title-group">
            <h1>
              {filters.search
                ? `Search: "${filters.search}"`
                : filters.category
                ? `${filters.category.replace(/-/g, ' ')} Products`
                : 'Agricultural Products'}
            </h1>
            <p>
              {pagination ? `Showing ${products.length} of ${pagination.total} quality products` : 'Loading catalog...'}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="products-search-box">
            <Search size={18} style={{ color: '#5D7A68' }} />
            <input
              type="text"
              placeholder="Search seeds, fertilizers, tools..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="products-search-input"
            />
          </form>
        </div>

        {/* 2. Quick Category Filter Pills */}
        <div className="products-category-pills">
          {categoryPills.map((cat: any) => {
            const catSlug = cat.slug || cat.id || '';
            const isActive = (!filters.category && !catSlug) || filters.category === catSlug;
            return (
              <button
                key={catSlug || 'all'}
                type="button"
                onClick={() => handleCategoryClick(catSlug)}
                className={`products-cat-pill ${isActive ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Grid Layout (Filters Sidebar + Products Grid) */}
      <div className="products-main-grid">
        {/* Left Sidebar: Detailed Filters */}
        <aside className="products-sidebar">
          <ProductFilters />
        </aside>

        {/* Right Area: Products Grid & Pagination */}
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

export default ProductsPage;

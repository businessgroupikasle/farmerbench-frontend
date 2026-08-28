import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useFilterStore } from '../../store/filterStore';
import { RotateCcw, Filter, Star } from 'lucide-react';

export const ProductFilters: React.FC = () => {
  const { data: categories = [] } = useCategories();
  const { filters, setCategory, setPriceRange, setMinRating, setSortBy, resetFilters } =
    useFilterStore();

  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
  ] as const;

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <Filter size={18} style={{ color: 'var(--brand-primary)' }} />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="input-field"
          style={{ cursor: 'pointer' }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories Filter */}
      <div>
        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Category
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button
            onClick={() => setCategory(undefined)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: !filters.category ? 'var(--brand-primary-light)' : 'transparent',
              color: !filters.category ? 'var(--brand-primary)' : 'var(--text-primary)',
              border: 'none',
              fontWeight: !filters.category ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug || filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(isSelected ? undefined : cat.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--brand-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                  border: 'none',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>{cat.name}</span>
                {cat._count?.products !== undefined && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {cat._count.products}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Price Range ($)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              setPriceRange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)
            }
            className="input-field"
            style={{ padding: '0.45rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              setPriceRange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)
            }
            className="input-field"
            style={{ padding: '0.45rem' }}
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Minimum Rating
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {[4, 3, 2].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <button
                key={stars}
                onClick={() => setMinRating(isSelected ? undefined : stars)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--brand-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                  border: 'none',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24' }}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} fill="#fbbf24" />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

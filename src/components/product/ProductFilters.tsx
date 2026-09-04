import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useFilterStore } from '../../store/filterStore';
import { RotateCcw, Filter, Star, CheckSquare, Square, Sparkles, Tag, Layers } from 'lucide-react';

export const ProductFilters: React.FC = () => {
  const { data: categories = [] } = useCategories();
  const {
    filters,
    inStockOnly,
    setCategory,
    setSubcategory,
    setPriceRange,
    setMinRating,
    setSortBy,
    setFeatured,
    setInStockOnly,
    resetFilters,
  } = useFilterStore();

  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
  ] as const;

  const pricePresets = [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
    { label: '₹2,500+', min: 2500, max: undefined },
  ];

  // Count active filters
  const activeFilterCount = [
    filters.category,
    filters.subcategoryId,
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    filters.minRating !== undefined,
    filters.featured,
    inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="fb-filters-panel">
      {/* Header */}
      <div className="fb-filters-header">
        <div className="fb-filters-title-wrap">
          <Filter size={18} className="fb-filters-icon" />
          <span className="fb-filters-title">Filter Products</span>
          {activeFilterCount > 0 && (
            <span className="fb-filters-count-badge">{activeFilterCount}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="fb-filters-reset-btn"
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Sort By */}
      <div className="fb-filter-section">
        <label className="fb-filter-section-title">
          <span>Sort By</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="fb-filter-select"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Categories */}
      <div className="fb-filter-section">
        <label className="fb-filter-section-title">
          <Layers size={15} />
          <span>Categories</span>
        </label>
        <div className="fb-filter-categories-list">
          <button
            type="button"
            onClick={() => setCategory(undefined)}
            className={`fb-category-item-btn ${!filters.category ? 'active' : ''}`}
          >
            <span>All Categories</span>
          </button>

          {categories.filter((cat) => cat.isActive).map((cat) => {
            const isSelected = filters.category === cat.slug || filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(isSelected ? undefined : (cat.slug || cat.id))}
                className={`fb-category-item-btn ${isSelected ? 'active' : ''}`}
              >
                <span className="fb-cat-name">{cat.name}</span>
                {cat._count?.products !== undefined && (
                  <span className="fb-cat-count">{cat._count.products}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filters.category && (() => {
        const selected = categories.find((cat) => filters.category === cat.slug || filters.category === cat.id);
        const children = (selected?.subcategories || []).filter((sub) => sub.isActive);
        return children.length > 0 ? (
          <div className="fb-filter-section">
            <label className="fb-filter-section-title"><Layers size={15} /><span>Subcategories</span></label>
            <div className="fb-filter-categories-list">
              <button type="button" onClick={() => setSubcategory(undefined)} className={`fb-category-item-btn ${!filters.subcategoryId ? 'active' : ''}`}>All {selected?.name}</button>
              {children.map((sub) => (
                <button key={sub.id} type="button" onClick={() => setSubcategory(filters.subcategoryId === sub.id ? undefined : sub.id)} className={`fb-category-item-btn ${filters.subcategoryId === sub.id ? 'active' : ''}`}>
                  <span className="fb-cat-name">{sub.name}</span><span className="fb-cat-count">{sub._count?.products ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* 3. Price Range */}
      <div className="fb-filter-section">
        <label className="fb-filter-section-title">
          <Tag size={15} />
          <span>Price Range (₹)</span>
        </label>
        
        {/* Quick Presets */}
        <div className="fb-price-presets-grid">
          {pricePresets.map((preset, idx) => {
            const isPresetActive =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (isPresetActive) {
                    setPriceRange(undefined, undefined);
                  } else {
                    setPriceRange(preset.min, preset.max);
                  }
                }}
                className={`fb-price-preset-pill ${isPresetActive ? 'active' : ''}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs */}
        <div className="fb-price-inputs-row">
          <div className="fb-price-input-box">
            <span className="fb-currency-prefix">₹</span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                setPriceRange(
                  e.target.value ? Number(e.target.value) : undefined,
                  filters.maxPrice
                )
              }
              className="fb-price-input"
            />
          </div>
          <span className="fb-price-dash">-</span>
          <div className="fb-price-input-box">
            <span className="fb-currency-prefix">₹</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                setPriceRange(
                  filters.minPrice,
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="fb-price-input"
            />
          </div>
        </div>
      </div>

      {/* 4. Customer Rating */}
      <div className="fb-filter-section">
        <label className="fb-filter-section-title">
          <Star size={15} />
          <span>Minimum Rating</span>
        </label>
        <div className="fb-ratings-list">
          {[4, 3, 2].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => setMinRating(isSelected ? undefined : stars)}
                className={`fb-rating-btn ${isSelected ? 'active' : ''}`}
              >
                <div className="fb-stars-wrap">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < stars ? '#f59e0b' : '#e2e8f0'}
                      color={i < stars ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
                <span className="fb-rating-text">{stars} Stars & Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Availability & Special Filters */}
      <div className="fb-filter-section">
        <label className="fb-filter-section-title">
          <span>Availability & Offers</span>
        </label>
        <div className="fb-checkbox-list">
          {/* In Stock Only */}
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className="fb-checkbox-row-btn"
          >
            {inStockOnly ? (
              <CheckSquare size={17} className="fb-checkbox-checked" />
            ) : (
              <Square size={17} className="fb-checkbox-unchecked" />
            )}
            <span className="fb-checkbox-label">In Stock Only</span>
          </button>

          {/* Featured Only */}
          <button
            type="button"
            onClick={() => setFeatured(!filters.featured ? true : undefined)}
            className="fb-checkbox-row-btn"
          >
            {filters.featured ? (
              <CheckSquare size={17} className="fb-checkbox-checked" />
            ) : (
              <Square size={17} className="fb-checkbox-unchecked" />
            )}
            <span className="fb-checkbox-label">
              <Sparkles size={13} color="#f59e0b" style={{ display: 'inline', marginRight: 4 }} />
              Featured Products Only
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

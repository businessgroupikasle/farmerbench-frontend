import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { useCategories } from '../../hooks/useCategories';
import { useFilterStore } from '../../store/filterStore';
import { productService } from '../../services/product.service';
import { RotateCcw, Filter, Star, CheckSquare, Square, Sparkles, Tag, Layers } from 'lucide-react';

interface ProductFiltersProps {
  onCategoryChange?: (category: string | undefined) => void;
  onSubcategoryChange?: (subcategoryId: string | undefined) => void;
  onResetFilters?: () => void;
  onFilterApplied?: (options?: { keepMobileOpen?: boolean }) => void;
  resultCount?: number;
  onCloseMobileFilters?: () => void;
}

const parsePositivePrice = (raw: string): number | undefined => {
  if (!raw.trim()) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onCategoryChange,
  onSubcategoryChange,
  onResetFilters,
  onFilterApplied,
  resultCount,
  onCloseMobileFilters,
}) => {
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

  const selectedCategory = categories.find(
    (category) => filters.category === category.slug || filters.category === category.id
  );
  const activeSubcategories = (selectedCategory?.subcategories || []).filter(
    (subcategory) => subcategory.isActive
  );

  const isPriceRangeInvalid =
    filters.minPrice !== undefined &&
    filters.maxPrice !== undefined &&
    filters.minPrice > filters.maxPrice;

  const subcategoryCountQueries = useQueries({
    queries: activeSubcategories.map((subcategory) => ({
      queryKey: [
        'products',
        'subcategory-count',
        subcategory.id,
        filters.search || '',
        !isPriceRangeInvalid ? filters.minPrice ?? null : null,
        !isPriceRangeInvalid ? filters.maxPrice ?? null : null,
        filters.minRating ?? null,
        Boolean(filters.featured),
      ],
      queryFn: async () => {
        const response = await productService.getProducts({
          subcategoryId: subcategory.id,
          ...(filters.search ? { search: filters.search } : {}),
          ...(!isPriceRangeInvalid && filters.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
          ...(!isPriceRangeInvalid && filters.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
          ...(filters.minRating !== undefined ? { minRating: filters.minRating } : {}),
          ...(filters.featured ? { featured: filters.featured } : {}),
          page: 1,
          limit: 1,
          sortBy: 'newest',
        });
        return response.pagination.total;
      },
      staleTime: 1000 * 60 * 2,
    })),
  });

  const subcategoryCounts = new Map(
    activeSubcategories.map((subcategory, index) => [
      subcategory.id,
      subcategoryCountQueries[index]?.data ?? subcategory._count?.products ?? 0,
    ])
  );

  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Best Selling', value: 'best_selling' },
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

  const handleCategorySelect = (
    nextCategory: string | undefined,
    hasActiveChildren = false
  ) => {
    if (onCategoryChange) {
      onCategoryChange(nextCategory);
    } else {
      setCategory(nextCategory);
    }
    onFilterApplied?.({ keepMobileOpen: hasActiveChildren });
  };

  const handleSubcategorySelect = (nextSubcategoryId: string | undefined) => {
    if (onSubcategoryChange) {
      onSubcategoryChange(nextSubcategoryId);
    } else {
      setSubcategory(nextSubcategoryId);
    }
    onFilterApplied?.();
  };

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      resetFilters();
    }
    onFilterApplied?.();
  };

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
            onClick={handleReset}
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
          onChange={(e) => {
            setSortBy(e.target.value as any);
            onFilterApplied?.();
          }}
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
            onClick={() => handleCategorySelect(undefined, false)}
            className={`fb-category-item-btn ${!filters.category ? 'active' : ''}`}
          >
            <span>All Categories</span>
          </button>

          {categories.filter((cat) => cat.isActive).map((cat) => {
            const isSelected = filters.category === cat.slug || filters.category === cat.id;
            const hasChildren = (cat.subcategories || []).some((sub) => sub.isActive);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  handleCategorySelect(
                    isSelected ? undefined : (cat.slug || cat.id),
                    !isSelected && hasChildren
                  )
                }
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
        const selected = selectedCategory;
        const children = activeSubcategories;
        return children.length > 0 ? (
          <div className="fb-filter-section">
            <label className="fb-filter-section-title"><Layers size={15} /><span>Subcategories</span></label>
            <div className="fb-filter-categories-list">
              <button
                type="button"
                onClick={() => handleSubcategorySelect(undefined)}
                className={`fb-category-item-btn ${!filters.subcategoryId ? 'active' : ''}`}
              >
                All {selected?.name}
              </button>
              {children.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() =>
                    handleSubcategorySelect(
                      filters.subcategoryId === sub.id ? undefined : sub.id
                    )
                  }
                  className={`fb-category-item-btn ${filters.subcategoryId === sub.id ? 'active' : ''}`}
                >
                  <span className="fb-cat-name">{sub.name}</span>
                  <span className="fb-cat-count">{subcategoryCounts.get(sub.id) ?? 0}</span>
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
                  onFilterApplied?.();
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
              min="1"
              aria-label="Minimum price"
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                setPriceRange(
                  parsePositivePrice(e.target.value),
                  filters.maxPrice
                )
              }
              onBlur={() => {
                if (!isPriceRangeInvalid && filters.minPrice !== undefined) {
                  onFilterApplied?.();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isPriceRangeInvalid) {
                  onFilterApplied?.();
                }
              }}
              className="fb-price-input"
            />
          </div>
          <span className="fb-price-dash">-</span>
          <div className="fb-price-input-box">
            <span className="fb-currency-prefix">₹</span>
            <input
              type="number"
              placeholder="Max"
              min="1"
              aria-label="Maximum price"
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                setPriceRange(
                  filters.minPrice,
                  parsePositivePrice(e.target.value)
                )
              }
              onBlur={() => {
                if (!isPriceRangeInvalid && filters.maxPrice !== undefined) {
                  onFilterApplied?.();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isPriceRangeInvalid) {
                  onFilterApplied?.();
                }
              }}
              className="fb-price-input"
            />
          </div>
        </div>
        {isPriceRangeInvalid && (
          <p className="fb-price-range-hint" role="alert">
            Min price should not exceed Max price.
          </p>
        )}
      </div>

      {/* 4. Customer Rating */}
      <div className="fb-filter-section">
        <label className="fb-filter-section-title">
          <Star size={15} />
          <span>Minimum Rating</span>
        </label>
        <div className="fb-ratings-list">
          {[5, 4, 3, 2].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => {
                  setMinRating(isSelected ? undefined : stars);
                  onFilterApplied?.();
                }}
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
                <span className="fb-rating-text">
                  {stars === 5 ? '5 Stars' : `${stars} Stars & Up`}
                </span>
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
            onClick={() => {
              setInStockOnly(!inStockOnly);
              onFilterApplied?.();
            }}
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
            onClick={() => {
              setFeatured(!filters.featured ? true : undefined);
              onFilterApplied?.();
            }}
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

      {onCloseMobileFilters && (
        <button
          type="button"
          onClick={onCloseMobileFilters}
          className="fb-mobile-filters-done-btn hide-desktop"
        >
          {typeof resultCount === 'number'
            ? `View ${resultCount} ${resultCount === 1 ? 'Result' : 'Results'}`
            : 'Apply & View Results'}
        </button>
      )}
    </div>
  );
};

export default ProductFilters;

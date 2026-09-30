import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useFilterStore } from '../store/filterStore';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductHero } from '../components/product/ProductHero';
import { CompareDrawer } from '../components/product/CompareDrawer';
import { Pagination } from '../components/common/Pagination';
import { getUploadUrl } from '../utils/image';
import organicReference from '../assets/categories/organic-farming.png';
import chemicalReference from '../assets/categories/chemical.png';
import trapsReference from '../assets/categories/traps.png';
import seedlingsReference from '../assets/categories/seedlings.png';
import seedsReference from '../assets/categories/seeds.png';
import farmEquipmentReference from '../assets/categories/farm-equipment.png?url';
import bananaReference from '../assets/crops/banana.jpg';
import coconutReference from '../assets/crops/coconut.jpg';
import fungicideReference from '../assets/trichoderma-fungicide.jpg';
import { X, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import './ProductsPage.css';

const MAIN_CATEGORY_IMAGES: Record<string, string> = {
  'organic-farming': organicReference,
  chemical: chemicalReference,
  traps: trapsReference,
  seedlings: seedlingsReference,
  seeds: seedsReference,
  'farm-equipment': farmEquipmentReference,
};
const SUBCATEGORY_REFERENCE_IMAGES: Record<string, string> = {
  'bio-fertilizers': organicReference,
  'bio-fungicides': fungicideReference,
  'bio-pesticides': organicReference,
  'bio-stimulants': organicReference,
  'pheromone-trap': trapsReference,
  'sticky-traps': trapsReference,
  'light-traps': trapsReference,
  papaya: seedlingsReference,
  'tissue-culture-banana': bananaReference,
  'tuber-banana': bananaReference,
  watermelon: seedlingsReference,
  muskmelon: seedlingsReference,
  'fruit-trees': seedlingsReference,
  coconut: coconutReference,
  arecanut: coconutReference,
  pepper: seedlingsReference,
  others: seedlingsReference,
  'horticulture-crops': seedsReference,
  'field-crops': seedsReference,
};

const subcategoryReferenceKey = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filters,
    inStockOnly,
    setCategory,
    setSubcategory,
    setSearch,
    setPriceRange,
    setMinRating,
    setSortBy,
    setLimit,
    setPage,
    setInStockOnly,
    resetFilters,
  } = useFilterStore();

  const { data: apiCategories = [] } = useCategories();
  const { data: mobileCatalogResponse } = useProducts({ page: 1, limit: 100 });
  const mobileCatalogProducts = mobileCatalogResponse?.data || [];
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const categoryPillsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleCatalogSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleHeroSearch(searchTerm.trim());
  };

  const handleClearCatalogSearch = () => {
    setSearchTerm('');
    handleHeroSearch('');
  };

  const scrollCategoryPills = (direction: -1 | 1) => {
    categoryPillsRef.current?.scrollBy({
      left: direction * Math.max(180, categoryPillsRef.current.clientWidth * 0.7),
      behavior: 'smooth',
    });
  };

  // Sync URL query parameters with filterStore on initial load and param change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSubcategory = searchParams.get('subcategory');
    const urlSearch = searchParams.get('search');
    const urlFeatured = searchParams.get('featured') === 'true';
    const urlSort = searchParams.get('sort');
    const urlPage = searchParams.get('page');

    if (urlCategory) {
      setCategory(urlCategory);
    }
    setSubcategory(urlSubcategory || undefined);
    if (urlSearch) {
      setSearch(urlSearch);
    }
    if (urlFeatured) {
      useFilterStore.setState((state) => ({
        filters: { ...state.filters, featured: true, page: 1 },
      }));
    }
    if (urlSort && ['newest', 'price_asc', 'price_desc', 'rating', 'popular'].includes(urlSort)) {
      setSortBy(urlSort as any);
    }
    if (urlPage && !isNaN(Number(urlPage))) {
      setPage(Number(urlPage));
    }
  }, [searchParams]);

  // Handle Hero search submit
  const handleHeroSearch = (term: string) => {
    setSearch(term || undefined);
    const nextParams = new URLSearchParams(searchParams);
    if (term) {
      nextParams.set('search', term);
    } else {
      nextParams.delete('search');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Category navigation pill click
  const handleCategoryClick = (catSlug: string) => {
    const nextCat = catSlug || undefined;
    setCategory(nextCat);
    const nextParams = new URLSearchParams(searchParams);
    if (nextCat) {
      nextParams.set('category', nextCat);
    } else {
      nextParams.delete('category');
    }
    nextParams.delete('subcategory');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const activeCategories = apiCategories.filter((category) => category.isActive);

  const firstProductImage = (product?: (typeof mobileCatalogProducts)[number]) =>
    product?.images?.find((image) => Boolean(image));

  const categoryImage = (category: { id: string; slug?: string | null; imageUrl?: string | null }) => {
    const categoryKey = (category.slug || '').toLowerCase();
    const localImage = MAIN_CATEGORY_IMAGES[categoryKey];
    if (localImage) return localImage;
    const uploadedImage = category.imageUrl
      || firstProductImage(mobileCatalogProducts.find((product) => product.categoryId === category.id));
    return uploadedImage ? getUploadUrl(uploadedImage) : undefined;
  };

  const subcategoryImage = (subcategory: { id: string; name: string; imageUrl?: string | null }, categoryId: string) => {
    const searchName = subcategory.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const categoryProducts = mobileCatalogProducts.filter((product) => product.categoryId === categoryId);
    const matchedProduct = categoryProducts.find((product) => product.subcategoryId === subcategory.id)
      || categoryProducts.find((product) => product.subcategory?.name?.toLowerCase() === subcategory.name.toLowerCase())
      || categoryProducts.find((product) => {
        const productTitle = product.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
        return searchName.length > 2 && (productTitle.includes(searchName) || searchName.split(' ').some((word) => word.length > 3 && productTitle.includes(word)));
      })
      || categoryProducts.find((product) => firstProductImage(product));
    const productImage = firstProductImage(matchedProduct);
    if (productImage) return getUploadUrl(productImage);
    if (subcategory.imageUrl) return getUploadUrl(subcategory.imageUrl);
    return SUBCATEGORY_REFERENCE_IMAGES[subcategoryReferenceKey(subcategory.name)];
  };

  const handleSubcategoryClick = (categorySlug: string, subcategoryId: string) => {
    setCategory(categorySlug);
    setSubcategory(subcategoryId);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('category', categorySlug);
    nextParams.set('subcategory', subcategoryId);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Query database-backed products using existing productService & React Query
  const { data: response, isLoading, isError, refetch } = useProducts(filters);
  const rawProducts = response?.data || [];
  const pagination = response?.pagination;

  // Safe client-side in-stock filter when enabled
  const products = inStockOnly
    ? rawProducts.filter((p) => p.stock > 0)
    : rawProducts;

  // Category quick pills
  const categoryPills = [
    { id: '', name: 'All Products', slug: '' },
    ...apiCategories,
  ];

  // Active filters list for chips
  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];

  if (filters.search) {
    activeChips.push({
      id: 'search',
      label: `Search: "${filters.search}"`,
      onRemove: () => handleHeroSearch(''),
    });
  }

  if (filters.category) {
    const activeCategory = apiCategories.find(
      (c) => c.slug === filters.category || c.id === filters.category
    );
    activeChips.push({
      id: 'category',
      label: `Category: ${activeCategory?.name || filters.category}`,
      onRemove: () => handleCategoryClick(''),
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceText =
      filters.minPrice !== undefined && filters.maxPrice !== undefined
        ? `₹${filters.minPrice} - ₹${filters.maxPrice}`
        : filters.minPrice !== undefined
        ? `Min ₹${filters.minPrice}`
        : `Max ₹${filters.maxPrice}`;
    activeChips.push({
      id: 'price',
      label: `Price: ${priceText}`,
      onRemove: () => setPriceRange(undefined, undefined),
    });
  }

  if (filters.minRating !== undefined) {
    activeChips.push({
      id: 'rating',
      label: `Rating: ${filters.minRating}★ & Up`,
      onRemove: () => setMinRating(undefined),
    });
  }

  if (inStockOnly) {
    activeChips.push({
      id: 'instock',
      label: 'In Stock Only',
      onRemove: () => setInStockOnly(false),
    });
  }

  if (filters.featured) {
    activeChips.push({
      id: 'featured',
      label: 'Featured Items',
      onRemove: () => useFilterStore.setState((s) => ({ filters: { ...s.filters, featured: undefined } })),
    });
  }

  return (
    <div className={'fb-products-page ' + (!filters.category ? 'is-mobile-category-index' : 'is-mobile-product-results')}>
      {/* 1. Promotional Hero Banner matching reference design */}
      <ProductHero
        initialSearch={filters.search || ''}
        onSearch={handleHeroSearch}
        storeName="GREENLA AGRI STORE"
      />

      {/* 2. Catalog Navigation Bar & Quick Filters */}
      <section className="fb-catalog-header" id="products-catalog-section" aria-label="Catalog Navigation">
        {/* Category Pills Bar */}
        <div className="fb-catalog-pills-bar">
          <button type="button" className="fb-category-scroll-btn fb-category-scroll-prev" onClick={() => scrollCategoryPills(-1)} aria-label="Previous product categories">
            <ChevronLeft size={17} />
          </button>
          <div className="fb-category-pills-scroll" ref={categoryPillsRef}>
            {categoryPills.map((cat: any) => {
              const catSlug = cat.slug || cat.id || '';
              const isActive = (!filters.category && !catSlug) || filters.category === catSlug;
              return (
                <button
                  key={catSlug || 'all'}
                  type="button"
                  onClick={() => handleCategoryClick(catSlug)}
                  className={`fb-category-pill ${isActive ? 'active' : ''}`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="fb-category-scroll-btn fb-category-scroll-next" onClick={() => scrollCategoryPills(1)} aria-label="Next product categories">
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Catalog Control Bar (Title, Active Chips, Quick Sort, Mobile Toggle) */}
        <div className="fb-catalog-controls-bar">
          <div className="fb-catalog-summary">
            <h2 className="fb-catalog-title">
              {filters.search
                ? `Results for "${filters.search}"`
                : filters.category
                ? `${apiCategories.find((c) => c.slug === filters.category || c.id === filters.category)?.name || filters.category} Catalog`
                : 'All Agricultural Catalogue'}
            </h2>
            <span className="fb-catalog-count-text">
              {pagination
                ? `Showing ${products.length} of ${pagination.total} genuine products`
                : 'Loading products...'}
            </span>
          </div>

          <div className="fb-catalog-toolbar-actions">
            {/* Desktop Catalog Search Bar - hidden on mobile view */}
            <form onSubmit={handleCatalogSearchSubmit} className="fb-catalog-search-form hide-mobile" role="search">
              <div className="fb-catalog-search-input-wrap">
                <Search size={16} className="fb-catalog-search-icon" aria-hidden="true" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search catalogue..."
                  className="fb-catalog-search-input"
                  aria-label="Search catalog products"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearCatalogSearch}
                    className="fb-catalog-search-clear-btn"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <button type="submit" className="fb-catalog-search-btn">
                Search
              </button>
            </form>

            {/* Quick Sort dropdown */}
            <div className="fb-catalog-quick-sort">
              <ArrowUpDown size={15} className="fb-sort-icon" />
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="fb-quick-sort-select"
                aria-label="Sort products by"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="fb-mobile-filter-btn hide-desktop"
              aria-label="Toggle filter sidebar"
            >
              <SlidersHorizontal size={16} />
              <span>{showMobileFilters ? 'Hide Filters' : 'Filters'}</span>
              {activeChips.length > 0 && (
                <span className="fb-mobile-filter-badge">{activeChips.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {activeChips.length > 0 && (
          <div className="fb-active-chips-row">
            <span className="fb-chips-label">Active filters:</span>
            {activeChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.onRemove}
                className="fb-filter-chip"
                title={`Remove ${chip.label}`}
              >
                <span>{chip.label}</span>
                <X size={13} />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="fb-clear-all-chips-btn"
            >
              Clear All
            </button>
          </div>
        )}
      </section>


      {!filters.category && (
      <section className="fb-mobile-category-panel" aria-labelledby="fb-mobile-category-title">
        <header className="fb-mobile-category-banner">
          <div>
            <span>SELECT PRODUCT</span>
            <strong id="fb-mobile-category-title">CATEGORY</strong>
          </div>
          <span className="fb-mobile-category-banner-art" aria-hidden="true">AG</span>
        </header>

        <div className="fb-mobile-category-content">
          <h3 className="fb-mobile-category-section-title">Main Categories</h3>
          <nav className="fb-mobile-subcategory-nav" aria-label="Main product categories">
            {activeCategories.map((category) => {
              const categorySlug = category.slug || category.id;
              const selected = filters.category === categorySlug && !filters.subcategoryId;
              return (
                <button key={category.id} type="button" className={'fb-mobile-subcategory-item ' + (selected ? 'active' : '')} onClick={() => handleCategoryClick(categorySlug)} aria-pressed={selected}>
                  <span className="fb-mobile-subcategory-image-wrap">
                    {categoryImage(category) ? <img src={categoryImage(category)} alt="" loading="lazy" /> : <span aria-hidden="true">{category.name.charAt(0)}</span>}
                  </span>
                  <span className="fb-mobile-subcategory-name">{category.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="fb-mobile-subcategory-groups">
            {activeCategories.map((category) => {
              const children = (category.subcategories || []).filter((subcategory) => subcategory.isActive);
              if (!children.length) return null;
              const categorySlug = category.slug || category.id;
              return (
                <section key={category.id} className="fb-mobile-subcategory-group" aria-labelledby={'mobile-subcategory-' + category.id}>
                  <h3 id={'mobile-subcategory-' + category.id}>{category.name}</h3>
                  <nav className="fb-mobile-subcategory-nav" aria-label={category.name + ' subcategories'}>
                    {children.map((subcategory) => (
                      <button key={subcategory.id} type="button" className={'fb-mobile-subcategory-item ' + (filters.subcategoryId === subcategory.id ? 'active' : '')} onClick={() => handleSubcategoryClick(categorySlug, subcategory.id)} aria-pressed={filters.subcategoryId === subcategory.id}>
                        <span className="fb-mobile-subcategory-image-wrap">
                          {subcategoryImage(subcategory, category.id) ? <img src={subcategoryImage(subcategory, category.id)} alt="" loading="lazy" /> : <span aria-hidden="true">{subcategory.name.charAt(0)}</span>}
                        </span>
                        <span className="fb-mobile-subcategory-name">{subcategory.name}</span>
                      </button>
                    ))}
                  </nav>
                </section>
              );
            })}
          </div>
        </div>
      </section>
      )}
      {filters.category && (
        <button type="button" className="fb-mobile-back-to-categories hide-desktop" onClick={() => handleCategoryClick('')}>
          <ChevronLeft size={18} /> Back to Categories
        </button>
      )}
      {/* 3. Main Catalog Grid (Sticky Sidebar + Product Grid) */}
      <div className="fb-catalog-main-layout">
        {/* Left Sidebar Filters */}
        <aside
          className={`fb-catalog-sidebar ${showMobileFilters ? 'mobile-open' : ''}`}
          aria-label="Product Filters"
        >
          <div className="fb-sidebar-inner">
            <ProductFilters />
          </div>
        </aside>

        {/* Right Product Grid & Pagination */}
        <main className="fb-catalog-grid-section">
          {isError ? (
            <div className="fb-error-container">
              <p>Unable to load products. Please check your internet connection.</p>
              <button onClick={() => refetch()} className="btn btn-primary btn-sm">
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onResetFilters={resetFilters}
            />
          )}

          {/* Server-Side Pagination with Page Size Options */}
          {pagination && pagination.totalPages > 1 && (
            <div className="fb-pagination-wrapper">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                limit={filters.limit || 12}
                onLimitChange={(newLimit) => setLimit(newLimit)}
                totalItems={pagination.total}
                onPageChange={(page) => {
                  setPage(page);
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set('page', String(page));
                  setSearchParams(nextParams);
                  const catalogEl = document.getElementById('products-catalog-section');
                  if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* 4. Compare Drawer (Floating bottom bar & modal) */}
      <CompareDrawer />
    </div>
  );
};

export default ProductsPage;

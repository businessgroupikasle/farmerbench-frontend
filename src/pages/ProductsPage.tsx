import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const subcategoryReferenceKey = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const {
    filters,
    inStockOnly,
    setCategory,
    setSubcategory,
    setSearch,
    setPriceRange,
    setMinRating,
    setSortBy,
    setFeatured,
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
  const wasUrlFeaturedRef = useRef<boolean | null>(null);
  const lastScrolledSearchRef = useRef<string>('');
  const pendingSearchScrollRef = useRef<boolean>(false);
  const hasCheckedInitialHashRef = useRef<boolean>(false);
  const lastNavScrollKeyRef = useRef<string>('');

  const scrollToCatalogResults = (
    targetId: 'products-catalog-section' | 'products-results-grid' = 'products-catalog-section',
    behavior: ScrollBehavior = 'smooth'
  ) => {
    requestAnimationFrame(() => {
      const el =
        document.getElementById(targetId) ||
        document.getElementById('products-catalog-section');
      if (el) {
        el.scrollIntoView({ behavior, block: 'start' });
      }
    });
  };

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

    let resolvedSubcategoryId: string | undefined;
    if (urlSubcategory) {
      for (const cat of apiCategories) {
        const match = (cat.subcategories || []).find(
          (sub) => sub.id === urlSubcategory || sub.slug === urlSubcategory
        );
        if (match) {
          resolvedSubcategoryId = match.id;
          break;
        }
      }
      if (!resolvedSubcategoryId && UUID_REGEX.test(urlSubcategory)) {
        resolvedSubcategoryId = urlSubcategory;
      }
    }

    // The URL is the source of truth: a bare /products must not keep a stale category/search
    setCategory(urlCategory || undefined);
    setSubcategory(resolvedSubcategoryId);
    setSearch(urlSearch || undefined);

    if (urlFeatured) {
      setFeatured(true);
    } else if (wasUrlFeaturedRef.current === null || wasUrlFeaturedRef.current === true) {
      setFeatured(undefined);
    }
    wasUrlFeaturedRef.current = urlFeatured;

    if (
      urlSort &&
      ['newest', 'price_asc', 'price_desc', 'rating', 'popular', 'best_selling'].includes(urlSort)
    ) {
      setSortBy(urlSort as any);
    }
    if (urlPage && !isNaN(Number(urlPage)) && Number(urlPage) >= 1) {
      setPage(Number(urlPage));
    }

    const trimmedSearch = (urlSearch || '').trim();
    const shouldScrollInitialHash =
      !hasCheckedInitialHashRef.current && location.hash === '#products-catalog-section';
    const shouldScrollFromNavState =
      Boolean((location.state as { scrollToSearchResults?: boolean } | null)?.scrollToSearchResults) &&
      lastNavScrollKeyRef.current !== location.key;
    hasCheckedInitialHashRef.current = true;

    if (shouldScrollFromNavState) {
      lastNavScrollKeyRef.current = location.key;
    }

    if (trimmedSearch && (lastScrolledSearchRef.current !== trimmedSearch || shouldScrollFromNavState)) {
      const isInitialSearchMount = lastScrolledSearchRef.current === '';
      lastScrolledSearchRef.current = trimmedSearch;
      pendingSearchScrollRef.current = true;
      scrollToCatalogResults('products-catalog-section', isInitialSearchMount ? 'instant' : 'smooth');
    } else if (!trimmedSearch) {
      lastScrolledSearchRef.current = '';
      pendingSearchScrollRef.current = false;
      if (shouldScrollInitialHash || shouldScrollFromNavState) {
        scrollToCatalogResults('products-catalog-section', 'instant');
      }
    }
  }, [searchParams, apiCategories, location.hash, location.key, location.state]);

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
    setShowMobileFilters(false);
    setSearchParams(nextParams);
    if (term) {
      lastScrolledSearchRef.current = term;
      pendingSearchScrollRef.current = true;
      scrollToCatalogResults('products-catalog-section', 'smooth');
    }
  };

  const hasActiveCatalogQuery = Boolean(
    filters.category ||
      filters.subcategoryId ||
      filters.search ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.minRating !== undefined ||
      filters.featured ||
      inStockOnly ||
      searchParams.get('sort')
  );

  // Category navigation pill click - keep user at current scroll position unless leaving mobile category index
  const handleCategoryClick = (catSlug: string) => {
    const wasMobileCategoryIndex = !hasActiveCatalogQuery;
    const nextCat = catSlug || undefined;
    setCategory(nextCat);
    setSubcategory(undefined);
    const nextParams = new URLSearchParams(searchParams);
    if (nextCat) {
      nextParams.set('category', nextCat);
    } else {
      nextParams.delete('category');
    }
    nextParams.delete('subcategory');
    nextParams.set('page', '1');
    setShowMobileFilters(false);
    setSearchParams(nextParams);
    if (nextCat && wasMobileCategoryIndex && window.matchMedia('(max-width: 540px)').matches) {
      scrollToCatalogResults('products-catalog-section', 'instant');
    }
  };

  // Sidebar Category change preserves drawer if category has subcategories
  const handleSidebarCategoryChange = (nextCat: string | undefined) => {
    setCategory(nextCat);
    setSubcategory(undefined);
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

  const handleSubcategoryFilterChange = (subId: string | undefined) => {
    setSubcategory(subId);
    const nextParams = new URLSearchParams(searchParams);
    if (subId) {
      nextParams.set('subcategory', subId);
    } else {
      nextParams.delete('subcategory');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleResetAllFilters = () => {
    resetFilters();
    setSearchTerm('');
    setShowMobileFilters(false);
    setSearchParams({});
  };

  const handleSidebarFilterApplied = (options?: { keepMobileOpen?: boolean }) => {
    if (showMobileFilters && !options?.keepMobileOpen) {
      setShowMobileFilters(false);
      scrollToCatalogResults('products-catalog-section', 'smooth');
    }
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
    setShowMobileFilters(false);
    setSearchParams(nextParams);
    scrollToCatalogResults('products-catalog-section');
  };

  // Query database-backed products using existing productService & React Query
  // Guard minPrice/maxPrice > 0 to satisfy backend .positive() schema validation
  const sanitizedFilters = {
    ...filters,
    minPrice: filters.minPrice !== undefined && filters.minPrice > 0 ? filters.minPrice : undefined,
    maxPrice: filters.maxPrice !== undefined && filters.maxPrice > 0 ? filters.maxPrice : undefined,
  };
  const pageSize = filters.limit || 12;
  const requestedPage = filters.page || 1;
  const queryFilters = inStockOnly
    ? { ...sanitizedFilters, page: 1, limit: Math.max(pageSize, 100) }
    : sanitizedFilters;

  const { data: response, isLoading, isError, refetch } = useProducts(queryFilters);

  useEffect(() => {
    const cancelPendingSearchScroll = () => {
      pendingSearchScrollRef.current = false;
    };
    window.addEventListener('wheel', cancelPendingSearchScroll, { passive: true });
    window.addEventListener('touchstart', cancelPendingSearchScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', cancelPendingSearchScroll);
      window.removeEventListener('touchstart', cancelPendingSearchScroll);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && pendingSearchScrollRef.current) {
      pendingSearchScrollRef.current = false;
      scrollToCatalogResults('products-catalog-section', 'instant');
    }
  }, [isLoading]);
  const rawProducts = response?.data || [];
  const rawPagination = response?.pagination;

  // Accurate client-side in-stock filtering, total count, and pagination
  const inStockProducts = inStockOnly
    ? rawProducts.filter((p) => p.stock > 0)
    : rawProducts;
  const totalMatchingCount = inStockOnly
    ? inStockProducts.length
    : (rawPagination?.total ?? rawProducts.length);
  const totalPages = inStockOnly
    ? Math.max(1, Math.ceil(totalMatchingCount / pageSize))
    : (rawPagination?.totalPages ?? 1);
  const currentPage = inStockOnly
    ? Math.min(requestedPage, totalPages)
    : (rawPagination?.page ?? requestedPage);
  const products = inStockOnly
    ? inStockProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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

  if (filters.subcategoryId) {
    const activeSubcategory = apiCategories
      .flatMap((c) => c.subcategories || [])
      .find((s) => s.id === filters.subcategoryId || s.slug === filters.subcategoryId);
    activeChips.push({
      id: 'subcategory',
      label: `Subcategory: ${activeSubcategory?.name || filters.subcategoryId}`,
      onRemove: () => handleSubcategoryFilterChange(undefined),
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
      onRemove: () => {
        setPriceRange(undefined, undefined);
      },
    });
  }

  if (filters.minRating !== undefined) {
    activeChips.push({
      id: 'rating',
      label: filters.minRating === 5 ? 'Rating: 5★' : `Rating: ${filters.minRating}★ & Up`,
      onRemove: () => {
        setMinRating(undefined);
      },
    });
  }

  if (inStockOnly) {
    activeChips.push({
      id: 'instock',
      label: 'In Stock Only',
      onRemove: () => {
        setInStockOnly(false);
      },
    });
  }

  if (filters.featured) {
    activeChips.push({
      id: 'featured',
      label: 'Featured Items',
      onRemove: () => {
        setFeatured(undefined);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('featured');
        setSearchParams(nextParams);
      },
    });
  }

  return (
    <div
      className={
        'fb-products-page ' +
        (!hasActiveCatalogQuery ? 'is-mobile-category-index' : 'is-mobile-product-results')
      }
    >
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
              {isLoading && !response
                ? 'Loading products...'
                : `Showing ${products.length} of ${totalMatchingCount} genuine products`}
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
                value={filters.sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                }}
                className="fb-quick-sort-select"
                aria-label="Sort products by"
              >
                <option value="best_selling">Best Selling</option>
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
              onClick={handleResetAllFilters}
              className="fb-clear-all-chips-btn"
            >
              Clear All
            </button>
          </div>
        )}
      </section>

      {!hasActiveCatalogQuery && (
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
      {hasActiveCatalogQuery && (
        <button type="button" className="fb-mobile-back-to-categories hide-desktop" onClick={handleResetAllFilters}>
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
            <ProductFilters
              onCategoryChange={handleSidebarCategoryChange}
              onSubcategoryChange={handleSubcategoryFilterChange}
              onResetFilters={handleResetAllFilters}
              onFilterApplied={handleSidebarFilterApplied}
              resultCount={totalMatchingCount}
              onCloseMobileFilters={
                showMobileFilters
                  ? () => {
                      setShowMobileFilters(false);
                      scrollToCatalogResults('products-catalog-section');
                    }
                  : undefined
              }
            />
          </div>
        </aside>

        {/* Right Product Grid & Pagination */}
        <main className="fb-catalog-grid-section" id="products-results-grid">
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
              onResetFilters={handleResetAllFilters}
            />
          )}

          {/* Server-Side Pagination with Page Size Options */}
          {totalPages > 1 && (
            <div className="fb-pagination-wrapper">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                limit={pageSize}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                }}
                totalItems={totalMatchingCount}
                onPageChange={(page) => {
                  setPage(page);
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set('page', String(page));
                  setSearchParams(nextParams);
                  scrollToCatalogResults('products-catalog-section', 'smooth');
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

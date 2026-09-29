import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LoaderCircle, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { getUploadUrl } from '../../utils/image';
import './HomeMobileSearchBar.css';

export const HomeMobileSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLFormElement>(null);
  const canSearch = debouncedQuery.trim().length >= 2;
  const { data: productResponse, isFetching } = useProducts({ search: debouncedQuery.trim(), limit: 6 }, canSearch);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsFocused(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) setIsScrollHidden(false);
      else if (currentScrollY > lastScrollY + 6 && !isFocused) setIsScrollHidden(true);
      else if (currentScrollY < lastScrollY - 6) setIsScrollHidden(false);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFocused]);

  const suggestions = useMemo(() => productResponse?.data?.slice(0, 6) ?? [], [productResponse]);
  const showSuggestions = isFocused && query.trim().length >= 2;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const openProduct = (slugOrId: string) => {
    setIsFocused(false);
    setQuery('');
    navigate(`/product/${encodeURIComponent(slugOrId)}`);
  };

  return (
    <section className={'home-mobile-search-section' + (isScrollHidden ? ' home-mobile-search-section--scroll-hidden' : '')} aria-label="Quick product search">
      <div className="home-mobile-search-container">
        <form className="home-mobile-search-form" onSubmit={handleSearch} role="search" ref={searchRef}>
          <div className="home-mobile-search-input-wrap">
            <Search size={18} className="home-mobile-search-icon" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search 1000+ products, seeds, fertilizers..."
              aria-label="Search agricultural products"
              autoComplete="off"
              aria-expanded={showSuggestions}
              aria-controls="global-product-suggestions"
            />
            {query && (
              <button
                type="button"
                className="home-mobile-search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button type="submit" className="home-mobile-search-btn">
              Search
            </button>
          </div>

          {showSuggestions && (
            <div id="global-product-suggestions" className="home-product-suggestions" role="listbox">
              {isFetching ? (
                <div className="home-product-suggestion-status"><LoaderCircle size={17} className="home-product-search-spinner" /> Searching products...</div>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((product) => (
                    <button type="button" role="option" aria-selected="false" className="home-product-suggestion" key={product.id} onClick={() => openProduct(product.slug || product.id)}>
                      <span className="home-product-suggestion-image">{product.images?.[0] ? <img src={getUploadUrl(product.images[0])} alt="" /> : <Search size={16} aria-hidden="true" />}</span>
                      <span className="home-product-suggestion-copy"><strong>{product.title}</strong><small>{product.category?.name || 'Agricultural product'}</small></span>
                      <span className="home-product-suggestion-price">Rs. {Number(product.discountPrice ?? product.price).toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                  <button type="submit" className="home-product-suggestion-all">View all results for "{query.trim()}"</button>
                </>
              ) : <div className="home-product-suggestion-status">No matching products found.</div>}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default HomeMobileSearchBar;

import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import './HomeMobileSearchBar.css';

interface CategoryItem {
  id?: string;
  name: string;
  slug: string;
}

// Fallback main categories matching backend catalog schema
const DEFAULT_MAIN_CATEGORIES: CategoryItem[] = [
  { id: 'organic-farming', name: 'Organic Farming', slug: 'organic-farming' },
  { id: 'chemical', name: 'Chemical', slug: 'chemical' },
  { id: 'traps', name: 'Traps', slug: 'traps' },
  { id: 'Seedlings', name: 'Seedlings', slug: 'Seedlings' },
  { id: 'seeds', name: 'Seeds', slug: 'seeds' },
  { id: 'farm-equipment', name: 'Farm Equipment', slug: 'farm-equipment' },
];

export const HomeMobileSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { data: apiCategories = [] } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (slugOrId: string) => {
    navigate(`/products?category=${encodeURIComponent(slugOrId)}`);
  };

  // Use live main categories from database, or fallback
  const mainCategories: CategoryItem[] = apiCategories.length > 0
    ? apiCategories
        .filter((cat) => cat.isActive !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : DEFAULT_MAIN_CATEGORIES;

  // Format category name with clean Title Case (e.g. "Seedlings" -> "Seedlings")
  const formatCategoryName = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <section className="home-mobile-search-section" aria-label="Quick product search">
      <div className="home-mobile-search-container">
        <form className="home-mobile-search-form" onSubmit={handleSearch} role="search">
          <div className="home-mobile-search-input-wrap">
            <Search size={18} className="home-mobile-search-icon" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 1000+ products, seeds, fertilizers..."
              aria-label="Search agricultural products"
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
        </form>

        <div className="home-mobile-search-chips">
          <span className="home-mobile-chips-title">
            <Sparkles size={12} aria-hidden="true" /> Popular:
          </span>
          {mainCategories.map((cat) => {
            const slug = cat.slug || cat.id || cat.name;
            return (
              <button
                key={slug}
                type="button"
                className="home-mobile-chip"
                onClick={() => handleCategoryClick(slug)}
              >
                {formatCategoryName(cat.name)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeMobileSearchBar;

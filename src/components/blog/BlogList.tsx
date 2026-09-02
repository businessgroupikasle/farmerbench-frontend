import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { User, Calendar, ArrowRight, Search, Clock, RotateCcw } from 'lucide-react';
import { useBlogs, useBlogCategories } from '../../hooks/useBlogs';
import { getUploadUrl } from '../../utils/image';
import wheatImg from '../../assets/wheat-sunburst.jpg';

export const BlogList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const { data: categories = [] } = useBlogCategories();
  const { data: blogData, isLoading } = useBlogs({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery || undefined,
  });

  const posts = blogData?.blogs || [];

  const handleCategoryClick = (catSlug: string) => {
    setSelectedCategory(catSlug);
    const nextParams = new URLSearchParams(searchParams);
    if (catSlug && catSlug !== 'all') {
      nextParams.set('category', catSlug);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      nextParams.set('search', searchQuery.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <section className="blog-list-section" aria-label="Agricultural Articles">
      <div className="container">
        {/* Category Filters & Search */}
        <div className="blog-filters-row">
          <div className="blog-category-chips">
            <button
              type="button"
              onClick={() => handleCategoryClick('all')}
              className={`blog-cat-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              All Articles
            </button>
            {categories
              .filter((c) => c.slug !== 'all')
              .map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleCategoryClick(c.slug)}
                  className={`blog-cat-chip ${selectedCategory === c.slug ? 'active' : ''}`}
                >
                  <span>{c.name}</span>
                  <span className="blog-cat-count-pill">{c.count}</span>
                </button>
              ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="blog-search-box">
            <Search size={17} style={{ color: '#5D7A68' }} />
            <input
              type="text"
              placeholder="Search agriculture articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blog-search-input"
              aria-label="Search articles"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.delete('search');
                  setSearchParams(nextParams);
                }}
                className="blog-search-clear-btn"
                title="Clear search"
              >
                ×
              </button>
            )}
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="blog-cards-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="blog-card blog-card-skeleton animate-pulse-subtle">
                <div className="blog-card-img-wrap blog-skeleton-img" />
                <div className="blog-card-body">
                  <div className="blog-skeleton-line" style={{ width: '40%', height: 12 }} />
                  <div className="blog-skeleton-line" style={{ width: '90%', height: 20 }} />
                  <div className="blog-skeleton-line" style={{ width: '75%', height: 14 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="blog-empty-state">
            <div className="blog-empty-icon">🌾</div>
            <h3>No articles found</h3>
            <p>We couldn't find any articles matching your search or selected category.</p>
            <button onClick={handleResetFilters} className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        )}

        {/* 3-Column Blog Cards Grid */}
        {!isLoading && posts.length > 0 && (
          <div className="blog-cards-grid">
            {posts.map((post) => {
              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent';

              const coverImage = getUploadUrl(post.featuredImage, wheatImg);

              return (
                <Link
                  to={`/blog/${post.slug || post.id}`}
                  key={post.id}
                  className="blog-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="blog-card-img-wrap">
                    <img
                      src={coverImage}
                      alt={post.title}
                      loading="lazy"
                      onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;

                        (e.currentTarget as HTMLImageElement).src = wheatImg;
                      }}
                    />
                    <span className="blog-card-category-badge">{post.category}</span>
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span className="blog-card-meta-item">
                        <User size={13} /> {post.author || 'Agri Expert'}
                      </span>
                      <span className="blog-card-meta-item">
                        <Calendar size={13} /> {formattedDate}
                      </span>
                      {post.readingTime && (
                        <span className="blog-card-meta-item">
                          <Clock size={13} /> {post.readingTime}
                        </span>
                      )}
                    </div>

                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>

                    <span className="blog-card-read-more">
                      <span>Read Article</span>
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;

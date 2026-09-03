import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Sprout,
  Search,
  CheckCircle2,
  Share2,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
  Eye,
  Tag,
} from 'lucide-react';
import { useBlog, useRelatedBlogs, useBlogCategories, useBlogs } from '../hooks/useBlogs';
import { getUploadUrl } from '../utils/image';
import wheatImg from '../assets/wheat-sunburst.jpg';
import './BlogDetailPage.css';

export const BlogDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();

  const [sidebarSearch, setSidebarSearch] = useState('');
  const [copied, setCopied] = useState(false);

  // 1. Fetch live database blog post
  const { data: blog, isLoading, isError } = useBlog(idOrSlug);

  // 2. Fetch categories with counts
  const { data: categories = [] } = useBlogCategories();

  // 3. Fetch related articles
  const { data: relatedArticles = [] } = useRelatedBlogs(idOrSlug, blog?.category, 3);

  // 4. Fetch popular articles
  const { data: popularData } = useBlogs({ sortBy: 'popular', limit: 3 });
  const popularArticles = (popularData?.blogs || []).filter((b) => b.id !== blog?.id && b.slug !== blog?.slug).slice(0, 3);

  // Dynamic SEO management
  useEffect(() => {
    if (blog) {
      document.title = `${blog.metaTitle || blog.title} | AgriEra Agri Insights`;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', blog.metaDescription || blog.excerpt || blog.title);

      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', blog.metaTitle || blog.title);
      }
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', blog.metaDescription || blog.excerpt);
      }
    }

    return () => {
      document.title = 'AgriEra — Sustainable Agriculture & Commercial Inputs';
    };
  }, [blog]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSidebarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (sidebarSearch.trim()) {
      navigate(`/blog?search=${encodeURIComponent(sidebarSearch.trim())}`);
    }
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="blog-detail-layout">
        <div className="blog-detail-container">
          <div className="blog-detail-main-grid">
            <article className="animate-pulse-subtle">
              <div className="blog-skeleton-line" style={{ width: '25%', height: 24, borderRadius: 20 }} />
              <div className="blog-skeleton-line" style={{ width: '90%', height: 38, margin: '1rem 0' }} />
              <div className="blog-skeleton-line" style={{ width: '45%', height: 16, marginBottom: '1.5rem' }} />
              <div className="blog-skeleton-cover" />
              <div className="blog-skeleton-line" style={{ width: '100%', height: 16, marginTop: '2rem' }} />
              <div className="blog-skeleton-line" style={{ width: '95%', height: 16 }} />
              <div className="blog-skeleton-line" style={{ width: '80%', height: 16 }} />
            </article>
            <aside className="blog-sidebar-wrap">
              <div className="blog-sidebar-card blog-skeleton-card" />
              <div className="blog-sidebar-card blog-skeleton-card" />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // Not Found / Error State
  if (isError || !blog) {
    return (
      <div className="blog-detail-layout">
        <div className="blog-detail-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#17251E', marginBottom: '0.75rem' }}>
            Article Not Found
          </h2>
          <p style={{ color: '#64748B', maxWidth: '480px', margin: '0 auto 2rem' }}>
            The requested blog post might have been unpublished, moved, or the link has changed.
          </p>
          <Link to="/blog" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recent';

  const coverImageUrl = getUploadUrl(blog.featuredImage, wheatImg);
  const authorAvatarUrl = getUploadUrl(
    blog.authorAvatar,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  );

  return (
    <div className="blog-detail-layout">
      <div className="blog-detail-container">
        {/* Breadcrumbs */}
        <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/blog">Blog</Link>
          <ChevronRight size={13} />
          <Link to={`/blog?category=${encodeURIComponent(blog.category.toLowerCase().replace(/ /g, '-'))}`}>
            {blog.category}
          </Link>
          <ChevronRight size={13} />
          <span className="current">{blog.title}</span>
        </nav>

        {/* Main 2-Column Grid */}
        <div className="blog-detail-main-grid">
          {/* LEFT ARTICLE CONTENT */}
          <article>
            {/* Header / Category Tag */}
            <div className="blog-article-header">
              <Link
                to={`/blog?category=${encodeURIComponent(blog.category.toLowerCase().replace(/ /g, '-'))}`}
                className="blog-article-cat-tag"
              >
                {blog.category}
              </Link>
              <h1 className="blog-article-main-title">{blog.title}</h1>

              {/* Meta: Date, Read Time & Views */}
              <div className="blog-article-meta-row">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} style={{ color: '#5D7A68' }} /> {formattedDate}
                </span>
                <span>•</span>
                {blog.readingTime && (
                  <>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={15} style={{ color: '#5D7A68' }} /> {blog.readingTime}
                    </span>
                    <span>•</span>
                  </>
                )}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Eye size={15} style={{ color: '#5D7A68' }} /> {blog.views || 1} views
                </span>
              </div>

              {/* Author Row */}
              <div className="blog-article-author-row">
                <img
                  src={authorAvatarUrl}
                  alt={blog.author}
                  className="blog-author-avatar-img"
                  onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;

                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="blog-author-name">By {blog.author || 'AgriEra Agri Expert'}</span>
                  <span className="blog-author-role">Certified Agricultural Specialist</span>
                </div>
              </div>
            </div>

            {/* Cover Hero Photo */}
            <div className="blog-article-cover-wrap">
              <img
                src={coverImageUrl}
                alt={blog.title}
                className="blog-article-cover-img"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;

                  (e.currentTarget as HTMLImageElement).src = wheatImg;
                }}
              />
            </div>

            {/* Dynamic Article Content Body */}
            <div
              className="blog-article-body"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags Row if present */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags-container">
                <Tag size={16} style={{ color: '#166534' }} />
                <span className="blog-tags-label">Tags:</span>
                <div className="blog-tags-list">
                  {blog.tags.map((tag, idx) => (
                    <Link key={idx} to={`/blog?search=${encodeURIComponent(tag)}`} className="blog-tag-pill">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Bar */}
            <div className="blog-share-row">
              <span className="blog-share-label">Share this article:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="blog-share-btn facebook"
                title="Share on Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="blog-share-btn whatsapp"
                title="Share on WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
              <button onClick={handleCopyLink} className="blog-share-btn copy" title="Copy Article Link">
                {copied ? <CheckCircle2 size={15} color="#166534" /> : <Share2 size={15} />}
                <span style={{ fontSize: '0.775rem', fontWeight: 600 }}>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Author Bio Card */}
            <div className="blog-author-bio-card">
              <div>
                <h4 className="blog-bio-name">{blog.author || 'AgriEra Agri Expert'}</h4>
                <p className="blog-bio-text">
                  {blog.authorBio ||
                    'Agricultural expert with 10+ years of experience in sustainable farming, soil health, and crop management.'}
                </p>
              </div>
              <img
                src={authorAvatarUrl}
                alt={blog.author}
                className="blog-author-avatar-img"
                style={{ width: '56px', height: '56px' }}
              />
            </div>
          </article>

          {/* RIGHT SIDEBAR */}
          <aside className="blog-sidebar-wrap">
            {/* 1. Search Blog Card */}
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">Search Blog</h3>
              <form onSubmit={handleSidebarSearch} className="blog-sidebar-search">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="blog-sidebar-input"
                  aria-label="Search articles"
                />
                <button type="submit" className="blog-sidebar-search-btn" aria-label="Search">
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* 2. Categories List Card (Dynamic from Database) */}
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">
                Categories <Sprout size={18} style={{ color: '#78B833' }} />
              </h3>
              <ul className="blog-sidebar-cat-list">
                {categories.map((cat) => {
                  const isActive =
                    cat.slug === blog.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
                    cat.name.toLowerCase() === blog.category.toLowerCase();
                  return (
                    <li key={cat.slug}>
                      <Link
                        to={`/blog?category=${cat.slug}`}
                        className={`blog-sidebar-cat-item ${isActive ? 'active' : ''}`}
                      >
                        <span>{cat.name}</span>
                        <span className="blog-cat-count-badge">{cat.count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 3. Popular Articles Card */}
            {popularArticles.length > 0 && (
              <div className="blog-sidebar-card">
                <h3 className="blog-sidebar-title">Popular Articles</h3>
                <div className="blog-popular-list">
                  {popularArticles.map((art) => {
                    const artDate = art.publishedAt
                      ? new Date(art.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recent';

                    const artImg = getUploadUrl(art.featuredImage, wheatImg);

                    return (
                      <Link key={art.id} to={`/blog/${art.slug || art.id}`} className="blog-popular-item">
                        <img
                          src={artImg}
                          alt={art.title}
                          className="blog-popular-img"
                          onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;

                            (e.currentTarget as HTMLImageElement).src = wheatImg;
                          }}
                        />
                        <div>
                          <h4 className="blog-popular-title">{art.title}</h4>
                          <span className="blog-popular-date">{artDate}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Need Expert Advice? CTA Card */}
            <div className="blog-cta-advice-card">
              <h3 className="blog-cta-advice-title">Need Expert Advice?</h3>
              <div className="blog-cta-icon-box">
                <Stethoscope size={32} />
              </div>
              <p className="blog-cta-desc">
                Talk to our crop agronomists and get personalized fertilization & pest solutions for your farm.
              </p>
              <Link to="/contact" className="blog-cta-btn">
                Ask Crop Doctor
              </Link>
            </div>
          </aside>
        </div>

        {/* BOTTOM: Dynamic Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="blog-related-section">
            <h2 className="blog-related-title">
              Related Articles <Sprout size={24} style={{ color: '#78B833' }} />
            </h2>

            <div className="blog-related-grid">
              {relatedArticles.map((rel) => {
                const relDate = rel.publishedAt
                  ? new Date(rel.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent';

                const relImg = getUploadUrl(rel.featuredImage, wheatImg);

                return (
                  <Link key={rel.id} to={`/blog/${rel.slug || rel.id}`} className="blog-related-card">
                    <img
                      src={relImg}
                      alt={rel.title}
                      className="blog-related-img"
                      onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;

                        (e.currentTarget as HTMLImageElement).src = wheatImg;
                      }}
                    />
                    <div className="blog-related-body">
                      <span className="blog-related-cat-label">{rel.category}</span>
                      <h4 className="blog-related-heading">{rel.title}</h4>
                      <span className="blog-related-date">{relDate}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;

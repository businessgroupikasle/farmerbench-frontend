import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Sprout,
  Search,
  CheckCircle2,
  Share2,
  Stethoscope,
  Lightbulb,
} from 'lucide-react';
import wheatImg from '../assets/wheat-sunburst.jpg';
import pastureImg from '../assets/farming-practices.jpg';
import smartImg from '../assets/smart-irrigation.jpg';
import sustainableImg from '../assets/sustainable-farm.jpg';
import organicImg from '../assets/organic-farming.jpg';
import aerialImg from '../assets/vineyard-hills.jpg';
import './BlogDetailPage.css';

export const BlogDetailPage: React.FC = () => {
  const { idOrSlug } = useParams();
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { name: 'All Categories', count: 36, slug: 'all' },
    { name: 'Crop Nutrition', count: 9, slug: 'crop-nutrition' },
    { name: 'Plant Protection', count: 8, slug: 'plant-protection' },
    { name: 'Soil Health', count: 6, slug: 'soil-health' },
    { name: 'Irrigation', count: 4, slug: 'irrigation' },
    { name: 'Pest Management', count: 5, slug: 'pest-management' },
    { name: 'Farming Tips', count: 4, slug: 'farming-tips' },
    { name: 'Crop Planning', count: 3, slug: 'crop-planning' },
    { name: 'Technology', count: 3, slug: 'technology' },
  ];

  const popularArticles = [
    {
      id: '1',
      title: 'How to Choose the Right Fertilizer for Your Crop?',
      date: '20 May 2024',
      image: wheatImg,
    },
    {
      id: '2',
      title: 'Simple Ways to Improve Soil Health Naturally',
      date: '12 May 2024',
      image: smartImg,
    },
    {
      id: '3',
      title: 'Common Crop Pests and How to Control Them',
      date: '10 May 2024',
      image: pastureImg,
    },
  ];

  const relatedArticles = [
    {
      id: '2',
      title: 'Simple Ways to Improve Soil Health Naturally',
      date: '12 May 2024',
      image: smartImg,
    },
    {
      id: '4',
      title: 'Crop Nutrition: A Practical Guide',
      date: '05 May 2024',
      image: organicImg,
    },
    {
      id: '5',
      title: 'Best Time to Apply Fertilizer',
      date: '28 Apr 2024',
      image: wheatImg,
    },
  ];

  return (
    <div className="blog-detail-layout">
      <div className="blog-detail-container">
        {/* Main 2-Column Grid */}
        <div className="blog-detail-main-grid">
          {/* LEFT ARTICLE CONTENT */}
          <article>
            {/* Header / Category Tag */}
            <div className="blog-article-header">
              <span className="blog-article-cat-tag">Crop Nutrition</span>
              <h1 className="blog-article-main-title">
                How to Choose the Right Fertilizer for Your Crop?
              </h1>

              {/* Meta: Date & Read Time */}
              <div className="blog-article-meta-row">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} style={{ color: '#5D7A68' }} /> 20 May 2024
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} style={{ color: '#5D7A68' }} /> 8 min read
                </span>
              </div>

              {/* Author Row */}
              <div className="blog-article-author-row">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Author"
                  className="blog-author-avatar-img"
                />
                <span className="blog-author-name">By FarmerBench Agri Expert</span>
              </div>
            </div>

            {/* Cover Hero Photo */}
            <img
              src="https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=1200&auto=format&fit=crop&q=80"
              alt="Fertilizer Application"
              className="blog-article-cover-img"
            />

            {/* Article Content */}
            <div className="blog-article-body">
              <p>
                Choosing the right fertilizer is one of the most important decisions for healthy crop growth and higher yield. Different crops need different nutrients at different stages. Here's a simple guide to help you pick the best fertilizer for your crops.
              </p>

              <h2 className="blog-section-heading">1. Understanding Your Crop's Nutrient Needs</h2>
              <p>
                Every crop requires a mix of essential nutrients – Nitrogen (N), Phosphorus (P), Potassium (K) and micronutrients. For example, leafy vegetables need more nitrogen, while flowering and fruiting crops need more phosphorus and potassium.
              </p>

              <h2 className="blog-section-heading">2. Know the Main Fertilizer Types</h2>
              <p>Fertilizers are generally of three types:</p>
              <ul className="blog-article-list">
                <li>
                  <strong>Organic Fertilizers:</strong> Natural sources like compost, manure, and vermicompost that build long-term soil structure.
                </li>
                <li>
                  <strong>Inorganic Fertilizers:</strong> Chemical-based mineral fertilizers for quick nutrient supply and targeted feeding.
                </li>
                <li>
                  <strong>Bio-fertilizers:</strong> Contain beneficial live microbial cultures that enhance root uptake and nitrogen fixation.
                </li>
              </ul>

              {/* Expert Tip Highlight Box */}
              <div className="blog-expert-tip-box">
                <Lightbulb size={24} className="blog-tip-icon" />
                <div>
                  <h4 className="blog-tip-title">Expert Tip</h4>
                  <p className="blog-tip-text">
                    Using organic and inorganic fertilizers together can give better results and improve soil fertility over time.
                  </p>
                </div>
              </div>

              <h2 className="blog-section-heading">3. Read the NPK Ratio</h2>
              <p>
                The NPK ratio on fertilizer bags shows the percentage of Nitrogen (N), Phosphorus (P) and Potassium (K). For example, 10-26-26 means 10% Nitrogen, 26% Phosphorus and 26% Potassium. Choose the ratio as per your crop's growth stage and nutrient requirement.
              </p>

              <h2 className="blog-section-heading">4. Test Your Soil Before Applying</h2>
              <p>
                A soil test helps you understand the existing nutrient levels and pH of your soil. This prevents overuse of fertilizers and helps save costs while improving crop productivity.
              </p>

              {/* In-Article Demonstration Photo */}
              <img
                src="https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=1000&auto=format&fit=crop&q=80"
                alt="Soil Testing Demonstration"
                className="blog-inline-img"
              />

              <h2 className="blog-section-heading">5. Choose the Right Application Method</h2>
              <p>Different crops and fertilizers require different application methods:</p>
              <ul className="blog-article-list">
                <li>
                  <strong>Broadcasting:</strong> Spreading fertilizer evenly over the field surface before sowing.
                </li>
                <li>
                  <strong>Drip or Fertigation:</strong> Applying water-soluble fertilizers directly through drip irrigation to the root zone.
                </li>
                <li>
                  <strong>Foliar Spray:</strong> Spraying micronutrients directly onto leaves for rapid absorption during critical bloom periods.
                </li>
              </ul>

              <h2 className="blog-section-heading">6. Final Thoughts</h2>
              <p>
                The right fertilizer at the right time in the right amount can transform your crop yield and quality. Always follow recommended doses, monitor crop response and keep improving your soil health for long-term success.
              </p>

              {/* Social Share Bar */}
              <div className="blog-share-row">
                <span className="blog-share-label">Share this article</span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="blog-share-btn facebook"
                  title="Share on Facebook"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="blog-share-btn whatsapp"
                  title="Share on WhatsApp"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="blog-share-btn copy"
                  title="Copy Link"
                >
                  {copied ? <CheckCircle2 size={15} /> : <Share2 size={15} />}
                </button>
              </div>

              {/* Author Bio Card */}
              <div className="blog-author-bio-card">
                <div>
                  <h4 className="blog-bio-name">FarmerBench Agri Expert</h4>
                  <p className="blog-bio-text">
                    Agricultural expert with 10+ years of experience in sustainable farming, soil health, and crop management.
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Author"
                  className="blog-author-avatar-img"
                  style={{ width: '56px', height: '56px' }}
                />
              </div>
            </div>
          </article>

          {/* RIGHT SIDEBAR */}
          <aside className="blog-sidebar-wrap">
            {/* 1. Search Blog Card */}
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">Search Blog</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (sidebarSearch.trim()) {
                    window.location.href = `/blog?search=${encodeURIComponent(sidebarSearch.trim())}`;
                  }
                }}
                className="blog-sidebar-search"
              >
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="blog-sidebar-input"
                />
                <button type="submit" className="blog-sidebar-search-btn" aria-label="Search">
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* 2. Categories List Card */}
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">
                Categories <Sprout size={18} style={{ color: '#78B833' }} />
              </h3>
              <ul className="blog-sidebar-cat-list">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      to={`/blog?category=${cat.slug}`}
                      className={`blog-sidebar-cat-item ${cat.slug === 'crop-nutrition' ? 'active' : ''}`}
                    >
                      <span>{cat.name}</span>
                      <span className="blog-cat-count-badge">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Popular Articles Card */}
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">Popular Articles</h3>
              <div className="blog-popular-list">
                {popularArticles.map((art) => (
                  <Link key={art.id} to={`/blog/${art.id}`} className="blog-popular-item">
                    <img src={art.image} alt={art.title} className="blog-popular-img" />
                    <div>
                      <h4 className="blog-popular-title">{art.title}</h4>
                      <span className="blog-popular-date">{art.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Need Expert Advice? CTA Card */}
            <div className="blog-cta-advice-card">
              <h3 className="blog-cta-advice-title">Need Expert Advice?</h3>
              <div className="blog-cta-icon-box">
                <Stethoscope size={32} />
              </div>
              <p className="blog-cta-desc">
                Talk to our crop experts and get personalized solutions for your farm.
              </p>
              <Link to="/contact" className="blog-cta-btn">
                Ask Crop Doctor
              </Link>
            </div>
          </aside>
        </div>

        {/* BOTTOM: Related Articles */}
        <section className="blog-related-section">
          <h2 className="blog-related-title">
            Related Articles <Sprout size={24} style={{ color: '#78B833' }} />
          </h2>

          <div className="blog-related-grid">
            {relatedArticles.map((rel) => (
              <Link key={rel.id} to={`/blog/${rel.id}`} className="blog-related-card">
                <img src={rel.image} alt={rel.title} className="blog-related-img" />
                <div className="blog-related-body">
                  <h4 className="blog-related-heading">{rel.title}</h4>
                  <span className="blog-related-date">{rel.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, ArrowRight, Search, Clock } from 'lucide-react';
import aerialImg from '../../assets/vineyard-hills.jpg';
import wheatImg from '../../assets/wheat-sunburst.jpg';
import pastureImg from '../../assets/farming-practices.jpg';
import smartImg from '../../assets/smart-irrigation.jpg';
import sustainableImg from '../../assets/sustainable-farm.jpg';
import organicImg from '../../assets/organic-farming.jpg';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
}

export const BlogList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'crop-care', name: 'Crop Care' },
    { id: 'sustainable', name: 'Sustainable Farming' },
    { id: 'soil-health', name: 'Soil Health' },
    { id: 'livestock', name: 'Livestock Care' },
    { id: 'irrigation', name: 'Modern Irrigation' },
  ];

  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Expert Tips for Maximizing Crop Yields',
      category: 'crop-care',
      author: 'Ellan John',
      date: 'April 29, 2024',
      readTime: '5 min read',
      excerpt: 'Discover proven techniques in precision planting, seasonal crop rotation, and optimal nutrient management.',
      image: aerialImg,
    },
    {
      id: '2',
      title: 'Practices and Benefits of Sustainable Farming',
      category: 'sustainable',
      author: 'Max Wills',
      date: 'April 29, 2024',
      readTime: '6 min read',
      excerpt: 'How regenerative agriculture protects topsoil vitality, enhances biodiversity, and reduces water consumption.',
      image: wheatImg,
    },
    {
      id: '3',
      title: 'Essential Guidelines for Livestock Health',
      category: 'livestock',
      author: 'Sam Andre',
      date: 'April 29, 2024',
      readTime: '4 min read',
      excerpt: 'A comprehensive checklist for pasture hygiene, balanced mineral supplements, and seasonal livestock shelter.',
      image: pastureImg,
    },
    {
      id: '4',
      title: 'Smart Drip Irrigation & Water Efficiency',
      category: 'irrigation',
      author: 'Dr. Ramesh Kumar',
      date: 'May 12, 2024',
      readTime: '7 min read',
      excerpt: 'Automated soil moisture sensors and root-zone water delivery to slash water consumption by up to 45%.',
      image: smartImg,
    },
    {
      id: '5',
      title: 'Microbial Soil Health and Organic Compost',
      category: 'soil-health',
      author: 'Kavitha Nathan',
      date: 'June 04, 2024',
      readTime: '5 min read',
      excerpt: 'Restoring natural mycorrhizal fungi networks to boost drought tolerance and natural disease resistance in roots.',
      image: sustainableImg,
    },
    {
      id: '6',
      title: 'Natural Pest Management Without Synthetic Chemicals',
      category: 'crop-care',
      author: 'Ellan John',
      date: 'July 18, 2024',
      readTime: '6 min read',
      excerpt: 'Utilizing biological controls, companion planting, and neem-based biopesticides for clean chemical-free harvests.',
      image: organicImg,
    },
  ];

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="blog-list-section">
      <div className="container">
        {/* Category Filters & Search */}
        <div className="blog-filters-row">
          <div className="blog-category-chips">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`blog-cat-chip ${selectedCategory === c.id ? 'active' : ''}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="blog-search-box">
            <Search size={17} style={{ color: '#5D7A68' }} />
            <input
              type="text"
              placeholder="Search agriculture articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blog-search-input"
            />
          </div>
        </div>

        {/* 3-Column Blog Cards Grid */}
        <div className="blog-cards-grid">
          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="blog-card" style={{ textDecoration: 'none' }}>
              <div className="blog-card-img-wrap">
                <img src={post.image} alt={post.title} />
                <span className="blog-card-category-badge">
                  {post.category.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span className="blog-card-meta-item">
                    <User size={13} /> {post.author}
                  </span>
                  <span className="blog-card-meta-item">
                    <Calendar size={13} /> {post.date}
                  </span>
                  <span className="blog-card-meta-item">
                    <Clock size={13} /> {post.readTime}
                  </span>
                </div>

                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>

                <span className="blog-card-read-more">
                  <span>Read Article</span>
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogList;

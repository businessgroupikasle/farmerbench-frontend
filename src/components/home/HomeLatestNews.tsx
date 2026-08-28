import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';
import aerialImg from '../../assets/vineyard-hills.jpg';
import wheatImg from '../../assets/wheat-sunburst.jpg';
import pastureImg from '../../assets/farming-practices.jpg';

export const HomeLatestNews: React.FC = () => {
  return (
    <section id="news" className="agriflow-news-section">
      <div className="container">
        {/* Section Header */}
        <div className="agriflow-news-header">
          <h2 className="agriflow-news-title">Our Latest News</h2>
          <Link to="/blog" className="agriflow-news-btn-more">
            More Blogs
          </Link>
        </div>

        {/* 3-Column News Layout */}
        <div className="agriflow-news-grid">
          {/* Card 1: Agricultural (Featured) */}
          <div className="agriflow-featured-news-card">
            <div className="agriflow-news-img-box">
              <img src={aerialImg} alt="Crop Yields" />
              <span className="agriflow-news-badge">AGRICULTURAL</span>
            </div>

            <div className="agriflow-news-meta">
              <span className="agriflow-news-meta-item">
                <User size={14} style={{ color: '#5D7A68' }} /> By Ellan John
              </span>
              <span className="agriflow-news-meta-item">
                <Calendar size={14} style={{ color: '#5D7A68' }} /> April 29, 2024
              </span>
            </div>

            <h3 className="agriflow-news-heading">
              Expert Tips for Maximizing Crop Yields
            </h3>

            <Link to="/blog/1" className="agriflow-news-btn-read">
              Read More
            </Link>
          </div>

          {/* Card 2: Farming (Featured) */}
          <div className="agriflow-featured-news-card">
            <div className="agriflow-news-img-box">
              <img src={wheatImg} alt="Sustainable Farming" />
              <span className="agriflow-news-badge">FARMING</span>
            </div>

            <div className="agriflow-news-meta">
              <span className="agriflow-news-meta-item">
                <User size={14} style={{ color: '#5D7A68' }} /> By Max Wills
              </span>
              <span className="agriflow-news-meta-item">
                <Calendar size={14} style={{ color: '#5D7A68' }} /> April 29, 2024
              </span>
            </div>

            <h3 className="agriflow-news-heading">
              Practices and Benefits of Sustainable Farming
            </h3>

            <Link to="/blog/2" className="agriflow-news-btn-read">
              Read More
            </Link>
          </div>

          {/* Column 3: Stacked Compact News List */}
          <div className="agriflow-news-column-stacked">
            {/* Stacked Item 1 */}
            <Link to="/blog/1" className="agriflow-news-compact-item">
              <div className="agriflow-news-compact-img-wrap">
                <img src={aerialImg} alt="Crop Yields" />
              </div>
              <div className="agriflow-news-compact-content">
                <div className="agriflow-news-meta">
                  <span className="agriflow-news-meta-item">
                    <User size={13} /> By Ellan John
                  </span>
                  <span className="agriflow-news-meta-item">
                    <Calendar size={13} /> April 29, 2024
                  </span>
                </div>
                <h4 className="agriflow-news-compact-heading">
                  Expert Tips for Maximizing Crop Yields
                </h4>
              </div>
            </Link>

            {/* Stacked Item 2 */}
            <Link to="/blog/2" className="agriflow-news-compact-item">
              <div className="agriflow-news-compact-img-wrap">
                <img src={wheatImg} alt="Sustainable Farming" />
              </div>
              <div className="agriflow-news-compact-content">
                <div className="agriflow-news-meta">
                  <span className="agriflow-news-meta-item">
                    <User size={13} /> By Max Wills
                  </span>
                  <span className="agriflow-news-meta-item">
                    <Calendar size={13} /> April 29, 2024
                  </span>
                </div>
                <h4 className="agriflow-news-compact-heading">
                  Practices and Benefits of Sustainable Farming
                </h4>
              </div>
            </Link>

            {/* Stacked Item 3 */}
            <Link to="/blog/3" className="agriflow-news-compact-item">
              <div className="agriflow-news-compact-img-wrap">
                <img src={pastureImg} alt="Livestock Health" />
              </div>
              <div className="agriflow-news-compact-content">
                <div className="agriflow-news-meta">
                  <span className="agriflow-news-meta-item">
                    <User size={13} /> By Sam Andre
                  </span>
                  <span className="agriflow-news-meta-item">
                    <Calendar size={13} /> April 29, 2024
                  </span>
                </div>
                <h4 className="agriflow-news-compact-heading">
                  Essential Guidelines for Livestock Health
                </h4>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeLatestNews;

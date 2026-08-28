import React from 'react';
import { Sprout } from 'lucide-react';

export const BlogHero: React.FC = () => {
  return (
    <section className="blog-hero-section">
      <div className="blog-hero-container">
        {/* Left Typography */}
        <div className="blog-hero-text animate-fade-in">
          <h1 className="blog-hero-title">
            Our Blog <Sprout size={36} style={{ color: '#78B833' }} />
          </h1>
          <p className="blog-hero-desc">
            Expert farming tips, crop care guides, product knowledge and the latest updates to help you grow better crops and achieve higher yields.
          </p>
        </div>

        {/* Right Notebook & Seedling Graphic */}
        <div className="blog-hero-graphic-wrap">
          <svg width="420" height="200" viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Open Notebook */}
            <g transform="rotate(-6 160 120)">
              {/* Notebook Shadow */}
              <rect x="25" y="45" width="180" height="130" rx="8" fill="rgba(0,0,0,0.15)" />
              {/* Notebook Pages */}
              <rect x="20" y="40" width="180" height="130" rx="8" fill="#FDFBF7" stroke="#E2DCD5" strokeWidth="1.5" />
              {/* Ruled lines */}
              <line x1="35" y1="75" x2="185" y2="75" stroke="#EAE4DC" strokeWidth="1.2" />
              <line x1="35" y1="95" x2="185" y2="95" stroke="#EAE4DC" strokeWidth="1.2" />
              <line x1="35" y1="115" x2="185" y2="115" stroke="#EAE4DC" strokeWidth="1.2" />
              <line x1="35" y1="135" x2="185" y2="135" stroke="#EAE4DC" strokeWidth="1.2" />
              <line x1="35" y1="155" x2="185" y2="155" stroke="#EAE4DC" strokeWidth="1.2" />
              {/* Handwritten Title: Agriculture Notes */}
              <text x="60" y="80" fill="#2C3E30" fontSize="13" fontWeight="700" fontStyle="italic" fontFamily="serif">
                Agriculture
              </text>
              <text x="80" y="98" fill="#2C3E30" fontSize="13" fontWeight="700" fontStyle="italic" fontFamily="serif">
                Notes
              </text>
              {/* Fountain Pen */}
              <g transform="rotate(25 110 110)">
                <rect x="60" y="105" width="110" height="7" rx="3.5" fill="#1C241F" />
                <rect x="110" y="104" width="6" height="9" fill="#D4AF37" />
                <path d="M50 108.5L60 104V113L50 108.5Z" fill="#C0C0C0" stroke="#718096" strokeWidth="0.5" />
                <circle cx="58" cy="108.5" r="1" fill="#D4AF37" />
              </g>
            </g>

            {/* Fertile Soil Mound */}
            <path
              d="M240 185C270 145 340 145 380 185H240Z"
              fill="#2E1C11"
            />
            <ellipse cx="310" cy="180" rx="60" ry="12" fill="#3D2617" />

            {/* Healthy Green Sprout seedling */}
            <path
              d="M310 175V105"
              stroke="#588D23"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <path
              d="M310 135C310 115 280 120 280 120C280 120 285 140 310 135Z"
              fill="#78B833"
              stroke="#4C7D1B"
              strokeWidth="1.2"
            />
            <path
              d="M310 125C310 105 340 110 340 110C340 110 335 130 310 125Z"
              fill="#88CF3A"
              stroke="#4C7D1B"
              strokeWidth="1.2"
            />
            <path
              d="M310 105C310 80 295 70 295 70C295 70 325 80 310 105Z"
              fill="#A4DE5B"
            />
            <path
              d="M310 105C310 80 325 70 325 70C325 70 295 80 310 105Z"
              fill="#88CF3A"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;

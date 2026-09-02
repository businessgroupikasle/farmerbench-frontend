import React from 'react';
import { Leaf } from 'lucide-react';

export const BlogHero: React.FC = () => {
  return (
    <section className="blog-hero-section">
      <div className="blog-hero-container">
        <div className="blog-hero-text animate-fade-in">
          <h1 className="blog-hero-title">
            Our Blog <Leaf className="blog-hero-leaf" aria-hidden="true" />
          </h1>
          <p className="blog-hero-desc">
            Expert farming tips, crop care guides, product knowledge and the latest updates to help you grow better crops and achieve higher yields.
          </p>
        </div>

      </div>
    </section>
  );
};

export default BlogHero;

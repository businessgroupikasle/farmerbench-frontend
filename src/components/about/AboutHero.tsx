import React from 'react';
import { Link } from 'react-router-dom';

export const AboutHero: React.FC = () => {
  return (
    <section className="about-hero-section">
      <div className="about-hero-container">
        <div className="about-hero-content animate-fade-in">
          {/* Badge Tag */}
          <span className="about-hero-tag">ABOUT GREENLA</span>

          {/* Heading */}
          <h1 className="about-hero-title">
            Growing Better,<br />Together
          </h1>

          {/* Subtitle */}
          <p className="about-hero-desc">
            We help farmers access trusted agricultural products, expert guidance and practical solutions for healthier crops and better yields.
          </p>

          {/* CTA Button */}
          <Link to="/products" className="about-hero-cta">
            Explore Our Products
          </Link>
        </div>
      </div>

      {/* Soil Bottom Decoration */}
      <div className="about-hero-soil-strip" />
    </section>
  );
};

export default AboutHero;

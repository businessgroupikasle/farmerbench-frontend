import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const AboutBanner: React.FC = () => {
  return (
    <section className="about-banner-section">
      <div className="about-banner-container">
        {/* Left Heading with Accent Bar */}
        <div className="about-banner-left">
          <div className="about-banner-bar" />
          <h2 className="about-banner-title">
            Cultivating healthy food for<br className="about-banner-br" />
            you and your family.
          </h2>
        </div>

        {/* Right CTA Actions */}
        <div className="about-banner-actions">
          <Link to="/products" className="about-banner-btn-primary">
            <span>Learn More</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <Link to="/contact" className="about-banner-btn-secondary">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutBanner;

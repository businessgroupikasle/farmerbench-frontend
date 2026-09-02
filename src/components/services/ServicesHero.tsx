import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Sprout, ClipboardCheck } from 'lucide-react';

interface ServicesHeroProps {
  onBookConsultation?: () => void;
  onTalkToExpert?: () => void;
}

export const ServicesHero: React.FC<ServicesHeroProps> = ({
  onBookConsultation,
  onTalkToExpert,
}) => {
  return (
    <section className="services-hero-section">
      <div className="services-hero-container">
        <nav className="services-hero-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Services</span>
        </nav>
        <div className="services-hero-content animate-fade-in">
          {/* Tag / Category Badge */}
          <div className="services-hero-badge-tag">
            <span>EXPERT FARMING SERVICES</span>
          </div>

          {/* Main Headline */}
          <h1 className="services-hero-title">
            <span className="services-hero-title-dark">Practical Solutions</span>{' '}
            <span className="services-hero-title-green">for Better Farming</span>
          </h1>

          {/* Description */}
          <p className="services-hero-desc">
            From soil health to crop protection, our agriculture experts provide
            the right guidance and on-field support for every stage of your farm.
          </p>

          {/* Action CTA Buttons */}
          <div className="services-hero-actions">
            <button
              onClick={onBookConsultation}
              className="services-btn-primary"
              id="hero-book-consultation-btn"
            >
              Book a Consultation
            </button>
            <button
              onClick={onTalkToExpert}
              className="services-btn-secondary"
              id="hero-talk-expert-btn"
            >
              Talk to an Expert
            </button>
          </div>

          {/* 3 Feature Highlight Badges */}
          <div className="services-hero-features-strip">
            {/* Feature 1: Qualified Experts */}
            <div className="services-feature-pill">
              <div className="services-feature-icon-box">
                <UserCheck size={20} strokeWidth={2.4} />
              </div>
              <span className="services-feature-label">Qualified Experts</span>
            </div>

            {/* Feature 2: Local Farm Support */}
            <div className="services-feature-pill">
              <div className="services-feature-icon-box">
                <Sprout size={20} strokeWidth={2.4} />
              </div>
              <span className="services-feature-label">Local Farm Support</span>
            </div>

            {/* Feature 3: Practical Recommendations */}
            <div className="services-feature-pill">
              <div className="services-feature-icon-box">
                <ClipboardCheck size={20} strokeWidth={2.4} />
              </div>
              <span className="services-feature-label">Practical Recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;

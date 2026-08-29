import React from 'react';
import { ArrowRight, PhoneCall, Calendar } from 'lucide-react';
import ctaBg from '../../assets/services-cta-banner.jpg';

interface ServicesCTAProps {
  onBookConsultation?: () => void;
  onTalkToExpert?: () => void;
}

export const ServicesCTA: React.FC<ServicesCTAProps> = ({
  onBookConsultation,
  onTalkToExpert,
}) => {
  return (
    <section
      className="services-compact-banner-section"
      style={{
        backgroundImage: `linear-gradient(rgba(14, 42, 22, 0.75), rgba(10, 32, 16, 0.84)), url(${ctaBg})`,
      }}
    >
      <div className="services-compact-banner-container">
        {/* Left: Vertical Accent Bar & Heading */}
        <div className="services-compact-banner-left">
          <div className="services-compact-banner-bar" />
          <div className="services-compact-banner-text-group">
            <span className="services-compact-banner-tag">EXPERT FARM ADVISORY</span>
            <h2 className="services-compact-banner-title">
              Ready to Transform Your Crop Yields & Soil Health?
            </h2>
            <p className="services-compact-banner-sub">
              Get personalized soil charts, precision pest shields, and certified on-field agronomist support.
            </p>
          </div>
        </div>

        {/* Right: Sleek Pill Action Buttons */}
        <div className="services-compact-banner-actions">
          <button
            onClick={onBookConsultation}
            className="services-compact-btn-primary"
            id="compact-cta-book-btn"
          >
            <Calendar size={18} />
            <span>Book Consultation</span>
            <ArrowRight size={18} strokeWidth={2.4} />
          </button>

          <a
            href="tel:+919876543210"
            className="services-compact-btn-secondary"
            id="compact-cta-call-btn"
          >
            <PhoneCall size={17} />
            <span>+91 98765 43210</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTA;

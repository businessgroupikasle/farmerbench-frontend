import React from 'react';
import farmVisitImg from '../../assets/farm-visit-inspection.jpg';

interface ServicesFarmVisitProps {
  onScheduleVisit?: () => void;
}

export const ServicesFarmVisit: React.FC<ServicesFarmVisitProps> = ({ onScheduleVisit }) => {
  const points = [
    {
      id: 'on-field-assessment',
      label: 'On-field assessment',
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sprout & magnifying glass / field audit icon */}
          <path
            d="M12 24V14M12 14c-3-3.5-7-1.5-7 2.5s3.5 3.5 7-2.5ZM12 16c3-3.5 7-1.5 7 2.5s-3.5 3.5-7-2.5Z"
            stroke="#165B2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="21" r="5" stroke="#165B2E" strokeWidth="2" />
          <path d="m25 25 3.5 3.5" stroke="#165B2E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'crop-specific-advice',
      label: 'Crop-specific advice',
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Plant leaf & lightbulb / advice icon */}
          <path
            d="M16 26V13M16 13c-4-4.5-9-2-9 3.5 0 3.5 4.5 4.5 9-3.5ZM16 16c4-4.5 9-2 9 3.5 0 3.5-4.5 4.5-9-3.5Z"
            stroke="#165B2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 27h12" stroke="#165B2E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'product-recommendations',
      label: 'Product recommendations',
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Document / prescription & checkmark / product icon */}
          <rect x="7" y="5" width="18" height="22" rx="3" stroke="#165B2E" strokeWidth="2" />
          <path d="M12 11h8M12 16h8M12 21h5" stroke="#165B2E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'follow-up-support',
      label: 'Follow-up support',
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hands holding seedling / continuous support */}
          <path
            d="M16 16v-6M16 10c-2-2-4.5-1-4.5 1.5S14 14 16 10ZM16 11c2-2 4.5-1 4.5 1.5S18 14 16 11Z"
            stroke="#165B2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 21.5c2.5 1 5 1.5 8 1.5s5.5-.5 8-1.5M6 25c3 1.5 6 2 10 2s7-.5 10-2"
            stroke="#165B2E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="services-farm-visit-section">
      <div className="container">
        <div className="services-farm-visit-card animate-fade-in">
          {/* Left Column: Farm Visit Inspection Photo */}
          <div className="services-farm-visit-img-col">
            <img
              src={farmVisitImg}
              alt="Agronomists and farmer inspecting crops on-field"
              className="services-farm-visit-img"
            />
          </div>

          {/* Right Column: Content & Action */}
          <div className="services-farm-visit-content-col">
            <div className="services-farm-visit-tag">MOST REQUESTED SERVICE</div>

            <h2 className="services-farm-visit-title">
              Expert Guidance, Right at Your Farm
            </h2>

            <p className="services-farm-visit-desc">
              Our Crop Consultation brings expert advice to your field. Get practical
              solutions tailored to your crop, soil and local conditions.
            </p>

            {/* 4 Feature Points Strip */}
            <div className="services-farm-visit-features">
              {points.map((pt, idx) => (
                <React.Fragment key={pt.id}>
                  <div className="services-farm-visit-feature-item">
                    <div className="services-farm-visit-feature-icon">
                      {pt.icon}
                    </div>
                    <span className="services-farm-visit-feature-label">
                      {pt.label}
                    </span>
                  </div>
                  {idx < points.length - 1 && (
                    <div className="services-farm-visit-feature-divider" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Action CTA & Pricing */}
            <div className="services-farm-visit-action-wrap">
              <button
                onClick={onScheduleVisit}
                className="services-farm-visit-cta-btn"
                id="schedule-farm-visit-btn"
              >
                Schedule a Farm Visit
              </button>

              <div className="services-farm-visit-pricing-note">
                <span className="services-price-text">
                  Starting from <strong className="services-price-green">₹499</strong>
                </span>
                <span className="services-pricing-bullet">•</span>
                <span className="services-location-note">
                  Available in selected locations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesFarmVisit;

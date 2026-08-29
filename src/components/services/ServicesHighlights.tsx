import React from 'react';

export const ServicesHighlights: React.FC = () => {
  const highlights = [
    {
      id: 'farmers-supported',
      title: '10,000+',
      subtitle: 'Farmers Supported',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Group of 3 farmers / users with middle pin */}
          <path
            d="M18 17a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 28.5v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27 12a3.5 3.5 0 0 1 0 7M31 27v-1.5a4 4 0 0 0-3.5-3.9"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 19a3.5 3.5 0 0 1 0-7M5 27v-1.5a4 4 0 0 1 3.5-3.9"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'agri-experts',
      title: '50+',
      subtitle: 'Agriculture Experts',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Agronomist / Expert with field cap & collar */}
          <circle cx="18" cy="12" r="5" stroke="#165B2E" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M13 10.5c1.2-2 3.5-2.8 5-2.8s3.8.8 5 2.8"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M10 27.5c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M18 21v4.5M15.5 25.5h5"
            stroke="#165B2E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: 'crop-specialities',
      title: '25+',
      subtitle: 'Crop Specialities',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sprouting dual leaves & soil base */}
          <path
            d="M18 28V14M18 14c-4.5-5-10-2-10 4 0 4 5 5 10-4ZM18 17c4.5-5 10-2 10 4 0 4-5 5-10-4Z"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 29h14"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: 'pan-india',
      title: 'Tamil Nadu &',
      subtitle: 'PAN India Support',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Map pin with concentric location base */}
          <path
            d="M18 24.5C21.5 20.5 24 16.5 24 13a6 6 0 1 0-12 0c0 3.5 2.5 7.5 6 11.5Z"
            stroke="#165B2E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="13" r="2.2" stroke="#165B2E" strokeWidth="2" />
          <ellipse cx="18" cy="27.5" rx="7.5" ry="2.5" stroke="#165B2E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="services-highlights-section">
      <div className="container">
        <div className="services-highlights-card animate-fade-in">
          {highlights.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="services-highlight-col">
                <div className="services-highlight-icon-wrapper">
                  {item.icon}
                </div>
                <div className="services-highlight-text-group">
                  <h3 className="services-highlight-title">{item.title}</h3>
                  <p className="services-highlight-subtitle">{item.subtitle}</p>
                </div>
              </div>
              {index < highlights.length - 1 && (
                <div className="services-highlight-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlights;

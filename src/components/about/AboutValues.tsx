import React from 'react';
import { ShieldCheck, Headphones, Sprout } from 'lucide-react';

export const AboutValues: React.FC = () => {
  const values = [
    {
      id: 'farmer-first',
      title: 'Farmer First',
      description: "We put farmers' needs at the center of everything we do.",
      icon: (
        /* Custom Farmer Outline Icon with green sprout badge */
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* User Head */}
          <circle cx="21" cy="14" r="7" stroke="#165B2E" strokeWidth="2.6" />
          {/* User Shoulders */}
          <path
            d="M9 36C9 28 15 25 24 25"
            stroke="#165B2E"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Farmer Sprout Accent Badge */}
          <path
            d="M28 35C28 26 36 24 40 22C39 28 34 35 28 35Z"
            fill="#88CF3A"
          />
          <path
            d="M34 36C34 30 40 28 44 26C43 31 38 37 34 36Z"
            fill="#165B2E"
          />
        </svg>
      ),
    },
    {
      id: 'quality-trust',
      title: 'Quality & Trust',
      description: 'We deliver genuine products and maintain complete transparency.',
      icon: <ShieldCheck size={44} strokeWidth={2.2} style={{ color: '#165B2E' }} />,
    },
    {
      id: 'expert-guidance',
      title: 'Expert Guidance',
      description: 'Our experts provide practical advice for better crop outcomes.',
      icon: <Headphones size={44} strokeWidth={2.2} style={{ color: '#165B2E' }} />,
    },
    {
      id: 'sustainable-growth',
      title: 'Sustainable Growth',
      description: 'We support eco-friendly practices for a better tomorrow.',
      icon: (
        /* Sprouting Plant in Soil Icon */
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground line */}
          <line x1="8" y1="40" x2="40" y2="40" stroke="#165B2E" strokeWidth="2.6" strokeLinecap="round" />
          {/* Stem & Leaves */}
          <path
            d="M24 40V24M24 24C24 16 14 14 14 14C14 14 15 24 24 24ZM24 20C24 12 34 10 34 10C34 10 33 20 24 20Z"
            stroke="#165B2E"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Small Seed / Base */}
          <ellipse cx="24" cy="38" rx="5" ry="3" fill="#88CF3A" />
        </svg>
      ),
    },
  ];

  return (
    <section className="about-values-section">
      <div className="container">
        {/* Header */}
        <div className="about-values-header">
          <h2 className="about-values-title">
            Our Core Values <Sprout size={32} style={{ color: '#78B833' }} />
          </h2>
        </div>

        {/* 4 Core Value Cards Grid */}
        <div className="about-values-grid">
          {values.map((val) => (
            <div key={val.id} className="about-value-card">
              <div className="about-value-icon-box">{val.icon}</div>
              <h3 className="about-value-heading">{val.title}</h3>
              <p className="about-value-text">{val.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;

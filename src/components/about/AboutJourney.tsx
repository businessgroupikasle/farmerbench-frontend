import React from 'react';
import { Check } from 'lucide-react';

interface JourneyMilestone {
  year: string;
  title: string;
  description: string;
}

export const AboutJourney: React.FC = () => {
  const milestones: JourneyMilestone[] = [
    {
      year: '2020',
      title: 'AgriEra Founded',
      description: 'Started with a vision to support farmers better.',
    },
    {
      year: '2021',
      title: '1,000 Farmers Served',
      description: 'Reached our first 1,000+ farmers across Tamil Nadu.',
    },
    {
      year: '2023',
      title: 'Expanded Across Tamil Nadu',
      description: 'Strengthened reach and expert support across the state.',
    },
    {
      year: '2024',
      title: 'Growing Across India',
      description: 'Bringing trusted products and solutions to more farmers across India.',
    },
  ];

  return (
    <section className="about-journey-section">
      <div className="container about-journey-container">
        {/* Section Header */}
        <div className="about-journey-header">
          <h2 className="about-journey-title">
            Our Journey <span className="about-journey-leaf">🍃</span>
          </h2>
        </div>

        {/* Horizontal Timeline */}
        <div className="about-journey-timeline-wrap">
          {/* Connecting Line */}
          <div className="about-journey-track-line" />

          {/* Milestone Grid */}
          <div className="about-journey-grid">
            {milestones.map((item, index) => (
              <div key={item.year} className={`about-journey-item item-${index + 1}`}>
                {/* Milestone Node */}
                <div className="about-journey-node-wrap">
                  <div className="about-journey-node-circle">
                    <Check size={14} strokeWidth={3.2} />
                  </div>
                </div>

                {/* Milestone Content */}
                <div className="about-journey-content">
                  <span className="about-journey-year">{item.year}</span>
                  <h3 className="about-journey-item-title">{item.title}</h3>
                  <p className="about-journey-item-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutJourney;

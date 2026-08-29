import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import greenhouseImg from '../../assets/about-garden-greenhouse.jpg';
import gardenManImg from '../../assets/about-garden-man.jpg';
import gardenWomanImg from '../../assets/about-garden-woman-pot.jpg';

export const AboutDreamGarden: React.FC = () => {
  const leftFeatures = [
    'House Landscape',
    'Lawn mowing & cleaning',
    'Green House Nursery',
  ];

  const rightFeatures = [
    'Rooftop Gardening',
    'Indoor Plantation',
    'Vegetable Gardening',
  ];

  return (
    <section className="about-dream-garden-section">
      <div className="container about-dream-garden-container">
        {/* Left Side: Arched Photo Montage with Rotating Stamp Badge */}
        <div className="about-garden-visual-col">
          <div className="about-garden-montage">
            {/* 1. Left Tall Arch (Greenhouse Gardener) */}
            <div className="about-garden-arch-item arch-left">
              <img
                src={greenhouseImg}
                alt="Gardener working in lush greenhouse nursery"
                className="about-garden-arch-img"
              />
            </div>

            {/* 2. Right Top Arch (Man Tending Flowering Terrace) */}
            <div className="about-garden-arch-item arch-right-top">
              <img
                src={gardenManImg}
                alt="Man caring for outdoor patio flowers"
                className="about-garden-arch-img"
              />
            </div>

            {/* 3. Right Bottom Arch (Woman Repotting Succulent) */}
            <div className="about-garden-arch-item arch-right-bottom">
              <img
                src={gardenWomanImg}
                alt="Smiling woman repotting plant"
                className="about-garden-arch-img"
              />
            </div>

            {/* Circular Rotating Stamp Badge */}
            <div className="about-garden-stamp-badge">
              <div className="about-garden-stamp-inner">
                {/* Center Sprout Icon */}
                <div className="about-garden-stamp-icon">
                  <Sprout size={24} strokeWidth={2.4} />
                </div>

                {/* Curved SVG Text */}
                <svg
                  viewBox="0 0 100 100"
                  className="about-garden-stamp-svg"
                >
                  <path
                    id="stampCirclePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="about-garden-stamp-text">
                    <textPath href="#stampCirclePath" startOffset="0%">
                      MORE ABOUT US • OUR GARDENING •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Headline, Description, Checklist & CTA */}
        <div className="about-garden-content-col animate-fade-in">
          {/* Category Tag */}
          <div className="about-garden-tag-wrap">
            <div className="about-garden-tag-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 21C12 21 10 16.5 10 12.5C10 8.5 12 3 12 3C12 3 14 8.5 14 12.5C14 16.5 12 21 12 21Z"
                  fill="#165B2E"
                />
                <path
                  d="M10 12.5C5.5 12.5 3 8 3 8C3 8 7 7 10 10"
                  stroke="#165B2E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 12.5C18.5 12.5 21 8 21 8C21 8 17 7 14 10"
                  stroke="#165B2E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="about-garden-tag-text">About Gardening</span>
          </div>

          {/* Heading */}
          <h2 className="about-garden-title">
            We'll Help You To Create<br />
            Your Dream Garden
          </h2>

          {/* Description */}
          <p className="about-garden-desc">
            Backed by decades of hands-on experience, our skilled team delivers personalized landscaping solutions that combine beauty, functionality, and long-lasting value. Let us elevate your surroundings with confidence and care.
          </p>

          {/* 2-Column Feature Checklist Card with Left Green Accent Bar */}
          <div className="about-garden-checklist-card">
            <div className="about-garden-check-col">
              {leftFeatures.map((feat, idx) => (
                <div key={idx} className="about-garden-check-item">
                  <span className="about-garden-chevron">»</span>
                  <span className="about-garden-check-label">{feat}</span>
                </div>
              ))}
            </div>

            <div className="about-garden-check-col">
              {rightFeatures.map((feat, idx) => (
                <div key={idx} className="about-garden-check-item">
                  <span className="about-garden-chevron">»</span>
                  <span className="about-garden-check-label">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Action Button */}
          <div>
            <Link to="/contact" className="about-garden-cta-btn">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDreamGarden;

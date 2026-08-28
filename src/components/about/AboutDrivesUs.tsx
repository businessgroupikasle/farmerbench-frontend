import React from 'react';
import { Target, Eye } from 'lucide-react';

export const AboutDrivesUs: React.FC = () => {
  return (
    <section className="about-drives-us-section">
      <div className="container">
        {/* Header */}
        <div className="about-drives-us-header">
          <h2 className="about-drives-us-title">What Drives Us</h2>
          <div className="about-drives-us-line" />
        </div>

        {/* 2-Card Mission & Vision Grid */}
        <div className="about-drives-us-grid">
          {/* 1. Our Mission */}
          <div className="about-drive-card">
            <div className="about-drive-icon-wrap">
              <Target size={44} strokeWidth={2.2} />
            </div>
            <div className="about-drive-body">
              <h3 className="about-drive-heading">Our Mission</h3>
              <p className="about-drive-text">
                To make quality agricultural inputs and expert advice easily accessible to every farmer, helping them improve productivity, profitability and soil health.
              </p>
            </div>

            {/* Corner Leaf Illustration */}
            <div className="about-drive-leaf-dec">
              <svg width="58" height="58" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 36C12 22 28 14 38 10C36 22 26 36 12 36Z"
                  fill="#A8D595"
                />
                <path
                  d="M26 38C26 28 36 22 44 20C42 28 34 38 26 38Z"
                  fill="#78B833"
                />
                <path
                  d="M12 36C22 28 28 22 38 10"
                  stroke="#5C8F27"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* 2. Our Vision */}
          <div className="about-drive-card">
            <div className="about-drive-icon-wrap">
              <Eye size={44} strokeWidth={2.2} />
            </div>
            <div className="about-drive-body">
              <h3 className="about-drive-heading">Our Vision</h3>
              <p className="about-drive-text">
                To build a sustainable and prosperous farming community through innovation, trust and long-term partnerships.
              </p>
            </div>

            {/* Corner Leaf Illustration */}
            <div className="about-drive-leaf-dec">
              <svg width="58" height="58" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 36C12 22 28 14 38 10C36 22 26 36 12 36Z"
                  fill="#A8D595"
                />
                <path
                  d="M26 38C26 28 36 22 44 20C42 28 34 38 26 38Z"
                  fill="#78B833"
                />
                <path
                  d="M12 36C22 28 28 22 38 10"
                  stroke="#5C8F27"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDrivesUs;

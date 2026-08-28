import React from 'react';

export const AboutFarmingTechniques: React.FC = () => {
  return (
    <section className="about-techniques-section">
      <div className="container">
        {/* Title */}
        <div className="about-techniques-header">
          <h2 className="about-techniques-title">
            Our Farming Techniques
          </h2>
        </div>

        {/* Stepper Roadmap Container */}
        <div className="about-techniques-roadmap">
          {/* Continuous Curved Green Line */}
          <svg
            className="about-techniques-svg-line"
            viewBox="0 0 1100 360"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 12 300 L 210 300 C 230 300 240 250 250 250 L 420 250 C 440 250 450 190 460 190 L 640 190 C 660 190 670 120 680 120 L 980 120"
              stroke="#A3CF88"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* 4 Steps Grid */}
          <div className="about-techniques-grid">
            {/* Step 01 */}
            <div className="about-technique-step step-1">
              <span className="about-technique-num">01</span>
              <h3 className="about-technique-heading">Strategic Farming Approach</h3>
              
              <div className="about-technique-node-wrap">
                <div className="about-technique-node-dot" />
              </div>

              <p className="about-technique-desc">
                Methodical Crop Cultivation Strategies Implemented.
              </p>
            </div>

            {/* Step 02 */}
            <div className="about-technique-step step-2">
              <span className="about-technique-num">02</span>
              <h3 className="about-technique-heading">Skilled Cultivation Expertise</h3>
              
              <div className="about-technique-node-wrap">
                {/* Sprout with single leaf */}
                <svg className="about-technique-sprout" width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18V6" stroke="#78B833" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 10C10 4 3 4 3 4C3 4 4 10 10 10Z" fill="#78B833" />
                </svg>
                <div className="about-technique-node-dot" />
              </div>

              <p className="about-technique-desc">
                Experienced Farmers Ensure Optimal Growth.
              </p>
            </div>

            {/* Step 03 */}
            <div className="about-technique-step step-3">
              <span className="about-technique-num">03</span>
              <h3 className="about-technique-heading">Rigorous Quality Checking</h3>
              
              <div className="about-technique-node-wrap">
                {/* Sprout with double leaves */}
                <svg className="about-technique-sprout" width="24" height="22" viewBox="0 0 24 22" fill="none">
                  <path d="M12 20V8" stroke="#78B833" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 12C12 4 4 4 4 4C4 4 5 12 12 12Z" fill="#78B833" />
                  <path d="M12 10C12 3 19 3 19 3C19 3 18 10 12 10Z" fill="#88CF3A" />
                </svg>
                <div className="about-technique-node-dot" />
              </div>

              <p className="about-technique-desc">
                Thorough Inspections Maintain High Standards.
              </p>
            </div>

            {/* Step 04 */}
            <div className="about-technique-step step-4">
              <span className="about-technique-num">04</span>
              <h3 className="about-technique-heading">Timely Distribution Delivery</h3>
              
              <div className="about-technique-node-wrap">
                {/* Yellow Flower Blossom */}
                <svg className="about-technique-sprout" width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <path d="M14 26V14" stroke="#78B833" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 18C14 14 9 14 9 14C9 14 10 18 14 18Z" fill="#78B833" />
                  <path d="M14 16C14 12 18 12 18 12C18 12 17 16 14 16Z" fill="#78B833" />
                  {/* Flower Petals */}
                  <circle cx="14" cy="7" r="4" fill="#F6B748" />
                  <circle cx="9" cy="9" r="4" fill="#F6B748" />
                  <circle cx="19" cy="9" r="4" fill="#F6B748" />
                  <circle cx="11" cy="14" r="4" fill="#F6B748" />
                  <circle cx="17" cy="14" r="4" fill="#F6B748" />
                  <circle cx="14" cy="10" r="3.5" fill="#E69822" />
                </svg>
                <div className="about-technique-node-dot" />
              </div>

              <p className="about-technique-desc">
                Prompt Delivery Ensures Freshness Preserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFarmingTechniques;

import React from 'react';

type PlantIconProps = {
  stage: 1 | 2 | 3;
  className?: string;
};

const PlantIcon: React.FC<PlantIconProps> = ({ stage, className = '' }) => {
  if (stage === 1) {
    return (
      <svg className={className} viewBox="0 0 30 38" aria-hidden="true">
        <path d="M15 34V16" />
        <path className="plant-leaf" d="M15 19C5 18 5 7 15 1c5 9 5 14 0 18Z" />
      </svg>
    );
  }

  if (stage === 2) {
    return (
      <svg className={className} viewBox="0 0 52 46" aria-hidden="true">
        <path d="M26 43V19" />
        <path className="plant-leaf" d="M25 31C11 30 5 21 5 11c12 1 20 7 20 20Z" />
        <path className="plant-leaf" d="M27 25c2-12 10-18 21-18-1 11-8 18-21 18Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 56 64" aria-hidden="true">
      <path d="M28 61V31" />
      <path className="plant-leaf" d="M27 48C15 48 9 41 8 32c11 0 18 6 19 16Z" />
      <path className="plant-leaf" d="M29 44c1-10 7-16 17-17-1 10-7 16-17 17Z" />
      <g className="plant-flower">
        <circle cx="28" cy="13" r="7" />
        <circle cx="17" cy="18" r="7" />
        <circle cx="20" cy="7" r="7" />
        <circle cx="39" cy="18" r="7" />
        <circle cx="37" cy="7" r="7" />
        <circle className="plant-flower-centre" cx="28" cy="13" r="5" />
      </g>
    </svg>
  );
};

const steps = [
  {
    number: '01',
    title: 'Strategic Farming Approach',
    description: 'Methodical Crop Cultivation Strategies Implemented.',
  },
  {
    number: '02',
    title: 'Skilled Cultivation Expertise',
    description: 'Experienced Farmers Ensure Optimal Growth.',
    plant: 1 as const,
  },
  {
    number: '03',
    title: 'Rigorous Quality Checking',
    description: 'Thorough Inspections Maintain High Standards.',
    plant: 2 as const,
  },
  {
    number: '04',
    title: 'Timely Distribution Delivery',
    description: 'Prompt Delivery Ensures Freshness Preserved.',
    plant: 3 as const,
  },
];

export const AboutFarmingTechniques: React.FC = () => (
  <section className="about-techniques-section" aria-labelledby="farming-techniques-title">
    <div className="about-techniques-inner">
      <h2 id="farming-techniques-title" className="about-techniques-title">
        Our Farming<br />Techniques
      </h2>

      <div className="about-techniques-roadmap">
        <svg className="about-techniques-line" viewBox="0 0 1200 390" preserveAspectRatio="none" aria-hidden="true">
          <path d="M20 350H278c18 0 26-13 26-31v-28c0-18 8-31 26-31h238c18 0 26-13 26-31v-28c0-18 8-31 26-31h238c18 0 26-13 26-31V81c0-18 8-31 26-31h270" />
        </svg>

        {steps.map((step, index) => (
          <article className={`about-technique-step about-technique-step-${index + 1}`} key={step.number}>
            <div className="about-technique-copy">
              <span className="about-technique-num">{step.number}</span>
              <h3 className="about-technique-heading">{step.title}</h3>
            </div>
            <div className="about-technique-marker" aria-hidden="true">
              {step.plant && <PlantIcon stage={step.plant} className="about-technique-plant" />}
              <span />
            </div>
            <p className="about-technique-desc">{step.description}</p>
          </article>
        ))}

        <div className="about-technique-finish" aria-hidden="true">
          <PlantIcon stage={3} className="about-technique-plant" />
          <span className="about-technique-finish-dot" />
        </div>
      </div>
    </div>
  </section>
);

export default AboutFarmingTechniques;

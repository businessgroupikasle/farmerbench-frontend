import React from 'react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutDreamGarden } from '../components/about/AboutDreamGarden';
import { AboutDrivesUs } from '../components/about/AboutDrivesUs';
import { AboutValues } from '../components/about/AboutValues';
import { AboutJourney } from '../components/about/AboutJourney';
import { AboutFarmingTechniques } from '../components/about/AboutFarmingTechniques';
import { AboutBanner } from '../components/about/AboutBanner';
import './AboutPage.css';

export const AboutPage: React.FC = () => {
  return (
    <div className="aboutpage-layout">
      {/* 1. About Hero: Growing Better, Together */}
      <AboutHero />

      {/* 2. About Gardening: We'll Help You To Create Your Dream Garden */}
      <AboutDreamGarden />

      {/* 3. What Drives Us: Our Mission & Our Vision */}
      <AboutDrivesUs />

      {/* 4. Our Core Values: Farmer First, Quality & Trust, Expert Guidance, Sustainable Growth */}
      <AboutValues />

      {/* 5. Our Journey: 2020 to 2024 Milestones */}
      <AboutJourney />

      {/* 6. Our Farming Techniques: Ascending 4-Step Process Roadmap */}
      <AboutFarmingTechniques />

      {/* 7. Cultivating Healthy Food Mission Banner */}
      <AboutBanner />
    </div>
  );
};

export default AboutPage;

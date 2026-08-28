import React from 'react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutDrivesUs } from '../components/about/AboutDrivesUs';
import { AboutValues } from '../components/about/AboutValues';
import { AboutFarmingTechniques } from '../components/about/AboutFarmingTechniques';
import { AboutBanner } from '../components/about/AboutBanner';
import './AboutPage.css';

export const AboutPage: React.FC = () => {
  return (
    <div className="aboutpage-layout">
      {/* 1. About Hero: Growing Better, Together */}
      <AboutHero />

      {/* 2. What Drives Us: Our Mission & Our Vision */}
      <AboutDrivesUs />

      {/* 3. Our Core Values: Farmer First, Quality & Trust, Expert Guidance, Sustainable Growth */}
      <AboutValues />

      {/* 4. Our Farming Techniques: Ascending 4-Step Process Roadmap */}
      <AboutFarmingTechniques />

      {/* 5. Cultivating Healthy Food Mission Banner */}
      <AboutBanner />
    </div>
  );
};

export default AboutPage;

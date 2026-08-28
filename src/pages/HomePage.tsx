import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { HomeAgriculturePractice } from '../components/home/HomeAgriculturePractice';
import { HomeServices } from '../components/home/HomeServices';
import { HomeLatestNews } from '../components/home/HomeLatestNews';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage-layout">
      {/* 1. Hero Section (Natural Organic Products) */}
      <HomeHero />

      {/* 2. Main AgriFlow Sections */}
      <div className="container homepage-sections-container">
        {/* Agriculture & Natural Product Farming Section */}
        <HomeAgriculturePractice />

        {/* Latest Services: Revolutionizing the Way Food is Grown */}
        <HomeServices />

        {/* Our Latest News / Agricultural Insights Section */}
        <HomeLatestNews />
      </div>
    </div>
  );
};

export default HomePage;

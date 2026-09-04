import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { HomeOurProducts } from '../components/home/HomeOurProducts';
import { HomeLatestNews } from '../components/home/HomeLatestNews';
import { HomeSmartHub } from '../components/home/HomeSmartHub';
import { HomeMarketPrices } from '../components/home/HomeMarketPrices';
import { HomeCategories } from '../components/home/HomeCategories';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage-layout">
      {/* 1. Hero Section (Natural Organic Products) */}
      <HomeHero />

      <HomeCategories />

      {/* 2. Main AgriFlow Sections */}
      <div className="container homepage-sections-container">
        {/* Farmer tools and live information hub */}
        <HomeSmartHub />

        {/* Daily agricultural input and crop price snapshot */}
        <HomeMarketPrices />

        {/* Live Featured Products Section from Database */}
        <HomeOurProducts />

        {/* Our Latest News / Agricultural Insights Section */}
        <HomeLatestNews />
      </div>
    </div>
  );
};

export default HomePage;

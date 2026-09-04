import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { HomeAgriculturePractice } from '../components/home/HomeAgriculturePractice';
import { HomeOurProducts } from '../components/home/HomeOurProducts';
import { HomeLatestNews } from '../components/home/HomeLatestNews';
import { HomeSmartHub } from '../components/home/HomeSmartHub';
import { HomeMarketPrices } from '../components/home/HomeMarketPrices';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage-layout">
      {/* 1. Hero Section (Natural Organic Products) */}
      <HomeHero />

      {/* 2. Main AgriFlow Sections */}
      <div className="container homepage-sections-container">
        {/* Farmer tools and live information hub */}
        <HomeSmartHub />

        {/* Daily agricultural input and crop price snapshot */}
        <HomeMarketPrices />

        {/* Agriculture & Natural Product Farming Section */}
        <HomeAgriculturePractice />

        {/* Live Featured Products Section from Database */}
        <HomeOurProducts />

        {/* Our Latest News / Agricultural Insights Section */}
        <HomeLatestNews />
      </div>
    </div>
  );
};

export default HomePage;

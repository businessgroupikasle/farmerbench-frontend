import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { HomeOurProducts } from '../components/home/HomeOurProducts';
import { HomeLatestNews } from '../components/home/HomeLatestNews';
import { HomeSmartHub } from '../components/home/HomeSmartHub';
import { HomeMarketPrices } from '../components/home/HomeMarketPrices';
import { HomeCategories } from '../components/home/HomeCategories';
import { HomeCouponOffer } from '../components/home/HomeCouponOffer';
import { HomeMobileSearchBar } from '../components/home/HomeMobileSearchBar';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage-layout">
      {/* Quick Search Bar for Mobile View */}
      <HomeMobileSearchBar />

      {/* 1. Hero Section (Natural Organic Products) */}
      <HomeHero />

      {/* Shop by Categories Carousel */}
      <HomeCategories />

      <section
        className="home-tagline-marquee"
        aria-label="Empowering Farmers, Growing Tomorrow. Smart Farming, Better Harvests. Innovation For Better Farming. Growing Agriculture, Creating Tomorrow."
      >
        <div className="home-tagline-marquee-track" aria-hidden="true">
          <div className="home-tagline-marquee-group">
            <span>Empowering <strong>Farmers</strong>, Growing <strong>Tomorrow</strong></span>
            <span>Smart <strong>Farming</strong>, Better <strong>Harvests</strong></span>
            <span>Innovation For <strong>Better Farming</strong></span>
            <span>Growing <strong>Agriculture</strong>, Creating <strong>Tomorrow</strong></span>
          </div>
          <div className="home-tagline-marquee-group">
            <span>Empowering <strong>Farmers</strong>, Growing <strong>Tomorrow</strong></span>
            <span>Smart <strong>Farming</strong>, Better <strong>Harvests</strong></span>
            <span>Innovation For <strong>Better Farming</strong></span>
            <span>Growing <strong>Agriculture</strong>, Creating <strong>Tomorrow</strong></span>
          </div>
        </div>
      </section>

      <div className="container home-coupon-offer-wrap">
        <HomeCouponOffer />
      </div>

      {/* 2. Main AgriFlow Sections */}
      <div className="container homepage-sections-container">
        {/* Live Featured Products Section from Database (Best Selling Products) */}
        <HomeOurProducts />

        {/* Farmer tools and live information hub */}
        <HomeSmartHub />

        {/* Daily agricultural input and crop price snapshot */}
        <HomeMarketPrices />

        {/* Our Latest News / Agricultural Insights Section */}
        <HomeLatestNews />
      </div>
    </div>
  );
};

export default HomePage;





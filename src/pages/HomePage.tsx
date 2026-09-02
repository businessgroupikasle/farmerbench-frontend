import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { HomeSmartHub } from '../components/home/HomeSmartHub';
import { HomeMarketPrices } from '../components/home/HomeMarketPrices';
import { HomeCategories } from '../components/home/HomeCategories';
import { HomeServicesBlocks } from '../components/home/HomeServicesBlocks';
import { HomeGovernmentSchemes } from '../components/home/HomeGovernmentSchemes';
import { HomeFeaturedProducts } from '../components/home/HomeFeaturedProducts';
import { HomeFooterUpdates } from '../components/home/HomeFooterUpdates';
import { HomeBrands } from '../components/home/HomeBrands';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage-layout">
      <HomeHero />
      <div className="container homepage-sections-container" style={{ marginTop: '0.75rem' }}>
        <HomeCategories />
        <HomeSmartHub />
        <HomeMarketPrices />
        <HomeServicesBlocks />
        <HomeGovernmentSchemes />
        <HomeFeaturedProducts />
        <HomeFooterUpdates />
        <HomeBrands />
      </div>
    </div>
  );
};

export default HomePage;



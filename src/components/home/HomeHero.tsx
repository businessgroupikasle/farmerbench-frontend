import React from 'react';
import heroBg from '../../assets/hero-bg.jpg';
import { getHeroBgUrl } from '../../utils/image';

interface HomeHeroProps {
  onDiscoverClick?: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onDiscoverClick }) => {
  const heroImageUrl = getHeroBgUrl(heroBg);

  const handleScrollToStore = () => {
    if (onDiscoverClick) {
      onDiscoverClick();
    } else {
      const el = document.getElementById('store-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="agriflow-hero" style={{ backgroundImage: `url(${heroImageUrl})` }}>
      <div className="agriflow-hero-overlay" />
      <div className="container agriflow-hero-content animate-fade-in">
        <h1 className="agriflow-hero-title">Natural</h1>
        <h2 className="agriflow-hero-subtitle">Organic Products</h2>
        <button onClick={handleScrollToStore} className="agriflow-hero-btn">
          Discover More
        </button>
      </div>
    </section>
  );
};

export default HomeHero;

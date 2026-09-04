import React from 'react';
import { Link } from 'react-router-dom';
import { useHeroBanners } from '../../hooks/useHeroBanners';
import { HeroCarousel } from '../common/HeroCarousel';
import { getUploadUrl } from '../../utils/image';

export const AboutHero: React.FC = () => {
  const { data: banners = [] } = useHeroBanners('ABOUT');
  const render = (banner?: any) => (
    <section className="about-hero-section" style={banner ? { backgroundImage: `linear-gradient(rgba(0,0,0,${banner.overlayOpacity}), rgba(0,0,0,${banner.overlayOpacity})), url(${getUploadUrl(banner.desktopImage)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      <div className="about-hero-container"><div className="about-hero-content animate-fade-in" style={{ textAlign: banner?.textAlignment || 'left' }}>
        <span className="about-hero-tag">{banner?.eyebrow || 'ABOUT AgriEra'}</span>
        <h1 className="about-hero-title"><span>{banner?.title || 'Growing Better,'}</span><span>{banner?.highlightedText || 'Together'}</span></h1>
        <p className="about-hero-desc">{banner?.description || 'We help farmers access trusted agricultural products, expert guidance and practical solutions for healthier crops and better yields.'}</p>
        <Link to={banner?.primaryButtonLink || '/products'} className="about-hero-cta">{banner?.primaryButtonText || 'Explore Our Products'}</Link>
      </div></div><div className="about-hero-soil-strip" />
    </section>
  );
  return banners.length ? <HeroCarousel banners={banners} renderSlide={(banner) => render(banner)} /> : render();
};
export default AboutHero;

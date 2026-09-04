import React from 'react';
import { Headphones, PackageCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/home-hero-farmer-products.png';
import { useHeroBanners } from '../../hooks/useHeroBanners';
import { HeroCarousel } from '../common/HeroCarousel';
import { getUploadUrl } from '../../utils/image';

const trust = <div className="agriflow-hero-trust" aria-label="AgriEra benefits"><div><PackageCheck size={22} /><span>100% Original<br />Products</span></div><div><Headphones size={22} /><span>Expert<br />Support</span></div><div><Truck size={22} /><span>Fast &amp; Safe<br />Delivery</span></div></div>;

export const HomeHero: React.FC = () => {
  const { data: banners = [] } = useHeroBanners('HOME');
  const render = (banner?: any) => (
    <section className="agriflow-hero" style={{ backgroundImage: `linear-gradient(${banner?.overlayColor || '#000000'}${Math.round((banner?.overlayOpacity ?? 0) * 255).toString(16).padStart(2, '0')}, ${banner?.overlayColor || '#000000'}${Math.round((banner?.overlayOpacity ?? 0) * 255).toString(16).padStart(2, '0')}), url(${banner ? getUploadUrl(banner.desktopImage, heroBg) : heroBg})` }}>
      <div className="container agriflow-hero-content animate-fade-in" style={{ textAlign: banner?.textAlignment || 'left' }}>
        {banner?.eyebrow && <span>{banner.eyebrow}</span>}
        <h1 className="agriflow-hero-title"><span>{banner?.title || 'Better Farming'}</span><span>{banner?.highlightedText || 'Starts Here'}</span></h1>
        <p className="agriflow-hero-description">{banner?.description || 'Quality agricultural products and trusted farming solutions – all in one place.'}</p>
        <div className="agriflow-hero-actions">
          <Link to={banner?.primaryButtonLink || '/products'} className="agriflow-hero-btn agriflow-hero-btn-primary">{banner?.primaryButtonText || 'Shop Products'}</Link>
          {(banner?.secondaryButtonText !== null) && <Link to={banner?.secondaryButtonLink || '/services'} className="agriflow-hero-btn agriflow-hero-btn-secondary">{banner?.secondaryButtonText || 'Explore Services'}</Link>}
        </div>{trust}
      </div>
    </section>
  );
  return banners.length ? <HeroCarousel banners={banners} renderSlide={(banner) => render(banner)} /> : render();
};
export default HomeHero;

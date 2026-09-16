import React, { useState } from 'react';
import { Headphones, PackageCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/home-hero-farmer-products-optimized.jpg';
import { useHeroBanners } from '../../hooks/useHeroBanners';
import { HeroCarousel } from '../common/HeroCarousel';
import { getUploadUrl } from '../../utils/image';
import { useQueryClient } from '@tanstack/react-query';

const TrustItems = ({ mobile = false }: { mobile?: boolean }) => mobile
  ? <div className="agriflow-hero-trust agriflow-hero-trust-mobile" aria-label="AgriEra benefits"><div><PackageCheck size={22} /><span><strong>100% Original Products</strong><small>Trusted brands only</small></span></div><div><Truck size={22} /><span><strong>Free Delivery</strong><small>On eligible orders</small></span></div><div><Headphones size={22} /><span><strong>Expert Support</strong><small>Farming help available</small></span></div></div>
  : <div className="agriflow-hero-trust" aria-label="AgriEra benefits"><div><PackageCheck size={22} /><span>100% Original<br />Products</span></div><div><Headphones size={22} /><span>Expert<br />Support</span></div><div><Truck size={22} /><span>Fast &amp; Safe<br />Delivery</span></div></div>;

export const HomeHero: React.FC<{ onReady?: () => void }> = ({ onReady }) => {
  const queryClient = useQueryClient();
  const [banners] = useState<any[]>(() => queryClient.getQueryData<any[]>(['hero-banners', 'HOME']) || []);
  useHeroBanners('HOME');
  const render = (banner?: any, index = 0) => {
    const desktopImage = banner ? getUploadUrl(banner.desktopImage, heroBg) : heroBg;
    const mobileImage = banner?.mobileImage ? getUploadUrl(banner.mobileImage, heroBg) : desktopImage;
    const isPrimary = index === 0;

    return (
      <section className="agriflow-hero">
        <picture className="agriflow-hero-media" aria-hidden="true">
          <source media="(max-width: 768px)" srcSet={mobileImage} />
          <img
            src={desktopImage}
            alt=""
            loading={isPrimary ? 'eager' : 'lazy'}
            fetchPriority={isPrimary ? 'high' : 'low'}
            decoding="async"
            onLoad={isPrimary ? onReady : undefined}
          />
        </picture>
        <span
          className="agriflow-hero-overlay"
          aria-hidden="true"
          style={{ backgroundColor: banner?.overlayColor || '#000000', opacity: banner?.overlayOpacity ?? 0 }}
        />
        <div className="container agriflow-hero-content animate-fade-in" style={{ textAlign: banner?.textAlignment || 'left' }}>
          {banner?.eyebrow && <span>{banner.eyebrow}</span>}
          <h1 className="agriflow-hero-title"><span>{banner?.title || 'Better Farming'}</span><span>{banner?.highlightedText || 'Starts Here'}</span></h1>
          <p className="agriflow-hero-description">{banner?.description || 'Quality agricultural products and trusted farming solutions ??? all in one place.'}</p>
          <div className="agriflow-hero-actions">
            <Link to={banner?.primaryButtonLink || '/products'} className="agriflow-hero-btn agriflow-hero-btn-primary">{banner?.primaryButtonText || 'Shop Products'}</Link>
            {(banner?.secondaryButtonText !== null) && <Link to={banner?.secondaryButtonLink || '/services'} className="agriflow-hero-btn agriflow-hero-btn-secondary">{banner?.secondaryButtonText || 'Explore Services'}</Link>}
          </div><TrustItems />
        </div>
      </section>
    );
  };
  return <div className="home-hero-wrap">{banners.length ? <HeroCarousel banners={banners} renderSlide={(banner, index) => render(banner, index)} /> : render()}<TrustItems mobile /></div>;
};
export default HomeHero;

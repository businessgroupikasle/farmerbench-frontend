import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroBanner } from '@formerbench/shared';

interface HeroCarouselProps {
  banners: HeroBanner[];
  className?: string;
  renderSlide: (banner: HeroBanner, index: number) => React.ReactNode;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners, className = '', renderSlide }) => {
  const [active, setActive] = useState(0);
  useEffect(() => { setActive(0); }, [banners]);
  useEffect(() => {
    if (banners.length < 2) return;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % banners.length), banners[active]?.autoplayDuration || 5000);
    return () => window.clearTimeout(timer);
  }, [active, banners]);
  if (!banners.length) return null;
  const move = (step: number) => setActive((active + step + banners.length) % banners.length);
  return (
    <div className={`fb-hero-carousel ${className}`}>
      {banners.map((banner, index) => <div key={banner.id} className={`fb-hero-slide ${index === active ? 'active' : ''}`} aria-hidden={index !== active}>{renderSlide(banner, index)}</div>)}
      {banners.length > 1 && <>
        <button type="button" className="fb-hero-nav prev" onClick={() => move(-1)} aria-label="Previous banner"><ChevronLeft /></button>
        <button type="button" className="fb-hero-nav next" onClick={() => move(1)} aria-label="Next banner"><ChevronRight /></button>
        <div className="fb-hero-dots">{banners.map((banner, index) => <button key={banner.id} type="button" className={index === active ? 'active' : ''} onClick={() => setActive(index)} aria-label={`Show banner ${index + 1}`} />)}</div>
      </>}
    </div>
  );
};

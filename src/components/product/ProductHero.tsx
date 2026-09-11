import React from 'react';
import { Leaf, ShieldCheck, UserRoundCheck } from 'lucide-react';
import heroProductsImg from '../../assets/product-hero-products.jpg';
import './ProductHero.css';
import { useHeroBanners } from '../../hooks/useHeroBanners';
import { HeroCarousel } from '../common/HeroCarousel';
import { getUploadUrl } from '../../utils/image';

interface ProductHeroProps {
  initialSearch?: string;
  onSearch?: (term: string) => void;
  storeName?: string;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  storeName = 'GREENLA AGRI STORE',
}) => {
  const { data: banners = [] } = useHeroBanners('PRODUCTS');

  const renderHero = (banner?: any) => (
    <section
      className="product-hero-banner"
      aria-label="Product Catalog Banner"
      style={{ '--product-mobile-image': `url(${banner ? getUploadUrl(banner.mobileImage || banner.desktopImage, heroProductsImg) : heroProductsImg})` } as React.CSSProperties}
    >
      <div className="product-hero-container">
        {/* Left Content Column */}
        <div className="product-hero-left">
          {/* Brand Tagline */}
          <div className="product-hero-brand-tag">
            <span className="product-hero-brand-text">{banner?.eyebrow || storeName}</span>
            <Leaf className="product-hero-leaf-icon" size={13} fill="currentColor" aria-hidden="true" />
          </div>

          {/* Main Headline */}
          <h1 className="product-hero-title">
            <span>{banner?.title || 'Trusted Products for'}</span>
            <span className="product-hero-title-highlight">{banner?.highlightedText || 'Better Crops'}</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="product-hero-description">
            {banner?.description || 'Explore genuine crop nutrition, protection and growth solutions selected by agriculture experts.'}
          </p>

          {/* Trust Badges */}
          <div className="product-hero-badges-row">
            <div className="product-hero-badge">
              <div className="product-hero-badge-icon">
                <ShieldCheck size={18} strokeWidth={2.4} />
              </div>
              <span className="product-hero-badge-text">100% Genuine</span>
            </div>

            <div className="product-hero-badge">
              <div className="product-hero-badge-icon">
                <UserRoundCheck size={17} strokeWidth={2.2} />
              </div>
              <span className="product-hero-badge-text">Expert Recommended</span>
            </div>
          </div>
        </div>

        {/* Right Artwork Showcase */}
        <div className="product-hero-right">
          <div className="product-hero-image-wrapper">
            <img
              src={banner ? getUploadUrl(banner.desktopImage, heroProductsImg) : heroProductsImg}
              alt={banner?.imageAlt || 'Genuine agricultural products'}
              className="product-hero-image"
              loading="eager"
            />
            <div className="product-hero-image-gradient-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
  return banners.length ? <HeroCarousel banners={banners} renderSlide={(banner) => renderHero(banner)} /> : renderHero();
};

export default ProductHero;
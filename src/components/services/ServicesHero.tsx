import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardCheck, Sprout, UserCheck } from 'lucide-react';
import { useHeroBanners } from '../../hooks/useHeroBanners';
import { HeroCarousel } from '../common/HeroCarousel';
import { getUploadUrl } from '../../utils/image';

interface ServicesHeroProps { onBookConsultation?: () => void; onTalkToExpert?: () => void; }

export const ServicesHero: React.FC<ServicesHeroProps> = ({ onBookConsultation, onTalkToExpert }) => {
  const navigate = useNavigate();
  const { data: banners = [] } = useHeroBanners('SERVICES');
  const action = (link: string | null | undefined, fallback?: () => void) => link ? navigate(link) : fallback?.();
  const render = (banner?: any) => (
    <section className="services-hero-section" style={banner ? { backgroundImage: `linear-gradient(rgba(0,0,0,${banner.overlayOpacity}), rgba(0,0,0,${banner.overlayOpacity})), url(${getUploadUrl(banner.desktopImage)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      <div className="services-hero-container"><nav className="services-hero-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Services</span></nav>
        <div className="services-hero-content animate-fade-in" style={{ textAlign: banner?.textAlignment || 'left' }}>
          <div className="services-hero-badge-tag"><span>{banner?.eyebrow || 'EXPERT FARMING SERVICES'}</span></div>
          <h1 className="services-hero-title"><span className="services-hero-title-dark">{banner?.title || 'Practical Solutions'}</span>{' '}<span className="services-hero-title-green">{banner?.highlightedText || 'for Better Farming'}</span></h1>
          <p className="services-hero-desc">{banner?.description || 'From soil health to crop protection, our agriculture experts provide the right guidance and on-field support for every stage of your farm.'}</p>
          <div className="services-hero-actions"><button onClick={() => action(banner?.primaryButtonLink, onBookConsultation)} className="services-btn-primary">{banner?.primaryButtonText || 'Book a Consultation'}</button><button onClick={() => action(banner?.secondaryButtonLink, onTalkToExpert)} className="services-btn-secondary">{banner?.secondaryButtonText || 'Talk to an Expert'}</button></div>
          <div className="services-hero-features-strip"><div className="services-feature-pill"><div className="services-feature-icon-box"><UserCheck size={20} /></div><span className="services-feature-label">Qualified Experts</span></div><div className="services-feature-pill"><div className="services-feature-icon-box"><Sprout size={20} /></div><span className="services-feature-label">Local Farm Support</span></div><div className="services-feature-pill"><div className="services-feature-icon-box"><ClipboardCheck size={20} /></div><span className="services-feature-label">Practical Recommendations</span></div></div>
        </div></div>
    </section>
  );
  return banners.length ? <HeroCarousel banners={banners} renderSlide={(banner) => render(banner)} /> : render();
};
export default ServicesHero;

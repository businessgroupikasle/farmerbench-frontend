import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import farmEquipmentImage from '../../assets/categories/farm-equipment.jpg';
import seedsImage from '../../assets/categories/seeds.jpg';

const promotions = [
  {
    title: 'Farm Equipment',
    description: 'Reliable tools and equipment built for smarter, easier farming.',
    action: 'Shop Equipment',
    href: '/products?category=farm-equipment',
    image: farmEquipmentImage,
    tone: 'equipment',
  },
  {
    title: 'Seeds & Crop Care',
    description: 'Quality seeds and crop solutions for healthier, stronger yields.',
    action: 'Explore Seeds',
    href: '/products?category=seeds',
    image: seedsImage,
    tone: 'seeds',
  },
];

export const HomePromoBanners: React.FC = () => (
  <section className={'home-promo-banners'} aria-label={'Featured farming collections'}>
    {promotions.map((promotion) => (
      <article
        key={promotion.title}
        className={`home-promo-banner ${promotion.tone}`}
      >
        <div className={'home-promo-content'}>
          <h2>{promotion.title}</h2>
          <p>{promotion.description}</p>
          <Link to={promotion.href} className={'home-promo-action'}>
            <span>{promotion.action}</span>
            <ArrowRight size={14} aria-hidden={'true'} />
          </Link>
        </div>
        <div className={'home-promo-visual'} aria-hidden={'true'}>
          <img src={promotion.image} alt={''} loading={'lazy'} />
        </div>
      </article>
    ))}
  </section>
);

export default HomePromoBanners;

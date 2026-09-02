import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import './HomeCategories.css';

// Import local project assets as reliable fallbacks
import localSprout from '../../assets/services-sprout-left.jpg';
import localIrrigation from '../../assets/smart-irrigation.jpg';
import localFertilizer from '../../assets/bio-power-promoter.jpg';
import localPlantCare from '../../assets/neem-oil-bottle.jpg';
import localFarmEquipment from '../../assets/farming-practices.jpg';

interface CategoryCardData {
  id: number;
  name: string;
  link: string;
  bgColor: string;
  imgSrc: string;
  fallbackImg: string;
}

const categoriesList: CategoryCardData[] = [
  {
    id: 1,
    name: 'Seeds',
    link: '/products?category=seeds',
    bgColor: '#F7F5EE',
    imgSrc: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localSprout,
  },
  {
    id: 2,
    name: 'Plants & Saplings',
    link: '/products?category=plants',
    bgColor: '#F3F6EC',
    imgSrc: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localSprout,
  },
  {
    id: 3,
    name: 'Fertilizers',
    link: '/products?category=fertilizers',
    bgColor: '#FDF2E2',
    imgSrc: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localFertilizer,
  },
  {
    id: 4,
    name: 'Irrigation & Pipes',
    link: '/products?category=irrigation',
    bgColor: '#EDF3F6',
    imgSrc: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localIrrigation,
  },
  {
    id: 5,
    name: 'Accessories',
    link: '/products?category=accessories',
    bgColor: '#FDF0E6',
    imgSrc: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localFarmEquipment,
  },
  {
    id: 6,
    name: 'Farm Equipment',
    link: '/products?category=equipment',
    bgColor: '#EDF1F5',
    imgSrc: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localFarmEquipment,
  },
  {
    id: 7,
    name: 'Pipes & Fittings',
    link: '/products?category=pipes',
    bgColor: '#ECEFF1',
    imgSrc: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localIrrigation,
  },
  {
    id: 8,
    name: 'Plant Care',
    link: '/products?category=plantcare',
    bgColor: '#EBF5EE',
    imgSrc: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=500&q=80',
    fallbackImg: localPlantCare,
  },
];

export const HomeCategories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNextScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="home-categories-section" aria-label="Shop by Categories">
      <div className="categories-header">
        <span className="decor-dash"></span>
        <h2 className="categories-title">Shop by Categories</h2>
        <span className="decor-dash"></span>
      </div>

      <div className="categories-grid-wrapper">
        <div className="categories-grid" ref={scrollRef}>
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="category-card-pill"
              style={{ backgroundColor: cat.bgColor }}
            >
              {/* Natural Upper Image Area */}
              <div className="category-image-showcase">
                <img
                  src={cat.imgSrc}
                  alt={cat.name}
                  className="cat-photo-img"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== cat.fallbackImg) {
                      target.src = cat.fallbackImg;
                    }
                  }}
                />
              </div>

              {/* Natural Bottom Content */}
              <div className="category-bottom-info">
                <h3 className="category-title-text">{cat.name}</h3>
                <span className="category-shop-now-link">
                  Shop Now <ArrowRight size={13} strokeWidth={2.5} className="shop-arrow-icon" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <button
          className="categories-floating-next-btn"
          onClick={handleNextScroll}
          type="button"
          aria-label="Next categories"
        >
          <ChevronRight size={22} color="#1E293B" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
};








import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import irrigationImg from '../../assets/smart-irrigation.jpg';
import monitoringImg from '../../assets/crop-monitoring.jpg';
import sustainableImg from '../../assets/sustainable-farm.jpg';
import organicImg from '../../assets/organic-farming.jpg';

interface ServiceItem {
  id: string;
  tag: string;
  title: string;
  image: string;
  catalogCategory: string;
  catalogSearch: string;
}

export const HomeServices: React.FC = () => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);

  const services: ServiceItem[] = [
    {
      id: 'smart-irrigation',
      tag: 'Crops',
      title: 'Smart Irrigation',
      image: irrigationImg,
      catalogCategory: 'organic-crops',
      catalogSearch: 'irrigation',
    },
    {
      id: 'crop-monitoring',
      tag: 'Checkup',
      title: 'Crop Monitoring',
      image: monitoringImg,
      catalogCategory: 'farm-supplies',
      catalogSearch: 'seeds',
    },
    {
      id: 'sustainable-farm',
      tag: 'Project',
      title: 'Sustainable Farm',
      image: sustainableImg,
      catalogCategory: 'fresh-produce',
      catalogSearch: 'organic',
    },
    {
      id: 'organic-farming',
      tag: 'Fruits',
      title: 'Organic Farming',
      image: organicImg,
      catalogCategory: 'heritage-grains',
      catalogSearch: 'farming',
    },
  ];

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const displayedServices = [...services.slice(startIndex), ...services.slice(0, startIndex)];

  const handleCardClick = (service: ServiceItem) => {
    navigate(`/products?category=${service.catalogCategory}&search=${encodeURIComponent(service.catalogSearch)}`);
  };

  return (
    <section id="services" className="agriflow-services-section">
      <div className="container">
        {/* Section Header */}
        <div className="agriflow-services-header">
          <div>
            <div className="agriflow-service-tag">
              <Sprout size={16} style={{ color: '#78B833' }} />
              <span>LATEST SERVICE</span>
            </div>
            <h2 className="agriflow-service-title">
              Revolutionizing the Way Food is Grown
            </h2>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="agriflow-carousel-controls">
            <button
              onClick={handlePrev}
              className="agriflow-carousel-btn"
              aria-label="Previous service"
              title="Previous"
            >
              <ChevronLeft size={20} strokeWidth={2.4} />
            </button>
            <div className="agriflow-carousel-dash" />
            <button
              onClick={handleNext}
              className="agriflow-carousel-btn"
              aria-label="Next service"
              title="Next"
            >
              <ChevronRight size={20} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="agriflow-services-grid">
          {displayedServices.map((item) => {
            return (
              <div
                key={item.id}
                className="agriflow-service-card"
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(item);
                  }
                }}
              >
                <div className="agriflow-service-img-wrapper">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="agriflow-service-badge">
                  <span className="agriflow-service-badge-dot" />
                  <span>{item.tag}</span>
                </div>
                <h3 className="agriflow-service-card-title">{item.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;

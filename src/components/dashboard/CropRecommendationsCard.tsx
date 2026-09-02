import React from 'react';
import { Sprout } from 'lucide-react';
import humicImg from '../../assets/humic-power.jpg';
import bioPowerImg from '../../assets/bio-power-promoter.jpg';
import trichoImg from '../../assets/trichoderma-fungicide.jpg';

interface CropRecommendationsCardProps {
  cropName?: string;
  onViewRecommendations: () => void;
  onSelectProduct?: (product: any) => void;
}

export const CropRecommendationsCard: React.FC<CropRecommendationsCardProps> = ({
  cropName = 'Paddy',
  onViewRecommendations,
  onSelectProduct,
}) => {
  const recommendedItems = [
    {
      id: 'rec-1',
      title: 'Micronutrient Mix',
      price: 300,
      image: bioPowerImg,
    },
    {
      id: 'rec-2',
      title: 'Root Developer',
      price: 480,
      image: humicImg,
    },
    {
      id: 'rec-3',
      title: 'Plant Shield Bio Pesticide',
      price: 460,
      image: trichoImg,
    },
  ];

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">
          <Sprout size={18} color="#0F4726" />
          Recommended for Your {cropName} Crop
        </h3>
      </div>

      <div className="fb-recommendations-content">
        <p className="fb-recom-sub">
          Based on your recent orders and saved crop preference.
        </p>

        <div className="fb-recom-items-grid">
          {recommendedItems.map((item) => (
            <div
              key={item.id}
              className="fb-recom-item-card"
              onClick={() => onSelectProduct && onSelectProduct(item)}
              style={{ cursor: 'pointer' }}
            >
              <img src={item.image} alt={item.title} className="fb-recom-item-img" />
              <span className="fb-recom-item-title">{item.title}</span>
              <span className="fb-recom-item-price">₹{item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <button
          className="fb-btn-primary-dark"
          style={{ width: '100%', marginTop: '0.25rem' }}
          onClick={onViewRecommendations}
        >
          View Recommendations
        </button>
      </div>
    </div>
  );
};

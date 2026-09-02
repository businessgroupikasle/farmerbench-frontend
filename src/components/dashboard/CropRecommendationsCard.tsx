import React from 'react';
import { Sprout, Package } from 'lucide-react';
import { Product } from '@formerbench/shared';

interface CropRecommendationsCardProps {
  cropName?: string;
  products?: Product[];
  onViewRecommendations: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const CropRecommendationsCard: React.FC<CropRecommendationsCardProps> = ({
  cropName = 'Paddy',
  products = [],
  onViewRecommendations,
  onSelectProduct,
}) => {
  const displayItems = products.slice(0, 3);

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

        {displayItems.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--fb-text-muted)', fontSize: '0.85rem' }}>
            Explore our bio-fertilizers and crop boosters to receive customized farming recommendations.
          </div>
        ) : (
          <div className="fb-recom-items-grid">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="fb-recom-item-card"
                onClick={() => onSelectProduct && onSelectProduct(item)}
                style={{ cursor: 'pointer' }}
              >
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.title} className="fb-recom-item-img" />
                ) : (
                  <div
                    className="fb-recom-item-img"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '6px' }}
                  >
                    <Package size={18} color="#94a3b8" />
                  </div>
                )}
                <span className="fb-recom-item-title">{item.title}</span>
                <span className="fb-recom-item-price">₹{Number(item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

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

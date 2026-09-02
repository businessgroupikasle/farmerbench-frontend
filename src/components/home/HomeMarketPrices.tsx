import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import './HomeMarketPrices.css';

interface PriceItem {
  id: number;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  type: 'urea' | 'dap' | 'mop' | 'oil' | 'tomato' | 'potato';
}

const pricesData: PriceItem[] = [
  { id: 1, name: 'Urea (45Kg)', price: '266', change: '2.00', isUp: false, type: 'urea' },
  { id: 2, name: 'DAP (50Kg)', price: '1,350', change: '5.00', isUp: false, type: 'dap' },
  { id: 3, name: 'MOP (50Kg)', price: '1,450', change: '3.00', isUp: true, type: 'mop' },
  { id: 4, name: 'Mustard Oil (1L)', price: '130', change: '1.00', isUp: false, type: 'oil' },
  { id: 5, name: 'Tomato (1kg)', price: '22', change: '2.00', isUp: true, type: 'tomato' },
  { id: 6, name: 'Potato (1kg)', price: '18', change: '1.00', isUp: false, type: 'potato' },
];

function renderProductIcon(type: PriceItem['type']) {
  switch (type) {
    case 'urea':
      return (
        <svg viewBox="0 0 48 48" className="price-item-svg">
          <path d="M12 14 L16 8 L32 8 L36 14 L38 42 C38 44 36 46 34 46 L14 46 C12 46 10 44 10 42 Z" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1.5" />
          <rect x="15" y="20" width="18" height="16" rx="2" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="1" />
          <text x="24" y="30" fontSize="7" fontWeight="900" textAnchor="middle" fill="#2E7D32">UREA</text>
          <circle cx="24" cy="33" r="1.5" fill="#4CAF50" />
        </svg>
      );
    case 'dap':
      return (
        <svg viewBox="0 0 48 48" className="price-item-svg">
          <path d="M12 14 L16 8 L32 8 L36 14 L38 42 C38 44 36 46 34 46 L14 46 C12 46 10 44 10 42 Z" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1.5" />
          <rect x="15" y="20" width="18" height="16" rx="2" fill="#FFF3E0" stroke="#FF9800" strokeWidth="1" />
          <text x="24" y="30" fontSize="7" fontWeight="900" textAnchor="middle" fill="#E65100">DAP</text>
          <path d="M20 34 Q24 32 28 34" stroke="#FF9800" strokeWidth="1" fill="none" />
        </svg>
      );
    case 'mop':
      return (
        <svg viewBox="0 0 48 48" className="price-item-svg">
          <path d="M12 14 L16 8 L32 8 L36 14 L38 42 C38 44 36 46 34 46 L14 46 C12 46 10 44 10 42 Z" fill="#BCAAA4" stroke="#6D4C41" strokeWidth="1.5" />
          <rect x="15" y="20" width="18" height="16" rx="2" fill="#FBE9E7" stroke="#FF5722" strokeWidth="1" />
          <text x="24" y="30" fontSize="7" fontWeight="900" textAnchor="middle" fill="#BF360C">MOP</text>
          <path d="M22 33 L26 33" stroke="#FF5722" strokeWidth="1.5" />
        </svg>
      );
    case 'oil':
      return (
        <svg viewBox="0 0 48 48" className="price-item-svg">
          <rect x="20" y="6" width="8" height="6" rx="2" fill="#F59E0B" />
          <path d="M18 14 L30 14 L33 42 C33 44 31 46 29 46 L19 46 C17 46 15 44 15 42 Z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="17" y="22" width="14" height="14" rx="2" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="0.8" />
          <circle cx="24" cy="28" r="3" fill="#EAB308" />
          <path d="M24 24 Q26 27 24 30" stroke="#A16207" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case 'tomato':
      return (
        <svg viewBox="0 0 48 48" className="price-item-svg">
          <circle cx="24" cy="28" r="15" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
          <circle cx="18" cy="22" r="3.5" fill="#F87171" opacity="0.8" />
          <path d="M24 13 L24 8 M20 12 L24 14 L28 12 M22 10 L24 14 L26 10" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <polygon points="24,13 21,17 25,16 28,18 26,14" fill="#22C55E" />
        </svg>
      );
    case 'potato':
      return (
        <svg viewBox="0 0 48 48" className="price-item-svg">
          <ellipse cx="26" cy="30" rx="14" ry="11" fill="#D97706" opacity="0.9" stroke="#B45309" strokeWidth="1" />
          <ellipse cx="18" cy="24" rx="11" ry="9" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
          <circle cx="14" cy="22" r="1" fill="#92400E" />
          <circle cx="22" cy="26" r="1.2" fill="#92400E" />
          <circle cx="28" cy="32" r="1" fill="#78350F" />
          <circle cx="33" cy="28" r="0.8" fill="#78350F" />
        </svg>
      );
  }
}

export const HomeMarketPrices: React.FC = () => {
  return (
    <section className="home-market-prices-section" aria-label="Today's Market Prices">
      <div className="market-prices-header">
        <div className="market-prices-title-group">
          <h2 className="market-prices-title">Today's Market Prices</h2>
          <span className="market-prices-subtitle">(Updated Daily)</span>
        </div>
        <Link to="/prices" className="view-all-link">
          View All Prices <ArrowRight size={15} />
        </Link>
      </div>

      <div className="market-prices-scroll">
        <div className="market-prices-track">
          {pricesData.map((item) => (
            <div key={item.id} className="market-price-card">
              <div className="price-card-icon">
                {renderProductIcon(item.type)}
              </div>
              <div className="price-card-info">
                <span className="price-name">{item.name}</span>
                <div className="price-value-row">
                  <span className="price-value">₹{item.price}</span>
                  <span className={`price-change ${item.isUp ? 'change-up' : 'change-down'}`}>
                    {item.isUp ? <ArrowUp size={11} strokeWidth={3} /> : <ArrowDown size={11} strokeWidth={3} />}
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { Leaf, Sprout, ShieldCheck, Truck } from 'lucide-react';

export const HomeHighlights: React.FC = () => {
  const highlights = [
    {
      icon: <Leaf size={24} />,
      title: '100% Organic',
      description: 'Certified natural harvest',
      color: '#78B833',
      bg: 'rgba(120, 184, 51, 0.15)',
    },
    {
      icon: <Sprout size={24} />,
      title: 'Direct from Farms',
      description: 'Fresh farm-to-table supply',
      color: '#F6B748',
      bg: 'rgba(246, 183, 72, 0.15)',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Quality Guaranteed',
      description: 'Tested purity & standards',
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.15)',
    },
    {
      icon: <Truck size={24} />,
      title: 'Eco Delivery',
      description: 'Fast & temperature controlled',
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.15)',
    },
  ];

  return (
    <section className="agriflow-highlights-grid">
      {highlights.map((item, idx) => (
        <div key={idx} className="card card-hover agriflow-highlight-card">
          <div
            className="agriflow-highlight-icon-box"
            style={{ backgroundColor: item.bg, color: item.color }}
          >
            {item.icon}
          </div>
          <div>
            <h4 className="agriflow-highlight-title">{item.title}</h4>
            <p className="agriflow-highlight-desc">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HomeHighlights;

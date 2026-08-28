import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export const HomeMissionBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="card agriflow-mission-card">
      <div>
        <span className="agriflow-mission-tag">
          SUSTAINABLE AGRICULTURE
        </span>
        <h2 className="agriflow-mission-title">
          Nurtured by Nature, Delivered with Care.
        </h2>
        <p className="agriflow-mission-desc">
          We partner with local regenerative farmers and organic growers across the hills and valleys to bring you the purest harvest without synthetic pesticides or harmful additives.
        </p>
        <div className="agriflow-mission-actions">
          <Button
            variant="primary"
            size="md"
            style={{ backgroundColor: '#F6B748', color: '#16231a', fontWeight: 700, border: 'none' }}
            onClick={() => navigate('/products')}
          >
            Shop Fresh Harvest
          </Button>
          <Button
            variant="outline"
            size="md"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}
            onClick={() => {
              const el = document.getElementById('categories');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Farming
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80"
          alt="Organic farm produce"
          className="agriflow-mission-img"
        />
      </div>
    </section>
  );
};

export default HomeMissionBanner;

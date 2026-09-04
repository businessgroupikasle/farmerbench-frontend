import React from 'react';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { marketPriceService } from '../../services/marketPrice.service';
import fallbackCropImage from '../../assets/peapod.jpg';

const cropImages: Array<[string[], string]> = [
  [['tomato'], 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=120&h=120&fit=crop'],
  [['potato'], 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=120&h=120&fit=crop'],
  [['onion'], 'https://images.unsplash.com/photo-1508747703725-719777637510?w=120&h=120&fit=crop'],
  [['banana'], 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=120&h=120&fit=crop'],
  [['cauliflower'], 'https://images.unsplash.com/photo-1568584711271-61c5a2b4db?w=120&h=120&fit=crop'],
  [['chilli', 'pepper'], 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=120&h=120&fit=crop'],
  [['ginger'], 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=120&h=120&fit=crop'],
  [['groundnut', 'peanut'], 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=120&h=120&fit=crop'],
  [['pumpkin'], 'https://images.unsplash.com/photo-1506918565526-a15fdf909f8e?w=120&h=120&fit=crop'],
  [['beetroot', 'beet'], 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=120&h=120&fit=crop'],
  [['cucumber', 'kheera'], 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=120&h=120&fit=crop'],
  [['coriander', 'mint', 'pudina'], 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=120&h=120&fit=crop'],
  [['rice', 'paddy', 'wheat'], 'https://images.unsplash.com/photo-1536050302835-a7e3f2a3ac2f?w=120&h=120&fit=crop'],
  [['carrot'], 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120&h=120&fit=crop'],
  [['coconut'], 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=120&h=120&fit=crop'],
  [['brinjal', 'eggplant', 'aubergine'], 'https://images.unsplash.com/photo-1628773822503-930a84d95229?w=120&h=120&fit=crop'],
  [['garlic'], 'https://images.unsplash.com/photo-1615477032219-b12da2a30c4b?w=120&h=120&fit=crop'],
  [['cabbage'], 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=120&h=120&fit=crop'],
  [['bhendi', 'bhindi', 'okra', 'ladies finger'], 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=120&h=120&fit=crop'],
];

const imageFor = (commodity: string) => {
  const value = commodity.toLowerCase();
  return cropImages.find(([keywords]) => keywords.some((keyword) => value.includes(keyword)))?.[1] || fallbackCropImage;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export const HomeMarketPrices: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['market-prices', 24],
    queryFn: async () => (await marketPriceService.getLatest(24)).data,
    staleTime: 30 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    retry: 2,
  });

  const marketItems = (data ?? []).slice(0, 16);

  return (
    <section className="home-market-section" aria-labelledby="home-market-title">
      <div className="home-market-header">
        <div>
          <h2 id="home-market-title">Today&apos;s Market Prices</h2>
          <span>(Live AGMARKNET data)</span>
        </div>
        <a
          href="https://vegetablemarketprice.com/market/tamilnadu/today"
          target="_blank"
          rel="noopener noreferrer"
        >
          View All Prices <ArrowRight size={14} />
        </a>
      </div>

      {isLoading && <p className="home-market-status">Loading today&apos;s live market prices…</p>}
      {isError && <p className="home-market-status home-market-status--error">Live prices are temporarily unavailable.</p>}
      {!isLoading && !isError && (
        <div className="home-market-list">
          {marketItems.map((item) => {
            const isUp = (item.change ?? 0) >= 0;
            return (
              <article
                className="home-market-item"
                key={`${item.commodity}-${item.market}`}
                title={`${item.market}, ${item.district}, ${item.state} • ${item.arrivalDate}`}
              >
                <span className="home-market-icon">
                  <img src={imageFor(item.commodity)} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = fallbackCropImage; }} />
                </span>
                <div className="home-market-copy">
                  <h3>{item.commodity} (per quintal)</h3>
                  <div>
                    <strong>{formatPrice(item.modalPrice)}</strong>
                    {item.change !== null && (
                      <span className={isUp ? 'market-rise' : 'market-fall'}>
                        {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {formatPrice(Math.abs(item.change))}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HomeMarketPrices;

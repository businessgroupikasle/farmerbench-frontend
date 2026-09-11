import React, { useMemo } from 'react';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { marketPriceService } from '../../services/marketPrice.service';

// Local asset images for all crops
import amaranthusImg from '../../assets/crops/amaranthus.jpg';
import ashGourdImg from '../../assets/crops/ash-gourd.jpg';
import bananaImg from '../../assets/crops/banana.jpg';
import beetrootImg from '../../assets/crops/beetroot.jpg';
import bhindiImg from '../../assets/crops/bhindi.jpg';
import bitterGourdImg from '../../assets/crops/bitter-gourd.jpg';
import bottleGourdImg from '../../assets/crops/bottle-gourd.jpg';
import brinjalImg from '../../assets/crops/brinjal.jpg';
import cabbageImg from '../../assets/crops/cabbage.jpg';
import carrotImg from '../../assets/crops/carrot.jpg';
import cauliflowerImg from '../../assets/crops/cauliflower.jpg';
import chilliImg from '../../assets/crops/chilli.jpg';
import chowChowImg from '../../assets/crops/chow-chow.jpg';
import coconutImg from '../../assets/crops/coconut.jpg';
import corianderImg from '../../assets/crops/coriander.jpg';
import cucumberImg from '../../assets/crops/cucumber.jpg';
import drumstickImg from '../../assets/crops/drumstick.jpg';
import garlicImg from '../../assets/crops/garlic.jpg';
import gingerImg from '../../assets/crops/ginger.jpg';
import groundnutImg from '../../assets/crops/groundnut.jpg';
import maizeImg from '../../assets/crops/maize.jpg';
import mushroomImg from '../../assets/crops/mushroom.jpg';
import onionGreenImg from '../../assets/crops/onion-green.jpg';
import onionImg from '../../assets/crops/onion.jpg';
import potatoImg from '../../assets/crops/potato.jpg';
import pumpkinImg from '../../assets/crops/pumpkin.jpg';
import riceImg from '../../assets/crops/rice.jpg';
import ridgeGourdImg from '../../assets/crops/ridge-gourd.jpg';
import snakeGourdImg from '../../assets/crops/snake-gourd.jpg';
import sweetCornImg from '../../assets/crops/sweet-corn.jpg';
import tomatoImg from '../../assets/crops/tomato.jpg';
import wheatImg from '../../assets/crops/wheat.jpg';

const fallbackCropImage = maizeImg;

const cropImages: Array<[string[], string]> = [
  [['sweet corn', 'sweetcorn'], sweetCornImg],
  [['maize', 'corn', 'makka'], maizeImg],
  [['bhindi', 'ladies finger', 'okra', 'bhendi', 'vendakkai'], bhindiImg],
  [['potato', 'aloo', 'urulaikizhangu'], potatoImg],
  [['coriander', 'kothamalli', 'cilantro'], corianderImg],
  [['bitter gourd', 'bittergourd', 'karela', 'pavakkai'], bitterGourdImg],
  [['snakeguard', 'snake gourd', 'snakegourd', 'pudalangai'], snakeGourdImg],
  [['drumstick', 'moringa', 'murungakkai'], drumstickImg],
  [['cauliflower'], cauliflowerImg],
  [['beetroot', 'beet'], beetrootImg],
  [['ridgeguard', 'ridge gourd', 'ridgegourd', 'tori', 'peerkangai'], ridgeGourdImg],
  [['chow chow', 'chowchow', 'chayote', 'seemaikathirikai'], chowChowImg],
  [['banana', 'plantain', 'vazhaipazham', 'vazhai'], bananaImg],
  [['bottle gourd', 'bottlegourd', 'lauki', 'surakkai'], bottleGourdImg],
  [['carrot'], carrotImg],
  [['cucumbar', 'cucumber', 'kheera', 'vellarikkai'], cucumberImg],
  [['mashroom', 'mashrooms', 'mushroom', 'mushrooms', 'kalan'], mushroomImg],
  [['onion green', 'green onion', 'spring onion', 'vengayathal'], onionGreenImg],
  [['onion', 'pyaz', 'vengayam'], onionImg],
  [['ashgourd', 'ash gourd', 'wax gourd', 'poosanaikai', 'neer poosani'], ashGourdImg],
  [['amaranthus', 'amaranth', 'keerai'], amaranthusImg],
  [['tomato', 'tamatar', 'thakkali'], tomatoImg],
  [['brinjal', 'eggplant', 'aubergine', 'baingan', 'kathirikai'], brinjalImg],
  [['chilli', 'chili', 'pepper', 'mirchi', 'milagai'], chilliImg],
  [['cabbage', 'patta gobhi', 'muttakose'], cabbageImg],
  [['garlic', 'lahsun', 'poondu'], garlicImg],
  [['ginger', 'adrak', 'inji'], gingerImg],
  [['pumpkin', 'kaddu', 'parangikai'], pumpkinImg],
  [['coconut', 'nariyal', 'thengai'], coconutImg],
  [['groundnut', 'peanut', 'moongphali', 'verkadalai'], groundnutImg],
  [['rice', 'paddy', 'chawal', 'nel'], riceImg],
  [['wheat', 'gehun', 'godhumai'], wheatImg],
];

const imageFor = (commodity: string) => {
  const value = commodity.toLowerCase();
  const match = cropImages.find(([keywords]) => keywords.some((keyword) => value.includes(keyword)));
  return match ? match[1] : fallbackCropImage;
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

  // Deduplicate products so that each unique commodity is only displayed once
  const marketItems = useMemo(() => {
    const seen = new Set<string>();
    const uniqueList: NonNullable<typeof data> = [];

    for (const item of data ?? []) {
      // Normalize commodity name: strip brackets like "(Ladies Finger)", remove punctuation, lowercase
      const baseName = item.commodity
        .replace(/\(.*?\)/g, '')
        .replace(/[^a-zA-Z]/g, '')
        .trim()
        .toLowerCase();
      const key = baseName || item.commodity.trim().toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        uniqueList.push(item);
      }
    }

    return uniqueList.slice(0, 16);
  }, [data]);

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
                  <img
                    src={imageFor(item.commodity)}
                    alt={item.commodity}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = fallbackCropImage;
                    }}
                  />
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

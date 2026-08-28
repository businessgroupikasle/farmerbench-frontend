import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUploadUrl } from '../../utils/image';
import { CURRENCY_SYMBOL } from '../../utils/currency';
import walnutsImg from '../../assets/walnuts.jpg';
import hazelnutImg from '../../assets/hazelnut.jpg';
import peapodImg from '../../assets/peapod.jpg';
import burntLeavesImg from '../../assets/burnt-leaves.jpg';

interface SeedProduct {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  fallback: string;
  category: string;
}

export const HomeOurProducts: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory] = useState('Seeds');

  const products: SeedProduct[] = [
    {
      id: 'walnuts-premium',
      name: 'Walnuts',
      price: 28.99,
      weight: '100g',
      image: 'walnuts.jpg',
      fallback: walnutsImg,
      category: 'Seeds',
    },
    {
      id: 'hazelnut-roasted',
      name: 'Hazelnut',
      price: 29.99,
      weight: '250g',
      image: 'hazelnut.jpg',
      fallback: hazelnutImg,
      category: 'Seeds',
    },
    {
      id: 'fresh-peapod',
      name: 'Peapod',
      price: 24.99,
      weight: '500g',
      image: 'peapod.jpg',
      fallback: peapodImg,
      category: 'Seeds',
    },
    {
      id: 'burnt-leaves-herbal',
      name: 'Burnt leaves',
      price: 24.99,
      weight: '25g',
      image: 'burnt-leaves.jpg',
      fallback: burntLeavesImg,
      category: 'Seeds',
    },
  ];

  return (
    <section className="agriflow-our-products-section">
      <div className="container">
        {/* Section Heading: Our products */}
        <h2 className="agriflow-our-products-title">Our products</h2>

        {/* Divider with Category Label */}
        <div className="agriflow-products-divider">
          <span className="agriflow-divider-line" />
          <span className="agriflow-category-label">{activeCategory}</span>
          <span className="agriflow-divider-line" />
        </div>

        {/* Products Grid matching screenshot */}
        <div className="agriflow-products-grid">
          {products.map((item) => {
            const imgUrl = getUploadUrl(item.image, item.fallback);
            return (
              <div
                key={item.id}
                className="agriflow-product-item"
                onClick={() => navigate(`/products?search=${encodeURIComponent(item.name)}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/products?search=${encodeURIComponent(item.name)}`);
                  }
                }}
              >
                <div className="agriflow-product-img-box">
                  <img src={imgUrl} alt={item.name} />
                </div>
                <h3 className="agriflow-product-name">{item.name}</h3>
                <p className="agriflow-product-price">
                  {CURRENCY_SYMBOL} {item.price.toFixed(2)} / {item.weight}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeOurProducts;

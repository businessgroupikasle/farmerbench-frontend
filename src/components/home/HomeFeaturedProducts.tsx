import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import './HomeFeaturedProducts.css';

// Using placeholder lucide icons for product images
import { Package, Sprout, CloudRain, Droplets, Wrench, PhoneCall } from 'lucide-react';

const tabs = ['All', 'Seeds', 'Fertilizers', 'Pipes', 'Tools', 'Plant Care'];

const products = [
  { id: 1, name: 'Vermicompost', desc: 'Fertilizer (5kg)', price: '250', icon: <Package size={48} color="#8D6E63" /> },
  { id: 2, name: 'Hybrid Tomato Seeds', desc: '(100g)', price: '120', icon: <Sprout size={48} color="#D32F2F" /> },
  { id: 3, name: 'Drip Irrigation Kit', desc: '(40 Plants)', price: '1,299', icon: <CloudRain size={48} color="#1976D2" /> },
  { id: 4, name: 'Neem Oil', desc: '1 Litre', price: '320', icon: <Droplets size={48} color="#FBC02D" /> },
  { id: 5, name: 'Garden Tool Kit', desc: 'Set of 5', price: '550', icon: <Wrench size={48} color="#757575" /> },
];

export const HomeFeaturedProducts: React.FC = () => {
  return (
    <div className="home-featured-products">
      <div className="featured-header">
        <Leaf size={20} color="#88CF3A" />
        <h2 className="featured-title">Featured Products</h2>
        <Leaf size={20} color="#88CF3A" />
      </div>

      <div className="featured-tabs">
        {tabs.map((tab, idx) => (
          <button key={tab} className={`tab-btn ${idx === 0 ? 'active' : ''}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="featured-carousel">
        <button className="carousel-nav-btn prev"><ChevronLeft size={24} /></button>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-box">
                {product.icon}
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <span className="product-desc">{product.desc}</span>
                <span className="product-price">₹{product.price}</span>
              </div>
              <button className="btn-add-to-cart">
                Add to Cart <ShoppingCart size={16} />
              </button>
            </div>
          ))}

          {/* CTA Card */}
          <div className="cta-card">
            <h4 className="cta-title">Need Help?</h4>
            <h3 className="cta-subtitle">Talk To Our Experts</h3>
            <p className="cta-desc">Get personalised advice for your farm.</p>
            <Link to="/contact" className="btn-contact-expert">
              Contact Us <PhoneCall size={14} />
            </Link>
          </div>
        </div>
        <button className="carousel-nav-btn next"><ChevronRight size={24} /></button>
      </div>
    </div>
  );
};

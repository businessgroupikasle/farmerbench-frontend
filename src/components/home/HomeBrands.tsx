import React from 'react';
import { Leaf } from 'lucide-react';
import './HomeBrands.css';

export const HomeBrands: React.FC = () => {
  return (
    <div className="home-brands-section">
      <div className="brands-header">
        <Leaf size={20} color="#88CF3A" />
        <h2 className="brands-title">Trusted by Farmers Across India</h2>
        <Leaf size={20} color="#88CF3A" />
      </div>

      <div className="brands-logos">
        <div className="brand-logo-box">
          <span className="brand-placeholder">IFFCO</span>
        </div>
        <div className="brand-logo-box">
          <span className="brand-placeholder">Bayer</span>
        </div>
        <div className="brand-logo-box">
          <span className="brand-placeholder">Coromandel</span>
        </div>
        <div className="brand-logo-box">
          <span className="brand-placeholder">Syngenta</span>
        </div>
        <div className="brand-logo-box">
          <span className="brand-placeholder">Rallis</span>
        </div>
        <div className="brand-logo-box">
          <span className="brand-placeholder">UPL</span>
        </div>
      </div>
    </div>
  );
};

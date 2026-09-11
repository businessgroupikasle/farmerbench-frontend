import React from 'react';
import farmerLogo from '../../assets/AgriEra-logo.png';
import './PageLoader.css';

export const PageLoader: React.FC = () => (
  <div className="agri-page-loader" role="status" aria-live="polite" aria-label="Loading AgriEra">
    <div className="agri-page-loader-brand">
      <div className="agri-page-loader-logo-ring">
        <img src={farmerLogo} alt="" className="agri-page-loader-logo" />
      </div>
      <span className="agri-page-loader-name">AgriEra</span>
      <span className="agri-page-loader-message">Growing better, together</span>
      <span className="agri-page-loader-progress" aria-hidden="true">
        <span />
      </span>
    </div>
  </div>
);

export default PageLoader;
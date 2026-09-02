import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, FileCheck, Banknote, HelpCircle, ArrowRight } from 'lucide-react';
import './HomeGovernmentSchemes.css';

export const HomeGovernmentSchemes: React.FC = () => {
  return (
    <div className="home-schemes-banner">
      <div className="schemes-content">
        <h2 className="schemes-title">Government Schemes</h2>
        <p className="schemes-subtitle">Stay Updated with Latest Schemes & Benefits</p>
        
        <div className="schemes-links">
          <Link to="/schemes" className="scheme-link-item">
            <Landmark size={24} color="#2E7D32" className="scheme-icon" />
            <span className="scheme-label">Central & State Schemes</span>
          </Link>
          <Link to="/schemes/eligibility" className="scheme-link-item">
            <FileCheck size={24} color="#2E7D32" className="scheme-icon" />
            <span className="scheme-label">Eligibility Checker</span>
          </Link>
          <Link to="/schemes/benefits" className="scheme-link-item">
            <Banknote size={24} color="#2E7D32" className="scheme-icon" />
            <span className="scheme-label">Benefits & Subsidies</span>
          </Link>
          <Link to="/schemes/apply" className="scheme-link-item">
            <HelpCircle size={24} color="#2E7D32" className="scheme-icon" />
            <span className="scheme-label">How to Apply</span>
          </Link>
        </div>
        
        <Link to="/schemes" className="btn-view-schemes">
          View All Schemes <ArrowRight size={16} />
        </Link>
      </div>
      <div className="schemes-illustration">
        {/* Placeholder for government building illustration */}
        <Landmark size={120} color="rgba(255,255,255,0.4)" />
      </div>
    </div>
  );
};

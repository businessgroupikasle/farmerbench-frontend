import React from 'react';
import { Stethoscope } from 'lucide-react';
import tomatoDiseaseImg from '../../assets/burnt-leaves.jpg';

interface CropDoctorCardProps {
  onViewAdvice: () => void;
  onAskFollowUp: () => void;
}

export const CropDoctorCard: React.FC<CropDoctorCardProps> = ({
  onViewAdvice,
  onAskFollowUp,
}) => {
  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">
          <Stethoscope size={18} color="#0F4726" />
          Crop Doctor Request
        </h3>
      </div>

      <div className="fb-doctor-request-content">
        <div className="fb-crop-issue-row">
          <img
            src={tomatoDiseaseImg}
            alt="Tomato Leaf Spots"
            className="fb-crop-issue-thumb"
          />
          <div className="fb-crop-issue-meta">
            <span className="fb-crop-issue-name">Tomato Leaf Spots</span>
            <span className="fb-crop-issue-date">Submitted: 28 Aug 2026</span>
            <div style={{ marginTop: '0.25rem' }}>
              <span className="fb-status-pill-green" style={{ fontSize: '0.7rem' }}>
                Expert Replied
              </span>
            </div>
          </div>
        </div>

        <div className="fb-crop-advice-snippet">
          Possible fungal infection (Early Blight). Avoid overhead watering and apply copper fungicide spray...
        </div>

        <div className="fb-consultation-actions" style={{ marginTop: '0.25rem' }}>
          <button className="fb-btn-primary-dark" onClick={onViewAdvice}>
            View Advice
          </button>
          <button className="fb-btn-outline" onClick={onAskFollowUp}>
            Ask Follow-up
          </button>
        </div>
      </div>
    </div>
  );
};

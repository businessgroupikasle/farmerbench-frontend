import React from 'react';
import { Video, Calendar } from 'lucide-react';
import doctorAvatar from '../../assets/farm-consult-about.jpg';

interface ConsultationCardProps {
  onJoinConsultation: () => void;
  onReschedule: () => void;
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({
  onJoinConsultation,
  onReschedule,
}) => {
  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">Upcoming Consultation</h3>
        <span className="fb-status-pill-green">Confirmed</span>
      </div>

      <div className="fb-consultation-body">
        <div style={{ fontSize: '0.825rem', color: 'var(--fb-text-muted)', fontWeight: 600 }}>
          Crop Consultation
        </div>

        <div className="fb-doctor-profile">
          <img src={doctorAvatar} alt="Dr. Arun Kumar" className="fb-doctor-avatar" />
          <div className="fb-doctor-info">
            <span className="fb-doctor-name">Dr. Arun Kumar</span>
            <span className="fb-doctor-role">Crop Nutrition Specialist</span>
          </div>
        </div>

        <div className="fb-consultation-mode-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Video size={15} />
            <span>Video Call</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={15} />
            <span>02 Sep 2026, 11:30 AM</span>
          </div>
        </div>

        <div className="fb-consultation-actions">
          <button className="fb-btn-primary-dark" onClick={onJoinConsultation}>
            Join Consultation
          </button>
          <button className="fb-btn-outline" onClick={onReschedule}>
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

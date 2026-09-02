import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { User } from '@formerbench/shared';

interface ProfileCompletionCardProps {
  user: User | null;
  onCompleteProfile: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  user,
  onCompleteProfile,
}) => {
  const hasPhone = !!user?.phone;
  const hasEmail = !!user?.email;
  const hasLocation = !!user?.location;
  const hasCrops = !!user?.crops;

  const completedCount =
    (hasPhone ? 1 : 0) +
    (hasEmail ? 1 : 0) +
    (hasLocation ? 1 : 0) +
    (hasCrops ? 1 : 0);

  // If user is logged in, default at least 75% or actual score
  const progressPercent = Math.max(50, (completedCount / 4) * 100);

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">Complete Your Profile</h3>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fb-green-800)' }}>
          {progressPercent}% Complete
        </span>
      </div>

      <div className="fb-profile-progress-wrap">
        <div className="fb-progress-bar-bg">
          <div
            className="fb-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="fb-checklist-wrap">
          <div className="fb-checklist-item done">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>Mobile number verified</span>
          </div>

          <div className="fb-checklist-item done">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>Email address added</span>
          </div>

          <div className={`fb-checklist-item ${hasLocation ? 'done' : ''}`}>
            {hasLocation ? (
              <CheckCircle2 size={16} color="#16a34a" />
            ) : (
              <Circle size={16} color="#94a3b8" />
            )}
            <span>Add farm details</span>
          </div>

          <div className={`fb-checklist-item ${hasCrops ? 'done' : ''}`}>
            {hasCrops ? (
              <CheckCircle2 size={16} color="#16a34a" />
            ) : (
              <Circle size={16} color="#94a3b8" />
            )}
            <span>Select primary crops</span>
          </div>
        </div>

        <button
          className="fb-btn-outline"
          style={{ width: '100%', marginTop: '0.5rem' }}
          onClick={onCompleteProfile}
        >
          Complete Profile
        </button>
      </div>
    </div>
  );
};

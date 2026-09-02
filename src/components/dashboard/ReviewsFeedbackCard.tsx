import React from 'react';
import { ArrowRight, Star, Sprout, Edit2 } from 'lucide-react';
import growthBoosterImg from '../../assets/growth-booster.jpg';
import neemOilImg from '../../assets/neem-oil-bottle.jpg';
import fieldPhoto1 from '../../assets/crop-monitoring.jpg';
import fieldPhoto2 from '../../assets/sustainable-farm.jpg';

interface ReviewsFeedbackCardProps {
  onViewAllReviews: () => void;
  onEditReview: (reviewId: string) => void;
  onWriteReview: (productTitle?: string) => void;
}

export const ReviewsFeedbackCard: React.FC<ReviewsFeedbackCardProps> = ({
  onViewAllReviews,
  onEditReview,
  onWriteReview,
}) => {
  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">Your Reviews & Feedback</h3>
        <a
          className="fb-card-link"
          onClick={(e) => {
            e.preventDefault();
            onViewAllReviews();
          }}
        >
          View All Reviews <ArrowRight size={14} />
        </a>
      </div>

      <div className="fb-reviews-stack">
        {/* Published Review Item */}
        <div className="fb-reviewed-item">
          <img
            src={growthBoosterImg}
            alt="Growth Booster for All Crops"
            className="fb-review-prod-img"
          />

          <div className="fb-review-content-col">
            <div className="fb-review-title-row">
              <span className="fb-review-prod-title">Growth Booster for All Crops</span>
              <button
                className="fb-card-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={() => onEditReview('rev-1')}
              >
                <Edit2 size={12} /> Edit Review
              </button>
            </div>

            <div className="fb-review-rating-row">
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={13} fill="#f59e0b" />
                ))}
              </div>
              <span className="fb-status-pill-green" style={{ fontSize: '0.65rem' }}>
                Published
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--fb-text-muted)' }}>
                Reviewed on 28 Aug 2026
              </span>
            </div>

            <p className="fb-review-text">
              Excellent results on my paddy crop. Plants look greener and healthier.
              Yield has improved noticeably after 20 days of use.
            </p>

            <div className="fb-review-tags-row">
              <span className="fb-review-tag">Crop: Paddy</span>
              <span className="fb-review-tag">Used for: 30 days</span>
            </div>

            <div className="fb-review-photos-row">
              <img src={fieldPhoto1} alt="Field proof 1" className="fb-review-photo-thumb" />
              <img src={fieldPhoto2} alt="Field proof 2" className="fb-review-photo-thumb" />
            </div>
          </div>
        </div>

        {/* Unreviewed Prompt */}
        <div className="fb-pending-review-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={neemOilImg}
              alt="Neem Oil"
              style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                Neem Oil 100% Cold Pressed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#cbd5e1' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--fb-text-muted)' }}>
                  How was this product?
                </span>
              </div>
            </div>
          </div>

          <button
            className="fb-btn-primary-dark"
            onClick={() => onWriteReview('Neem Oil 100% Cold Pressed')}
          >
            Write a Review
          </button>
        </div>

        {/* Motivational Banner */}
        <div className="fb-review-banner-footer">
          <Sprout size={16} />
          <span>Your farming experience helps other farmers choose confidently.</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowRight, Star, Sprout, MessageSquare } from 'lucide-react';
import { Order, Product } from '@formerbench/shared';

interface ReviewsFeedbackCardProps {
  orders?: Order[];
  onViewAllReviews: () => void;
  onEditReview?: (reviewId: string) => void;
  onWriteReview: (product?: Product | any) => void;
}

export const ReviewsFeedbackCard: React.FC<ReviewsFeedbackCardProps> = ({
  orders = [],
  onViewAllReviews,
  onWriteReview,
}) => {
  // Extract purchased products from user orders
  const purchasedProducts = orders.flatMap((o) => o.items || []);
  const firstPurchased = purchasedProducts[0];

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
        {firstPurchased ? (
          <div className="fb-pending-review-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {firstPurchased.imageUrl ? (
                <img
                  src={firstPurchased.imageUrl}
                  alt={firstPurchased.title}
                  style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '6px',
                    background: 'var(--fb-green-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--fb-green-800)',
                  }}
                >
                  <MessageSquare size={20} />
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  {firstPurchased.title}
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
              onClick={() => onWriteReview(firstPurchased)}
            >
              Write a Review
            </button>
          </div>
        ) : (
          <div style={{ padding: '1.25rem 0.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.825rem', color: 'var(--fb-text-muted)', marginBottom: '0.75rem' }}>
              Purchase products to share crop yield results and leave verified reviews for fellow farmers.
            </p>
            <button
              className="fb-btn-outline"
              style={{ fontSize: '0.825rem' }}
              onClick={() => onWriteReview({ title: 'FarmerBench Bio Input' })}
            >
              Share Farming Experience
            </button>
          </div>
        )}

        {/* Motivational Banner */}
        <div className="fb-review-banner-footer">
          <Sprout size={16} />
          <span>Your farming experience helps other farmers choose confidently.</span>
        </div>
      </div>
    </div>
  );
};

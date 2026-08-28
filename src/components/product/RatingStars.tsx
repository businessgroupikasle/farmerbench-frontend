import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  numReviews?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  numReviews,
  size = 15,
  showText = true,
}) => {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <Star
              key={star}
              size={size}
              style={{
                color: isFilled ? '#fbbf24' : 'var(--border-color)',
                fill: isFilled ? '#fbbf24' : 'transparent',
              }}
            />
          );
        })}
      </div>
      {showText && (
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {roundedRating.toFixed(1)}
          {numReviews !== undefined && (
            <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
              ({numReviews})
            </span>
          )}
        </span>
      )}
    </div>
  );
};

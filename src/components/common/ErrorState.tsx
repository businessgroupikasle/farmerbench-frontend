import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  actionText = 'Try Again',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'var(--color-danger-bg)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '480px',
        margin: '2rem auto',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-danger)',
          marginBottom: '1rem',
        }}
      >
        <AlertCircle size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-danger)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

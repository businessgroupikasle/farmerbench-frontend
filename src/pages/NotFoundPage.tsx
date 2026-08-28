import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--brand-primary-light)',
          color: 'var(--brand-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Compass size={36} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
        The page you are trying to reach does not exist, has been moved, or is temporarily unavailable.
      </p>

      <Link to="/" style={{ marginTop: '1rem' }}>
        <Button variant="primary" size="lg">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

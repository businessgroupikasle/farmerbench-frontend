import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '440px',
          width: '100%',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem',
          position: 'relative',
          animation: 'modalSlideUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Logout Icon Circle */}
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.25rem',
          }}
        >
          <LogOut size={26} />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
          Sign Out of FarmerBench?
        </h3>

        <p style={{ fontSize: '0.925rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
          {userName ? (
            <>Are you sure you want to log out, <strong>{userName}</strong>? You can sign back in anytime.</>
          ) : (
            'Are you sure you want to log out of your account? You can sign back in anytime.'
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', width: '100%', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#DC2626',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              transition: 'all 0.2s',
            }}
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

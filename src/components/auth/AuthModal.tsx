import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useUIStore } from '../../store/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal } = useUIStore();
  const { login, register, isLoggingIn, isRegistering } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (authModalTab === 'login') {
        await login({ email, password });
      } else {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        await register({ name, email, password });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleFillDemo = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setEmail('admin@formerbench.dev');
      setPassword('DemoPass123!');
    } else {
      setEmail('customer@formerbench.dev');
      setPassword('DemoPass123!');
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={authModalTab === 'login' ? 'Welcome Back' : 'Create Account'}
      maxWidth="420px"
    >
      {/* Tab Switcher */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setError(null);
            openAuthModal('login');
          }}
          style={{
            padding: '0.5rem',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            background: authModalTab === 'login' ? 'var(--bg-surface)' : 'transparent',
            color: authModalTab === 'login' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            boxShadow: authModalTab === 'login' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setError(null);
            openAuthModal('register');
          }}
          style={{
            padding: '0.5rem',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            background: authModalTab === 'register' ? 'var(--bg-surface)' : 'transparent',
            color: authModalTab === 'register' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            boxShadow: authModalTab === 'register' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Demo Credentials Quick Fill Buttons */}
      {authModalTab === 'login' && (
        <div
          style={{
            padding: '0.75rem',
            background: 'var(--brand-primary-light)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
            <Sparkles size={14} /> Quick Demo Logins:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', flex: 1, padding: '0.3rem' }}
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', flex: 1, padding: '0.3rem' }}
            >
              Demo Admin
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {authModalTab === 'register' && (
          <Input
            label="Full Name"
            placeholder="Sarah Jenkins"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftElement={<UserIcon size={16} />}
            required
          />
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftElement={<Mail size={16} />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftElement={<Lock size={16} />}
          required
        />

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          isLoading={isLoggingIn || isRegistering}
          style={{ marginTop: '0.5rem' }}
        >
          {authModalTab === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </Modal>
  );
};

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  min?: number;
  onChange: (newQuantity: number) => void;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  max = 99,
  min = 1,
  onChange,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const buttonSize = isSm ? '28px' : '36px';
  const fontSize = isSm ? '0.85rem' : '0.95rem';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '2px',
      }}
    >
      <button
        type="button"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        style={{
          width: buttonSize,
          height: buttonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: quantity <= min ? 'not-allowed' : 'pointer',
          opacity: quantity <= min ? 0.4 : 1,
          borderRadius: 'var(--radius-sm)',
        }}
        aria-label="Decrease quantity"
      >
        <Minus size={isSm ? 12 : 14} />
      </button>

      <span
        style={{
          minWidth: isSm ? '28px' : '36px',
          textAlign: 'center',
          fontWeight: 600,
          fontSize,
          color: 'var(--text-primary)',
        }}
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        style={{
          width: buttonSize,
          height: buttonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: quantity >= max ? 'not-allowed' : 'pointer',
          opacity: quantity >= max ? 0.4 : 1,
          borderRadius: 'var(--radius-sm)',
        }}
        aria-label="Increase quantity"
      >
        <Plus size={isSm ? 12 : 14} />
      </button>
    </div>
  );
};

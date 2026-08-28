import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftElement, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {leftElement && (
            <div
              style={{
                position: 'absolute',
                left: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            >
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input-field ${className}`}
            style={{
              paddingLeft: leftElement ? '2.5rem' : undefined,
              paddingRight: rightElement ? '2.5rem' : undefined,
              borderColor: error ? 'var(--color-danger)' : undefined,
            }}
            {...props}
          />
          {rightElement && (
            <div
              style={{
                position: 'absolute',
                right: '0.85rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="input-error">{error}</span>}
        {!error && helperText && (
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

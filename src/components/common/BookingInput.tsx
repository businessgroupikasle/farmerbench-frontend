import React, { useEffect, useState } from 'react';
import { getBookingDateError, getFarmerNameError, localDateMinimum } from '../../utils/bookingValidation';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { validation: 'name' | 'date' | 'datetime' };

export const BookingInput: React.FC<Props> = ({ validation, onChange, onBlur, onFocus, ...props }) => {
  const [error, setError] = useState('');

  const computeMessage = (value: string) =>
    validation === 'name'
      ? getFarmerNameError(value)
      : getBookingDateError(value, validation === 'datetime');

  const validate = (input: HTMLInputElement) => {
    const message = computeMessage(input.value);
    input.setCustomValidity(message);
    setError(message);
  };

  useEffect(() => {
    const currentVal = typeof props.value === 'string' ? props.value : '';
    if (!currentVal) {
      setError('');
      return;
    }
    setError(computeMessage(currentVal));
  }, [props.value, validation]);

  return (
    <>
      <input
        {...props}
        min={validation === 'name' ? undefined : localDateMinimum(validation === 'datetime')}
        aria-label={
          props['aria-label'] ||
          (validation === 'name'
            ? 'Farmer Name'
            : validation === 'datetime'
            ? 'Preferred Date and Time'
            : 'Preferred Date')
        }
        aria-invalid={Boolean(error)}
        onChange={(e) => {
          validate(e.currentTarget);
          onChange?.(e);
        }}
        onBlur={(e) => {
          validate(e.currentTarget);
          onBlur?.(e);
        }}
        onFocus={(e) => {
          if (validation !== 'name') e.currentTarget.min = localDateMinimum(validation === 'datetime');
          onFocus?.(e);
        }}
        onInvalid={(e) => validate(e.currentTarget)}
      />
      {error && (
        <span
          role="alert"
          style={{ color: '#b91c1c', display: 'block', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: 600 }}
        >
          {error}
        </span>
      )}
    </>
  );
};

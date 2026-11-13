import React, { useState } from 'react';
import { getBookingDateError, getFarmerNameError, localDateMinimum } from '../../utils/bookingValidation';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { validation: 'name' | 'date' | 'datetime' };

export const BookingInput: React.FC<Props> = ({ validation, onChange, onBlur, onFocus, ...props }) => {
  const [error, setError] = useState('');
  const validate = (input: HTMLInputElement) => {
    const message = validation === 'name' ? getFarmerNameError(input.value) : getBookingDateError(input.value, validation === 'datetime');
    input.setCustomValidity(message);
    setError(message);
  };
  return <>
    <input {...props}
      min={validation === 'name' ? undefined : localDateMinimum(validation === 'datetime')}
      aria-label={props['aria-label'] || (validation === 'name' ? 'Farmer Name' : validation === 'datetime' ? 'Preferred Date and Time' : 'Preferred Date')}
      aria-invalid={Boolean(error)}
      onChange={e => { validate(e.currentTarget); onChange?.(e); }}
      onBlur={e => { validate(e.currentTarget); onBlur?.(e); }}
      onFocus={e => {
        if (validation !== 'name') e.currentTarget.min = localDateMinimum(validation === 'datetime');
        onFocus?.(e);
      }}
      onInvalid={e => validate(e.currentTarget)}
    />
    {error && <span role="alert" style={{ color: '#b91c1c', display: 'block', fontSize: '0.85rem', marginTop: '0.25rem' }}>{error}</span>}
  </>;
};

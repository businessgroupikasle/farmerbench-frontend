import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import './ValidationModal.css';

const EVENT_NAME = 'agriera:validation';

/** Show the AgriEra-styled validation modal (replaces the browser's default alert()). */
export const showValidation = (message: string) => {
  window.dispatchEvent(new CustomEvent<string>(EVENT_NAME, { detail: message }));
};

/** Mount once near the app root. */
export const ValidationModalHost: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => setMessage((e as CustomEvent<string>).detail);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  if (!message) return null;
  const close = () => setMessage(null);
  return (
    <div className="agri-validation-overlay" onClick={close} role="presentation">
      <div className="agri-validation-card" role="alertdialog" aria-modal="true" aria-label="Action required" onClick={(e) => e.stopPropagation()}>
        <div className="agri-validation-icon"><AlertCircle size={28} /></div>
        <p>{message}</p>
        <button type="button" className="agri-validation-btn" onClick={close} autoFocus>OK</button>
      </div>
    </div>
  );
};

export default ValidationModalHost;

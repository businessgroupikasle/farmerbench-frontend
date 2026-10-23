import { useEffect, useState } from 'react';
import { storeSettingsService } from '../services/storeSettings.service';

const FALLBACK_DATE = 'September 4, 2026';

/** Effective date for a policy page, managed from Admin > Settings; falls back until one is set. */
export const usePolicyEffectiveDate = (policy: 'shipping' | 'return'): string => {
  const [label, setLabel] = useState(FALLBACK_DATE);

  useEffect(() => {
    let active = true;
    storeSettingsService.get().then((response) => {
      const value = policy === 'shipping'
        ? response.data?.shippingPolicyEffectiveDate
        : response.data?.returnPolicyEffectiveDate;
      if (!active || !value) return;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return;
      setLabel(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }));
    }).catch(() => {
      // keep the fallback when the backend is unavailable
    });
    return () => { active = false; };
  }, [policy]);

  return label;
};

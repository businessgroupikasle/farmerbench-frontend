import { useEffect, useState } from 'react';
import { storeSettingsService } from '../services/storeSettings.service';

const STORE_SETTINGS_KEY = 'formerbench_store_settings';

export type StoreShippingSettings = {
  standardShippingFee: number;
  freeShippingThreshold: number;
};

const DEFAULT_SHIPPING_SETTINGS: StoreShippingSettings = {
  standardShippingFee: 80,
  freeShippingThreshold: 5000,
};

const toNonNegativeNumber = (value: unknown, fallback: number) => {
  if (value === null || value === undefined || String(value).trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const normalizeShippingSettings = (settings?: Record<string, unknown> | null): StoreShippingSettings => ({
  standardShippingFee: toNonNegativeNumber(
    settings?.standardShippingFee,
    DEFAULT_SHIPPING_SETTINGS.standardShippingFee,
  ),
  freeShippingThreshold: toNonNegativeNumber(
    settings?.freeShippingThreshold,
    DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold,
  ),
});

const readShippingSettings = (): StoreShippingSettings => {
  try {
    const saved = localStorage.getItem(STORE_SETTINGS_KEY);
    return normalizeShippingSettings(saved ? JSON.parse(saved) : null);
  } catch {
    return DEFAULT_SHIPPING_SETTINGS;
  }
};

export const useStoreShippingSettings = () => {
  const [shippingSettings, setShippingSettings] = useState<StoreShippingSettings>(readShippingSettings);

  useEffect(() => {
    let active = true;
    storeSettingsService.get().then((response) => {
      if (!active || !response.success || !response.data) return;
      const settings = normalizeShippingSettings(response.data as unknown as Record<string, unknown>);
      setShippingSettings(settings);
      localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify({ ...JSON.parse(localStorage.getItem(STORE_SETTINGS_KEY) || '{}'), ...settings }));
    }).catch(() => {
      // Keep the local/default values when the backend is temporarily unavailable.
    });

    const syncFromStorage = () => setShippingSettings(readShippingSettings());
    const syncFromDashboard = (event: Event) => {
      const settings = (event as CustomEvent<Record<string, unknown>>).detail;
      setShippingSettings(settings ? normalizeShippingSettings(settings) : readShippingSettings());
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('store-settings:updated', syncFromDashboard);
    return () => {
      active = false;
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('store-settings:updated', syncFromDashboard);
    };
  }, []);

  return shippingSettings;
};
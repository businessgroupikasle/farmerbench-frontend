import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language } from '../types/language';
import { translateService } from '../services/translate.service';

interface LanguageContextType {
  currentLang: string;
  selectedLanguage: Language;
  supportedLanguages: Language[];
  setLanguage: (langCode: string) => void;
  isTranslating: boolean;
  t: (text: string) => string;
  translateAsync: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'agri_current_lang';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const selectedLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || DEFAULT_LANGUAGE;

  // Set Google Translate cookie helper
  const setGoogleTranslateCookie = (langCode: string) => {
    const hostname = window.location.hostname;
    const isIpAddress = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const domainCandidates = new Set<string>(['']);

    if (hostname && hostname !== 'localhost' && !isIpAddress) {
      const parts = hostname.split('.');
      for (let index = 0; index < parts.length - 1; index += 1) {
        domainCandidates.add(`.${parts.slice(index).join('.')}`);
      }
    }

    // Clear every possible host/parent-domain variant first. Google may create
    // the cookie on the parent domain (for example .example.com from www.example.com).
    domainCandidates.forEach((cookieDomain) => {
      const domainAttribute = cookieDomain ? ` domain=${cookieDomain};` : '';
      document.cookie = `googtrans=;${domainAttribute} path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
    });

    if (langCode !== 'en') {
      document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=Lax`;
    }
  };

  // Switch active language
  const setLanguage = useCallback((langCode: string) => {
    // Allow English to run again so a stale translated DOM/cookie can be reset.
    if (langCode === currentLang && langCode !== 'en') return;
    setIsTranslating(true);
    setCurrentLangState(langCode);
    localStorage.setItem(STORAGE_KEY, langCode);

    // Update document metadata
    document.documentElement.lang = langCode;
    const targetLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    document.documentElement.dir = targetLangObj?.dir || 'ltr';

    // Set Google Translate cookie so the DOM translation engine switches
    setGoogleTranslateCookie(langCode);

    // Google Translate mutates the DOM directly and does not reliably restore
    // the original text when its hidden select is switched back to English,
    // especially on mobile browsers. Reload after clearing its cookie so React
    // mounts the original English markup again.
    if (langCode === 'en') {
      window.location.reload();
      return;
    }

    // Trigger Google Translate select element if present
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      setTimeout(() => setIsTranslating(false), 600);
    } else {
      // Reload smoothly to activate translation engine if not initialized
      setTimeout(() => {
        window.location.reload();
      }, 250);
    }
  }, [currentLang]);

  // Synchronous text translation helper (from client cache or original)
  const t = useCallback((text: string): string => {
    if (!text || currentLang === 'en') return text;
    const cached = translateService.getCached(text, currentLang);
    return cached || text;
  }, [currentLang]);

  // Asynchronous text translation helper
  const translateAsync = useCallback(async (text: string): Promise<string> => {
    if (!text || currentLang === 'en') return text;
    return await translateService.translateSingle(text, currentLang);
  }, [currentLang]);

  // Initialize Google Translate Element once on mount
  useEffect(() => {
    // Set direction and document language
    document.documentElement.lang = currentLang;
    document.documentElement.dir = selectedLanguage.dir || 'ltr';

    if (currentLang !== 'en') {
      setGoogleTranslateCookie(currentLang);
    }

    // Check if Google script is already injected
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: SUPPORTED_LANGUAGES.map((l) => l.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        selectedLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        setLanguage,
        isTranslating,
        t,
        translateAsync,
      }}
    >
      {/* Hidden container for Google Translate widget */}
      <div
        id="google_translate_element"
        style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px' }}
      />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

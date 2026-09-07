import { apiClient } from './api';

const CACHE_PREFIX = 'agri_trans_v1_';

interface CacheStore {
  [originalText: string]: string;
}

/**
 * Reads translation cache from localStorage for a specific language
 */
const getCacheForLang = (lang: string): CacheStore => {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${lang}`);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn(`[Translate Cache] Failed to read cache for ${lang}:`, err);
    return {};
  }
};

/**
 * Writes translation cache to localStorage for a specific language
 */
const saveCacheForLang = (lang: string, updates: CacheStore): void => {
  try {
    const current = getCacheForLang(lang);
    const merged = { ...current, ...updates };
    // Keep max 2000 entries per language to avoid quota exhaustion
    const keys = Object.keys(merged);
    if (keys.length > 2000) {
      const trimmed: CacheStore = {};
      keys.slice(-1500).forEach((k) => {
        trimmed[k] = merged[k];
      });
      localStorage.setItem(`${CACHE_PREFIX}${lang}`, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(`${CACHE_PREFIX}${lang}`, JSON.stringify(merged));
    }
  } catch (err) {
    console.warn(`[Translate Cache] Failed to write cache for ${lang}:`, err);
  }
};

export interface TranslateApiResponse {
  success: boolean;
  data?: {
    translations: string[];
  };
  message?: string;
}

export const translateService = {
  /**
   * Translates an array of texts into the target language.
   * Leverages client-side localStorage caching and sends only uncached strings to backend /api/translate.
   */
  async translateTexts(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts || texts.length === 0) return [];
    if (targetLang === 'en') return texts; // English is base language

    const cache = getCacheForLang(targetLang);
    const results: string[] = new Array(texts.length);
    const uncachedIndices: number[] = [];
    const uncachedTexts: string[] = [];

    // 1. Resolve from client cache first
    texts.forEach((txt, idx) => {
      const trimmed = txt.trim();
      if (!trimmed || !isNaN(Number(trimmed))) {
        // Empty or pure numbers don't need translation
        results[idx] = txt;
      } else if (cache[txt]) {
        results[idx] = cache[txt];
      } else {
        uncachedIndices.push(idx);
        uncachedTexts.push(txt);
      }
    });

    // 2. If all texts are cached, return immediately
    if (uncachedTexts.length === 0) {
      return results;
    }

    // 3. Request translations from secure backend proxy
    try {
      const response = await apiClient.post<any, TranslateApiResponse>('/translate', {
        texts: uncachedTexts,
        targetLang,
      });

      const translations = response?.data?.translations || [];
      const newCacheEntries: CacheStore = {};

      uncachedIndices.forEach((originalIndex, i) => {
        const translated = translations[i] || uncachedTexts[i];
        results[originalIndex] = translated;
        if (translations[i]) {
          newCacheEntries[texts[originalIndex]] = translated;
        }
      });

      // 4. Save newly received translations into client cache
      if (Object.keys(newCacheEntries).length > 0) {
        saveCacheForLang(targetLang, newCacheEntries);
      }

      return results;
    } catch (error) {
      console.warn(`[Translate Service] Backend translation request failed for ${targetLang}:`, error);
      // Fallback: Return original texts for any failed translations
      uncachedIndices.forEach((originalIndex) => {
        results[originalIndex] = texts[originalIndex];
      });
      return results;
    }
  },

  /**
   * Translates a single string
   */
  async translateSingle(text: string, targetLang: string): Promise<string> {
    if (!text || targetLang === 'en') return text;
    const res = await this.translateTexts([text], targetLang);
    return res[0] || text;
  },

  /**
   * Direct cache synchronous lookup (useful for instant render while async loads)
   */
  getCached(text: string, targetLang: string): string | null {
    if (!text || targetLang === 'en') return text;
    const cache = getCacheForLang(targetLang);
    return cache[text] || null;
  },

  /**
   * Clears translation cache for one or all languages
   */
  clearCache(lang?: string): void {
    if (lang) {
      localStorage.removeItem(`${CACHE_PREFIX}${lang}`);
    } else {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  },
};

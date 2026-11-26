import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getTranslations, SupportedLanguage, TRANSLATIONS } from '../i18n/translations';

const LANG_STORAGE_KEY = 'saarthi_lang_preference_v2';

interface LanguageContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  toggleLang: () => void;
  t: (typeof TRANSLATIONS)[SupportedLanguage];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readStoredLanguage(): SupportedLanguage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'ne') return saved;
    }
  } catch {
    // ignore storage restriction
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(readStoredLanguage);

  const setLang = useCallback((nextLang: SupportedLanguage) => {
    setLangState(nextLang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(LANG_STORAGE_KEY, nextLang);
      }
    } catch {
      // ignore storage restriction
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ne' : 'en');
  }, [lang, setLang]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'ne' ? 'ne' : 'en';
    }
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t: getTranslations(lang) as (typeof TRANSLATIONS)[SupportedLanguage],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export function useOptionalLanguage(fallbackLang: SupportedLanguage = 'en'): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  return {
    lang: fallbackLang,
    setLang: () => undefined,
    toggleLang: () => undefined,
    t: getTranslations(fallbackLang) as (typeof TRANSLATIONS)[SupportedLanguage],
  };
}


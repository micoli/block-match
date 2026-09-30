import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import translations from './translations.yaml';
import { LOCALES, detectLanguage, translate } from './translate';
import type { Language, Messages } from './translate';

const STORAGE_KEY = 'games:language';
const catalog = translations as Record<Language, Messages>;

type I18n = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number) => string;
};

export const I18nContext = createContext<I18n | null>(null);

const readLanguage = () => {
  try {
    return detectLanguage(localStorage.getItem(STORAGE_KEY), navigator.language);
  } catch {
    return detectLanguage(null, navigator.language);
  }
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(readLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable: the language choice is simply not remembered
    }
  }, []);

  const value = useMemo<I18n>(
    () => ({
      language,
      setLanguage,
      t: (key, params) => translate(catalog, language, key, params),
      formatNumber: (number) => number.toLocaleString(LOCALES[language]),
    }),
    [language, setLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

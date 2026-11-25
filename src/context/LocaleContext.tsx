import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { SAUDI_CITIES, type LocalizedText, type SaudiCity } from '../data/storeConfig';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TRANSLATIONS, type Language } from '../locales/translations';

interface LocaleContextValue {
  lang: Language;
  isRtl: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (typeof TRANSLATIONS)['ar'] | (typeof TRANSLATIONS)['en'];
  l: (text: LocalizedText | string) => string;
  city: SaudiCity;
  setCityById: (cityId: string) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Arabic is the default language for Saudi Arabia
  const [lang, setLang] = useLocalStorage<Language>('layana_lang', 'ar');
  const [cityId, setCityId] = useLocalStorage<string>('layana_city', 'riyadh');

  const isRtl = lang === 'ar';

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  const city = useMemo(
    () => SAUDI_CITIES.find((c) => c.id === cityId) ?? SAUDI_CITIES[0],
    [cityId]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      lang,
      isRtl,
      setLang,
      toggleLang: () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar')),
      t: TRANSLATIONS[lang],
      l: (text) => (typeof text === 'string' ? text : text[lang]),
      city,
      setCityById: (id) => setCityId(id),
    }),
    [lang, isRtl, setLang, city, setCityId]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}

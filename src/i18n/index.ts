import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';
import ar from './ar';
import fr from './fr';
import tzm from './tzm';

export type Lang = 'ar' | 'fr' | 'en' | 'tzm';
export const LANGS: Lang[] = ['ar', 'fr', 'en', 'tzm'];

// Keys are the English strings themselves, so English needs no dictionary and any
// missing translation falls back to readable English (Tamazight falls back to French).
function deviceLang(): Lang {
  const code = getLocales()[0]?.languageCode;
  if (code === 'fr' || code === 'en') return code;
  return 'ar';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {} },
    fr: { translation: fr },
    ar: { translation: ar },
    tzm: { translation: tzm },
  },
  lng: deviceLang(),
  fallbackLng: { tzm: ['fr', 'en'], default: ['en'] },
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false,
  interpolation: { escapeValue: false },
});

export function isRTL(lang: string) {
  return lang === 'ar';
}

export async function setLanguage(lang: Lang) {
  await i18n.changeLanguage(lang);
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
  }
}

export function useLang(): Lang {
  const { i18n: inst } = useTranslation();
  return (inst.language as Lang) ?? 'en';
}

export function useIsRTL() {
  return isRTL(useLang());
}

export { useTranslation };
export default i18n;

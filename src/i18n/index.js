import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar.json';
import en from './en.json';
import weddingConfig from '../config/weddingConfig';

const LANG_KEY = 'wedding_lang';

const defaultLang = weddingConfig?.defaultLanguage || 'ar';
const savedLang = localStorage.getItem(LANG_KEY) || defaultLang;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: defaultLang,
    interpolation: {
      escapeValue: false,
    },
  });

// Set HTML dir attribute on init
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLang;

export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export default i18n;

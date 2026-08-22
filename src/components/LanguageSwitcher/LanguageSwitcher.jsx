import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { track } = useAnalytics();
  const currentLang = i18n.language;

  const handleSwitch = (lang) => {
    if (lang === currentLang) return;
    changeLanguage(lang);
    track(EVENTS.LANGUAGE_CHANGED, { language: lang });
  };

  return (
    <div className="lang-switcher" role="group" aria-label="Language switcher">
      <button
        id="btn-lang-ar"
        className={`lang-switcher__btn ${currentLang === 'ar' ? 'lang-switcher__btn--active' : ''}`}
        onClick={() => handleSwitch('ar')}
        lang="ar"
        aria-pressed={currentLang === 'ar'}
      >
        العربية
      </button>
      <span className="lang-switcher__sep" aria-hidden="true">|</span>
      <button
        id="btn-lang-en"
        className={`lang-switcher__btn ${currentLang === 'en' ? 'lang-switcher__btn--active' : ''}`}
        onClick={() => handleSwitch('en')}
        lang="en"
        aria-pressed={currentLang === 'en'}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;

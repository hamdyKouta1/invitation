import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useCountdown from '../../hooks/useCountdown';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import weddingConfig from '../../config/weddingConfig';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import './Countdown.css';

const CountdownUnit = ({ value, label, indexTag, activeTheme }) => (
  <motion.div
    className={`countdown-unit countdown-unit--${activeTheme}`}
    key={value}
    initial={{ opacity: 0.6, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    {activeTheme === 'minimalist-modern' && indexTag && (
      <span className="countdown-unit__index" aria-hidden="true">{indexTag}</span>
    )}
    {activeTheme === 'elegant-luxury' && (
      <span className="countdown-unit__gem" aria-hidden="true">❖</span>
    )}
    {activeTheme === 'romantic-floral' && (
      <span className="countdown-unit__petal-badge" aria-hidden="true">❀</span>
    )}
    {activeTheme === 'royal-classic' && (
      <span className="countdown-unit__crown-badge" aria-hidden="true">⚜</span>
    )}
    <div className="countdown-unit__value font-serif">
      {String(value).padStart(2, '0')}
    </div>
    <div className="countdown-unit__label">{label}</div>
  </motion.div>
);

const Countdown = () => {
  const { t } = useTranslation();
  const liveConfig = useWeddingConfig() || weddingConfig;
  const activeTheme = liveConfig?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  const { days, hours, minutes, seconds, isComplete, isReady } =
    useCountdown(liveConfig.wedding.dateTime);

  const sepMap = {
    default: ':',
    'elegant-luxury': '✦',
    'minimalist-modern': '/',
    'romantic-floral': '❀',
    'royal-classic': '⚜',
  };
  const sepChar = sepMap[activeTheme] || ':';

  return (
    <SectionWrapper id="countdown">
      <div className="section__header">
        <ThemeHeaderCrest sectionIndex="03" />
        <h2 className="section__title font-serif">{t('countdown.title')}</h2>
        <OrnamentDivider symbol="✦" />
      </div>

      <AnimatePresence mode="wait">
        {!isReady ? (
          <div className="countdown-loading" key="loading" />
        ) : isComplete ? (
          <motion.div
            key="complete"
            className="countdown-complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="countdown-complete__icon" aria-hidden="true">🎉</span>
            <p className="countdown-complete__text font-script">
              {t('countdown.celebration')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="counting"
            className={`countdown-grid countdown-grid--${themeObj?.layout?.countdownVariant || 'classic-cards'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CountdownUnit value={days}    label={t('countdown.days')}    indexTag="01" activeTheme={activeTheme} />
            <span className="countdown-sep" aria-hidden="true">{sepChar}</span>
            <CountdownUnit value={hours}   label={t('countdown.hours')}   indexTag="02" activeTheme={activeTheme} />
            <span className="countdown-sep" aria-hidden="true">{sepChar}</span>
            <CountdownUnit value={minutes} label={t('countdown.minutes')} indexTag="03" activeTheme={activeTheme} />
            <span className="countdown-sep" aria-hidden="true">{sepChar}</span>
            <CountdownUnit value={seconds} label={t('countdown.seconds')} indexTag="04" activeTheme={activeTheme} />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default Countdown;

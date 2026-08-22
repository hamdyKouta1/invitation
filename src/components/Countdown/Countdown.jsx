import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useCountdown from '../../hooks/useCountdown';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import weddingConfig from '../../config/weddingConfig';
import './Countdown.css';

const CountdownUnit = ({ value, label }) => (
  <motion.div
    className="countdown-unit"
    key={value}
    initial={{ opacity: 0.6, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="countdown-unit__value font-serif">
      {String(value).padStart(2, '0')}
    </div>
    <div className="countdown-unit__label">{label}</div>
  </motion.div>
);

const Countdown = () => {
  const { t } = useTranslation();
  const { days, hours, minutes, seconds, isComplete, isReady } =
    useCountdown(weddingConfig.wedding.dateTime);

  return (
    <SectionWrapper id="countdown">
      <div className="section__header">
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
            className="countdown-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CountdownUnit value={days}    label={t('countdown.days')} />
            <span className="countdown-sep" aria-hidden="true">:</span>
            <CountdownUnit value={hours}   label={t('countdown.hours')} />
            <span className="countdown-sep" aria-hidden="true">:</span>
            <CountdownUnit value={minutes} label={t('countdown.minutes')} />
            <span className="countdown-sep" aria-hidden="true">:</span>
            <CountdownUnit value={seconds} label={t('countdown.seconds')} />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default Countdown;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import { getAssetUrl } from '../../utils/assetUtils';
import './Envelope.css';

const HeartSVG = () => (
  <svg
    width="24"
    height="22"
    viewBox="0 0 28 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M14 24S2 16 2 8.5A6.5 6.5 0 0 1 14 5.2 6.5 6.5 0 0 1 26 8.5C26 16 14 24 14 24Z"
      fill="#FDFAF6"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.2"
    />
  </svg>
);

const Envelope = ({ onOpen, onTriggerMusic }) => {
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState('closed');

  const handleOpenClick = () => {
    if (stage !== 'closed') return;

    if (onTriggerMusic) {
      onTriggerMusic();
    }

    track(EVENTS.INVITATION_OPENED);

    if (prefersReducedMotion) {
      onOpen();
      return;
    }

    setStage('opening');

    setTimeout(() => {
      setStage('revealing');
    }, 600);

    setTimeout(() => {
      onOpen();
    }, 2200);
  };

  return (
    <div className="envelope-screen">
      <div className="envelope-screen__watercolors" aria-hidden="true">
        <img src={getAssetUrl('/watercolor-splash.png')} alt="" className="wc wc--tl" />
        <img src={getAssetUrl('/watercolor-splash.png')} alt="" className="wc wc--br" />
        <img src={getAssetUrl('/watercolor-floral.png')} alt="" className="wc wc--bl-floral" />
        <img src={getAssetUrl('/watercolor-floral.png')} alt="" className="wc wc--tr-floral" />
      </div>

      <motion.p
        className="envelope__pre-title"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: stage === 'closed' ? 1 : 0, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('hero.saveTheDate')}
      </motion.p>

      <div className="envelope-scene">
        <div className="envelope-box">

          <div className="envelope__back">
            <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="env-svg">
              <rect x="0" y="0" width="400" height="260" rx="16" fill="#EDE4D8" stroke="#C9A96E" strokeWidth="1.5" />
            </svg>
          </div>

          <motion.div
            className="envelope__top-flap"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: stage !== 'closed' ? -180 : 0 }}
            transition={{ duration: 0.65, ease: [0.4, 0.0, 0.2, 1] }}
            style={{
              transformOrigin: 'top center',
              zIndex: stage !== 'closed' ? 1 : 6,
            }}
          >
            <svg viewBox="0 0 400 135" preserveAspectRatio="none" className="env-svg">
              <polygon points="0,0 400,0 200,135" fill="#F6EFE6" stroke="#C9A96E" strokeWidth="1.5" />
              <polygon points="4,2 396,2 200,131" fill="#F8F3EC" />
            </svg>
          </motion.div>

          <motion.div
            className="envelope__card"
            initial={{ y: 0, scale: 0.96 }}
            animate={
              stage === 'revealing'
                ? { y: -160, scale: 1.05, boxShadow: '0 25px 50px rgba(61,43,31,0.3)' }
                : stage === 'opening'
                ? { y: -35, scale: 0.98 }
                : { y: 0, scale: 0.96 }
            }
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="envelope__card-frame">
              <img
                src={getAssetUrl('/og-image.jpg')}
                alt="Save the Date"
                className="envelope__card-img"
              />
            </div>
          </motion.div>

          <div className="envelope__front">
            <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="env-svg">
              <polygon points="0,260 0,0 200,135" fill="#ECE2D4" opacity="0.95" />
              <polygon points="400,260 400,0 200,135" fill="#E6DACB" opacity="0.95" />
              <polygon points="0,260 400,260 200,120" fill="#F4EBE0" />
              <rect x="8" y="8" width="384" height="244" rx="10" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>

          <div className="envelope__seal-layer">
            <AnimatePresence>
              {stage === 'closed' && (
                <motion.div
                  className="envelope__seal-box"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                >
                  <div className="envelope__pulse-ring" aria-hidden="true" />
                  <div className="envelope__pulse-ring envelope__pulse-ring--2" aria-hidden="true" />

                  <button
                    className="envelope__seal"
                    onClick={handleOpenClick}
                    aria-label={t('envelope.openLabel')}
                    id="btn-open-envelope"
                  >
                    <HeartSVG />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      <motion.div
        className="envelope__cta"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: stage === 'closed' ? 1 : 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <span className="envelope__cta-text">{t('envelope.openLabel')}</span>
        <span className="envelope__cta-hint">{t('envelope.tapHint')}</span>
      </motion.div>
    </div>
  );
};

export default Envelope;

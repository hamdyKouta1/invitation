import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import { getAssetUrl } from '../../utils/assetUtils';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import { ThemeSealIcon, ThemeHeaderCrest } from '../ui/ThemeVisuals';
import FloralCornerSVG from '../ui/FloralCornerSVG';
import './Envelope.css';

const Envelope = ({ onOpen, onTriggerMusic }) => {
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState('closed');
  const config = useWeddingConfig();
  const activeTheme = config?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  const envelopeCardSrc = getAssetUrl(
    themeObj?.assets?.envelopeCardImage || '/og-image.jpg'
  );

  // Theme-specific envelope SVG colors (preserving exact hexes for 'default')
  const envColors = {
    default: {
      backFill: '#EDE4D8',
      stroke: '#C9A96E',
      flapOuter: '#F6EFE6',
      flapInner: '#F8F3EC',
      leftWing: '#ECE2D4',
      rightWing: '#E6DACB',
      bottomFold: '#F4EBE0',
    },
    'elegant-luxury': {
      backFill: '#14110E',
      stroke: '#D4AF37',
      flapOuter: '#1F1A14',
      flapInner: '#181410',
      leftWing: '#1A1612',
      rightWing: '#15120E',
      bottomFold: '#221C16',
    },
    'minimalist-modern': {
      backFill: '#EAE6DF',
      stroke: '#181818',
      flapOuter: '#F4F2ED',
      flapInner: '#FAF9F6',
      leftWing: '#E5E0D8',
      rightWing: '#DFDAD0',
      bottomFold: '#EFECE6',
    },
    'romantic-floral': {
      backFill: '#F7E2E6',
      stroke: '#C86D7E',
      flapOuter: '#FDF0F2',
      flapInner: '#FFF9FA',
      leftWing: '#F5DCE1',
      rightWing: '#F0D2D8',
      bottomFold: '#FAE8EC',
    },
    'royal-classic': {
      backFill: '#0A3528',
      stroke: '#D4AF37',
      flapOuter: '#0E4434',
      flapInner: '#072A20',
      leftWing: '#093024',
      rightWing: '#06241B',
      bottomFold: '#0D3D2E',
    },
  }[activeTheme] || {
    backFill: '#EDE4D8',
    stroke: '#C9A96E',
    flapOuter: '#F6EFE6',
    flapInner: '#F8F3EC',
    leftWing: '#ECE2D4',
    rightWing: '#E6DACB',
    bottomFold: '#F4EBE0',
  };

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
    <div className={`envelope-screen envelope-screen--${activeTheme}`}>
      {/* Default Theme: Original Watercolor Splash & Floral PNGs (100% Untouched) */}
      {activeTheme === 'default' ? (
        <div className="envelope-screen__watercolors" aria-hidden="true">
          <img src={getAssetUrl('/watercolor-splash.png')} alt="" className="wc wc--tl" />
          <img src={getAssetUrl('/watercolor-splash.png')} alt="" className="wc wc--br" />
          <img src={getAssetUrl('/watercolor-floral.png')} alt="" className="wc wc--bl-floral" />
          <img src={getAssetUrl('/watercolor-floral.png')} alt="" className="wc wc--tr-floral" />
        </div>
      ) : (
        /* Custom Theme Corner & Backdrop Ornaments for the 4 New Themes */
        <div className="envelope-screen__theme-ornaments" aria-hidden="true">
          <FloralCornerSVG className="env-theme-corner env-theme-corner--tl" />
          <FloralCornerSVG className="env-theme-corner env-theme-corner--tr" />
          <FloralCornerSVG className="env-theme-corner env-theme-corner--bl" />
          <FloralCornerSVG className="env-theme-corner env-theme-corner--br" />
        </div>
      )}

      {activeTheme !== 'default' && (
        <ThemeHeaderCrest sectionIndex="00" />
      )}

      <motion.p
        className="envelope__pre-title"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: stage === 'closed' ? 1 : 0, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('hero.saveTheDate')}
      </motion.p>

      <div className="envelope-scene">
        <div className={`envelope-box envelope-box--${themeObj?.layout?.envelopeVariant || 'classic-flap'}`}>

          <div className="envelope__back">
            <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="env-svg">
              <rect
                x="0"
                y="0"
                width="400"
                height="260"
                rx={activeTheme === 'minimalist-modern' ? '0' : '16'}
                fill={envColors.backFill}
                stroke={envColors.stroke}
                strokeWidth="1.5"
              />
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
              <polygon points="0,0 400,0 200,135" fill={envColors.flapOuter} stroke={envColors.stroke} strokeWidth="1.5" />
              <polygon points="4,2 396,2 200,131" fill={envColors.flapInner} />
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
                src={envelopeCardSrc}
                alt="Save the Date"
                className="envelope__card-img"
              />
            </div>
          </motion.div>

          <div className="envelope__front">
            <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="env-svg">
              <polygon points="0,260 0,0 200,135" fill={envColors.leftWing} opacity="0.95" />
              <polygon points="400,260 400,0 200,135" fill={envColors.rightWing} opacity="0.95" />
              <polygon points="0,260 400,260 200,120" fill={envColors.bottomFold} />
              <rect
                x="8"
                y="8"
                width="384"
                height="244"
                rx={activeTheme === 'minimalist-modern' ? '0' : '10'}
                fill="none"
                stroke={envColors.stroke}
                strokeWidth="1"
                opacity="0.45"
              />
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
                    className={`envelope__seal envelope__seal--${activeTheme}`}
                    onClick={handleOpenClick}
                    aria-label={t('envelope.openLabel')}
                    id="btn-open-envelope"
                  >
                    <ThemeSealIcon />
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

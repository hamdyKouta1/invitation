import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import './WeddingDetails.css';

const DetailThemeIcon = ({ type, activeTheme }) => {
  if (activeTheme === 'default') return null;

  if (activeTheme === 'elegant-luxury') {
    return (
      <div className="wedding-details__theme-icon wedding-details__theme-icon--gold" aria-hidden="true">
        {type === 'date' ? (
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
            <polygon points="18,2 34,18 18,34 2,18" stroke="#D4AF37" strokeWidth="1.5" fill="rgba(212,175,55,0.1)" />
            <rect x="11" y="12" width="14" height="12" stroke="#F3E5AB" strokeWidth="1.2" />
            <line x1="11" y1="16" x2="25" y2="16" stroke="#D4AF37" strokeWidth="1.2" />
            <circle cx="18" cy="20" r="2" fill="#FFF3C4" />
          </svg>
        ) : (
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
            <polygon points="18,2 34,18 18,34 2,18" stroke="#D4AF37" strokeWidth="1.5" fill="rgba(212,175,55,0.1)" />
            <circle cx="18" cy="18" r="7.5" stroke="#F3E5AB" strokeWidth="1.2" />
            <polyline points="18,13.5 18,18 21.5,20" stroke="#FFF3C4" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}
      </div>
    );
  }

  if (activeTheme === 'minimalist-modern') {
    return (
      <div className="wedding-details__theme-icon wedding-details__theme-icon--minimal" aria-hidden="true">
        <span className="wedding-details__minimal-num">{type === 'date' ? '01 / DATE' : '02 / TIME'}</span>
      </div>
    );
  }

  if (activeTheme === 'romantic-floral') {
    return (
      <div className="wedding-details__theme-icon wedding-details__theme-icon--floral" aria-hidden="true">
        <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" fill="#F4DCE0" stroke="#C86D7E" strokeWidth="1.2" strokeDasharray="4 3" />
          {type === 'date' ? (
            <path d="M20 27S11 21 11 15.5A4.5 4.5 0 0 1 20 13.5 4.5 4.5 0 0 1 29 15.5C29 21 20 27 20 27Z" fill="#C86D7E" opacity="0.85" />
          ) : (
            <>
              <circle cx="20" cy="20" r="8" stroke="#C86D7E" strokeWidth="1.5" fill="#FFF9FA" />
              <polyline points="20,15 20,20 23.5,22" stroke="#C86D7E" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    );
  }

  if (activeTheme === 'royal-classic') {
    return (
      <div className="wedding-details__theme-icon wedding-details__theme-icon--royal" aria-hidden="true">
        <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" fill="#072A20" stroke="#D4AF37" strokeWidth="1.8" />
          <polygon points="12,24 14,14 17,18 20,11 23,18 26,14 28,24" fill="#D4AF37" />
          <rect x="12" y="25" width="16" height="3" rx="1" fill="#721121" />
        </svg>
      </div>
    );
  }

  return null;
};

const WeddingDetails = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';
  const liveConfig = useWeddingConfig() || weddingConfig;
  const activeTheme = liveConfig?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  const day  = isAr ? liveConfig.wedding.dayAr  : liveConfig.wedding.dayEn;
  const date = isAr ? liveConfig.wedding.dateDisplay : liveConfig.wedding.dateDisplayEn;
  const time = isAr ? liveConfig.wedding.time  : liveConfig.wedding.timeEn;

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show:   { opacity: 1, y: 0 },
  };

  return (
    <SectionWrapper id="details" alt>
      <div className="section__header">
        <ThemeHeaderCrest sectionIndex="02" />
        <p className="section__eyebrow tracking-widest uppercase">{t('details.title')}</p>
        <OrnamentDivider symbol="✦" />
      </div>

      <motion.div
        className={`wedding-details wedding-details--${themeObj?.layout?.detailsVariant || 'classic-split'}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.2 }}
        variants={{ hidden: {}, show: {} }}
      >
        {/* Day */}
        <motion.div
          className="wedding-details__block"
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <DetailThemeIcon type="date" activeTheme={activeTheme} />
          <span className="wedding-details__label">{t('details.date')}</span>
          <span className="wedding-details__day font-script">{day}</span>
          <span className="wedding-details__date font-serif">{date}</span>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          className="wedding-details__sep"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="wedding-details__sep-icon" aria-hidden="true">
            {activeTheme === 'default' ? '❧' : themeObj?.preview?.ornament || '❧'}
          </span>
        </motion.div>

        {/* Time */}
        <motion.div
          className="wedding-details__block"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <DetailThemeIcon type="time" activeTheme={activeTheme} />
          <span className="wedding-details__label">{t('details.time')}</span>
          <span className="wedding-details__time font-serif">{time}</span>
        </motion.div>
      </motion.div>

      {/* Bottom decorative line */}
      <OrnamentDivider symbol="✦" className="wedding-details__bottom-divider" />
    </SectionWrapper>
  );
};

export default WeddingDetails;

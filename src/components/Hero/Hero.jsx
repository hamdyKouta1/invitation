import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import OrnamentDivider from '../ui/OrnamentDivider';
import FloralCornerSVG from '../ui/FloralCornerSVG';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import { getAssetUrl } from '../../utils/assetUtils';
import './Hero.css';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';
  const liveConfig = useWeddingConfig() || weddingConfig;
  const activeTheme = liveConfig?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  const groomName = isAr ? liveConfig.groom.name : liveConfig.groom.nameEn;
  const brideName = isAr ? liveConfig.bride.name : liveConfig.bride.nameEn;
  const dateDisplay = isAr ? liveConfig.wedding.dateDisplay : liveConfig.wedding.dateDisplayEn;
  const timeDisplay = isAr ? liveConfig.wedding.time : liveConfig.wedding.timeEn;
  const venueName = isAr ? liveConfig.venue.nameAr : liveConfig.venue.nameEn;

  const heroImgSrc = getAssetUrl(themeObj?.assets?.heroImage || '/couple-illustration.png');
  const heroFallbackSrc = themeObj?.assets?.heroFallbackSvg
    ? getAssetUrl(themeObj.assets.heroFallbackSvg)
    : getAssetUrl('/couple-illustration.png');

  const handleHeroImgError = (e) => {
    if (e.currentTarget.src !== heroFallbackSrc) {
      e.currentTarget.src = heroFallbackSrc;
    }
  };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: themeObj?.animations?.revealDuration || 0.8,
        ease: themeObj?.animations?.revealEase || [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  /* ──────────────────────────────────────────────────────────────────────────
   * LAYOUT VARIANT 2: MINIMALIST MODERN — Editorial Magazine Split Poster
   * ────────────────────────────────────────────────────────────────────────── */
  if (activeTheme === 'minimalist-modern') {
    return (
      <section id="hero" className="hero-section hero-section--minimalist-modern" aria-label="Wedding hero">
        <FloralCornerSVG className="hero__floral hero__floral--tl" aria-hidden="true" />
        <FloralCornerSVG className="hero__floral hero__floral--tr" aria-hidden="true" />
        <FloralCornerSVG className="hero__floral hero__floral--bl" aria-hidden="true" />
        <FloralCornerSVG className="hero__floral hero__floral--br" aria-hidden="true" />

        <motion.div
          className="hero__arch-card hero__arch-card--editorial-split"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Top Editorial Magazine Masthead */}
          <div className="hero-editorial__masthead">
            <span className="hero-editorial__issue">ISSUE NO. 01 — THE WEDDING EDITION</span>
            <span className="hero-editorial__dot">•</span>
            <span className="hero-editorial__year">{t('hero.saveTheDate')}</span>
          </div>

          <div className="hero-editorial__grid">
            {/* Artwork / Photography Column */}
            <motion.div className="hero-editorial__visual-col" variants={fadeUp}>
              <div className="hero__illustration-wrap hero__frame--editorial-polaroid">
                <div className="hero-editorial__offset-block" aria-hidden="true" />
                <img
                  src={heroImgSrc}
                  onError={handleHeroImgError}
                  alt={`${groomName} & ${brideName}`}
                  className="hero__illustration"
                  loading="eager"
                />
                <div className="hero-editorial__caption-bar">
                  <span>FIG. 01 — FINE ART PORTRAIT</span>
                  <span>MMXXVI</span>
                </div>
              </div>
            </motion.div>

            {/* Editorial Typography Column */}
            <motion.div className="hero-editorial__text-col" variants={fadeUp}>
              <ThemeHeaderCrest sectionIndex="01" />

              <p className="hero__save-the-date">
                <span className="hero__save-line" aria-hidden="true" />
                <span className="hero__save-text">{t('hero.saveTheDate')}</span>
              </p>

              <h1 className="hero__groom-name font-script">{groomName}</h1>

              <div className="hero__and">
                <span className="hero__and-line" aria-hidden="true" />
                <span className="hero__and-text font-serif">{t('hero.and')}</span>
                <span className="hero__and-line" aria-hidden="true" />
              </div>

              <h2 className="hero__bride-name font-script">{brideName}</h2>

              <OrnamentDivider />

              <p className="hero__join-us font-serif">{t('hero.joinUs')}</p>

              {/* Architectural 3-Cell Metadata Strip */}
              <div className="hero-editorial__meta-strip">
                <div className="hero-editorial__meta-cell">
                  <span className="hero-editorial__meta-label">{isAr ? 'التاريخ' : 'DATE'}</span>
                  <strong className="hero__date-teaser font-serif">{dateDisplay}</strong>
                </div>
                <div className="hero-editorial__meta-cell">
                  <span className="hero-editorial__meta-label">{isAr ? 'الموعد' : 'TIME'}</span>
                  <strong className="hero-editorial__meta-val">{timeDisplay}</strong>
                </div>
                <div className="hero-editorial__meta-cell">
                  <span className="hero-editorial__meta-label">{isAr ? 'المكان' : 'VENUE'}</span>
                  <strong className="hero-editorial__meta-val">{venueName}</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
   * LAYOUT VARIANTS: ELEGANT LUXURY, ROMANTIC FLORAL, ROYAL CLASSIC
   * (Portrait-First Hero Showcase with Custom Frame, Crest & Banner)
   * ────────────────────────────────────────────────────────────────────────── */
  if (activeTheme !== 'default') {
    const frameClass = `hero__frame--${themeObj?.assets?.imageFrameStyle || 'classic-arch'}`;
    const variantClass = `hero__arch-card--${themeObj?.layout?.heroVariant || 'classic-arch'}`;

    return (
      <section id="hero" className={`hero-section hero-section--${activeTheme}`} aria-label="Wedding hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__bg-circle hero__bg-circle--1" />
          <div className="hero__bg-circle hero__bg-circle--2" />
        </div>

        <FloralCornerSVG className="hero__floral hero__floral--tl" aria-hidden="true" />
        <FloralCornerSVG className="hero__floral hero__floral--tr" aria-hidden="true" />
        <FloralCornerSVG className="hero__floral hero__floral--bl" aria-hidden="true" />
        <FloralCornerSVG className="hero__floral hero__floral--br" aria-hidden="true" />

        <div className={`hero__arch-card ${variantClass}`}>
          <ThemeHeaderCrest sectionIndex="01" />

          <motion.div
            className="hero__content"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.p className="hero__save-the-date" variants={fadeUp}>
              <span className="hero__save-line" aria-hidden="true" />
              <span className="hero__save-text">{t('hero.saveTheDate')}</span>
              <span className="hero__save-line" aria-hidden="true" />
            </motion.p>

            {/* Theme-Specific Featured Hero Illustration & Custom Frame */}
            <motion.div className={`hero__illustration-wrap ${frameClass}`} variants={fadeUp}>
              <div className="hero__frame-ornament hero__frame-ornament--tl" aria-hidden="true" />
              <div className="hero__frame-ornament hero__frame-ornament--tr" aria-hidden="true" />
              <div className="hero__frame-ornament hero__frame-ornament--bl" aria-hidden="true" />
              <div className="hero__frame-ornament hero__frame-ornament--br" aria-hidden="true" />
              <img
                src={heroImgSrc}
                onError={handleHeroImgError}
                alt={`${groomName} & ${brideName}`}
                className="hero__illustration"
                loading="eager"
              />
              <div className="hero__illustration-overlay" aria-hidden="true" />
            </motion.div>

            <OrnamentDivider symbol={themeObj?.preview?.ornament || '✦'} />

            <motion.h1 className="hero__groom-name font-script" variants={fadeUp}>
              {groomName}
            </motion.h1>

            <motion.div className="hero__and" variants={fadeUp}>
              <span className="hero__and-line" aria-hidden="true" />
              <span className="hero__and-text font-serif">{t('hero.and')}</span>
              <span className="hero__and-line" aria-hidden="true" />
            </motion.div>

            <motion.h2 className="hero__bride-name font-script" variants={fadeUp}>
              {brideName}
            </motion.h2>

            <OrnamentDivider symbol="❧" />

            <motion.p className="hero__join-us font-serif" variants={fadeUp}>
              {t('hero.joinUs')}
            </motion.p>

            <motion.div className="hero__date-banner" variants={fadeUp}>
              <p className="hero__date-teaser font-serif">{dateDisplay}</p>
              <span className="hero__venue-teaser">{venueName}</span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="hero__scroll-indicator"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="hero__scroll-line" />
          <div className="hero__scroll-dot" />
        </motion.div>
      </section>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────────
   * DEFAULT THEME — 100% Original Hero Structure & Assets Untouched
   * ────────────────────────────────────────────────────────────────────────── */
  return (
    <section id="hero" className="hero-section" aria-label="Wedding hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-circle hero__bg-circle--1" />
        <div className="hero__bg-circle hero__bg-circle--2" />
      </div>

      <FloralCornerSVG className="hero__floral hero__floral--tl" aria-hidden="true" />
      <FloralCornerSVG className="hero__floral hero__floral--tr" aria-hidden="true" />
      <FloralCornerSVG className="hero__floral hero__floral--bl" aria-hidden="true" />
      <FloralCornerSVG className="hero__floral hero__floral--br" aria-hidden="true" />

      <div className="hero__arch-card">
        <div className="hero__arch-finial" aria-hidden="true">✦</div>

        <motion.div
          className="hero__content"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p className="hero__save-the-date" variants={fadeUp}>
            <span className="hero__save-line" aria-hidden="true" />
            <span className="hero__save-text">{t('hero.saveTheDate')}</span>
            <span className="hero__save-line" aria-hidden="true" />
          </motion.p>

          <OrnamentDivider symbol="✦" />

          <motion.h1 className="hero__groom-name font-script" variants={fadeUp}>
            {groomName}
          </motion.h1>

          <motion.div className="hero__and" variants={fadeUp}>
            <span className="hero__and-line" aria-hidden="true" />
            <span className="hero__and-text font-serif">{t('hero.and')}</span>
            <span className="hero__and-line" aria-hidden="true" />
          </motion.div>

          <motion.h2 className="hero__bride-name font-script" variants={fadeUp}>
            {brideName}
          </motion.h2>

          <OrnamentDivider symbol="❧" />

          <motion.div className="hero__illustration-wrap" variants={fadeUp}>
            <img
              src={getAssetUrl('/couple-illustration.png')}
              alt={`${groomName} & ${brideName}`}
              className="hero__illustration"
              loading="eager"
            />
          </motion.div>

          <motion.p className="hero__join-us font-serif" variants={fadeUp}>
            {t('hero.joinUs')}
          </motion.p>

          <motion.p className="hero__date-teaser font-serif" variants={fadeUp}>
            {dateDisplay}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll-indicator"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="hero__scroll-line" />
        <div className="hero__scroll-dot" />
      </motion.div>
    </section>
  );
};

export default Hero;

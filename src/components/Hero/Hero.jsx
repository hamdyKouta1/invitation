import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import OrnamentDivider from '../ui/OrnamentDivider';
import FloralCornerSVG from '../ui/FloralCornerSVG';
import './Hero.css';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';

  const groomName = isAr ? weddingConfig.groom.name  : weddingConfig.groom.nameEn;
  const brideName = isAr ? weddingConfig.bride.name  : weddingConfig.bride.nameEn;

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
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

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
              src="/couple-illustration.png"
              alt={`${groomName} & ${brideName}`}
              className="hero__illustration"
              loading="eager"
            />
          </motion.div>

          <motion.p className="hero__join-us font-serif" variants={fadeUp}>
            {t('hero.joinUs')}
          </motion.p>

          <motion.p className="hero__date-teaser font-serif" variants={fadeUp}>
            {isAr ? weddingConfig.wedding.dateDisplay : weddingConfig.wedding.dateDisplayEn}
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

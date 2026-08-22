import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import './WeddingDetails.css';

const WeddingDetails = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';

  const day  = isAr ? weddingConfig.wedding.dayAr  : weddingConfig.wedding.dayEn;
  const date = isAr ? weddingConfig.wedding.dateDisplay : weddingConfig.wedding.dateDisplayEn;
  const time = isAr ? weddingConfig.wedding.time  : weddingConfig.wedding.timeEn;

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show:   { opacity: 1, y: 0 }
  };

  return (
    <SectionWrapper id="details" alt>
      <div className="section__header">
        <p className="section__eyebrow tracking-widest uppercase">{t('details.title')}</p>
        <OrnamentDivider symbol="✦" />
      </div>

      <motion.div
        className="wedding-details"
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
          <span className="wedding-details__sep-icon" aria-hidden="true">❧</span>
        </motion.div>

        {/* Time */}
        <motion.div
          className="wedding-details__block"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
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

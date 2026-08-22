import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import './Families.css';

const FamilyCard = ({ familyTitle, titleKey, name, fatherLabel, fatherName, motherName, showMother = true, delay = 0 }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="family-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="family-card__inner">
        <div className="family-card__top-ornament" aria-hidden="true">✦</div>
        {familyTitle && <p className="family-card__family-title font-serif">{familyTitle}</p>}
        <p className="family-card__title">{t(titleKey)}</p>
        <h3 className="family-card__name font-script">{name}</h3>
        <OrnamentDivider symbol="❧" className="family-card__divider" />
        <p className="family-card__parents">
          <span className="family-card__parent-label">{fatherLabel}</span>
          <span className="family-card__father-name">{fatherName}</span>
        </p>
        {showMother && motherName && (
          <p className="family-card__parents">
            <span className="family-card__parent-label">{t('families.and')}</span>
            <span className="family-card__mother-name">{motherName}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

const Families = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const groom = weddingConfig.groom;
  const bride = weddingConfig.bride;
  const honorPhrase = isAr ? weddingConfig.invitationPhraseAr : weddingConfig.invitationPhraseEn;

  return (
    <SectionWrapper id="families" alt>
      <div className="section__header">
        <h2 className="section__title font-serif">{t('families.title')}</h2>
        {honorPhrase && (
          <p className="families__honor-phrase font-serif">{honorPhrase}</p>
        )}
        <OrnamentDivider symbol="✦" />
      </div>

      <div className="families-grid">
        <FamilyCard
          familyTitle={isAr ? groom.familyTitleAr : groom.familyTitleEn}
          titleKey="families.groomFamily"
          name={isAr ? groom.name : groom.nameEn}
          fatherLabel={t('families.sonOf')}
          fatherName={isAr ? groom.father : groom.fatherEn}
          motherName={isAr ? groom.mother : groom.motherEn}
          showMother={groom.showMother !== false}
          delay={0}
        />

        {/* Center heart ornament */}
        <div className="families-heart" aria-hidden="true">
          <span className="families-heart__icon">♡</span>
        </div>

        <FamilyCard
          familyTitle={isAr ? bride.familyTitleAr : bride.familyTitleEn}
          titleKey="families.brideFamily"
          name={isAr ? bride.name : bride.nameEn}
          fatherLabel={t('families.daughterOf')}
          fatherName={isAr ? bride.father : bride.fatherEn}
          motherName={isAr ? bride.mother : bride.motherEn}
          showMother={bride.showMother !== false}
          delay={0.15}
        />
      </div>
    </SectionWrapper>
  );
};

export default Families;

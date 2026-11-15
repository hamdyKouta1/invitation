import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import useWeddingConfig from '../../hooks/useWeddingConfig';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import './Families.css';

const FamilyCard = ({
  familyTitle,
  titleKey,
  name,
  fatherLabel,
  fatherName,
  motherName,
  showMother = true,
  delay = 0,
  topOrnament = '✦',
  cardIndex = '01',
  activeTheme = 'default',
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className={`family-card family-card--${activeTheme}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="family-card__inner">
        <div className="family-card__top-ornament" aria-hidden="true">
          {activeTheme === 'minimalist-modern' ? `HOUSE ${cardIndex}` : topOrnament}
        </div>
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
  const liveConfig = useWeddingConfig() || weddingConfig;
  const activeTheme = liveConfig?.theme || 'default';

  if (liveConfig.sections?.families?.enabled === false) return null;

  const groom = liveConfig.groom || {};
  const bride = liveConfig.bride || {};
  const secCfg = liveConfig.sections?.families || {};

  const sectionTitle = isAr
    ? (secCfg.titleAr || t('families.title'))
    : (secCfg.titleEn || t('families.title'));

  const honorPhrase = isAr
    ? (secCfg.subtitleAr || liveConfig.invitationPhraseAr)
    : (secCfg.subtitleEn || liveConfig.invitationPhraseEn);

  const topOrnamentMap = {
    default: '✦',
    'elegant-luxury': '❖',
    'minimalist-modern': '—',
    'romantic-floral': '❀',
    'royal-classic': '⚜',
  };

  const centerEmblemMap = {
    default: '♡',
    'elegant-luxury': '❖',
    'minimalist-modern': '&',
    'romantic-floral': '❀',
    'royal-classic': '⚜',
  };

  return (
    <SectionWrapper id="families" alt>
      <div className="section__header">
        <ThemeHeaderCrest sectionIndex="04" />
        <h2 className="section__title font-serif">{sectionTitle}</h2>
        {honorPhrase && (
          <p className="families__honor-phrase font-serif">{honorPhrase}</p>
        )}
        <OrnamentDivider symbol="✦" />
      </div>

      <div className={`families-grid families-grid--${activeTheme}`}>
        <FamilyCard
          familyTitle={isAr ? groom.familyTitleAr : groom.familyTitleEn}
          titleKey="families.groomFamily"
          name={isAr ? groom.name : groom.nameEn}
          fatherLabel={t('families.sonOf')}
          fatherName={isAr ? groom.father : (groom.fatherEn || groom.father)}
          motherName={isAr ? groom.mother : (groom.motherEn || groom.mother)}
          showMother={Boolean(groom.showMother)}
          delay={0}
          topOrnament={topOrnamentMap[activeTheme] || '✦'}
          cardIndex="01"
          activeTheme={activeTheme}
        />

        {/* Center theme-specific emblem */}
        <div className="families-heart" aria-hidden="true">
          <span className="families-heart__icon">{centerEmblemMap[activeTheme] || '♡'}</span>
        </div>

        <FamilyCard
          familyTitle={isAr ? bride.familyTitleAr : bride.familyTitleEn}
          titleKey="families.brideFamily"
          name={isAr ? bride.name : bride.nameEn}
          fatherLabel={t('families.daughterOf')}
          fatherName={isAr ? bride.father : (bride.fatherEn || bride.father)}
          motherName={isAr ? bride.mother : (bride.motherEn || bride.mother)}
          showMother={Boolean(bride.showMother)}
          delay={0.15}
          topOrnament={topOrnamentMap[activeTheme] || '✦'}
          cardIndex="02"
          activeTheme={activeTheme}
        />
      </div>
    </SectionWrapper>
  );
};

export default Families;

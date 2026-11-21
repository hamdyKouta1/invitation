import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import useWeddingConfig from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import { getEventTypeById } from '../../config/eventTypesConfig';
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

  if (activeTheme === 'golden-theme') {
    return (
      <div className="wedding-details__theme-icon wedding-details__theme-icon--golden" aria-hidden="true">
        <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
          <path
            d="M16 26.5S4 18.6 4 10.6A6.5 6.5 0 0 1 16 7a6.5 6.5 0 0 1 12 3.6C28 18.6 16 26.5 16 26.5Z"
            stroke="#9E855C"
            strokeWidth="1.3"
            fill="rgba(166,137,91,0.12)"
          />
        </svg>
      </div>
    );
  }

  return null;
};

const DEFAULT_GOLDEN_AGENDA = [
  {
    id: 'ag-1',
    timeAr: '٥:٠٠ مساءً',
    timeEn: '5:00 PM',
    titleAr: 'استقبال الضيوف والترحيب',
    titleEn: 'Guest Arrival & Welcome Drinks',
    descriptionAr: 'بداية التجمع واستقبال الأحبة في القاعة',
    descriptionEn: 'Welcome reception and music as guests arrive',
  },
  {
    id: 'ag-2',
    timeAr: '٦:٣٠ مساءً',
    timeEn: '6:30 PM',
    titleAr: 'دخول العروسين وبدء المراسم',
    titleEn: 'Grand Entrance & Ceremony',
    descriptionAr: 'لحظة الدخول وبداية مراسم الاحتفال الرسمية',
    descriptionEn: 'The grand entrance and official celebration ceremony',
  },
  {
    id: 'ag-3',
    timeAr: '٨:٣٠ مساءً',
    timeEn: '8:30 PM',
    titleAr: 'مأدبة العشاء وتقطيع الكيك',
    titleEn: 'Dinner Reception & Cake Cutting',
    descriptionAr: 'مشاركة العشاء الاحتفالي واللحظات السعيدة',
    descriptionEn: 'Celebratory dinner, toasts, and cake cutting',
  },
  {
    id: 'ag-4',
    timeAr: '١٠:٠٠ مساءً',
    timeEn: '10:00 PM',
    titleAr: 'سهرة الاحتفال والرقص',
    titleEn: 'Evening Celebration & Dancing',
    descriptionAr: 'أجمل الأوقات الموسيقية والاحتفال حتى الختام',
    descriptionEn: 'Music, joy, and dancing under the lights',
  },
];

const WeddingDetails = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';
  const liveConfig = useWeddingConfig() || weddingConfig;
  const activeTheme = liveConfig?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  if (liveConfig.sections?.details?.enabled === false) return null;

  const day  = isAr ? liveConfig.wedding?.dayAr  : liveConfig.wedding?.dayEn;
  const date = isAr ? liveConfig.wedding?.dateDisplay : liveConfig.wedding?.dateDisplayEn;
  const time = isAr ? liveConfig.wedding?.time  : liveConfig.wedding?.timeEn;

  const secCfg = liveConfig.sections?.details || {};
  const eventMeta = getEventTypeById(liveConfig.eventType);
  const defaultTitle =
    liveConfig.eventType && liveConfig.eventType !== 'wedding'
      ? (isAr ? eventMeta.detailsSectionTitleAr : eventMeta.detailsSectionTitleEn)
      : t('details.title');
  const sectionTitle = isAr
    ? (secCfg.titleAr || defaultTitle)
    : (secCfg.titleEn || defaultTitle);
  const sectionSubtitle = isAr ? secCfg.subtitleAr : secCfg.subtitleEn;
  const isGoldenTheme = activeTheme === 'golden-theme';
  const configuredAgenda = Array.isArray(liveConfig.agenda) ? liveConfig.agenda : [];
  const agendaList =
    configuredAgenda.length > 0
      ? configuredAgenda
      : isGoldenTheme
        ? DEFAULT_GOLDEN_AGENDA
        : [];

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show:   { opacity: 1, y: 0 },
  };

  return (
    <SectionWrapper id="details" alt>
      <div className="section__header">
        <ThemeHeaderCrest sectionIndex="02" />
        <p className="section__eyebrow tracking-widest uppercase">{sectionTitle}</p>
        {sectionSubtitle && <p className="section__subtitle">{sectionSubtitle}</p>}
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

      {/* Golden Theme "OUR SPECIAL DAY" Framed Agenda & Timeline Card */}
      {agendaList.length > 0 && (
        <motion.div
          className="golden-agenda-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="golden-agenda__header">
            <span className="golden-agenda__eyebrow">
              {isAr ? 'برنامج يومنا المميز' : 'OUR SPECIAL DAY'}
            </span>
            <h3 className="golden-agenda__title font-serif">
              {isAr ? 'فقرات وأجندة الاحتفال' : 'The Order of Events'}
            </h3>
          </div>

          <div className="golden-agenda__timeline">
            {agendaList.map((slot, idx) => (
              <div key={slot.id || idx} className="golden-agenda__item">
                <div className="golden-agenda__time-col">
                  <span className="golden-agenda__time font-serif">
                    {isAr ? (slot.timeAr || slot.time) : (slot.timeEn || slot.time)}
                  </span>
                </div>

                <div className="golden-agenda__marker-col" aria-hidden="true">
                  <span className="golden-agenda__heart-dot">
                    <svg width="18" height="16" viewBox="0 0 24 22" fill="none">
                      <path
                        d="M12 20S2.5 13.8 2.5 7.5A4.8 4.8 0 0 1 12 4.8a4.8 4.8 0 0 1 9.5 2.7C21.5 13.8 12 20 12 20Z"
                        fill="#A6895B"
                      />
                    </svg>
                  </span>
                  {idx < agendaList.length - 1 && <span className="golden-agenda__line" />}
                </div>

                <div className="golden-agenda__content-col">
                  <h4 className="golden-agenda__event-title font-serif">
                    {isAr ? (slot.titleAr || slot.title) : (slot.titleEn || slot.title)}
                  </h4>
                  {(slot.descriptionAr || slot.descriptionEn) && (
                    <p className="golden-agenda__event-desc">
                      {isAr ? slot.descriptionAr : slot.descriptionEn}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom decorative line */}
      <OrnamentDivider symbol="✦" className="wedding-details__bottom-divider" />
    </SectionWrapper>
  );
};

export default WeddingDetails;

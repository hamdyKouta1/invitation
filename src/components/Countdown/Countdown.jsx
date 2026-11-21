import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useCountdown from '../../hooks/useCountdown';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import weddingConfig from '../../config/weddingConfig';
import useWeddingConfig from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import './Countdown.css';

const OutlineHeartSVG = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M14 24.5S3.5 17.2 3.5 9.8A5.8 5.8 0 0 1 14 6.5a5.8 5.8 0 0 1 10.5 3.3C24.5 17.2 14 24.5 14 24.5Z"
      stroke="#9E855C"
      strokeWidth="1.4"
      fill="none"
    />
  </svg>
);

const SolidGoldenHeartBadge = ({ day }) => (
  <div className="golden-calendar__heart-day" aria-label={`Event Day ${day}`}>
    <svg width="42" height="38" viewBox="0 0 44 40" fill="none" aria-hidden="true">
      <path
        d="M22 37S4 25.2 4 13.5A9.5 9.5 0 0 1 22 8.2a9.5 9.5 0 0 1 18 5.3C40 25.2 22 37 22 37Z"
        fill="#A6895B"
      />
    </svg>
    <span className="golden-calendar__heart-day-num">{day}</span>
  </div>
);

const GoldenCalendarCard = ({ rawDateStr, rawDateTimeStr, isAr }) => {
  const calendarData = useMemo(() => {
    let parsed = null;
    if (rawDateStr && /^\d{4}-\d{2}-\d{2}$/.test(rawDateStr.trim())) {
      const [y, m, d] = rawDateStr.trim().split('-').map(Number);
      parsed = { year: y, monthIndex: m - 1, targetDay: d };
    } else if (rawDateTimeStr) {
      const dt = new Date(rawDateTimeStr);
      if (!isNaN(dt.getTime())) {
        parsed = { year: dt.getFullYear(), monthIndex: dt.getMonth(), targetDay: dt.getDate() };
      }
    }
    if (!parsed) {
      parsed = { year: 2026, monthIndex: 10, targetDay: 24 }; // Fallback: November 24, 2026
    }

    const { year, monthIndex, targetDay } = parsed;
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const enMonths = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
    ];
    const arMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ];

    const monthHeader = isAr
      ? `${arMonths[monthIndex]} ${year}`
      : `${enMonths[monthIndex]} ${year}`;

    const weekdays = isAr
      ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
      : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }

    return { monthHeader, weekdays, cells, targetDay };
  }, [rawDateStr, rawDateTimeStr, isAr]);

  return (
    <motion.div
      className="golden-calendar-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="golden-calendar__header">
        <OutlineHeartSVG size={24} />
        <h3 className="golden-calendar__month font-serif">{calendarData.monthHeader}</h3>
        <OutlineHeartSVG size={24} />
      </div>

      <div className="golden-calendar__weekdays">
        {calendarData.weekdays.map((wd, idx) => (
          <span key={idx} className="golden-calendar__weekday">
            {wd}
          </span>
        ))}
      </div>

      <div className="golden-calendar__grid">
        {calendarData.cells.map((dayNum, idx) => {
          if (dayNum === null) {
            return <div key={`empty-${idx}`} className="golden-calendar__cell golden-calendar__cell--empty" />;
          }
          const isEventDay = dayNum === calendarData.targetDay;
          return (
            <div
              key={`day-${dayNum}`}
              className={`golden-calendar__cell ${isEventDay ? 'golden-calendar__cell--active' : ''}`}
            >
              {isEventDay ? (
                <SolidGoldenHeartBadge day={dayNum} />
              ) : (
                <span className="golden-calendar__day-num">{dayNum}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="golden-calendar__footer">
        <span className="golden-calendar__script font-script">
          {isAr ? 'اليوم الذي تبدأ فيه حكايتنا للأبد' : 'The day our forever begins'}
        </span>
        <OutlineHeartSVG size={20} className="golden-calendar__footer-heart" />
      </div>
    </motion.div>
  );
};

const CountdownUnit = ({ value, label, indexTag, activeTheme }) => (
  <motion.div
    className={`countdown-unit countdown-unit--${activeTheme}`}
    key={value}
    initial={{ opacity: 0.6, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    {activeTheme === 'minimalist-modern' && indexTag && (
      <span className="countdown-unit__index" aria-hidden="true">{indexTag}</span>
    )}
    {activeTheme === 'elegant-luxury' && (
      <span className="countdown-unit__gem" aria-hidden="true">❖</span>
    )}
    {activeTheme === 'romantic-floral' && (
      <span className="countdown-unit__petal-badge" aria-hidden="true">❀</span>
    )}
    {activeTheme === 'royal-classic' && (
      <span className="countdown-unit__crown-badge" aria-hidden="true">⚜</span>
    )}
    <div className="countdown-unit__value font-serif">
      {activeTheme === 'golden-theme' ? String(value) : String(value).padStart(2, '0')}
    </div>
    <div className="countdown-unit__label">{label}</div>
  </motion.div>
);

const Countdown = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const liveConfig = useWeddingConfig() || weddingConfig;
  const activeTheme = liveConfig?.theme || 'default';
  const themeObj = getThemeById(activeTheme);
  const isGoldenTheme = activeTheme === 'golden-theme';

  const { days, hours, minutes, seconds, isComplete, isReady } =
    useCountdown(liveConfig.wedding?.dateTime);

  if (liveConfig.sections?.countdown?.enabled === false) return null;

  const celebrationQuote = isAr
    ? (liveConfig.wedding?.celebrationQuoteAr || t('countdown.celebration'))
    : (liveConfig.wedding?.celebrationQuoteEn || t('countdown.celebration'));

  const secCfg = liveConfig.sections?.countdown || {};
  const defaultGoldenTitle = isAr ? 'العد التنازلي للحظتنا الأبدية' : 'Counting Down to Forever';
  const sectionTitle = isAr
    ? (secCfg.titleAr || (isGoldenTheme ? defaultGoldenTitle : t('countdown.title')))
    : (secCfg.titleEn || (isGoldenTheme ? defaultGoldenTitle : t('countdown.title')));
  const sectionSubtitle = isAr ? secCfg.subtitleAr : secCfg.subtitleEn;

  const sepMap = {
    default: ':',
    'elegant-luxury': '✦',
    'minimalist-modern': '/',
    'romantic-floral': '❀',
    'royal-classic': '⚜',
  };
  const sepChar = sepMap[activeTheme] || ':';

  return (
    <SectionWrapper id="countdown">
      <div className="section__header">
        {isGoldenTheme ? (
          <p className="golden-countdown__eyebrow">
            {isAr ? 'اقترب اليوم الموعود' : 'THE BIG DAY IS ALMOST HERE'}
          </p>
        ) : (
          <ThemeHeaderCrest sectionIndex="03" />
        )}
        <h2 className="section__title font-serif">{sectionTitle}</h2>
        {sectionSubtitle && <p className="section__subtitle">{sectionSubtitle}</p>}
        {!isGoldenTheme && <OrnamentDivider symbol="✦" />}
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
              {celebrationQuote}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="counting"
            className={`countdown-grid countdown-grid--${themeObj?.layout?.countdownVariant || 'classic-cards'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CountdownUnit value={days}    label={t('countdown.days')}    indexTag="01" activeTheme={activeTheme} />
            {!isGoldenTheme && <span className="countdown-sep" aria-hidden="true">{sepChar}</span>}
            <CountdownUnit value={hours}   label={t('countdown.hours')}   indexTag="02" activeTheme={activeTheme} />
            {!isGoldenTheme && <span className="countdown-sep" aria-hidden="true">{sepChar}</span>}
            <CountdownUnit value={minutes} label={t('countdown.minutes')} indexTag="03" activeTheme={activeTheme} />
            {!isGoldenTheme && <span className="countdown-sep" aria-hidden="true">{sepChar}</span>}
            <CountdownUnit value={seconds} label={t('countdown.seconds')} indexTag="04" activeTheme={activeTheme} />
          </motion.div>
        )}
      </AnimatePresence>

      {isGoldenTheme && (
        <div className="golden-countdown-extras">
          <p className="golden-countdown__caption">
            {isAr
              ? 'كل ثانية تقربنا أكثر إلى بدايتنا الأبدية.'
              : 'Every second brings us closer to our forever.'}
          </p>

          <GoldenCalendarCard
            rawDateStr={liveConfig.wedding?.date}
            rawDateTimeStr={liveConfig.wedding?.dateTime}
            isAr={isAr}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default Countdown;

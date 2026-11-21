import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import FloralCornerSVG from '../ui/FloralCornerSVG';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import useWeddingConfig from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import { getAssetUrl } from '../../utils/assetUtils';
import { sanitizeUrl, isSafeImageUrl } from '../../utils/security';
import './CustomSection.css';

const CustomSection = ({ section, sectionIndex = '✦' }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const weddingConfig = useWeddingConfig();
  const activeTheme = weddingConfig?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  if (!section || section.enabled === false) return null;

  const title = isAr
    ? (section.titleAr || section.titleEn || section.title || '')
    : (section.titleEn || section.titleAr || section.title || '');

  const subtitle = isAr
    ? (section.subtitleAr || section.subtitleEn || section.subtitle || '')
    : (section.subtitleEn || section.subtitleAr || section.subtitle || '');

  const content = isAr
    ? (section.contentAr || section.contentEn || section.content || '')
    : (section.contentEn || section.contentAr || section.content || '');

  const badge = isAr
    ? (section.badgeAr || section.badgeEn || '')
    : (section.badgeEn || section.badgeAr || '');

  const ctaText = isAr
    ? (section.ctaTextAr || section.ctaTextEn || '')
    : (section.ctaTextEn || section.ctaTextAr || '');

  const quote = isAr
    ? (section.quoteAr || section.quoteEn || '')
    : (section.quoteEn || section.quoteAr || '');

  const rawParagraphs = isAr
    ? (Array.isArray(section.paragraphsAr) ? section.paragraphsAr : null)
    : (Array.isArray(section.paragraphsEn) ? section.paragraphsEn : null);

  const paragraphs = rawParagraphs
    ? rawParagraphs.map((p) => String(p).trim()).filter(Boolean)
    : typeof content === 'string'
      ? content.split('\n').map((p) => p.trim()).filter(Boolean)
      : [];

  const safeCtaUrl = sanitizeUrl(section.ctaUrl, '');
  const safeImageUrl = isSafeImageUrl(section.imageUrl) ? getAssetUrl(section.imageUrl) : '';

  return (
    <SectionWrapper
      id={section.id || 'custom-section'}
      alt={Boolean(section.alt)}
      className="custom-section"
    >
      <div className="section__header">
        <ThemeHeaderCrest sectionIndex={String(sectionIndex)} />
        {badge && (
          <span className="custom-section__badge font-serif">{badge}</span>
        )}
        {title && (
          <h2 className="section__title font-serif">{title}</h2>
        )}
        {subtitle && (
          <p className="section__subtitle">{subtitle}</p>
        )}
        <OrnamentDivider symbol={themeObj?.preview?.ornament || '✦'} />
      </div>

      <div className={`custom-section-card custom-section-card--${activeTheme}`}>
        {activeTheme !== 'default' && (
          <>
            <FloralCornerSVG className="custom-section-card__corner custom-section-card__corner--tl" />
            <FloralCornerSVG className="custom-section-card__corner custom-section-card__corner--br" />
          </>
        )}

        <div className="custom-section-card__inner">
          {safeImageUrl && (
            <div className="custom-section__image-wrap">
              <img
                src={safeImageUrl}
                alt={title || 'Event highlight'}
                className="custom-section__image"
                loading="lazy"
              />
            </div>
          )}

          {paragraphs.length > 0 && (
            <div className="custom-section__content">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="custom-section__paragraph font-serif">
                  {para}
                </p>
              ))}
            </div>
          )}

          {quote && (
            <blockquote className="custom-section__quote font-serif">
              “{quote}”
            </blockquote>
          )}

          {ctaText && safeCtaUrl && (
            <div className="custom-section__actions">
              <a
                href={safeCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-section__cta"
              >
                <span>{ctaText}</span>
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CustomSection;

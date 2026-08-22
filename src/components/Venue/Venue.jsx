import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation } from 'lucide-react';
import weddingConfig from '../../config/weddingConfig';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import './Venue.css';

const Venue = () => {
  const { t, i18n } = useTranslation();
  const { track } = useAnalytics();
  const isAr = i18n.language === 'ar';
  const { venue } = weddingConfig;

  const handleMapsClick = () => {
    track(EVENTS.VENUE_CLICKED);
    window.open(venue.mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const embedUrl = venue.mapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(venue.nameEn + ' ' + venue.cityEn)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <SectionWrapper id="venue">
      <div className="section__header">
        <h2 className="section__title font-serif">{t('venue.title')}</h2>
        <OrnamentDivider symbol="✦" />
      </div>

      <div className="venue-card">
        <div className="venue-card__content venue-info">
          {/* Location pin icon */}
          <div className="venue-card__pin" aria-hidden="true">
            <MapPin size={26} strokeWidth={1.5} />
          </div>

          {/* Venue name */}
          <h3 className="venue-card__name font-script">
            {isAr ? venue.nameAr : venue.nameEn}
          </h3>

          {/* Description */}
          {(venue.descriptionAr || venue.descriptionEn) && (
            <p className="venue-card__description font-serif">
              {isAr ? venue.descriptionAr : venue.descriptionEn}
            </p>
          )}

          <OrnamentDivider symbol="✦" className="venue-card__divider" />

          {/* Address */}
          <address className="venue-card__address">
            <p className="venue-card__street">
              {isAr ? venue.addressAr : venue.addressEn}
            </p>
            <p className="venue-card__city">
              {isAr ? venue.cityAr : venue.cityEn}
            </p>
          </address>

          {/* ── Interactive Map Frame Preview ── */}
          <div className="venue-card__map-wrap">
            <iframe
              title={isAr ? venue.nameAr : venue.nameEn}
              src={embedUrl}
              className="venue-card__map-iframe"
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
            />
            <button
              className="venue-card__map-overlay"
              onClick={handleMapsClick}
              aria-label={t('venue.getDirections')}
              title={isAr ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
            >
              <span>{isAr ? 'فتح الخريطة بالتفصيل ↗' : 'Open Full Map ↗'}</span>
            </button>
          </div>

          {/* CTA Button */}
          <button
            className="venue-card__cta"
            onClick={handleMapsClick}
            id="btn-venue-maps"
            aria-label={t('venue.getDirections')}
          >
            <Navigation size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>{t('venue.viewLocation')}</span>
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Venue;

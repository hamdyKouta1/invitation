/**
 * useAnalytics — Optional analytics event tracking (Phase 9A — ARC-007)
 *
 * Reads analytics configuration dynamically from getActiveConfig() and
 * lazily loads Google Analytics 4 (gtag.js) when enabled and configured.
 */

import { getActiveConfig } from '../utils/configManager';

let _gtagInitializedForId = null;

const ensureGtagLoaded = (measurementId) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!measurementId || _gtagInitializedForId === measurementId) return;

  _gtagInitializedForId = measurementId;
  if (!document.getElementById('ga4-gtag-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
};

export const EVENTS = {
  INVITATION_OPENED:  'invitation_opened',
  LANGUAGE_CHANGED:   'language_changed',
  VENUE_CLICKED:      'venue_clicked',
  GALLERY_OPENED:     'gallery_opened',
  WISHLIST_VIEWED:    'wishlist_viewed',
  RSVP_STARTED:       'rsvp_started',
  RSVP_SUBMITTED:     'rsvp_submitted',
  SHARE_CLICKED:      'share_clicked',
  MUSIC_TOGGLED:      'music_toggled',
  WISHLIST_RESERVED:  'wishlist_reserved',
};

const useAnalytics = () => {
  const track = (eventName, params = {}) => {
    const activeCfg = getActiveConfig();
    const analytics = activeCfg?.analytics;
    if (!analytics?.enabled) return;

    try {
      if (analytics.gaMeasurementId && analytics.gaMeasurementId !== 'G-XXXXXXXXXX') {
        ensureGtagLoaded(analytics.gaMeasurementId);
      }

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }

      if (import.meta.env.DEV) {
        console.info(`[Analytics] ${eventName}`, params);
      }
    } catch (err) {
      console.warn('[Analytics] Track failed:', err);
    }
  };

  return { track, EVENTS };
};

export default useAnalytics;

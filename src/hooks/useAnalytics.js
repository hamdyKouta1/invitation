/**
 * useAnalytics — Optional analytics event tracking
 *
 * Events are only fired when analytics is enabled in weddingConfig.
 * Safe to call even when disabled.
 */

import weddingConfig from '../config/weddingConfig';

const ENABLED = weddingConfig.analytics?.enabled === true;

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
    if (!ENABLED) return;

    try {
      // Google Analytics 4 (if gtag is loaded)
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }

      // Console logging in development
      if (import.meta.env.DEV) {
        console.info(`[Analytics] ${eventName}`, params);
      }
    } catch (err) {
      // Analytics should never break the app
      console.warn('[Analytics] Track failed:', err);
    }
  };

  return { track, EVENTS };
};

export default useAnalytics;

import React from 'react';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';

/**
 * OrnamentDivider — Theme-aware decorative section divider.
 * - 'default': Original gold line with center symbol (100% preserved)
 * - 'elegant-luxury': Art-Deco faceted gold diamond & starburst filigree SVG
 * - 'minimalist-modern': Architectural hairline with geometric circle & crosshair
 * - 'romantic-floral': Botanical rosebud, heart & eucalyptus leaf vine SVG
 * - 'royal-classic': Imperial Fleur-de-lis, baroque scroll & ruby jewel SVG
 */
const OrnamentDivider = ({ symbol = '✦', className = '', themeOverride = null }) => {
  const config = useWeddingConfig();
  const activeTheme = themeOverride || config?.theme || 'default';

  if (activeTheme === 'elegant-luxury') {
    return (
      <div className={`ornament-divider ornament-divider--elegant-luxury ${className}`} aria-hidden="true">
        <span className="ornament-divider__line" />
        <svg width="96" height="26" viewBox="0 0 96 26" fill="none" className="ornament-divider__svg">
          <line x1="2" y1="13" x2="26" y2="13" stroke="#D4AF37" strokeWidth="1.2" />
          <line x1="70" y1="13" x2="94" y2="13" stroke="#D4AF37" strokeWidth="1.2" />
          <polygon points="32,13 38,8 44,13 38,18" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
          <polygon points="48,2 56,13 48,24 40,13" fill="#D4AF37" />
          <polygon points="48,6 52,13 48,20 44,13" fill="#FFF3C4" />
          <polygon points="52,13 58,8 64,13 58,18" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
          <circle cx="24" cy="13" r="2" fill="#F3E5AB" />
          <circle cx="72" cy="13" r="2" fill="#F3E5AB" />
        </svg>
        <span className="ornament-divider__line" />
      </div>
    );
  }

  if (activeTheme === 'minimalist-modern') {
    return (
      <div className={`ornament-divider ornament-divider--minimalist-modern ${className}`} aria-hidden="true">
        <span className="ornament-divider__line" />
        <svg width="72" height="18" viewBox="0 0 72 18" fill="none" className="ornament-divider__svg">
          <line x1="0" y1="9" x2="27" y2="9" stroke="#181818" strokeWidth="1.2" />
          <circle cx="36" cy="9" r="5.5" stroke="#181818" strokeWidth="1.2" />
          <circle cx="36" cy="9" r="1.8" fill="#6B705C" />
          <line x1="45" y1="9" x2="72" y2="9" stroke="#181818" strokeWidth="1.2" />
        </svg>
        <span className="ornament-divider__line" />
      </div>
    );
  }

  if (activeTheme === 'romantic-floral') {
    return (
      <div className={`ornament-divider ornament-divider--romantic-floral ${className}`} aria-hidden="true">
        <span className="ornament-divider__line" />
        <svg width="110" height="28" viewBox="0 0 110 28" fill="none" className="ornament-divider__svg">
          {/* Eucalyptus Leaves Left & Right */}
          <path d="M10 14 Q32 8 46 14" stroke="#7A9A8B" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M100 14 Q78 8 64 14" stroke="#7A9A8B" strokeWidth="1.4" strokeLinecap="round" />
          <ellipse cx="26" cy="10" rx="8" ry="3.5" transform="rotate(-20 26 10)" fill="#7A9A8B" opacity="0.75" />
          <ellipse cx="36" cy="17" rx="7" ry="3" transform="rotate(18 36 17)" fill="#8FB0A0" opacity="0.75" />
          <ellipse cx="84" cy="10" rx="8" ry="3.5" transform="rotate(20 84 10)" fill="#7A9A8B" opacity="0.75" />
          <ellipse cx="74" cy="17" rx="7" ry="3" transform="rotate(-18 74 17)" fill="#8FB0A0" opacity="0.75" />
          {/* Center Peony Rose Bloom */}
          <circle cx="55" cy="14" r="9.5" fill="#F4DCE0" />
          <circle cx="55" cy="14" r="6.5" fill="#E39AA8" />
          <circle cx="55" cy="14" r="3.5" fill="#C86D7E" />
        </svg>
        <span className="ornament-divider__line" />
      </div>
    );
  }

  if (activeTheme === 'royal-classic') {
    return (
      <div className={`ornament-divider ornament-divider--royal-classic ${className}`} aria-hidden="true">
        <span className="ornament-divider__line" />
        <svg width="108" height="28" viewBox="0 0 108 28" fill="none" className="ornament-divider__svg">
          {/* Baroque Scrollwork */}
          <path d="M8 14 C18 6 28 22 38 14" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M100 14 C90 6 80 22 70 14" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" />
          {/* Center Royal Crown & Ruby Emblem */}
          <polygon points="43,16 47,7 51,12 54,4 57,12 61,7 65,16" fill="#D4AF37" />
          <polygon points="54,14 59,19 54,24 49,19" fill="#721121" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="38" cy="14" r="2.5" fill="#D4AF37" />
          <circle cx="70" cy="14" r="2.5" fill="#D4AF37" />
        </svg>
        <span className="ornament-divider__line" />
      </div>
    );
  }

  // ─── DEFAULT THEME (100% Untouched) ───
  return (
    <div className={`ornament-divider ${className}`} aria-hidden="true">
      <span className="ornament-divider__line" />
      <span className="ornament-divider__center">{symbol}</span>
      <span className="ornament-divider__line" />
    </div>
  );
};

export default OrnamentDivider;

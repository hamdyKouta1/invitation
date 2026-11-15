import React from 'react';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';

/**
 * FloralCornerSVG — Theme-aware corner illustration & ornamental frame asset.
 * - 'default': Original watercolor-style botanical corner decoration (100% preserved)
 * - 'elegant-luxury': Art-Deco 24k Gold Sunburst & Filigree Fan Corner
 * - 'minimalist-modern': Architectural Fine-Line Crosshair & Olive Sprig Corner
 * - 'romantic-floral': Lush Blooming Peony, Rose & Eucalyptus Garland Corner
 * - 'royal-classic': Imperial Baroque Acanthus Scrollwork & Ruby Corner
 */
const FloralCornerSVG = ({ className = '', style = {}, themeOverride = null }) => {
  const config = useWeddingConfig();
  const activeTheme = themeOverride || config?.theme || 'default';

  if (activeTheme === 'elegant-luxury') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className={`${className} corner-svg corner-svg--elegant-luxury`}
        style={style}
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <linearGradient id="elCornerGold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A741C" />
          </linearGradient>
        </defs>
        {/* Outer Double Art-Deco L-Bracket */}
        <path d="M12 188 V28 L28 12 H188" stroke="url(#elCornerGold)" strokeWidth="2.2" />
        <path d="M22 188 V36 L36 22 H188" stroke="url(#elCornerGold)" strokeWidth="1" opacity="0.75" />
        {/* Sunburst Fan Rays from Bottom-Left Corner */}
        <path d="M12 188 L135 65" stroke="url(#elCornerGold)" strokeWidth="1.4" opacity="0.85" />
        <path d="M12 188 L155 105" stroke="url(#elCornerGold)" strokeWidth="1" opacity="0.65" />
        <path d="M12 188 L95 45" stroke="url(#elCornerGold)" strokeWidth="1" opacity="0.65" />
        {/* Geometric Stepped Chevron & Diamonds */}
        <polygon points="12,188 58,188 58,142 12,142" stroke="url(#elCornerGold)" strokeWidth="1.2" fill="rgba(212,175,55,0.08)" />
        <polygon points="75,125 86,114 75,103 64,114" fill="url(#elCornerGold)" />
        <polygon points="110,90 117,83 110,76 103,83" fill="#FFF3C4" opacity="0.85" />
        <circle cx="42" cy="158" r="4" fill="#FFF3C4" />
      </svg>
    );
  }

  if (activeTheme === 'minimalist-modern') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className={`${className} corner-svg corner-svg--minimalist-modern`}
        style={style}
        aria-hidden="true"
        fill="none"
      >
        {/* Architectural Hairline Registration Crosshairs */}
        <line x1="8" y1="168" x2="145" y2="168" stroke="#181818" strokeWidth="1.2" />
        <line x1="32" y1="55" x2="32" y2="192" stroke="#181818" strokeWidth="1.2" />
        <circle cx="32" cy="168" r="9" stroke="#181818" strokeWidth="1" />
        <circle cx="32" cy="168" r="2.5" fill="#181818" />
        {/* Minimalist Single-Line Olive Cypress Sprig */}
        <path d="M32 168 Q68 128 118 82" stroke="#6B705C" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="64" cy="132" rx="13" ry="4.5" transform="rotate(-42 64 132)" fill="#6B705C" opacity="0.75" />
        <ellipse cx="88" cy="108" rx="12" ry="4" transform="rotate(-42 88 108)" fill="#6B705C" opacity="0.6" />
        <ellipse cx="78" cy="126" rx="11" ry="4" transform="rotate(12 78 126)" fill="#A5A58D" opacity="0.7" />
      </svg>
    );
  }

  if (activeTheme === 'romantic-floral') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className={`${className} corner-svg corner-svg--romantic-floral`}
        style={style}
        aria-hidden="true"
        fill="none"
      >
        {/* Trailing Eucalyptus & Rose Vines */}
        <path d="M12 188 Q52 125 148 52" stroke="#7A9A8B" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 188 Q85 152 162 98" stroke="#7A9A8B" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
        {/* Eucalyptus Silver-Sage Leaves */}
        <ellipse cx="52" cy="148" rx="18" ry="8" transform="rotate(-35 52 148)" fill="#7A9A8B" opacity="0.65" />
        <ellipse cx="92" cy="112" rx="16" ry="7" transform="rotate(-45 92 112)" fill="#8FB0A0" opacity="0.65" />
        <ellipse cx="122" cy="82" rx="14" ry="6" transform="rotate(-38 122 82)" fill="#7A9A8B" opacity="0.55" />
        <ellipse cx="78" cy="152" rx="15" ry="6.5" transform="rotate(-12 78 152)" fill="#9AB8A9" opacity="0.6" />
        {/* Layered Blush Peony Bloom */}
        <circle cx="38" cy="162" r="24" fill="#F4DCE0" />
        <circle cx="38" cy="162" r="17" fill="#E8B2BE" />
        <circle cx="38" cy="162" r="10" fill="#C86D7E" opacity="0.85" />
        {/* Secondary Garden Rose */}
        <circle cx="76" cy="132" r="16" fill="#FADCE2" />
        <circle cx="76" cy="132" r="10" fill="#DF8E9D" />
        <circle cx="76" cy="132" r="5" fill="#C86D7E" />
        {/* Delicate Rosebuds & Floating Petals */}
        <ellipse cx="115" cy="95" rx="7" ry="10" transform="rotate(-30 115 95)" fill="#E8B2BE" />
        <ellipse cx="138" cy="65" rx="5" ry="8" transform="rotate(-40 138 65)" fill="#F4DCE0" />
        <path d="M102 68 C102 63 109 63 109 68 C109 63 116 63 116 68 C116 74 109 79 109 79 C109 79 102 74 102 68 Z" fill="#C86D7E" opacity="0.55" />
      </svg>
    );
  }

  if (activeTheme === 'royal-classic') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className={`${className} corner-svg corner-svg--royal-classic`}
        style={style}
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <linearGradient id="rcCornerGold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF0B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8F6B14" />
          </linearGradient>
        </defs>
        {/* Baroque Palace Filigree Scrollwork */}
        <path
          d="M14 186 V60 C14 32 32 14 60 14 H186"
          stroke="url(#rcCornerGold)"
          strokeWidth="2.8"
        />
        <path
          d="M24 186 V68 C24 44 44 24 68 24 H186"
          stroke="url(#rcCornerGold)"
          strokeWidth="1.2"
          strokeDasharray="6 3"
        />
        {/* Acanthus Curls */}
        <path
          d="M24 140 C55 140 65 110 45 95 C30 85 28 105 42 108"
          stroke="url(#rcCornerGold)"
          strokeWidth="2"
           strokeLinecap="round"
        />
        <path
          d="M140 24 C140 55 110 65 95 45 C85 30 105 28 108 42"
          stroke="url(#rcCornerGold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Royal Ruby Cabochon Jewel in Corner Medallion */}
        <circle cx="42" cy="158" r="14" fill="#072A20" stroke="url(#rcCornerGold)" strokeWidth="2" />
        <polygon points="42,148 50,158 42,168 34,158" fill="#721121" stroke="url(#rcCornerGold)" strokeWidth="1" />
        <circle cx="72" cy="128" r="4" fill="url(#rcCornerGold)" />
      </svg>
    );
  }

  // ─── DEFAULT THEME (Original Watercolor Botanical Corner — 100% Untouched) ───
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
    >
      {/* Stem lines */}
      <path d="M10 190 Q60 140 120 80" stroke="#8B9E7A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M10 190 Q50 120 90 60" stroke="#8B9E7A" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>

      {/* Large rose - bottom left */}
      <circle cx="30" cy="168" r="18" fill="#D4A5A5" opacity="0.6"/>
      <circle cx="30" cy="168" r="12" fill="#C08080" opacity="0.5"/>
      <circle cx="30" cy="168" r="7" fill="#A06060" opacity="0.4"/>

      {/* Medium rose */}
      <circle cx="65" cy="145" r="12" fill="#F0E0D0" opacity="0.7"/>
      <circle cx="65" cy="145" r="8" fill="#D4A5A5" opacity="0.5"/>
      <circle cx="65" cy="145" r="4" fill="#C08080" opacity="0.4"/>

      {/* Gold accent dots */}
      <circle cx="90" cy="120" r="3" fill="#C9A96E" opacity="0.6"/>
      <circle cx="105" cy="100" r="2.5" fill="#D4AF37" opacity="0.5"/>
      <circle cx="120" cy="82" r="2" fill="#C9A96E" opacity="0.5"/>
      <circle cx="78" cy="132" r="2" fill="#D4AF37" opacity="0.4"/>

      {/* Leaves */}
      <ellipse cx="50" cy="155" rx="16" ry="8" transform="rotate(-30 50 155)" fill="#8B9E7A" opacity="0.5"/>
      <ellipse cx="75" cy="130" rx="14" ry="6" transform="rotate(-45 75 130)" fill="#6B7E5A" opacity="0.45"/>
      <ellipse cx="100" cy="108" rx="12" ry="5" transform="rotate(-55 100 108)" fill="#8B9E7A" opacity="0.4"/>
      <ellipse cx="42" cy="145" rx="10" ry="4" transform="rotate(-10 42 145)" fill="#A8BE9A" opacity="0.4"/>

      {/* Small buds */}
      <ellipse cx="118" cy="75" rx="5" ry="8" fill="#D4A5A5" opacity="0.4"/>
      <ellipse cx="128" cy="65" rx="4" ry="6" fill="#EDCFCF" opacity="0.5"/>
      <ellipse cx="108" cy="88" rx="4" ry="7" fill="#D4A5A5" opacity="0.35"/>

      {/* Baby's breath dots */}
      <circle cx="95" cy="92" r="2.5" fill="white" opacity="0.8"/>
      <circle cx="100" cy="85" r="2" fill="white" opacity="0.7"/>
      <circle cx="88" cy="100" r="2" fill="white" opacity="0.7"/>
      <circle cx="110" cy="78" r="2.5" fill="white" opacity="0.8"/>
      <circle cx="82" cy="115" r="2" fill="white" opacity="0.6"/>
    </svg>
  );
};

export default FloralCornerSVG;

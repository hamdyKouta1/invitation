import React from 'react';

/**
 * FloralCornerSVG — Watercolor-style botanical corner decoration
 * Inline SVG for performance (no image load)
 */
const FloralCornerSVG = ({ className = '', style = {} }) => (
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

export default FloralCornerSVG;

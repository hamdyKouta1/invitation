import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import {
  WEDDING_THEMES,
  getThemeById,
  setTemporaryThemePreview,
  clearTemporaryThemePreview,
  applyThemeToDOM,
} from '../../config/themesConfig';
import { getActiveConfig, saveActiveConfig, clone } from '../../utils/configManager';
import { saveWeddingConfigToDB } from '../../services';

/**
 * 1. ThemeSealIcon — Theme-specific Envelope Wax Seal / Clasp Emblem
 */
export const ThemeSealIcon = ({ themeOverride = null }) => {
  const config = useWeddingConfig();
  const activeTheme = themeOverride || config?.theme || 'default';

  if (activeTheme === 'elegant-luxury') {
    return (
      <svg width="30" height="30" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <polygon points="18,2 34,18 18,34 2,18" stroke="#0F0D0B" strokeWidth="1.5" fill="rgba(15,13,11,0.18)" />
        <polygon points="18,7 29,18 18,29 7,18" stroke="#0F0D0B" strokeWidth="1.2" fill="none" />
        <polygon points="18,11 21,18 18,25 15,18" fill="#0F0D0B" />
        <polygon points="11,18 18,15 25,18 18,21" fill="#0F0D0B" />
      </svg>
    );
  }

  if (activeTheme === 'minimalist-modern') {
    return (
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="24" height="24" stroke="#FAF9F6" strokeWidth="1.5" />
        <line x1="4" y1="16" x2="28" y2="16" stroke="#FAF9F6" strokeWidth="1" />
        <line x1="16" y1="4" x2="16" y2="28" stroke="#FAF9F6" strokeWidth="1" />
        <circle cx="16" cy="16" r="4" fill="#FAF9F6" />
      </svg>
    );
  }

  if (activeTheme === 'romantic-floral') {
    return (
      <svg width="30" height="30" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        {/* Embossed Peony Blossom Seal */}
        <circle cx="18" cy="18" r="14" stroke="rgba(255,249,250,0.65)" strokeWidth="1.2" strokeDasharray="3 2" />
        <circle cx="18" cy="12" r="5" fill="rgba(255,249,250,0.85)" />
        <circle cx="24" cy="16" r="5" fill="rgba(255,249,250,0.8)" />
        <circle cx="22" cy="23" r="5" fill="rgba(255,249,250,0.85)" />
        <circle cx="14" cy="23" r="5" fill="rgba(255,249,250,0.8)" />
        <circle cx="12" cy="16" r="5" fill="rgba(255,249,250,0.85)" />
        <circle cx="18" cy="18" r="4" fill="#C86D7E" stroke="#FFF9FA" strokeWidth="1.2" />
      </svg>
    );
  }

  if (activeTheme === 'royal-classic') {
    return (
      <svg width="30" height="30" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        {/* Imperial Royal Crown Emblem */}
        <circle cx="18" cy="18" r="15" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="3 2" />
        <polygon
          points="8,23 10,12 14,17 18,9 22,17 26,12 28,23"
          fill="#F9F4E8"
          stroke="#D4AF37"
          strokeWidth="1.2"
        />
        <rect x="8" y="24" width="20" height="3.5" rx="1.5" fill="#D4AF37" />
        <circle cx="18" cy="7" r="2" fill="#D4AF37" />
      </svg>
    );
  }

  // ─── DEFAULT THEME (Original HeartSVG — 100% Untouched) ───
  return (
    <svg
      width="24"
      height="22"
      viewBox="0 0 28 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 24S2 16 2 8.5A6.5 6.5 0 0 1 14 5.2 6.5 6.5 0 0 1 26 8.5C26 16 14 24 14 24Z"
        fill="#FDFAF6"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
      />
    </svg>
  );
};

/**
 * 2. ThemeHeaderCrest — Theme-specific decorative header emblem / editorial marker
 */
export const ThemeHeaderCrest = ({ sectionIndex = '01', themeOverride = null }) => {
  const config = useWeddingConfig();
  const activeTheme = themeOverride || config?.theme || 'default';

  if (activeTheme === 'default') return null;

  if (activeTheme === 'elegant-luxury') {
    return (
      <div className="theme-crest theme-crest--elegant-luxury" aria-hidden="true">
        <svg width="120" height="44" viewBox="0 0 120 44" fill="none">
          <line x1="60" y1="38" x2="60" y2="4" stroke="#D4AF37" strokeWidth="1.5" />
          <line x1="60" y1="38" x2="34" y2="10" stroke="#D4AF37" strokeWidth="1.2" opacity="0.8" />
          <line x1="60" y1="38" x2="86" y2="10" stroke="#D4AF37" strokeWidth="1.2" opacity="0.8" />
          <line x1="60" y1="38" x2="14" y2="24" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="38" x2="106" y2="24" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
          <polygon points="60,12 67,25 60,38 53,25" fill="#D4AF37" />
          <polygon points="60,16 64,25 60,34 56,25" fill="#FFF3C4" />
          <circle cx="34" cy="10" r="2.5" fill="#FFF3C4" />
          <circle cx="86" cy="10" r="2.5" fill="#FFF3C4" />
        </svg>
      </div>
    );
  }

  if (activeTheme === 'minimalist-modern') {
    return (
      <div className="theme-crest theme-crest--minimalist-modern" aria-hidden="true">
        <span className="theme-crest__editorial-num">NO. {sectionIndex}</span>
        <span className="theme-crest__editorial-rule" />
      </div>
    );
  }

  if (activeTheme === 'romantic-floral') {
    return (
      <div className="theme-crest theme-crest--romantic-floral" aria-hidden="true">
        <svg width="130" height="42" viewBox="0 0 130 42" fill="none">
          <path d="M12 32 Q65 6 118 32" stroke="#7A9A8B" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="36" cy="22" rx="10" ry="4" transform="rotate(-22 36 22)" fill="#7A9A8B" opacity="0.7" />
          <ellipse cx="94" cy="22" rx="10" ry="4" transform="rotate(22 94 22)" fill="#7A9A8B" opacity="0.7" />
          <circle cx="65" cy="19" r="12" fill="#F4DCE0" />
          <circle cx="65" cy="19" r="8" fill="#E39AA8" />
          <circle cx="65" cy="19" r="4.5" fill="#C86D7E" />
          <circle cx="48" cy="22" r="7" fill="#FADCE2" />
          <circle cx="82" cy="22" r="7" fill="#FADCE2" />
        </svg>
      </div>
    );
  }

  if (activeTheme === 'royal-classic') {
    return (
      <div className="theme-crest theme-crest--royal-classic" aria-hidden="true">
        <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
          <path d="M16 38 C32 38 38 22 46 28" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M104 38 C88 38 82 22 74 28" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
          <polygon
            points="42,30 46,14 53,22 60,8 67,22 74,14 78,30"
            fill="#D4AF37"
            stroke="#721121"
            strokeWidth="1.2"
          />
          <rect x="42" y="31" width="36" height="5" rx="2" fill="#721121" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="60" cy="5" r="3" fill="#FFF0B8" />
          <circle cx="46" cy="11" r="2.2" fill="#721121" />
          <circle cx="74" cy="11" r="2.2" fill="#721121" />
        </svg>
      </div>
    );
  }

  return null;
};

/**
 * 3. ThemeAmbientEffects — Live background animations tailored per theme
 *    Respects prefers-reduced-motion accessibility preference.
 */
export const ThemeAmbientEffects = () => {
  const config = useWeddingConfig();
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeTheme = config?.theme || 'default';

  if (activeTheme === 'default' || prefersReducedMotion) return null;

  if (activeTheme === 'elegant-luxury') {
    const particles = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 19 + 7) % 96}%`,
      delay: `${(i * 0.7) % 8}s`,
      duration: `${7 + (i % 5) * 2}s`,
      size: `${3 + (i % 4) * 2}px`,
    }));

    return (
      <div className="theme-ambient theme-ambient--elegant-luxury" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="theme-ambient__stardust"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    );
  }

  if (activeTheme === 'minimalist-modern') {
    return (
      <div className="theme-ambient theme-ambient--minimalist-modern" aria-hidden="true">
        <div className="theme-ambient__arch-grid-line theme-ambient__arch-grid-line--left" />
        <div className="theme-ambient__arch-grid-line theme-ambient__arch-grid-line--right" />
        <span className="theme-ambient__editorial-side-text">
          THE WEDDING EDITION • ARCHITECTURAL SERIES MMXXVI
        </span>
      </div>
    );
  }

  if (activeTheme === 'romantic-floral') {
    const petals = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${(i * 17 + 5) % 95}%`,
      delay: `${(i * 0.9) % 10}s`,
      duration: `${10 + (i % 5) * 2.5}s`,
      scale: 0.7 + (i % 4) * 0.18,
      isLeaf: i % 4 === 3,
    }));

    return (
      <div className="theme-ambient theme-ambient--romantic-floral" aria-hidden="true">
        {petals.map((p) => (
          <span
            key={p.id}
            className={`theme-ambient__petal ${p.isLeaf ? 'theme-ambient__petal--leaf' : ''}`}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              transform: `scale(${p.scale})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (activeTheme === 'royal-classic') {
    const lanterns = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i * 23 + 9) % 94}%`,
      delay: `${(i * 0.85) % 7}s`,
      duration: `${8 + (i % 4) * 2}s`,
    }));

    return (
      <div className="theme-ambient theme-ambient--royal-classic" aria-hidden="true">
        {lanterns.map((l) => (
          <span
            key={l.id}
            className="theme-ambient__lantern-orb"
            style={{
              left: l.left,
              animationDelay: l.delay,
              animationDuration: l.duration,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

/**
 * 4. ThemePreviewBanner — Floating control bar when Admin is previewing a theme
 *    on the live invitation before committing changes.
 */
export const ThemePreviewBanner = ({ onReopenAdmin }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const config = useWeddingConfig();

  if (!config?.isPreviewMode) return null;

  const currentTheme = getThemeById(config.theme);
  const savedTheme = getThemeById(config.savedTheme || 'default');
  const firebaseEnabled = import.meta?.env?.VITE_FIREBASE_ENABLED === 'true';

  const handleApplyAndSave = async () => {
    const activeCfg = getActiveConfig();
    const updated = {
      ...clone(activeCfg),
      theme: currentTheme.id,
    };
    clearTemporaryThemePreview(currentTheme.id);
    saveActiveConfig(updated);
    applyThemeToDOM(currentTheme.id);
    if (firebaseEnabled) {
      try {
        await saveWeddingConfigToDB(updated);
      } catch (e) {
        console.warn('[ThemePreviewBanner] Failed cloud save:', e);
      }
    }
  };

  const handleExitPreview = () => {
    clearTemporaryThemePreview(savedTheme.id);
  };

  return (
    <div className="theme-live-preview-banner" role="region" aria-label="Theme preview controls">
      <div className="theme-live-preview-banner__info">
        <span className="theme-live-preview-banner__badge">
          {isAr ? '👁️ وضع المعاينة المؤقتة' : '👁️ Live Preview Mode'}
        </span>
        <strong className="theme-live-preview-banner__name">
          {isAr ? currentTheme.nameAr : currentTheme.nameEn}
        </strong>
      </div>

      {/* Quick Theme Switcher Pills */}
      <div className="theme-live-preview-banner__switcher">
        {WEDDING_THEMES.map((tItem) => (
          <button
            key={tItem.id}
            type="button"
            onClick={() => setTemporaryThemePreview(tItem.id)}
            className={`theme-live-preview-banner__pill ${
              tItem.id === currentTheme.id ? 'theme-live-preview-banner__pill--active' : ''
            }`}
          >
            <span
              className="theme-live-preview-banner__dot"
              style={{ background: tItem.preview.accent }}
            />
            <span>{tItem.nameAr.split(' (')[0]}</span>
          </button>
        ))}
      </div>

      <div className="theme-live-preview-banner__actions">
        <button
          type="button"
          onClick={handleApplyAndSave}
          className="theme-live-preview-banner__btn theme-live-preview-banner__btn--apply"
        >
          {isAr ? '✓ اعتماد وحفظ هذا التصميم' : '✓ Apply & Save Theme'}
        </button>
        {onReopenAdmin && (
          <button
            type="button"
            onClick={onReopenAdmin}
            className="theme-live-preview-banner__btn theme-live-preview-banner__btn--admin"
          >
            {isAr ? 'العودة للوحة الإدارة' : 'Back to Admin'}
          </button>
        )}
        <button
          type="button"
          onClick={handleExitPreview}
          className="theme-live-preview-banner__btn theme-live-preview-banner__btn--cancel"
        >
          {isAr ? '✕ إلغاء المعاينة' : '✕ Exit Preview'}
        </button>
      </div>
    </div>
  );
};

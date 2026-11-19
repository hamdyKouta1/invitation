import React, { useState } from 'react';
import {
  Palette,
  Eye,
  Check,
  Sparkles,
  RotateCcw,
  X,
  Type,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  Wand2,
  LayoutGrid,
  ExternalLink,
} from 'lucide-react';
import {
  WEDDING_THEMES,
  DEFAULT_THEME_ID,
  getThemeById,
  setTemporaryThemePreview,
  clearTemporaryThemePreview,
} from '../../config/themesConfig';
import { getAssetUrl } from '../../utils/assetUtils';
import FloralCornerSVG from '../ui/FloralCornerSVG';
import OrnamentDivider from '../ui/OrnamentDivider';
import { ThemeHeaderCrest, ThemeSealIcon } from '../ui/ThemeVisuals';
import './ThemeManager.css';

const ThemeManager = ({
  activeThemeId = DEFAULT_THEME_ID,
  configData = {},
  saving = false,
  onSelectTheme,
  onApplyAndSaveTheme,
  onCloseAdmin,
}) => {
  const [previewTheme, setPreviewTheme] = useState(null);
  const [previewTab, setPreviewTab] = useState('hero'); // 'hero' | 'envelope' | 'gallery' | 'specs'

  const groomAr = configData?.groom?.name || 'حمـدى';
  const brideAr = configData?.bride?.name || 'رودينـا';
  const groomEn = configData?.groom?.nameEn || 'Hamdy';
  const brideEn = configData?.bride?.nameEn || 'Rodina';
  const dateAr = configData?.wedding?.dateDisplay || '٢١ أغسطس ٢٠٢٦';
  const venueAr = configData?.venue?.nameAr || 'قاعة اللؤلؤة ببورسعيد';

  const currentActiveTheme = getThemeById(activeThemeId);

  const handleApplyTheme = (themeId) => {
    clearTemporaryThemePreview(themeId);
    if (onSelectTheme) {
      onSelectTheme(themeId);
    }
    if (onApplyAndSaveTheme) {
      onApplyAndSaveTheme(themeId);
    }
  };

  const handleRestoreDefault = () => {
    handleApplyTheme(DEFAULT_THEME_ID);
  };

  const handleLiveSitePreview = (themeId) => {
    setTemporaryThemePreview(themeId);
    setPreviewTheme(null);
    if (onCloseAdmin) {
      onCloseAdmin();
    }
  };

  const getHeroImgSrc = (theme) => getAssetUrl(theme?.assets?.heroImage || '/couple-illustration.png');
  const getHeroFallbackSrc = (theme) =>
    theme?.assets?.heroFallbackSvg
      ? getAssetUrl(theme.assets.heroFallbackSvg)
      : getAssetUrl('/couple-illustration.png');

  return (
    <div className="theme-manager">
      {/* ─── Active Theme Status Banner ─── */}
      <div className="theme-manager__status-bar">
        <div className="theme-manager__status-info">
          <div className="theme-manager__status-thumb-wrap">
            <img
              src={getHeroImgSrc(currentActiveTheme)}
              onError={(e) => {
                e.currentTarget.src = getHeroFallbackSrc(currentActiveTheme);
              }}
              alt={currentActiveTheme.nameAr}
              className="theme-manager__status-thumb"
            />
          </div>
          <div>
            <span className="theme-manager__status-label">
              التصميم المفعّل حالياً على الموقع (Currently Active Theme):
            </span>
            <div className="theme-manager__status-title-row">
              <strong className="theme-manager__status-name">{currentActiveTheme.nameAr}</strong>
              <span className="theme-manager__badge theme-manager__badge--active">
                <CheckCircle2 size={13} /> نشط ومفعّل
              </span>
              {currentActiveTheme.isDefault && (
                <span className="theme-manager__badge theme-manager__badge--default">
                  التصميم الأصلي الافتراضي
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="theme-manager__status-actions">
          <div className="theme-manager__active-swatches" title="لوحة ألوان التصميم الحالي">
            {currentActiveTheme.palette.map((swatch, idx) => (
              <span
                key={idx}
                className="theme-manager__mini-swatch"
                style={{ backgroundColor: swatch.hex }}
                title={`${swatch.nameAr} (${swatch.hex})`}
              />
            ))}
          </div>

          {activeThemeId !== DEFAULT_THEME_ID && (
            <button
              type="button"
              onClick={handleRestoreDefault}
              disabled={saving}
              className="theme-manager__restore-btn"
              title="العودة إلى التصميم الأصلي للدعوة"
            >
              <RotateCcw size={15} />
              <span>استعادة التصميم الأصلي (Default)</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Themes Grid (5 Complete Visual Themes) ─── */}
      <div className="theme-manager__grid">
        {WEDDING_THEMES.map((theme) => {
          const isCurrentActive = activeThemeId === theme.id;
          const p = theme.preview;

          return (
            <div
              key={theme.id}
              className={`theme-card ${isCurrentActive ? 'theme-card--active' : ''}`}
            >
              {/* ── Visual Mockup Stage with Actual Hero Artwork & Ornaments ── */}
              <div
                className={`theme-card__stage theme-card__stage--${theme.id}`}
                style={{ background: p.bgGradient }}
                onClick={() => {
                  setPreviewTheme(theme);
                  setPreviewTab('hero');
                }}
                role="button"
                tabIndex={0}
                aria-label={`معاينة تصميم ${theme.nameAr}`}
                onKeyDown={(e) => e.key === 'Enter' && setPreviewTheme(theme)}
              >
                {/* Top Status Badges */}
                <div className="theme-card__badges">
                  {theme.isDefault ? (
                    <span className="theme-card__pill theme-card__pill--original">
                      ★ التصميم الأصلي (Default)
                    </span>
                  ) : (
                    <span className="theme-card__pill theme-card__pill--category">
                      {theme.categoryAr}
                    </span>
                  )}

                  {isCurrentActive && (
                    <span className="theme-card__pill theme-card__pill--active">
                      <Check size={12} /> مفعّل حالياً
                    </span>
                  )}
                </div>

                {/* Theme-Specific Corner Ornaments inside Stage */}
                <FloralCornerSVG
                  themeOverride={theme.id}
                  className="theme-card__corner theme-card__corner--tl"
                />
                <FloralCornerSVG
                  themeOverride={theme.id}
                  className="theme-card__corner theme-card__corner--br"
                />

                {/* Miniature Invitation Card with Actual Theme Hero Image */}
                <div
                  className={`theme-card__mini-invite theme-card__mini-invite--${theme.layout?.heroVariant || 'classic-arch'}`}
                  style={{
                    background: p.cardBg,
                    border: p.cardBorder,
                    borderRadius: p.cardRadius,
                    color: p.textPrimary,
                  }}
                >
                  <div className="theme-card__mini-thumb-frame">
                    <img
                      src={getHeroImgSrc(theme)}
                      onError={(e) => {
                        e.currentTarget.src = getHeroFallbackSrc(theme);
                      }}
                      alt={theme.nameEn}
                      className="theme-card__mini-hero-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="theme-card__mini-meta">
                    <span
                      className="theme-card__mini-ornament"
                      style={{ color: p.accent }}
                    >
                      {p.ornament} {theme.layout?.heroLabelEn?.split(' ')[0]} {p.ornament}
                    </span>
                    <div
                      className="theme-card__mini-names"
                      style={{
                        color: p.textPrimary,
                        fontFamily: `'${theme.typography.displayAr}', serif`,
                      }}
                    >
                      {groomAr} <span style={{ color: p.accent }}>&amp;</span> {brideAr}
                    </div>
                    <div
                      className="theme-card__mini-date"
                      style={{ color: p.textSecondary }}
                    >
                      {dateAr}
                    </div>
                  </div>
                </div>

                {/* Quick Hover Overlay */}
                <div className="theme-card__stage-overlay">
                  <span className="theme-card__stage-preview-cta">
                    <Eye size={16} /> معاينة الهوية البصرية الكاملة
                  </span>
                </div>
              </div>

              {/* ── Card Details Body ── */}
              <div className="theme-card__body">
                <div className="theme-card__header">
                  <div>
                    <h4 className="theme-card__title">{theme.nameAr}</h4>
                    <span className="theme-card__subtitle">{theme.nameEn}</span>
                  </div>
                </div>

                <p className="theme-card__desc">{theme.descriptionAr}</p>

                {/* 4 Visual Identity Pillars (Images, Gallery, Icons, Motion) */}
                <div className="theme-card__pillars">
                  <div className="theme-card__pillar">
                    <ImageIcon size={13} className="theme-card__pillar-icon" />
                    <div>
                      <span className="theme-card__pillar-label">الصورة والإطار:</span>
                      <strong className="theme-card__pillar-val">{theme.assets?.imageFrameLabelAr}</strong>
                    </div>
                  </div>
                  <div className="theme-card__pillar">
                    <LayoutGrid size={13} className="theme-card__pillar-icon" />
                    <div>
                      <span className="theme-card__pillar-label">تخطيط المعرض:</span>
                      <strong className="theme-card__pillar-val">{theme.assets?.galleryLayoutLabelAr}</strong>
                    </div>
                  </div>
                  <div className="theme-card__pillar">
                    <Sparkles size={13} className="theme-card__pillar-icon" />
                    <div>
                      <span className="theme-card__pillar-label">الأيقونات والزخارف:</span>
                      <strong className="theme-card__pillar-val">{theme.icons?.labelAr}</strong>
                    </div>
                  </div>
                  <div className="theme-card__pillar">
                    <Wand2 size={13} className="theme-card__pillar-icon" />
                    <div>
                      <span className="theme-card__pillar-label">الحركات والمؤثرات:</span>
                      <strong className="theme-card__pillar-val">{theme.animations?.labelAr}</strong>
                    </div>
                  </div>
                </div>

                {/* Palette Swatches */}
                <div className="theme-card__meta-section">
                  <span className="theme-card__meta-label">
                    <Palette size={13} /> لوحة الألوان (Color Palette):
                  </span>
                  <div className="theme-card__swatches">
                    {theme.palette.map((sw, i) => (
                      <div key={i} className="theme-card__swatch-item" title={`${sw.nameAr} (${sw.hex})`}>
                        <span
                          className="theme-card__swatch-circle"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <span className="theme-card__swatch-name">{sw.nameAr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography Info */}
                <div className="theme-card__meta-section">
                  <span className="theme-card__meta-label">
                    <Type size={13} /> الخطوط (Typography):
                  </span>
                  <div className="theme-card__fonts-row">
                    <span className="theme-card__font-tag">{theme.typography.displayEn}</span>
                    <span className="theme-card__font-tag">{theme.typography.headingEn}</span>
                    <span className="theme-card__font-tag">{theme.typography.displayAr}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="theme-card__actions">
                  <button
                    type="button"
                    className="theme-card__btn theme-card__btn--preview"
                    onClick={() => {
                      setPreviewTheme(theme);
                      setPreviewTab('hero');
                    }}
                  >
                    <Eye size={15} />
                    <span>معاينة التفاصيل</span>
                  </button>

                  {onCloseAdmin && (
                    <button
                      type="button"
                      className="theme-card__btn theme-card__btn--live"
                      onClick={() => handleLiveSitePreview(theme.id)}
                      title="معاينة التصميم مباشرة على صفحات الموقع دون حفظه حتى تعتمد التغيير"
                    >
                      <ExternalLink size={14} />
                      <span>تجربة حية</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={saving || isCurrentActive}
                    className={`theme-card__btn ${
                      isCurrentActive ? 'theme-card__btn--applied' : 'theme-card__btn--apply'
                    }`}
                    onClick={() => handleApplyTheme(theme.id)}
                  >
                    {isCurrentActive ? (
                      <>
                        <Check size={15} />
                        <span>التصميم المفعّل</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>{saving ? 'جارٍ الحفظ...' : 'تفعيل وحفظ'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Interactive Full Visual System Preview Modal ─── */}
      {previewTheme && (
        <div
          className="theme-preview-modal-overlay"
          onClick={() => setPreviewTheme(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`معاينة تصميم ${previewTheme.nameAr}`}
        >
          <div
            className="theme-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="theme-preview-modal__header">
              <div className="theme-preview-modal__title-wrap">
                <Palette size={20} className="theme-preview-modal__icon" />
                <div>
                  <h3 className="theme-preview-modal__title">
                    معاينة الهوية البصرية الكاملة: {previewTheme.nameAr}
                  </h3>
                  <span className="theme-preview-modal__sub">{previewTheme.nameEn}</span>
                </div>
              </div>

              {/* 4-Tab Preview Switcher */}
              <div className="theme-preview-modal__mode-tabs">
                <button
                  type="button"
                  className={`theme-preview-modal__mode-btn ${
                    previewTab === 'hero' ? 'theme-preview-modal__mode-btn--active' : ''
                  }`}
                  onClick={() => setPreviewTab('hero')}
                >
                  <Layers size={14} />
                  <span>البطاقة والصورة (Hero)</span>
                </button>
                <button
                  type="button"
                  className={`theme-preview-modal__mode-btn ${
                    previewTab === 'envelope' ? 'theme-preview-modal__mode-btn--active' : ''
                  }`}
                  onClick={() => setPreviewTab('envelope')}
                >
                  <Sparkles size={14} />
                  <span>الظرف والختم (Envelope)</span>
                </button>
                <button
                  type="button"
                  className={`theme-preview-modal__mode-btn ${
                    previewTab === 'gallery' ? 'theme-preview-modal__mode-btn--active' : ''
                  }`}
                  onClick={() => setPreviewTab('gallery')}
                >
                  <LayoutGrid size={14} />
                  <span>المعرض والصور (Gallery)</span>
                </button>
                <button
                  type="button"
                  className={`theme-preview-modal__mode-btn ${
                    previewTab === 'specs' ? 'theme-preview-modal__mode-btn--active' : ''
                  }`}
                  onClick={() => setPreviewTab('specs')}
                >
                  <Wand2 size={14} />
                  <span>الأيقونات والخطوط والحركات</span>
                </button>
              </div>

              <button
                type="button"
                className="theme-preview-modal__close"
                onClick={() => setPreviewTheme(null)}
                aria-label="إغلاق المعاينة"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Live Stage */}
            <div
              className="theme-preview-modal__viewport"
              style={{ background: previewTheme.preview.bgGradient }}
            >
              {/* Corner Ornaments in Viewport */}
              <FloralCornerSVG
                themeOverride={previewTheme.id}
                className="theme-preview-viewport__corner theme-preview-viewport__corner--tl"
              />
              <FloralCornerSVG
                themeOverride={previewTheme.id}
                className="theme-preview-viewport__corner theme-preview-viewport__corner--br"
              />

              {/* TAB 1: HERO & IMAGE FRAME PREVIEW */}
              {previewTab === 'hero' && (
                <div
                  className="theme-preview-invite-card"
                  style={{
                    background: previewTheme.preview.cardBg,
                    border: previewTheme.preview.cardBorder,
                    borderRadius: previewTheme.preview.cardRadius,
                    color: previewTheme.preview.textPrimary,
                  }}
                >
                  <ThemeHeaderCrest themeOverride={previewTheme.id} sectionIndex="01" />

                  <div
                    className="theme-preview-invite__eyebrow"
                    style={{ color: previewTheme.preview.accent }}
                  >
                    SAVE THE DATE • احفظوا التاريخ
                  </div>

                  {/* Actual Theme Hero Image in Theme Frame */}
                  <div className={`theme-preview-invite__hero-frame theme-preview-invite__hero-frame--${previewTheme.id}`}>
                    <img
                      src={getHeroImgSrc(previewTheme)}
                      onError={(e) => {
                        e.currentTarget.src = getHeroFallbackSrc(previewTheme);
                      }}
                      alt={previewTheme.nameAr}
                      className="theme-preview-invite__hero-img"
                    />
                  </div>

                  <div
                    className="theme-preview-invite__names-ar"
                    style={{
                      fontFamily: `'${previewTheme.typography.displayAr}', serif`,
                      color: previewTheme.preview.textPrimary,
                    }}
                  >
                    {groomAr} <span style={{ color: previewTheme.preview.accent }}>&amp;</span> {brideAr}
                  </div>

                  <div
                    className="theme-preview-invite__names-en"
                    style={{
                      fontFamily: `'${previewTheme.typography.displayEn}', cursive, serif`,
                      color: previewTheme.preview.textSecondary,
                    }}
                  >
                    {groomEn} &amp; {brideEn}
                  </div>

                  <OrnamentDivider themeOverride={previewTheme.id} />

                  <div className="theme-preview-invite__details">
                    <div
                      className="theme-preview-invite__date-box"
                      style={{
                        borderColor: previewTheme.preview.accent,
                        color: previewTheme.preview.textPrimary,
                      }}
                    >
                      <strong>{dateAr}</strong>
                      <span>{venueAr}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="theme-preview-invite__cta"
                    style={{
                      background: previewTheme.preview.buttonBg,
                      color: previewTheme.preview.buttonText,
                      borderRadius: previewTheme.preview.buttonRadius,
                    }}
                  >
                    تأكيد الحضور والتهنئة (RSVP)
                  </button>
                </div>
              )}

              {/* TAB 2: ENVELOPE & WAX SEAL PREVIEW */}
              {previewTab === 'envelope' && (
                <div className="theme-preview-envelope-wrap">
                  <div
                    className="theme-preview-envelope"
                    style={{
                      background: previewTheme.preview.envelopeBg,
                      border: previewTheme.preview.cardBorder,
                    }}
                  >
                    <div
                      className="theme-preview-envelope__flap"
                      style={{ background: previewTheme.preview.envelopeFlap }}
                    />
                    <img
                      src={getAssetUrl(previewTheme.assets?.envelopeCardImage || '/og-image.jpg')}
                      alt="Envelope Card"
                      className="theme-preview-envelope__card-img"
                    />
                    <div
                      className="theme-preview-envelope__seal"
                      style={{ background: previewTheme.preview.sealBg }}
                    >
                      <ThemeSealIcon themeOverride={previewTheme.id} />
                    </div>
                  </div>
                  <p
                    className="theme-preview-envelope__caption"
                    style={{ color: previewTheme.preview.textPrimary }}
                  >
                    بطاقة الدعوة داخل الظرف + الختم المخصص ({previewTheme.icons?.labelAr})
                  </p>
                </div>
              )}

              {/* TAB 3: GALLERY LAYOUT & PHOTOGRAPHY PREVIEW */}
              {previewTab === 'gallery' && (
                <div className="theme-preview-gallery-showcase">
                  <div className="theme-preview-gallery-header" style={{ color: previewTheme.preview.textPrimary }}>
                    <h4>{previewTheme.assets?.galleryLayoutLabelAr}</h4>
                    <span>{previewTheme.assets?.galleryLayoutLabelEn}</span>
                  </div>
                  <div className="theme-preview-gallery-grid">
                    {(previewTheme.assets?.galleryImages?.length > 0
                      ? previewTheme.assets.galleryImages.slice(0, 3)
                      : [
                          { id: 'd1', url: '/couple-illustration.png', titleAr: 'صورة العروسين', titleEn: 'Couple Portrait' },
                          { id: 'd2', url: '/og-image.jpg', titleAr: 'بطاقة الدعوة', titleEn: 'Save the Date' },
                          { id: 'd3', url: '/watercolor-floral-1.png', titleAr: 'زخارف الورد المائية', titleEn: 'Watercolor Florals' },
                        ]
                    ).map((gImg, idx) => (
                      <div
                        key={gImg.id || idx}
                        className="theme-preview-gallery-card"
                        style={{
                          background: previewTheme.preview.cardBg,
                          border: previewTheme.preview.cardBorder,
                          color: previewTheme.preview.textPrimary,
                        }}
                      >
                        <img
                          src={getAssetUrl(gImg.url)}
                          alt={gImg.titleAr}
                          className="theme-preview-gallery-card__img"
                        />
                        <div className="theme-preview-gallery-card__caption">
                          <strong>{gImg.titleAr}</strong>
                          <span>{gImg.titleEn}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ICONS, TYPOGRAPHY & ANIMATION SPECIMENS */}
              {previewTab === 'specs' && (
                <div
                  className="theme-preview-specs-card"
                  style={{
                    background: previewTheme.preview.cardBg,
                    border: previewTheme.preview.cardBorder,
                    color: previewTheme.preview.textPrimary,
                  }}
                >
                  <div className="theme-preview-specs__row">
                    <div className="theme-preview-specs__box">
                      <span className="theme-preview-specs__label">شعار الترويسة (Header Crest)</span>
                      <div className="theme-preview-specs__canvas">
                        {previewTheme.id === 'default' ? (
                          <span style={{ fontSize: '1.6rem', color: previewTheme.preview.accent }}>✦ ❧ ✦</span>
                        ) : (
                          <ThemeHeaderCrest themeOverride={previewTheme.id} sectionIndex="01" />
                        )}
                      </div>
                    </div>
                    <div className="theme-preview-specs__box">
                      <span className="theme-preview-specs__label">الختم المخصص (Wax Seal)</span>
                      <div className="theme-preview-specs__canvas">
                        <div
                          className="theme-preview-specs__seal-demo"
                          style={{ background: previewTheme.preview.sealBg }}
                        >
                          <ThemeSealIcon themeOverride={previewTheme.id} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="theme-preview-specs__divider-demo">
                    <span className="theme-preview-specs__label">الفاصل الزخرفي (Ornament Divider):</span>
                    <OrnamentDivider themeOverride={previewTheme.id} />
                  </div>

                  <div className="theme-preview-specs__typo-demo">
                    <div>
                      <span className="theme-preview-specs__label">خط العناوين الإنجليزي ({previewTheme.typography.displayEn}):</span>
                      <p style={{ fontFamily: `'${previewTheme.typography.displayEn}', serif`, fontSize: '1.6rem', margin: '0.25rem 0' }}>
                        {groomEn} &amp; {brideEn} — Forever Begins
                      </p>
                    </div>
                    <div>
                      <span className="theme-preview-specs__label">الخط العربي ({previewTheme.typography.displayAr}):</span>
                      <p style={{ fontFamily: `'${previewTheme.typography.displayAr}', serif`, fontSize: '1.45rem', margin: '0.25rem 0' }}>
                        {groomAr} و {brideAr} — دعوة زفاف مباركة
                      </p>
                    </div>
                  </div>

                  <div className="theme-preview-specs__motion-badge">
                    <Wand2 size={16} />
                    <span>نظام الحركة والمؤثرات الحية: <strong>{previewTheme.animations?.labelAr}</strong> ({previewTheme.animations?.labelEn})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Quick-Switcher & Apply Bar */}
            <div className="theme-preview-modal__footer">
              <div className="theme-preview-modal__quick-list">
                {WEDDING_THEMES.map((tItem) => (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => setPreviewTheme(tItem)}
                    className={`theme-preview-modal__quick-chip ${
                      previewTheme.id === tItem.id ? 'theme-preview-modal__quick-chip--selected' : ''
                    }`}
                  >
                    <span
                      className="theme-preview-modal__chip-dot"
                      style={{ backgroundColor: tItem.preview.accent }}
                    />
                    <span>{tItem.nameAr.split(' (')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="theme-preview-modal__actions">
                {onCloseAdmin && (
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    onClick={() => handleLiveSitePreview(previewTheme.id)}
                  >
                    <ExternalLink size={16} />
                    <span>معاينة حية على الموقع الكامل</span>
                  </button>
                )}

                {activeThemeId === previewTheme.id ? (
                  <span className="theme-preview-modal__active-note">
                    <CheckCircle2 size={16} /> هذا التصميم مفعّل حالياً على الموقع
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    className="admin-btn admin-btn--primary"
                    onClick={() => {
                      handleApplyTheme(previewTheme.id);
                      setPreviewTheme(null);
                    }}
                  >
                    <Sparkles size={16} />
                    <span>تفعيل وحفظ هذا التصميم الآن</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeManager;

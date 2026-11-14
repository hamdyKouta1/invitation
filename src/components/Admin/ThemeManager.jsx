import React, { useState } from 'react';
import {
  Palette,
  CheckCircle,
  Eye,
  Sparkles,
  RotateCcw,
  X,
  Check,
  Layers,
} from 'lucide-react';
import {
  WEDDING_THEMES,
  DEFAULT_THEME_ID,
  getThemeById,
} from '../../config/themesConfig';
import './ThemeManager.css';

const ThemeManager = ({
  activeThemeId = DEFAULT_THEME_ID,
  selectedThemeId = DEFAULT_THEME_ID,
  configData = {},
  saving = false,
  onSelectTheme,
  onApplyAndSaveTheme,
}) => {
  const [previewThemeId, setPreviewThemeId] = useState(null);
  const [previewScene, setPreviewScene] = useState('invitation'); // 'invitation' | 'envelope'

  const currentActiveTheme = getThemeById(activeThemeId);
  const previewTheme = previewThemeId ? getThemeById(previewThemeId) : null;

  const groomAr = configData?.groom?.name || 'حمدى';
  const brideAr = configData?.bride?.name || 'رودينا';
  const groomEn = configData?.groom?.nameEn || 'Hamdy';
  const brideEn = configData?.bride?.nameEn || 'Rodina';
  const dateDisplay = configData?.wedding?.dateDisplay || '١١ سبتمبر ٢٠٢٦';
  const venueName = configData?.venue?.nameAr || 'حديقة جراند لامور';

  const handleCardApply = (themeId) => {
    if (onSelectTheme) {
      onSelectTheme(themeId);
    }
    if (onApplyAndSaveTheme) {
      onApplyAndSaveTheme(themeId);
    }
  };

  return (
    <div className="admin-theme-manager" id="admin-theme-manager">
      {/* ─── Active Theme Status Bar ──────────────────────────── */}
      <div className="admin-theme-status-bar">
        <div className="admin-theme-status-bar__info">
          <div className="admin-theme-status-bar__icon">
            <Palette size={24} />
          </div>
          <div>
            <span className="admin-theme-status-bar__label">
              التصميم النشط والمطبق حالياً على الموقع (Active Theme):
            </span>
            <div className="admin-theme-status-bar__active-name">
              <span id="active-theme-indicator">{currentActiveTheme.nameAr}</span>
              <div className="admin-theme-status-bar__swatches">
                {currentActiveTheme.palette.map((swatch, idx) => (
                  <span
                    key={idx}
                    className="admin-theme-status-bar__dot"
                    style={{ backgroundColor: swatch.hex }}
                    title={swatch.nameAr}
                  />
                ))}
              </div>
              {currentActiveTheme.isDefault && (
                <span className="admin-badge admin-badge--gold">التصميم الأصلي الافتراضي</span>
              )}
            </div>
          </div>
        </div>

        <div className="admin-theme-status-bar__actions">
          {activeThemeId !== DEFAULT_THEME_ID && (
            <button
              type="button"
              onClick={() => handleCardApply(DEFAULT_THEME_ID)}
              disabled={saving}
              className="admin-btn admin-btn--outline"
              id="btn-restore-default-theme"
              title="إرجاع التصميم الأصلي الافتراضي"
            >
              <RotateCcw size={16} />
              <span>استعادة التصميم الأصلي</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── 5 Themes Cards Grid ──────────────────────────────── */}
      <div className="admin-themes-grid">
        {WEDDING_THEMES.map((theme) => {
          const isActive = activeThemeId === theme.id;
          const isSelected = selectedThemeId === theme.id;
          const p = theme.preview;

          return (
            <div
              key={theme.id}
              id={`theme-card-${theme.id}`}
              data-testid={`theme-card-${theme.id}`}
              className={`admin-theme-card ${isActive ? 'admin-theme-card--active' : ''} ${
                isSelected ? 'admin-theme-card--selected' : ''
              }`}
            >
              {/* Miniature Visual Invitation Preview */}
              <div
                className="admin-theme-mockup"
                style={{ background: p.bgGradient }}
                onClick={() => setPreviewThemeId(theme.id)}
                title="اضغط لمعاينة التصميم بالكامل"
              >
                <div className="admin-theme-mockup__badges">
                  <div>
                    {isActive ? (
                      <span className="admin-theme-pill admin-theme-pill--active">
                        <CheckCircle size={13} /> نشط حالياً
                      </span>
                    ) : isSelected ? (
                      <span className="admin-theme-pill admin-theme-pill--selected">
                        <Sparkles size={13} /> محدد
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {theme.isDefault && (
                      <span className="admin-theme-pill admin-theme-pill--default">
                        الأصلي الافتراضي
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini Hero Card */}
                <div
                  className="admin-theme-mockup__card"
                  style={{
                    background: p.cardBg,
                    border: p.cardBorder,
                    borderRadius: p.cardRadius,
                    color: p.textPrimary,
                  }}
                >
                  <span
                    className="admin-theme-mockup__ornament"
                    style={{ color: p.accent }}
                  >
                    {p.ornament} SAVE THE DATE {p.ornament}
                  </span>
                  <div
                    className="admin-theme-mockup__names"
                    style={{
                      fontFamily: `'${theme.typography.displayAr}', serif`,
                      color: p.textPrimary,
                    }}
                  >
                    {groomAr} &amp; {brideAr}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontFamily: `'${theme.typography.displayEn}', serif`,
                      color: p.accent,
                    }}
                  >
                    {groomEn} &amp; {brideEn}
                  </div>
                  <span
                    className="admin-theme-mockup__date"
                    style={{ color: p.textSecondary }}
                  >
                    {dateDisplay}
                  </span>
                  <span
                    className="admin-theme-mockup__btn"
                    style={{
                      background: p.buttonBg,
                      color: p.buttonText,
                      borderRadius: p.buttonRadius,
                    }}
                  >
                    تأكيد الحضور
                  </span>
                </div>

                {/* Mini Wax Seal Indicator */}
                <div
                  className="admin-theme-mockup__seal"
                  style={{ background: p.sealBg }}
                  title="شكل الختم الشمعي للظرف"
                >
                  ♥
                </div>
              </div>

              {/* Card Body */}
              <div className="admin-theme-card__body">
                <div>
                  <span className="admin-theme-card__category">
                    {theme.categoryAr} • {theme.categoryEn}
                  </span>
                  <h4 className="admin-theme-card__title">{theme.nameAr}</h4>
                </div>

                <p className="admin-theme-card__desc">{theme.descriptionAr}</p>

                {/* Color Palette Swatches */}
                <div className="admin-theme-swatches">
                  {theme.palette.map((c, idx) => (
                    <span
                      key={idx}
                      className="admin-theme-swatch"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.nameAr} (${c.hex})`}
                    />
                  ))}
                  <span className="admin-theme-swatches__label">لوحة الألوان</span>
                </div>

                {/* Font Combinations */}
                <div className="admin-theme-fonts">
                  <span className="admin-theme-font-tag" title="English Display Font">
                    EN: {theme.typography.displayEn}
                  </span>
                  <span className="admin-theme-font-tag" title="Arabic Font">
                    AR: {theme.typography.displayAr} / {theme.typography.bodyAr}
                  </span>
                </div>

                {/* Actions */}
                <div className="admin-theme-card__actions">
                  <button
                    type="button"
                    className="admin-theme-btn admin-theme-btn--preview"
                    onClick={() => setPreviewThemeId(theme.id)}
                    id={`btn-preview-theme-${theme.id}`}
                  >
                    <Eye size={15} />
                    <span>معاينة</span>
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    className={`admin-theme-btn ${
                      isActive ? 'admin-theme-btn--applied' : 'admin-theme-btn--apply'
                    }`}
                    onClick={() => handleCardApply(theme.id)}
                    id={`btn-apply-theme-${theme.id}`}
                  >
                    {isActive ? (
                      <>
                        <Check size={16} />
                        <span>مطبق حالياً</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>تفعيل وتطبيق</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Interactive Full Theme Preview Modal ─────────────── */}
      {previewTheme && (
        <div
          className="admin-theme-preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`معاينة تصميم ${previewTheme.nameAr}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewThemeId(null);
          }}
        >
          <div className="admin-theme-preview-modal">
            {/* Header */}
            <div className="admin-theme-preview-modal__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Layers size={20} style={{ color: '#d4af37' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8f4ef' }}>
                    معاينة حية: {previewTheme.nameAr}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#a89f91' }}>
                    {previewTheme.nameEn} — {previewTheme.descriptionEn}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="admin-theme-preview-modal__tabs">
                  <button
                    type="button"
                    className={`admin-theme-preview-tab ${
                      previewScene === 'invitation' ? 'admin-theme-preview-tab--active' : ''
                    }`}
                    onClick={() => setPreviewScene('invitation')}
                  >
                    واجهة الدعوة والأقسام
                  </button>
                  <button
                    type="button"
                    className={`admin-theme-preview-tab ${
                      previewScene === 'envelope' ? 'admin-theme-preview-tab--active' : ''
                    }`}
                    onClick={() => setPreviewScene('envelope')}
                  >
                    شاشة الظرف والختم
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewThemeId(null)}
                  className="admin-modal-close"
                  id="btn-close-theme-preview"
                  title="إغلاق المعاينة"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quick Theme Switcher Strip inside Modal */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                background: '#151210',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                overflowX: 'auto',
              }}
            >
              {WEDDING_THEMES.map((tItem) => (
                <button
                  key={tItem.id}
                  type="button"
                  onClick={() => setPreviewThemeId(tItem.id)}
                  style={{
                    background:
                      previewTheme.id === tItem.id
                        ? 'rgba(212, 175, 55, 0.2)'
                        : 'rgba(255,255,255,0.04)',
                    border:
                      previewTheme.id === tItem.id
                        ? '1px solid #d4af37'
                        : '1px solid rgba(255,255,255,0.08)',
                    color: previewTheme.id === tItem.id ? '#d4af37' : '#c4b5a0',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: tItem.preview.accent,
                      display: 'inline-block',
                    }}
                  />
                  {tItem.nameAr}
                </button>
              ))}
            </div>

            {/* Interactive Preview Stage */}
            <div
              className="admin-theme-preview-stage"
              style={{ background: previewTheme.preview.bgGradient }}
            >
              {previewScene === 'envelope' ? (
                /* Envelope Mockup Scene */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.5rem 0',
                  }}
                >
                  <span
                    style={{
                      color: previewTheme.preview.accent,
                      letterSpacing: '0.25em',
                      fontSize: '0.85rem',
                      fontFamily: `'${previewTheme.typography.headingEn}', serif`,
                    }}
                  >
                    SAVE THE DATE
                  </span>

                  <div
                    style={{
                      width: '320px',
                      height: '205px',
                      background: previewTheme.preview.envelopeBg,
                      border: previewTheme.preview.cardBorder,
                      borderRadius: previewTheme.id === 'minimalist-modern' ? '2px' : '16px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '105px',
                        background: previewTheme.preview.envelopeFlap,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        borderBottom: previewTheme.preview.cardBorder,
                      }}
                    />
                    <div
                      style={{
                        width: '62px',
                        height: '62px',
                        borderRadius: '50%',
                        background: previewTheme.preview.sealBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '1.35rem',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                        zIndex: 2,
                      }}
                    >
                      ♥
                    </div>
                  </div>

                  <span
                    style={{
                      color: previewTheme.preview.textPrimary,
                      fontFamily: `'${previewTheme.typography.headingEn}', '${previewTheme.typography.bodyAr}', serif`,
                      fontSize: '1.15rem',
                    }}
                  >
                    اضغط لفتح الدعوة • Tap to Open Invitation
                  </span>
                </div>
              ) : (
                /* Full Invitation Hero + Cards Preview */
                <div
                  style={{
                    width: '100%',
                    maxWidth: '520px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  {/* Hero Arch Card */}
                  <div
                    style={{
                      background: previewTheme.preview.cardBg,
                      border: previewTheme.preview.cardBorder,
                      borderRadius: previewTheme.preview.cardRadius,
                      padding: '2.25rem 1.5rem',
                      textAlign: 'center',
                      color: previewTheme.preview.textPrimary,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.25em',
                        color: previewTheme.preview.textSecondary,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {previewTheme.preview.ornament} SAVE THE DATE {previewTheme.preview.ornament}
                    </div>

                    <div
                      style={{
                        fontFamily: `'${previewTheme.typography.displayAr}', serif`,
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: previewTheme.preview.textPrimary,
                        marginBottom: '0.25rem',
                      }}
                    >
                      {groomAr} &amp; {brideAr}
                    </div>

                    <div
                      style={{
                        fontFamily: `'${previewTheme.typography.displayEn}', cursive, serif`,
                        fontSize: '1.5rem',
                        color: previewTheme.preview.accent,
                        marginBottom: '0.75rem',
                      }}
                    >
                      {groomEn} &amp; {brideEn}
                    </div>

                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: previewTheme.preview.textSecondary,
                        margin: '0 auto 1rem',
                        maxWidth: '340px',
                        fontFamily: `'${previewTheme.typography.bodyAr}', sans-serif`,
                      }}
                    >
                      يسعدنا دعوتكم لمشاركتنا فرحة زفافنا في {venueName}
                    </p>

                    {/* Countdown Mini Row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {[
                        { v: '120', l: 'يوم' },
                        { v: '18', l: 'ساعة' },
                        { v: '45', l: 'دقيقة' },
                      ].map((u, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.45rem 0.85rem',
                            border: previewTheme.preview.cardBorder,
                            borderRadius: previewTheme.preview.buttonRadius === '2px' ? '2px' : '10px',
                            background: 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: previewTheme.preview.accent }}>
                            {u.v}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: previewTheme.preview.textSecondary }}>
                            {u.l}
                          </div>
                        </div>
                      ))}
                    </div>

                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.6rem 1.75rem',
                        background: previewTheme.preview.buttonBg,
                        color: previewTheme.preview.buttonText,
                        borderRadius: previewTheme.preview.buttonRadius,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      تأكيد الحضور • RSVP
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="admin-theme-preview-modal__footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {previewTheme.palette.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      color: '#c4b5a0',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: c.hex,
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    />
                    {c.nameAr}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setPreviewThemeId(null)}
                  className="admin-btn admin-btn--ghost"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    handleCardApply(previewTheme.id);
                    setPreviewThemeId(null);
                  }}
                  className="admin-btn admin-btn--primary"
                  id="btn-modal-apply-theme"
                >
                  <CheckCircle size={17} />
                  <span>
                    {activeThemeId === previewTheme.id
                      ? 'هذا التصميم مطبق حالياً'
                      : 'تطبيق وحفظ هذا التصميم'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeManager;

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  ChevronDown,
  ChevronUp,
  Type,
  Sparkles,
} from 'lucide-react';
import { clone, normalizeSectionOrder, isSectionEnabled } from '../../utils/configManager';

const BUILTIN_SECTION_META = {
  hero: { labelAr: 'الغلاف الرئيسي (Hero)', labelEn: 'Hero Cover' },
  details: { labelAr: 'تفاصيل الموعد (Wedding Details)', labelEn: 'Wedding Details' },
  countdown: { labelAr: 'العد التنازلي (Countdown)', labelEn: 'Countdown' },
  families: { labelAr: 'العائلتان الكريمتان (Families)', labelEn: 'Families' },
  venue: { labelAr: 'مكان الاحتفال (Venue)', labelEn: 'Venue & Map' },
  gallery: { labelAr: 'معرض الصور (Gallery)', labelEn: 'Photo Gallery' },
  dressCode: { labelAr: 'دليل الأناقة (Dress Code)', labelEn: 'Dress Code' },
  wishlist: { labelAr: 'قائمة الهدايا (Wishlist / Gifts)', labelEn: 'Gifts & Wishlist' },
  rsvp: { labelAr: 'تأكيد الحضور (RSVP)', labelEn: 'RSVP Form' },
  wishes: { labelAr: 'حائط التهاني (Wishes Wall)', labelEn: 'Wishes Wall' },
  share: { labelAr: 'مشاركة الدعوة (Share Invitation)', labelEn: 'Share Invitation' },
};

const DynamicSectionsEditor = ({ configData, setConfigData, showToast }) => {
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  const orderedIds = normalizeSectionOrder(
    configData.sectionOrder,
    configData.customSections
  );

  const customSections = Array.isArray(configData.customSections)
    ? configData.customSections
    : [];

  const customMap = new Map(
    customSections.filter((cs) => cs && cs.id).map((cs) => [cs.id, cs])
  );

  // Move section up or down in sectionOrder
  const handleMoveSection = (sectionId, direction) => {
    setConfigData((prev) => {
      const next = clone(prev) || {};
      const currentOrder = normalizeSectionOrder(next.sectionOrder, next.customSections);
      const idx = currentOrder.indexOf(sectionId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= currentOrder.length) return prev;

      const updatedOrder = [...currentOrder];
      const [moved] = updatedOrder.splice(idx, 1);
      updatedOrder.splice(targetIdx, 0, moved);
      next.sectionOrder = updatedOrder;
      return next;
    });
  };

  // Toggle visibility of a built-in or custom section
  const handleToggleSection = (sectionId, checked) => {
    setConfigData((prev) => {
      const next = clone(prev) || {};
      if (!next.sections) next.sections = {};

      if (BUILTIN_SECTION_META[sectionId]) {
        next.sections[sectionId] = {
          ...(next.sections[sectionId] || {}),
          enabled: checked,
        };
        if (sectionId === 'gallery') {
          next.gallery = { ...(next.gallery || {}), enabled: checked };
        } else if (sectionId === 'dressCode') {
          next.dressCode = { ...(next.dressCode || {}), enabled: checked };
        } else if (sectionId === 'wishlist') {
          next.wishlist = { ...(next.wishlist || {}), enabled: checked };
        } else if (sectionId === 'rsvp') {
          next.rsvp = { ...(next.rsvp || {}), enabled: checked };
        }
      } else {
        next.customSections = (Array.isArray(next.customSections) ? next.customSections : []).map(
          (cs) => (cs.id === sectionId ? { ...cs, enabled: checked } : cs)
        );
      }
      return next;
    });
  };

  // Update built-in section text override (titleAr, titleEn, subtitleAr, subtitleEn)
  const handleBuiltinTextChange = (sectionId, field, value) => {
    setConfigData((prev) => {
      const next = clone(prev) || {};
      if (!next.sections) next.sections = {};
      next.sections[sectionId] = {
        ...(next.sections[sectionId] || { enabled: true }),
        [field]: value,
      };
      // Keep wishlist & dressCode top-level title/subtitle synced if edited here
      if (sectionId === 'wishlist' && ['titleAr', 'titleEn', 'subtitleAr', 'subtitleEn'].includes(field)) {
        next.wishlist = { ...(next.wishlist || {}), [field]: value };
      }
      if (sectionId === 'dressCode' && ['titleAr', 'titleEn', 'subtitleAr', 'subtitleEn'].includes(field)) {
        next.dressCode = { ...(next.dressCode || {}), [field]: value };
      }
      return next;
    });
  };

  // Add a new custom section
  const handleAddCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection = {
      id: newId,
      enabled: true,
      alt: false,
      badgeAr: 'قسم خاص',
      badgeEn: 'Special Note',
      titleAr: 'عنوان القسم الجديد',
      titleEn: 'New Custom Section',
      subtitleAr: 'وصف فرعي للقسم المخصص',
      subtitleEn: 'A subtitle for your custom section',
      contentAr: 'اكتب هنا تفاصيل وفقرات القسم المخصص ليظهر بنفس تصميم وألوان الثيم المختار.',
      contentEn: 'Write your custom section paragraphs and details here. It automatically inherits the active theme styling.',
      imageUrl: '',
      ctaTextAr: '',
      ctaTextEn: '',
      ctaUrl: '',
    };

    setConfigData((prev) => {
      const next = clone(prev) || {};
      const currentCustom = Array.isArray(next.customSections) ? [...next.customSections] : [];
      next.customSections = [...currentCustom, newSection];
      next.sectionOrder = normalizeSectionOrder(next.sectionOrder, next.customSections);
      return next;
    });

    setExpandedSectionId(newId);
    if (showToast) {
      showToast('تمت إضافة قسم مخصص جديد! يمكنك تعديل محتواه وترتيبه ثم حفظ الإعدادات.');
    }
  };

  // Update a custom section field
  const handleUpdateCustomSection = (sectionId, field, value) => {
    setConfigData((prev) => {
      const next = clone(prev) || {};
      next.customSections = (Array.isArray(next.customSections) ? next.customSections : []).map(
        (cs) => (cs.id === sectionId ? { ...cs, [field]: value } : cs)
      );
      return next;
    });
  };

  // Delete a custom section
  const handleDeleteCustomSection = (sectionId) => {
    setConfigData((prev) => {
      const next = clone(prev) || {};
      next.customSections = (Array.isArray(next.customSections) ? next.customSections : []).filter(
        (cs) => cs.id !== sectionId
      );
      next.sectionOrder = (Array.isArray(next.sectionOrder) ? next.sectionOrder : []).filter(
        (id) => id !== sectionId
      );
      return next;
    });
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(null);
    }
    if (showToast) {
      showToast('تم حذف القسم المخصص بنجاح.');
    }
  };

  return (
    <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h3 className="admin-card-title" style={{ marginBottom: '0.25rem' }}>
            <Layers size={20} />
            <span>إدارة هيكل الدعوة، ترتيب الأقسام، وتخصيص النصوص والأقسام الإضافية</span>
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#a89f91', margin: 0 }}>
            تحكم كامل في ترتيب ظهور الأقسام، تعديل عناوين وفقرات أي قسم حالي، أو إضافة أقسام جديدة مخصصة تتكيف تلقائياً مع جميع القوالب الخمسة.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCustomSection}
          className="admin-btn admin-btn--primary"
          id="btn-add-custom-section"
        >
          <Plus size={16} />
          <span>إضافة قسم جديد مخصص</span>
        </button>
      </div>

      {/* Ordered Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {orderedIds.map((sectionId, idx) => {
          const isCustom = customMap.has(sectionId);
          const customSec = isCustom ? customMap.get(sectionId) : null;
          const builtinMeta = BUILTIN_SECTION_META[sectionId];
          if (!isCustom && !builtinMeta) return null;

          const enabled = isCustom
            ? customSec.enabled !== false
            : isSectionEnabled(configData, sectionId);

          const isExpanded = expandedSectionId === sectionId;
          const secOverride = configData.sections?.[sectionId] || {};

          const displayTitle = isCustom
            ? `${customSec.titleAr || 'قسم مخصص'} (${customSec.titleEn || 'Custom Section'})`
            : builtinMeta.labelAr;

          return (
            <div
              key={sectionId}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${
                  isCustom ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                }`,
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                opacity: enabled ? 1 : 0.6,
                transition: 'all 0.2s ease',
              }}
            >
              {/* Top Row: Order Controls + Title + Toggles + Expand */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: '#d4af37',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                    }}
                  >
                    #{idx + 1}
                  </span>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(sectionId, 'up')}
                      disabled={idx === 0}
                      className="admin-icon-btn"
                      title="تحريك لأعلى"
                      style={{ opacity: idx === 0 ? 0.35 : 1 }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(sectionId, 'down')}
                      disabled={idx === orderedIds.length - 1}
                      className="admin-icon-btn"
                      title="تحريك لأسفل"
                      style={{ opacity: idx === orderedIds.length - 1 ? 0.35 : 1 }}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <strong style={{ color: '#f5efe6', fontSize: '0.94rem' }}>
                    {displayTitle}
                  </strong>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '999px',
                      background: isCustom
                        ? 'rgba(46, 204, 113, 0.16)'
                        : 'rgba(212, 175, 55, 0.12)',
                      color: isCustom ? '#2ecc71' : '#d4af37',
                      border: `1px solid ${
                        isCustom ? 'rgba(46, 204, 113, 0.35)' : 'rgba(212, 175, 55, 0.25)'
                      }`,
                    }}
                  >
                    {isCustom ? '✨ قسم مخصص' : 'قسم أساسي'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <label
                    className="admin-toggle-label"
                    style={{ margin: 0, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => handleToggleSection(sectionId, e.target.checked)}
                    />
                    <span>{enabled ? 'مفعّل (ظاهر)' : 'مخفي'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSectionId(isExpanded ? null : sectionId)
                    }
                    className="admin-btn admin-btn--outline admin-btn--sm"
                    style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                  >
                    <Type size={14} />
                    <span>{isExpanded ? 'إغلاق المحرر' : 'تعديل النصوص والمحتوى'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomSection(sectionId)}
                      className="admin-btn admin-btn--danger-sm"
                      title="حذف القسم المخصص"
                    >
                      <Trash2 size={14} />
                      <span>حذف</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Editor Drawer */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: '0.9rem',
                    paddingTop: '0.9rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {isCustom ? (
                    /* Custom Section Full Editor */
                    <div className="admin-form-grid-2">
                      <div className="admin-form-group">
                        <label className="admin-label">عنوان القسم (بالعربي) *</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.titleAr || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'titleAr', e.target.value)
                          }
                          placeholder="مثال: قصتنا / برنامج الحفل"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">عنوان القسم (English) *</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.titleEn || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'titleEn', e.target.value)
                          }
                          placeholder="e.g. Our Story / Event Schedule"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">العنوان الفرعي / الوصف المختصر (بالعربي)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.subtitleAr || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'subtitleAr', e.target.value)
                          }
                          placeholder="وصف قصير يظهر تحت العنوان..."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">العنوان الفرعي (English)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.subtitleEn || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'subtitleEn', e.target.value)
                          }
                          placeholder="Short subtitle under heading..."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">محتوى وفقرات القسم (بالعربي)</label>
                        <textarea
                          rows={3}
                          className="admin-input admin-textarea"
                          value={customSec.contentAr || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'contentAr', e.target.value)
                          }
                          placeholder="اكتب الفقرات النصية هنا (كل سطر جديد يظهر كفقرة منسقة)..."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">محتوى وفقرات القسم (English)</label>
                        <textarea
                          rows={3}
                          className="admin-input admin-textarea"
                          value={customSec.contentEn || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'contentEn', e.target.value)
                          }
                          placeholder="Write paragraphs here (each new line renders as a styled paragraph)..."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">شارة علوية اختيارية (Badge بالعربي)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.badgeAr || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'badgeAr', e.target.value)
                          }
                          placeholder="مثال: لحظات لا تُنسى"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">شارة علوية اختيارية (Badge English)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.badgeEn || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'badgeEn', e.target.value)
                          }
                          placeholder="e.g. Special Highlight"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">رابط صورة اختيارية للقسم (Image URL)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.imageUrl || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'imageUrl', e.target.value)
                          }
                          placeholder="https://... أو مسار صورة محلي"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">رابط زر إضافي اختياري (CTA Link URL)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.ctaUrl || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'ctaUrl', e.target.value)
                          }
                          placeholder="https://..."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">نص الزر (بالعربي)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.ctaTextAr || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'ctaTextAr', e.target.value)
                          }
                          placeholder="مثال: شاهد التفاصيل"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">نص الزر (English)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={customSec.ctaTextEn || ''}
                          onChange={(e) =>
                            handleUpdateCustomSection(sectionId, 'ctaTextEn', e.target.value)
                          }
                          placeholder="e.g. Learn More"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Built-in Section Heading & Paragraph Override Editor */
                    <div className="admin-form-grid-2">
                      <div className="admin-form-group">
                        <label className="admin-label">
                          تخصيص عنوان القسم (بالعربي — اتركه فارغاً للافتراضي)
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={secOverride.titleAr || ''}
                          onChange={(e) =>
                            handleBuiltinTextChange(sectionId, 'titleAr', e.target.value)
                          }
                          placeholder={`العنوان المخصص لقسم ${builtinMeta.labelAr}...`}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          Custom Section Heading (English — leave blank for default)
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={secOverride.titleEn || ''}
                          onChange={(e) =>
                            handleBuiltinTextChange(sectionId, 'titleEn', e.target.value)
                          }
                          placeholder={`Custom heading for ${builtinMeta.labelEn}...`}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          تخصيص النص الفرعي / الفقرة التوضيحية (بالعربي)
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={secOverride.subtitleAr || ''}
                          onChange={(e) =>
                            handleBuiltinTextChange(sectionId, 'subtitleAr', e.target.value)
                          }
                          placeholder="فقرة أو نص ترحيبي مخصص يظهر تحت عنوان القسم..."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          Custom Section Subtitle / Paragraph (English)
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={secOverride.subtitleEn || ''}
                          onChange={(e) =>
                            handleBuiltinTextChange(sectionId, 'subtitleEn', e.target.value)
                          }
                          placeholder="Custom subtitle or paragraph under section heading..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicSectionsEditor;

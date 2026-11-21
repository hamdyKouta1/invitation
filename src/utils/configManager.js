import weddingConfig, { DEFAULT_SECTION_ORDER } from '../config/weddingConfig.js';
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  isValidThemeId,
  applyThemeToDOM,
  setTemporaryThemePreview,
  clearTemporaryThemePreview,
  getTemporaryThemePreview,
} from '../config/themesConfig.js';
import {
  DEFAULT_EVENT_TYPE_ID,
  isValidEventTypeId,
  getEventTypeById,
} from '../config/eventTypesConfig.js';
import { getScopedStorageKey } from './security.js';

export {
  applyThemeToDOM,
  setTemporaryThemePreview,
  clearTemporaryThemePreview,
  getTemporaryThemePreview,
};

const BASE_CONFIG_STORAGE_KEY = 'wedding_config_override';
const getConfigStorageKey = () => getScopedStorageKey(BASE_CONFIG_STORAGE_KEY);
const getThemeStorageKey = () => getScopedStorageKey(THEME_STORAGE_KEY);
export const CONFIG_UPDATE_EVENT = 'wedding_config_changed';

/**
 * Deep clone an object safely
 */
export const clone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Normalizes sectionOrder so all built-in sections and any customSections are present
 * in the user's configured order without duplicates.
 */
export const normalizeSectionOrder = (rawOrder, customSections = []) => {
  const baseOrder = Array.isArray(rawOrder) && rawOrder.length > 0
    ? rawOrder.filter((id) => typeof id === 'string' && id.trim().length > 0)
    : [...DEFAULT_SECTION_ORDER];

  const customIds = (Array.isArray(customSections) ? customSections : [])
    .map((cs) => cs?.id)
    .filter(Boolean);

  const validSet = new Set([...DEFAULT_SECTION_ORDER, ...customIds]);
  const seen = new Set();
  const result = [];

  for (const id of baseOrder) {
    if (validSet.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }

  // Ensure any built-in section not yet in the array is appended in default order
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }

  // Ensure any custom section not yet in the array is placed before 'rsvp' (or at end)
  for (const cid of customIds) {
    if (!seen.has(cid)) {
      seen.add(cid);
      const rsvpIdx = result.indexOf('rsvp');
      if (rsvpIdx !== -1) {
        result.splice(rsvpIdx, 0, cid);
      } else {
        result.push(cid);
      }
    }
  }

  return result;
};

/**
 * Merges per-section text & visibility overrides with defaults and legacy flags
 */
const mergeSectionsMap = (overrideSections = {}, mergedFeatures = {}) => {
  const base = weddingConfig.sections || {};
  const result = {};

  for (const key of DEFAULT_SECTION_ORDER) {
    const defSec = base[key] || { enabled: true, titleAr: '', titleEn: '', subtitleAr: '', subtitleEn: '' };
    const ovrSec = overrideSections?.[key] || {};

    // Keep feature-specific enabled flags (gallery.enabled, dressCode.enabled, wishlist.enabled, rsvp.enabled) synchronized
    let enabled = ovrSec.enabled !== undefined ? Boolean(ovrSec.enabled) : defSec.enabled;
    if (key === 'gallery' && mergedFeatures.gallery?.enabled !== undefined) {
      enabled = Boolean(mergedFeatures.gallery.enabled) && (ovrSec.enabled !== false);
    } else if (key === 'dressCode' && mergedFeatures.dressCode?.enabled !== undefined) {
      enabled = Boolean(mergedFeatures.dressCode.enabled) && (ovrSec.enabled !== false);
    } else if (key === 'wishlist' && mergedFeatures.wishlist?.enabled !== undefined) {
      enabled = Boolean(mergedFeatures.wishlist.enabled) || Boolean(ovrSec.enabled);
    } else if (key === 'rsvp' && mergedFeatures.rsvp?.enabled !== undefined) {
      enabled = Boolean(mergedFeatures.rsvp.enabled) && (ovrSec.enabled !== false);
    }

    result[key] = {
      ...defSec,
      ...ovrSec,
      enabled,
    };
  }

  return result;
};

/**
 * Safely merges configuration overrides (from Firestore or LocalStorage)
 * with the base static weddingConfig defaults while preserving all Project B
 * dynamic content & structure customizations and Project A theme settings.
 */
export const mergeConfig = (override) => {
  const storedTheme =
    typeof localStorage !== 'undefined' ? localStorage.getItem(getThemeStorageKey()) : null;

  if (!override || typeof override !== 'object') {
    const resolvedTheme = isValidThemeId(storedTheme)
      ? storedTheme
      : isValidThemeId(weddingConfig.theme)
        ? weddingConfig.theme
        : DEFAULT_THEME_ID;
    const defaultEventType = isValidEventTypeId(weddingConfig.eventType)
      ? weddingConfig.eventType
      : DEFAULT_EVENT_TYPE_ID;
    return {
      ...weddingConfig,
      eventType: defaultEventType,
      eventMeta: getEventTypeById(defaultEventType),
      theme: resolvedTheme,
      sectionOrder: normalizeSectionOrder(weddingConfig.sectionOrder, weddingConfig.customSections),
    };
  }

  const candidateEventType = override.eventType || weddingConfig.eventType || DEFAULT_EVENT_TYPE_ID;
  const resolvedEventType = isValidEventTypeId(candidateEventType)
    ? candidateEventType
    : DEFAULT_EVENT_TYPE_ID;
  const eventMeta = getEventTypeById(resolvedEventType);

  const groom = { ...weddingConfig.groom, ...(override.groom || {}) };
  const bride = { ...weddingConfig.bride, ...(override.bride || {}) };

  const candidateTheme = override.theme || storedTheme || weddingConfig.theme || DEFAULT_THEME_ID;
  const resolvedTheme = isValidThemeId(candidateTheme) ? candidateTheme : DEFAULT_THEME_ID;

  const gallery = { ...weddingConfig.gallery, ...(override.gallery || {}) };
  const dressCode = { ...weddingConfig.dressCode, ...(override.dressCode || {}) };
  const wishlist = {
    ...weddingConfig.wishlist,
    ...(override.wishlist || {}),
    items: Array.isArray(override.wishlist?.items)
      ? override.wishlist.items
      : weddingConfig.wishlist?.items || [],
  };
  const rsvp = { ...weddingConfig.rsvp, ...(override.rsvp || {}) };

  const customSections = Array.isArray(override.customSections)
    ? override.customSections
    : Array.isArray(weddingConfig.customSections)
      ? weddingConfig.customSections
      : [];

  const sections = mergeSectionsMap(override.sections, {
    gallery,
    dressCode,
    wishlist,
    rsvp,
  });

  const sectionOrder = normalizeSectionOrder(override.sectionOrder, customSections);
  const isCoupleMode = eventMeta.mode === 'couple';
  const primaryDisplayAr = isCoupleMode
    ? `${groom.name} و${bride.name}`
    : (override.honoree?.titleAr || groom.name);
  const primaryDisplayEn = isCoupleMode
    ? `${groom.nameEn} & ${bride.nameEn}`
    : (override.honoree?.titleEn || groom.nameEn);

  return {
    ...weddingConfig,
    ...override,
    eventType: resolvedEventType,
    eventMeta,
    theme: resolvedTheme,
    groom,
    bride,
    honoree: override.honoree || weddingConfig.honoree || null,
    agenda: Array.isArray(override.agenda) ? override.agenda : (weddingConfig.agenda || []),
    wedding: { ...weddingConfig.wedding, ...(override.wedding || {}) },
    venue: { ...weddingConfig.venue, ...(override.venue || {}) },
    music: { ...weddingConfig.music, ...(override.music || {}) },
    gallery,
    dressCode,
    wishlist,
    rsvp,
    sections,
    sectionOrder,
    customSections,
    sharing: {
      ...weddingConfig.sharing,
      ...(override.sharing || {}),
      messageAr:
        override.sharing?.messageAr ||
        (resolvedEventType === 'wedding'
          ? `🎉 دعوة زفاف ${groom.name} و${bride.name} — شاركونا فرحتنا! {url}`
          : `🎉 ${eventMeta.badgeAr}: ${primaryDisplayAr} — يسعدنا حضوركم! {url}`),
      messageEn:
        override.sharing?.messageEn ||
        (resolvedEventType === 'wedding'
          ? `🎉 ${groom.nameEn} & ${bride.nameEn}'s Wedding Invitation — Join us on our special day! {url}`
          : `🎉 ${eventMeta.badgeEn}: ${primaryDisplayEn} — Join us! {url}`),
    },
    meta: {
      ...weddingConfig.meta,
      ...(override.meta || {}),
      titleAr:
        override.meta?.titleAr ||
        (resolvedEventType === 'wedding'
          ? `دعوة زفاف ${groom.name} و${bride.name}`
          : `${eventMeta.badgeAr} — ${primaryDisplayAr}`),
      titleEn:
        override.meta?.titleEn ||
        (resolvedEventType === 'wedding'
          ? `${groom.nameEn} & ${bride.nameEn}'s Wedding Invitation`
          : `${primaryDisplayEn} — ${eventMeta.badgeEn}`),
    },
    invitationPhraseAr:
      override.invitationPhraseAr ||
      (resolvedEventType === 'wedding'
        ? `تتشرف ${groom.familyTitleAr} و${bride.familyTitleAr} بدعوتكم لحضور حفل زفاف نجليهما`
        : `نتشرف بدعوتكم لحضور ومشاركتنا ${eventMeta.nameAr.split(' (')[0]}`),
    invitationPhraseEn:
      override.invitationPhraseEn ||
      (resolvedEventType === 'wedding'
        ? `${groom.familyTitleEn} & ${bride.familyTitleEn} cordially request the honor of your presence at the wedding of their children`
        : `We cordially request the honor of your presence at our ${eventMeta.nameEn}`),
  };
};

/**
 * Helper to check if a given built-in or custom section is enabled
 */
export const isSectionEnabled = (config, sectionKey) => {
  if (!config) return true;
  if (sectionKey === 'gallery' && config.gallery?.enabled === false) return false;
  if (sectionKey === 'dressCode' && config.dressCode?.enabled === false) return false;
  if (sectionKey === 'wishlist' && config.wishlist?.enabled !== true && config.sections?.wishlist?.enabled !== true) {
    return false;
  }
  if (sectionKey === 'rsvp' && config.rsvp?.enabled === false) return false;

  if (config.sections && config.sections[sectionKey] && config.sections[sectionKey].enabled === false) {
    return false;
  }

  if (!DEFAULT_SECTION_ORDER.includes(sectionKey)) {
    const customList = Array.isArray(config.customSections) ? config.customSections : [];
    const customSec = customList.find((item) => item && item.id === sectionKey);
    if (!customSec || customSec.enabled === false) {
      return false;
    }
  }

  return true;
};

/**
 * Helper to get or save only the active theme ID while preserving all other config fields
 */
export const getActiveThemeId = () => {
  const cfg = getActiveConfig();
  return isValidThemeId(cfg?.theme) ? cfg.theme : DEFAULT_THEME_ID;
};

export const saveActiveThemeId = (themeId) => {
  const validId = isValidThemeId(themeId) ? themeId : DEFAULT_THEME_ID;
  const current = getActiveConfig();
  return saveActiveConfig({ ...current, theme: validId });
};

/**
 * Merges default static configuration with any local storage or passed overrides
 */
export const getActiveConfig = (override = null) => {
  try {
    if (override && typeof override === 'object') {
      return mergeConfig(override);
    }
    const stored =
      typeof localStorage !== 'undefined' ? localStorage.getItem(getConfigStorageKey()) : null;
    if (!stored) {
      return mergeConfig(null);
    }

    return mergeConfig(JSON.parse(stored));
  } catch (err) {
    console.error('[ConfigManager] Failed to load config overrides:', err);
    return mergeConfig(null);
  }
};

/**
 * Save configuration overrides to localStorage, apply theme to DOM, and dispatch update event
 */
export const saveActiveConfig = (newConfig) => {
  try {
    const merged = mergeConfig(newConfig);
    const resolvedTheme = isValidThemeId(merged?.theme) ? merged.theme : DEFAULT_THEME_ID;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getConfigStorageKey(), JSON.stringify(merged));
      localStorage.setItem(getThemeStorageKey(), resolvedTheme);
    }

    applyThemeToDOM(resolvedTheme);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CONFIG_UPDATE_EVENT, { detail: merged }));
    }
    return true;
  } catch (err) {
    console.error('[ConfigManager] Failed to save config:', err);
    return false;
  }
};

/**
 * Synchronizes configuration with Firestore as the 1st Priority.
 * If Firestore has a config document -> merges and sets as active.
 * If Firestore has NO config document yet -> preserves local overrides (or default weddingConfig) and uploads to Firestore if enabled.
 */
export const syncConfigWithFirestore = async (getWeddingConfigFromDB, saveWeddingConfigToDB) => {
  try {
    const cloudConfig = await getWeddingConfigFromDB();
    if (cloudConfig && Object.keys(cloudConfig).length > 0) {
      console.info('[ConfigManager] Priority 1: Loaded wedding config from Firestore DB');
      saveActiveConfig(cloudConfig);
      return getActiveConfig(cloudConfig);
    } else {
      const currentActive = getActiveConfig();
      applyThemeToDOM(currentActive.theme);

      const firebaseEnabled = import.meta?.env?.VITE_FIREBASE_ENABLED === 'true';
      if (firebaseEnabled && saveWeddingConfigToDB) {
        console.info('[ConfigManager] No config in Firestore yet. Uploading weddingConfig to Firestore...');
        await saveWeddingConfigToDB(currentActive);
      }
      return currentActive;
    }
  } catch (err) {
    console.warn('[ConfigManager] Firestore config sync skipped (using local/fallback):', err);
    const fallback = getActiveConfig();
    applyThemeToDOM(fallback.theme);
    return fallback;
  }
};

/**
 * Reset config to original defaults (including restoring default theme)
 */
export const resetActiveConfig = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(getConfigStorageKey());
      localStorage.removeItem(getThemeStorageKey());
    }
    applyThemeToDOM(DEFAULT_THEME_ID);
    const resetMerged = mergeConfig(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CONFIG_UPDATE_EVENT, { detail: resetMerged }));
    }
    return true;
  } catch (err) {
    console.error('[ConfigManager] Failed to reset config:', err);
    return false;
  }
};

/**
 * Generate formatted JS source code for weddingConfig.js
 */
export const generateConfigFileContent = (cfg) => {
  const merged = mergeConfig(cfg);
  const groom = merged.groom || weddingConfig.groom;
  const bride = merged.bride || weddingConfig.bride;
  const wedding = merged.wedding || weddingConfig.wedding;
  const venue = merged.venue || weddingConfig.venue;
  const music = merged.music || weddingConfig.music;
  const gallery = merged.gallery || weddingConfig.gallery;
  const dressCode = merged.dressCode || weddingConfig.dressCode;
  const wishlist = merged.wishlist || weddingConfig.wishlist;
  const rsvp = merged.rsvp || weddingConfig.rsvp;
  const sections = merged.sections || weddingConfig.sections;
  const sectionOrder = merged.sectionOrder || DEFAULT_SECTION_ORDER;
  const customSections = merged.customSections || [];
  const sharing = merged.sharing || weddingConfig.sharing;
  const meta = merged.meta || weddingConfig.meta;
  const analytics = merged.analytics || weddingConfig.analytics;
  const theme = isValidThemeId(merged.theme) ? merged.theme : DEFAULT_THEME_ID;

  return `/**
 * ============================================================
 * WEDDING CONFIGURATION — Edit this file to customize your
 * invitation. All wedding-specific data lives here.
 * ============================================================
 */

// ─── 1. COUPLE & FAMILIES (Single Source of Truth) ──────────
const groom = ${JSON.stringify(groom, null, 2)};

const bride = ${JSON.stringify(bride, null, 2)};

export const DEFAULT_SECTION_ORDER = ${JSON.stringify(DEFAULT_SECTION_ORDER, null, 2)};

// ─── 2. MAIN CONFIGURATION OBJECT ────────────────────────────
const weddingConfig = {
  /**
   * ─── LANGUAGE ─────────────────────────────────────────────
   * Default language for the invitation: 'ar' (Arabic) or 'en' (English)
   */
  defaultLanguage: ${JSON.stringify(merged.defaultLanguage || "ar")},

  /**
   * ─── THEME & EVENT TYPE ───────────────────────────────────
   */
  eventType: ${JSON.stringify(merged.eventType || DEFAULT_EVENT_TYPE_ID)},
  theme: ${JSON.stringify(theme)},

  /**
   * ─── COUPLE ──────────────────────────────────────────────
   */
  groom,
  bride,

  // Family Invitation Phrase (Auto-generated from family titles)
  invitationPhraseAr: ${JSON.stringify(merged.invitationPhraseAr)},
  invitationPhraseEn: ${JSON.stringify(merged.invitationPhraseEn)},

  /**
   * ─── WEDDING DATE & TIME ─────────────────────────────────
   */
  wedding: ${JSON.stringify(wedding, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── VENUE ───────────────────────────────────────────────
   */
  venue: ${JSON.stringify(venue, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── MUSIC ───────────────────────────────────────────────
   */
  music: ${JSON.stringify(music, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── GALLERY ─────────────────────────────────────────────
   */
  gallery: ${JSON.stringify(gallery, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── DRESS CODE ───────────────────────────────────────────
   */
  dressCode: ${JSON.stringify(dressCode, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── WISHLIST ─────────────────────────────────────────────
   */
  wishlist: ${JSON.stringify(wishlist, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── RSVP ─────────────────────────────────────────────────
   */
  rsvp: ${JSON.stringify(rsvp, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── DYNAMIC SECTION STRUCTURE & CUSTOM SECTIONS ──────────
   */
  sectionOrder: ${JSON.stringify(sectionOrder, null, 4).replace(/\n/g, '\n  ')},
  sections: ${JSON.stringify(sections, null, 4).replace(/\n/g, '\n  ')},
  customSections: ${JSON.stringify(customSections, null, 4).replace(/\n/g, '\n  ')},

  /**
   * ─── SHARING ──────────────────────────────────────────────
   */
  sharing: {
    url: ${JSON.stringify(sharing.url || "https://hamdyKouta1.github.io/invitation/")},
    messageAr: \`🎉 دعوة زفاف \${groom.name} و\${bride.name} — شاركونا فرحتنا! {url}\`,
    messageEn: \`🎉 \${groom.nameEn} & \${bride.nameEn}'s Wedding Invitation — Join us on our special day! {url}\`,
  },

  /**
   * ─── SEO & META ───────────────────────────────────────────
   */
  meta: {
    titleAr: \`دعوة زفاف \${groom.name} و\${bride.name}\`,
    titleEn: \`\${groom.nameEn} & \${bride.nameEn}'s Wedding Invitation\`,
    descriptionAr: ${JSON.stringify(meta.descriptionAr || "يسعدنا دعوتكم لمشاركتنا فرحة زفافنا في بورسعيد")},
    descriptionEn: ${JSON.stringify(meta.descriptionEn || "We joyfully invite you to celebrate our wedding in Port Said")},
    ogImageUrl: ${JSON.stringify(meta.ogImageUrl || "https://hamdyKouta1.github.io/invitation/og-image.jpg")},
    faviconUrl: ${JSON.stringify(meta.faviconUrl || "/favicon.svg")},
  },

  /**
   * ─── ANALYTICS ────────────────────────────────────────────
   */
  analytics: ${JSON.stringify(analytics, null, 4).replace(/\n/g, '\n  ')},
};

export default weddingConfig;
`;
};

/**
 * Triggers a browser download of the updated weddingConfig.js file
 */
export const downloadConfigFile = (config) => {
  const content = generateConfigFileContent(config);
  const blob = new Blob([content], { type: 'text/javascript;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'weddingConfig.js');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Synchronously initialize theme attribute on load to prevent any FOUC (Flash of Unstyled Content)
if (typeof window !== 'undefined') {
  const initialCfg = getActiveConfig();
  applyThemeToDOM(initialCfg?.theme);
}

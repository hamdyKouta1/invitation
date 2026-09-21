import weddingConfig from '../config/weddingConfig.js';

const CONFIG_STORAGE_KEY = 'wedding_config_override';
export const CONFIG_UPDATE_EVENT = 'wedding_config_changed';

/**
 * Deep clone an object safely
 */
export const clone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Safely merges configuration overrides (from Firestore or LocalStorage)
 * with the base static weddingConfig defaults.
 */
export const mergeConfig = (override) => {
  if (!override || typeof override !== 'object') return weddingConfig;

  const groom = { ...weddingConfig.groom, ...(override.groom || {}) };
  const bride = { ...weddingConfig.bride, ...(override.bride || {}) };

  return {
    ...weddingConfig,
    ...override,
    groom,
    bride,
    wedding: { ...weddingConfig.wedding, ...(override.wedding || {}) },
    venue: { ...weddingConfig.venue, ...(override.venue || {}) },
    music: { ...weddingConfig.music, ...(override.music || {}) },
    gallery: { ...weddingConfig.gallery, ...(override.gallery || {}) },
    dressCode: { ...weddingConfig.dressCode, ...(override.dressCode || {}) },
    wishlist: { ...weddingConfig.wishlist, ...(override.wishlist || {}) },
    rsvp: { ...weddingConfig.rsvp, ...(override.rsvp || {}) },
    sharing: {
      ...weddingConfig.sharing,
      ...(override.sharing || {}),
      messageAr: override.sharing?.messageAr || `🎉 دعوة زفاف ${groom.name} و${bride.name} — شاركونا فرحتنا! {url}`,
      messageEn: override.sharing?.messageEn || `🎉 ${groom.nameEn} & ${bride.nameEn}'s Wedding Invitation — Join us on our special day! {url}`,
    },
    meta: {
      ...weddingConfig.meta,
      ...(override.meta || {}),
      titleAr: override.meta?.titleAr || `دعوة زفاف ${groom.name} و${bride.name}`,
      titleEn: override.meta?.titleEn || `${groom.nameEn} & ${bride.nameEn}'s Wedding Invitation`,
    },
    invitationPhraseAr: override.invitationPhraseAr || `تتشرف ${groom.familyTitleAr} و${bride.familyTitleAr} بدعوتكم لحضور حفل زفاف نجليهما`,
    invitationPhraseEn: override.invitationPhraseEn || `${groom.familyTitleEn} & ${bride.familyTitleEn} cordially request the honor of your presence at the wedding of their children`,
  };
};

/**
 * Merges default static configuration with any local storage or passed overrides
 */
export const getActiveConfig = (override = null) => {
  try {
    if (override && typeof override === 'object') {
      return mergeConfig(override);
    }
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(CONFIG_STORAGE_KEY) : null;
    if (!stored) return weddingConfig;

    return mergeConfig(JSON.parse(stored));
  } catch (err) {
    console.error('[ConfigManager] Failed to load config overrides:', err);
    return weddingConfig;
  }
};

/**
 * Save configuration overrides to localStorage and dispatch update event
 */
export const saveActiveConfig = (newConfig) => {
  try {
    const merged = mergeConfig(newConfig);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(merged));
    }
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
 * If Firestore has NO config document yet -> uploads default weddingConfig to Firestore.
 */
export const syncConfigWithFirestore = async (getWeddingConfigFromDB, saveWeddingConfigToDB) => {
  try {
    const cloudConfig = await getWeddingConfigFromDB();
    if (cloudConfig && Object.keys(cloudConfig).length > 0) {
      console.info('[ConfigManager] Priority 1: Loaded wedding config from Firestore DB');
      saveActiveConfig(cloudConfig);
      return cloudConfig;
    } else {
      console.info('[ConfigManager] No config in Firestore yet. Uploading default weddingConfig to Firestore...');
      if (saveWeddingConfigToDB) {
        await saveWeddingConfigToDB(weddingConfig);
      }
      saveActiveConfig(weddingConfig);
      return weddingConfig;
    }
  } catch (err) {
    console.warn('[ConfigManager] Firestore config sync skipped (using local/fallback):', err);
    return getActiveConfig();
  }
};

/**
 * Reset config to original defaults
 */
export const resetActiveConfig = () => {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CONFIG_UPDATE_EVENT, { detail: weddingConfig }));
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
  const groom = cfg.groom || weddingConfig.groom;
  const bride = cfg.bride || weddingConfig.bride;
  const wedding = cfg.wedding || weddingConfig.wedding;
  const venue = cfg.venue || weddingConfig.venue;
  const music = cfg.music || weddingConfig.music;
  const gallery = cfg.gallery || weddingConfig.gallery;
  const dressCode = cfg.dressCode || weddingConfig.dressCode;
  const wishlist = cfg.wishlist || weddingConfig.wishlist;
  const rsvp = cfg.rsvp || weddingConfig.rsvp;
  const sharing = cfg.sharing || weddingConfig.sharing;
  const meta = cfg.meta || weddingConfig.meta;
  const analytics = cfg.analytics || weddingConfig.analytics;

  return `/**
 * ============================================================
 * WEDDING CONFIGURATION — Edit this file to customize your
 * invitation. All wedding-specific data lives here.
 * ============================================================
 */

// ─── 1. COUPLE & FAMILIES (Single Source of Truth) ──────────
const groom = ${JSON.stringify(groom, null, 2)};

const bride = ${JSON.stringify(bride, null, 2)};

// ─── 2. MAIN CONFIGURATION OBJECT ────────────────────────────
const weddingConfig = {
  /**
   * ─── LANGUAGE ─────────────────────────────────────────────
   * Default language for the invitation: 'ar' (Arabic) or 'en' (English)
   */
  defaultLanguage: ${JSON.stringify(cfg.defaultLanguage || "ar")},

  /**
   * ─── COUPLE ──────────────────────────────────────────────
   */
  groom,
  bride,

  // Family Invitation Phrase (Auto-generated from family titles)
  invitationPhraseAr: \`تتشرف \${groom.familyTitleAr} و\${bride.familyTitleAr} بدعوتكم لحضور حفل زفاف نجليهما\`,
  invitationPhraseEn: \`\${groom.familyTitleEn} & \${bride.familyTitleEn} cordially request the honor of your presence at the wedding of their children\`,

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

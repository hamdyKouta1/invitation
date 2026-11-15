import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getActiveConfig,
  saveActiveConfig,
  CONFIG_UPDATE_EVENT,
  mergeConfig,
} from '../utils/configManager.js';
import {
  applyThemeToDOM,
  THEME_PREVIEW_EVENT,
  getTemporaryThemePreview,
} from '../config/themesConfig.js';
import { subscribeWeddingConfigFromDB } from '../services';

const WeddingConfigContext = createContext(null);

const resolveConfigWithPreview = (baseOverride = null) => {
  const base = baseOverride ? mergeConfig(baseOverride) : getActiveConfig();
  const previewTheme = getTemporaryThemePreview();
  const effectiveTheme = previewTheme || base.theme;
  applyThemeToDOM(effectiveTheme);
  return {
    ...base,
    savedTheme: base.theme,
    theme: effectiveTheme,
    isPreviewMode: Boolean(previewTheme),
  };
};

/**
 * WeddingConfigProvider manages the single source of truth for the wedding config.
 * It coordinates:
 * 1. Initial cached config from LocalStorage or static defaults
 * 2. Cross-tab 'storage' events ('wedding_config_override' & 'wedding_active_theme')
 * 3. In-tab custom events (CONFIG_UPDATE_EVENT & THEME_PREVIEW_EVENT)
 * 4. Real-time Firebase Firestore updates via onSnapshot
 */
export const WeddingConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => resolveConfigWithPreview());

  useEffect(() => {
    const syncState = (overrideDetail = null) => {
      setConfig(resolveConfigWithPreview(overrideDetail));
    };

    // 1. Same-window update event (e.g. from AdminPortal)
    const handleCustomEvent = (e) => {
      syncState(e?.detail || null);
    };
    window.addEventListener(CONFIG_UPDATE_EVENT, handleCustomEvent);

    // 2. Temporary theme live preview event (from ThemeManager)
    const handlePreviewEvent = () => {
      syncState(null);
    };
    window.addEventListener(THEME_PREVIEW_EVENT, handlePreviewEvent);

    // 3. Cross-tab storage event (e.g. admin panel updated in another tab)
    const handleStorageEvent = (e) => {
      if (!e.key || e.key === 'wedding_config_override' || e.key === 'wedding_active_theme') {
        if (e.key === 'wedding_config_override' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            syncState(parsed);
            return;
          } catch {
            syncState(null);
            return;
          }
        }
        syncState(null);
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    // 4. Real-time Firebase Firestore listener
    const unsubscribeFirestore = subscribeWeddingConfigFromDB((cloudConfig) => {
      if (cloudConfig && typeof cloudConfig === 'object') {
        console.info('[WeddingConfigProvider] Live config update received from Firestore DB');
        saveActiveConfig(cloudConfig);
        syncState(cloudConfig);
      }
    });

    return () => {
      window.removeEventListener(CONFIG_UPDATE_EVENT, handleCustomEvent);
      window.removeEventListener(THEME_PREVIEW_EVENT, handlePreviewEvent);
      window.removeEventListener('storage', handleStorageEvent);
      if (typeof unsubscribeFirestore === 'function') {
        unsubscribeFirestore();
      }
    };
  }, []);

  return (
    <WeddingConfigContext.Provider value={config}>
      {children}
    </WeddingConfigContext.Provider>
  );
};

/**
 * Reactive hook that reads from WeddingConfigContext when inside WeddingConfigProvider,
 * or maintains a local reactive listener if mounted outside the provider (e.g. AdminApp).
 */
export const useWeddingConfig = () => {
  const context = useContext(WeddingConfigContext);
  const [fallbackConfig, setFallbackConfig] = useState(() => resolveConfigWithPreview());

  useEffect(() => {
    if (context) return;

    const syncFallback = (e) => {
      setFallbackConfig(resolveConfigWithPreview(e?.detail || null));
    };

    const handleStorage = (e) => {
      if (!e.key || e.key === 'wedding_config_override' || e.key === 'wedding_active_theme') {
        setFallbackConfig(resolveConfigWithPreview());
      }
    };

    window.addEventListener(CONFIG_UPDATE_EVENT, syncFallback);
    window.addEventListener(THEME_PREVIEW_EVENT, syncFallback);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CONFIG_UPDATE_EVENT, syncFallback);
      window.removeEventListener(THEME_PREVIEW_EVENT, syncFallback);
      window.removeEventListener('storage', handleStorage);
    };
  }, [context]);

  return context || fallbackConfig;
};

export default WeddingConfigContext;

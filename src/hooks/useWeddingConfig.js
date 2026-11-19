import { useState, useEffect } from 'react';
import { getActiveConfig, CONFIG_UPDATE_EVENT } from '../utils/configManager';
import {
  applyThemeToDOM,
  THEME_PREVIEW_EVENT,
  getTemporaryThemePreview,
} from '../config/themesConfig';

/**
 * Reactive Hook to access the live wedding configuration and active/preview theme.
 *
 * Priority order for saved config:
 * 1. Cloud Firestore Database (`config/wedding` document)
 * 2. LocalStorage cache (`wedding_config_override`)
 * 3. Static configuration (`weddingConfig.js`)
 *
 * Also supports temporary Admin Live Preview Mode without mutating persisted state.
 */
export const useWeddingConfig = () => {
  const [config, setConfig] = useState(() => {
    const base = getActiveConfig();
    const previewTheme = getTemporaryThemePreview();
    return previewTheme
      ? { ...base, savedTheme: base.theme, theme: previewTheme, isPreviewMode: true }
      : { ...base, savedTheme: base.theme, isPreviewMode: false };
  });

  useEffect(() => {
    const syncState = () => {
      const updated = getActiveConfig();
      const previewTheme = getTemporaryThemePreview();
      const effectiveTheme = previewTheme || updated.theme;
      applyThemeToDOM(effectiveTheme);
      setConfig({
        ...updated,
        savedTheme: updated.theme,
        theme: effectiveTheme,
        isPreviewMode: Boolean(previewTheme),
      });
    };

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'wedding_config_override' || e.key === 'wedding_active_theme') {
        syncState();
      }
    };

    window.addEventListener(CONFIG_UPDATE_EVENT, syncState);
    window.addEventListener(THEME_PREVIEW_EVENT, syncState);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener(CONFIG_UPDATE_EVENT, syncState);
      window.removeEventListener(THEME_PREVIEW_EVENT, syncState);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return config;
};

export default useWeddingConfig;

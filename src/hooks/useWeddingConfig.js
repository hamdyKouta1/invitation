import { useState, useEffect } from 'react';
import { getActiveConfig, CONFIG_UPDATE_EVENT } from '../utils/configManager';
import { applyThemeToDOM } from '../config/themesConfig';

/**
 * Reactive Hook to access the live wedding configuration.
 *
 * Priority order:
 * 1. Cloud Firestore Database (`config/wedding` document)
 * 2. LocalStorage cache (`wedding_config_override`)
 * 3. Static configuration (`weddingConfig.js`)
 *
 * Automatically updates when config changes anywhere in the app, across tabs, or from Firestore.
 */
export const useWeddingConfig = () => {
  const [config, setConfig] = useState(() => getActiveConfig());

  useEffect(() => {
    const handleConfigChange = () => {
      const updated = getActiveConfig();
      applyThemeToDOM(updated.theme);
      setConfig(updated);
    };

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'wedding_config_override' || e.key === 'wedding_active_theme') {
        handleConfigChange();
      }
    };

    window.addEventListener(CONFIG_UPDATE_EVENT, handleConfigChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener(CONFIG_UPDATE_EVENT, handleConfigChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return config;
};

export default useWeddingConfig;

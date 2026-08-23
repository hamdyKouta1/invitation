import { useState, useEffect } from 'react';
import { getActiveConfig, CONFIG_UPDATE_EVENT } from '../utils/configManager';

/**
 * Reactive Hook to access the live wedding configuration.
 *
 * Priority order:
 * 1. Cloud Firestore Database (`config/wedding` document)
 * 2. LocalStorage cache (`wedding_config_override`)
 * 3. Static configuration (`weddingConfig.js`)
 *
 * Automatically updates when config changes anywhere in the app or from Firestore.
 */
export const useWeddingConfig = () => {
  const [config, setConfig] = useState(() => getActiveConfig());

  useEffect(() => {
    const handleConfigChange = (e) => {
      if (e.detail) {
        setConfig(e.detail);
      } else {
        setConfig(getActiveConfig());
      }
    };

    window.addEventListener(CONFIG_UPDATE_EVENT, handleConfigChange);
    return () => window.removeEventListener(CONFIG_UPDATE_EVENT, handleConfigChange);
  }, []);

  return config;
};

export default useWeddingConfig;

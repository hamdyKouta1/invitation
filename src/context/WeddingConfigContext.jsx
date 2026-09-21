import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveConfig, saveActiveConfig, CONFIG_UPDATE_EVENT, mergeConfig } from '../utils/configManager';
import { subscribeWeddingConfigFromDB } from '../services';

const WeddingConfigContext = createContext(getActiveConfig());

/**
 * WeddingConfigProvider manages the single source of truth for the wedding config.
 * It coordinates:
 * 1. Initial cached config from LocalStorage or static defaults
 * 2. Cross-tab 'storage' events
 * 3. In-tab custom events (CONFIG_UPDATE_EVENT)
 * 4. Real-time Firebase Firestore updates via onSnapshot
 */
export const WeddingConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => getActiveConfig());

  useEffect(() => {
    // 1. Same-window update event (e.g. from AdminPortal)
    const handleCustomEvent = (e) => {
      if (e.detail) {
        setConfig(mergeConfig(e.detail));
      } else {
        setConfig(getActiveConfig());
      }
    };
    window.addEventListener(CONFIG_UPDATE_EVENT, handleCustomEvent);

    // 2. Cross-tab storage event (e.g. admin panel updated in another tab)
    const handleStorageEvent = (e) => {
      if (e.key === 'wedding_config_override' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig(mergeConfig(parsed));
        } catch {
          setConfig(getActiveConfig());
        }
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    // 3. Real-time Firebase Firestore listener
    const unsubscribeFirestore = subscribeWeddingConfigFromDB((cloudConfig) => {
      if (cloudConfig && typeof cloudConfig === 'object') {
        console.info('[WeddingConfigProvider] Live config update received from Firestore DB');
        saveActiveConfig(cloudConfig);
        setConfig(mergeConfig(cloudConfig));
      }
    });

    return () => {
      window.removeEventListener(CONFIG_UPDATE_EVENT, handleCustomEvent);
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

export const useWeddingConfig = () => {
  const context = useContext(WeddingConfigContext);
  return context || getActiveConfig();
};

export default WeddingConfigContext;

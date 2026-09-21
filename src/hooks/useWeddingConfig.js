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
export { useWeddingConfig, useWeddingConfig as default } from '../context/WeddingConfigContext';

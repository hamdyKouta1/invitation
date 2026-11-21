/**
 * ============================================================================
 * FIREBASE CONFIGURATION (Per-Customer Project Isolation — Phase 4)
 * ============================================================================
 * IMPORTANT DISTINCTION:
 * - Firebase Web Configuration (VITE_FIREBASE_*) is public client initialization
 *   config pointing strictly to THIS customer's dedicated Firebase project.
 * - Privileged Firebase Admin SDK service-account private keys must NEVER be
 *   placed in frontend code, public repositories, or VITE_* variables.
 * - Security is enforced by Firebase Authentication + Firestore Security Rules.
 * ============================================================================
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigValid = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !String(firebaseConfig.projectId).includes('your_project_id')
  );
};

export const getFirebaseProjectInfo = () => ({
  projectId: firebaseConfig.projectId || null,
  authDomain: firebaseConfig.authDomain || null,
  isConfigured: isFirebaseConfigValid(),
  customerSlug: import.meta.env.VITE_CUSTOMER_SLUG || firebaseConfig.projectId || 'default',
});

// Prevent duplicate initialization in HMR environments
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const db   = getFirestore(app);
export const auth = getAuth(app);
export default app;

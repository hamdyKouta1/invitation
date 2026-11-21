/**
 * ============================================================================
 * CUSTOMER DASHBOARD AUTHENTICATION SERVICE (Firebase Auth — Phase 4 & 5)
 * ============================================================================
 * Replaces insecure client-side password & sessionStorage OTP checks (SEC-001, SEC-002)
 * with cryptographic Firebase Authentication scoped strictly to the customer's
 * dedicated Firebase project.
 * ============================================================================
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, isFirebaseConfigValid } from './config';

/**
 * Sign in a customer to their dedicated Firebase project's Customer Dashboard.
 */
export const loginCustomerWithFirebase = async (email, password) => {
  if (!isFirebaseConfigValid()) {
    throw new Error('firebase_not_configured');
  }
  const trimmedEmail = String(email || '').trim();
  const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
  return {
    uid: credential.user.uid,
    email: credential.user.email,
  };
};

/**
 * Sign out the currently authenticated customer.
 */
export const logoutCustomerFromFirebase = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('[FirebaseAuth] Sign out warning:', err);
  }
};

/**
 * Send a password reset email via the customer's Firebase Auth project.
 */
export const sendCustomerPasswordReset = async (email) => {
  if (!isFirebaseConfigValid()) {
    throw new Error('firebase_not_configured');
  }
  const trimmedEmail = String(email || '').trim();
  await sendPasswordResetEmail(auth, trimmedEmail);
  return { success: true };
};

/**
 * Subscribe to Firebase Authentication state changes for the Customer Dashboard.
 */
export const subscribeCustomerAuth = (callback) => {
  if (!isFirebaseConfigValid()) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
      });
    } else {
      callback(null);
    }
  });
};

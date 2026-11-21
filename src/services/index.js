/**
 * Service Index — Dual Mode (Mock / Per-Customer Firebase)
 *
 * Set VITE_FIREBASE_ENABLED=true in .env to connect to the customer's
 * dedicated Firebase project.
 */

import { getScopedStorageKey } from '../utils/security.js';

const FIREBASE_ENABLED = import.meta.env.VITE_FIREBASE_ENABLED === 'true';

// ─── Customer Authentication (Firebase Auth — Phase 4 & 5) ────
export const loginCustomer = async (email, password) => {
  if (FIREBASE_ENABLED) {
    const { loginCustomerWithFirebase } = await import('./firebase/auth.js');
    return loginCustomerWithFirebase(email, password);
  }
  throw new Error('firebase_auth_required');
};

export const logoutCustomer = async () => {
  if (FIREBASE_ENABLED) {
    const { logoutCustomerFromFirebase } = await import('./firebase/auth.js');
    return logoutCustomerFromFirebase();
  }
};

export const sendPasswordReset = async (email) => {
  if (FIREBASE_ENABLED) {
    const { sendCustomerPasswordReset } = await import('./firebase/auth.js');
    return sendCustomerPasswordReset(email);
  }
  throw new Error('firebase_auth_required');
};

export const subscribeCustomerAuthState = (callback) => {
  if (FIREBASE_ENABLED) {
    let unsubscribe = null;
    let cancelled = false;
    import('./firebase/auth.js')
      .then(({ subscribeCustomerAuth }) => {
        if (!cancelled) {
          unsubscribe = subscribeCustomerAuth(callback);
        }
      })
      .catch(() => callback(null));
    return () => {
      cancelled = true;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }
  callback(null);
  return () => {};
};

// ─── RSVP ─────────────────────────────────────────────────────
export const submitRSVP = async (data) => {
  if (FIREBASE_ENABLED) {
    const { submitRSVP: fn } = await import('./firebase/firestore.js');
    return fn(data);
  } else {
    const { submitRSVP: fn } = await import('./mock/mockService.js');
    return fn(data);
  }
};

export const checkAlreadySubmitted = () => {
  return localStorage.getItem(getScopedStorageKey('wedding_rsvp_submitted')) === 'true';
};

export const getWishes = async () => {
  if (FIREBASE_ENABLED) {
    const { getWishes: fn } = await import('./firebase/firestore.js');
    return fn();
  } else {
    const { getWishes: fn } = await import('./mock/mockService.js');
    return fn();
  }
};

export const deleteWish = async (id) => {
  if (FIREBASE_ENABLED) {
    const { deleteWish: fn } = await import('./firebase/firestore.js');
    return fn(id);
  } else {
    const { deleteWish: fn } = await import('./mock/mockService.js');
    return fn(id);
  }
};

// ─── Gallery ──────────────────────────────────────────────────
export const getGalleryImages = async () => {
  if (FIREBASE_ENABLED) {
    const { getGalleryImages: fn } = await import('./firebase/firestore.js');
    return fn();
  } else {
    const { getGalleryImages: fn } = await import('./mock/mockService.js');
    return fn();
  }
};

export const addGalleryImage = async (imageData) => {
  if (FIREBASE_ENABLED) {
    const { addGalleryImage: fn } = await import('./firebase/firestore.js');
    return fn(imageData);
  } else {
    const { addGalleryImage: fn } = await import('./mock/mockService.js');
    return fn(imageData);
  }
};

export const deleteGalleryImage = async (id) => {
  if (FIREBASE_ENABLED) {
    const { deleteGalleryImage: fn } = await import('./firebase/firestore.js');
    return fn(id);
  } else {
    const { deleteGalleryImage: fn } = await import('./mock/mockService.js');
    return fn(id);
  }
};

export const saveGalleryImages = async (images) => {
  if (FIREBASE_ENABLED) {
    const { saveGalleryImages: fn } = await import('./firebase/firestore.js');
    return fn(images);
  } else {
    const { saveGalleryImages: fn } = await import('./mock/mockService.js');
    return fn(images);
  }
};

export const resetGalleryImages = async () => {
  if (FIREBASE_ENABLED) {
    const { clearAllGalleryImages, addGalleryImage: addFn } = await import('./firebase/firestore.js');
    const { mockGalleryImages } = await import('./mock/mockData.js');
    if (clearAllGalleryImages) {
      await clearAllGalleryImages();
    }
    for (const img of mockGalleryImages) {
      await addFn(img);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gallery_updated'));
    }
    return { success: true };
  }
  const { resetGalleryImages: fn } = await import('./mock/mockService.js');
  const res = await fn();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gallery_updated'));
  }
  return res;
};

// ─── Guest Management (Customer Dashboard) ────────────────────
export const getGuests = async () => {
  if (FIREBASE_ENABLED) {
    const { getGuests: fn } = await import('./firebase/firestore.js');
    return fn();
  } else {
    const { getGuests: fn } = await import('./mock/mockService.js');
    return fn();
  }
};

export const addGuest = async (guestData) => {
  if (FIREBASE_ENABLED) {
    const { addGuest: fn } = await import('./firebase/firestore.js');
    return fn(guestData);
  } else {
    const { addGuest: fn } = await import('./mock/mockService.js');
    return fn(guestData);
  }
};

export const updateGuest = async (id, updatedData) => {
  if (FIREBASE_ENABLED) {
    const { updateGuest: fn } = await import('./firebase/firestore.js');
    return fn(id, updatedData);
  } else {
    const { updateGuest: fn } = await import('./mock/mockService.js');
    return fn(id, updatedData);
  }
};

export const deleteGuest = async (id) => {
  if (FIREBASE_ENABLED) {
    const { deleteGuest: fn } = await import('./firebase/firestore.js');
    return fn(id);
  } else {
    const { deleteGuest: fn } = await import('./mock/mockService.js');
    return fn(id);
  }
};

export const clearAllGuests = async () => {
  if (FIREBASE_ENABLED) {
    const { clearAllGuests: fn } = await import('./firebase/firestore.js');
    return fn();
  } else {
    const { clearAllGuests: fn } = await import('./mock/mockService.js');
    return fn();
  }
};

// ─── Event / Wedding Config DB Sync ────────────────────────────
export const getWeddingConfigFromDB = async () => {
  if (FIREBASE_ENABLED) {
    const { getWeddingConfigFirestore } = await import('./firebase/firestore.js');
    return getWeddingConfigFirestore();
  }
  return null;
};

export const saveWeddingConfigToDB = async (config) => {
  if (FIREBASE_ENABLED) {
    const { saveWeddingConfigFirestore } = await import('./firebase/firestore.js');
    return saveWeddingConfigFirestore(config);
  }
  return { success: true };
};

export const subscribeWeddingConfigFromDB = (callback) => {
  if (FIREBASE_ENABLED) {
    let unsubscribe = null;
    let isCancelled = false;

    import('./firebase/firestore.js')
      .then(({ subscribeWeddingConfigFirestore }) => {
        if (!isCancelled) {
          unsubscribe = subscribeWeddingConfigFirestore(callback);
        }
      })
      .catch((err) => {
        console.warn('[Service] Failed to load Firestore config subscription:', err);
      });

    return () => {
      isCancelled = true;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }
  return () => {};
};

// ─── Wishlist ──────────────────────────────────────────────────
export const getWishlistItems = async () => {
  if (FIREBASE_ENABLED) {
    const { getWishlistItems: fn } = await import('./firebase/firestore.js');
    return fn();
  } else {
    const { getWishlistItems: fn } = await import('./mock/mockService.js');
    return fn();
  }
};

export const reserveWishlistItem = async (itemId, guestName) => {
  if (FIREBASE_ENABLED) {
    const { reserveWishlistItem: fn } = await import('./firebase/firestore.js');
    return fn(itemId, guestName);
  } else {
    const { reserveWishlistItem: fn } = await import('./mock/mockService.js');
    return fn(itemId, guestName);
  }
};

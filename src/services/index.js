/**
 * Service Index — Dual Mode (Mock / Firebase)
 *
 * Set VITE_FIREBASE_ENABLED=true in .env to switch to Firebase.
 * The UI layer always imports from this file, never directly
 * from firebase/ or mock/ directories.
 */

const FIREBASE_ENABLED = import.meta.env.VITE_FIREBASE_ENABLED === 'true';

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
  return localStorage.getItem('wedding_rsvp_submitted') === 'true';
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

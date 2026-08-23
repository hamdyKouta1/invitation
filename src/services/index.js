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
    // In Firestore mode, "reset" means delete all gallery docs and re-insert defaults
    const { clearAllGalleryImages, addGalleryImage: addFn } = await import('./firebase/firestore.js');
    const { mockGalleryImages } = await import('./mock/mockData.js');
    if (clearAllGalleryImages) {
      await clearAllGalleryImages();
    }
    for (const img of mockGalleryImages) {
      await addFn(img);
    }
    window.dispatchEvent(new CustomEvent('gallery_updated'));
    return { success: true };
  }
  const { resetGalleryImages: fn } = await import('./mock/mockService.js');
  const res = await fn();
  window.dispatchEvent(new CustomEvent('gallery_updated'));
  return res;
};

// ─── Guest Management (Admin) ─────────────────────────────────
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

// ─── Wedding Config DB Sync ────────────────────────────────────
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

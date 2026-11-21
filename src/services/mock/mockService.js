/**
 * Mock Service — Simulates Firebase service calls using
 * customer-namespaced localStorage and in-memory mock data.
 *
 * This is a drop-in replacement for the Firebase service
 * when VITE_FIREBASE_ENABLED !== 'true'.
 */

import { mockGalleryImages, mockWishlistItems } from './mockData.js';
import { getScopedStorageKey, getCustomerNamespace, isSafeImageUrl } from '../../utils/security.js';

const getRsvpKey = () => getScopedStorageKey('wedding_rsvp_submitted');
const getRsvpStoreKey = () => getScopedStorageKey('wedding_rsvps');
const getWishesStoreKey = () => getScopedStorageKey('wedding_wishes');
const getGalleryStoreKey = () => getScopedStorageKey('wedding_gallery_images');
const getWishlistKey = () => getScopedStorageKey('wedding_wishlist_reserved');

// ─── Simulate network delay ──────────────────────────────────
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// ─── RSVP ────────────────────────────────────────────────────
export const checkAlreadySubmitted = () => {
  return localStorage.getItem(getRsvpKey()) === 'true';
};

export const submitRSVP = async (data) => {
  await delay(300);

  if (checkAlreadySubmitted()) {
    throw new Error('already_submitted');
  }

  const nowIso = new Date().toISOString();
  const rsvpId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const rsvp = {
    ...data,
    id: rsvpId,
    createdAt: nowIso,
  };

  const existing = JSON.parse(localStorage.getItem(getRsvpStoreKey()) || '[]');
  existing.push(rsvp);
  localStorage.setItem(getRsvpStoreKey(), JSON.stringify(existing));

  // Separate public wish storage (PII-free: name + message only — SEC-005)
  if (data.message && String(data.message).trim().length > 0) {
    const wishes = JSON.parse(localStorage.getItem(getWishesStoreKey()) || '[]');
    wishes.push({
      id: `wish-${rsvpId}`,
      rsvpId,
      name: data.name,
      message: String(data.message).trim(),
      createdAt: nowIso,
    });
    localStorage.setItem(getWishesStoreKey(), JSON.stringify(wishes));
  }

  localStorage.setItem(getRsvpKey(), 'true');
  return { success: true, id: rsvp.id };
};

// ─── Wishes (PII-free public wishes — SEC-005 & CFG-007) ──────
export const getWishes = async () => {
  await delay(150);
  const dedicatedWishes = JSON.parse(localStorage.getItem(getWishesStoreKey()) || '[]');
  const storedRsvps = JSON.parse(localStorage.getItem(getRsvpStoreKey()) || '[]');

  // Combine dedicated wishes + any legacy RSVP messages (stripping phone numbers!)
  const combinedMap = new Map();
  for (const w of dedicatedWishes) {
    if (w && w.message && String(w.message).trim().length > 0) {
      combinedMap.set(w.rsvpId || w.id, {
        id: w.id,
        name: w.name,
        message: w.message,
        createdAt: w.createdAt || new Date().toISOString(),
      });
    }
  }
  for (const r of storedRsvps) {
    if (r && r.message && String(r.message).trim().length > 0 && !combinedMap.has(r.id)) {
      combinedMap.set(r.id, {
        id: r.id,
        name: r.name,
        message: r.message,
        createdAt: r.createdAt || new Date().toISOString(),
      });
    }
  }

  const userWishes = Array.from(combinedMap.values());

  // CFG-007: Only include sample wishes in local default dev demo mode when no customer namespace is active
  const isDevDefaultDemo =
    typeof import.meta !== 'undefined' &&
    import.meta.env?.DEV === true &&
    getCustomerNamespace() === 'default' &&
    userWishes.length === 0;

  if (!isDevDefaultDemo) {
    return userWishes;
  }

  return [
    {
      id: 'sample-1',
      name: 'عائلة الأستاذ محمد علي',
      message: 'ألف ألف مبروك! بارك الله لكما وجمع بينكما في خير ودام بينكما الود والسعادة.',
    },
    {
      id: 'sample-2',
      name: 'د. محمود و سارة',
      message: 'Warmest congratulations! Wishing you a lifetime of infinite love, joy, and happiness.',
    },
  ];
};

export const deleteWish = async (id) => {
  await delay(150);
  const wishes = JSON.parse(localStorage.getItem(getWishesStoreKey()) || '[]');
  const filteredWishes = wishes.filter((w) => w.id !== id && w.rsvpId !== id);
  localStorage.setItem(getWishesStoreKey(), JSON.stringify(filteredWishes));

  // Also clear message on matching RSVP if id matches an RSVP
  const existing = JSON.parse(localStorage.getItem(getRsvpStoreKey()) || '[]');
  const updated = existing.map((g) => (g.id === id ? { ...g, message: '' } : g));
  localStorage.setItem(getRsvpStoreKey(), JSON.stringify(updated));
  return { success: true };
};

// ─── Gallery ──────────────────────────────────────────────────
const _getStoredGallery = () => {
  try {
    const stored = localStorage.getItem(getGalleryStoreKey());
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const _saveStoredGallery = (images) => {
  localStorage.setItem(getGalleryStoreKey(), JSON.stringify(images));
};

export const getGalleryImages = async () => {
  await delay(200);
  const stored = _getStoredGallery();
  return stored ?? mockGalleryImages;
};

export const addGalleryImage = async (imageData) => {
  await delay(200);
  if (!isSafeImageUrl(imageData?.url)) {
    throw new Error('Unsafe or invalid image URL');
  }
  const current = _getStoredGallery() ?? [...mockGalleryImages];
  const orderVal = parseInt(imageData.order, 10);
  const newImage = {
    ...imageData,
    id: `mock-${Date.now()}`,
    order: !isNaN(orderVal) ? orderVal : current.length + 1,
    createdAt: new Date().toISOString(),
  };
  current.push(newImage);
  current.sort((a, b) => (a.order || 0) - (b.order || 0));
  _saveStoredGallery(current);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gallery_updated'));
  }
  return newImage;
};

export const deleteGalleryImage = async (id) => {
  await delay(150);
  const current = _getStoredGallery() ?? [...mockGalleryImages];
  const filtered = current.filter((img) => img.id !== id);
  _saveStoredGallery(filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gallery_updated'));
  }
  return { success: true };
};

export const saveGalleryImages = async (images) => {
  await delay(150);
  _saveStoredGallery(images);
  return images;
};

export const resetGalleryImages = async () => {
  await delay(150);
  localStorage.removeItem(getGalleryStoreKey());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gallery_updated'));
  }
  return mockGalleryImages;
};

// ─── Guest Management (Customer Dashboard) ────────────────────
export const getGuests = async () => {
  await delay(150);
  return JSON.parse(localStorage.getItem(getRsvpStoreKey()) || '[]');
};

export const addGuest = async (guestData) => {
  await delay(150);
  const existing = JSON.parse(localStorage.getItem(getRsvpStoreKey()) || '[]');
  const nowIso = new Date().toISOString();
  const newGuest = {
    ...guestData,
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: nowIso,
  };
  existing.push(newGuest);
  localStorage.setItem(getRsvpStoreKey(), JSON.stringify(existing));

  if (guestData.message && String(guestData.message).trim().length > 0) {
    const wishes = JSON.parse(localStorage.getItem(getWishesStoreKey()) || '[]');
    wishes.push({
      id: `wish-${newGuest.id}`,
      rsvpId: newGuest.id,
      name: guestData.name,
      message: String(guestData.message).trim(),
      createdAt: nowIso,
    });
    localStorage.setItem(getWishesStoreKey(), JSON.stringify(wishes));
  }

  return newGuest;
};

export const updateGuest = async (id, updatedData) => {
  await delay(150);
  const existing = JSON.parse(localStorage.getItem(getRsvpStoreKey()) || '[]');
  const idx = existing.findIndex((g) => g.id === id);
  if (idx !== -1) {
    existing[idx] = { ...existing[idx], ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem(getRsvpStoreKey(), JSON.stringify(existing));
    return existing[idx];
  }
  throw new Error('Guest not found');
};

export const deleteGuest = async (id) => {
  await delay(150);
  const existing = JSON.parse(localStorage.getItem(getRsvpStoreKey()) || '[]');
  const filtered = existing.filter((g) => g.id !== id);
  localStorage.setItem(getRsvpStoreKey(), JSON.stringify(filtered));

  // Also remove any associated wish from public wishes store
  const wishes = JSON.parse(localStorage.getItem(getWishesStoreKey()) || '[]');
  localStorage.setItem(
    getWishesStoreKey(),
    JSON.stringify(wishes.filter((w) => w.rsvpId !== id && w.id !== id))
  );
  return { success: true };
};

export const clearAllGuests = async () => {
  await delay(150);
  localStorage.removeItem(getRsvpStoreKey());
  localStorage.removeItem(getWishesStoreKey());
  return { success: true };
};

// ─── Wishlist ─────────────────────────────────────────────────
export const getWishlistItems = async () => {
  await delay(150);
  const reserved = JSON.parse(localStorage.getItem(getWishlistKey()) || '{}');
  return mockWishlistItems.map((item) => ({
    ...item,
    status: reserved[item.id] || item.status,
    reservedBy: reserved[`${item.id}_name`] || null,
  }));
};

export const reserveWishlistItem = async (itemId, guestName) => {
  await delay(200);
  const reserved = JSON.parse(localStorage.getItem(getWishlistKey()) || '{}');

  if (reserved[itemId] && reserved[itemId] !== 'available') {
    throw new Error('already_reserved');
  }

  reserved[itemId] = 'reserved';
  reserved[`${itemId}_name`] = guestName;
  localStorage.setItem(getWishlistKey(), JSON.stringify(reserved));
  return { success: true };
};

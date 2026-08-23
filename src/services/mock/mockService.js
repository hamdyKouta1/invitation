/**
 * Mock Service — Simulates Firebase service calls using
 * localStorage and in-memory mock data.
 *
 * This is a drop-in replacement for the Firebase service
 * when VITE_FIREBASE_ENABLED !== 'true'.
 */

import { mockGalleryImages, mockWishlistItems } from './mockData';

const RSVP_KEY = 'wedding_rsvp_submitted';
const RSVP_STORE_KEY = 'wedding_rsvps';
const GALLERY_STORE_KEY = 'wedding_gallery_images';
const WISHLIST_KEY = 'wedding_wishlist_reserved';

// ─── Simulate network delay ──────────────────────────────────
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─── RSVP ────────────────────────────────────────────────────
export const checkAlreadySubmitted = () => {
  return localStorage.getItem(RSVP_KEY) === 'true';
};

export const submitRSVP = async (data) => {
  await delay(800);

  if (checkAlreadySubmitted()) {
    throw new Error('already_submitted');
  }

  const rsvp = {
    ...data,
    id: `mock-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem(RSVP_STORE_KEY) || '[]');
  existing.push(rsvp);
  localStorage.setItem(RSVP_STORE_KEY, JSON.stringify(existing));
  localStorage.setItem(RSVP_KEY, 'true');

  console.info('[MockService] RSVP submitted:', rsvp);
  return { success: true, id: rsvp.id };
};

// ─── Wishes ───────────────────────────────────────────────────
export const getWishes = async () => {
  await delay(300);
  const stored = JSON.parse(localStorage.getItem(RSVP_STORE_KEY) || '[]');
  const wishesFromStore = stored
    .filter((item) => item.message && item.message.trim().length > 0)
    .map((item) => ({
      id: item.id || `wish-${Math.random()}`,
      name: item.name,
      message: item.message,
      createdAt: item.createdAt || new Date().toISOString(),
    }));

  const mockSampleWishes = [
    {
      id: 'sample-1',
      name: 'عائلة الأستاذ محمد علي',
      message: 'ألف ألف مبروك لأجمل عروسين حمدى ورودينا! بارك الله لكما وجمع بينكما في خير ودام بينكما الود والسعادة.',
    },
    {
      id: 'sample-2',
      name: 'د. محمود و سارة',
      message: 'Warmest congratulations to Hamdy & Rodina! Wishing you both a lifetime of infinite love, joy, and togetherness.',
    },
    {
      id: 'sample-3',
      name: 'المهندس أحمد مصطفى',
      message: 'أسمى آيات التهاني والتبريكات بمناسبة هذا الزفاف الميمون. دامت دياركم عامرة بالفرح والمسرات.',
    },
  ];

  return [...wishesFromStore, ...mockSampleWishes];
};

// ─── Gallery ──────────────────────────────────────────────────
const _getStoredGallery = () => {
  try {
    const stored = localStorage.getItem(GALLERY_STORE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const _saveStoredGallery = (images) => {
  localStorage.setItem(GALLERY_STORE_KEY, JSON.stringify(images));
};

export const getGalleryImages = async () => {
  await delay(400);
  const stored = _getStoredGallery();
  return stored ?? mockGalleryImages;
};

export const addGalleryImage = async (imageData) => {
  await delay(400);
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
  window.dispatchEvent(new CustomEvent('gallery_updated'));
  return newImage;
};

export const deleteGalleryImage = async (id) => {
  await delay(300);
  const current = _getStoredGallery() ?? [...mockGalleryImages];
  const filtered = current.filter((img) => img.id !== id);
  _saveStoredGallery(filtered);
  window.dispatchEvent(new CustomEvent('gallery_updated'));
  return { success: true };
};

export const saveGalleryImages = async (images) => {
  await delay(200);
  _saveStoredGallery(images);
  return images;
};

export const resetGalleryImages = async () => {
  await delay(300);
  localStorage.removeItem(GALLERY_STORE_KEY);
  window.dispatchEvent(new CustomEvent('gallery_updated'));
  return mockGalleryImages;
};

// ─── Guest Management (Admin) ─────────────────────────────────
export const getGuests = async () => {
  await delay(400);
  return JSON.parse(localStorage.getItem(RSVP_STORE_KEY) || '[]');
};

export const addGuest = async (guestData) => {
  await delay(400);
  const existing = JSON.parse(localStorage.getItem(RSVP_STORE_KEY) || '[]');
  const newGuest = {
    ...guestData,
    id: `mock-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  existing.push(newGuest);
  localStorage.setItem(RSVP_STORE_KEY, JSON.stringify(existing));
  return newGuest;
};

export const updateGuest = async (id, updatedData) => {
  await delay(400);
  const existing = JSON.parse(localStorage.getItem(RSVP_STORE_KEY) || '[]');
  const idx = existing.findIndex((g) => g.id === id);
  if (idx !== -1) {
    existing[idx] = { ...existing[idx], ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem(RSVP_STORE_KEY, JSON.stringify(existing));
    return existing[idx];
  }
  throw new Error('Guest not found');
};

export const deleteGuest = async (id) => {
  await delay(300);
  const existing = JSON.parse(localStorage.getItem(RSVP_STORE_KEY) || '[]');
  const filtered = existing.filter((g) => g.id !== id);
  localStorage.setItem(RSVP_STORE_KEY, JSON.stringify(filtered));
  return { success: true };
};

export const clearAllGuests = async () => {
  await delay(300);
  localStorage.removeItem(RSVP_STORE_KEY);
  return { success: true };
};

// ─── Wishlist ─────────────────────────────────────────────────
export const getWishlistItems = async () => {
  await delay(400);

  const reserved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '{}');
  return mockWishlistItems.map((item) => ({
    ...item,
    status: reserved[item.id] || item.status,
    reservedBy: reserved[`${item.id}_name`] || null,
  }));
};

export const reserveWishlistItem = async (itemId, guestName) => {
  await delay(600);

  const reserved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '{}');

  if (reserved[itemId] && reserved[itemId] !== 'available') {
    throw new Error('already_reserved');
  }

  reserved[itemId] = 'reserved';
  reserved[`${itemId}_name`] = guestName;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(reserved));

  console.info('[MockService] Wishlist item reserved:', itemId, 'by', guestName);
  return { success: true };
};

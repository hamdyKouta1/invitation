/**
 * Firebase Firestore Service
 *
 * Implements the same API surface as mockService.js
 * so the UI layer remains unchanged when switching modes.
 *
 * Firestore Data Model:
 * ┌─────────────────────────────────────────────────┐
 * │ rsvps/{auto-id}                                 │
 * │   name, phone, guestsCount, attendance,         │
 * │   language, createdAt, invitationId             │
 * ├─────────────────────────────────────────────────┤
 * │ gallery/{auto-id}                               │
 * │   url, alt, aspectRatio, order, createdAt       │
 * ├─────────────────────────────────────────────────┤
 * │ wishlist/{item-id}                              │
 * │   title, titleAr, description, descriptionAr,  │
 * │   price, currency, status, link, imageUrl,      │
 * │   reservedBy, createdAt                         │
 * └─────────────────────────────────────────────────┘
 */

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit,
} from 'firebase/firestore';
import { db } from './config';
import weddingConfig from '../../config/weddingConfig';

// ─── RSVP ─────────────────────────────────────────────────────
export const checkAlreadySubmitted = () => {
  return localStorage.getItem('wedding_rsvp_submitted') === 'true';
};

export const submitRSVP = async (data) => {
  if (checkAlreadySubmitted()) {
    throw new Error('already_submitted');
  }

  try {
    const docRef = await addDoc(collection(db, 'rsvps'), {
      name:         data.name,
      phone:        data.phone || '',
      guestsCount:  data.guestsCount,
      attendance:   data.attendance,
      message:      data.message || '',
      language:     data.language || 'ar',
      invitationId: weddingConfig.rsvp.invitationId,
      createdAt:    serverTimestamp(),
    });

    localStorage.setItem('wedding_rsvp_submitted', 'true');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('[FirebaseService] RSVP submission failed:', error);
    throw error;
  }
};

// ─── Wishes ───────────────────────────────────────────────────
export const getWishes = async () => {
  try {
    const q = query(
      collection(db, 'rsvps'),
      orderBy('createdAt', 'desc'),
      limit(40)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        message: doc.data().message,
        createdAt: doc.data().createdAt,
      }))
      .filter((w) => w.message && w.message.trim().length > 0);
  } catch (error) {
    console.error('[FirebaseService] Load wishes failed:', error);
    return [];
  }
};

// ─── Google Drive URL Transformer ──────────────────────────────
export const transformGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('lh3.googleusercontent.com/d/')) return url;
  
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return url;
};

// ─── Gallery ──────────────────────────────────────────────────
export const getGalleryImages = async () => {
  try {
    const q = query(
      collection(db, 'gallery'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        url: transformGoogleDriveUrl(data.url),
      };
    });
  } catch (error) {
    console.error('[FirebaseService] Gallery load failed:', error);
    throw error;
  }
};

// ─── Wishlist ──────────────────────────────────────────────────
export const getWishlistItems = async () => {
  try {
    const q = query(
      collection(db, 'wishlist'),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[FirebaseService] Wishlist load failed:', error);
    throw error;
  }
};

export const reserveWishlistItem = async (itemId, guestName) => {
  try {
    const itemRef = doc(db, 'wishlist', itemId);
    await updateDoc(itemRef, {
      status:     'reserved',
      reservedBy: guestName,
      reservedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Reserve wishlist item failed:', error);
    throw error;
  }
};

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
    const snapshot = await getDocs(collection(db, 'gallery'));
    const list = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        order: typeof data.order === 'number' ? data.order : parseInt(data.order, 10) || 999,
        url: transformGoogleDriveUrl(data.url),
      };
    });
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('[FirebaseService] Gallery load failed:', error);
    throw error;
  }
};

// ─── Guest Management (Admin) ─────────────────────────────────
export const getGuests = async () => {
  try {
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('[FirebaseService] Get all guests failed:', error);
    // Fallback to local storage if Firestore fails
    const local = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    return local;
  }
};

export const addGuest = async (guestData) => {
  try {
    const docRef = await addDoc(collection(db, 'rsvps'), {
      name: guestData.name,
      phone: guestData.phone || '',
      guestsCount: Number(guestData.guestsCount) || 0,
      attendance: guestData.attendance || 'will_attend',
      message: guestData.message || '',
      language: guestData.language || 'ar',
      invitationId: weddingConfig.rsvp.invitationId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...guestData };
  } catch (error) {
    console.error('[FirebaseService] Add guest failed:', error);
    throw error;
  }
};

export const updateGuest = async (id, updatedData) => {
  try {
    const guestRef = doc(db, 'rsvps', id);
    await updateDoc(guestRef, {
      ...updatedData,
      guestsCount: Number(updatedData.guestsCount) || 0,
      updatedAt: serverTimestamp(),
    });
    return { id, ...updatedData };
  } catch (error) {
    console.error('[FirebaseService] Update guest failed:', error);
    throw error;
  }
};

export const deleteGuest = async (id) => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const guestRef = doc(db, 'rsvps', id);
    await deleteDoc(guestRef);
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Delete guest failed:', error);
    throw error;
  }
};

export const clearAllGuests = async () => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const q = query(collection(db, 'rsvps'));
    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map((d) => deleteDoc(doc(db, 'rsvps', d.id)));
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Clear guests failed:', error);
    throw error;
  }
};

// ─── Gallery Management (Admin) ───────────────────────────────
export const addGalleryImage = async (imageData) => {
  try {
    const orderVal = parseInt(imageData.order, 10);
    const docRef = await addDoc(collection(db, 'gallery'), {
      url: imageData.url,
      alt: imageData.alt || 'Wedding Photo',
      aspectRatio: imageData.aspectRatio || 'portrait',
      order: !isNaN(orderVal) ? orderVal : 1,
      createdAt: serverTimestamp(),
    });
    window.dispatchEvent(new CustomEvent('gallery_updated'));
    return { id: docRef.id, ...imageData, order: !isNaN(orderVal) ? orderVal : 1 };
  } catch (error) {
    console.error('[FirebaseService] Add gallery image failed:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id) => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'gallery', id));
    window.dispatchEvent(new CustomEvent('gallery_updated'));
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Delete gallery image failed:', error);
    throw error;
  }
};

export const clearAllGalleryImages = async () => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, 'gallery'));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(doc(db, 'gallery', d.id))));
    window.dispatchEvent(new CustomEvent('gallery_updated'));
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Clear gallery failed:', error);
    throw error;
  }
};

export const saveGalleryImages = async (images) => {
  try {
    const promises = images.map((img, idx) => {
      if (img.id && !img.id.startsWith('temp-')) {
        const ref = doc(db, 'gallery', img.id);
        return updateDoc(ref, { order: idx });
      }
      return null;
    });
    await Promise.all(promises.filter(Boolean));
    return images;
  } catch (error) {
    console.error('[FirebaseService] Save gallery images order failed:', error);
    return images;
  }
};

// ─── Wedding Config in Firestore ──────────────────────────────
export const getWeddingConfigFirestore = async () => {
  try {
    const { getDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'config', 'wedding');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('[FirebaseService] Get wedding config failed:', error);
    return null;
  }
};

export const saveWeddingConfigFirestore = async (config) => {
  try {
    const { setDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'config', 'wedding');
    await setDoc(docRef, { ...config, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Save wedding config failed:', error);
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

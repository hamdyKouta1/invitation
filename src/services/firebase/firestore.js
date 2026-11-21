/**
 * ============================================================================
 * FIREBASE FIRESTORE SERVICE (Per-Customer Project Isolation — Phase 1 & 4)
 * ============================================================================
 * Firestore Data Model (Per Customer Firebase Project):
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ config/wedding (or config/event)                                     │
 * │   Publicly readable published invitation configuration;              │
 * │   Write access restricted to authenticated customer/operator.        │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │ rsvps/{auto-id}  [PRIVATE COLLECTION — Guest PII Protected (SEC-005)]│
 * │   name, phone, guestsCount, attendance, message, customAnswers,      │
 * │   language, createdAt, invitationId                                  │
 * │   Public visitors: allow create ONLY (with schema validation).       │
 * │   Authenticated customer: allow read, update, delete.                │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │ wishes/{auto-id} [PUBLIC COLLECTION — Name + Message Only (SEC-005)] │
 * │   name, message, createdAt, invitationId (NO phone numbers!)         │
 * │   Public visitors: allow read, create.                               │
 * │   Authenticated customer: allow delete.                              │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │ gallery/{auto-id}                                                    │
 * │   url, alt, aspectRatio, order, createdAt                            │
 * └──────────────────────────────────────────────────────────────────────┘
 */

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import weddingConfig from '../../config/weddingConfig';
import { getActiveConfig, saveActiveConfig } from '../../utils/configManager';
import { getScopedStorageKey, isSafeImageUrl } from '../../utils/security';

const getRsvpSubmittedKey = () => getScopedStorageKey('wedding_rsvp_submitted');
const getRsvpFallbackStoreKey = () => getScopedStorageKey('wedding_rsvps');

// ─── RSVP ─────────────────────────────────────────────────────
export const checkAlreadySubmitted = () => {
  return localStorage.getItem(getRsvpSubmittedKey()) === 'true';
};

export const submitRSVP = async (data) => {
  if (checkAlreadySubmitted()) {
    throw new Error('already_submitted');
  }

  const activeCfg = getActiveConfig() || weddingConfig;
  const invitationId = activeCfg?.rsvp?.invitationId || weddingConfig.rsvp.invitationId;
  const trimmedName = String(data.name || '').trim();
  const trimmedMessage = String(data.message || '').trim();

  try {
    // 1. Write private RSVP record (contains phone & attendance) to 'rsvps' collection
    const docRef = await addDoc(collection(db, 'rsvps'), {
      name:          trimmedName,
      phone:         String(data.phone || '').trim(),
      guestsCount:   Number(data.guestsCount) || 0,
      attendance:    data.attendance || 'will_attend',
      message:       trimmedMessage,
      customAnswers: data.customAnswers || {},
      language:      data.language || 'ar',
      invitationId,
      createdAt:     serverTimestamp(),
    });

    // 2. If guest included a wish message, write a PII-free record to public 'wishes' collection (SEC-005)
    if (trimmedMessage.length > 0) {
      try {
        await addDoc(collection(db, 'wishes'), {
          name:         trimmedName,
          message:      trimmedMessage,
          rsvpId:       docRef.id,
          invitationId,
          createdAt:    serverTimestamp(),
        });
      } catch (wishErr) {
        console.warn('[FirebaseService] Public wish mirror skipped:', wishErr);
      }
    }

    localStorage.setItem(getRsvpSubmittedKey(), 'true');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('[FirebaseService] RSVP submission failed:', error);
    throw error;
  }
};

// ─── Wishes (Reads from PII-free 'wishes' collection — SEC-005) ───────
export const getWishes = async () => {
  try {
    const q = query(
      collection(db, 'wishes'),
      orderBy('createdAt', 'desc'),
      limit(40)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => ({
        id: d.id,
        name: d.data().name,
        message: d.data().message,
        createdAt: d.data().createdAt,
      }))
      .filter((w) => w.message && w.message.trim().length > 0);
  } catch (error) {
    console.warn('[FirebaseService] Load wishes failed:', error);
    return [];
  }
};

export const deleteWish = async (id) => {
  try {
    await deleteDoc(doc(db, 'wishes', id));
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Delete wish failed:', error);
    throw error;
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
    const list = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
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

// ─── Guest Management (Customer Dashboard — Requires Firebase Auth) ──
export const getGuests = async () => {
  try {
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('[FirebaseService] Get all guests failed:', error);
    const local = JSON.parse(localStorage.getItem(getRsvpFallbackStoreKey()) || '[]');
    return local;
  }
};

export const addGuest = async (guestData) => {
  try {
    const activeCfg = getActiveConfig() || weddingConfig;
    const invitationId = activeCfg?.rsvp?.invitationId || weddingConfig.rsvp.invitationId;
    const trimmedMessage = String(guestData.message || '').trim();

    const docRef = await addDoc(collection(db, 'rsvps'), {
      name: String(guestData.name || '').trim(),
      phone: String(guestData.phone || '').trim(),
      guestsCount: Number(guestData.guestsCount) || 0,
      attendance: guestData.attendance || 'will_attend',
      message: trimmedMessage,
      language: guestData.language || 'ar',
      invitationId,
      createdAt: serverTimestamp(),
    });

    if (trimmedMessage.length > 0) {
      try {
        await addDoc(collection(db, 'wishes'), {
          name: String(guestData.name || '').trim(),
          message: trimmedMessage,
          rsvpId: docRef.id,
          invitationId,
          createdAt: serverTimestamp(),
        });
      } catch {
        // ignore optional public wish mirror error
      }
    }

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
    await deleteDoc(doc(db, 'rsvps', id));
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Delete guest failed:', error);
    throw error;
  }
};

export const clearAllGuests = async () => {
  try {
    const q = query(collection(db, 'rsvps'));
    const snapshot = await getDocs(q);
    await Promise.all(snapshot.docs.map((d) => deleteDoc(doc(db, 'rsvps', d.id))));
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Clear guests failed:', error);
    throw error;
  }
};

// ─── Gallery Management (Customer Dashboard) ──────────────────
export const addGalleryImage = async (imageData) => {
  if (!isSafeImageUrl(imageData?.url)) {
    throw new Error('Unsafe or invalid image URL');
  }
  try {
    const orderVal = parseInt(imageData.order, 10);
    const docRef = await addDoc(collection(db, 'gallery'), {
      url: imageData.url,
      alt: imageData.alt || 'Event Photo',
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

// ─── Event / Wedding Config in Firestore ──────────────────────
export const getWeddingConfigFirestore = async () => {
  try {
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
    const docRef = doc(db, 'config', 'wedding');
    await setDoc(docRef, { ...config, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('[FirebaseService] Save wedding config failed:', error);
    throw error;
  }
};

export const subscribeWeddingConfigFirestore = (onUpdate, onError) => {
  try {
    const docRef = doc(db, 'config', 'wedding');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data());
        }
      },
      (error) => {
        console.warn('[FirebaseService] Live config listener error:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('[FirebaseService] Subscribe wedding config failed:', error);
    return () => {};
  }
};

// ─── Wishlist (Unified config/wedding.wishlist.items + wishlist collection — ARC-005) ──
export const getWishlistItems = async () => {
  try {
    const activeCfg = getActiveConfig();
    if (Array.isArray(activeCfg?.wishlist?.items) && activeCfg.wishlist.items.length > 0) {
      return activeCfg.wishlist.items;
    }
    const q = query(
      collection(db, 'wishlist'),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[FirebaseService] Wishlist load failed:', error);
    throw error;
  }
};

export const reserveWishlistItem = async (itemId, guestName) => {
  try {
    // 1. Update local/active config wishlist items if present (ARC-005)
    const activeCfg = getActiveConfig();
    if (Array.isArray(activeCfg?.wishlist?.items) && activeCfg.wishlist.items.some((i) => i.id === itemId)) {
      const updatedItems = activeCfg.wishlist.items.map((item) =>
        item.id === itemId
          ? { ...item, status: 'reserved', reservedBy: guestName, reservedAt: new Date().toISOString() }
          : item
      );
      const nextCfg = {
        ...activeCfg,
        wishlist: {
          ...activeCfg.wishlist,
          items: updatedItems,
        },
      };
      saveActiveConfig(nextCfg);
    }

    // 2. Also attempt to update standalone wishlist collection document if it exists
    const itemRef = doc(db, 'wishlist', itemId);
    await updateDoc(itemRef, {
      status:     'reserved',
      reservedBy: guestName,
      reservedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.warn('[FirebaseService] Standalone wishlist doc update skipped:', error);
    return { success: true };
  }
};

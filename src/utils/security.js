/**
 * ============================================================================
 * SECURITY & CUSTOMER ISOLATION UTILITIES (Phase 1 & Phase 2)
 * ============================================================================
 * 1. sanitizeUrl() — Protects against stored/DOM XSS via javascript:, data:, vbscript:
 * 2. validateImageFile() & isSafeImageUrl() — Blocks SVG XSS and oversized uploads
 * 3. getCustomerNamespace() & getScopedStorageKey() — Namespaces browser storage per customer
 * ============================================================================
 */

const ALLOWED_RASTER_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DEFAULT_MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Sanitizes user- or config-supplied URLs before rendering in href, src, or window.open.
 * Allows only http://, https://, and safe relative paths (/... or #...).
 * Rejects javascript:, data:, vbscript:, file:, etc.
 */
export const sanitizeUrl = (rawUrl, fallback = '') => {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;

  // Allow safe hash anchors or root-relative paths (but not protocol-relative //evil.com)
  if (trimmed.startsWith('#') || (trimmed.startsWith('/') && !trimmed.startsWith('//'))) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

/**
 * Validates an uploaded File object to ensure it is a safe raster image within size limits.
 * Explicitly blocks image/svg+xml to prevent embedded <script> SVG XSS (SEC-007).
 */
export const validateImageFile = (file, maxBytes = DEFAULT_MAX_IMAGE_BYTES) => {
  if (!file || typeof file !== 'object') {
    return { valid: false, errorAr: 'لم يتم اختيار ملف صالح', errorEn: 'No valid file selected' };
  }

  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();

  if (mime.includes('svg') || name.endsWith('.svg')) {
    return {
      valid: false,
      errorAr: 'ملفات SVG غير مسموح بها لأسباب أمنية. يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP.',
      errorEn: 'SVG files are not allowed for security reasons. Please upload JPG, PNG, or WEBP.',
    };
  }

  if (!ALLOWED_RASTER_MIME_TYPES.includes(mime)) {
    return {
      valid: false,
      errorAr: 'صيغة الصورة غير مدعومة. يرجى رفع صورة JPG أو PNG أو WEBP فقط.',
      errorEn: 'Unsupported image format. Please upload JPG, PNG, or WEBP only.',
    };
  }

  if (typeof file.size === 'number' && file.size > maxBytes) {
    const maxMb = (maxBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      errorAr: `حجم الصورة يتجاوز الحد المسموح (${maxMb} ميجابايت).`,
      errorEn: `Image size exceeds the maximum allowed limit (${maxMb} MB).`,
    };
  }

  return { valid: true };
};

/**
 * Validates an image URL or base64 data URI before saving or rendering.
 * Blocks data:image/svg+xml and javascript: URIs.
 */
export const isSafeImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  if (/^data:image\/(jpeg|jpg|png|webp);base64,[a-zA-Z0-9+/=]+$/i.test(trimmed)) {
    return true;
  }

  if (trimmed.toLowerCase().startsWith('data:')) {
    return false;
  }

  return Boolean(sanitizeUrl(trimmed, ''));
};

/**
 * Returns the active customer/project isolation namespace so localStorage keys
 * never collide between Customer A and Customer B in the same browser (ARC-004, ISO-002).
 */
let _overrideCustomerNamespace = null;

export const setCustomerNamespaceOverride = (ns) => {
  _overrideCustomerNamespace = ns ? String(ns).trim() : null;
};

export const getCustomerNamespace = () => {
  if (_overrideCustomerNamespace) return _overrideCustomerNamespace;
  const envSlug =
    (typeof import.meta !== 'undefined' && import.meta.env && (
      import.meta.env.VITE_CUSTOMER_SLUG ||
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    )) || '';
  const cleaned = String(envSlug).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return cleaned || 'default';
};

/**
 * Builds a customer-scoped localStorage key while preserving backward compatibility
 * when the namespace is 'default'.
 */
export const getScopedStorageKey = (baseKey, customNamespace = null) => {
  const ns = customNamespace || getCustomerNamespace();
  if (!ns || ns === 'default') {
    return baseKey;
  }
  return `${baseKey}__${ns}`;
};

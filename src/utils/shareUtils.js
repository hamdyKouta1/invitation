/**
 * Share Utilities — WhatsApp, clipboard, native share
 */

import weddingConfig from '../config/weddingConfig';

export const buildWhatsAppUrl = (lang = 'ar') => {
  const template = lang === 'ar'
    ? weddingConfig.sharing.messageAr
    : weddingConfig.sharing.messageEn;

  const message = template.replace('{url}', weddingConfig.sharing.url);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

export const copyToClipboard = async () => {
  const url = weddingConfig.sharing.url;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

export const nativeShare = async (lang = 'ar') => {
  if (!navigator.share) return false;

  const title = lang === 'ar'
    ? weddingConfig.meta.titleAr
    : weddingConfig.meta.titleEn;

  const text = lang === 'ar'
    ? weddingConfig.meta.descriptionAr
    : weddingConfig.meta.descriptionEn;

  try {
    await navigator.share({
      title,
      text,
      url: weddingConfig.sharing.url,
    });
    return true;
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.warn('[Share] Native share failed:', err);
    }
    return false;
  }
};

export const canNativeShare = () => !!navigator.share;

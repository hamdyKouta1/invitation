/**
 * Share Utilities — WhatsApp, clipboard, native share
 */

import { getActiveConfig } from './configManager';

export const buildWhatsAppUrl = (lang = 'ar', customConfig = null) => {
  const config = customConfig || getActiveConfig();
  const template = lang === 'ar'
    ? config.sharing.messageAr
    : config.sharing.messageEn;

  const message = template.replace('{url}', config.sharing.url);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

export const copyToClipboard = async (customConfig = null) => {
  const config = customConfig || getActiveConfig();
  const url = config.sharing.url;
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

export const nativeShare = async (lang = 'ar', customConfig = null) => {
  if (!navigator.share) return false;

  const config = customConfig || getActiveConfig();

  const title = lang === 'ar'
    ? config.meta.titleAr
    : config.meta.titleEn;

  const text = lang === 'ar'
    ? config.meta.descriptionAr
    : config.meta.descriptionEn;

  try {
    await navigator.share({
      title,
      text,
      url: config.sharing.url,
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

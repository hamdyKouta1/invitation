import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, copyToClipboard, nativeShare, canNativeShare } from '../../utils/shareUtils';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import './ShareInvitation.css';

const ShareInvitation = () => {
  const { t, i18n } = useTranslation();
  const { track } = useAnalytics();
  const [copied, setCopied] = useState(false);
  const lang = i18n.language;

  const handleWhatsApp = () => {
    track(EVENTS.SHARE_CLICKED, { method: 'whatsapp' });
    window.open(buildWhatsAppUrl(lang), '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard();
    if (ok) {
      track(EVENTS.SHARE_CLICKED, { method: 'copy' });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    track(EVENTS.SHARE_CLICKED, { method: 'native' });
    await nativeShare(lang);
  };

  return (
    <SectionWrapper id="share">
      <div className="section__header">
        <h2 className="section__title font-serif">{t('share.title')}</h2>
        <p className="section__subtitle">{t('share.subtitle')}</p>
        <OrnamentDivider symbol="✦" />
      </div>

      <div className="share-grid">
        {/* WhatsApp */}
        <motion.button
          className="share-btn share-btn--whatsapp"
          onClick={handleWhatsApp}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          id="btn-share-whatsapp"
          aria-label={t('share.whatsapp')}
        >
          <span className="share-btn__icon" aria-hidden="true">
            <MessageCircle size={22} strokeWidth={1.5} />
          </span>
          <span className="share-btn__text">{t('share.whatsapp')}</span>
        </motion.button>

        {/* Copy Link */}
        <motion.button
          className={`share-btn share-btn--copy ${copied ? 'share-btn--copied' : ''}`}
          onClick={handleCopy}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          id="btn-share-copy"
          aria-label={copied ? t('share.copied') : t('share.copyLink')}
          aria-live="polite"
        >
          <span className="share-btn__icon" aria-hidden="true">
            {copied ? <Check size={22} strokeWidth={1.5} /> : <Copy size={22} strokeWidth={1.5} />}
          </span>
          <span className="share-btn__text">
            {copied ? t('share.copied') : t('share.copyLink')}
          </span>
        </motion.button>

        {/* Native Share (mobile) */}
        {canNativeShare() && (
          <motion.button
            className="share-btn share-btn--native"
            onClick={handleNativeShare}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            id="btn-share-native"
            aria-label={t('share.nativeShare')}
          >
            <span className="share-btn__icon" aria-hidden="true">
              <Share2 size={22} strokeWidth={1.5} />
            </span>
            <span className="share-btn__text">{t('share.nativeShare')}</span>
          </motion.button>
        )}
      </div>
    </SectionWrapper>
  );
};

export default ShareInvitation;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Check, Copy, Gift, Smartphone, Landmark, X } from 'lucide-react';
import { getWishlistItems, reserveWishlistItem } from '../../services/index.js';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import useWeddingConfig from '../../hooks/useWeddingConfig';
import { sanitizeUrl, isSafeImageUrl } from '../../utils/security';
import './Wishlist.css';

const STATUS_CONFIG = {
  available: { key: 'wishlist.available', className: 'badge--available' },
  reserved:  { key: 'wishlist.reserved',  className: 'badge--reserved' },
  purchased: { key: 'wishlist.purchased', className: 'badge--purchased' },
};

const WishlistCard = ({ item, onReserve, isReserving }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const status = item.status || 'available';
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.available;

  const title = isAr ? (item.titleAr || item.title) : (item.titleEn || item.title);
  const description = isAr ? (item.descriptionAr || item.description) : (item.descriptionEn || item.description);
  const safeItemLink = sanitizeUrl(item.link, '');
  const safeImageUrl = isSafeImageUrl(item.imageUrl) ? item.imageUrl : '';

  return (
    <motion.div
      className="wishlist-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Image */}
      {safeImageUrl && (
        <div className="wishlist-card__image-wrap">
          <img
            src={safeImageUrl}
            alt={title}
            className="wishlist-card__image"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="wishlist-card__body wishlist-card__meta">
        {/* Status badge */}
        <span className={`wishlist-badge ${statusConfig.className}`}>
          {status === 'purchased' && <Check size={12} aria-hidden="true" />}
          {t(statusConfig.key)}
        </span>

        {/* Title */}
        <h3 className="wishlist-card__title font-serif">{title}</h3>

        {/* Description */}
        {description && (
          <p className="wishlist-card__description">{description}</p>
        )}

        {/* Price */}
        {item.price && (
          <p className="wishlist-card__price font-serif">
            {typeof item.price === 'number' ? item.price.toLocaleString(isAr ? 'ar-EG' : 'en-US') : item.price} {item.currency || (isAr ? 'جنيه' : 'EGP')}
          </p>
        )}

        <div className="wishlist-card__actions">
          {/* View link */}
          {safeItemLink && (
            <a
              href={safeItemLink}
              target="_blank"
              rel="noopener noreferrer"
              className="wishlist-card__link"
              id={`btn-wishlist-view-${item.id}`}
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>{t('wishlist.viewItem')}</span>
            </a>
          )}

          {/* Reserve button — only for available items */}
          {status === 'available' && (
            <button
              className="wishlist-card__reserve-btn"
              onClick={() => onReserve(item)}
              disabled={isReserving}
              id={`btn-wishlist-reserve-${item.id}`}
              aria-label={`${t('wishlist.reserve')}: ${title}`}
            >
              {isReserving ? '...' : t('wishlist.reserve')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Wishlist = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { track } = useAnalytics();
  const weddingConfig = useWeddingConfig();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);
  const [reserveModalItem, setReserveModalItem] = useState(null);
  const [guestNameInput, setGuestNameInput] = useState('');
  const [reserveError, setReserveError] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const wishlistConfig = weddingConfig.wishlist || {};
  const secCfg = weddingConfig.sections?.wishlist || {};
  const isWishlistEnabled =
    wishlistConfig.enabled === true || secCfg.enabled === true;

  useEffect(() => {
    if (!isWishlistEnabled) {
      setLoading(false);
      return;
    }
    track(EVENTS.WISHLIST_VIEWED);

    if (Array.isArray(wishlistConfig.items) && wishlistConfig.items.length > 0) {
      setItems(wishlistConfig.items);
      setLoading(false);
      return;
    }

    getWishlistItems()
      .then((data) => {
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems([]);
        }
      })
      .catch((err) => {
        console.warn('[Wishlist] Firestore load failed, using local/config items:', err);
        setItems(wishlistConfig.items || []);
      })
      .finally(() => setLoading(false));
  }, [isWishlistEnabled, wishlistConfig.items, track]);

  const openReserveModal = (item) => {
    setReserveModalItem(item);
    setGuestNameInput('');
    setReserveError('');
  };

  const handleConfirmReserve = async (e) => {
    e.preventDefault();
    const trimmedName = guestNameInput.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setReserveError(isAr ? 'يرجى إدخال الاسم لتأكيد حجز الهدية' : 'Please enter your name to reserve this gift');
      return;
    }
    if (!reserveModalItem) return;
    const itemId = reserveModalItem.id;

    setReservingId(itemId);
    try {
      try {
        await reserveWishlistItem(itemId, trimmedName);
      } catch (err) {
        console.warn('[Wishlist] Standalone item reserve failed, updating state:', err);
      }
      track(EVENTS.WISHLIST_RESERVED, { itemId });
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: 'reserved', reservedBy: trimmedName } : item
        )
      );
      setReserveModalItem(null);
      setReserveSuccess(itemId);
      setTimeout(() => setReserveSuccess(null), 3500);
    } catch (err) {
      console.error('Reserve failed:', err);
    } finally {
      setReservingId(null);
    }
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  if (!isWishlistEnabled) return null;

  const sectionTitle = isAr
    ? (secCfg.titleAr || wishlistConfig.titleAr || t('wishlist.title'))
    : (secCfg.titleEn || wishlistConfig.titleEn || t('wishlist.title'));

  const sectionSubtitle = isAr
    ? (secCfg.subtitleAr || wishlistConfig.subtitleAr || t('wishlist.subtitle'))
    : (secCfg.subtitleEn || wishlistConfig.subtitleEn || t('wishlist.subtitle'));

  const safeRegistryUrl = sanitizeUrl(wishlistConfig.registryUrl, '');
  const hasDigitalCash = Boolean(wishlistConfig.instapay || wishlistConfig.bankAccount || safeRegistryUrl);

  return (
    <SectionWrapper id="wishlist" alt>
      <div className="section__header">
        <ThemeHeaderCrest sectionIndex="08" />
        <h2 className="section__title font-serif">{sectionTitle}</h2>
        {sectionSubtitle && <p className="section__subtitle">{sectionSubtitle}</p>}
        <OrnamentDivider symbol="✦" />
      </div>

      {/* ─── Digital Gifting Options (Instapay / Bank / Registry) ─── */}
      {hasDigitalCash && (
        <div className="wishlist-cash-section">
          <div className="wishlist-cash-grid">
            {wishlistConfig.instapay && (
              <div className="wishlist-cash-card">
                <div className="wishlist-cash-card__icon">
                  <Smartphone size={24} />
                </div>
                <div className="wishlist-cash-card__content">
                  <span className="wishlist-cash-card__label">{t('wishlist.instapay')}</span>
                  <strong className="wishlist-cash-card__value">{wishlistConfig.instapay}</strong>
                </div>
                <button
                  type="button"
                  className="wishlist-cash-card__copy-btn"
                  onClick={() => handleCopy(wishlistConfig.instapay, 'instapay')}
                  title={t('wishlist.copy')}
                >
                  {copiedKey === 'instapay' ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedKey === 'instapay' ? t('wishlist.copied') : t('wishlist.copy')}</span>
                </button>
              </div>
            )}

            {wishlistConfig.bankAccount && (
              <div className="wishlist-cash-card">
                <div className="wishlist-cash-card__icon">
                  <Landmark size={24} />
                </div>
                <div className="wishlist-cash-card__content">
                  <span className="wishlist-cash-card__label">{t('wishlist.bankAccount')}</span>
                  <strong className="wishlist-cash-card__value font-mono">{wishlistConfig.bankAccount}</strong>
                </div>
                <button
                  type="button"
                  className="wishlist-cash-card__copy-btn"
                  onClick={() => handleCopy(wishlistConfig.bankAccount, 'bank')}
                  title={t('wishlist.copy')}
                >
                  {copiedKey === 'bank' ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedKey === 'bank' ? t('wishlist.copied') : t('wishlist.copy')}</span>
                </button>
              </div>
            )}

            {safeRegistryUrl && (
              <div className="wishlist-cash-card">
                <div className="wishlist-cash-card__icon">
                  <Gift size={24} />
                </div>
                <div className="wishlist-cash-card__content">
                  <span className="wishlist-cash-card__label">{t('wishlist.externalRegistry')}</span>
                  <a
                    href={safeRegistryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wishlist-cash-card__link"
                  >
                    {t('wishlist.viewRegistry')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Gift Items List ─── */}
      {loading ? (
        <div className="wishlist-skeleton-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="wishlist-skeleton-item" />)}
        </div>
      ) : items.length === 0 ? (
        !hasDigitalCash && (
          <div className="wishlist-empty">
            <span className="wishlist-empty__icon" aria-hidden="true">🎁</span>
            <p className="wishlist-empty__text font-serif">{t('wishlist.comingSoon')}</p>
          </div>
        )
      ) : (
        <>
          {hasDigitalCash && (
            <div className="wishlist-items-header">
              <h3 className="wishlist-items-title font-serif">{t('wishlist.suggestedGifts')}</h3>
              <OrnamentDivider symbol="❧" />
            </div>
          )}

          <AnimatePresence>
            {reserveSuccess && (
              <motion.div
                className="wishlist-success-toast"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✓ {t('wishlist.reserveSuccess')}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="wishlist-grid">
            {items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onReserve={openReserveModal}
                isReserving={reservingId === item.id}
              />
            ))}
          </div>
        </>
      )}

      {/* ─── Accessible React Reservation Modal (Replaces window.prompt — ARC-006) ─── */}
      {reserveModalItem && (
        <div
          className="wishlist-modal-overlay"
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 13, 11, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            className="wishlist-card"
            style={{
              maxWidth: '420px',
              width: '100%',
              padding: '1.75rem',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setReserveModalItem(null)}
              aria-label={isAr ? 'إغلاق' : 'Close'}
              style={{
                position: 'absolute',
                top: '0.85rem',
                insetInlineEnd: '0.85rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.7,
              }}
            >
              <X size={18} />
            </button>
            <h3 className="wishlist-card__title font-serif" style={{ marginBottom: '0.5rem' }}>
              {t('wishlist.reserve')}: {isAr ? (reserveModalItem.titleAr || reserveModalItem.title) : (reserveModalItem.titleEn || reserveModalItem.title)}
            </h3>
            <p className="wishlist-card__description" style={{ marginBottom: '1rem' }}>
              {isAr ? 'أدخل اسمك الكريم لتأكيد حجز هذه الهدية:' : 'Enter your name to reserve this gift:'}
            </p>
            <form onSubmit={handleConfirmReserve}>
              <input
                type="text"
                value={guestNameInput}
                onChange={(e) => setGuestNameInput(e.target.value)}
                placeholder={t('rsvp.name')}
                autoFocus
                maxLength={80}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(201, 169, 110, 0.45)',
                  marginBottom: '0.75rem',
                  fontSize: '0.95rem',
                }}
              />
              {reserveError && (
                <p style={{ color: '#e05666', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                  {reserveError}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setReserveModalItem(null)}
                  className="wishlist-card__link"
                  style={{ cursor: 'pointer' }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="wishlist-card__reserve-btn"
                  disabled={Boolean(reservingId)}
                >
                  {reservingId ? '...' : t('wishlist.reserve')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Wishlist;

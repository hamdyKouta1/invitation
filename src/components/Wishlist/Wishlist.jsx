import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Check, Copy, Gift, Smartphone, Landmark } from 'lucide-react';
import { getWishlistItems, reserveWishlistItem } from '../../services/index.js';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import useWeddingConfig from '../../hooks/useWeddingConfig';
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

  return (
    <motion.div
      className="wishlist-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Image */}
      {item.imageUrl && (
        <div className="wishlist-card__image-wrap">
          <img
            src={item.imageUrl}
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
          {item.link && (
            <a
              href={item.link}
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
              onClick={() => onReserve(item.id)}
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
  const [reserveSuccess, setReserveSuccess] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const wishlistConfig = weddingConfig.wishlist || {};

  useEffect(() => {
    if (wishlistConfig.enabled === false) {
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
  }, [wishlistConfig.enabled, wishlistConfig.items]);

  const handleReserve = async (itemId) => {
    const guestName = window.prompt(t('rsvp.name') + ':');
    if (!guestName || !guestName.trim()) return;

    setReservingId(itemId);
    try {
      try {
        await reserveWishlistItem(itemId, guestName.trim());
      } catch (err) {
        console.warn('[Wishlist] Standalone item reserve failed, updating state:', err);
      }
      track(EVENTS.WISHLIST_RESERVED, { itemId });
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: 'reserved', reservedBy: guestName.trim() } : item
        )
      );
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

  if (wishlistConfig.enabled === false) return null;

  const sectionTitle = isAr
    ? (wishlistConfig.titleAr || t('wishlist.title'))
    : (wishlistConfig.titleEn || t('wishlist.title'));

  const sectionSubtitle = isAr
    ? (wishlistConfig.subtitleAr || t('wishlist.subtitle'))
    : (wishlistConfig.subtitleEn || t('wishlist.subtitle'));

  const hasDigitalCash = Boolean(wishlistConfig.instapay || wishlistConfig.bankAccount || wishlistConfig.registryUrl);

  return (
    <SectionWrapper id="wishlist" alt>
      <div className="section__header">
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

            {wishlistConfig.registryUrl && (
              <div className="wishlist-cash-card">
                <div className="wishlist-cash-card__icon">
                  <Gift size={24} />
                </div>
                <div className="wishlist-cash-card__content">
                  <span className="wishlist-cash-card__label">{t('wishlist.externalRegistry')}</span>
                  <a
                    href={wishlistConfig.registryUrl}
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
                onReserve={handleReserve}
                isReserving={reservingId === item.id}
              />
            ))}
          </div>
        </>
      )}
    </SectionWrapper>
  );
};

export default Wishlist;

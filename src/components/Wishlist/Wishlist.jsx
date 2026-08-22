import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Check } from 'lucide-react';
import { getWishlistItems, reserveWishlistItem } from '../../services/index.js';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import weddingConfig from '../../config/weddingConfig';
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

  const title = isAr ? item.titleAr : item.titleEn;
  const description = isAr ? item.descriptionAr : item.descriptionEn;

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
            {item.price.toLocaleString('ar-EG')} {item.currency}
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
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(null);

  useEffect(() => {
    if (!weddingConfig.wishlist.enabled) { setLoading(false); return; }
    track(EVENTS.WISHLIST_VIEWED);
    getWishlistItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleReserve = async (itemId) => {
    const guestName = window.prompt(t('rsvp.name') + ':');
    if (!guestName) return;

    setReservingId(itemId);
    try {
      await reserveWishlistItem(itemId, guestName);
      track(EVENTS.WISHLIST_RESERVED, { itemId });
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: 'reserved', reservedBy: guestName } : item
        )
      );
      setReserveSuccess(itemId);
      setTimeout(() => setReserveSuccess(null), 3000);
    } catch (err) {
      console.error('Reserve failed:', err);
    } finally {
      setReservingId(null);
    }
  };

  if (!weddingConfig.wishlist.enabled) return null;

  return (
    <SectionWrapper id="wishlist">
      <div className="section__header">
        <h2 className="section__title font-serif">{t('wishlist.title')}</h2>
        <p className="section__subtitle">{t('wishlist.subtitle')}</p>
        <OrnamentDivider symbol="✦" />
      </div>

      {loading ? (
        <div className="wishlist-skeleton-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="wishlist-skeleton-item" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="wishlist-empty">
          <span className="wishlist-empty__icon" aria-hidden="true">🎁</span>
          <p className="wishlist-empty__text font-serif">{t('wishlist.comingSoon')}</p>
        </div>
      ) : (
        <>
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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryImages } from '../../services/index.js';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import { ThemeHeaderCrest } from '../ui/ThemeVisuals';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import weddingConfig from '../../config/weddingConfig';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import { getAssetUrl } from '../../utils/assetUtils';
import './Gallery.css';

const transformDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('lh3.googleusercontent.com/d/')) return url;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match && match[1] ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
};

const GalleryImage = ({ image, index, onClick, activeTheme, isAr }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: '200px' }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const title = isAr ? (image.titleAr || image.alt) : (image.titleEn || image.alt);
  const caption = isAr ? image.captionAr : image.captionEn;

  return (
    <motion.div
      ref={imgRef}
      className={`gallery-item gallery-item--${image.aspectRatio || 'square'} gallery-item--theme-${activeTheme}`}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={image.alt}
      onKeyDown={(e) => e.key === 'Enter' && onClick(index)}
      id={`gallery-img-${image.id}`}
    >
      {/* Theme-Specific Frame Adornments */}
      {activeTheme === 'minimalist-modern' && (
        <div className="gallery-item__editorial-header" aria-hidden="true">
          <span>PLATE 0{index + 1}</span>
          <span>/ 06</span>
        </div>
      )}
      {activeTheme === 'romantic-floral' && (
        <span className="gallery-item__floral-tape" aria-hidden="true">❀</span>
      )}
      {activeTheme === 'royal-classic' && (
        <span className="gallery-item__royal-crest" aria-hidden="true">⚜</span>
      )}
      {activeTheme === 'elegant-luxury' && (
        <span className="gallery-item__gold-bracket" aria-hidden="true" />
      )}

      <div className="gallery-item__media">
        {inView && (
          <img
            src={image.url}
            alt={image.alt}
            className={`gallery-item__img ${loaded ? 'gallery-item__img--loaded' : ''}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            decoding="async"
          />
        )}
        {!loaded && <div className="gallery-item__skeleton" />}
        <div className="gallery-item__overlay" aria-hidden="true" />
      </div>

      {/* Theme-Specific Caption / Plaque */}
      {activeTheme !== 'default' && (title || caption) && (
        <div className="gallery-item__caption-bar">
          {title && <strong className="gallery-item__caption-title font-serif">{title}</strong>}
          {caption && <span className="gallery-item__caption-sub">{caption}</span>}
        </div>
      )}
    </motion.div>
  );
};

const Lightbox = ({ images, activeIndex, onClose, onPrev, onNext }) => {
  const { t } = useTranslation();
  const image = images[activeIndex];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        onNext();
      } else {
        onPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="lightbox__backdrop" onClick={onClose} />

        <button className="lightbox__close" onClick={onClose} aria-label={t('gallery.close')} id="btn-lightbox-close">
          <X size={24} />
        </button>

        <button className="lightbox__nav lightbox__nav--prev" onClick={onPrev} aria-label={t('gallery.prev')} id="btn-lightbox-prev">
          <ChevronLeft size={28} />
        </button>
        <button className="lightbox__nav lightbox__nav--next" onClick={onNext} aria-label={t('gallery.next')} id="btn-lightbox-next">
          <ChevronRight size={28} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="lightbox__content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="lightbox__img"
            />
          </motion.div>
        </AnimatePresence>

        <div className="lightbox__counter" aria-live="polite">
          {activeIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { track } = useAnalytics();
  const liveConfig = useWeddingConfig() || weddingConfig;
  const activeTheme = liveConfig?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  const [rawImages, setRawImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const loadImages = useCallback(() => {
    if (!liveConfig.gallery?.enabled) { setLoading(false); return; }
    getGalleryImages()
      .then((data) => {
        if (data && data.length > 0) {
          setRawImages(data.map(img => ({ ...img, url: transformDriveUrl(img.url) })));
        } else {
          const fallback = (liveConfig.gallery?.mockImages || [])
            .filter(img => img.url)
            .map(img => ({ ...img, url: transformDriveUrl(img.url) }));
          setRawImages(fallback);
        }
      })
      .catch(() => {
        const fallback = (liveConfig.gallery?.mockImages || [])
          .filter(img => img.url)
          .map(img => ({ ...img, url: transformDriveUrl(img.url) }));
        setRawImages(fallback);
      })
      .finally(() => setLoading(false));
  }, [liveConfig.gallery]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    const handleGalleryUpdate = () => {
      loadImages();
    };
    window.addEventListener('gallery_updated', handleGalleryUpdate);
    return () => window.removeEventListener('gallery_updated', handleGalleryUpdate);
  }, [loadImages]);

  // Determine whether rawImages is just the untouched default Unsplash mock set
  const isUntouchedMockSet =
    rawImages.length === 0 ||
    rawImages.every(
      (img) =>
        ['1', '2', '3', '4', '5', '6'].includes(String(img.id)) &&
        typeof img.url === 'string' &&
        img.url.includes('images.unsplash.com')
    );

  // For the 4 new themes, if the user hasn't uploaded custom photos yet, showcase the theme's curated local artwork collection!
  const themedCuratedSet = (themeObj?.assets?.galleryImages || []).map((img) => ({
    ...img,
    url: getAssetUrl(img.url),
  }));

  const images =
    activeTheme !== 'default' && isUntouchedMockSet && themedCuratedSet.length > 0
      ? themedCuratedSet
      : rawImages;

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.classList.add('no-scroll');
      track(EVENTS.GALLERY_OPENED, { imageIndex: lightboxIndex });
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [lightboxIndex, track]);

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i + 1) % images.length), [images.length]);

  if (!liveConfig.gallery?.enabled) return null;

  const layoutVariant = themeObj?.assets?.galleryLayout || 'masonry-classic';

  return (
    <SectionWrapper id="gallery" alt>
      <div className="section__header">
        <ThemeHeaderCrest sectionIndex="06" />
        <h2 className="section__title font-serif">{t('gallery.title')}</h2>
        <p className="section__subtitle">{t('gallery.subtitle')}</p>
        <OrnamentDivider symbol="✦" />
      </div>

      {loading ? (
        <div className="gallery-skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="gallery-skeleton-item" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="gallery-empty">
          <span className="gallery-empty__icon" aria-hidden="true">📷</span>
          <p className="gallery-empty__text font-serif">{t('gallery.comingSoon')}</p>
        </div>
      ) : (
        <div className={`gallery-grid gallery-grid--${layoutVariant}`}>
          {images.map((image, idx) => (
            <GalleryImage
              key={`${activeTheme}-${image.id || idx}`}
              image={image}
              index={idx}
              onClick={openLightbox}
              activeTheme={activeTheme}
              isAr={isAr}
            />
          ))}
        </div>
      )}

      {lightboxIndex !== null && images[lightboxIndex] && (
        <Lightbox
          images={images}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </SectionWrapper>
  );
};

export default Gallery;

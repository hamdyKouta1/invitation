import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircleHeart, Quote } from 'lucide-react';
import { getWishes } from '../../services/index.js';
import weddingConfig from '../../config/weddingConfig';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import './WishesWall.css';

const WishesWall = forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const groomName = isAr ? weddingConfig.groom.name : weddingConfig.groom.nameEn;
  const brideName = isAr ? weddingConfig.bride.name : weddingConfig.bride.nameEn;
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishesList = async () => {
    try {
      const data = await getWishes();
      setWishes(data || []);
    } catch (err) {
      console.error('[WishesWall] Failed to load wishes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishesList();
  }, []);

  // Allow parent component to trigger refresh after RSVP submission
  useImperativeHandle(ref, () => ({
    refresh: fetchWishesList,
  }));

  return (
    <SectionWrapper id="wishes">
      <div className="section__header">
        <h2 className="section__title font-serif">{t('wishes.title')}</h2>
        <p className="section__subtitle">{t('wishes.subtitle', { groom: groomName, bride: brideName })}</p>
        <OrnamentDivider symbol="✦" />
      </div>

      {loading ? (
        <div className="wishes-loading">
          <div className="wishes-loading__spinner" />
        </div>
      ) : wishes.length === 0 ? (
        <div className="wishes-empty">
          <MessageCircleHeart size={36} strokeWidth={1.5} className="wishes-empty__icon" />
          <p className="wishes-empty__text font-serif">{t('wishes.empty')}</p>
        </div>
      ) : (
        <div className="wishes-grid">
          {wishes.map((wish, index) => (
            <motion.div
              key={wish.id || index}
              className="wish-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
            >
              <div className="wish-card__inner">
                <Quote className="wish-card__quote" size={24} aria-hidden="true" />
                <p className="wish-card__message font-serif">{wish.message}</p>
                <div className="wish-card__footer">
                  <span className="wish-card__sender font-serif">{wish.name}</span>
                  <span className="wish-card__heart" aria-hidden="true">♡</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
});

WishesWall.displayName = 'WishesWall';

export default WishesWall;

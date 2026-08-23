import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Styles
import './styles/global.css';
import './styles/animations.css';
import './styles/rtl.css';

// Components
import Envelope from './components/Envelope/Envelope';
import Hero from './components/Hero/Hero';
import WeddingDetails from './components/WeddingDetails/WeddingDetails';
import Countdown from './components/Countdown/Countdown';
import Families from './components/Families/Families';
import Venue from './components/Venue/Venue';
import Gallery from './components/Gallery/Gallery';
import DressCode from './components/DressCode/DressCode';
import RSVP from './components/RSVP/RSVP';
import WishesWall from './components/WishesWall/WishesWall';
import ShareInvitation from './components/ShareInvitation/ShareInvitation';
import Navigation from './components/Navigation/Navigation';
import MusicControl from './components/MusicControl/MusicControl';
import AdminPortal from './components/Admin/AdminPortal';
import OrnamentDivider from './components/ui/OrnamentDivider';
import FloralCornerSVG from './components/ui/FloralCornerSVG';
import weddingConfig from './config/weddingConfig';
import { getWeddingConfigFromDB, saveWeddingConfigToDB } from './services';
import { syncConfigWithFirestore } from './utils/configManager';

import './App.css';

const SECRET_HASH = import.meta.env.VITE_ADMIN_SECRET_ENDPOINT || 'admin-secret';

/* ─── Footer ──────────────────────────────────────────────── */
const Footer = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const groomName = isAr ? weddingConfig.groom.name  : weddingConfig.groom.nameEn;
  const brideName = isAr ? weddingConfig.bride.name  : weddingConfig.bride.nameEn;
  const year = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <OrnamentDivider symbol="❧" />
      <div className="footer__content">
        <p className="footer__with-love font-serif">{t('footer.withLove')}</p>
        <p className="footer__names font-script">{groomName} &amp; {brideName}</p>
        <p className="footer__year">{year}</p>

        <button
          className="footer__back-to-top"
          onClick={handleScrollToTop}
          aria-label={isAr ? 'العودة للأعلى' : 'Return to top'}
          id="btn-footer-back-to-top"
        >
          <span className="footer__back-icon" aria-hidden="true">↑</span>
          <span className="footer__back-text font-serif">
            {isAr ? 'العودة إلى البداية ↗' : 'Return to Top ↗'}
          </span>
        </button>
      </div>
      <FloralCornerSVG
        className="footer__floral footer__floral--left"
        style={{ opacity: 0.3, width: 100 }}
      />
      <FloralCornerSVG
        className="footer__floral footer__floral--right"
        style={{ opacity: 0.3, width: 100, transform: 'scale(-1, 1)' }}
      />
    </footer>
  );
};

/* ─── App ─────────────────────────────────────────────────── */
function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const musicControlRef = useRef(null);
  const wishesRef = useRef(null);

  // Check URL hash / query param for secret admin endpoint on mount and hash changes
  useEffect(() => {
    const checkAdminEndpoint = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(window.location.search);
      if (hash === SECRET_HASH || hash === 'admin' || hash === 'admin-secret' || params.get('portal') === 'admin') {
        setIsAdminOpen(true);
      }
    };

    checkAdminEndpoint();
    window.addEventListener('hashchange', checkAdminEndpoint);
    return () => window.removeEventListener('hashchange', checkAdminEndpoint);
  }, []);

  // Priority 1: Fetch live wedding config from Firestore DB on init (and auto-seed if missing)
  useEffect(() => {
    syncConfigWithFirestore(getWeddingConfigFromDB, saveWeddingConfigToDB);
  }, []);

  // Prevent body scroll while envelope is displayed
  useEffect(() => {
    if (!envelopeOpened && !isAdminOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [envelopeOpened, isAdminOpen]);

  const handleTriggerMusic = () => {
    if (musicControlRef.current) {
      musicControlRef.current.play();
    }
  };

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  };

  const handleWishesUpdated = () => {
    if (wishesRef.current) {
      wishesRef.current.refresh();
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="app">
      {/* ── Secret Admin Management Portal (2FA Protected) ── */}
      {isAdminOpen && <AdminPortal onClose={handleCloseAdmin} />}

      {/* Floating Music Control — Always rendered so music is available anywhere */}
      <MusicControl ref={musicControlRef} />

      {/* ── Envelope Landing Screen ── */}
      <AnimatePresence mode="wait">
        {!envelopeOpened && (
          <Envelope
            key="envelope"
            onOpen={handleEnvelopeOpen}
            onTriggerMusic={handleTriggerMusic}
          />
        )}
      </AnimatePresence>

      {/* ── Main Invitation Content ── */}
      <AnimatePresence>
        {envelopeOpened && (
          <motion.main
            key="invitation"
            className="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
            aria-label="Wedding invitation"
          >
            <Navigation />

            <Hero />
            <WeddingDetails />
            <Countdown />
            <Families />
            <Venue />
            <Gallery />
            <DressCode />
            <RSVP onWishesUpdated={handleWishesUpdated} />
            <WishesWall ref={wishesRef} />
            <ShareInvitation />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

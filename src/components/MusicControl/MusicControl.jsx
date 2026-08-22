import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import weddingConfig from '../../config/weddingConfig';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import './MusicControl.css';

/* ── SVG Icons ── */
const MusicOnIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

const MusicOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="2" y1="2" x2="22" y2="22"/>
    <path d="M10.7 5.7L21 4v12"/>
    <path d="M9 9v9"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

const MusicControl = forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const { scrollDirection, scrolled } = useScrollDirection();

  const { music } = weddingConfig;
  const isHidden = scrolled && scrollDirection === 'down';

  /* ── Initialize Audio Instance ── */
  useEffect(() => {
    if (!music.enabled || !music.url) return;

    const audio = new Audio();
    audio.src = music.url;
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [music.url, music.enabled]);

  /* ── Play function ── */
  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setPlaying(true);
    } catch (err) {
      console.info('[Music] Play blocked by browser policy:', err);
    }
  };

  /* ── Pause function ── */
  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlaying(false);
  };

  /* ── Toggle function ── */
  const toggleAudio = () => {
    if (playing) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  /* ── Expose play/pause methods via ref ── */
  useImperativeHandle(ref, () => ({
    play: playAudio,
    pause: pauseAudio,
    toggle: toggleAudio,
  }));

  if (!music.enabled || !music.url) return null;

  return (
    <div
      className={`music-control ${isHidden ? 'music-control--hidden' : ''}`}
      role="complementary"
      aria-label="Music control"
    >
      <motion.button
        className={`music-control__btn ${playing ? 'music-control__btn--playing' : ''}`}
        onClick={toggleAudio}
        aria-label={playing ? t('music.off') : t('music.on')}
        aria-pressed={playing}
        id="btn-music-toggle"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.15 }}
      >
        <span className="music-control__icon">
          {playing ? <MusicOnIcon /> : <MusicOffIcon />}
        </span>

        <span className="music-control__label font-serif">
          {playing
            ? (isAr ? 'إيقاف الموسيقى' : 'Pause Music')
            : (isAr ? 'تشغيل الموسيقى' : 'Play Music')
          }
        </span>

        {playing && (
          <span className="music-control__bars" aria-hidden="true">
            <span className="music-bar music-bar--1" />
            <span className="music-bar music-bar--2" />
            <span className="music-bar music-bar--3" />
            <span className="music-bar music-bar--4" />
          </span>
        )}
      </motion.button>
    </div>
  );
});

MusicControl.displayName = 'MusicControl';

export default MusicControl;

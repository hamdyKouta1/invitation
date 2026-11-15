import React from 'react';
import { motion } from 'framer-motion';
import { useWeddingConfig } from '../../hooks/useWeddingConfig';
import { getThemeById } from '../../config/themesConfig';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import './SectionWrapper.css';

/**
 * SectionWrapper — Theme-aware scroll-triggered reveal for all sections
 */
const SectionWrapper = ({
  id,
  children,
  className = '',
  alt = false,
  style = {},
}) => {
  const config = useWeddingConfig();
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeTheme = config?.theme || 'default';
  const themeObj = getThemeById(activeTheme);

  // Theme-specific scroll reveal variants (default remains exact original)
  const motionPresets = {
    default: {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    'elegant-luxury': {
      initial: { opacity: 0, y: 45, scale: 0.985 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
    },
    'minimalist-modern': {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    'romantic-floral': {
      initial: { opacity: 0, y: 36, scale: 0.97 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.9, ease: [0.34, 1.3, 0.64, 1] },
    },
    'royal-classic': {
      initial: { opacity: 0, y: 42, scale: 0.98 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] },
    },
  };

  const preset = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : motionPresets[activeTheme] || motionPresets.default;

  return (
    <motion.section
      id={id}
      className={`section ${alt ? 'section--alt' : ''} section--theme-${activeTheme} ${className}`}
      style={style}
      initial={preset.initial}
      whileInView={preset.whileInView}
      viewport={{ once: true, margin: '-80px' }}
      transition={preset.transition}
      data-animation-preset={themeObj?.animations?.preset || 'gentle-float'}
    >
      <div className="section__container">
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;

import React from 'react';
import { motion } from 'framer-motion';
import './SectionWrapper.css';

/**
 * SectionWrapper — Scroll-triggered fade-in for all sections
 */
const SectionWrapper = ({
  id,
  children,
  className = '',
  alt = false,
  style = {},
}) => {
  return (
    <motion.section
      id={id}
      className={`section ${alt ? 'section--alt' : ''} ${className}`}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="section__container">
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Heart } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import './Navigation.css';

const NAV_ITEMS = [
  { key: 'details',    section: 'details' },
  { key: 'families',   section: 'families' },
  { key: 'venue',      section: 'venue' },
  { key: 'gallery',    section: 'gallery' },
  { key: 'dressCode',  section: 'dress-code' },
  { key: 'wishes',     section: 'wishes' },
  { key: 'rsvp',       section: 'rsvp' },
];

const Navigation = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollDirection, scrolled } = useScrollDirection();

  const isHidden = scrolled && scrollDirection === 'down' && !isOpen;

  const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`floating-nav ${scrolled ? 'floating-nav--scrolled' : ''} ${
          isHidden ? 'floating-nav--hidden' : ''
        }`}
        aria-label="Main navigation"
      >
        <div className="floating-nav__inner">
          <button
            className="floating-nav__heart"
            onClick={() => scrollTo('hero')}
            aria-label="Go to top"
            id="btn-nav-top"
          >
            <Heart size={16} fill="currentColor" />
          </button>

          <div className="floating-nav__lang">
            <LanguageSwitcher />
          </div>

          <button
            className="floating-nav__menu-btn"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            id="btn-nav-menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isOpen && (
          <div className="floating-nav__dropdown" role="menu">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className="floating-nav__item"
                onClick={() => scrollTo(item.section)}
                role="menuitem"
                id={`btn-nav-${item.key}`}
              >
                {t(`nav.${item.key}`)}
              </button>
            ))}
          </div>
        )}
      </nav>

      {isOpen && (
        <div
          className="floating-nav__backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navigation;

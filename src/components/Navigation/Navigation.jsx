import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Heart } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import useWeddingConfig from '../../hooks/useWeddingConfig';
import { normalizeSectionOrder, isSectionEnabled } from '../../utils/configManager';
import './Navigation.css';

const BUILTIN_NAV_MAP = {
  details:   { key: 'details',   section: 'details' },
  families:  { key: 'families',  section: 'families' },
  venue:     { key: 'venue',     section: 'venue' },
  gallery:   { key: 'gallery',   section: 'gallery' },
  dressCode: { key: 'dressCode', section: 'dress-code' },
  wishlist:  { key: 'wishlist',  section: 'wishlist' },
  wishes:    { key: 'wishes',    section: 'wishes' },
  rsvp:      { key: 'rsvp',      section: 'rsvp' },
};

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const weddingConfig = useWeddingConfig();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollDirection, scrolled } = useScrollDirection();

  const orderedIds = normalizeSectionOrder(
    weddingConfig.sectionOrder,
    weddingConfig.customSections
  );
  const customSectionsMap = new Map(
    (Array.isArray(weddingConfig.customSections) ? weddingConfig.customSections : [])
      .filter((cs) => cs && cs.id)
      .map((cs) => [cs.id, cs])
  );

  const navItems = [];
  for (const id of orderedIds) {
    if (customSectionsMap.has(id)) {
      const cs = customSectionsMap.get(id);
      if (cs.enabled !== false) {
        const label = isAr
          ? (cs.titleAr || cs.titleEn || cs.title || 'قسم إضافي')
          : (cs.titleEn || cs.titleAr || cs.title || 'Custom Section');
        navItems.push({
          key: cs.id,
          section: cs.id,
          label,
        });
      }
      continue;
    }

    const builtin = BUILTIN_NAV_MAP[id];
    if (builtin && isSectionEnabled(weddingConfig, id)) {
      const secOverride = weddingConfig.sections?.[id];
      const customLabel = isAr ? secOverride?.titleAr : secOverride?.titleEn;
      navItems.push({
        key: builtin.key,
        section: builtin.section,
        label: customLabel || t(`nav.${builtin.key}`),
      });
    }
  }

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
            {navItems.map((item) => (
              <button
                key={item.key}
                className="floating-nav__item"
                onClick={() => scrollTo(item.section)}
                role="menuitem"
                id={`btn-nav-${item.key}`}
              >
                {item.label}
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

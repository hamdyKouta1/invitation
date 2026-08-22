import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      if (scrollY <= 60) {
        setScrollDirection('up');
        setScrolled(false);
        lastScrollY = scrollY;
        return;
      }

      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (Math.abs(scrollY - lastScrollY) > 6) {
        setScrollDirection(direction);
      }
      setScrolled(true);
      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  return { scrollDirection, scrolled };
}

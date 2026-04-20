import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles scrolling to an element when the hash changes.
 * This ensures that links like <Link to="/#about"> work correctly
 * across different pages.
 */
export function ScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // Scroll to the top if no hash is present
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Attempt to find the element
    const id = hash.replace('#', '');
    const element = document.getElementById(id);

    if (element) {
      // Scroll with a slight delay to ensure the page has rendered
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [pathname, hash, key]);

  return null;
}

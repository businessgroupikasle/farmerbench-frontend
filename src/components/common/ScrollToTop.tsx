import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();
  const prevPathnameRef = useRef<string | null>(null);
  const prevHashRef = useRef<string | null>(null);

  useEffect(() => {
    // Disable native browser scroll restoration so SPA route changes start at the top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const isFirstRun = prevPathnameRef.current === null;
    const pathnameChanged = !isFirstRun && prevPathnameRef.current !== pathname;
    const hashChanged = !isFirstRun && prevHashRef.current !== hash;
    prevPathnameRef.current = pathname;
    prevHashRef.current = hash;

    // On /products with an active search query, ProductsPage owns scrolling directly to results
    const isProductsSearch =
      pathname === '/products' && Boolean(new URLSearchParams(search).get('search')?.trim());

    if (hash && (isFirstRun || pathnameChanged || hashChanged)) {
      if (isProductsSearch && hash === '#products-catalog-section' && document.getElementById('products-catalog-section')) {
        return;
      }

      // If there is an anchor hash (e.g. #mission, #crop-calendar)
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
        }
      }, 80);
      return () => clearTimeout(timer);
    } else if (!hash && pathnameChanged) {
      if (isProductsSearch && document.getElementById('products-catalog-section')) {
        return;
      }

      // Immediate scroll to top / hero section on route path changes only
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;

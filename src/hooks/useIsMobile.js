import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Returns true on touch-primary devices OR narrow viewports.
 * Uses matchMedia so it reacts to window resizes and orientation changes.
 */
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= MOBILE_BREAKPOINT || 
           window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const touch = window.matchMedia('(pointer: coarse)');

    const update = () => setIsMobile(mq.matches || touch.matches);
    mq.addEventListener('change', update);
    touch.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      touch.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}

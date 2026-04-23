import { useState, useEffect, useCallback } from 'react';
import strikeBus from '../lib/strikeBus';

// Same behaviour as before, but now also subscribes to strikeBus so
// it fires in lockstep with the entry lightning.
export default function GlitchText({ children, fireImmediately = false }) {
  const [g, setG] = useState('idle');

  const runGlitch = useCallback(() => {
    setG('pre');
    setTimeout(() => {
      setG('burst');
      setTimeout(() => {
        setG('pre');
        setTimeout(() => {
          setG('burst');
          setTimeout(() => setG('idle'), 70);
        }, 80);
      }, 110);
    }, 55);
  }, []);

  // Sync with lightning strike
  useEffect(() => strikeBus.on(runGlitch), [runGlitch]);



  const STYLES = {
    idle: {},
    pre: {
      textShadow: '1.5px 0 var(--accent), -1px 0 oklch(0.65 0.2 25)',
      transform: 'translateX(1.5px)',
      filter: 'brightness(1.2)',
    },
    burst: {
      textShadow: '4px 0 var(--accent), -4px 0 oklch(0.65 0.2 25), 0 0 28px var(--accent), 0 0 55px color-mix(in oklch, var(--accent) 50%, transparent)',
      transform: 'translateX(3px) skewX(-3deg)',
      filter: 'brightness(1.45) contrast(1.1)',
    },
  };

  return (
    <span style={{
      display: 'inline-block',
      transition: g === 'idle' ? 'all 0.25s ease' : 'none',
      willChange: 'transform, filter',
      ...STYLES[g],
    }}>
      {children}
    </span>
  );
}

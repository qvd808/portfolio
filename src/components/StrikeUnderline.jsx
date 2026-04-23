import { useState, useEffect } from 'react';
import strikeBus from '../lib/strikeBus';

// Span with an accent underline that re-strokes itself when the
// strikeBus fires, so it feels caused by the lightning.
export default function StrikeUnderline({ children }) {
  const [prog, setProg] = useState(100);
  useEffect(() => {
    const unsub = strikeBus.on(() => {
      setProg(0);
      requestAnimationFrame(() => { requestAnimationFrame(() => setProg(100)); });
    });
    return unsub;
  }, []);
  return (
    <span className="accent-underline" style={{ '--ul-progress': prog + '%' }}>
      {children}
    </span>
  );
}

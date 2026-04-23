import { useEffect, useRef } from 'react';


// Clones headings and boxes as black silhouettes behind the spotlight mask.
function ShadowSystem({ selectors }) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current; if (!container) return;
    let queued = false;
    const sync = () => {
      queued = false;
      const targets = Array.from(document.querySelectorAll(selectors));
      if (!targets.length) return;
      if (container.children.length !== targets.length) {
        container.innerHTML = '';
        targets.forEach(el => {
          let clone;
          
          // Optimization: If it's a structural box (like a card or image), 
          // do NOT deep clone its children. Just create a black rect matching its border-radius.
          const isText = ['H1', 'H2', 'H3', 'H4', 'H5'].includes(el.tagName) || el.classList.contains('hero-heading') || el.classList.contains('section-title') || el.classList.contains('contact-title');
          
          if (!isText) {
            clone = document.createElement('div');
            clone.style.backgroundColor = 'black';
            clone.style.borderRadius = window.getComputedStyle(el).borderRadius;
          } else {
            clone = el.cloneNode(true);
            clone.style.webkitTextStroke = '1.5px black';
            clone.style.color = 'black';
          }
          
          Object.assign(clone.style, {
            position: 'fixed', margin: '0', pointerEvents: 'none',
            boxSizing: 'border-box',
            filter: 'brightness(0) blur(4px)',
            willChange: 'transform'
          });
          clone.removeAttribute('id');
          clone.setAttribute('aria-hidden', 'true');
          container.appendChild(clone);
        });
      }
      
      const wh = window.innerHeight;
      const rects = targets.map(el => el.getBoundingClientRect());
      
      targets.forEach((el, i) => {
        const c = container.children[i]; if (!c) return;
        const r = rects[i];
        
        // GPU optimization: Completely skip shadow blurring for offscreen elements
        if (r.width === 0 || r.height === 0 || r.bottom < -150 || r.top > wh + 150) { 
          c.style.display = 'none'; 
          return; 
        }
        
        c.style.display = 'block';
        c.style.left = r.left + 'px'; 
        c.style.top = r.top + 'px';
        c.style.width = r.width + 'px'; 
        c.style.height = r.height + 'px';
      });
    };
    const q = () => { if (!queued) { queued = true; requestAnimationFrame(sync); } };
    window.addEventListener('scroll', q, { passive: true });
    const onResize = () => { container.innerHTML = ''; q(); };
    window.addEventListener('resize', onResize);
    const interval = setInterval(q, 1000);
    q();
    return () => {
      window.removeEventListener('scroll', q);
      window.removeEventListener('resize', onResize);
      clearInterval(interval);
    };
  }, [selectors]);
  return (
    <div className="shadow-mask-layer">
      <div ref={ref} className="shadow-transform-layer" />
    </div>
  );
}

// Mount once at App root. Manages the spotlight position and all layers.
export default function Atmosphere({
  selectors = '.hero-heading, .section-title, .contact-title, .project, .portrait-wrap, .shadow-box',
}) {
  useEffect(() => {
    document.body.classList.add('spotlight-on');
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    let raf;
    let isRunning = true;

    const onMove = e => { 
      tx = e.clientX; 
      ty = e.clientY; 
      if (!isRunning) {
        isRunning = true;
        raf = requestAnimationFrame(loop);
      }
    };
    
    const loop = () => {
      const dx = tx - cx;
      const dy = ty - cy;
      
      // Sleep condition: if the spotlight is practically at the cursor, stop drawing
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        cx = tx;
        cy = ty;
        document.body.style.setProperty('--spot-x', cx + 'px');
        document.body.style.setProperty('--spot-y', cy + 'px');
        isRunning = false;
        return;
      }
      
      cx += dx * 0.18;
      cy += dy * 0.18;
      document.body.style.setProperty('--spot-x', cx + 'px');
      document.body.style.setProperty('--spot-y', cy + 'px');
      raf = requestAnimationFrame(loop);
    };
    
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove('spotlight-on');
    };
  }, []);
  return (
    <>
      <div className="neon-layer" />
      <div className="brick-layer" />
      <ShadowSystem selectors={selectors} />
    </>
  );
}

import { useEffect, useRef } from 'react';


function ShadowSystem({ selectors }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    
    let lastLayoutHash = '';
    
    const buildLayout = () => {
      const targets = Array.from(document.querySelectorAll(selectors));
      if (!targets.length) return;
      
      const domHash = targets.length + '-' + targets.map(t => t.tagName).join('');
      if (domHash !== lastLayoutHash) {
        container.innerHTML = '';
        targets.forEach(el => {
          let clone;
          const isText = ['H1', 'H2', 'H3', 'H4', 'H5'].includes(el.tagName) || 
                         el.classList.contains('hero-heading') || 
                         el.classList.contains('section-title') || 
                         el.classList.contains('contact-title');
                         
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
            position: 'absolute', margin: '0', pointerEvents: 'none',
            boxSizing: 'border-box',
            filter: 'brightness(0) blur(4px)',
            willChange: 'transform'
          });
          clone.removeAttribute('id');
          clone.setAttribute('aria-hidden', 'true');
          container.appendChild(clone);
        });
        lastLayoutHash = domHash;
      }
      
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      targets.forEach((el, i) => {
        const c = container.children[i]; if (!c) return;
        const r = el.getBoundingClientRect();
        
        if (r.width === 0 || r.height === 0) {
          c.style.display = 'none';
          return;
        }
        
        c.style.display = 'block';
        c.style.left = Math.round(r.left + scrollX) + 'px';
        c.style.top = Math.round(r.top + scrollY) + 'px';
        c.style.width = Math.round(r.width) + 'px';
        c.style.height = Math.round(r.height) + 'px';
      });
    };
    
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => requestAnimationFrame(buildLayout), 100);
    };
    
    // The GPU now handles all scrolling perfectly naturally with one transform matrix!
    // No layout thrashing or node updates are computed during scrolling.
    let scrollRaf;
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
         container.style.transform = `translate3d(${-window.scrollX}px, ${-window.scrollY}px, 0)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    
    const interval = setInterval(() => requestAnimationFrame(buildLayout), 2000);
    
    buildLayout();
    onScroll();
    setTimeout(buildLayout, 1000);
    setTimeout(buildLayout, 2500);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearInterval(interval);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(scrollRaf);
    };
  }, [selectors]);

  return (
    <div className="shadow-mask-layer">
      <div className="shadow-transform-layer">
        <div ref={containerRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }} />
      </div>
    </div>
  );
}

// Mount once at App root. Manages the spotlight position and all layers.
export default function Atmosphere({
  selectors = '.hero-heading, .section-title, .contact-title, .project, .portrait-wrap, .shadow-box',
}) {
  const providerRef = useRef(null);
  
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
        if (providerRef.current) {
          providerRef.current.style.setProperty('--spot-x', cx + 'px');
          providerRef.current.style.setProperty('--spot-y', cy + 'px');
        }
        isRunning = false;
        return;
      }
      
      cx += dx * 0.18;
      cy += dy * 0.18;
      
      if (providerRef.current) {
        providerRef.current.style.setProperty('--spot-x', cx + 'px');
        providerRef.current.style.setProperty('--spot-y', cy + 'px');
      }
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
    <div ref={providerRef} style={{ display: 'contents' }}>
      <div className="spotlight-bloom" />
      <div className="neon-layer" />
      <div className="brick-layer" />
      <ShadowSystem selectors={selectors} />
    </div>
  );
}

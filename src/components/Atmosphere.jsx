import { useEffect, useRef } from 'react';

// Random dark blotches for wall unevenness. Drawn once per mount.
function GrimeLayer() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const count = 7 + Math.floor(Math.random() * 3);
    const gradients = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100, y = Math.random() * 100;
      const r = 12 + Math.random() * 22;
      const alpha = .12 + Math.random() * .22;
      gradients.push(
        `radial-gradient(ellipse ${r}vw ${r * 0.7}vw at ${x}% ${y}%, oklch(0.08 0.02 30 / ${alpha}) 0%, transparent 60%)`
      );
    }
    el.style.backgroundImage = gradients.join(',');
  }, []);
  return <div ref={ref} className="grime-layer" />;
}

// Drifting dust motes in the spotlight beam.
function DustLayer() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const motes = [];
    const N = 18;
    for (let i = 0; i < N; i++) {
      const m = document.createElement('div');
      m.className = 'mote';
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      m.style.left = x + '%';
      m.style.top = y + '%';
      const scale = 0.5 + Math.random() * 1.3;
      m.style.transform = `scale(${scale})`;
      m.style.opacity = (0.3 + Math.random() * 0.55).toFixed(2);
      el.appendChild(m);
      motes.push({
        el: m, x0: x, y0: y,
        speed: 0.1 + Math.random() * 0.25,
        drift: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
    const start = performance.now();
    let raf;
    const tick = now => {
      const t = (now - start) / 1000;
      motes.forEach(m => {
        const ny = (m.y0 + t * m.speed * 10) % 110;
        const nx = m.x0 + Math.sin(t * 0.7 + m.phase) * 1.2 + m.drift * t * 4;
        m.el.style.top = ny + '%';
        m.el.style.left = nx + '%';
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      motes.forEach(m => m.el.remove());
    };
  }, []);
  return <div ref={ref} className="dust-layer" />;
}

// Clones headings as black silhouettes behind the spotlight mask so they
// read as shadows cast by the flashlight.
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
          const clone = el.cloneNode(true);
          Object.assign(clone.style, {
            position: 'fixed', margin: '0', pointerEvents: 'none',
            boxSizing: 'border-box', webkitTextStroke: '1.5px black', color: 'black',
          });
          clone.removeAttribute('id');
          clone.setAttribute('aria-hidden', 'true');
          container.appendChild(clone);
        });
      }
      const rects = targets.map(el => el.getBoundingClientRect());
      targets.forEach((el, i) => {
        const c = container.children[i]; if (!c) return;
        const r = rects[i];
        if (r.width === 0 || r.height === 0) { c.style.display = 'none'; return; }
        c.style.display = 'block';
        c.style.left = r.left + 'px'; c.style.top = r.top + 'px';
        c.style.width = r.width + 'px'; c.style.height = r.height + 'px';
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
// The `selectors` prop picks which headings cast shadows — adjust if
// your section/contact titles use different class names.
export default function Atmosphere({
  selectors = '.hero-heading, .section-title, .contact-title',
}) {
  useEffect(() => {
    document.body.classList.add('spotlight-on');
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    const onMove = e => { tx = e.clientX; ty = e.clientY; };
    let raf;
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
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
      <GrimeLayer />
      <ShadowSystem selectors={selectors} />
      <DustLayer />
    </>
  );
}

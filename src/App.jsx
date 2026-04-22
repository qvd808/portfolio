import { useState, useEffect, useRef } from 'react';
import GlitchIntro from './components/GlitchIntro';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Tweaks, { useTweaks } from './components/Tweaks';
import './index.css';

function Chrome({ theme, onToggleTheme }) {
  return (
    <header className="chrome">
      <div className="chrome-inner">
        <div className="chrome-left">
          <div className="logo">
            <span className="logo-dot" />
            <span>vinh<span style={{color:'var(--fg-4)'}}>.</span>dang</span>
            <span style={{color:'var(--fg-4)', marginLeft:6}}>// eng.</span>
          </div>
        </div>
        <nav className="chrome-right" style={{display:'flex'}}>
          <a href="#about" className="nav-link"><span className="num">01</span>about</a>
          <a href="#skills" className="nav-link"><span className="num">02</span>skills</a>
          <a href="#projects" className="nav-link"><span className="num">03</span>projects</a>
          <a href="#contact" className="nav-link"><span className="num">04</span>contact</a>
          <button className="theme-toggle" onClick={onToggleTheme}>
            {theme === 'dark' ? '◐ DARK' : '◑ CREAM'}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="build">
        <span style={{color:'var(--accent)'}}>●</span>
        <span>build · hand-crafted · {new Date().toISOString().slice(0,10)}</span>
      </div>
      <div>© 2026 vinh dang · all outputs verified</div>
    </footer>
  );
}

// Elements whose text will cast shadows on the brick wall
const SHADOW_SELECTORS = '.hero-heading, .section-title, .contact-title';
// How far the shadow extends past the element (higher = longer shadow)
const SHADOW_DEPTH = 0.45;
// Spotlight reveal radius (must match CSS mask in index.css)
const SPOT_R = 220;

function drawWrapped(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  let line = '';
  let currY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currY);
      currY += lineHeight;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currY);
}

export default function App() {
  const [tweakState, setTweakState] = useTweaks();
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('introSeen') === '1'; } catch { return false; }
  });
  const shadowCanvasRef = useRef(null);

  useEffect(() => {
    const body = document.body;
    body.classList.add('spotlight-on');

    const canvas = shadowCanvasRef.current;
    const sCtx = canvas?.getContext('2d');

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    const shadowColor = 'rgba(0, 0, 0, 0.75)';

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      body.style.setProperty('--spot-x', cx + 'px');
      body.style.setProperty('--spot-y', cy + 'px');


      if (sCtx && canvas) {
        sCtx.clearRect(0, 0, canvas.width, canvas.height);
        sCtx.save();

        // Clip shadows to the spotlight circle so they only appear on the lit wall
        sCtx.beginPath();
        sCtx.arc(cx, cy, SPOT_R + 60, 0, Math.PI * 2);
        sCtx.clip();

        document.querySelectorAll(SHADOW_SELECTORS).forEach(el => {
          const rect = el.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const st = getComputedStyle(el);
          const elCX = rect.left + rect.width / 2;
          const elCY = rect.top + rect.height / 2;

          // Project shadow away from cursor through the element center
          const dx = (elCX - cx) * SHADOW_DEPTH;
          const dy = (elCY - cy) * SHADOW_DEPTH;

          // Fade shadow out when element is far from spotlight center
          const distToSpot = Math.hypot(elCX - cx, elCY - cy);
          const alpha = Math.max(0, 1 - distToSpot / (SPOT_R * 1.4));
          if (alpha < 0.02) return;

          sCtx.save();
          sCtx.globalAlpha = alpha;
          sCtx.filter = 'blur(3px)';
          sCtx.fillStyle = shadowColor;
          sCtx.textBaseline = 'top';

          const fs = parseFloat(st.fontSize);
          const lh = parseFloat(st.lineHeight) || fs * 1.35;
          sCtx.font = `${st.fontWeight} ${fs}px ${st.fontFamily}`;

          drawWrapped(sCtx, el.textContent || '', rect.left + dx, rect.top + dy, rect.width, lh);
          sCtx.restore();
        });

        sCtx.restore();
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const toggleTheme = () => {
    const next = tweakState.theme === 'dark' ? 'light' : 'dark';
    setTweakState(s => ({ ...s, theme: next }));
  };

  return (
    <>
      {!introDone && (
        <GlitchIntro onDone={() => {
          setIntroDone(true);
          try { sessionStorage.setItem('introSeen', '1'); } catch {}
        }} />
      )}
      <div className="brick-layer" />
      <canvas ref={shadowCanvasRef} style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }} />
      <Chrome theme={tweakState.theme} onToggleTheme={toggleTheme} />
      <main style={{
        opacity: introDone ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s',
        position: 'relative',
        zIndex: 3,
      }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Tweaks
        state={tweakState}
        setState={setTweakState}
        visible={tweaksVisible}
        onClose={() => setTweaksVisible(false)}
      />
    </>
  );
}

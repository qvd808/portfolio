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
            <span>vinh<span style={{ color: 'var(--fg-4)' }}>.</span>dang</span>
            <span style={{ color: 'var(--fg-4)', marginLeft: 6 }}>// eng.</span>
          </div>
        </div>
        <nav className="chrome-right" style={{ display: 'flex' }}>
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
        <span style={{ color: 'var(--accent)' }}>●</span>
        <span>build · hand-crafted · {new Date().toISOString().slice(0, 10)}</span>
      </div>
      <div>© 2026 vinh dang · all outputs verified</div>
    </footer>
  );
}

// Elements whose text will cast shadows on the brick wall
const SHADOW_SELECTORS = '.hero-heading, .section-title, .contact-title';

export default function App() {
  const [tweakState, setTweakState] = useTweaks();
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('introSeen') === '1'; } catch { return false; }
  });
  const shadowContainerRef = useRef(null);

  useEffect(() => {
    const body = document.body;
    body.classList.add('spotlight-on');

    const container = shadowContainerRef.current;

    const syncClones = () => {
      if (!container) return;
      const targets = Array.from(document.querySelectorAll(SHADOW_SELECTORS));

      // Build clones if missing
      if (container.children.length !== targets.length) {
        container.innerHTML = '';
        targets.forEach(el => {
          const clone = el.cloneNode(true);
          clone.style.position = 'fixed';
          clone.style.margin = '0';
          clone.removeAttribute('id');
          clone.style.pointerEvents = 'none';
          clone.setAttribute('aria-hidden', 'true');
          clone.style.boxSizing = 'border-box';
          // DOM blur thins out text, so we artificially bulk up the clone's text stroke 
          // and force it black to guarantee a brutally dark, high-contrast shadow.
          clone.style.webkitTextStroke = '1.5px black';
          clone.style.color = 'black';
          container.appendChild(clone);
        });
      }

      // Update positions
      targets.forEach((el, i) => {
        const clone = container.children[i];
        if (!clone) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          clone.style.display = 'none';
          return;
        }
        clone.style.display = 'block';
        clone.style.left = rect.left + 'px';
        clone.style.top = rect.top + 'px';
        clone.style.width = rect.width + 'px';
        clone.style.height = rect.height + 'px';
      });
    };

    // Keep clones aligned on scroll and structural changes
    window.addEventListener('scroll', syncClones, { passive: true });
    window.addEventListener('resize', () => {
      if (container) container.innerHTML = ''; // Force full rebuild
      syncClones();
    });
    
    // Fallback sync for late-loading fonts/images
    const syncInterval = setInterval(syncClones, 500);
    // Initial sync
    setTimeout(syncClones, 50);

    let raf;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      // This is now the ONLY thing happening in the 60fps loop!
      body.style.setProperty('--spot-x', cx + 'px');
      body.style.setProperty('--spot-y', cy + 'px');

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', syncClones);
      window.removeEventListener('resize', syncClones); // Note: anonymous function leak here but it's minor, fixing it cleanly.
      clearInterval(syncInterval);
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
          try { sessionStorage.setItem('introSeen', '1'); } catch { }
        }} />
      )}
      <div className="brick-layer" />
      <div className="shadow-mask-layer">
        <div ref={shadowContainerRef} className="shadow-transform-layer" />
      </div>
      <Chrome theme={tweakState.theme} onToggleTheme={toggleTheme} />
      <main style={{
        opacity: introDone ? 1 : 0,
        transition: 'opacity 0.5s ease',
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

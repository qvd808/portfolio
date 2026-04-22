import { useState, useEffect } from 'react';
import Atmosphere from './components/Atmosphere';
import GlitchIntro from './components/GlitchIntro';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Tweaks, { useTweaks } from './components/Tweaks';
import NotFound from './components/NotFound';
import useIsMobile from './hooks/useIsMobile';
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
        <nav className="chrome-right" style={{ display: 'flex' }} aria-label="Main Navigation">
          <a href="#about" className="nav-link">about</a>
          <a href="#skills" className="nav-link">skills</a>
          <a href="#projects" className="nav-link">projects</a>
          <a href="#contact" className="nav-link">contact</a>
          <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
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

export default function App() {
  // ── 404 easter egg ──────────────────────────────────────────────────────────
  if (window.location.pathname.replace(/\/$/, '').endsWith('/404')) {
    return <NotFound />;
  }

  const [tweakState, setTweakState] = useTweaks();
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('introSeen') === '1'; } catch { return false; }
  });
  const isMobile = useIsMobile();

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

      {!isMobile && <Atmosphere />}

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
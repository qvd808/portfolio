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
    <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]">
      <div className="max-w-page mx-auto px-5 py-2.5 flex items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="font-mono font-semibold text-base flex items-center gap-2 tracking-tight">
            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)] animate-pulse-dot" />
            <span>vinh<span className="text-fg-4">.</span>dang</span>
            <span className="text-fg-4 ml-1.5">// eng.</span>
          </div>
        </div>
        <nav className="flex items-center gap-3.5" aria-label="Main Navigation">
          <a href="#about" className="font-mono text-sm text-fg-3 px-2.5 py-1.5 rounded hover:text-fg hover:bg-bg-2 transition-[background,color] duration-150 cursor-pointer">about</a>
          <a href="#skills" className="font-mono text-sm text-fg-3 px-2.5 py-1.5 rounded hover:text-fg hover:bg-bg-2 transition-[background,color] duration-150 cursor-pointer">skills</a>
          <a href="#projects" className="font-mono text-sm text-fg-3 px-2.5 py-1.5 rounded hover:text-fg hover:bg-bg-2 transition-[background,color] duration-150 cursor-pointer">projects</a>
          <a href="#contact" className="font-mono text-sm text-fg-3 px-2.5 py-1.5 rounded hover:text-fg hover:bg-bg-2 transition-[background,color] duration-150 cursor-pointer">contact</a>
          <button
            className="font-mono text-xs bg-bg-2 border border-border text-fg-2 px-2.5 py-1.5 rounded cursor-pointer flex items-center gap-1.5 hover:bg-bg-3 hover:text-fg transition-[background,color] duration-150"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '◐ DARK' : '◑ CREAM'}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="max-w-page mx-auto px-5 pt-10 pb-[60px] border-t border-border flex justify-between items-center gap-5 flex-wrap font-mono text-xs text-fg-4">
      <div className="flex items-center gap-2.5">
        <span className="text-accent">●</span>
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
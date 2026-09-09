import { useState, useEffect } from 'react';
import Atmosphere from './components/Atmosphere';
import Hero from './components/Hero';
import QuickFacts from './components/QuickFacts';
import Story from './components/Story';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Tweaks, { useTweaks } from './components/Tweaks';
import NotFound from './components/NotFound';
import useIsMobile from './hooks/useIsMobile';
import './index.css';

function Chrome() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'color-mix(in srgb,var(--color-bg) 88%,transparent)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid var(--color-divider)' }}>
      <div className="nav" style={{ maxWidth: 1120, margin: '0 auto', padding: 'var(--space-3) var(--space-6)', flexWrap: 'wrap' }}>
        <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 'none', whiteSpace: 'nowrap' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)', animation: 'noct-pulse 2.4s infinite' }} />
          Vinh Dang
        </div>
        <a href="#story" style={{ color: 'var(--color-text)', flex: 'none', whiteSpace: 'nowrap' }}>Story</a>
        <a href="#work" style={{ color: 'var(--color-text)', flex: 'none', whiteSpace: 'nowrap' }}>Work</a>
        <a href="#depth" style={{ color: 'var(--color-text)', flex: 'none', whiteSpace: 'nowrap' }}>Skills</a>
        <a href="#contact" className="btn btn-primary" style={{ flex: 'none', whiteSpace: 'nowrap' }}>Get in touch</a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ maxWidth: 1120, margin: '0 auto', padding: 'var(--space-8) var(--space-6) calc(var(--space-8)*2)', display: 'flex', justifyContent: 'space-between', gap: 'var(--space-6)', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-neutral-600)', borderTop: '1px solid var(--color-divider)' }}>
      <span>Quang Vinh Dang · firmware developer · Burnaby, BC</span>
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

  return (
    <>
      {!isMobile && <Atmosphere />}

      <Chrome />
      <main style={{ position: 'relative', zIndex: 3 }}>
        <Hero />
        <QuickFacts />
        <Story />
        <Projects />
        <Skills />
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

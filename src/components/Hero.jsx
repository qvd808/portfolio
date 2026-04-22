import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
const ShatterImage = lazy(() => import('./ShatterImage'));
import headshotSrc from '../assets/HeadShot.jpeg';
import useIsMobile from '../hooks/useIsMobile';

const COMMANDS = [
  { cmd: 'cat /proc/interests', out: 'OS, FPGAs, agents, PCB, formal verification, compilers...' },
  { cmd: 'grep today focus.log', out: 'RISC-V CPU on Altera · learning Zig' },
  { cmd: 'cat process.sh', out: 'find interesting thing → spend the day coding it → repeat' },
  { cmd: 'uptime', out: '22yr · pathologically curious · runs on caffeine' },
  { cmd: 'which editor', out: '/usr/bin/nvim  # obviously' },
];

const DOMAINS = [
  'OS internals',
  'RISC-V / FPGAs',
  'agent pipelines',
  'PCB design',
  'formal verification',
  'compiler theory',
  'GPU compute',
  'embedded firmware',
];

// ─── Command cycle hook ───────────────────────────────────────────────────────
function useCommandCycle(items, pauseMs = 2600, typeMs = 42) {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    let t;
    const full = items[i % items.length].cmd;
    if (phase === 'typing') {
      if (text.length < full.length) {
        t = setTimeout(() => setText(full.slice(0, text.length + 1)), typeMs);
      } else {
        t = setTimeout(() => setPhase('showing'), 500);
      }
    } else if (phase === 'showing') {
      t = setTimeout(() => setPhase('clearing'), pauseMs);
    } else if (phase === 'clearing') {
      setText('');
      setI(p => p + 1);
      setPhase('typing');
    }
    return () => clearTimeout(t);
  }, [text, phase, i, items, pauseMs, typeMs]);

  return {
    cmd: text,
    out: phase === 'showing' || phase === 'clearing' ? items[i % items.length].out : '',
    showCursor: phase === 'typing',
  };
}

// ─── Cycling domain label ─────────────────────────────────────────────────────
function DomainCycler() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % DOMAINS.length);
        setVisible(true);
      }, 280);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <span style={{
      display: 'inline-block',
      color: 'var(--accent)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scaleX(1)' : 'translateY(-6px) scaleX(0.95)',
      transition: 'opacity 0.28s ease, transform 0.28s ease',
      minWidth: '16ch',
      willChange: 'transform, opacity',
    }}>
      {DOMAINS[idx]}
    </span>
  );
}

// ─── Enhanced GlitchText ──────────────────────────────────────────────────────
// More flashy: double-stutter burst, fires immediately on first load then periodic
function GlitchText({ children, fireImmediately = false }) {
  const [g, setG] = useState('idle');

  const runGlitch = useCallback(() => {
    setG('pre');
    setTimeout(() => {
      setG('burst');
      setTimeout(() => {
        setG('pre');
        setTimeout(() => {
          setG('burst');
          setTimeout(() => { setG('idle'); }, 70);
        }, 80);
      }, 110);
    }, 55);
  }, []);

  useEffect(() => {
    let firstTimer;
    if (fireImmediately) {
      firstTimer = setTimeout(runGlitch, 750);
    }

    let t;
    const period = () => 2400 + Math.random() * 3000;
    const startDelay = fireImmediately ? 4200 : period();

    const schedule = () => { t = setTimeout(() => { runGlitch(); schedule(); }, period()); };
    const startTimer = setTimeout(schedule, startDelay);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(startTimer);
      clearTimeout(t);
    };
  }, [runGlitch, fireImmediately]);

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

// ─── Entry lightning — fires once on hero mount ───────────────────────────────
function HeroEntryFlash() {
  const canvasRef = useRef(null);
  const [screenFlash, setScreenFlash] = useState(false);

  useEffect(() => {
    // Wait for GlitchIntro to finish + hero opacity fade-in
    const delay = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.offsetParent?.offsetWidth || window.innerWidth;
      const h = canvas.offsetParent?.offsetHeight || 500;
      canvas.width = w;
      canvas.height = h;

      // 3 bolts aimed at heading area (top 35% of hero)
      const bolts = Array.from({ length: 3 }, (_, b) => {
        const startX = b === 0 ? -50 : b === 1 ? w + 50 : w * (0.4 + Math.random() * 0.2);
        const startY = b === 2 ? -50 : -20;
        const endX = w * (0.15 + Math.random() * 0.45);
        const endY = h * (0.08 + Math.random() * 0.22);
        const steps = 22;
        const pts = [{ x: startX, y: startY }];
        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const jitter = (1 - t) * 95;
          pts.push({
            x: startX + (endX - startX) * t + (Math.random() - 0.5) * jitter,
            y: startY + (endY - startY) * t + (Math.random() - 0.5) * jitter * 0.35,
          });
        }
        pts.push({ x: endX, y: endY });
        return pts;
      });

      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 120);

      let life = 1.0;
      let lastTime = performance.now();
      let raf;

      const tick = (now) => {
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        life = Math.max(0, life - dt * 3.0);
        ctx.clearRect(0, 0, w, h);

        bolts.forEach(pts => {
          // Layered glow passes
          [24, 11, 5, 2].forEach((lw, qi) => {
            const alphas = [0.07, 0.13, 0.52, 1.0];
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = `rgba(200, 235, 255, ${alphas[qi] * life})`;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = 'rgba(160, 215, 255, 1)';
            ctx.shadowBlur = qi < 2 ? 28 : 0;
            ctx.stroke();
          });

          // Impact flash at bolt endpoint
          const ep = pts[pts.length - 1];
          const grd = ctx.createRadialGradient(ep.x, ep.y, 0, ep.x, ep.y, 80);
          grd.addColorStop(0, `rgba(220, 245, 255, ${0.75 * life})`);
          grd.addColorStop(0.4, `rgba(120, 185, 255, ${0.4 * life})`);
          grd.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, 80, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        });

        if (life > 0) {
          raf = requestAnimationFrame(tick);
        } else {
          ctx.clearRect(0, 0, w, h);
        }
      };

      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, 700);

    return () => clearTimeout(delay);
  }, []);

  return (
    <>
      {/* Full-page white flash */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(200, 235, 255, 0.2)',
        pointerEvents: 'none',
        zIndex: 50,
        opacity: screenFlash ? 1 : 0,
        transition: screenFlash ? 'none' : 'opacity 0.18s ease',
      }} />
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }} />
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { cmd, out, showCursor } = useCommandCycle(COMMANDS);
  const isMobile = useIsMobile();

  return (
    <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Entry lightning — desktop only */}
      {!isMobile && <HeroEntryFlash />}

      <div className="hero-status-strip">
        <span className="status-chip live"><span className="dot" /> OPEN TO WORK</span>
        <span className="status-chip"><span className="dot" style={{ background: 'var(--fg-3)' }} /> VANCOUVER, BC</span>
        <span className="status-chip">SFU · B.SC 2025</span>
        <span className="status-chip">WILL RELOCATE</span>
      </div>

      <div className="hero-grid">
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-4)', marginBottom: 18, letterSpacing: '0.04em' }}>
            ~/vinh <span style={{ color: 'var(--accent)' }}>§</span> hi there 👋
          </div>

          <h1 className="hero-heading">
            I find it interesting.{' '}
            <GlitchText fireImmediately={true}>
              <span className="accent-underline">I build it today.</span>
            </GlitchText>
            <br />
            <em className="serif">Then I find the next thing.</em>
          </h1>

          {/* Cycling domain strip — shows breadth without listing it */}
          <div className="mono" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12,
            color: 'var(--fg-4)',
            marginBottom: 22,
            marginTop: -4,
            letterSpacing: '0.02em',
          }}>
            <span>→</span>
            <DomainCycler />
            <span style={{ opacity: 0.4 }}>· and whatever's next</span>
          </div>

          <div className="terminal-box">
            <div className="terminal-head">
              <span className="t-dot r" /><span className="t-dot y" /><span className="t-dot g" />
              <span className="t-title">— nvim — vinh@arch ~</span>
            </div>
            <div className="terminal-body">
              <div className="t-line">
                <span className="t-prompt">vinh@arch</span>
                <span className="t-sep">:</span>
                <span className="t-path">~</span>
                <span className="t-sep">$</span>
                <span className="t-cmd">{cmd}{showCursor && <span className="glitch-cursor" />}</span>
              </div>
              {out && <div className="t-out">{out}</div>}
            </div>
          </div>

          <p className="hero-sub">
            No single specialty — just a process. I find something genuinely hard,
            spend the day building it, figure it out. OS internals, FPGAs, agent pipelines,
            PCB design, formal verification — if it requires real thinking, I'm in.
            Currently somewhere between a RISC-V CPU and learning Zig.
          </p>

          <div className="cta-row">
            <a href="#projects" className="btn primary">
              see projects <span className="arrow">→</span>
            </a>
            <a href="https://github.com/qvd808" target="_blank" rel="noreferrer" className="btn" aria-label="View my GitHub profile">
              github ↗
            </a>
            <a href="https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn" aria-label="View my resume (Google Drive)">
              resume ↗
            </a>
          </div>
        </div>

        <div>
          <div className="portrait-wrap">
            {isMobile ? (
              <img 
                src={headshotSrc} 
                alt="Vinh Dang" 
                fetchpriority="high"
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <Suspense fallback={<div style={{ width: '100%', height: '100%', background: 'var(--bg-2)' }} />}>
                <ShatterImage src={headshotSrc} alt="Vinh Dang" fetchpriority="high" />
              </Suspense>
            )}
            <div className="portrait-overlay" />
            <div className="portrait-badge">
              <span>vinh.jpeg</span>
              <span style={{ color: 'var(--accent)' }}>●</span>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <span>NOW</span>
              <span>2026.Q2</span>
            </div>
            <div className="hero-card-row"><span className="k">obsessing over</span><span className="v">FPGA CPU</span></div>
            <div className="hero-card-row"><span className="k">learning</span><span className="v">Zig</span></div>
            <div className="hero-card-row"><span className="k">editor</span><span className="v">nvim 🚀</span></div>
            <div className="hero-card-row"><span className="k">status</span><span className="v" style={{ color: 'var(--accent)' }}>broke + curious</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
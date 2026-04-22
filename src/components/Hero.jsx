import { useState, useEffect, useRef } from 'react';
import headshot from '../assets/HeadShot.jpeg';
import ShatterImage from './ShatterImage';
import strikeBus from '../lib/strikeBus';
import GlitchText from './GlitchText';
import StrikeUnderline from './StrikeUnderline';
import InterestOrbit from './InterestOrbit';

const COMMANDS = [
  { cmd: 'cat /proc/curiosity', out: "whatever's hard this week" },
  { cmd: 'grep today focus.log', out: 'RISC-V CPU on Altera · learning Zig' },
  { cmd: 'cat process.sh', out: 'find hard thing → spend the day on it → repeat' },
  { cmd: 'which editor', out: '/usr/bin/nvim  # obviously' },
];

function useTyping(items, pauseMs = 2600, typeMs = 42) {
  const [i, setI] = useState(0);
  const [t, setT] = useState('');
  const [p, setP] = useState('typing');
  useEffect(() => {
    let id;
    const full = items[i % items.length].cmd;
    if (p === 'typing') {
      if (t.length < full.length) id = setTimeout(() => setT(full.slice(0, t.length + 1)), typeMs);
      else id = setTimeout(() => setP('showing'), 500);
    } else if (p === 'showing') {
      id = setTimeout(() => setP('clearing'), pauseMs);
    } else if (p === 'clearing') {
      setT(''); setI(x => x + 1); setP('typing');
    }
    return () => clearTimeout(id);
  }, [t, p, i, items, pauseMs, typeMs]);
  return {
    cmd: t,
    out: (p === 'showing' || p === 'clearing') ? items[i % items.length].out : '',
    cursor: p === 'typing',
  };
}

// Canvas lightning that fires on hero mount and triggers strikeBus.
function HeroLightning() {
  const canvasRef = useRef(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const c = canvasRef.current; if (!c) return;
      const ctx = c.getContext('2d');
      const w = c.offsetParent?.offsetWidth || window.innerWidth;
      const h = c.offsetParent?.offsetHeight || 500;
      c.width = w; c.height = h;
      const bolts = Array.from({ length: 3 }, (_, b) => {
        const sx = b === 0 ? -50 : b === 1 ? w + 50 : w * (.4 + Math.random() * .2);
        const sy = b === 2 ? -50 : -20;
        const ex = w * (.15 + Math.random() * .45);
        const ey = h * (.08 + Math.random() * .22);
        const steps = 22;
        const pts = [{ x: sx, y: sy }];
        for (let i = 1; i < steps; i++) {
          const tt = i / steps; const j = (1 - tt) * 95;
          pts.push({ x: sx + (ex - sx) * tt + (Math.random() - .5) * j, y: sy + (ey - sy) * tt + (Math.random() - .5) * j * .35 });
        }
        pts.push({ x: ex, y: ey });
        return pts;
      });

      setFlash(true); setTimeout(() => setFlash(false), 120);
      strikeBus.fire();

      let life = 1, last = performance.now(), raf;
      const tick = now => {
        const dt = (now - last) / 1000; last = now;
        life = Math.max(0, life - dt * 3);
        ctx.clearRect(0, 0, w, h);
        bolts.forEach(pts => {
          [24, 11, 5, 2].forEach((lw, qi) => {
            const a = [.07, .13, .52, 1][qi];
            ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = `rgba(200,235,255,${a * life})`;
            ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.shadowColor = 'rgba(160,215,255,1)';
            ctx.shadowBlur = qi < 2 ? 28 : 0; ctx.stroke();
          });
          const ep = pts[pts.length - 1];
          const g = ctx.createRadialGradient(ep.x, ep.y, 0, ep.x, ep.y, 80);
          g.addColorStop(0, `rgba(220,245,255,${.75 * life})`);
          g.addColorStop(.4, `rgba(120,185,255,${.4 * life})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath(); ctx.arc(ep.x, ep.y, 80, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        });
        if (life > 0) raf = requestAnimationFrame(tick);
        else ctx.clearRect(0, 0, w, h);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(200,235,255,.2)', pointerEvents: 'none',
        zIndex: 50, opacity: flash ? 1 : 0, transition: flash ? 'none' : 'opacity .18s ease',
      }} />
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10,
      }} />
    </>
  );
}

function Terminal() {
  const { cmd, out, cursor } = useTyping(COMMANDS);
  return (
    <div className="terminal-box">
      <div className="terminal-head">
        <span className="t-dot r" /><span className="t-dot y" /><span className="t-dot g" />
        <span className="t-title">— nvim — vinh@arch ~</span>
      </div>
      <div className="terminal-body">
        <div className="t-line">
          <span className="t-prompt">vinh@arch</span><span className="t-sep">:</span>
          <span className="t-path">~</span><span className="t-sep">$</span>
          <span className="t-cmd">{cmd}{cursor && <span className="glitch-cursor" />}</span>
        </div>
        {out && <div className="t-out">{out}</div>}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      <HeroLightning />

      <div className="hero-status-strip">
        <span className="status-chip live"><span className="dot" /> OPEN TO WORK</span>
        <span className="status-chip"><span className="dot" style={{ background: 'var(--fg-3)' }} /> VANCOUVER, BC</span>
        <span className="status-chip">SFU · B.SC 2025</span>
        <span className="status-chip">WILL RELOCATE</span>
      </div>

      <div className="hero-grid">
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-4)', marginBottom: 18, letterSpacing: '.04em' }}>
            ~/vinh <span style={{ color: 'var(--accent)' }}>§</span> hi there 👋
          </div>

          <h1 className="hero-heading">
            My attention span is a <GlitchText><StrikeUnderline>distributed system.</StrikeUnderline></GlitchText>
          </h1>

          <InterestOrbit />

          <Terminal />

          <p className="hero-sub">
            No single specialty &mdash; just a habit. Something looks hard, I spend the day on it,
            something runs, I go find the next thing. Currently stuck between a RISC-V CPU on
            an Altera board and learning Zig. Send help <span style={{ opacity: .7 }}>(or an offer).</span>
          </p>

          <div className="cta-row">
            <a href="#projects" className="btn primary">see projects <span className="arrow">→</span></a>
            <a href="https://github.com/qvd808" target="_blank" rel="noreferrer" className="btn">github ↗</a>
            <a href="https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view" target="_blank" rel="noreferrer" className="btn">resume ↗</a>
          </div>
        </div>

        <div>
          <div className="portrait-wrap">
            {/* Restored the shatter image effect */}
            <ShatterImage src={headshot} alt="Vinh Dang" />
            <div className="portrait-overlay" />
            <div className="portrait-badge"><span>vinh.jpeg</span><span style={{ color: 'var(--accent)' }}>●</span></div>
          </div>
          <div className="hero-card">
            <div className="hero-card-header"><span>NOW</span><span>2026.Q2</span></div>
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

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
    <div className="shadow-box mt-7 bg-[oklch(0.12_0.008_250)] border border-border-strong rounded-md overflow-hidden font-mono shadow-[0_12px_40px_oklch(0_0_0/0.3)] [html[data-theme=light]_&]:bg-[oklch(0.99_0.01_85)] [html[data-theme=light]_&]:shadow-[0_8px_24px_oklch(0.3_0_0/0.08)]">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[oklch(0.17_0.008_250)] border-b border-border [html[data-theme=light]_&]:bg-[oklch(0.93_0.015_85)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.18_25)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.78_0.14_75)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.72_0.15_140)]" />
        <span className="ml-2.5 text-2xs text-fg-4">— nvim — vinh@arch ~</span>
      </div>
      <div className="px-4 py-3.5 text-[12.5px] min-h-[72px]">
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[oklch(0.72_0.15_140)] [html[data-theme=light]_&]:text-[oklch(0.5_0.15_140)]">vinh@arch</span>
          <span className="text-fg-4">:</span>
          <span className="text-[oklch(0.7_0.14_220)] [html[data-theme=light]_&]:text-[oklch(0.45_0.15_220)]">~</span>
          <span className="text-fg-4">$</span>
          <span className="text-fg ml-1">{cmd}{cursor && <span className="inline-block w-2 h-3.5 bg-accent animate-blink ml-0.5 align-[-2px]" />}</span>
        </div>
        {out && <div className="text-fg-3 mt-2 text-sm">{out}</div>}
      </div>
    </div>
  );
}

export default function Hero() {
  const [shatterState, setShatterState] = useState('INTACT');

  return (
    <section className="max-w-page mx-auto px-5 pt-20 pb-10 min-h-[calc(100vh-56px)] flex flex-col justify-center gap-10 relative overflow-hidden" id="hero">
      <HeroLightning />

      <div className="flex items-center gap-3.5 flex-wrap font-mono text-xs text-fg-3 pb-5 border-b border-dashed border-border">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-dim border border-accent-border rounded-[4px] text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot shadow-[0_0_8px_currentColor]" /> OPEN TO WORK
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-2 border border-border rounded-[4px]">
          <span className="w-1.5 h-1.5 rounded-full bg-fg-3" /> VANCOUVER, BC
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-2 border border-border rounded-[4px]">SFU · B.SC 2025</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-2 border border-border rounded-[4px]">WILL RELOCATE</span>
      </div>

      <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-[1fr_280px] lg:gap-[60px]">
        <div>
          <div className="font-mono text-xs text-fg-4 mb-[18px] tracking-[.04em]">
            ~/vinh <span className="text-accent">§</span> hi there 👋
          </div>

          <h1 className="hero-heading font-normal tracking-[-0.035em] leading-[1.02] text-fg">
            My attention span is a <GlitchText><StrikeUnderline>distributed system.</StrikeUnderline></GlitchText>
          </h1>

          <InterestOrbit />

          <Terminal />

          <p className="text-xl text-fg-2 max-w-[580px] mt-7" style={{ textWrap: 'pretty' }}>
            No single specialty &mdash; just a habit. Something looks hard, I spend the day on it,
            something runs, I go find the next thing. Currently stuck between a RISC-V CPU on
            an Altera board and learning Zig. Send help <span className="opacity-70">(or an offer).</span>
          </p>

          <div className="flex gap-2.5 mt-7 flex-wrap">
            <a href="#projects" className="shadow-box font-mono text-sm px-3.5 py-2.5 rounded border border-accent bg-accent text-[oklch(0.12_0.01_250)] font-semibold cursor-pointer inline-flex items-center gap-2 no-underline hover:brightness-[1.08] transition-[filter] duration-150">
              see projects <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </a>
            <a href="https://github.com/qvd808" target="_blank" rel="noreferrer" className="shadow-box font-mono text-sm px-3.5 py-2.5 rounded border border-border bg-bg-2 text-fg cursor-pointer inline-flex items-center gap-2 no-underline hover:bg-bg-3 hover:border-border-strong transition-[background,border-color] duration-150">
              github ↗
            </a>
            <a href="https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view" target="_blank" rel="noreferrer" className="shadow-box font-mono text-sm px-3.5 py-2.5 rounded border border-border bg-bg-2 text-fg cursor-pointer inline-flex items-center gap-2 no-underline hover:bg-bg-3 hover:border-border-strong transition-[background,border-color] duration-150">
              resume ↗
            </a>
          </div>
        </div>

        <div>
          <div className="shadow-box relative aspect-[3/4] rounded-lg overflow-hidden border border-border bg-bg-2 mb-4 cursor-crosshair">
            <ShatterImage src={headshot} alt="Vinh Dang" onStateChange={setShatterState} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[color-mix(in_oklab,var(--bg)_80%,transparent)] pointer-events-none" style={{ backgroundPosition: '0 40%' }} />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-center font-mono text-2xs text-fg">
              <span>vinh.jpeg</span><span className="text-accent">●</span>
            </div>
          </div>
          <div className="shadow-box bg-bg-1 border border-border rounded-lg p-4 font-mono text-xs text-fg-3">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-border text-fg-4 text-2xs uppercase tracking-[0.05em]">
              <span>NOW</span><span>2026.Q2</span>
            </div>
            <div className="flex justify-between items-center py-1.5"><span className="text-fg-4">obsessing over</span><span className="text-fg">FPGA CPU</span></div>
            <div className="flex justify-between items-center py-1.5"><span className="text-fg-4">learning</span><span className="text-fg">Zig</span></div>
            <div className="flex justify-between items-center py-1.5"><span className="text-fg-4">editor</span><span className="text-fg">nvim 🚀</span></div>
            <div className="flex justify-between items-center py-1.5"><span className="text-fg-4">status</span><span className="text-accent">{shatterState === 'INTACT' ? 'barely alive + curious' : 'broke + curious'}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

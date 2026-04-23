import { useState, useEffect, useRef, useCallback } from 'react';

function IntroLightning({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const lifeRef = useRef(0);
  const boltRef = useRef({ pts: [], flash: { x: 0, y: 0 }, forks: [] });

  const gen = useCallback((w, h) => {
    const corner = Math.floor(Math.random() * 4);
    const margin = 100;
    let sx, sy;
    if (corner === 0) { sx = -margin + Math.random() * 50; sy = -margin + Math.random() * 50 }
    else if (corner === 1) { sx = w + margin - Math.random() * 50; sy = -margin + Math.random() * 50 }
    else if (corner === 2) { sx = w + margin - Math.random() * 50; sy = h + margin - Math.random() * 50 }
    else { sx = -margin + Math.random() * 50; sy = h + margin - Math.random() * 50 }
    const ex = w * .5 + (Math.random() - .5) * 60;
    const ey = h * .5 + (Math.random() - .5) * 20;
    const steps = 22;
    const pts = [{ x: sx, y: sy }];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const bx = sx + (ex - sx) * t, by = sy + (ey - sy) * t;
      const j = (1 - t) * 130;
      pts.push({ x: bx + (Math.random() - .5) * j, y: by + (Math.random() - .5) * j * .5 });
    }
    pts.push({ x: ex, y: ey });
    const forks = [];
    for (let f = 0; f < 2; f++) {
      const fi = Math.floor(steps * (.3 + Math.random() * .5));
      if (pts[fi]) forks.push({ sx: pts[fi].x, sy: pts[fi].y, ex: pts[fi].x + (Math.random() - .5) * 150, ey: pts[fi].y + (Math.random() - .5) * 150 });
    }
    boltRef.current = { pts, flash: { x: ex, y: ey }, forks };
  }, []);

  const draw = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    if (lifeRef.current <= 0) return;
    const a = lifeRef.current;
    const { pts, flash, forks } = boltRef.current;
    [26, 14, 6, 3].forEach((lw, qi) => {
      const ga = [0.08, 0.15, 0.6, 1.0][qi];
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(200,230,255,${ga * a})`;
      ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(150,210,255,1)';
      ctx.shadowBlur = qi < 2 ? 30 : 0;
      ctx.stroke();
    });
    forks.forEach(f => {
      ctx.beginPath(); ctx.moveTo(f.sx, f.sy); ctx.lineTo(f.ex, f.ey);
      ctx.strokeStyle = `rgba(180,220,255,${.5 * a})`; ctx.lineWidth = 2; ctx.stroke();
    });
    const g = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, 120);
    g.addColorStop(0, `rgba(220,240,255,${.8 * a})`);
    g.addColorStop(.3, `rgba(120,180,255,${.5 * a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(flash.x, flash.y, 120, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
  }, []);

  useEffect(() => {
    if (!active) return;
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    lifeRef.current = 1;
    gen(c.width, c.height);
    let last = performance.now();
    const tick = now => {
      const dt = (now - last) / 1000; last = now;
      lifeRef.current = Math.max(0, lifeRef.current - dt * 4);
      draw(ctx, c.width, c.height);
      if (lifeRef.current > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, gen, draw]);

  return (
    <canvas ref={canvasRef} width={1000} height={600} style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      pointerEvents: 'none', zIndex: 2,
    }} />
  );
}

function GlitchBlocks({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) {
      const canvas = canvasRef.current;
      if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      const numBlocks = 8 + Math.floor(Math.random() * 10);
      for (let i = 0; i < numBlocks; i++) {
        const bh = 2 + Math.random() * 18;
        const by = Math.random() * h;
        const bx = (Math.random() - 0.5) * 60;
        const bw = w * (0.3 + Math.random() * 0.6);
        const bLeft = Math.random() * (w - bw);
        const channel = Math.floor(Math.random() * 3);
        const colors = [
          `rgba(255, 0, 80, ${0.15 + Math.random() * 0.3})`,
          `rgba(0, 255, 180, ${0.15 + Math.random() * 0.3})`,
          `rgba(0, 100, 255, ${0.15 + Math.random() * 0.3})`,
        ];
        ctx.fillStyle = colors[channel];
        ctx.fillRect(bLeft + bx, by, bw, bh);
      }

      if (frame % 3 === 0) {
        const sy = Math.random() * h;
        ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.04})`;
        ctx.fillRect(0, sy, w, 1 + Math.random() * 2);
      }

      frame++;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={300}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        zIndex: 3,
      }}
    />
  );
}

// Shortened intro splash (~1.2s). Esc / Enter / click to skip.
// Calls onDone when the fade-out finishes so the parent can unmount it.
export default function GlitchIntro({ onDone }) {
  const [phase, setPhase] = useState('show'); // show → strike → outro
  const [fading, setFading] = useState(false);
  const [lk, setLk] = useState(0);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return; done.current = true;
    setFading(true);
    setTimeout(() => onDone?.(), 140);
  }, [onDone]);

  useEffect(() => {
    if (phase === 'show') {
      const t = setTimeout(() => setPhase('strike'), 500);
      return () => clearTimeout(t);
    }
    if (phase === 'strike') {
      setLk(k => k + 1);
      const t = setTimeout(() => { setPhase('outro'); finish(); }, 340);
      return () => clearTimeout(t);
    }
  }, [phase, finish]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' || e.key === 'Enter') finish(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  const isLightning = phase === 'strike';
  const word = 'WELCOME';

  return (
    <div className={`glitch-splash ${fading ? 'fading' : ''}`} onClick={finish}>
      <div className="lightning-flash" style={{ opacity: isLightning ? 1 : 0 }} />
      <IntroLightning active={isLightning} key={lk} />
      <GlitchBlocks active={isLightning} />
      {phase !== 'outro' && (
        <>
          <div className={`glitch-word layer-base ${isLightning ? 'glitch-intense' : ''}`} key={`b-${phase}`}>{word}</div>
          <div className={`glitch-word layer-top ${isLightning ? 'glitch-intense' : ''}`} key={`t-${phase}`}>{word}</div>
          <div className={`glitch-word layer-bot ${isLightning ? 'glitch-intense' : ''}`} key={`d-${phase}`}>{word}</div>
        </>
      )}
      <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 font-mono text-[11px] text-[rgba(230,235,255,0.55)] z-10 tracking-[0.06em]">
        <kbd className="border border-[rgba(230,235,255,0.3)] px-1.5 py-0.5 rounded-[3px] bg-[rgba(230,235,255,0.05)] mx-1">esc</kbd> to skip
      </div>
    </div>
  );
}

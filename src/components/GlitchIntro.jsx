import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Lightning canvas ────────────────────────────────────────────────────────
function Lightning({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lifeRef = useRef(0);
  const boltGeometryRef = useRef({ pts: [], flash: { x: 0, y: 0 }, forks: [] });

  const generateBolt = useCallback((w, h) => {
    // Pick a random corner: 0=Top-Left, 1=Top-Right, 2=Bottom-Right, 3=Bottom-Left
    const corner = Math.floor(Math.random() * 4);
    let startX, startY;
    const margin = 100; // Start off-screen for a longer, more powerful strike

    if (corner === 0) {
      startX = -margin + Math.random() * 50;
      startY = -margin + Math.random() * 50;
    } else if (corner === 1) {
      startX = w + margin - Math.random() * 50;
      startY = -margin + Math.random() * 50;
    } else if (corner === 2) {
      startX = w + margin - Math.random() * 50;
      startY = h + margin - Math.random() * 50;
    } else {
      startX = -margin + Math.random() * 50;
      startY = h + margin - Math.random() * 50;
    }

    // Target the center
    const endX = w * 0.5 + (Math.random() - 0.5) * 60;
    const endY = h * 0.5 + (Math.random() - 0.5) * 20;

    // Increased steps from 14 to 26 for a longer, more jagged, violent path
    const steps = 26;
    const pts = [{ x: startX, y: startY }];

    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const bx = startX + (endX - startX) * t;
      const by = startY + (endY - startY) * t;
      // Increased jitter for wider chaotic arcs
      const jitter = (1 - t) * 140;
      pts.push({
        x: bx + (Math.random() - 0.5) * jitter,
        y: by + (Math.random() - 0.5) * jitter * 0.5
      });
    }
    pts.push({ x: endX, y: endY });

    // Generate two forks instead of one for more power
    const forks = [];
    for (let f = 0; f < 2; f++) {
      const forkFrom = Math.floor(steps * (0.3 + Math.random() * 0.5));
      if (pts[forkFrom]) {
        forks.push({
          startX: pts[forkFrom].x,
          startY: pts[forkFrom].y,
          endX: pts[forkFrom].x + (Math.random() - 0.5) * 150,
          endY: pts[forkFrom].y + (Math.random() - 0.5) * 150
        });
      }
    }

    boltGeometryRef.current = { pts, flash: { x: endX, y: endY }, forks };
  }, []);

  const drawBolt = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    if (lifeRef.current <= 0 || boltGeometryRef.current.pts.length === 0) return;

    const alpha = lifeRef.current;
    const { pts, flash, forks } = boltGeometryRef.current;

    // Increased thicknesses (26, 14, 6, 3) for a blindingly powerful core
    [26, 14, 6, 3].forEach((width, qi) => {
      const glowAlphas = [0.08, 0.15, 0.6, 1.0];
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(200, 230, 255, ${glowAlphas[qi] * alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(150, 210, 255, 1)';
      ctx.shadowBlur = qi < 2 ? 30 : 0;
      ctx.stroke();
    });

    // Draw branching mini forks
    forks.forEach(fork => {
      ctx.beginPath();
      ctx.moveTo(fork.startX, fork.startY);
      ctx.lineTo(fork.endX, fork.endY);
      ctx.strokeStyle = `rgba(180, 220, 255, ${0.5 * alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Bigger Impact flash
    const grad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, 120);
    grad.addColorStop(0, `rgba(220, 240, 255, ${0.8 * alpha})`);
    grad.addColorStop(0.3, `rgba(120, 180, 255, ${0.5 * alpha})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(flash.x, flash.y, 120, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    lifeRef.current = 1.0;
    generateBolt(canvas.width, canvas.height);

    let lastTime = performance.now();
    const tick = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      // Slightly faster fade out so the strike feels violently fast
      lifeRef.current = Math.max(0, lifeRef.current - dt * 4.0);

      drawBolt(ctx, canvas.width, canvas.height);

      if (lifeRef.current > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active, drawBolt, generateBolt]);

  return (
    <canvas
      ref={canvasRef}
      width={1000} // Increased canvas size to handle off-screen corner rendering
      height={600}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}

// ─── Glitch block overlay canvas ─────────────────────────────────────────────
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

// ─── Main intro ───────────────────────────────────────────────────────────────
const WORDS = ['Welcome', 'to my', 'WORLD.'];
const HOLD_MS = 820;
const LIGHTNING_MS = 320;

export default function GlitchIntro({ onDone }) {
  // Added an 'outro' phase to cleanly kill the word animation
  const [phase, setPhase] = useState('show');   // 'show' | 'lightning' | 'next' | 'outro'
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [lightningKey, setLightningKey] = useState(0);

  useEffect(() => {
    if (phase === 'show') {
      const t = setTimeout(() => setPhase('lightning'), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (phase === 'lightning') {
      setLightningKey(k => k + 1);
      const t = setTimeout(() => setPhase('next'), LIGHTNING_MS);
      return () => clearTimeout(t);
    }
    if (phase === 'next') {
      if (idx < WORDS.length - 1) {
        setIdx(i => i + 1);
        setPhase('show');
      } else {
        // As soon as the lightning on the last word finishes, move to outro.
        setPhase('outro');
        setFading(true);
        // Fire onDone early so content fades in under/behind the splash while it's still fading out.
        // The splash (z-index 100) covers it, so there's no visible pop — just a smooth handoff.
        setTimeout(() => onDone?.(), 150);
      }
    }
  }, [phase, idx, onDone]);

  const isLightning = phase === 'lightning';

  return (
    <div className={`glitch-splash ${fading ? 'fading' : ''}`} style={{ overflow: 'hidden' }}>

      <div
        className="lightning-flash"
        style={{ opacity: isLightning ? 1 : 0 }}
      />

      <GlitchBlocks active={isLightning} />
      <Lightning active={isLightning} key={lightningKey} />

      {/* Conditionally render the words. They will vanish INSTANTLY in the 'outro' phase */}
      {phase !== 'outro' && (
        <>
          <div
            className={`glitch-word layer-base ${isLightning ? 'glitch-intense' : ''}`}
            key={`b-${idx}-${phase}`}
          >
            {WORDS[idx]}
          </div>
          <div
            className={`glitch-word layer-top ${isLightning ? 'glitch-intense' : ''}`}
            key={`t-${idx}-${phase}`}
          >
            {WORDS[idx]}
          </div>
          <div
            className={`glitch-word layer-bot ${isLightning ? 'glitch-intense' : ''}`}
            key={`d-${idx}-${phase}`}
          >
            {WORDS[idx]}
          </div>
        </>
      )}
    </div>
  );
}
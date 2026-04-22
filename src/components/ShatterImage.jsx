import { useEffect, useRef } from 'react';
import { Delaunay } from 'd3-delaunay';

export default function ShatterImage({ src, alt, style, className, fetchpriority }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d');

    let loadedImg = null;
    let animFrame = null;
    let currentState = 'INTACT';
    let repairTimer = null;
    let repairStartTime = 0;
    let shatterStartTime = 0;
    let shardsData = [];
    let mouseHistory = [];

    const MOMENTUM_WINDOW_MS = 250;
    const SPEED_THRESHOLD = 1.5;
    const N_SHARDS = 50;
    const GAP_MULT = 2.0;
    const ROT_MULT = 1.0;

    function drawIntact() {
      ctx.clearRect(0, 0, W, H);
      if (loadedImg) ctx.drawImage(loadedImg, 0, 0, W, H);
    }

    function triggerShatter() {
      if (currentState !== 'INTACT') return;
      currentState = 'SHATTERING';
      shatterStartTime = Date.now();
      if (repairTimer) clearTimeout(repairTimer);

      const impactPoint = { x: W / 2, y: H / 2 };
      const pts = [];
      const nCore = Math.floor(N_SHARDS * 0.55);

      for (let i = 0; i < nCore; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.6) * Math.min(W, H) * 0.31;
        pts.push([
          Math.max(2, Math.min(W - 2, impactPoint.x + Math.cos(a) * r)),
          Math.max(2, Math.min(H - 2, impactPoint.y + Math.sin(a) * r)),
        ]);
      }
      const nOuter = N_SHARDS - nCore;
      for (let i = 0; i < nOuter; i++) {
        pts.push([5 + Math.random() * (W - 10), 5 + Math.random() * (H - 10)]);
      }
      pts.push([2, 2], [W - 2, 2], [2, H - 2], [W - 2, H - 2]);

      const del = Delaunay.from(pts);
      const vor = del.voronoi([0, 0, W, H]);

      shardsData = [];
      let maxDistFromCenter = 0;

      for (let i = 0; i < pts.length; i++) {
        const cell = vor.cellPolygon(i);
        if (!cell || cell.length < 3) continue;

        let cx = 0, cy = 0;
        for (const [x, y] of cell) { cx += x; cy += y; }
        cx /= cell.length; cy /= cell.length;

        const ddx = cx - impactPoint.x;
        const ddy = cy - impactPoint.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist > maxDistFromCenter) maxDistFromCenter = dist;

        shardsData.push({
          cell,
          cx, cy,
          normX: dist < 1 ? 0 : ddx / dist,
          normY: dist < 1 ? 0 : ddy / dist,
          distFromCenter: dist,
          rotAmp: (Math.random() - 0.5) * (3 * Math.PI / 180),
          rotPhase: Math.random() * Math.PI * 2,
          rotSpeed: 0.001 + Math.random() * 0.002,
          scaleAmp: 0.01 + Math.random() * 0.015,
          scalePhaseX: Math.random() * Math.PI * 2,
          scalePhaseY: Math.random() * Math.PI * 2,
          scaleSpeed: 0.002 + Math.random() * 0.003,
        });
      }

      shardsData.forEach(s => { s.normalizedDist = s.distFromCenter / maxDistFromCenter; });

      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(render);
    }

    function triggerRepair() {
      currentState = 'REPAIRING';
      repairStartTime = Date.now();
    }

    function render(time) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, W, H);

      const now = Date.now();
      let allShattered = true;
      let allRepaired = true;

      for (const shard of shardsData) {
        let targetRot = Math.sin(time * shard.rotSpeed + shard.rotPhase) * shard.rotAmp * ROT_MULT;
        let targetScaleX = 1 + Math.sin(time * shard.scaleSpeed + shard.scalePhaseX) * shard.scaleAmp;
        let targetScaleY = 1 + Math.sin(time * shard.scaleSpeed + shard.scalePhaseY) * shard.scaleAmp;

        const mag = Math.min(shard.distFromCenter * 0.018 + 1, GAP_MULT * 1.5);
        const targetDispX = shard.normX * mag;
        const targetDispY = shard.normY * mag;

        let progressAlpha = 1;

        if (currentState === 'SHATTERING') {
          allRepaired = false;
          const delay = shard.normalizedDist * 800;
          const timeIn = now - (shatterStartTime + delay);
          if (timeIn < 0) {
            progressAlpha = 0;
            allShattered = false;
          } else {
            const p = Math.min(1, timeIn / 300);
            progressAlpha = 1 - Math.pow(1 - p, 3);
            if (p < 1) allShattered = false;
          }
        } else if (currentState === 'REPAIRING') {
          allShattered = false;
          const delay = (1 - shard.normalizedDist) * 1500;
          const timeIn = now - (repairStartTime + delay);
          if (timeIn < 0) {
            progressAlpha = 1;
            allRepaired = false;
            targetRot *= 1.5;
            targetScaleX = 1 + (targetScaleX - 1) * 1.5;
            targetScaleY = 1 + (targetScaleY - 1) * 1.5;
          } else {
            const p = Math.min(1, timeIn / 800);
            progressAlpha = Math.pow(1 - p, 3);
            if (p < 1) allRepaired = false;
          }
        }

        const currentRot = targetRot * progressAlpha;
        const scaleX = 1 + (targetScaleX - 1) * progressAlpha;
        const scaleY = 1 + (targetScaleY - 1) * progressAlpha;
        const currentDispX = targetDispX * progressAlpha;
        const currentDispY = targetDispY * progressAlpha;
        const alphaEdge = progressAlpha;

        ctx.save();
        ctx.translate(shard.cx + currentDispX, shard.cy + currentDispY);
        ctx.rotate(currentRot);
        ctx.scale(scaleX, scaleY);
        ctx.translate(-shard.cx, -shard.cy);

        ctx.beginPath();
        shard.cell.forEach(([x, y], j) => j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(loadedImg, 0, 0, W, H);

        if (alphaEdge > 0.01) {
          ctx.strokeStyle = `rgba(0,0,0,${0.8 * alphaEdge})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.strokeStyle = `rgba(255,255,255,${0.2 * alphaEdge})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      if (currentState !== 'INTACT') {
        const glowBase = currentState === 'SHATTERING'
          ? Math.min(1, (now - shatterStartTime) / 1000)
          : (currentState === 'REPAIRING' && allRepaired) ? 0 : 1;

        if (glowBase > 0) {
          const glowIntensity = (0.2 + Math.sin(time * 0.003) * 0.1) * glowBase;
          const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 40);
          grad.addColorStop(0, `rgba(255,255,255,${glowIntensity})`);
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(W / 2 - 40, H / 2 - 40, 80, 80);
        }
      }

      if (currentState === 'SHATTERING' && allShattered) {
        currentState = 'SHATTERED';
        const repairDelay = 3000 + Math.random() * 7000;
        repairTimer = setTimeout(triggerRepair, repairDelay);
      }

      if (currentState === 'REPAIRING' && allRepaired) {
        currentState = 'INTACT';
        drawIntact();
        cancelAnimationFrame(animFrame);
        return;
      }

      animFrame = requestAnimationFrame(render);
    }

    // Cache rect to avoid layout thrashing on every mouse move
    let cachedRect = null;
    const updateRect = () => { if (canvas) cachedRect = canvas.getBoundingClientRect(); };

    const onMouseMove = (e) => {
      const now = Date.now();
      mouseHistory.push({ x: e.clientX, y: e.clientY, time: now });
      mouseHistory = mouseHistory.filter(m => now - m.time < MOMENTUM_WINDOW_MS);

      if (currentState !== 'INTACT' || mouseHistory.length < 5) return;

      const oldest = mouseHistory[0];
      const newest = mouseHistory[mouseHistory.length - 1];
      const dt = newest.time - oldest.time;
      if (dt === 0) return;

      const dx = newest.x - oldest.x;
      const dy = newest.y - oldest.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      if (!cachedRect) updateRect();
      const overCanvas =
        newest.x >= cachedRect.left && newest.x <= cachedRect.right &&
        newest.y >= cachedRect.top && newest.y <= cachedRect.bottom;

      if (overCanvas && speed > SPEED_THRESHOLD) {
        triggerShatter();
      }
    };

    const img = new Image();
    img.onload = () => {
      loadedImg = img;
      drawIntact();
    };
    img.src = src;

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect);
    updateRect();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
      if (animFrame) cancelAnimationFrame(animFrame);
      if (repairTimer) clearTimeout(repairTimer);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={560}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
      className={className}
    />
  );
}

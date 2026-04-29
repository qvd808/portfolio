import { useEffect, useRef } from 'react';
import strikeBus from '../lib/strikeBus';
import useIsMobile from '../hooks/useIsMobile';

// --- 3D Network Data ---
const nodesData = [
  { baseX: -320, baseY: -120, baseZ: 60, r: 32, color: "#8b5cf6", name: "RISC-V Core" },
  { baseX: -150, baseY: -160, baseZ: 40, r: 32, color: "#3b82f6", name: "OS/Kernel" },
  { baseX: 160, baseY: -150, baseZ: 80, r: 32, color: "#06b6d4", name: "Compilers" },
  { baseX: 320, baseY: -100, baseZ: 100, r: 32, color: "#f59e0b", name: "FPGAs" },
  { baseX: -180, baseY: 160, baseZ: 140, r: 32, color: "#10b981", name: "AI Agents" },
  { baseX: 180, baseY: 150, baseZ: 120, r: 32, color: "#ef4444", name: "PCBs" }
];

// Add huge array of distant random background spheres that don't connect
const dustNodes = Array.from({ length: 45 }).map(() => ({
  baseX: (Math.random() - 0.5) * 1400,
  baseY: (Math.random() - 0.5) * 800,
  baseZ: 300 + Math.random() * 1000,
  r: 4 + Math.random() * 10,
  color: "#1e293b",
  name: "",
  isDust: true
}));

const allNodesData = [...nodesData, ...dustNodes];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, str: `${r},${g},${b}` };
}

export default function AdhdPlasma() {
  const canvasRef = useRef(null);
  const isMobile = useIsMobile();
  const isMobileRef = useRef(isMobile);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // optimizes compositing since we draw custom background

    // We'll calculate the bounds from the container explicitly
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 280 * window.devicePixelRatio;

    // Scale all operations down to the CSS size to easily support retina displays
    const SCALE = window.devicePixelRatio;

    // Resolve CSS custom properties to canvas-usable colors ONCE at mount.
    // Canvas does NOT understand `var(--fg)`; without this, fillText silently
    // falls through to the previous fillStyle.
    const cssFg = getComputedStyle(document.documentElement)
      .getPropertyValue('--fg').trim() || '#e8eaed';

    const W = () => canvas.width;
    const H = () => canvas.height;
    const CX = () => W() / 2;
    const CY = () => H() / 2;

    const nodes3D = allNodesData.map(n => ({ ...n, x: n.baseX, y: n.baseY, z: n.baseZ, currentR: n.r }));

    let activeSphere = 0;
    let switchFlash = 0;

    // Instead of free-running asynchronously, we strictly sync our attention shifts 
    // to the master glitch bus orchestration!
    const unbus = strikeBus.on(() => {
      let next;
      do { next = Math.floor(Math.random() * nodesData.length); } while (next === activeSphere);
      activeSphere = next;
      switchFlash = 1.0;
    });

    const FOCAL_LENGTH = 350 * SCALE;
    function project3D(x, y, z) {
      // Scale coordinates by devicePixelRatio intrinsically!
      const px = x * SCALE;
      const py = y * SCALE;
      const pz = z * SCALE;
      const scale = FOCAL_LENGTH / Math.max(1, FOCAL_LENGTH + pz);
      return { x: CX() + px * scale, y: CY() + py * scale, scale, z: pz };
    }

    const plasmaBolts = [];
    const MAX_BOLTS = 8;

    function generateFilamentBranch(radius, startX, startY, startZ, startT, steps) {
      const pts = [];
      const tgtTheta = Math.random() * Math.PI * 2;
      const tgtPhi = Math.acos(2 * Math.random() - 1);
      const tgtX = radius * Math.sin(tgtPhi) * Math.cos(tgtTheta);
      const tgtY = radius * Math.sin(tgtPhi) * Math.sin(tgtTheta);
      const tgtZ = radius * Math.cos(tgtPhi);

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const globalT = startT + t * (1 - startT);
        const bx = startX + (tgtX - startX) * t;
        const by = startY + (tgtY - startY) * t;
        const bz = startZ + (tgtZ - startZ) * t;
        const noise = Math.sin(globalT * Math.PI) * radius * 0.35;
        pts.push({
          x: bx + (Math.random() - 0.5) * noise,
          y: by + (Math.random() - 0.5) * noise,
          z: bz + (Math.random() - 0.5) * noise
        });
      }
      return pts;
    }

    function spawnPlasmaBolt(sphereIdx) {
      const node = nodes3D[sphereIdx];
      const r = node.currentR * SCALE;
      const mainPts = generateFilamentBranch(r, 0, 0, 0, 0, 10 + Math.floor(Math.random() * 5));

      const forks = [];
      const numForks = Math.floor(Math.random() * 2);
      for (let f = 0; f < numForks; f++) {
        const splitIdx = 3 + Math.floor(Math.random() * (mainPts.length - 5));
        const splitPt = mainPts[splitIdx];
        forks.push(generateFilamentBranch(r, splitPt.x, splitPt.y, splitPt.z, splitIdx / 15, 4 + Math.floor(Math.random() * 3)));
      }

      plasmaBolts.push({
        sphere: sphereIdx,
        pts: mainPts,
        forks,
        maxLife: 0.12 + Math.random() * 0.15, // fast snap
        born: performance.now(),
        flickerOffset: Math.random() * 100
      });
    }

    function drawPlasmaBolt(bolt, time) {
      if (bolt.sphere !== activeSphere) return;
      const node = nodes3D[bolt.sphere];
      const age = (time - bolt.born) / 1000;
      const life = Math.max(0, 1 - age / bolt.maxLife);
      if (life <= 0) return;

      const flicker = Math.sin(time * 0.015 + bolt.flickerOffset) * 0.15 + 0.85;
      const a = life * flicker;
      const rgb = hexToRgb(node.color);

      function renderPath(pts, isMain) {
        // Unscale coordinates back before projecting, since project3D inherently handles SCALE mappings.
        // Wait, the radius passed to generateFilamentBranch already included SCALE.
        // We need to pass raw scaled offsets into project3D.
        const proj = pts.map(pt => project3D(node.x + pt.x / SCALE, node.y + pt.y / SCALE, node.z + pt.z / SCALE));

        // Outer glow
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        for (let i = 1; i < proj.length; i++) ctx.lineTo(proj[i].x, proj[i].y);
        ctx.strokeStyle = `rgba(${rgb.str}, ${0.12 * a})`;
        ctx.lineWidth = 8 * proj[0].scale * SCALE;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12 * SCALE;
        ctx.stroke();

        // Mid layer
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        for (let i = 1; i < proj.length; i++) ctx.lineTo(proj[i].x, proj[i].y);
        ctx.strokeStyle = `rgba(180, 220, 255, ${0.4 * a})`;
        ctx.lineWidth = 2.5 * proj[0].scale * SCALE;
        ctx.shadowBlur = 4 * SCALE;
        ctx.stroke();

        // Bright Core hairline
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        for (let i = 1; i < proj.length; i++) ctx.lineTo(proj[i].x, proj[i].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * a})`;
        ctx.lineWidth = 1 * proj[0].scale * SCALE;
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Impact blob on globe surface (lightning attachment point)
        const MathPI2 = Math.PI * 2;
        const endPt = proj[proj.length - 1];
        const tipR = (isMain ? 3 : 1.5) * endPt.scale * SCALE;
        const g = ctx.createRadialGradient(endPt.x, endPt.y, 0, endPt.x, endPt.y, tipR * 2.5);
        // Using node color instead of pure white to avoid looking like a solid dot
        g.addColorStop(0, `rgba(${rgb.str}, ${0.8 * a})`);
        g.addColorStop(0.5, `rgba(${rgb.str}, ${0.4 * a})`);
        g.addColorStop(1, `rgba(${rgb.str}, 0)`);
        ctx.beginPath();
        ctx.arc(endPt.x, endPt.y, tipR * 2.5, 0, MathPI2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      renderPath(bolt.pts, true);
      bolt.forks.forEach(fork => renderPath(fork, false));
      ctx.shadowBlur = 0;
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let raf;
    function loop(time) {
      if (!isVisible) {
        // Skip all math/rendering while scrolled away to save CPU
        raf = requestAnimationFrame(loop);
        return;
      }

      // Instead of clearRect, we draw a semi-transparent dark plate to create motion blur on links
      // Theming: oklch(0.12 0.008 250) is ~ rgb(26, 28, 33)
      ctx.fillStyle = "rgba(10, 11, 14, 0.45)";
      ctx.fillRect(0, 0, W(), H());

      if (switchFlash > 0) switchFlash *= 0.90;

      // 1. Compute Eased Positions
      nodes3D.forEach((n, i) => {
        const isActive = (i === activeSphere);
        const targetX = isActive ? 0 : n.baseX;
        const targetY = isActive ? 0 : n.baseY;
        const targetZ = isActive ? -20 : (n.isDust ? n.baseZ : n.baseZ + 80);
        const targetR = isActive ? n.r * 1.25 : n.r * 0.6; // Don't let active sphere get overwhelmingly huge

        const speed = isActive ? 0.22 : 0.04;
        n.x += (targetX - n.x) * speed;
        n.y += (targetY - n.y) * speed;
        n.z += (targetZ - n.z) * speed;
        n.currentR += (targetR - n.currentR) * 0.08;
      });

      // 2. Draw Neural Interconnections (Only connect the 6 main nodes!)
      for (let i = 0; i < nodesData.length; i++) {
        for (let j = i + 1; j < nodesData.length; j++) {
          const p1 = project3D(nodes3D[i].x, nodes3D[i].y, nodes3D[i].z);
          const p2 = project3D(nodes3D[j].x, nodes3D[j].y, nodes3D[j].z);
          const midX = (p1.x + p2.x) / 2 + (i - j) * 20 * p1.scale * SCALE;
          const midY = (p1.y + p2.y) / 2 - 40 * p1.scale * SCALE;
          const isActiveLink = (i === activeSphere || j === activeSphere);

          ctx.lineWidth = (isActiveLink ? 1.5 : 1) * SCALE;
          ctx.strokeStyle = isActiveLink ? "rgba(120, 160, 255, 0.15)" : "rgba(80, 90, 110, 0.05)";
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
          ctx.stroke();

          // Data Pulses
          const progress = (time * 0.0004 + i * 0.2 + j * 0.5) % 1;
          const pulseX = Math.pow(1 - progress, 2) * p1.x + 2 * (1 - progress) * progress * midX + Math.pow(progress, 2) * p2.x;
          const pulseY = Math.pow(1 - progress, 2) * p1.y + 2 * (1 - progress) * progress * midY + Math.pow(progress, 2) * p2.y;
          const pulseSize = (isActiveLink ? 2 : 0.8) * p1.scale * SCALE;
          ctx.fillStyle = isActiveLink ? "rgba(120, 200, 255, 0.6)" : "rgba(80, 80, 120, 0.2)";
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, Math.max(0.4, pulseSize), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw Nodes Painter's Algorithm (Back to Front)
      const sortedNodes = nodes3D.map((n, i) => ({ ...n, i })).sort((a, b) => b.z - a.z);

      sortedNodes.forEach(node => {
        const isActive = (node.i === activeSphere);
        const p = project3D(node.x, node.y, node.z);
        const radius = Math.max(1, node.currentR * p.scale * SCALE);

        let drawRadius = radius;
        if (isActive && switchFlash > 0.01) {
          drawRadius = radius * (1 + switchFlash * 0.12);
        }

        if (node.isDust) {
          // Render as bright distant stars catching the viewport light
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 210, 255, ${0.1 + p.scale * 1.8})`;
          ctx.shadowBlur = 6 * p.scale * SCALE;
          ctx.shadowColor = "rgba(160, 210, 255, 0.5)";
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (!isActive) {
          // Dull background node hit by strong viewport flashlight
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawRadius);
          grad.addColorStop(0, "rgba(140, 160, 200, 0.95)"); // Intense front catch-light
          grad.addColorStop(0.5, "rgba(40, 50, 80, 0.95)");
          grad.addColorStop(1, "rgba(5, 10, 20, 1)"); // Deep falloff shadow on edges
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.15)";
          ctx.lineWidth = 1 * SCALE;
          ctx.stroke();
        } else {
          // Glowing active glass globe hit by strong viewport flashlight
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawRadius);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.35)"); // Intense Front bounce reflection
          grad.addColorStop(0.25, `rgba(${hexToRgb(node.color).str}, 0.5)`);
          grad.addColorStop(0.7, "rgba(20, 20, 30, 0.7)");
          grad.addColorStop(1, "rgba(10, 10, 25, 0.3)");
          ctx.fillStyle = grad;
          ctx.fill();

          // Activity Rim Glow
          const activeCount = plasmaBolts.filter(b => b.sphere === activeSphere).length;
          const pulse = (activeCount / MAX_BOLTS) * 0.2 + 0.15 + switchFlash * 0.4;
          ctx.strokeStyle = `rgba(160, 210, 255, ${Math.min(0.8, pulse)})`;
          ctx.lineWidth = (1.5 + switchFlash * 1.5) * SCALE;
          ctx.stroke();

          // Central Neural Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6 * p.scale * SCALE, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = (8 + switchFlash * 25) * SCALE;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw Labels
        if (!node.isDust) {
          const labelAlpha = isActive ? 1 : Math.min(1, Math.max(0.1, p.scale * 1.5));
          ctx.fillStyle = isActive ? cssFg : `rgba(120, 130, 150, ${labelAlpha})`;
          ctx.font = `${isActive ? 'bold ' : ''}${Math.max(10, 12 * p.scale * SCALE)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.fillText(node.name, p.x, p.y - drawRadius - (14 * p.scale * SCALE));
        }
      });

      // 4. White Flash across whole layer when attention brutally shifts
      if (switchFlash > 0.01) {
        const flashGrad = ctx.createRadialGradient(CX(), CY(), 0, CX(), CY(), Math.max(W(), H()) * 0.7);
        flashGrad.addColorStop(0, `rgba(200, 230, 255, ${switchFlash * 0.08})`);
        flashGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, W(), H());
      }

      // 5. Cleanup Dead Plasma and Spawn New
      for (let i = plasmaBolts.length - 1; i >= 0; i--) {
        if ((time - plasmaBolts[i].born) / 1000 > plasmaBolts[i].maxLife) {
          plasmaBolts.splice(i, 1);
        }
      }

      const activeCount = plasmaBolts.filter(b => b.sphere === activeSphere).length;
      if (!isMobileRef.current && activeCount < MAX_BOLTS && Math.random() < 0.015) { // Ultra-low deliberate strikes
        spawnPlasmaBolt(activeSphere);
      }

      plasmaBolts.forEach(b => drawPlasmaBolt(b, time));

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    const onResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * SCALE;
      // height is fixed in CSS
    };
    window.addEventListener('resize', onResize);

    return () => {
      unbus();
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ margin: '32px 0 24px 0', width: '100%', maxWidth: 640 }}>
      {/* Background trick to blend over perfectly */}
      <div className="shadow-box border border-border-strong rounded-lg overflow-hidden bg-[oklch(0.12_0.008_250)]">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: 280, display: 'block', touchAction: 'none' }}
          role="img"
          aria-label="3D rendering of interconnected computational nodes simulating an erratic, distributed attention span"
        />
      </div>
      <div className="font-mono flex justify-between" style={{ fontSize: 11, color: 'var(--fg-4)', marginTop: 8, letterSpacing: '.04em' }}>
        <span>attention: erratic...</span>
        <span style={{ opacity: .5 }}>· autonomous drift</span>
      </div>
    </div>
  );
}

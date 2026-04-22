import { useEffect, useRef, useState } from 'react';

// The little "attention" bug wanders between interest "planets".
// Drag it to fling it around — it latches to whichever it's nearest to.
// Show, don't tell, the ADHD-curious pattern.
export default function InterestOrbit() {
  const svgRef = useRef(null);
  const [caption, setCaption] = useState('attention: drifting…');
  const W = 620, H = 240;

  useEffect(() => {
    const svg = svgRef.current; if (!svg) return;

    const labels = ['OS', 'RISC-V', 'FPGAs', 'agents', 'PCBs', 'compilers', 'formal', 'GPUs'];
    const planets = labels.map((name, i) => {
      const x = 60 + (i * (W - 120) / (labels.length - 1));
      const y = 60 + ((i % 2 === 0) ? 0 : 120) + (Math.random() - 0.5) * 20;
      return { name, x, y, r: 22 };
    });

    const NS = 'http://www.w3.org/2000/svg';
    planets.forEach((p, i) => {
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', p.x); halo.setAttribute('cy', p.y); halo.setAttribute('r', p.r + 8);
      halo.setAttribute('fill', 'var(--accent)'); halo.setAttribute('opacity', 0); halo.setAttribute('data-halo', i);
      svg.appendChild(halo);
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', p.r);
      c.setAttribute('fill', 'var(--bg-1)'); c.setAttribute('stroke', 'var(--border-strong)'); c.setAttribute('stroke-width', 1.2);
      c.setAttribute('data-ring', i);
      svg.appendChild(c);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', p.x); t.setAttribute('y', p.y + 3); t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', 'var(--fg-2)'); t.setAttribute('font-size', '9');
      t.setAttribute('font-family', 'JetBrains Mono, monospace');
      t.setAttribute('pointer-events', 'none'); t.textContent = p.name;
      svg.appendChild(t);
    });

    const tether = document.createElementNS(NS, 'line');
    tether.setAttribute('stroke', 'var(--accent)'); tether.setAttribute('stroke-width', 1);
    tether.setAttribute('stroke-dasharray', '2 4'); tether.setAttribute('opacity', 0.5);
    svg.appendChild(tether);

    const bug = document.createElementNS(NS, 'g');
    bug.style.cursor = 'grab';
    const bugCore = document.createElementNS(NS, 'circle');
    bugCore.setAttribute('r', 6); bugCore.setAttribute('fill', 'var(--accent)');
    bugCore.setAttribute('stroke', '#000'); bugCore.setAttribute('stroke-width', 1);
    const bugGlow = document.createElementNS(NS, 'circle');
    bugGlow.setAttribute('r', 14); bugGlow.setAttribute('fill', 'var(--accent)'); bugGlow.setAttribute('opacity', 0.22);
    bug.appendChild(bugGlow); bug.appendChild(bugCore);
    svg.appendChild(bug);

    let x = planets[0].x, y = planets[0].y - 60;
    let vx = 1.4, vy = 0.2;
    let dragging = false;
    let mx = x, my = y;
    let currentIdx = -1;

    const toLocal = (evt) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      const lp = pt.matrixTransform(svg.getScreenCTM().inverse());
      return [lp.x, lp.y];
    };

    const onDown = e => { dragging = true; bug.style.cursor = 'grabbing'; [mx, my] = toLocal(e.touches ? e.touches[0] : e); e.preventDefault(); };
    const onMove = e => { if (!dragging) return; [mx, my] = toLocal(e.touches ? e.touches[0] : e); };
    const onUp = () => { dragging = false; bug.style.cursor = 'grab'; };

    bug.addEventListener('mousedown', onDown);
    bug.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    let raf;
    const tick = () => {
      if (dragging) {
        vx += (mx - x) * 0.25;
        vy += (my - y) * 0.25;
        vx *= 0.5; vy *= 0.5;
      } else {
        let best = 0, bestD = Infinity;
        planets.forEach((p, i) => {
          const d = (p.x - x) ** 2 + (p.y - y) ** 2;
          if (d < bestD) { bestD = d; best = i; }
        });
        const target = planets[best];
        const dx = target.x - x, dy = (target.y - 40) - y;
        vx += dx * 0.002;
        vy += dy * 0.002;
        vx += Math.cos(performance.now() * 0.001 + best) * 0.05;
        vy += Math.sin(performance.now() * 0.0013 + best) * 0.05;
        vx *= 0.96; vy *= 0.96;

        if (best !== currentIdx) {
          currentIdx = best;
          setCaption('attention: ' + target.name);
          const halo = svg.querySelector(`[data-halo="${best}"]`);
          if (halo) {
            halo.setAttribute('opacity', 0.35);
            setTimeout(() => halo && halo.setAttribute('opacity', 0.12), 400);
          }
          planets.forEach((_, i) => {
            const r = svg.querySelector(`[data-ring="${i}"]`);
            if (r) r.setAttribute('stroke', i === best ? 'var(--accent)' : 'var(--border-strong)');
          });
        }
      }

      x += vx; y += vy;
      if (x < 10) { x = 10; vx = Math.abs(vx) * 0.7; }
      if (x > W - 10) { x = W - 10; vx = -Math.abs(vx) * 0.7; }
      if (y < 10) { y = 10; vy = Math.abs(vy) * 0.7; }
      if (y > H - 10) { y = H - 10; vy = -Math.abs(vy) * 0.7; }

      bug.setAttribute('transform', `translate(${x},${y})`);
      if (currentIdx >= 0) {
        const p = planets[currentIdx];
        tether.setAttribute('x1', x); tether.setAttribute('y1', y);
        tether.setAttribute('x2', p.x); tether.setAttribute('y2', p.y);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      bug.removeEventListener('mousedown', onDown);
      bug.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      svg.innerHTML = '';
    };
  }, []);

  return (
    <div style={{ marginTop: 22, marginBottom: 6 }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', maxWidth: 640, display: 'block', userSelect: 'none', touchAction: 'none' }} />
      <div className="mono" style={{ fontSize: 11, color: 'var(--fg-4)', marginTop: 6, letterSpacing: '.04em' }}>
        {caption} <span style={{ opacity: .5 }}>· drag the dot ↗</span>
      </div>
    </div>
  );
}

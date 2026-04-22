import { useEffect, useState, useRef, useMemo } from 'react';

const CATEGORIES = [
  {
    id: "langs",
    code: "§ languages",
    title: "Languages",
    blurb: "What I actually write.",
    accent: 130,
    items: [
      { name: "C", detail: "My current obsession. Where I'm trying to get really good." },
      { name: "Rust", detail: "For when safety matters and I want to feel smart about it" },
      { name: "Python", detail: "Daily driver for most everyday things" },
      { name: "TypeScript", detail: "Web + mobile work, React-adjacent" },
      { name: "JavaScript", detail: "Comes with the TS territory" },
      { name: "C++", detail: "Used it for coursework and graphics stuff" },
      { name: "Java", detail: "I know it exists and I can use it" },
      { name: "Zig", detail: "Currently learning. Feels right." },
    ],
  },
  {
    id: "frame",
    code: "§ frameworks",
    title: "Frameworks & Tools",
    blurb: "The toolbox.",
    accent: 210,
    items: [
      { name: "React", detail: "Most of my web work lives here" },
      { name: "React Native", detail: "Mobile when I need to go cross-platform" },
      { name: "Tailwind", detail: "I gave up writing CSS from scratch, it's fine" },
      { name: "Vite", detail: "Fast build tool, love it" },
      { name: "Framer Motion", detail: "Animations on my old portfolio were all this" },
      { name: "PostgreSQL", detail: "My preferred boring database" },
      { name: "Node.js", detail: "When the backend needs to be JS-shaped" },
    ],
  },
  {
    id: "dev",
    code: "§ dev-env",
    title: "Dev Environment",
    blurb: "Where I spend my days.",
    accent: 30,
    items: [
      { name: "Neovim", detail: "My coding sanctuary. Obviously." },
      { name: "Linux", detail: "Arch, btw" },
      { name: "Git", detail: "Rebase and force-push-with-lease camp" },
      { name: "Docker", detail: "For when reproducibility matters" },
      { name: "Bash", detail: "Writing small shell scripts is a joy" },
      { name: "Tmux", detail: "Terminal multiplexer, can't live without it" },
      { name: "GH Actions", detail: "CI/CD for pretty much all my projects" },
    ],
  },
  {
    id: "interests",
    code: "§ interests",
    title: "What I'm Into Right Now",
    blurb: "The stuff I actually get excited about.",
    accent: 290,
    items: [
      { name: "Low-level", detail: "Current focus. Everything fun happens close to the metal." },
      { name: "FPGAs", detail: "Building a CPU on an Altera FPGA — open source when it runs" },
      { name: "Hardware", detail: "Custom watch project in the backlog — PCB, firmware, enclosure" },
      { name: "Compilers", detail: "LLVM coursework got me hooked on the idea of language design" },
      { name: "Operating Sys", detail: "Would love to poke at a hobby kernel one day" },
      { name: "Debugging", detail: "The most underrated skill. I enjoy it more than I should." },
    ],
  },
];

function useRevealSkills() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Constellation({ category, selected, setSelected }) {
  const { items, accent } = category;
  const W = 480, H = 420;
  const cx = W / 2, cy = H / 2;
  const bigR = 54;
  const svgRef = useRef(null);

  const nodes = useMemo(() => {
    const n = items.length;
    const baseR = 155;
    return items.map((it, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = baseR + (i % 2 === 0 ? 0 : 22);
      const bx = cx + Math.cos(angle) * r;
      const by = cy + Math.sin(angle) * r;
      return { ...it, i, bx, by, angle, r, phase: i * 0.9 };
    });
  }, [category.id]);

  // Animate wobble via direct DOM manipulation — zero React re-renders
  useEffect(() => {
    let raf;
    const start = performance.now();
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      const svg = svgRef.current;
      if (!svg) { raf = requestAnimationFrame(loop); return; }

      nodes.forEach(n => {
        const wx = Math.cos(n.phase + t * 0.7) * 5;
        const wy = Math.sin(n.phase + t * 0.7) * 5;
        const x = n.bx + wx, y = n.by + wy;

        // Update line endpoint
        const line = svg.querySelector(`[data-line="${n.i}"]`);
        if (line) { line.setAttribute('x2', x); line.setAttribute('y2', y); }

        // Update node group position
        const group = svg.querySelector(`[data-node="${n.i}"]`);
        if (group) group.setAttribute('transform', `translate(${wx},${wy})`);
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [nodes]);

  const accentColor = `oklch(0.78 0.16 ${accent})`;
  const accentSoft = `oklch(0.78 0.16 ${accent} / 0.2)`;

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', maxHeight: 440 }}>
      <defs>
        <radialGradient id={`glow-${category.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={190} fill={`url(#glow-${category.id})`} />
      <circle cx={cx} cy={cy} r={170} fill="none" stroke="var(--border)" strokeDasharray="2 6" strokeWidth="1" />

      {nodes.map(n => {
        const lx = cx + Math.cos(n.angle) * bigR;
        const ly = cy + Math.sin(n.angle) * bigR;
        return (
          <line
            key={`l-${n.i}`}
            data-line={n.i}
            x1={lx} y1={ly} x2={n.bx} y2={n.by}
            stroke={selected === n.i ? accentColor : "var(--border-strong)"}
            strokeWidth={selected === n.i ? 1.4 : 0.8}
            opacity={selected === n.i ? 1 : 0.5}
          />
        );
      })}

      <circle cx={cx} cy={cy} r={bigR} fill="var(--bg-2)" stroke={accentColor} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={bigR - 6} fill="none" stroke={accentSoft} strokeWidth="1" />
      <text x={cx} y={cy - 4} textAnchor="middle"
        fill="var(--fg)" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600">
        {category.title.split(' ')[0].toUpperCase()}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle"
        fill="var(--fg-3)" fontSize="9" fontFamily="JetBrains Mono, monospace">
        {items.length} items
      </text>

      {nodes.map(n => {
        const isSel = selected === n.i;
        const r = isSel ? 32 : 28;
        return (
          <g key={n.i}
            data-node={n.i}
            onMouseEnter={() => setSelected(n.i)}
            onClick={() => setSelected(n.i)}
            style={{ cursor: 'pointer' }}>
            <circle cx={n.bx} cy={n.by} r={r + 4} fill={accentColor} opacity={isSel ? 0.15 : 0} />
            <circle cx={n.bx} cy={n.by} r={r}
              fill={isSel ? accentColor : "var(--bg-1)"}
              stroke={isSel ? accentColor : "var(--border-strong)"}
              strokeWidth="1.2" />
            <text x={n.bx} y={n.by + 3} textAnchor="middle"
              fill={isSel ? "oklch(0.14 0.01 250)" : "var(--fg-2)"}
              fontSize={n.name.length > 10 ? "9" : "10"}
              fontFamily="JetBrains Mono, monospace"
              fontWeight={isSel ? "600" : "400"}
              style={{ pointerEvents: 'none' }}>
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const LANGS = [
  { name: "Python", pct: 28, hue: 130 },
  { name: "TypeScript", pct: 21, hue: 210 },
  { name: "Rust", pct: 16, hue: 30 },
  { name: "C", pct: 13, hue: 260 },
  { name: "C++", pct: 8, hue: 280 },
  { name: "JavaScript", pct: 7, hue: 60 },
  { name: "CUDA", pct: 4, hue: 150 },
  { name: "Shell", pct: 3, hue: 180 },
];

function LangStats() {
  // `running` starts false; flip to true after a short delay so bars
  // animate from 0 → target every time the tab is clicked.
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRunning(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="lang-panel" style={{ padding: 20 }}>
      <div className="lang-panel-head">
        <h3>$ gh lang-stats --user qvd808</h3>
        <span className="meta">from public repos · 2026-04-21</span>
      </div>
      {LANGS.map((l, i) => (
        <div className="lang-row" key={l.name}>
          <span className="lang-name">{l.name}</span>
          <div className="lang-bar">
            <div className="lang-bar-fill" style={{
              width: running ? `${l.pct * 3}%` : '0%',
              background: `oklch(0.75 0.15 ${l.hue})`,
              transitionDelay: `${i * 70}ms`,
            }} />
          </div>
          <span className="lang-pct">{l.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  const [ref, visible] = useRevealSkills();
  const [catIdx, setCatIdx] = useState(0);
  const [sel, setSel] = useState(0);
  const [view, setView] = useState('explore');
  const [statsKey, setStatsKey] = useState(0);

  const cat = CATEGORIES[catIdx];
  const selectedItem = cat.items[sel] || cat.items[0];

  useEffect(() => { setSel(0); }, [catIdx]);

  const handleViewSwitch = (next) => {
    if (next === 'stats') setStatsKey(k => k + 1); // remount → bars reset to 0 and run
    setView(next);
  };

  return (
    <section className="section" id="skills" ref={ref}>
      <div className="section-label">§ capabilities</div>
      <h2 className="section-title">
        Pick a category. <em className="serif">Hover the nodes — I wrote one honest sentence about each one.</em>
      </h2>
      <p className="section-sub">
        Click a node to lock it. Switch to gh stats to see my actual language breakdown.
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div className="seg" style={{ display: 'inline-flex', width: 'auto' }}>
          <button className={view === 'explore' ? 'active' : ''} onClick={() => handleViewSwitch('explore')}
            style={{ padding: '8px 14px' }}>◐ explore</button>
          <button className={view === 'stats' ? 'active' : ''} onClick={() => handleViewSwitch('stats')}
            style={{ padding: '8px 14px' }}>▁▃▅ gh stats</button>
        </div>
      </div>

      {view === 'explore' ? (
        <div className="skills-explorer">
          <div className="cat-list">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.id}
                className={`cat-card ${catIdx === i ? 'active' : ''}`}
                onClick={() => setCatIdx(i)}
                style={{ '--cat-hue': c.accent }}
              >
                <div className="cat-code">{c.code}</div>
                <div className="cat-title">{c.title}</div>
                <div className="cat-count">{c.items.length} items</div>
                <div className="cat-arrow">{catIdx === i ? '▶' : ' '}</div>
              </button>
            ))}
          </div>

          <div className="cat-stage">
            <div className="cat-stage-head">
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-4)', letterSpacing: '0.05em' }}>
                  {cat.code.replace('§ ', '').toUpperCase()}
                </div>
                <div style={{ fontSize: 18, fontWeight: 500, marginTop: 2 }}>{cat.title}</div>
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--fg-4)' }}>
                hover · click to pin
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <Constellation category={cat} selected={sel} setSelected={setSel} />
            </div>

            <div className="cat-detail">
              <div className="cat-detail-name mono">
                <span style={{ color: `oklch(0.78 0.16 ${cat.accent})` }}>●</span> {selectedItem.name}
              </div>
              <div className="cat-detail-blurb">{selectedItem.detail}</div>
            </div>
          </div>
        </div>
      ) : (
        <LangStats key={statsKey} />
      )}
    </section>
  );
}
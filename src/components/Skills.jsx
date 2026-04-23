import { useEffect, useState, useRef, useMemo } from 'react';
import LangStats from './LangStats';

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
    if (next === 'stats') setStatsKey(k => k + 1);
    setView(next);
  };

  return (
    <section className="max-w-page mx-auto px-5 py-[calc(80px*var(--density))] [contain:layout_style]" id="skills" ref={ref}>
      <div className="section-label font-mono text-xs text-fg-4 tracking-[0.04em] uppercase flex items-center gap-2.5 mb-6">§ capabilities</div>
      <h2 className="section-title font-medium tracking-[-0.025em] leading-[1.1] max-w-[760px] mb-3">
        Pick a category. <em className="font-serif italic tracking-[-0.01em]">Hover the nodes — I wrote one honest sentence about each one.</em>
      </h2>
      <p className="text-lg text-fg-3 max-w-[640px] mb-12" style={{ textWrap: 'pretty' }}>
        Click a node to lock it. Switch to gh stats to see my actual language breakdown.
      </p>

      <div className="flex gap-2.5 mb-5 items-center">
        <div className="inline-flex bg-bg-2 border border-border rounded overflow-hidden">
          <button
            className={`flex-1 bg-transparent border-none px-3.5 py-2 font-inherit text-2xs cursor-pointer uppercase tracking-[0.04em] transition-[background,color] duration-150 ${view === 'explore' ? 'bg-accent text-[oklch(0.12_0.01_250)] font-semibold' : 'text-fg-3 hover:text-fg'}`}
            onClick={() => handleViewSwitch('explore')}
          >◐ explore</button>
          <button
            className={`flex-1 bg-transparent border-none px-3.5 py-2 font-inherit text-2xs cursor-pointer uppercase tracking-[0.04em] transition-[background,color] duration-150 ${view === 'stats' ? 'bg-accent text-[oklch(0.12_0.01_250)] font-semibold' : 'text-fg-3 hover:text-fg'}`}
            onClick={() => handleViewSwitch('stats')}
          >▁▃▅ gh stats</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 lg:items-start">
        {view === 'explore' ? (
          <>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c.id}
                  className={`shadow-box text-left bg-bg-1 border border-border border-l-[3px] rounded-md px-4 py-3.5 cursor-pointer transition-[background,border-color] duration-200 font-inherit text-inherit grid grid-cols-[1fr_auto] gap-1 items-center ${catIdx === i ? 'bg-bg-2 border-border-strong' : 'hover:bg-bg-2 hover:border-border-strong'}`}
                  onClick={() => setCatIdx(i)}
                  style={{
                    '--cat-hue': c.accent,
                    borderLeftColor: catIdx === i ? `oklch(0.78 0.16 ${c.accent})` : undefined,
                  }}
                >
                  <div className="font-mono text-2xs text-fg-4 tracking-[0.05em] col-start-1 row-start-1">{c.code}</div>
                  <div className={`text-lg font-medium col-start-1 row-start-2 tracking-[-0.01em] ${catIdx === i ? '' : 'text-fg'}`}
                    style={catIdx === i ? { color: `oklch(0.78 0.16 ${c.accent})` } : undefined}
                  >{c.title}</div>
                  <div className="col-start-2 row-start-1 row-end-4 text-sm self-center"
                    style={{ color: `oklch(0.78 0.16 ${c.accent})` }}
                  >{catIdx === i ? '▶' : ' '}</div>
                </button>
              ))}
            </div>

            <div className="shadow-box bg-bg-1 border border-border rounded-lg p-5 flex flex-col gap-3">
              <div className="flex justify-between items-end pb-3 border-b border-dashed border-border">
                <div>
                  <div className="font-mono text-2xs text-fg-4 tracking-[0.05em]">
                    {cat.code.replace('§ ', '').toUpperCase()}
                  </div>
                  <div className="text-[18px] font-medium mt-0.5">{cat.title}</div>
                </div>
                <div className="font-mono text-2xs text-fg-4">
                  hover · click to pin
                </div>
              </div>

              <div className="relative">
                <Constellation category={cat} selected={sel} setSelected={setSel} />
              </div>

              <div className="p-3.5 px-4 bg-bg-2 border border-border rounded-md min-h-[66px]">
                <div className="text-base font-medium text-fg mb-1 flex items-center gap-2 font-mono">
                  <span style={{ color: `oklch(0.78 0.16 ${cat.accent})` }}>●</span> {selectedItem.name}
                </div>
                <div className="text-base text-fg-2 leading-normal">{selectedItem.detail}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="text-left bg-bg-2 border border-border border-l-[3px] rounded-md px-4 py-3.5 font-inherit text-inherit grid grid-cols-[1fr_auto] gap-1 items-center cursor-default" style={{ borderLeftColor: 'oklch(0.78 0.16 200)' }}>
                <div className="font-mono text-2xs text-fg-4 tracking-[0.05em]">§ telemetry</div>
                <div className="text-lg font-medium tracking-[-0.01em]" style={{ color: 'oklch(0.78 0.16 200)' }}>Language Activity</div>
              </div>
              <p className="text-xs text-fg-4 p-3 leading-[1.6] font-mono">
                // live feed from github.com<br />
                // recency-weighted<br />
                // updated daily
              </p>
              <div className="px-3 text-2xs text-fg-4 opacity-60">
                Newer commits weigh more heavily on the results than legacy code.
              </div>
            </div>
            <div className="shadow-box bg-bg-1 border border-border rounded-lg p-0">
              <LangStats key={statsKey} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

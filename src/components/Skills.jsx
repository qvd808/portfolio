import { useEffect, useRef, useState } from 'react';
import { DEPTH } from '../data';

const W = 480, H = 400, CX = W / 2, CY = H / 2, HUB = 52, BASE = 148;

// Nodes drift on a slow sine so the constellation never sits perfectly still.
function useWobbleClock() {
  const [t, setT] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const id = setInterval(() => setT(performance.now() / 1000), 60);
    return () => { clearInterval(id); cancelAnimationFrame(raf.current); };
  }, []);
  return t;
}

function Constellation({ cat, sel, onSelect, t }) {
  const AC = 'var(--color-accent)';
  const nodes = cat.items.map((it, i) => {
    const a = (i / cat.items.length) * Math.PI * 2 - Math.PI / 2;
    const r = BASE + (i % 2 === 0 ? 0 : 20);
    const ph = i * 0.9;
    return {
      ...it, i, a,
      bx: CX + Math.cos(a) * r,
      by: CY + Math.sin(a) * r,
      wx: Math.cos(ph + t * 0.55) * 4.5,
      wy: Math.sin(ph + t * 0.55) * 4.5,
    };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', maxHeight: 420 }}>
      <defs>
        <radialGradient id={`ncg-${cat.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9184d9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#9184d9" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={182} fill={`url(#ncg-${cat.id})`} />
      <circle cx={CX} cy={CY} r={162} fill="none" stroke="var(--color-neutral-800)" strokeDasharray="2 7" strokeWidth="1" />

      {nodes.map(n => (
        <line
          key={`l${n.i}`}
          x1={CX + Math.cos(n.a) * HUB} y1={CY + Math.sin(n.a) * HUB}
          x2={n.bx + n.wx} y2={n.by + n.wy}
          stroke={sel === n.i ? AC : 'var(--color-neutral-800)'}
          strokeWidth={sel === n.i ? 1.3 : 0.8}
          opacity={sel === n.i ? 1 : 0.75}
        />
      ))}

      <circle cx={CX} cy={CY} r={HUB} fill="var(--color-surface)" stroke={AC} strokeWidth="1.2" />
      <circle cx={CX} cy={CY} r={HUB - 6} fill="none" stroke="var(--color-accent-800)" strokeWidth="1" />
      <text x={CX} y={CY + 4} textAnchor="middle" fill="var(--color-text)" fontSize="10" letterSpacing="0.08em" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {cat.code.replace('§ ', '').toUpperCase()}
      </text>

      {nodes.map(n => {
        const on = sel === n.i;
        const rr = on ? 33 : 29;
        return (
          <g
            key={`n${n.i}`}
            transform={`translate(${n.wx},${n.wy})`}
            onMouseEnter={() => onSelect(n.i)}
            onClick={() => onSelect(n.i)}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={n.bx} cy={n.by} r={rr + 5} fill="#9184d9" opacity={on ? 0.16 : 0} />
            <circle
              cx={n.bx} cy={n.by} r={rr}
              fill={on ? AC : 'var(--color-surface)'}
              stroke={on ? AC : (n.deep ? 'var(--color-accent-600)' : 'var(--color-neutral-800)')}
              strokeWidth={n.deep && !on ? '1.6' : '1.1'}
            />
            <text
              x={n.bx} y={n.by + 3.5} textAnchor="middle"
              fill={on ? '#161826' : 'var(--color-neutral-300)'}
              fontSize={n.name.length > 10 ? '8.5' : '9.5'}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              style={{ pointerEvents: 'none' }}
            >
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Skills() {
  const [cat, setCat] = useState(0);
  const [sel, setSel] = useState(0);
  const t = useWobbleClock();

  const active = DEPTH[cat] || DEPTH[0];
  const item = active.items[sel] || active.items[0];

  return (
    <section id="depth" style={{ maxWidth: 1120, margin: '0 auto', padding: 'calc(var(--space-8)*2) var(--space-6)' }}>
      <h6 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>Skills</h6>
      <h2 className="section-title" style={{ fontSize: 'clamp(28px,3.6vw,44px)', lineHeight: 1.1, letterSpacing: '-0.025em', maxWidth: '24ch', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
        Depth I can defend, breadth I can use.
      </h2>
      <p style={{ fontSize: 17, color: 'var(--color-neutral-400)', maxWidth: '60ch', margin: '0 0 calc(var(--space-8)*1.5)', lineHeight: 1.6, textWrap: 'pretty' }}>
        Hover a node. Each one carries one honest sentence: no self-assessed ratings, no five-star bars. The ringed nodes are the ones I'd call deep.
      </p>

      <div data-2col style={{ display: 'grid', gridTemplateColumns: 'minmax(0,272px) minmax(0,1fr)', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {DEPTH.map((c, i) => {
            const on = cat === i;
            return (
              <button
                key={c.id}
                onClick={() => { setCat(i); setSel(0); }}
                style={{
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
                  padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                  background: on ? 'var(--color-surface)' : 'transparent',
                  border: `1px solid ${on ? 'var(--color-accent)' : 'var(--color-divider)'}`,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>{c.code}</div>
                <div style={{ fontSize: 17, fontFamily: 'var(--font-heading)', fontWeight: 500, letterSpacing: '-0.015em', marginTop: 2, color: on ? 'var(--color-accent-300)' : 'var(--color-text)' }}>{c.title}</div>
              </button>
            );
          })}
        </div>

        <div style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-divider)' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>{active.code.replace('§ ', '')}</div>
              <div style={{ fontSize: 19, fontFamily: 'var(--font-heading)', fontWeight: 500, marginTop: 2 }}>{active.title}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-neutral-600)', whiteSpace: 'nowrap' }}>hover · click to pin</div>
          </div>

          <div style={{ position: 'relative', minWidth: 0 }}>
            <Constellation cat={active} sel={sel} onSelect={setSel} t={t} />
          </div>

          <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', minHeight: 76, background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 15, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span style={{ color: 'var(--color-accent)' }}>●</span>{item.name}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--color-neutral-300)', textWrap: 'pretty' }}>{item.detail}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

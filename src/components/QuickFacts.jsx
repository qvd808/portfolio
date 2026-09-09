import { FACTS, OSS } from '../data';

export default function QuickFacts() {
  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <hr className="hr" />
      <h6 style={{ color: 'var(--color-neutral-500)', margin: 'var(--space-8) 0 var(--space-6)' }}>The thirty-second version</h6>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(215px,1fr))', gap: 'var(--space-8)' }}>
        {FACTS.map(f => (
          <div key={f.big}>
            <div style={{ fontSize: 'clamp(22px,2.4vw,31px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--color-accent-300)', fontFamily: 'var(--font-heading)', fontWeight: 500, whiteSpace: 'nowrap' }}>{f.big}</div>
            <div style={{ fontSize: 14, color: 'var(--color-neutral-400)', marginTop: 'var(--space-2)', lineHeight: 1.5, textWrap: 'pretty' }}>{f.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'calc(var(--space-8)*1.6)', padding: 'var(--space-6)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 'var(--space-6)' }}>
        <div style={{ gridColumn: '1/-1', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
          My contribution in open-source projects
        </div>
        {OSS.map(o => (
          <div key={o.repo}>
            <a href={o.href} style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{o.repo} ↗</a>
            <div style={{ fontSize: 14, color: 'var(--color-neutral-400)', marginTop: 'var(--space-1)', lineHeight: 1.5, textWrap: 'pretty' }}>{o.what}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

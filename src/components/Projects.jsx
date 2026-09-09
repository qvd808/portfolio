import { CASES } from '../data';

export default function Projects() {
  return (
    <section id="work" style={{ maxWidth: 1120, margin: '0 auto', padding: 'calc(var(--space-8)*2) var(--space-6)' }}>
      <h6 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>Evidence</h6>
      <h2 className="section-title" style={{ fontSize: 'clamp(28px,3.6vw,44px)', lineHeight: 1.1, letterSpacing: '-0.025em', maxWidth: '26ch', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
        Five projects I can walk you through in detail.
      </h2>
      <p style={{ fontSize: 17, color: 'var(--color-neutral-400)', maxWidth: '62ch', margin: '0 0 calc(var(--space-8)*1.5)', lineHeight: 1.6, textWrap: 'pretty' }}>
        For each: the problem, what I actually did, and what I still can't claim.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {CASES.map(cs => (
          <div key={cs.title} className="card elev-sm project" style={{ padding: 'calc(var(--space-8)*1.1)', gap: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span className="card-kicker" style={{ fontFamily: 'var(--font-mono)' }}>{cs.repo}</span>
                <span className="tag tag-neutral" style={{ whiteSpace: 'nowrap' }}>{cs.stack}</span>
                <span className="tag tag-outline" style={{ whiteSpace: 'nowrap' }}>{cs.status}</span>
              </div>

              <h3 style={{ fontSize: 26, margin: '0 0 var(--space-3)', letterSpacing: '-0.02em', textWrap: 'pretty' }}>{cs.title}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-neutral-300)', margin: '0 0 var(--space-6)', maxWidth: '72ch', textWrap: 'pretty' }}>{cs.problem}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-2)' }}>What I did</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-neutral-300)', textWrap: 'pretty' }}>{cs.did}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-2)' }}>{cs.hardLabel}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-neutral-300)', textWrap: 'pretty' }}>{cs.hard}</div>
                </div>
              </div>

              <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}>
                <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Honest limits</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-neutral-400)', textWrap: 'pretty' }}>{cs.limits}</div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
                <a href={cs.href} className="btn btn-ghost" style={{ whiteSpace: 'nowrap' }}>{cs.linkLabel} →</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

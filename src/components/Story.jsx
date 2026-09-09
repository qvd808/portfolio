import { ACTS } from '../data';

export default function Story() {
  return (
    <section id="story" style={{ maxWidth: 1120, margin: '0 auto', padding: 'calc(var(--space-8)*2) var(--space-6)' }}>
      <h6 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>How I got here</h6>
      <h2 className="section-title" style={{ fontSize: 'clamp(28px,3.6vw,44px)', lineHeight: 1.1, letterSpacing: '-0.025em', maxWidth: '24ch', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
        From software to firmware.
      </h2>
      <p style={{ fontSize: 17, color: 'var(--color-neutral-400)', maxWidth: '64ch', margin: '0 0 calc(var(--space-8)*1.6)', lineHeight: 1.6, textWrap: 'pretty' }}>
        I studied Computer Science, but each job since has pulled me a level closer to the hardware: software and IT automation, then firmware.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--space-8)*1.4)' }}>
        {ACTS.map(act => (
          <div
            key={act.no}
            data-2col
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0,176px) minmax(0,1fr)', gap: 'calc(var(--space-8)*1.4)', alignItems: 'start', paddingLeft: 'var(--space-4)', borderLeft: '1px solid var(--color-divider)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{act.no}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 4 }}>{act.when}</div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-400)', marginTop: 'var(--space-3)', lineHeight: 1.5 }}>{act.where}</div>
            </div>

            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 24, margin: '0 0 var(--space-3)', letterSpacing: '-0.02em', textWrap: 'pretty' }}>{act.title}</h3>
              <p style={{ fontSize: 16, color: 'var(--color-neutral-300)', lineHeight: 1.6, margin: '0 0 var(--space-4)', maxWidth: '62ch', textWrap: 'pretty' }}>{act.lede}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {act.beats.map((b, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: 'var(--space-3)', alignItems: 'start' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-accent-600)', marginTop: 8 }} />
                    <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-neutral-300)', textWrap: 'pretty' }}>{b}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-divider)', fontSize: 15, color: 'var(--color-neutral-300)', maxWidth: '60ch', textWrap: 'pretty', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--color-accent-300)' }}>What it changed:</span> {act.takeaway}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

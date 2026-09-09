import { ENDPOINTS } from '../data';

export default function Contact() {
  return (
    <section id="contact" style={{ maxWidth: 1120, margin: '0 auto', padding: 'calc(var(--space-8)*2) var(--space-6) calc(var(--space-8)*2.6)' }}>
      <hr className="hr" />
      <div data-2col style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'calc(var(--space-8)*2)', alignItems: 'start', marginTop: 'calc(var(--space-8)*1.6)' }}>
        <div>
          <h6 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>Open to work</h6>
          <h2 className="contact-title" style={{ fontSize: 'clamp(28px,3.6vw,42px)', lineHeight: 1.08, letterSpacing: '-0.025em', margin: '0 0 var(--space-4)', textWrap: 'pretty' }}>
            Looking for a firmware, embedded or embedded-AI role, new-grad or junior.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--color-neutral-400)', lineHeight: 1.6, maxWidth: '48ch', margin: '0 0 var(--space-8)', textWrap: 'pretty' }}>
            Graduating April 2026 from SFU, based in Burnaby, happy to relocate. If you have a board, a datasheet and a bug nobody wants, that's the work I want. I reply within a day.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <a href="mailto:dqvinh101@gmail.com" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>dqvinh101@gmail.com</a>
            <a href="https://www.linkedin.com/in/qvd-dang/" className="btn btn-secondary" style={{ color: 'var(--color-text)', whiteSpace: 'nowrap' }}>LinkedIn</a>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-3)' }}>Links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {ENDPOINTS.map(e => (
              <a
                key={e.label}
                href={e.href}
                className="endpoint"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-neutral-300)', transition: 'border-color .15s ease, color .15s ease' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
                  <span className="tag tag-accent" style={{ flex: 'none', fontFamily: 'inherit' }}>{e.label}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.path}</span>
                </span>
                <span style={{ color: 'var(--color-neutral-600)', flex: 'none' }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

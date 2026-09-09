import { useEffect, useRef, useState } from 'react';
import { TERM } from '../data';
import HeadShot from '../assets/HeadShot.jpeg';

const TAGS = [
  'Burnaby, BC · willing to relocate',
  'B.Sc Computing Science, SFU',
  'C · C++ · Python',
  'STM32 · ESP32 · ARM Cortex-M',
  'Embedded ML · AI systems',
];

// Types a command out, holds it with its output, clears, moves to the next.
function useTerminal() {
  const [{ ti, tt, tp }, set] = useState({ ti: 0, tt: '', tp: 'typing' });
  const timer = useRef(null);

  useEffect(() => {
    const full = TERM[ti % TERM.length].cmd;
    let delay = 40;
    let next;
    if (tp === 'typing') {
      if (tt.length < full.length) next = { ti, tt: full.slice(0, tt.length + 1), tp };
      else { next = { ti, tt, tp: 'showing' }; delay = 480; }
    } else if (tp === 'showing') {
      next = { ti, tt, tp: 'clearing' }; delay = 3400;
    } else {
      next = { ti: ti + 1, tt: '', tp: 'typing' };
    }
    timer.current = setTimeout(() => set(next), delay);
    return () => clearTimeout(timer.current);
  }, [ti, tt, tp]);

  return {
    cmd: tt,
    out: tp === 'showing' || tp === 'clearing' ? TERM[ti % TERM.length].out : '',
  };
}

export default function Hero() {
  const term = useTerminal();

  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: 'calc(var(--space-8)*2.6) var(--space-6) var(--space-8)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
        <span className="tag tag-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: 'none', whiteSpace: 'nowrap' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'noct-pulse 2.4s infinite', flex: 'none' }} />
          Open to firmware &amp; AI roles
        </span>
        {TAGS.map(t => (
          <span key={t} className="tag tag-neutral" style={{ flex: 'none', whiteSpace: 'nowrap' }}>{t}</span>
        ))}
      </div>

      <div data-2col style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(0,1fr)', gap: 'calc(var(--space-8)*2)', alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <h6 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>Firmware · embedded systems · AI</h6>
          <h1 className="hero-heading" style={{ fontSize: 'clamp(36px,5vw,62px)', lineHeight: 1.04, letterSpacing: '-0.03em', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
            I write the layer that has to be right, and the tests that prove it.
          </h1>

          <p style={{ fontSize: 21, lineHeight: 1.5, color: 'var(--color-text)', maxWidth: '56ch', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
            I'm a Firmware Developer finishing a Computing Science degree at SFU in April 2026. I spent eight months at <strong style={{ fontWeight: 500 }}>Schneider Electric</strong> writing C and C++ for the boards inside solar power inverters, and I've been on SFU Robot Soccer's firmware team for almost 2 years. Contributed to Espressif's official ESP-IDF framework by adding a driver for the XPT2046 touchscreen controller (PR merged), expanding native display support for embedded developers.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--color-neutral-400)', maxWidth: '60ch', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
            I specialize in embedded systems: ARM Cortex-M microcontrollers (STM32 and ESP32), FreeRTOS, SPI and I2C, plus a lot of time reading hardware reference manuals. At Schneider I built a time-synchronisation system that kept clocks aligned within a millisecond across devices, and a containerised test rig that proved it. I also finished a legacy safety migration two months ahead of schedule. On the side I write Python and PyTorch, mostly reinforcement learning and multi-agent systems.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--color-neutral-400)', maxWidth: '60ch', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
            I came to firmware from application software background, which is probably why I build the test harness before the feature.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
            <a href="#work" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>See the work</a>
            <a href="https://github.com/qvd808" className="btn btn-secondary" style={{ color: 'var(--color-text)', whiteSpace: 'nowrap' }}>GitHub</a>
            <a href="https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view" className="btn btn-secondary" style={{ color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Résumé (PDF)</a>
          </div>

          <div className="shadow-box" style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-surface)', fontFamily: 'var(--font-mono)', maxWidth: 620, marginTop: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-divider)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-neutral-700)' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-neutral-700)' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-neutral-700)' }} />
              <span style={{ marginLeft: 'var(--space-2)', fontSize: 11, color: 'var(--color-neutral-500)' }}>vinh@bench</span>
            </div>
            <div style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 12.5, minHeight: 78 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
                <span style={{ color: 'var(--color-accent-400)' }}>vinh</span>
                <span style={{ color: 'var(--color-neutral-600)' }}>@</span>
                <span style={{ color: 'var(--color-neutral-400)' }}>bench</span>
                <span style={{ color: 'var(--color-neutral-600)' }}>:~$</span>
                <span style={{ color: 'var(--color-text)' }}>
                  {term.cmd}
                  <span style={{ display: 'inline-block', width: 7, height: 13, background: 'var(--color-accent)', animation: 'noct-blink 1.1s steps(1) infinite', marginLeft: 2, verticalAlign: -2 }} />
                </span>
              </div>
              <div style={{ color: 'var(--color-neutral-400)', marginTop: 'var(--space-2)', fontSize: 13 }}>{term.out}</div>
            </div>
          </div>
        </div>

        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="portrait-wrap" style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <img className="lighten" src={HeadShot} alt="Quang Vinh Dang" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(to right,transparent,color-mix(in srgb,var(--color-accent) 55%,transparent),transparent)', animation: 'noct-scan 7s linear infinite', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

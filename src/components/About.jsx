export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-label">§ about</div>
      <h2 className="section-title">
        I do what I love, and I love what I'm currently doing. <em className="serif">I'm simply trying to get better.</em>
      </h2>

      <div className="about-grid" style={{ marginTop: 40 }}>
        <div className="about-prose">
          <p>
            I'm Vinh. Fresh grad out of SFU. Mostly interested in low-level programming and C these days — the kind of stuff that either works or doesn't, no middle ground.
          </p>
          <p>
            My path has been a bit of a tour: React/React Native for web and mobile, then some firmware work, then a detour through GPU computing, and now I keep finding myself gravitating back to the <span className="hl">metal</span>. Turns out the deeper I go, the more fun it gets.
          </p>
          <p>
            I think the best engineers are the ones who are genuinely curious about what's happening under the abstraction. I try to be that kind of engineer.
          </p>
          <p style={{ color: 'var(--fg-3)', fontSize: 15, fontStyle: 'italic' }}>
            "<span className="serif">With great power comes great responsibility</span>" — a belief that guides my coding philosophy and, honestly, most of my decisions.
          </p>
        </div>

        <div className="goals-panel">
          <div className="goals-head">
            <div className="mono" style={{ fontSize: 10, color: 'var(--fg-4)', letterSpacing: '0.05em' }}>
              🎯 GOALS · 2026
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginTop: 6 }}>What I'm working toward</h3>
          </div>
          <ul className="goals-list">
            <li>
              <span className="goal-check">💻</span>
              <div>
                <div className="goal-title">Build a CPU on an FPGA</div>
                <div className="goal-sub">Start with Nand2Tetris-style, then design my own on Altera and open-source it</div>
              </div>
              <span className="goal-status">active</span>
            </li>
            <li>
              <span className="goal-check">⌚</span>
              <div>
                <div className="goal-title">Custom hardware watch</div>
                <div className="goal-sub">End-to-end — PCB, firmware, enclosure</div>
              </div>
              <span className="goal-status wip">wip</span>
            </li>
            <li>
              <span className="goal-check">🧠</span>
              <div>
                <div className="goal-title">Learn Zig</div>
                <div className="goal-sub">Because it sounds like the right tool for a lot of what I want to build</div>
              </div>
              <span className="goal-status wip">wip</span>
            </li>
          </ul>

          <div className="nvim-strip">
            <span className="mono" style={{ color: 'var(--fg-4)', fontSize: 10 }}>// sanctuary</span>
            <span className="mono" style={{ color: 'var(--fg-2)' }}>
              $ which editor → <span style={{ color: 'var(--accent)' }}>/usr/bin/nvim</span>
            </span>
            <span className="mono" style={{ color: 'var(--fg-4)', fontSize: 10 }}>🚀</span>
          </div>
        </div>
      </div>
    </section>
  );
}
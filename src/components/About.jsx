export default function About() {
  return (
    <section className="max-w-page mx-auto px-5 py-[calc(80px*var(--density))] [contain:layout_style]" id="about">
      <div className="section-label font-mono text-xs text-fg-4 tracking-[0.04em] uppercase flex items-center gap-2.5 mb-6">§ about</div>
      <h2 className="section-title font-medium tracking-[-0.025em] leading-[1.1] max-w-[760px] mb-3">
        I do what I love, and I love what I'm currently doing. <em className="font-serif italic tracking-[-0.01em]">I'm simply trying to get better.</em>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-[60px] mt-10">
        <div className="text-xl text-fg-2" style={{ textWrap: 'pretty' }}>
          <p className="mb-[18px] text-2xl text-fg">
            I'm Vinh. Fresh grad out of SFU. Mostly interested in low-level programming and C these days — the kind of stuff that either works or doesn't, no middle ground.
          </p>
          <p className="mb-[18px]">
            My path has been a bit of a tour: React/React Native for web and mobile, then some firmware work, then a detour through GPU computing, and now I keep finding myself gravitating back to the <span className="text-fg font-medium">metal</span>. Turns out the deeper I go, the more fun it gets.
          </p>
          <p className="mb-[18px]">
            I think the best engineers are the ones who are genuinely curious about what's happening under the abstraction. I try to be that kind of engineer.
          </p>
          <p className="text-fg-3 text-lg italic">
            "<span className="font-serif italic tracking-[-0.01em]">With great power comes great responsibility</span>" — a belief that guides my coding philosophy and, honestly, most of my decisions.
          </p>
        </div>

        <div className="bg-bg-1 border border-border rounded-lg p-[22px] flex flex-col gap-4">
          <div className="pb-3 border-b border-dashed border-border">
            <div className="font-mono text-2xs text-fg-4 tracking-[0.05em]">
              🎯 GOALS · 2026
            </div>
            <h3 className="text-[16px] font-medium mt-1.5">What I'm working toward</h3>
          </div>
          <ul className="list-none flex flex-col gap-3">
            <li className="grid grid-cols-[28px_1fr_auto] gap-3 items-start p-2.5 bg-bg-2 border border-border rounded-md">
              <span className="text-[18px] leading-none">💻</span>
              <div>
                <div className="text-md font-medium text-fg mb-0.5">Build a CPU on an FPGA</div>
                <div className="text-sm text-fg-3 leading-[1.45]">Start with Nand2Tetris-style, then design my own on Altera and open-source it</div>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-accent-dim text-accent border border-accent-border uppercase tracking-[0.04em] h-fit">active</span>
            </li>
            <li className="grid grid-cols-[28px_1fr_auto] gap-3 items-start p-2.5 bg-bg-2 border border-border rounded-md">
              <span className="text-[18px] leading-none">⌚</span>
              <div>
                <div className="text-md font-medium text-fg mb-0.5">Custom hardware watch</div>
                <div className="text-sm text-fg-3 leading-[1.45]">End-to-end — PCB, firmware, enclosure</div>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-[oklch(0.82_0.14_75/0.15)] text-warn border border-[oklch(0.82_0.14_75/0.3)] uppercase tracking-[0.04em] h-fit">wip</span>
            </li>
            <li className="grid grid-cols-[28px_1fr_auto] gap-3 items-start p-2.5 bg-bg-2 border border-border rounded-md">
              <span className="text-[18px] leading-none">🧠</span>
              <div>
                <div className="text-md font-medium text-fg mb-0.5">Learn Zig</div>
                <div className="text-sm text-fg-3 leading-[1.45]">Because it sounds like the right tool for a lot of what I want to build</div>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-[oklch(0.82_0.14_75/0.15)] text-warn border border-[oklch(0.82_0.14_75/0.3)] uppercase tracking-[0.04em] h-fit">wip</span>
            </li>
          </ul>

          <div className="flex items-center justify-between gap-2.5 px-3 py-2.5 bg-bg-2 border border-border rounded text-xs">
            <span className="font-mono text-fg-4 text-2xs">// sanctuary</span>
            <span className="font-mono text-fg-2">
              $ which editor → <span className="text-accent">/usr/bin/nvim</span>
            </span>
            <span className="font-mono text-fg-4 text-2xs">🚀</span>
          </div>
        </div>
      </div>
    </section>
  );
}
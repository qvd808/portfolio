export default function Contact() {
  const endpoints = [
    { method: "GET", path: "linkedin.com/in/qvd-dang", href: "https://www.linkedin.com/in/qvd-dang/" },
    { method: "GET", path: "github.com/qvd808", href: "https://github.com/qvd808" },
    { method: "POST", path: "mailto:dqvinh101@gmail.com", href: "mailto:dqvinh101@gmail.com" },
    { method: "GET", path: "resume.pdf", href: "https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view?usp=drive_link" },
  ];

  return (
    <section className="max-w-page mx-auto px-5 py-[calc(80px*var(--density))] [contain:layout_style]" id="contact">
      <div className="section-label font-mono text-xs text-fg-4 tracking-[0.04em] uppercase flex items-center gap-2.5 mb-6">§ contact</div>

      <div className="bg-bg-1 border border-border rounded-xl p-[clamp(24px,4vw,48px)] grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10">
        <div>
          <div className="font-mono text-xs text-fg-4 mb-[18px]">
            <span className="text-accent">●</span> INBOX OPEN
          </div>
          <h2 className="contact-title font-normal tracking-[-0.025em] leading-[1.05] mb-4">
            Want to talk about <em className="font-serif italic tracking-[-0.01em]">FPGAs, Zig, or why nvim is superior?</em>
          </h2>
          <p className="text-fg-3 text-lg mb-7 max-w-[440px]" style={{ textWrap: 'pretty' }}>
            Or, you know, about hiring me. I'm fresh-grad and genuinely open to whatever sounds interesting. I reply within a day, usually faster.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <a href="mailto:dqvinh101@gmail.com" className="font-mono text-sm px-3.5 py-2.5 rounded border border-accent bg-accent text-[oklch(0.12_0.01_250)] font-semibold cursor-pointer inline-flex items-center gap-2 no-underline hover:brightness-[1.08] transition-[filter] duration-150">
              dqvinh101@gmail.com <span className="transition-transform duration-150">→</span>
            </a>
            <a href="https://www.linkedin.com/in/qvd-dang/" target="_blank" className="font-mono text-sm px-3.5 py-2.5 rounded border border-border bg-bg-2 text-fg cursor-pointer inline-flex items-center gap-2 no-underline hover:bg-bg-3 hover:border-border-strong transition-[background,border-color] duration-150">linkedin</a>
          </div>
        </div>

        <div>
          <div className="rowline flex items-center gap-2 font-mono text-2xs text-fg-4 uppercase tracking-[0.05em] mb-2.5">ENDPOINTS</div>
          <div className="flex flex-col gap-2">
            {endpoints.map(e => (
              <a key={e.path} href={e.href} target="_blank" rel="noreferrer"
                className="group flex items-center justify-between gap-3.5 p-3.5 bg-bg-2 border border-border rounded-md font-mono text-sm text-fg-2 transition-[background,border-color,color] duration-150 hover:bg-bg-3 hover:border-accent-border hover:text-fg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xs font-semibold text-accent bg-accent-dim px-[7px] py-[3px] rounded-sm tracking-[0.04em] shrink-0">{e.method}</span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{e.path}</span>
                </div>
                <span className="text-fg-4 transition-[color,transform] duration-150 shrink-0 group-hover:text-accent group-hover:translate-x-[3px]">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
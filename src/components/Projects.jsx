const PROJECTS = [
  {
    repo: "qvd808/portfolio",
    title: "this portfolio",
    lang: "TypeScript",
    langHue: 210,
    desc: "The site you're reading. React + Vite + Framer Motion, deployed via GH Actions. Currently being redesigned. Want to auto-import projects from my repos next so I don't have to hand-edit this page ever again.",
    stack: ["React", "Vite", "Tailwind"],
  },
  {
    repo: "qvd808/Porfolio-site-content",
    title: "portfolio content repo",
    lang: "Markdown",
    langHue: 230,
    desc: "Markdown + GIFs that power the projects section of the site. Keeps content separate from the site itself so I can update project blurbs without touching the code.",
    stack: ["Markdown", "GIF"],
  },
  {
    repo: "qvd808/risc-v-logism",
    title: "RISC-V in Logisim",
    lang: "Verilog",
    langHue: 30,
    desc: "A RISC-V CPU implementation built in Logisim. Designed from the ground up — ALU, control unit, memory, the works. Open source.",
    stack: ["Logisim", "RISC-V", "digital logic"],
    wip: true,
  },
  {
    repo: "qvd808/dotfiles",
    title: "dotfiles",
    lang: "Lua",
    langHue: 260,
    desc: "nvim config, shell, tmux, the whole sanctuary. If you've ever been curious what a slightly overcooked nvim setup looks like, it's here.",
    stack: ["Lua", "Neovim", "shell"],
  },
];

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="section-label">§ 03 — projects</div>
      <h2 className="section-title">
        Some things I've made <em className="serif">(or am making).</em>
      </h2>
      <p className="section-sub">
        Placeholder list for now — plan is to auto-pull these from my GitHub on build. Click through to the repos. Most of them are rough around the edges on purpose.
      </p>

      <div className="project-grid">
        {PROJECTS.map(p => (
          <a className="project" key={p.repo} href={`https://github.com/${p.repo}`} target="_blank" rel="noreferrer">
            <div className="project-head">
              <div className="project-title-wrap">
                <span className="project-repo">{p.repo}</span>
                <span className="project-title">{p.title}</span>
              </div>
              {p.wip && (
                <span className="project-status wip">
                  <span className="dot" />WIP
                </span>
              )}
            </div>
            <div className="project-desc">{p.desc}</div>
            <div className="project-foot">
              <div className="project-lang">
                <span className="lang-dot" style={{background: `oklch(0.75 0.15 ${p.langHue})`}} />
                <span>{p.lang}</span>
              </div>
              <div className="project-stack">
                {p.stack.map(s => <span key={s} className="stack-tag">{s}</span>)}
              </div>
            </div>
            <div className="project-meta">
              <span className="stat">github.com/{p.repo}</span>
              <span className="project-arrow">→</span>
            </div>
          </a>
        ))}

        <div className="auto-import">
          <div>
            <span className="label">// TODO</span>
            auto-import from github.com/qvd808 so I don't have to hand-edit this ever again
          </div>
          <div style={{color:'var(--fg-4)'}}>maybe next weekend</div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SHOWCASE_REPOS = [
  'qvd808/flappy-bird-q-learning',
  'qvd808/Tergine',
  'qvd808/risc-v-logism',
];

const LANG_HUES = {
  Python: 130, TypeScript: 210, JavaScript: 60,
  C: 260, 'C++': 280, Rust: 30, Verilog: 50,
  Lua: 190, Go: 200, Swift: 20, Kotlin: 280,
  Markdown: 230, Assembly: 350, VHDL: 45, Shell: 180,
};

// Fallback data for showcase in case GitHub API is rate-limited
const SHOWCASE_FALLBACK = [
  {
    full_name: 'qvd808/flappy-bird-q-learning',
    name: 'flappy-bird-q-learning',
    description: 'A Q-learning AI that learns to play Flappy Bird from scratch. Reinforcement learning meets the most frustrating game ever made.',
    language: 'Python',
    stargazers_count: null,
    html_url: 'https://github.com/qvd808/flappy-bird-q-learning',
    topics: ['reinforcement-learning', 'q-learning', 'python'],
    pushed_at: null,
  },
  {
    full_name: 'qvd808/Tergine',
    name: 'Tergine',
    description: 'A terminal rendering engine built in C. For when you need pixel-level control over everything in the terminal.',
    language: 'C',
    stargazers_count: null,
    html_url: 'https://github.com/qvd808/Tergine',
    topics: ['terminal', 'rendering', 'c'],
    pushed_at: null,
  },
  {
    full_name: 'qvd808/risc-v-logism',
    name: 'risc-v-logism',
    description: 'A full RISC-V CPU implementation in Logisim. ALU, control unit, memory — designed from the ground up.',
    language: 'Verilog',
    stargazers_count: null,
    html_url: 'https://github.com/qvd808/risc-v-logism',
    topics: ['risc-v', 'cpu', 'logisim', 'digital-logic'],
    pushed_at: null,
  },
];

// ─── Fetching ─────────────────────────────────────────────────────────────────
async function fetchRepo(fullName, signal) {
  const res = await fetch(`https://api.github.com/repos/${fullName}`, { signal });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

async function fetchRecentRepos(signal) {
  const res = await fetch(
    'https://api.github.com/users/qvd808/repos?sort=pushed&per_page=12',
    { signal },
  );
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function useProjects() {
  const [showcase, setShowcase] = useState(null);    // null = loading
  const [recent,   setRecent]   = useState(null);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;

    (async () => {
      try {
        // Fetch showcase repos + all repos in parallel
        const [showcaseResults, allRepos] = await Promise.all([
          Promise.all(SHOWCASE_REPOS.map(r => fetchRepo(r, signal))),
          fetchRecentRepos(signal),
        ]);

        setShowcase(showcaseResults);

        // Recent = sorted by push date, excluding showcase repos
        const showcaseSet = new Set(SHOWCASE_REPOS.map(r => r.toLowerCase()));
        const filtered = allRepos
          .filter(r => !showcaseSet.has(r.full_name.toLowerCase()))
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 5);

        setRecent(filtered);
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.warn('GitHub API error, using fallback:', e.message);
        setShowcase(SHOWCASE_FALLBACK);
        setRecent([]);
        setError(true);
      }
    })();

    return () => ctrl.abort();
  }, []);

  return { showcase, recent, error };
}

// ─── Relative time ────────────────────────────────────────────────────────────
function relativeTime(iso) {
  if (!iso) return null;
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)       return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400)      return `${Math.round(diff / 3600)}h ago`;
  if (diff < 2592000)    return `${Math.round(diff / 86400)}d ago`;
  if (diff < 31536000)   return `${Math.round(diff / 2592000)}mo ago`;
  return `${Math.round(diff / 31536000)}y ago`;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-bg-1 border border-border rounded-lg p-5 pointer-events-none">
      <div className="flex flex-col gap-2.5">
        <div className="h-2.5 w-3/5 bg-bg-3 rounded animate-pulse-dot" />
        <div className="h-3.5 w-2/5 bg-bg-3 rounded animate-pulse-dot [animation-delay:0.15s]" />
        <div className="h-2.5 w-[85%] bg-bg-3 rounded animate-pulse-dot [animation-delay:0.3s]" />
        <div className="h-2.5 w-[70%] bg-bg-3 rounded animate-pulse-dot [animation-delay:0.45s]" />
      </div>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ repo, badge, badgeStyle }) {
  const hue     = LANG_HUES[repo.language] ?? 200;
  const pushed  = relativeTime(repo.pushed_at);
  const topics  = (repo.topics || []).slice(0, 3);

  return (
    <a
      className="project group bg-bg-1 border border-border rounded-lg p-5 flex flex-col gap-3.5 transition-[background,border-color,transform] duration-200 cursor-pointer relative will-change-transform hover:border-border-strong hover:bg-bg-2 hover:-translate-y-px"
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-mono text-xs text-fg-4">{repo.full_name}</span>
          <h3 className="text-[18px] font-medium tracking-[-0.015em] text-fg">{repo.name}</h3>
        </div>
        {badge && (
          <span className="inline-flex items-center gap-[5px] font-mono text-2xs px-[7px] py-[3px] rounded-[4px] uppercase tracking-[0.04em] whitespace-nowrap shrink-0" style={badgeStyle}>
            <span className="w-[5px] h-[5px] rounded-full" style={{ background: badgeStyle?.color ?? 'var(--accent)' }} />
            {badge}
          </span>
        )}
      </div>

      <div className="text-md text-fg-2 leading-[1.55]" style={{ textWrap: 'pretty' }}>
        {repo.description || 'No description yet.'}
      </div>

      <div className="flex justify-between items-center gap-3 flex-wrap">
        {repo.language && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-fg-3">
            <span className="w-2 h-2 rounded-full" style={{ background: `oklch(0.75 0.15 ${hue})` }} />
            <span>{repo.language}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {topics.map(t => <span key={t} className="shadow-box font-mono text-2xs px-[7px] py-[3px] bg-bg-2 border border-border rounded-sm text-fg-3">{t}</span>)}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 mt-auto border-t border-dashed border-border font-mono text-2xs text-fg-4">
        <span className="inline-flex items-center gap-1">
          {repo.stargazers_count != null && (
            <><b className="text-fg-2 font-medium">{repo.stargazers_count}</b> stars</>
          )}
          {pushed && repo.stargazers_count != null && ' · '}
          {pushed && `pushed ${pushed}`}
        </span>
        <span className="text-accent opacity-0 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-[3px]">→</span>
      </div>
    </a>
  );
}

// ─── Panel wrapper ────────────────────────────────────────────────────────────
function Panel({ label, title, meta, children }) {
  return (
    <div className="flex flex-col min-w-0">
      {/* Panel header */}
      <div className="flex items-baseline justify-between gap-3 mb-4 pb-3 border-b border-border">
        <div>
          <div className="font-mono text-2xs text-fg-4 tracking-[0.06em] mb-1">{label}</div>
          <h3 className="text-lg font-semibold text-fg">{title}</h3>
        </div>
        {meta && (
          <div className="font-mono text-2xs text-fg-4 whitespace-nowrap">{meta}</div>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}

// ─── Projects section ─────────────────────────────────────────────────────────
export default function Projects() {
  const { showcase, recent, error } = useProjects();

  const showcaseLoading = showcase === null;
  const recentLoading   = recent   === null;

  return (
    <section className="max-w-page mx-auto px-5 py-[calc(80px*var(--density))] [contain:layout_style]" id="projects">
      <div className="section-label font-mono text-xs text-fg-4 tracking-[0.04em] uppercase flex items-center gap-2.5 mb-6">§ projects</div>
      <h2 className="section-title font-medium tracking-[-0.025em] leading-[1.1] max-w-[760px] mb-3">
        Some things I've built <em className="font-serif italic tracking-[-0.01em]">(or am building).</em>
      </h2>
      <p className="text-lg text-fg-3 max-w-[640px] mb-12" style={{ textWrap: 'pretty' }}>
        Left panel: projects I'm proud of. Right panel: whatever I pushed most recently.
        {error && (
          <span className="text-fg-4 ml-2">
            · (GitHub API unavailable — showing cached data)
          </span>
        )}
      </p>

      {/* Two-panel grid */}
      <div className="projects-panels grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {/* ── Showcase panel ── */}
        <Panel
          label="// FEATURED"
          title="Picked projects"
          meta="hand-selected"
        >
          {showcaseLoading
            ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
            : showcase.map(repo => (
              <ProjectCard
                key={repo.full_name}
                repo={repo}
                badge="featured"
                badgeStyle={{ color: 'var(--accent)', borderColor: 'var(--accent-border)' }}
              />
            ))
          }
        </Panel>

        {/* ── Recent contributions panel ── */}
        <Panel
          label="// RECENT"
          title="Latest pushes"
          meta="from github.com/qvd808"
        >
          {recentLoading
            ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
            : recent.length > 0
              ? recent.map(repo => (
                <ProjectCard
                  key={repo.full_name}
                  repo={repo}
                />
              ))
              : (
                <div className="p-6 bg-bg-1 border border-border rounded-lg text-fg-4 text-base font-mono">
                  <span className="text-fg-4">// </span>
                  could not load recent repos
                  <div className="mt-2">
                    <a href="https://github.com/qvd808?tab=repositories" target="_blank" rel="noreferrer"
                      className="text-accent underline text-xs">
                      view on github ↗
                    </a>
                  </div>
                </div>
              )
          }
        </Panel>
      </div>
    </section>
  );
}
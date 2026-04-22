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
    <div className="project" style={{ pointerEvents: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 10, width: '60%', background: 'var(--bg-3)', borderRadius: 4, animation: 'pulse-dot 1.4s infinite' }} />
        <div style={{ height: 14, width: '40%', background: 'var(--bg-3)', borderRadius: 4, animation: 'pulse-dot 1.4s infinite 0.15s' }} />
        <div style={{ height: 10, width: '85%', background: 'var(--bg-3)', borderRadius: 4, animation: 'pulse-dot 1.4s infinite 0.3s' }} />
        <div style={{ height: 10, width: '70%', background: 'var(--bg-3)', borderRadius: 4, animation: 'pulse-dot 1.4s infinite 0.45s' }} />
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
      className="project"
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className="project-head">
        <div className="project-title-wrap">
          <span className="project-repo">{repo.full_name}</span>
          <span className="project-title">{repo.name}</span>
        </div>
        {badge && (
          <span className="project-status" style={badgeStyle}>
            <span className="dot" style={{ background: badgeStyle?.color ?? 'var(--accent)' }} />
            {badge}
          </span>
        )}
      </div>

      <div className="project-desc">
        {repo.description || 'No description yet.'}
      </div>

      <div className="project-foot">
        {repo.language && (
          <div className="project-lang">
            <span className="lang-dot" style={{ background: `oklch(0.75 0.15 ${hue})` }} />
            <span>{repo.language}</span>
          </div>
        )}
        <div className="project-stack">
          {topics.map(t => <span key={t} className="stack-tag">{t}</span>)}
        </div>
      </div>

      <div className="project-meta">
        <span className="stat">
          {repo.stargazers_count != null && (
            <><b>{repo.stargazers_count}</b> stars</>
          )}
          {pushed && repo.stargazers_count != null && ' · '}
          {pushed && `pushed ${pushed}`}
        </span>
        <span className="project-arrow">→</span>
      </div>
    </a>
  );
}

// ─── Panel wrapper ────────────────────────────────────────────────────────────
function Panel({ label, title, meta, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0 }}>
      {/* Panel header */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--fg-4)', letterSpacing: '0.06em', marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>{title}</div>
        </div>
        {meta && (
          <div className="mono" style={{ fontSize: 10, color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>{meta}</div>
        )}
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
    <section className="section" id="projects">
      <div className="section-label">§ projects</div>
      <h2 className="section-title">
        Some things I've built <em className="serif">(or am building).</em>
      </h2>
      <p className="section-sub">
        Left panel: projects I'm proud of. Right panel: whatever I pushed most recently.
        {error && (
          <span style={{ color: 'var(--fg-4)', marginLeft: 8 }}>
            · (GitHub API unavailable — showing cached data)
          </span>
        )}
      </p>

      {/* Two-panel grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 32,
        marginTop: 32,
      }}
        className="projects-panels"
      >
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
                <div style={{
                  padding: '24px 20px',
                  background: 'var(--bg-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--fg-4)',
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  <span style={{ color: 'var(--fg-4)' }}>// </span>
                  could not load recent repos
                  <div style={{ marginTop: 8 }}>
                    <a href="https://github.com/qvd808?tab=repositories" target="_blank" rel="noreferrer"
                      style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: 11 }}>
                      view on github ↗
                    </a>
                  </div>
                </div>
              )
          }
        </Panel>
      </div>

      {/* Responsive: stack on mobile via CSS below */}
      <style>{`
        @media (max-width: 720px) {
          .projects-panels {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
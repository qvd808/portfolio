import { useState, useEffect } from 'react';

// Live GitHub language stats — recency-weighted, 24h localStorage cache.
// Drop-in replacement for the hardcoded LANGS array in Skills.jsx.
const USER = 'qvd808';
const CACHE_KEY = `ghLangStats:${USER}`;
const CACHE_TTL = 1000 * 60 * 60 * 24;

const LANG_HUES = {
  Python: 130, TypeScript: 210, JavaScript: 60, C: 260, 'C++': 280,
  Rust: 30, Verilog: 50, Lua: 190, Go: 200, Swift: 20, Kotlin: 280,
  Java: 40, CUDA: 150, VHDL: 45, Shell: 180, HTML: 15, CSS: 330,
};

async function fetchLangStats() {
  const reposRes = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`);
  if (!reposRes.ok) throw new Error('repos ' + reposRes.status);
  const repos = await reposRes.json();
  const now = Date.now();
  const YEAR = 1000 * 60 * 60 * 24 * 365;

  const results = await Promise.allSettled(repos.slice(0, 30).map(async r => {
    const res = await fetch(r.languages_url);
    if (!res.ok) return null;
    const langs = await res.json();
    const age = (now - new Date(r.pushed_at).getTime()) / YEAR;
    // Full weight if pushed within 12 months; decays 0.5/year after, floor 0.1
    const weight = Math.max(0.1, age <= 1 ? 1 : 1 - (age - 1) * 0.5);
    return { langs, weight };
  }));

  const totals = {};
  results.forEach(res => {
    if (res.status !== 'fulfilled' || !res.value) return;
    const { langs, weight } = res.value;
    for (const [lang, bytes] of Object.entries(langs)) {
      totals[lang] = (totals[lang] || 0) + bytes * weight;
    }
  });

  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  if (sum === 0) throw new Error('no language data');

  const rows = Object.entries(totals)
    .map(([name, bytes]) => ({ name, pct: (bytes / sum) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  return { rows, fetchedAt: Date.now() };
}

function useLangStats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
        setData(cached);
        return;
      }
    } catch { }

    fetchLangStats()
      .then(d => {
        if (cancelled) return;
        setData(d);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch { }
      })
      .catch(e => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, []);

  return { data, error };
}

export default function LangStats() {
  const { data, error } = useLangStats();
  const [running, setRunning] = useState(false);

  // Trigger bar animation once data is ready
  useEffect(() => {
    if (data && !running) {
      const t = setTimeout(() => setRunning(true), 80);
      return () => clearTimeout(t);
    }
  }, [data, running]);

  if (error) {
    return (
      <div className="lang-panel" style={{ padding: 20 }}>
        <div className="lang-panel-head">
          <h3>$ gh lang-stats --user {USER}</h3>
          <span className="meta">API unavailable</span>
        </div>
        <div style={{ color: 'var(--fg-4)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
          // could not reach github.com — try again later
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="lang-panel" style={{ padding: 20 }}>
        <div className="lang-panel-head">
          <h3>$ gh lang-stats --user {USER}</h3>
          <span className="meta">fetching…</span>
        </div>
        {[0, 1, 2, 3, 4].map(i => (
          <div className="lang-row" key={i}>
            <span className="lang-name" style={{ color: 'var(--fg-4)' }}>...</span>
            <div className="lang-bar"><div className="lang-bar-fill" style={{ width: '0%' }} /></div>
            <span className="lang-pct">--</span>
          </div>
        ))}
      </div>
    );
  }

  const stamp = new Date(data.fetchedAt).toISOString().slice(0, 10);
  const maxPct = Math.max(...data.rows.map(r => r.pct), 0.1);
  const scale = 92 / maxPct; // scale so longest bar is ~92% width

  return (
    <div className="lang-panel" style={{ padding: 20, cursor: 'pointer' }}
      onClick={() => setRunning(false)}>
      <div className="lang-panel-head">
        <h3>$ gh lang-stats --user {USER}</h3>
        <span className="meta">recency-weighted · {stamp}</span>
      </div>
      {data.rows.map((l, i) => {
        const hue = LANG_HUES[l.name] ?? 200;
        return (
          <div className="lang-row" key={l.name}>
            <span className="lang-name">{l.name}</span>
            <div className="lang-bar">
              <div className="lang-bar-fill" style={{
                width: running ? `${Math.min(100, l.pct * scale)}%` : '0%',
                background: `oklch(0.75 0.15 ${hue})`,
                transitionDelay: `${i * 70}ms`,
              }} />
            </div>
            <span className="lang-pct">{l.pct.toFixed(1)}%</span>
          </div>
        );
      })}
    </div>
  );
}

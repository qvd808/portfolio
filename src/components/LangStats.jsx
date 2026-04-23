import { useState, useEffect } from 'react';

// Live GitHub language stats — recency-weighted, 24h localStorage cache.
// Drop-in replacement for the hardcoded LANGS array in Skills.jsx.
const USER = 'qvd808';
const CACHE_KEY = `ghLangStats:${USER}_v2`;
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

  const recentTotals = {};
  const lifetimeTotals = {};
  
  results.forEach(res => {
    if (res.status !== 'fulfilled' || !res.value) return;
    const { langs, weight } = res.value;

    const repoTotalBytes = Object.values(langs).reduce((a, b) => a + b, 0);
    if (repoTotalBytes === 0) return;

    for (const [lang, bytes] of Object.entries(langs)) {
      const share = bytes / repoTotalBytes;
      recentTotals[lang] = (recentTotals[lang] || 0) + (share * weight);
      lifetimeTotals[lang] = (lifetimeTotals[lang] || 0) + bytes;
    }
  });

  const sortAndMap = (totals) => {
    const sum = Object.values(totals).reduce((a, b) => a + b, 0);
    if (sum === 0) return [];
    return Object.entries(totals)
      .map(([name, val]) => ({ name, pct: (val / sum) * 100 }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 8);
  };

  const recentRows = sortAndMap(recentTotals);
  const lifetimeRows = sortAndMap(lifetimeTotals);

  if (recentRows.length === 0 && lifetimeRows.length === 0) throw new Error('no language data');

  return { recentRows, lifetimeRows, fetchedAt: Date.now() };
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

function LangPanelHead({ children, meta }) {
  return (
    <div className="flex justify-between items-baseline pb-3.5 mb-4 border-b border-dashed border-border">
      <h3 className="text-base font-mono font-medium text-fg">{children}</h3>
      <span className="font-mono text-2xs text-fg-4">{meta}</span>
    </div>
  );
}

function LangRow({ name, children }) {
  return (
    <div className="grid grid-cols-[90px_1fr_50px] gap-3.5 items-center py-2 font-mono text-sm">
      <span className="text-fg">{name}</span>
      {children}
    </div>
  );
}

export default function LangStats({ mode = 'recent' }) {
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
      <div className="p-5 min-h-[480px]">
        <LangPanelHead meta="API unavailable">$ gh lang-stats --user {USER}</LangPanelHead>
        <div className="text-fg-4 text-sm font-mono">
          // could not reach github.com — try again later
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-5 min-h-[480px]">
        <LangPanelHead meta="fetching…">$ gh lang-stats --user {USER}</LangPanelHead>
        {[0, 1, 2, 3, 4].map(i => (
          <LangRow key={i} name="...">
            <div className="h-1.5 bg-bg-3 rounded-sm overflow-hidden relative">
              <div className="lang-bar-fill h-full rounded-sm" style={{ width: '0%' }} />
            </div>
            <span className="text-fg-3 text-right text-xs">--</span>
          </LangRow>
        ))}
      </div>
    );
  }

  const rows = mode === 'recent' ? data.recentRows : data.lifetimeRows;
  const stamp = new Date(data.fetchedAt).toISOString().slice(0, 10);
  const maxPct = Math.max(...rows.map(r => r.pct), 0.1);
  const scale = 92 / maxPct; // scale so longest bar is ~92% width

  return (
    <div className="p-5 min-h-[480px] cursor-pointer" onClick={() => setRunning(false)}>
      <LangPanelHead meta={mode === 'recent' ? `recency-weighted · ${stamp}` : `total byte sum · ${stamp}`}>
        $ gh lang-stats --user {USER} {mode === 'lifetime' && '--lifetime'}
      </LangPanelHead>
      {rows.map((l, i) => {
        const hue = LANG_HUES[l.name] ?? 200;
        return (
          <LangRow key={l.name} name={l.name}>
            <div className="h-1.5 bg-bg-3 rounded-sm overflow-hidden relative">
              <div className="lang-bar-fill h-full rounded-sm" style={{
                width: running ? `${Math.min(100, l.pct * scale)}%` : '0%',
                background: `oklch(0.75 0.15 ${hue})`,
                transitionDelay: `${i * 70}ms`,
              }} />
            </div>
            <span className="text-fg-3 text-right text-xs">{l.pct.toFixed(1)}%</span>
          </LangRow>
        );
      })}
    </div>
  );
}

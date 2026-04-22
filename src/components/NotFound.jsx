import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;

// Each dog gets its own caption that fits the "are you lost?" vibe
const EASTER_EGGS = [
  {
    src: `${BASE}doggo_with_gun.png`,
    alt: 'dog with a gun',
    caption: 'One more step and we both find out what happens.',
    sub: 'are you sure you not lost or something?',
  },
  {
    src: `${BASE}stop_fighting_meme.jpg`,
    alt: 'puppy being held up',
    caption: "I just got here and even I know this isn't a real page.",
    sub: 'go back. now.',
  },
  {
    src: `${BASE}dog_beware-3339263613.jpg`,
    alt: 'friendly dog',
    caption: 'Hi there, I am a friendly dog.',
    sub: `     ︵ \n૮(\`ᴥ ⁻ 𑁬\n   |    ⸝ 〵\n  じしˍ,  )୭`,
  },
  {
    src: `${BASE}crying_anime_girl.jpg`,
    alt: 'Anna Yanami crying',
    caption: "I'm lost, you're lost... we're all lost here.",
    sub: 'NOT FOUND. go back.',
  },
];

// Minimal glitch text for the 404 heading
function Glitch({ children }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setOn(true);
      setTimeout(() => setOn(false), 130);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      textShadow: on ? '4px 0 #f03, -4px 0 #0cf, 0 0 30px #f03' : 'none',
      transform: on ? 'translateX(3px) skewX(-4deg)' : 'none',
      transition: on ? 'none' : 'all 0.2s',
      filter: on ? 'brightness(1.4)' : 'none',
    }}>{children}</span>
  );
}

export default function NotFound() {
  // Pick a random dog once per render (stable across re-renders via useState init)
  const [egg] = useState(() => EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)]);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Minimal chrome — no need for full nav on 404
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--fg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      textAlign: 'center',
      gap: 0,
    }}>

      {/* Terminal-style header */}
      <div style={{ fontSize: 11, color: 'var(--fg-4)', marginBottom: 24, letterSpacing: '0.06em' }}>
        <span style={{ color: 'var(--accent)' }}>●</span>
        {' '}vinh@arch: ~ $ <span style={{ color: 'var(--danger)' }}>cd {window.location.pathname}</span>
      </div>

      {/* Big 404 */}
      <div style={{
        fontSize: 'clamp(72px, 18vw, 140px)',
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        color: 'var(--fg)',
        marginBottom: 8,
      }}>
        <Glitch>NOT FOUND</Glitch>
      </div>

      {/* Error label */}
      <div style={{
        fontSize: 12,
        color: 'var(--danger)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>bash: {window.location.pathname}: No such page or directory</span>
      </div>

      {/* Dog image */}
      <div style={{
        position: 'relative',
        marginBottom: 28,
        maxWidth: 320,
        width: '100%',
      }}>
        {/* Subtle glow border */}
        <div style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 16,
          background: 'linear-gradient(135deg, var(--accent), var(--danger))',
          opacity: 0.3,
          filter: 'blur(8px)',
        }} />
        <img
          src={egg.src}
          alt={egg.alt}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: 300,
            objectFit: 'contain',
            borderRadius: 12,
            border: '1px solid var(--border)',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            background: 'var(--bg-1)',
            display: 'block',
          }}
        />
      </div>

      <div style={{
        backgroundColor: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '16px 24px',
        marginBottom: 40,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        <p style={{
          fontSize: 14,
          color: 'var(--fg-2)',
          maxWidth: 320,
          lineHeight: 1.5,
          margin: 0,
        }}>
          {egg.caption}
        </p>
        <div className="emoji-wrap" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 8,
        }}>
          <div className="emojis" style={{
            fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'JetBrains Mono', monospace",
            fontSize: 'clamp(14px, 3.5vw, 20px)',
            textAlign: 'left',
            whiteSpace: 'pre',
            lineHeight: '1.4',
            color: 'var(--accent)',
            letterSpacing: '0',
          }}>
            {egg.sub}
          </div>
        </div>
      </div>

      {/* Go back */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'var(--accent)',
            color: 'oklch(0.12 0.01 250)',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            transition: 'filter 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
          onMouseLeave={e => e.currentTarget.style.filter = ''}
        >
          ← NOT FOUND go back
        </a>
        <button
          onClick={() => {
            // Re-roll dog on click
            window.location.reload();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'var(--bg-2)',
            color: 'var(--fg-2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
            cursor: 'pointer',
            letterSpacing: '0.02em',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-2)'}
        >
          ↻ different one
        </button>
      </div>

      {/* Tiny footer hint */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        fontSize: 10,
        color: 'var(--fg-4)',
        letterSpacing: '0.05em',
      }}>
        // you found the easter egg. now go back.
      </div>
    </div>
  );
}
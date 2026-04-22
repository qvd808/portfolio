import { useState, useEffect } from 'react';

// Each dog gets its own caption that fits the "are you lost?" vibe
const DOGS = [
  {
    src: '/404-dog-gun.png',
    alt: 'threatening dog with a gun',
    caption: 'Wrong turn. I suggest you go back before I make this worse.',
    sub: 'and I will.',
  },
  {
    src: '/404-dog-baby.jpg',
    alt: 'newborn puppy with arms out',
    caption: "I'm literally 3 days old and I know this page doesn't exist.",
    sub: "what's your excuse?",
  },
  {
    src: '/404-dog-beware.jpg',
    alt: 'fluffy dog behind beware of dog sign',
    caption: "Maybe I'll bite, maybe I won't. What I do know: you're lost.",
    sub: 'are you sure you\'re not lost?',
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
  const [dog] = useState(() => DOGS[Math.floor(Math.random() * DOGS.length)]);
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
        <Glitch>404</Glitch>
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
          src={dog.src}
          alt={dog.alt}
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

      {/* Caption */}
      <p style={{
        fontSize: 15,
        color: 'var(--fg-2)',
        marginBottom: 4,
        maxWidth: 360,
        lineHeight: 1.5,
      }}>
        {dog.caption}
      </p>
      <p style={{
        fontSize: 12,
        color: 'var(--fg-4)',
        marginBottom: 40,
        fontStyle: 'italic',
      }}>
        — {dog.sub}
      </p>

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
          ← go back home
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
          ↻ different dog
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
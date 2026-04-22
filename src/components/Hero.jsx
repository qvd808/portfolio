import { useState, useEffect, lazy, Suspense } from 'react';
const ShatterImage = lazy(() => import('./ShatterImage'));
import headshotSrc from '../assets/HeadShot.jpeg';

const COMMANDS = [
  { cmd: "whoami", out: "vinh // low-level curious · fresh grad · broke" },
  { cmd: "cat current_focus.txt", out: "C. Rust. FPGAs. Trying to build a CPU." },
  { cmd: "uptime", out: "22 years, mostly caffeinated" },
  { cmd: "which editor", out: "/usr/bin/nvim  # obviously" },
];

function useCommandCycle(items, pauseMs = 2600, typeMs = 42) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    let t;
    const full = items[i % items.length].cmd;
    if (phase === "typing") {
      if (text.length < full.length) {
        t = setTimeout(() => setText(full.slice(0, text.length + 1)), typeMs);
      } else {
        t = setTimeout(() => setPhase("showing"), 500);
      }
    } else if (phase === "showing") {
      t = setTimeout(() => setPhase("clearing"), pauseMs);
    } else if (phase === "clearing") {
      setText("");
      setI(p => p + 1);
      setPhase("typing");
    }
    return () => clearTimeout(t);
  }, [text, phase, i, items, pauseMs, typeMs]);

  return {
    cmd: text,
    out: phase === "showing" || phase === "clearing" ? items[i % items.length].out : "",
    showCursor: phase === "typing",
  };
}

function GlitchText({ children }) {
  const [g, setG] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setG(true); setTimeout(() => setG(false), 160); }, 4800);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      textShadow: g ? '2px 0 var(--accent), -2px 0 oklch(0.7 0.2 25)' : 'none',
      transform: g ? 'translateX(1px)' : 'none',
      transition: 'transform 0.08s',
    }}>{children}</span>
  );
}

export default function Hero() {
  const { cmd, out, showCursor } = useCommandCycle(COMMANDS);

  return (
    <section className="hero" id="hero">
      <div className="hero-status-strip">
        <span className="status-chip live"><span className="dot" /> OPEN TO WORK</span>
        <span className="status-chip"><span className="dot" style={{background:'var(--fg-3)'}}/> VANCOUVER, BC</span>
        <span className="status-chip">SFU · B.SC 2025</span>
        <span className="status-chip">WILL RELOCATE</span>
      </div>

      <div className="hero-grid">
        <div>
          <div className="mono" style={{fontSize:11, color:'var(--fg-4)', marginBottom:18, letterSpacing:'0.04em'}}>
            ~/vinh <span style={{color:'var(--accent)'}}>§</span> hi there 👋
          </div>

          <h1 className="hero-heading">
            I like <GlitchText><span className="accent-underline">low-level things</span></GlitchText> and
            <br/>
            I'm <em className="serif">simply trying to get better.</em>
          </h1>

          <div className="terminal-box">
            <div className="terminal-head">
              <span className="t-dot r"></span><span className="t-dot y"></span><span className="t-dot g"></span>
              <span className="t-title">— nvim — vinh@arch ~</span>
            </div>
            <div className="terminal-body">
              <div className="t-line">
                <span className="t-prompt">vinh@arch</span>
                <span className="t-sep">:</span>
                <span className="t-path">~</span>
                <span className="t-sep">$</span>
                <span className="t-cmd">{cmd}{showCursor && <span className="glitch-cursor" />}</span>
              </div>
              {out && <div className="t-out">{out}</div>}
            </div>
          </div>

          <p className="hero-sub">
            C, Rust, Python, TypeScript — I've done the full-stack tour, but lately
            I keep drifting closer to the metal. Currently learning Zig and trying
            to design a CPU on an Altera FPGA for fun. I do what I love and I love
            what I'm doing. That's about it.
          </p>

          <div className="cta-row">
            <a href="#projects" className="btn primary">
              see projects <span className="arrow">→</span>
            </a>
            <a href="https://github.com/qvd808" target="_blank" className="btn">
              github ↗
            </a>
            <a href="https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view?usp=drive_link" target="_blank" className="btn">
              resume ↗
            </a>
          </div>
        </div>

        <div>
          <div className="portrait-wrap">
            <Suspense fallback={<div style={{width:'100%',height:'100%',background:'var(--bg-2)'}}/>}>
              <ShatterImage src={headshotSrc} alt="Vinh Dang" />
            </Suspense>
            <div className="portrait-overlay" />
            <div className="portrait-badge">
              <span>vinh.jpeg</span>
              <span style={{color:'var(--accent)'}}>●</span>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <span>NOW</span>
              <span>2026.Q2</span>
            </div>
            <div className="hero-card-row"><span className="k">building</span><span className="v">FPGA CPU</span></div>
            <div className="hero-card-row"><span className="k">learning</span><span className="v">Zig</span></div>
            <div className="hero-card-row"><span className="k">editor</span><span className="v">nvim 🚀</span></div>
            <div className="hero-card-row"><span className="k">status</span><span className="v" style={{color:'var(--accent)'}}>broke</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

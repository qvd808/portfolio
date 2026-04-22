import { useState, useEffect } from 'react';

export default function GlitchIntro({ onDone }) {
  const words = ["Welcome", "to my", "website"];
  const [i, setI] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (i < words.length - 1) {
        setI(i + 1);
      } else {
        setFading(true);
        setTimeout(() => onDone?.(), 550);
      }
    }, 900);
    return () => clearTimeout(t);
  }, [i]);

  const word = words[i];

  return (
    <div className={`glitch-splash ${fading ? 'fading' : ''}`}>
      <div key={`b-${i}`} className="glitch-word layer-base">{word}</div>
      <div key={`t-${i}`} className="glitch-word layer-top">{word}</div>
      <div key={`d-${i}`} className="glitch-word layer-bot">{word}</div>
    </div>
  );
}

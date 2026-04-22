import { useState, useEffect } from 'react';

const TWEAK_DEFAULTS = {
  theme: "dark",
  accentHue: 130,
  density: 1,
  layout: "standard",
};

export function useTweaks() {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tweaks') || 'null');
      return saved ? { ...TWEAK_DEFAULTS, ...saved } : TWEAK_DEFAULTS;
    } catch { return TWEAK_DEFAULTS; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    root.style.setProperty('--accent-h', state.accentHue);
    root.style.setProperty('--density', state.density);
    localStorage.setItem('tweaks', JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

export default function Tweaks({ state, setState, visible, onClose }) {
  if (!visible) return null;

  const update = (patch) => {
    setState(s => ({ ...s, ...patch }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  return (
    <div className="tweaks">
      <div className="tweaks-head">
        <span>⚙ TWEAKS</span>
        <button className="tweaks-close" onClick={onClose}>×</button>
      </div>

      <div className="tweak-row">
        <label>THEME</label>
        <div className="seg">
          <button className={state.theme==='dark'?'active':''} onClick={()=>update({theme:'dark'})}>dark</button>
          <button className={state.theme==='light'?'active':''} onClick={()=>update({theme:'light'})}>cream</button>
        </div>
      </div>

      <div className="tweak-row">
        <label>ACCENT HUE <span className="val">{state.accentHue}°</span></label>
        <input type="range" min="0" max="360" value={state.accentHue}
          onChange={e => update({ accentHue: Number(e.target.value) })} />
      </div>

      <div className="tweak-row">
        <label>DENSITY <span className="val">{state.density === 1 ? 'standard' : state.density < 1 ? 'compact' : 'spacious'}</span></label>
        <input type="range" min="0.6" max="1.4" step="0.1" value={state.density}
          onChange={e => update({ density: Number(e.target.value) })} />
      </div>

      <div className="tweak-row">
        <label>PRESETS</label>
        <div className="seg">
          <button onClick={()=>update({theme:'dark', accentHue:130, density:1})}>lime</button>
          <button onClick={()=>update({theme:'dark', accentHue:210, density:1})}>cyan</button>
          <button onClick={()=>update({theme:'dark', accentHue:30, density:1})}>amber</button>
          <button onClick={()=>update({theme:'light', accentHue:40, density:1})}>cream</button>
        </div>
      </div>
    </div>
  );
}

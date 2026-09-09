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

  // Nocturne is a single dark palette, so nothing here repaints the theme.
  useEffect(() => {
    localStorage.setItem('tweaks', JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function SegButton({ active, onClick, children }) {
  return (
    <button
      className={`flex-1 border-none px-2 py-1.5 font-inherit text-2xs cursor-pointer uppercase tracking-[0.04em] transition-[background,color] duration-150 ${
        active
          ? 'bg-accent text-[oklch(0.12_0.01_250)] font-semibold'
          : 'bg-transparent text-fg-3 hover:text-fg'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function Tweaks({ state, setState, visible, onClose }) {
  if (!visible) return null;

  const update = (patch) => {
    setState(s => ({ ...s, ...patch }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  return (
    <div className="fixed right-5 bottom-5 w-[280px] bg-bg-1 border border-border-strong rounded-lg p-4 font-mono text-xs text-fg-2 z-50 shadow-[0_8px_30px_oklch(0_0_0/0.3)]">
      <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-dashed border-border text-xs tracking-[0.04em] uppercase text-fg-3">
        <span>⚙ TWEAKS</span>
        <button className="bg-transparent border-none text-fg-4 cursor-pointer text-sm leading-none" onClick={onClose}>×</button>
      </div>

      <div className="flex flex-col gap-1.5 mb-3.5">
        <label className="flex justify-between text-fg-3 text-2xs uppercase tracking-[0.04em]">THEME</label>
        <div className="flex bg-bg-2 border border-border rounded overflow-hidden">
          <SegButton active={state.theme === 'dark'} onClick={() => update({ theme: 'dark' })}>dark</SegButton>
          <SegButton active={state.theme === 'light'} onClick={() => update({ theme: 'light' })}>cream</SegButton>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-3.5">
        <label className="flex justify-between text-fg-3 text-2xs uppercase tracking-[0.04em]">
          ACCENT HUE <span className="text-accent normal-case tracking-normal">{state.accentHue}°</span>
        </label>
        <input type="range" min="0" max="360" value={state.accentHue}
          onChange={e => update({ accentHue: Number(e.target.value) })} />
      </div>

      <div className="flex flex-col gap-1.5 mb-3.5">
        <label className="flex justify-between text-fg-3 text-2xs uppercase tracking-[0.04em]">
          DENSITY <span className="text-accent normal-case tracking-normal">{state.density === 1 ? 'standard' : state.density < 1 ? 'compact' : 'spacious'}</span>
        </label>
        <input type="range" min="0.6" max="1.4" step="0.1" value={state.density}
          onChange={e => update({ density: Number(e.target.value) })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex justify-between text-fg-3 text-2xs uppercase tracking-[0.04em]">PRESETS</label>
        <div className="flex bg-bg-2 border border-border rounded overflow-hidden">
          <SegButton onClick={() => update({ theme: 'dark', accentHue: 130, density: 1 })}>lime</SegButton>
          <SegButton onClick={() => update({ theme: 'dark', accentHue: 210, density: 1 })}>cyan</SegButton>
          <SegButton onClick={() => update({ theme: 'dark', accentHue: 30, density: 1 })}>amber</SegButton>
          <SegButton onClick={() => update({ theme: 'light', accentHue: 40, density: 1 })}>cream</SegButton>
        </div>
      </div>
    </div>
  );
}

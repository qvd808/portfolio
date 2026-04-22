// Simple fire-and-forget event bus shared by Hero lightning,
// GlitchText, and StrikeUnderline so they all land in one beat.
const strikeBus = {
  listeners: new Set(),
  on(fn){ this.listeners.add(fn); return () => this.listeners.delete(fn); },
  fire(){ this.listeners.forEach(fn => fn()); },
};

export default strikeBus;

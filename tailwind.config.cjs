/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./404.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:       "var(--bg)",
        "bg-1":   "var(--bg-1)",
        "bg-2":   "var(--bg-2)",
        "bg-3":   "var(--bg-3)",
        fg:       "var(--fg)",
        "fg-2":   "var(--fg-2)",
        "fg-3":   "var(--fg-3)",
        "fg-4":   "var(--fg-4)",
        accent:   "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        "accent-border": "var(--accent-border)",
        border:   "var(--border)",
        "border-strong": "var(--border-strong)",
        danger:   "var(--danger)",
        warn:     "var(--warn)",
      },
      fontFamily: {
        sans:  ["'Inter'", "-apple-system", "system-ui", "sans-serif"],
        mono:  ["'JetBrains Mono'", "ui-monospace", "monospace"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
      },
      maxWidth: {
        page: "var(--maxw)",
      },
      screens: {
        xs: "550px",
        sm: "700px",
        md: "800px",
        lg: "900px",
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "1.4" }],
        xs:    ["11px", { lineHeight: "1.4" }],
        sm:    ["12px", { lineHeight: "1.5" }],
        base:  ["13px", { lineHeight: "1.5" }],
        md:    ["14px", { lineHeight: "1.55" }],
        lg:    ["15px", { lineHeight: "1.55" }],
        xl:    ["17px", { lineHeight: "1.5" }],
        "2xl": ["19px", { lineHeight: "1.4" }],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      animation: {
        "pulse-dot": "pulse-dot 2s infinite",
        blink: "blink 1s steps(1) infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bocchi: ["Pixelfy Sans", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "var(--color-bg)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        paper: "var(--color-paper)",
        panel: "var(--color-panel)",
        warm: "var(--color-warm)",
        moss: "var(--color-moss)",
        blush: "var(--color-blush)",
        skysoft: "var(--color-skysoft)",
      },
      boxShadow: {
        bocchi: "var(--shadow-soft)",
        insetRoom: "var(--shadow-inset-room)",
      },
      borderRadius: {
        bocchi: "1.25rem",
      },
    },
  },
  plugins: [],
};

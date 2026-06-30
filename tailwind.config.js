/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bocchi: ["Pixelify Sans", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "var(--color-bg)",
        ink: "var(--color-text)",
        muted: "var(--color-text-muted)",
        soft: "var(--color-text-soft)",
        paper: "var(--color-surface)",
        panel: "var(--color-surface-soft)",
        surface: "var(--color-surface)",
        surfaceSoft: "var(--color-surface-soft)",
        border: "var(--color-border)",
        warm: "var(--color-brand)",
        warmHover: "var(--color-brand-hover)",
        brandSoft: "var(--color-brand-soft)",
        moss: "var(--color-success)",
        successSoft: "var(--color-success-soft)",
        warning: "var(--color-warning)",
        warningSoft: "var(--color-warning-soft)",
        skysoft: "var(--color-info-soft)",
        info: "var(--color-info)",
        infoSoft: "var(--color-info-soft)",
        blush: "var(--color-danger)",
        dangerSoft: "var(--color-danger-soft)",
      },
      boxShadow: {
        bocchi: "var(--shadow-soft)",
      },
      borderRadius: {
        smol: "var(--radius-sm)",
        bocchi: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [],
};

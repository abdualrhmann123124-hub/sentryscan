import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0E12",
          raised: "#10151C",
          surface: "#151B23",
          border: "#232C37",
        },
        ink: {
          DEFAULT: "#E7EDF3",
          muted: "#8A97A6",
          faint: "#5B6675",
        },
        signal: {
          DEFAULT: "#3DF2A5",
          dim: "#1F7A56",
        },
        probe: {
          DEFAULT: "#4FA8FF",
          dim: "#2A5D91",
        },
        alert: {
          DEFAULT: "#FF5C5C",
          dim: "#8C2E2E",
        },
        warn: {
          DEFAULT: "#F5C05E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, #0A0E12), linear-gradient(90deg, #ffffff08 1px, transparent 1px), linear-gradient(#ffffff08 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "100% 100%, 40px 40px, 40px 40px",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
        scanline: "scanline 3s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

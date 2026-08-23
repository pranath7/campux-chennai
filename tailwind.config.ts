import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ca: {
          navy: "#0a1128",
          blue: "#1c3d5a",
          accent: "#2563eb",
          gold: "#f59e0b",
          emerald: "#10b981",
          ruby: "#ef4444",
          purple: "#8b5cf6",
          darkCard: "#0f172a",
          darkBorder: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px -3px rgba(37, 99, 235, 0.3)" },
          "100%": { boxShadow: "0 0 25px 2px rgba(37, 99, 235, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

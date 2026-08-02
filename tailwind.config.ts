import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: "#0D0D0F",
        "ink-2": "#1A1A1F",
        "ink-3": "#2A2A32",
        silver: "#E8E8EE",
        "silver-2": "#A0A0B0",
        gold: "#C9A84C",
        "gold-light": "#E8C96A",
        red: "#C94C4C",
        green: "#4CC98A",
        blue: "#4C8AC9",
        purple: "#8A4CC9",
        orange: "#C97A4C",
        teal: "#4CC9B8",
        white: "#F5F5FA",
      },
    },
  },
  plugins: [],
};
export default config;

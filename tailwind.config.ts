import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F5EF",
        foreground: "#24312D",
        kaushal: {
          bg: "#F7F5EF",
          surface: "#FFFDF8",
          secondary: "#F1EDE3",
          border: "#E7E2D6",
          text: {
            primary: "#24312D",
            secondary: "#66736D",
            muted: "#8C9893",
          },
          action: {
            DEFAULT: "#3D5F58",
            hover: "#304D47",
            active: "#253C37",
            light: "#EAF1EF",
            text: "#FFFFFF",
          },
          accent: {
            DEFAULT: "#D99A3D",
            light: "#FDF5E9",
            dark: "#B87F28",
            text: "#FFFFFF",
          },
        },
      },

      borderRadius: {
        "clay-sm": "14px",
        "clay-md": "20px",
        "clay-lg": "28px",
        "clay-xl": "36px",
        "clay-pill": "9999px",
      },
      boxShadow: {
        "clay-card": "8px 12px 24px rgba(160, 150, 135, 0.22), -6px -6px 16px #FFFFFF, inset 2px 2px 4px rgba(255, 255, 255, 0.95), inset -2px -2px 4px rgba(160, 150, 135, 0.12)",
        "clay-elevated": "12px 18px 32px rgba(160, 150, 135, 0.28), -8px -8px 20px #FFFFFF, inset 2.5px 2.5px 5px rgba(255, 255, 255, 0.98), inset -2.5px -2.5px 5px rgba(160, 150, 135, 0.14)",
        "clay-btn-primary": "6px 9px 18px rgba(61, 95, 88, 0.32), -4px -4px 12px #FFFFFF, inset 2px 2px 4px rgba(255, 255, 255, 0.45), inset -2px -2px 4px rgba(37, 60, 55, 0.35)",
        "clay-btn-secondary": "6px 8px 16px rgba(160, 150, 135, 0.2), -4px -4px 12px #FFFFFF, inset 2px 2px 4px rgba(255, 255, 255, 0.95), inset -2px -2px 4px rgba(160, 150, 135, 0.14)",
        "clay-inset": "inset 4px 4px 8px rgba(160, 150, 135, 0.24), inset -3px -3px 6px rgba(255, 255, 255, 0.95)",
        "clay-pill": "4px 6px 14px rgba(160, 150, 135, 0.18), -3px -3px 8px #FFFFFF, inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.9), inset -1.5px -1.5px 3px rgba(160, 150, 135, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;

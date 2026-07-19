import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        booking: {
          blue: "#003580",
          "blue-light": "#006ce4",
          yellow: "#febb02",
          "yellow-hover": "#f2a900",
        },
        ops: {
          primary: "#1e3a8a",
          accent: "#a16207",
          bg: "#f8fafc",
          surface: "#ffffff",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
        ops: ["Fira Sans", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      boxShadow: {
        booking: "0 2px 8px rgba(0, 53, 128, 0.08)",
        "booking-lg": "0 8px 24px rgba(0, 53, 128, 0.12)",
        ops: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

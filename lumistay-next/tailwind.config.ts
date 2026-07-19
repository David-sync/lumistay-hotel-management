import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        booking: {
          blue: "#183b35",
          "blue-light": "#285b4d",
          yellow: "#9a6a2f",
          "yellow-hover": "#805522",
        },
        ops: {
          primary: "#183b35",
          accent: "#9a6a2f",
          bg: "#f4f1eb",
          surface: "#fbfaf7",
          border: "#d8d2c7",
        },
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        sans: ["Source Sans 3", "system-ui", "sans-serif"],
        ops: ["Source Sans 3", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        booking: "0 2px 8px rgba(24, 59, 53, 0.08)",
        "booking-lg": "0 12px 30px rgba(24, 59, 53, 0.12)",
        ops: "0 1px 2px rgba(23, 33, 30, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

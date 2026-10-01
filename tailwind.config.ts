import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        cream: "#F3EEE6",
        accent: "#B08A5B",
        // Variante oscurecida del accent para texto pequeño sobre cream
        // (el accent original no alcanza AA 4.5:1; este sí).
        "accent-dark": "#7A5A33",
        white: "#FFFFFF",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"],
        figtree: [
          "var(--font-figtree)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#12151C",
        ink: "#12151C",
        surface: "#181C25",
        "surface-container": "#181C25",
        "surface-container-low": "#151821",
        "surface-container-high": "#202531",
        "surface-container-highest": "#282E3C",
        on: "#ECEEF3",
        "text-primary": "#ECEEF3",
        "on-surface": "#ECEEF3",
        "on-surface-variant": "#8A93A3",
        "text-muted": "#8A93A3",
        primary: "#D99A4E",
        "primary-glow": "rgba(217, 154, 78, 0.25)",
        verdigris: "#6FA88C",
        "verdigris-glow": "rgba(111, 168, 140, 0.25)",
        amber: "#D99A4E",
        error: "#FF6B6B",
        "error-container": "#3A1B1B",
        hairline: "#2B303B",
        outline: "#2B303B",
        "outline-variant": "#1F232D"
      },
      fontFamily: {
        headline: ["Newsreader", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"]
      },
      boxShadow: {
        'glow-amber': '0 0 25px rgba(217, 154, 78, 0.15)',
        'glow-verdigris': '0 0 25px rgba(111, 168, 140, 0.15)',
        'futuristic': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}

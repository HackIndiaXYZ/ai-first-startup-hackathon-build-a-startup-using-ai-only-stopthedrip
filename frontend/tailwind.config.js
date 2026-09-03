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
        background: "#FAF9F6",
        surface: "#FAF9F6",
        "surface-container": "#F4F1EA",
        "surface-container-low": "#F8F6F0",
        "surface-container-high": "#EFECE4",
        on: "#1C1B19",
        "on-surface": "#1C1B19",
        "on-surface-variant": "#8A8478",
        primary: "#2C5F4F",
        "primary-container": "#E3ECE8",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#17342B",
        error: "#A63D2F",
        "error-container": "#FADBD8",
        outline: "#DDD8CC",
        "outline-variant": "#EFECE4"
      },
      fontFamily: {
        headline: ["Newsreader", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Inter", "monospace"]
      }
    },
  },
  plugins: [],
}

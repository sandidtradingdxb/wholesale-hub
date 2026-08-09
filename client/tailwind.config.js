/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        slate: {
          850: "#16202F",
        },
        paper: "#F6F4EF",
        copper: {
          DEFAULT: "#C9862A",
          light: "#E0A857",
        },
        teal: {
          DEFAULT: "#2F8577",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

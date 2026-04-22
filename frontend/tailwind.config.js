/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0f172a",
        primary: "#6366f1",
        secondary: "#a855f7",
        accent: "#f43f5e",
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        dark: "#1F2937",
        light: "#F3F4F6",
      },
    },
  },
  plugins: [],
}
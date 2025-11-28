/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Point Tailwind to all your component and page files
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial for React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
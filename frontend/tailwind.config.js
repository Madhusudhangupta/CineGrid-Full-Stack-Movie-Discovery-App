/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include JS/JSX/TS/TSX files
    './src/**/*.css', // Include CSS files like globals.css
    './index.html',
  ],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};
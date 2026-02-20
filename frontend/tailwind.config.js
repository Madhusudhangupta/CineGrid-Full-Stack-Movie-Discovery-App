/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Use class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Include JS/JSX/TS/TSX files
    // './src/**/*.css', // Include CSS files like globals.css
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
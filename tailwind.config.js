/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quiz: {
          purpleDark: '#2e0854',
          purple: '#7e22ce',
          purpleLight: '#f3e8ff',
          yellow: '#eab308',
          yellowBright: '#facc15',
          yellowLight: '#fef08a',
          accent: '#ec4899',
          dark: '#1e0836'
        }
      },
      fontFamily: {
        sans: ['"Fredoka"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}

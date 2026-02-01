/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teb: {
          blue: '#0F4496',    // Główny granat
          dark: '#0a3270',    // Hover granatu
          accent: '#3A8DDE',  // Jasny niebieski
        },
        slate: {
          50: '#F8FAFC',      // Tło aplikacji
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
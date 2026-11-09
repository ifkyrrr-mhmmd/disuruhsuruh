/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Sunset Orange primary
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        forest: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857', // Forest Green WhatsApp
          800: '#065f46',
        },
        charcoal: {
          50: '#f8fafc',
          100: '#f1f5f9',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Deep Charcoal
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

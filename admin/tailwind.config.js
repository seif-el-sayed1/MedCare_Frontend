/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          500: '#14B8A6', 
          600: '#0d9488',
          700: '#0f766e', 
          950: '#022c22',
        },
        secondary: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: '#0EA5E9', 
          600: '#0284c7',
        },
        tertiary: {
          400: '#94a3b8',
          500: '#64748B', 
          600: '#475569',
          900: '#0f172a', 
        },
        neutralSurface: {
          50:  '#F8FAFC',
          100: '#f1f5f9',
        }
      },
      fontFamily: {
        sans:   ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
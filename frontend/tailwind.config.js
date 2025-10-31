/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Azul educativo principal
          700: '#1d4ed8', // Azul rey
          800: '#1e40af',
          900: '#1e3a8a',
        },
        navy: {
          50: '#e8ecf4',
          100: '#c5d0e0',
          200: '#9fb0c9',
          300: '#7990b2',
          400: '#5d79a1',
          500: '#416290',
          600: '#395881',
          700: '#2f4d6e',
          800: '#25415c',
          900: '#163042', // Azul rey profundo
        },
      },
    },
  },
  plugins: [],
}


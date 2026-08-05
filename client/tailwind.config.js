/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neuro: {
          orange: '#f97316',
          'orange-light': '#fff7ed',
          dark: '#1a1a1a',
          gray: '#6b7280',
          bg: '#fafafa',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'active-job': '0 12px 24px -8px rgba(249, 115, 22, 0.15)',
        'soft-glow': '0 20px 30px -10px rgba(249, 115, 22, 0.12)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}

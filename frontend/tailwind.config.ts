import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#f5efe6',
        ink: '#1f1a17',
        bronze: '#b77954',
        rose: '#e7c7c0',
        moss: '#5f6f52',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(31, 26, 23, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config

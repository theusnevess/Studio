import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta principal inspirada na marca do studio:
        // rosa principal, rosa suave, grafite, off-white e laranja quente.
        brand: {
          blush: '#f8d7df',
          rose: '#ea4c89',
          berry: '#c62f6f',
          ink: '#20151c',
          graphite: '#43313d',
          cream: '#fff9f7',
          mist: '#fff1f4',
          amber: '#f2a65a',
          peach: '#f7c68b',
          border: '#f0dce3',
        },
      },
      fontFamily: {
        sans: ['"Trebuchet MS"', '"Segoe UI"', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        soft: '0 20px 48px rgba(47, 20, 34, 0.10)',
        panel: '0 24px 60px rgba(56, 22, 38, 0.14)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(234, 76, 137, 0.16), transparent 28%)',
      },
    },
  },
  plugins: [],
} satisfies Config

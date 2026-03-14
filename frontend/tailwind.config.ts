import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          rose: '#E24B84',
          amber: '#ED9F47',
          ink: '#E8E4EC',
          panel: '#1A1720',
          graphite: '#9B8FA3',
          cream: '#F5F0F8',
          mist: '#252230',
          border: 'rgba(255,255,255,0.08)',
          blush: '#2A1F2E',
          berry: '#B63A66',
          paper: '#0F0D13',
          surface: '#1A1720',
          'surface-raise': '#252230',
          'surface-high': '#302C3A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 32px rgba(226, 75, 132, 0.08)',
        panel: '0 24px 64px rgba(0, 0, 0, 0.3)',
        glow: '0 0 48px rgba(226, 75, 132, 0.12)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(226, 75, 132, 0.08), transparent 42%)',
        'glow-amber':
          'radial-gradient(circle at bottom right, rgba(237, 159, 71, 0.08), transparent 44%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-soft': 'floatSoft 8s ease-in-out infinite',
        'float-delayed': 'floatSoft 10s ease-in-out infinite 1.2s',
        shimmer: 'shimmer 6s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
        bloom: 'bloom 4s ease-in-out infinite alternate',
        'bloom-delayed': 'bloom 5s ease-in-out infinite alternate 1.5s',
        sway: 'sway 7s ease-in-out infinite',
        'sway-slow': 'sway 9s ease-in-out infinite 2s',
        twinkle: 'twinkle 2.5s ease-in-out infinite',
        'twinkle-delayed': 'twinkle 3s ease-in-out infinite 0.8s',
        drift: 'drift 12s ease-in-out infinite',
        'draw-line': 'drawLine 3s ease-in-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        drawStroke: {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
        bloom: {
          '0%': { transform: 'scale(0.85) rotate(-5deg)', opacity: '0.5' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg) translateX(0)' },
          '25%': { transform: 'rotate(2deg) translateX(4px)' },
          '75%': { transform: 'rotate(-2deg) translateX(-3px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) translateX(5px) rotate(10deg)' },
          '66%': { transform: 'translateY(4px) translateX(-3px) rotate(-5deg)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '200', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

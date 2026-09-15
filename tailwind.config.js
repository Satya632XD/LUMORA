/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aurora: {
          bg: '#06131f',
          surface: 'rgba(12, 33, 53, 0.7)',
          accent: '#2dd4bf',
          secondary: '#38bdf8',
          glow: 'rgba(45, 212, 191, 0.4)',
        },
        crystal: {
          bg: '#0b1120',
          surface: 'rgba(30, 41, 59, 0.65)',
          accent: '#67e8f9',
          secondary: '#c084fc',
          glow: 'rgba(103, 232, 249, 0.35)',
        },
        midnight: {
          bg: '#05070f',
          surface: 'rgba(15, 23, 42, 0.75)',
          accent: '#818cf8',
          secondary: '#a78bfa',
          glow: 'rgba(129, 140, 248, 0.3)',
        },
        zen: {
          bg: '#141814',
          surface: 'rgba(31, 38, 31, 0.75)',
          accent: '#86efac',
          secondary: '#ca8a04',
          glow: 'rgba(134, 239, 172, 0.3)',
        },
        royal: {
          bg: '#0d0914',
          surface: 'rgba(28, 20, 44, 0.75)',
          accent: '#fbbf24',
          secondary: '#f43f5e',
          glow: 'rgba(251, 191, 36, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pop': 'pop 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shimmer': 'shimmer 2.5s infinite',
        'glow-spin': 'glowSpin 12s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.82)', opacity: '0.6' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};

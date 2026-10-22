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
        deep: {
          950: '#050811',
          900: '#080E1E',
          850: '#0C152B',
          800: '#111D3B',
          750: '#17274E',
          700: '#1F3366',
        },
        tan: {
          50: '#FDFBF7',
          100: '#F7F2EA',
          200: '#EFE5D5',
          300: '#E5D1B8',
          400: '#E0A96D',
          500: '#D4A373',
          600: '#C58C58',
          700: '#A46E3E',
          800: '#7F522C',
        },
        shield: {
          cyan: '#00F2FE',
          emerald: '#10B981',
          crimson: '#F43F5E',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glow-tan': '0 0 25px -5px rgba(224, 169, 109, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-crimson': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(100%)', opacity: '0.2' },
        }
      }
    },
  },
  plugins: [],
}

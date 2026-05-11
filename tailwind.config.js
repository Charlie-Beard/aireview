/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sol: {
          base03: '#002B36',
          base02: '#073642',
          base01: '#586E75',
          base00: '#657B83',
          base0:  '#839496',
          base1:  '#93A1A1',
          base2:  '#EEE8D5',
          base3:  '#FDF6E3',
          yellow:  '#B58900',
          orange:  '#CB4B16',
          red:     '#DC322F',
          magenta: '#D33682',
          violet:  '#6C71C4',
          blue:    '#268BD2',
          cyan:    '#2AA198',
          green:   '#859900',
        },
        warm: {
          50:  '#FDFAF4',
          100: '#FAF7EF',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#D9CEBF',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-med':  'floatMed 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'scan':       'scan 2s linear infinite',
        shimmer:      'shimmer 2.5s linear infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(-18px) rotate(1deg)' },
        },
        floatMed: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(-12px) rotate(-1deg)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        glass:    '0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'glass-lg': '0 8px 48px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        warm:     '0 4px 24px rgba(181,137,0,0.12)',
        blue:     '0 4px 24px rgba(38,139,210,0.18)',
        cyan:     '0 4px 24px rgba(42,161,152,0.18)',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Serif para headers ejecutivos, sans para body denso
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        eva: {
          // Paleta principal — inspirada en consulting firms premium
          charcoal: '#1a1a1a',
          ink: '#2d2d2d',
          graphite: '#404040',
          warm: '#6b6b5e',
          stone: '#8a8a7a',
          sand: '#b8b4a4',
          cream: '#f5f0e8',
          parchment: '#faf8f4',
          white: '#fefdfb',
          
          // Accent — olive profesional
          olive: '#4a5c3a',
          'olive-light': '#6b7d5a',
          'olive-muted': '#8a9c7a',
          
          // Servicios
          foundation: '#c05538',
          'foundation-light': '#f0997b',
          'foundation-bg': '#faf0ec',
          architecture: '#534ab7',
          'architecture-light': '#afa9ec',
          'architecture-bg': '#f0eff8',
          sentinel: '#0f6e56',
          'sentinel-light': '#5dcaa5',
          'sentinel-bg': '#e8f5ee',
          
          // Status
          success: '#3b6d11',
          warning: '#ba7517',
          danger: '#a32d2d',
          info: '#185fa5',
        },
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'badge': '6px',
        'pill': '999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)',
        'modal': '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
        'glass': '0 2px 16px rgba(0,0,0,0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'number': 'countUp 0.6s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { '0%': { opacity: '0', transform: 'translateX(-8px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseSubtle: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
};

export default config;

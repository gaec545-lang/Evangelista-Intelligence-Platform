import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eva: {
          black: 'rgb(var(--eva-black) / <alpha-value>)',
          'black-2': 'rgb(var(--eva-black-2) / <alpha-value>)',
          'black-3': 'rgb(var(--eva-black-3) / <alpha-value>)',
          olive: 'rgb(var(--eva-olive) / <alpha-value>)',
          'olive-2': 'rgb(var(--eva-olive-2) / <alpha-value>)',
          'olive-3': 'rgb(var(--eva-olive-3) / <alpha-value>)',
          'olive-light': 'rgb(var(--eva-olive-light) / <alpha-value>)',
          beige: 'rgb(var(--eva-beige) / <alpha-value>)',
          'beige-2': 'rgb(var(--eva-beige-2) / <alpha-value>)',
          'beige-3': 'rgb(var(--eva-beige-3) / <alpha-value>)',
          gold: 'rgb(var(--eva-gold) / <alpha-value>)',
          'gold-2': 'rgb(var(--eva-gold-2) / <alpha-value>)',
          'gold-light': 'rgb(var(--eva-gold-light) / <alpha-value>)',
          border: 'var(--eva-border)',
          'border-2': 'var(--eva-border-2)',
          'txt-dark': 'var(--eva-txt-dark)',
          'txt-mid': 'var(--eva-txt-mid)',
          'txt-muted': 'var(--eva-txt-muted)',
          'txt-faint': 'var(--eva-txt-faint)',
        },
        cream: '#F5F5F7',
        foundation: '#b04a30',
        architecture: '#4a42a3',
        sentinel: '#0d614d',
        service: {
          foundation: '#b04a30',
          architecture: '#4a42a3',
          sentinel: '#0d614d',
        },
        primary: {
          50: '#f0f4ec',
          100: '#e1ead9',
          200: '#c3d5b3',
          300: '#a5c08d',
          400: '#87ab67',
          500: '#3e4d32', // eva-olive
          600: '#323e29',
          700: '#252f1f',
          800: '#191f15',
          900: '#0c100a',
        },
        secondary: {
          50: '#fefaf0',
          100: '#fdf5e1',
          200: '#fbebc3',
          300: '#fae1a5',
          400: '#f8d787',
          500: '#b89a42', // eva-gold
        },
        content: {
          primary: '#12120f',
          secondary: '#707060',
          tertiary: '#a8a898',
        },
        surface: {
          canvas: '#f9f7f2',
          card: '#ffffff',
          border: '#e1ddd1',
        }
      },
      fontFamily: {
        brand: ['Lora', 'serif'],
        ui: ['Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '24px',
        'card-xl': '32px',
        'card-2xl': '40px',
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;

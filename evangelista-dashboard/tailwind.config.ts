import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Evangelista brand — olive/cream/charcoal
        primary: {
          50:  '#F1F5EB',
          100: '#E2EBD7',
          200: '#C5D7AF',
          300: '#A8C387',
          400: '#8AAF5F',
          500: '#4A5C3A',  // Evangelista Olive
          600: '#3D4C30',
          700: '#2F3C26',
          800: '#222B1B',
          900: '#141A11',
        },
        surface: {
          DEFAULT: '#FAFAF8',  // Subtler cream — almost white
          card:  '#FFFFFF',
          hover: '#F5F2EE',    // Warm hover
          border:'#E8E4DE',    // Warm border
          divider:'#E8E4DE',
        },
        content: {
          primary:   '#2C2C2A',  // Charcoal
          secondary: '#6B6B68',
          tertiary:  '#9A9690',  // Warm gray
          inverse:   '#FFFFFF',
        },
        accent: {
          gold: '#B8963E',
          red:  '#A33D3D',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['JetBrains Mono', 'menlo', 'monospace'],
      },
      fontSize: {
        // Tighter UI scale
        'xs':   ['0.6875rem', { lineHeight: '1rem' }],       // 11px
        'sm':   ['0.8125rem', { lineHeight: '1.25rem' }],    // 13px
        'base': ['0.875rem',  { lineHeight: '1.5rem' }],     // 14px
        'lg':   ['1rem',      { lineHeight: '1.5rem' }],     // 16px
        'xl':   ['1.125rem',  { lineHeight: '1.75rem' }],    // 18px
        '2xl':  ['1.375rem',  { lineHeight: '1.75rem' }],    // 22px
        '3xl':  ['1.75rem',   { lineHeight: '2rem' }],       // 28px
        '4xl':  ['2.25rem',   { lineHeight: '2.5rem' }],     // 36px
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
      },
      borderRadius: {
        'card':   '12px',
        'button': '8px',
        'badge':  '6px',
        'input':  '10px',
      },
      boxShadow: {
        'card':       '0 1px 2px 0 rgba(0, 0, 0, 0.025), 0 1px 1px 0 rgba(0, 0, 0, 0.015)',
        'card-hover': '0 4px 8px -1px rgba(0, 0, 0, 0.05), 0 2px 2px -2px rgba(0, 0, 0, 0.04)',
        'dropdown':   '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'modal':      '0 24px 80px -16px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      transitionTimingFunction: {
        'bounce-sm': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
} satisfies Config

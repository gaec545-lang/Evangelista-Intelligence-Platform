import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ════════════════════════════════════════════
        // Apple Dark Canvas
        // ════════════════════════════════════════════
        canvas: {
          DEFAULT:  '#0D0D0F',  // Deep dark background
          elevated: '#151518',  // Elevated surface (lighter)
          raised:   '#1C1C1E',  // Card / elevated layer
          surface:  '#2C2C2E',  // Raised element
        },
        // ════════════════════════════════════════════
        // Evangelista Olive (adapted for dark)
        // ════════════════════════════════════════════
        primary: {
          50:  '#1A2010',
          100: '#2A3520',
          200: '#3D4D2F',
          300: '#50663E',
          400: '#7C9C62',
          500: '#95B877',  // Base olive — visible on dark
          600: '#A8CC8D',  // Hover
          700: '#BCDEA6',
          800: '#D0F0BF',
          900: '#E5FAD8',
        },
        // ════════════════════════════════════════════
        // Surface aliases → dark glass tokens
        // These bridge old component references → dark theme
        // ════════════════════════════════════════════
        surface: {
          DEFAULT:  '#0D0D0F',              // Main background
          card:     'rgba(255,255,255,0.05)',   // Glass card bg
          hover:    'rgba(255,255,255,0.07)',   // Hover state
          border:   'rgba(255,255,255,0.08)',   // Border color
          divider:  'rgba(255,255,255,0.06)',   // Divider line
        },
        // ════════════════════════════════════════════
        // Text aliases → Apple dark text palette
        // ════════════════════════════════════════════
        content: {
          primary:   '#F5F5F7',
          secondary: '#A1A1A6',
          tertiary:  '#636366',
          inverse:   '#0D0D0F',
        },
        // ════════════════════════════════════════════
        // Glass Surfaces (Apple-style)
        // ════════════════════════════════════════════
        glass: {
          subtle:  'rgba(255,255,255,0.03)',
          DEFAULT: 'rgba(255,255,255,0.05)',
          strong:  'rgba(255,255,255,0.08)',
          active:  'rgba(149,184,119,0.12)',  // Olive glass
        },
        // ════════════════════════════════════════════
        // Evangelista Accents
        // ════════════════════════════════════════════
        accent: {
          gold: '#D4A843',
          red:  '#FF6B6B',
        },
        // ════════════════════════════════════════════
        // Borders
        // ════════════════════════════════════════════
        border: {
          subtle: 'rgba(255,255,255,0.04)',
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.12)',
          active: 'rgba(149,184,119,0.30)',
        },
        // ════════════════════════════════════════════
        // Status colors — dark theme tints
        // ════════════════════════════════════════════
        success: { light: 'rgba(48,209,88,0.15)', DEFAULT: '#30D158', dark: '#34C759' },
        warning: { light: 'rgba(255,214,10,0.15)', DEFAULT: '#FFD60A', dark: '#FF9F0A' },
        danger:  { light: 'rgba(255,69,58,0.15)',  DEFAULT: '#FF453A', dark: '#FF3B30' },
        info:    { light: 'rgba(100,210,255,0.15)',DEFAULT: '#64D2FF', dark: '#5AC8FA' },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'xs':  ['0.6875rem', { lineHeight: '1rem' }],    // 11px
        'sm':  ['0.75rem',    { lineHeight: '1.25rem' }], // 12px
        'base':['0.8125rem',  { lineHeight: '1.375rem'}], // 13px
        'lg':  ['0.875rem',   { lineHeight: '1.5rem' }],  // 14px — body
        'xl':  ['1rem',       { lineHeight: '1.5rem' }],  // 16px
        '2xl': ['1.25rem',    { lineHeight: '1.75rem'}],  // 20px
        '3xl': ['1.5rem',     { lineHeight: '2rem' }],    // 24px
        '4xl': ['1.875rem',   { lineHeight: '2.25rem'}],  // 30px
      },
      borderRadius: {
        'card':   '14px',
        'button': '10px',
        'badge':  '8px',
        'input':  '10px',
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.2),  0 0 0 1px rgba(255,255,255,0.08)',
        'glass':      '0 4px 24px rgba(0,0,0,0.24), 0 0 0 1px rgba(255,255,255,0.05)',
        'glass-lg':   '0 8px 32px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.08)',
        'elevated':   '0 16px 48px rgba(0,0,0,0.48)',
        'olive-glow': '0 0 0 1px rgba(149,184,119,0.25), 0 0 20px rgba(149,184,119,0.10)',
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '28':  '7rem',
      },
      animation: {
        'fade-in':   'fadeIn 0.35s ease-out',
        'slide-up':  'slideUp 0.3s ease-out',
        'shimmer':   'shimmer 3s ease-in-out infinite',
        'pulse-soft':'pulseSoft 3s ease-in-out infinite',
        'scale-in':  'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)', filter: 'blur(3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)',      filter: 'blur(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        'glass': '20px',
        'heavy': '40px',
      },
      backgroundImage: {
        'canvas-glow':  'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(149,184,119,0.08) 0%, transparent 60%)',
        'shimmer-strip': 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.03) 37%, transparent 63%)',
      },
    },
  },
  plugins: [],
} satisfies Config

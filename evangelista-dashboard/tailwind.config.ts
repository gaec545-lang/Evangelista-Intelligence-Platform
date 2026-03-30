import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'eva-cream': '#F5F0E8',
        'eva-olive': '#4A5C3A',
        'eva-olive-light': '#6B7D5A',
        'eva-charcoal': '#2C2C2A',
        'eva-warm-gray': '#8A8680',
        'eva-gold': '#B8963E',
        'eva-red': '#A33D3D',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

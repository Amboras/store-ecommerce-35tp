import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        lime: {
          50: 'hsl(var(--lime-50))',
          100: 'hsl(var(--lime-100))',
          200: 'hsl(var(--lime-200))',
          300: 'hsl(var(--lime-300))',
          400: 'hsl(var(--lime-400))',
          500: 'hsl(var(--lime-500))',
          600: 'hsl(var(--lime-600))',
          700: 'hsl(var(--lime-700))',
        },
      },
      backgroundImage: {
        'lime-gradient': 'linear-gradient(160deg, hsl(var(--lime-300)), hsl(var(--lime-400)) 55%, hsl(var(--lime-500)))',
        'lime-radial': 'radial-gradient(ellipse at top, hsl(var(--lime-200) / 0.6), transparent 60%)',
        'ink-gradient': 'linear-gradient(180deg, hsl(var(--foreground)), hsl(150 15% 16%))',
      },
      boxShadow: {
        'premium': '0 1px 2px hsl(150 15% 8% / 0.04), 0 8px 24px hsl(150 15% 8% / 0.06)',
        'premium-lg': '0 2px 4px hsl(150 15% 8% / 0.05), 0 24px 48px hsl(150 15% 8% / 0.10)',
        'lime-glow': '0 8px 32px hsl(var(--lime-400) / 0.35)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
      },
      maxWidth: {
        'content': '1280px',
      },
      spacing: {
        'section': '6rem',
        'section-sm': '3rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy (keep for backward compat)
        midnight: '#0A0F1E',
        indigo: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#6366F1',
        },
        // Brand tokens
        brand: '#5D4FE0',
        'brand-light': '#7C3AED',
        'brand-dark': '#4338CA',
        ink: '#0A0F1E',
        body: '#475569',
        muted: '#64748B',
        subtle: '#94A3B8',
        'bg-paper': '#F8F7FA',
        'bg-lavender': '#F5F3FA',
        surface: '#F1F5F9',
      },
      boxShadow: {
        card: '0 4px 20px -8px rgba(10,15,30,0.08)',
        'card-hover': '0 8px 30px -8px rgba(93,79,224,0.2)',
        float: '0 20px 60px -15px rgba(10,15,30,0.2)',
        cta: '0 4px 20px -4px rgba(93,79,224,0.5), 0 1px 2px rgba(93,79,224,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        scroll: 'scroll 35s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

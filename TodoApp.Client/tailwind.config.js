/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: 'var(--color-ink-900)',
          700: 'var(--color-ink-700)',
          500: 'var(--color-ink-500)',
        },
        mint: {
          600: 'var(--color-mint-600)',
          500: 'var(--color-mint-500)',
        },
        amber: {
          500: 'var(--color-amber-500)',
        },
        sand: {
          50: 'var(--color-sand-50)',
        },
        card: 'var(--color-card)',
        surface: 'var(--color-surface)',
        hero: 'var(--color-hero)',
        stroke: 'var(--color-stroke)',
        danger: {
          600: 'var(--color-danger-600)',
          700: 'var(--color-danger-700)',
        },
      },

      boxShadow: {
        card: 'var(--shadow-card)',
        cta: 'var(--shadow-cta)',
        focus: 'var(--shadow-focus)',
        panel: 'var(--shadow-panel)',
        'danger-focus': 'var(--shadow-danger-focus)'
      },

      fontFamily: {
        sans: 'var(--font-sans)',
        display: 'var(--font-display)'
      },
    }
  },
  plugins: []
};

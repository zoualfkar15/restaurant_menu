import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Arabic-friendly stack used by the public menu / ordering experience.
        menu: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // SaaS marketing / dashboard brand (unchanged).
        brand: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f19440',
          500: '#ed761a',
          600: '#de5c10',
          700: '#b84410',
          800: '#933615',
          900: '#772f14',
          950: '#401508',
        },
        // Overridable per restaurant via `--primary-*` (space-separated RGB).
        primary: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
          950: 'rgb(var(--primary-950) / <alpha-value>)',
        },
        // Neutral surfaces & text for the menu experience.
        menu: {
          surface: '#f7f7f5',
          'surface-elevated': '#ffffff',
          'surface-muted': '#f1f1ee',
          ink: '#202124',
          'ink-secondary': '#5f6368',
          'ink-muted': '#777777',
          border: '#e8e8e4',
          'border-strong': '#d6d6d0',
          accent: '#d97706',
          'accent-soft': '#fff7e6',
        },
      },
      boxShadow: {
        'menu-sm': '0 1px 2px 0 rgb(32 33 36 / 0.04), 0 1px 3px -1px rgb(32 33 36 / 0.05)',
        'menu-md': '0 4px 14px -4px rgb(32 33 36 / 0.08), 0 2px 6px -2px rgb(32 33 36 / 0.04)',
        'menu-lg': '0 16px 40px -12px rgb(32 33 36 / 0.16), 0 6px 16px -8px rgb(32 33 36 / 0.08)',
        'menu-glow': '0 0 0 1px rgb(237 118 26 / 0.15), 0 8px 24px -6px rgb(237 118 26 / 0.2)',
        'primary-glow': '0 8px 24px -8px rgb(var(--primary-600) / 0.45)',
        'menu-top': '0 -8px 30px -12px rgb(32 33 36 / 0.18)',
      },
      screens: {
        xs: '400px',
      },
    },
  },
  plugins: [],
};

export default config;

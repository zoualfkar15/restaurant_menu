import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
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
        menu: {
          surface: '#fdfcfa',
          'surface-elevated': '#ffffff',
          'surface-muted': '#f7f5f2',
          ink: '#1c1917',
          'ink-secondary': '#57534e',
          'ink-muted': '#78716c',
          border: '#e7e5e4',
          'border-strong': '#d6d3d1',
          accent: '#c2410c',
          'accent-soft': '#fff7ed',
        },
      },
      boxShadow: {
        'menu-sm': '0 1px 2px 0 rgb(41 37 36 / 0.04), 0 1px 3px -1px rgb(41 37 36 / 0.04)',
        'menu-md': '0 4px 12px -2px rgb(41 37 36 / 0.06), 0 2px 6px -2px rgb(41 37 36 / 0.04)',
        'menu-lg': '0 12px 32px -8px rgb(41 37 36 / 0.1), 0 4px 12px -4px rgb(41 37 36 / 0.06)',
        'menu-glow': '0 0 0 1px rgb(237 118 26 / 0.15), 0 8px 24px -6px rgb(237 118 26 / 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;

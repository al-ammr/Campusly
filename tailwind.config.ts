import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Base brand tokens
        brand: {
          DEFAULT: 'var(--color-brand)',
          strong: 'var(--color-brand-strong)',
          dark: '#FF8A4C',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: '#4E6450',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: '#F5C864',
          dark: '#F2A900',
        },
        ink: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          dark: '#F6EDE3',
          'muted-dark': '#B8AA9E',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          container: 'var(--color-surface-container)',
          raised: 'var(--color-raised)',
          dark: '#16120F',
          'container-dark': '#231D19',
          'raised-dark': '#2E2621',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          dark: '#3A322C',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          dark: '#5FBF85',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          dark: '#FF8A80',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          dark: '#7AA7FF',
        },
        focusRing: {
          DEFAULT: 'var(--color-focus-ring)',
          dark: '#7AA7FF',
        },

        // Tuscan Academic Heritage Named Tokens
        terracotta: {
          DEFAULT: '#9F3C16',
          deep: '#A8431F',
          hover: '#822801',
          dark: '#FF8A4C',
        },
        'cypress-green': {
          DEFAULT: '#2C402E',
          light: '#4A634E',
          dark: '#4E6450',
        },
        sand: {
          DEFAULT: '#F7F5EA',
          light: '#FFFFF0',
          dark: '#E5E1D5',
          'light-dark': '#231D19',
        },
        'canvas-dark': '#16120F',
        'berry-red': {
          DEFAULT: '#BA1A1A',
          dark: '#FF8A80',
        },
        'warm-ochre': '#E8B53D',
        'footer-brown': '#7B2E10',
        'rich-brown': '#7B2E10',

        background: {
          DEFAULT: '#FFFFF0',
          dark: '#16120F',
        },
        raised: {
          DEFAULT: '#FFFFF0',
          dark: '#2E2621',
        },

        'verified-green': '#2B6E3F',
        'verified-tint': '#E4F3EA',
        'verified-darkBg': '#223324',

        // Category Palette Tokens
        'cat-tech': {
          tint: '#E6EEFC',
          ink: '#1D4FA8',
          darkBg: '#212E4B',
        },
        'cat-business': {
          tint: '#FFE9A8',
          ink: '#6B4E00',
          darkBg: '#3C2E10',
        },
        'cat-sustain': {
          tint: '#E4F3EA',
          ink: '#1F5C38',
          darkBg: '#223324',
        },
        'cat-academic': {
          tint: '#E7E3FA',
          ink: '#4B3B9A',
          darkBg: '#312846',
        },
        'cat-lead': {
          tint: '#FCE7DB',
          ink: '#9A3412',
          darkBg: '#4D2517',
        },
        'cat-creative': {
          tint: '#FBE3F0',
          ink: '#9C2A66',
          darkBg: '#4D2234',
        },
        'cat-culture': {
          tint: '#F3E6D4',
          ink: '#6B4220',
          darkBg: '#3C2A1B',
        },
        'cat-sports': {
          tint: '#DDF3F3',
          ink: '#0F5F63',
          darkBg: '#1C3433',
        },
        'cat-science': {
          tint: '#E8ECD9',
          ink: '#4A5A12',
          darkBg: '#313217',
        },
        'cat-health': {
          tint: '#FDE4E4',
          ink: '#A12A2A',
          darkBg: '#4F221F',
        },
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        serif: ['"DM Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      fontSize: {
        // Defined locked type scale tokens
        display: [
          'clamp(2rem, 5vw, 2.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h1: [
          'clamp(1.75rem, 4vw, 2rem)',
          { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h2: [
          '1.5rem',
          { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        h3: [
          '1.25rem',
          { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'body-lg': [
          '1.125rem',
          { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' },
        ],
        body: [
          '1rem',
          { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' },
        ],
        'body-sm': [
          '0.875rem',
          { lineHeight: '1.45', letterSpacing: '0', fontWeight: '400' },
        ],
        label: [
          '0.8125rem',
          { lineHeight: '1.3', letterSpacing: '0.01em', fontWeight: '500' },
        ],
        caption: [
          '0.75rem',
          { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '500' },
        ],
        // Standard tailwind aliases constrained strictly to locked type scale
        xs: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '500' }],
        sm: ['0.875rem', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '400' }],
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        xl: ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        '3xl': ['clamp(1.75rem, 4vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        '4xl': ['clamp(2rem, 5vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      spacing: {
        'space-1': 'var(--space-1)',
        'space-2': 'var(--space-2)',
        'space-3': 'var(--space-3)',
        'space-4': 'var(--space-4)',
        'space-5': 'var(--space-5)',
        'space-6': 'var(--space-6)',
        'space-7': 'var(--space-7)',
        'space-8': '64px',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        none: 'none',
        xs: '0 1px 2px 0 rgba(31, 28, 24, 0.05)',
        sm: '0 1px 3px 0 rgba(31, 28, 24, 0.08)',
        md: '0 4px 12px 0 rgba(31, 28, 24, 0.12)',
        elevation0: 'var(--elevation-0)',
        elevation1: 'var(--elevation-1)',
        elevation2: 'var(--elevation-2)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '320ms',
      },
      zIndex: {
        base: '0',
        sticky: '10',
        nav: '20',
        sheet: '30',
        dialog: '40',
        toast: '50',
      },
    },
  },
  plugins: [],
};

export default config;

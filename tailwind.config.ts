import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // use class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        // semantic tokens for light/dark
        background: {
          DEFAULT: '#F9FAFB',
          dark: '#0B1220',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F1724',
        },
        muted: {
          DEFAULT: '#6B7280',
          dark: '#94A3B8',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#0F1724',
        },
        accent: {
          DEFAULT: '#0EA5A4', // teal (light mode primary accent)
          dark: '#059669', // darker teal for hover/active
        },
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
        'transform-smooth': 'transform',
      }
    },
  },
  plugins: [],
}
export default config

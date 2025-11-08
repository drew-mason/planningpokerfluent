import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/client/**/*.{js,jsx,ts,tsx}',
    './src/client/index.html',
  ],
  theme: {
    extend: {
      // Extended color palette using CSS custom properties
      colors: {
        // Theme-based colors
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          muted: 'var(--accent-muted)',
          glow: 'var(--accent-glow)',
          'selected-text': 'var(--accent-selected-text)',
        },
        // Text colors
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        // Legacy ServiceNow colors (keep for compatibility)
        'servicenow-blue': '#0066b3',
        'servicenow-dark': '#00253e',
        'poker-green': '#10b981',
        'poker-orange': '#f59e0b',
        'poker-purple': '#8b5cf6',
      },

      // Font families for sci-fi aesthetic
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },

      // Custom animations
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-lines': 'scan-lines 8s linear infinite',
        'lightsaber-swipe': 'lightsaber-swipe 0.6s ease-out',
      },

      // Animation keyframes
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px var(--accent-glow)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 40px var(--accent-glow)',
          },
        },
        'scan-lines': {
          '0%': {
            backgroundPosition: '0 0',
          },
          '100%': {
            backgroundPosition: '0 100%',
          },
        },
        'lightsaber-swipe': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '50%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },

      // Background images for theme aesthetics
      backgroundImage: {
        'voltron-rays': 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
        'scan-lines': 'repeating-linear-gradient(0deg, rgba(0, 217, 255, 0.03) 0px, rgba(0, 217, 255, 0.03) 1px, transparent 1px, transparent 2px)',
      },

      // Additional spacing and sizing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Letter spacing for headings
      letterSpacing: {
        'widest-plus': '0.3em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config

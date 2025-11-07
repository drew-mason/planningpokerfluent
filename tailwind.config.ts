import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/client/**/*.{js,jsx,ts,tsx}',
    './src/client/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'servicenow-blue': '#0066b3',
        'servicenow-dark': '#00253e',
        'poker-green': '#10b981',
        'poker-orange': '#f59e0b',
        'poker-purple': '#8b5cf6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config

import React from 'react'
import { useTheme } from '../providers/ThemeProvider'

/**
 * ThemeToggle Component
 *
 * Gradient slider with sun/moon icons that toggles between light and dark mode.
 * Visual feedback for current mode with smooth transitions.
 *
 * Usage:
 * <ThemeToggle />
 */
export function ThemeToggle() {
  const { mode, toggleMode } = useTheme()

  const isDark = mode === 'dark'

  return (
    <button
      onClick={toggleMode}
      className="theme-toggle-slider"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle thumb that slides left/right */}
      <span
        className="theme-toggle-thumb"
        style={{
          transform: isDark ? 'translateX(2rem)' : 'translateX(0.25rem)',
        }}
      >
        {/* Icon inside thumb */}
        <span className="flex items-center justify-center w-full h-full text-sm">
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>

      {/* Screen reader text */}
      <span className="sr-only">
        {isDark ? 'Dark mode active' : 'Light mode active'}
      </span>
    </button>
  )
}

export default ThemeToggle

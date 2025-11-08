import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'
import { useSound } from '../providers/SoundProvider'

/**
 * ThemeToggle Component
 *
 * Gradient slider with sun/moon icons that toggles between light and dark mode.
 * Visual feedback for current mode with smooth transitions.
 * Plays sound effect on toggle.
 *
 * Usage:
 * <ThemeToggle />
 */
export function ThemeToggle() {
  const { mode, toggleMode } = useTheme()
  const { play } = useSound()

  const isDark = mode === 'dark'

  const handleToggle = () => {
    play('modeSwitch')
    toggleMode()
  }

  return (
    <button
      onClick={handleToggle}
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
        <span className="flex items-center justify-center w-full h-full">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
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

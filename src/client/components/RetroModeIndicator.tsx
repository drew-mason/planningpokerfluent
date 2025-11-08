import React from 'react'
import { Tv } from 'lucide-react'
import { useRetroMode } from '../providers/RetroModeProvider'

/**
 * Retro Mode Indicator Component
 *
 * Small badge that appears in the top-right corner when retro mode is active.
 * Click to toggle retro mode off.
 *
 * Styled with:
 * - Green phosphor glow
 * - Monospace font
 * - Pulsing animation
 * - CRT monitor icon
 */
export function RetroModeIndicator() {
  const { isRetroMode, toggleRetroMode } = useRetroMode()

  // Only render when retro mode is active
  if (!isRetroMode) {
    return null
  }

  return (
    <div
      className="retro-mode-indicator"
      onClick={toggleRetroMode}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleRetroMode()
        }
      }}
      aria-label="Retro mode active. Click to deactivate."
    >
      <Tv size={16} />
      <span>RETRO MODE</span>
    </div>
  )
}

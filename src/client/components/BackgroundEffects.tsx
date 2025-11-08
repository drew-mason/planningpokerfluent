import React from 'react'
import { useTheme } from '../providers/ThemeProvider'
import './BackgroundEffects.css'

/**
 * BackgroundEffects Component
 *
 * Renders theme-aware background effects:
 * - Dark Mode: Animated scan lines (Tron CRT aesthetic)
 * - Light Mode: Radial gradient rays (Voltron aesthetic)
 *
 * Non-interactive, fixed positioning, low opacity
 */
export function BackgroundEffects() {
  const { mode } = useTheme()

  return (
    <div className="background-effects">
      {mode === 'dark' ? (
        <div className="tron-scanlines" aria-hidden="true" />
      ) : (
        <div className="voltron-rays" aria-hidden="true" />
      )}
    </div>
  )
}

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useKonamiCode } from '../hooks/useKonamiCode'
import { useSound } from './SoundProvider'

/**
 * Retro Mode Provider for MSM Planning Poker
 *
 * CRT-style overlay mode activated by typing "RETRO" anywhere in the app.
 * Applies vintage computer terminal aesthetics:
 * - Scanline overlay
 * - Green phosphor glow
 * - Monospace fonts (Courier New)
 * - Increased contrast
 *
 * Activated by keyboard sequence: R-E-T-R-O
 */

export interface RetroModeContextValue {
  isRetroMode: boolean
  setRetroMode: (enabled: boolean) => void
  toggleRetroMode: () => void
}

// localStorage key
const STORAGE_KEY = 'planningpoker_retro_mode'

// Create context
const RetroModeContext = createContext<RetroModeContextValue | undefined>(undefined)

/**
 * Hook to access retro mode context
 * Must be used within RetroModeProvider
 */
export function useRetroMode(): RetroModeContextValue {
  const context = useContext(RetroModeContext)
  if (!context) {
    throw new Error('useRetroMode must be used within a RetroModeProvider')
  }
  return context
}

/**
 * RetroModeProvider Component
 * Manages retro mode state and applies CSS class to document.body
 */
export function RetroModeProvider({ children }: { children: ReactNode }) {
  const { play } = useSound()

  // Initialize state from localStorage or default to false
  const [isRetroMode, setIsRetroMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'true'
  })

  /**
   * Set retro mode state
   */
  const setRetroMode = useCallback((enabled: boolean) => {
    setIsRetroMode(enabled)

    // Play sound effect when toggling
    if (enabled) {
      play('themeChange')
    }

    console.log(`RetroModeProvider: Retro mode ${enabled ? 'activated' : 'deactivated'}`)
  }, [play])

  /**
   * Toggle retro mode
   */
  const toggleRetroMode = useCallback(() => {
    setRetroMode(!isRetroMode)
  }, [isRetroMode, setRetroMode])

  /**
   * Listen for "RETRO" keyboard sequence
   */
  useKonamiCode({
    sequence: ['r', 'e', 't', 'r', 'o'],
    onSuccess: () => {
      setRetroMode(!isRetroMode) // Toggle when sequence detected
    },
  })

  /**
   * Apply/remove .retro-mode class to document.body
   */
  useEffect(() => {
    if (typeof document === 'undefined') return

    const body = document.body

    if (isRetroMode) {
      body.classList.add('retro-mode')
    } else {
      body.classList.remove('retro-mode')
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, String(isRetroMode))

    return () => {
      body.classList.remove('retro-mode')
    }
  }, [isRetroMode])

  // Create context value
  const contextValue: RetroModeContextValue = {
    isRetroMode,
    setRetroMode,
    toggleRetroMode,
  }

  return (
    <RetroModeContext.Provider value={contextValue}>
      {children}
    </RetroModeContext.Provider>
  )
}

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useKonamiCode } from '../hooks/useKonamiCode'
import { useSound } from './SoundProvider'

/**
 * DeLorean Mode Provider for MSM Planning Poker
 *
 * Back to the Future Easter egg with time circuit display.
 * Activated by typing "JOSHUA" (WarGames reference).
 *
 * Shows:
 * - Destination Time (Oct 21, 2015 04:29 PM)
 * - Present Time (Current date/time)
 * - Last Time Departed (Oct 26, 1985 01:21 AM)
 *
 * Displays amber LED-style time circuits in bottom-right corner.
 */

export interface DeloreanContextValue {
  isDeloreanMode: boolean
  setDeloreanMode: (enabled: boolean) => void
  toggleDeloreanMode: () => void
  showActivation: boolean
}

// Create context
const DeloreanContext = createContext<DeloreanContextValue | undefined>(undefined)

/**
 * Hook to access DeLorean mode context
 * Must be used within DeloreanProvider
 */
export function useDelorean(): DeloreanContextValue {
  const context = useContext(DeloreanContext)
  if (!context) {
    throw new Error('useDelorean must be used within a DeloreanProvider')
  }
  return context
}

/**
 * DeloreanProvider Component
 * Manages DeLorean mode state and activation animation
 */
export function DeloreanProvider({ children }: { children: ReactNode }) {
  const { play } = useSound()

  const [isDeloreanMode, setIsDeloreanModeState] = useState<boolean>(false)
  const [showActivation, setShowActivation] = useState<boolean>(false)

  /**
   * Set DeLorean mode state
   */
  const setDeloreanMode = useCallback((enabled: boolean) => {
    setIsDeloreanModeState(enabled)

    if (enabled) {
      // Show WarGames activation animation
      setShowActivation(true)
      play('reveal')

      // Hide activation after 3 seconds
      setTimeout(() => {
        setShowActivation(false)
      }, 3000)
    }

    console.log(`DeloreanProvider: DeLorean mode ${enabled ? 'activated' : 'deactivated'}`)
  }, [play])

  /**
   * Toggle DeLorean mode
   */
  const toggleDeloreanMode = useCallback(() => {
    setDeloreanMode(!isDeloreanMode)
  }, [isDeloreanMode, setDeloreanMode])

  /**
   * Listen for "JOSHUA" keyboard sequence
   */
  useKonamiCode({
    sequence: ['j', 'o', 's', 'h', 'u', 'a'],
    onSuccess: () => {
      setDeloreanMode(!isDeloreanMode) // Toggle when sequence detected
    },
  })

  // Create context value
  const contextValue: DeloreanContextValue = {
    isDeloreanMode,
    setDeloreanMode,
    toggleDeloreanMode,
    showActivation,
  }

  return (
    <DeloreanContext.Provider value={contextValue}>
      {children}
    </DeloreanContext.Provider>
  )
}

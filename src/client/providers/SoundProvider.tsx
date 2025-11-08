import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useTheme } from './ThemeProvider'

/**
 * Sound System for MSM Planning Poker
 *
 * Dual-preset sound system integrated with theme:
 * - Light Mode: Voltron (square/triangle waves, heroic tones)
 * - Dark Mode: Tron (sawtooth waves, gritty synth tones)
 *
 * Uses Web Audio API for synthesized sounds (no audio files)
 */

export type SoundId =
  | 'cardSelect'    // Card click
  | 'reveal'        // Vote reveal
  | 'roundStart'    // New round
  | 'timerComplete' // Timer finishes
  | 'themeChange'   // Theme variant switch
  | 'modeSwitch'    // Light/dark mode toggle

export interface SoundContextValue {
  enabled: boolean
  toggle: () => void
  play: (soundId: SoundId) => void
}

// localStorage key
const STORAGE_KEY = 'planningpoker_sound_enabled'

// Create context
const SoundContext = createContext<SoundContextValue | undefined>(undefined)

/**
 * Hook to access sound context
 * Must be used within SoundProvider
 */
export function useSound(): SoundContextValue {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}

/**
 * Sound Presets for Voltron (Light) and Tron (Dark) themes
 */
const VOLTRON_SOUNDS = {
  cardSelect: {
    waveType: 'square' as OscillatorType,
    frequency: 440,
    duration: 0.08,
    volume: 0.06
  },
  reveal: {
    waveType: 'triangle' as OscillatorType,
    frequency: 660,
    duration: 0.3,
    volume: 0.08
  },
  roundStart: {
    waveType: 'square' as OscillatorType,
    frequency: 523.25,
    duration: 0.2,
    volume: 0.07
  },
  timerComplete: {
    waveType: 'triangle' as OscillatorType,
    frequency: 880,
    duration: 0.4,
    volume: 0.09
  },
  themeChange: {
    waveType: 'square' as OscillatorType,
    frequency: 330,
    duration: 0.1,
    volume: 0.05
  },
  modeSwitch: {
    waveType: 'triangle' as OscillatorType,
    frequency: 392,
    duration: 0.15,
    volume: 0.06
  },
}

const TRON_SOUNDS = {
  cardSelect: {
    waveType: 'sawtooth' as OscillatorType,
    frequency: 220,
    duration: 0.08,
    volume: 0.06
  },
  reveal: {
    waveType: 'sawtooth' as OscillatorType,
    frequency: 330,
    duration: 0.3,
    volume: 0.08
  },
  roundStart: {
    waveType: 'sawtooth' as OscillatorType,
    frequency: 261.63,
    duration: 0.2,
    volume: 0.07
  },
  timerComplete: {
    waveType: 'sawtooth' as OscillatorType,
    frequency: 440,
    duration: 0.4,
    volume: 0.09
  },
  themeChange: {
    waveType: 'sawtooth' as OscillatorType,
    frequency: 165,
    duration: 0.1,
    volume: 0.05
  },
  modeSwitch: {
    waveType: 'sawtooth' as OscillatorType,
    frequency: 196,
    duration: 0.15,
    volume: 0.06
  },
}

/**
 * SoundProvider Component
 * Manages sound state and plays Web Audio API synthesized sounds
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const { mode } = useTheme()

  // Initialize state from localStorage or default to enabled
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true
    }

    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === null ? true : saved === 'true'
  })

  // Audio context (lazy initialization on first play)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  /**
   * Save enabled state to localStorage
   */
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, String(enabled))
  }, [enabled])

  /**
   * Toggle sound on/off
   */
  const toggle = useCallback(() => {
    setEnabled(prev => !prev)
  }, [])

  /**
   * Play a sound effect
   */
  const play = useCallback((soundId: SoundId) => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    // Get the appropriate sound preset based on current theme mode
    const soundPresets = mode === 'light' ? VOLTRON_SOUNDS : TRON_SOUNDS
    const sound = soundPresets[soundId]

    if (!sound) {
      console.warn(`SoundProvider: Unknown sound ID: ${soundId}`)
      return
    }

    try {
      // Initialize AudioContext on first use (user interaction required for autoplay policy)
      let context = audioContext
      if (!context) {
        context = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(context)
      }

      // Create oscillator node
      const oscillator = context.createOscillator()
      oscillator.type = sound.waveType
      oscillator.frequency.setValueAtTime(sound.frequency, context.currentTime)

      // Create gain node for volume control
      const gainNode = context.createGain()
      gainNode.gain.setValueAtTime(sound.volume, context.currentTime)

      // Fade out at the end to prevent clicking
      const fadeOutStart = context.currentTime + sound.duration - 0.02
      gainNode.gain.setValueAtTime(sound.volume, fadeOutStart)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + sound.duration)

      // Connect nodes: oscillator -> gain -> destination
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Start and stop
      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + sound.duration)

      // Clean up
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }

      console.log(`SoundProvider: Played ${soundId} (${mode} mode - ${sound.waveType})`)
    } catch (error) {
      console.error('SoundProvider: Error playing sound:', error)
    }
  }, [enabled, mode, audioContext])

  // Create context value
  const contextValue: SoundContextValue = {
    enabled,
    toggle,
    play,
  }

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  )
}

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

/**
 * Theme System for MSM Planning Poker
 *
 * Two-axis theme system:
 * 1. Mode: 'light' or 'dark'
 * 2. Variant: Color scheme within that mode
 *
 * Light Mode Variants: voltron, black-lion, red-lion, green-lion, blue-lion, yellow-lion
 * Dark Mode Variants: tron, sark, user
 */

// Type definitions
export type ThemeMode = 'light' | 'dark'

export type LightVariant = 'voltron' | 'black-lion' | 'red-lion' | 'green-lion' | 'blue-lion' | 'yellow-lion'
export type DarkVariant = 'tron' | 'sark' | 'user'

export interface ThemeState {
  mode: ThemeMode
  lightVariant: LightVariant
  darkVariant: DarkVariant
}

export interface ThemeContextValue extends ThemeState {
  toggleMode: () => void
  setLightVariant: (variant: LightVariant) => void
  setDarkVariant: (variant: DarkVariant) => void
  currentVariant: LightVariant | DarkVariant
}

// localStorage keys
const STORAGE_KEYS = {
  MODE: 'planningpoker_theme_mode',
  LIGHT_VARIANT: 'planningpoker_theme_variant_light',
  DARK_VARIANT: 'planningpoker_theme_variant_dark',
}

// Default values
const DEFAULT_THEME: ThemeState = {
  mode: 'dark',
  lightVariant: 'blue-lion',
  darkVariant: 'tron',
}

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/**
 * Hook to access theme context
 * Must be used within ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * ThemeProvider Component
 * Manages theme state and applies theme classes to document.body
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or defaults
  const [theme, setTheme] = useState<ThemeState>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_THEME
    }

    const savedMode = localStorage.getItem(STORAGE_KEYS.MODE) as ThemeMode | null
    const savedLightVariant = localStorage.getItem(STORAGE_KEYS.LIGHT_VARIANT) as LightVariant | null
    const savedDarkVariant = localStorage.getItem(STORAGE_KEYS.DARK_VARIANT) as DarkVariant | null

    return {
      mode: savedMode || DEFAULT_THEME.mode,
      lightVariant: savedLightVariant || DEFAULT_THEME.lightVariant,
      darkVariant: savedDarkVariant || DEFAULT_THEME.darkVariant,
    }
  })

  /**
   * Apply theme to DOM
   * Updates document.body classes and data attributes
   */
  const applyTheme = useCallback((state: ThemeState) => {
    if (typeof document === 'undefined') return

    const body = document.body
    const currentVariant = state.mode === 'light' ? state.lightVariant : state.darkVariant

    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark')

    // Add current theme class
    body.classList.add(`theme-${state.mode}`)

    // Set variant data attribute
    body.setAttribute('data-variant', currentVariant)

    console.log(`ThemeProvider: Applied theme - mode: ${state.mode}, variant: ${currentVariant}`)
  }, [])

  /**
   * Save theme to localStorage
   */
  const saveTheme = useCallback((state: ThemeState) => {
    if (typeof window === 'undefined') return

    localStorage.setItem(STORAGE_KEYS.MODE, state.mode)
    localStorage.setItem(STORAGE_KEYS.LIGHT_VARIANT, state.lightVariant)
    localStorage.setItem(STORAGE_KEYS.DARK_VARIANT, state.darkVariant)
  }, [])

  /**
   * Toggle between light and dark mode
   */
  const toggleMode = useCallback(() => {
    setTheme(prev => {
      const newTheme = {
        ...prev,
        mode: prev.mode === 'light' ? 'dark' : 'light',
      } as ThemeState

      saveTheme(newTheme)
      applyTheme(newTheme)

      return newTheme
    })
  }, [saveTheme, applyTheme])

  /**
   * Set light mode variant
   */
  const setLightVariant = useCallback((variant: LightVariant) => {
    setTheme(prev => {
      const newTheme = {
        ...prev,
        lightVariant: variant,
      }

      saveTheme(newTheme)
      if (prev.mode === 'light') {
        applyTheme(newTheme)
      }

      return newTheme
    })
  }, [saveTheme, applyTheme])

  /**
   * Set dark mode variant
   */
  const setDarkVariant = useCallback((variant: DarkVariant) => {
    setTheme(prev => {
      const newTheme = {
        ...prev,
        darkVariant: variant,
      }

      saveTheme(newTheme)
      if (prev.mode === 'dark') {
        applyTheme(newTheme)
      }

      return newTheme
    })
  }, [saveTheme, applyTheme])

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  // Create context value
  const contextValue: ThemeContextValue = {
    ...theme,
    currentVariant: theme.mode === 'light' ? theme.lightVariant : theme.darkVariant,
    toggleMode,
    setLightVariant,
    setDarkVariant,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

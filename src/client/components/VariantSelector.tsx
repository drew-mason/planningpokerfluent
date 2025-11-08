import React, { useState, useRef, useEffect } from 'react'
import { Palette, Check, ChevronDown } from 'lucide-react'
import { useTheme, LightVariant, DarkVariant } from '../providers/ThemeProvider'
import { useSound } from '../providers/SoundProvider'

/**
 * VariantSelector Component
 *
 * Dropdown menu for selecting theme variants.
 * Shows different variants based on current mode (light/dark).
 * Updates variant on selection with visual feedback.
 * Plays sound effect on variant change.
 *
 * Usage:
 * <VariantSelector />
 */
export function VariantSelector() {
  const { mode, lightVariant, darkVariant, setLightVariant, setDarkVariant, currentVariant } = useTheme()
  const { play } = useSound()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Light mode variants with display names
  const lightVariants: { value: LightVariant; label: string }[] = [
    { value: 'voltron', label: 'Voltron (Multi-color)' },
    { value: 'blue-lion', label: 'Blue Lion' },
    { value: 'red-lion', label: 'Red Lion' },
    { value: 'green-lion', label: 'Green Lion' },
    { value: 'yellow-lion', label: 'Yellow Lion' },
    { value: 'black-lion', label: 'Black Lion' },
  ]

  // Dark mode variants with display names
  const darkVariants: { value: DarkVariant; label: string }[] = [
    { value: 'tron', label: 'Tron (Cyan)' },
    { value: 'sark', label: 'Sark (Orange)' },
    { value: 'user', label: 'User (White)' },
  ]

  // Get current variants based on mode
  const variants = mode === 'light' ? lightVariants : darkVariants
  const currentValue = mode === 'light' ? lightVariant : darkVariant

  // Get display label for current variant
  const currentLabel = variants.find(v => v.value === currentValue)?.label || 'Select Theme'

  // Handle variant selection
  const handleSelect = (value: string) => {
    play('themeChange')
    if (mode === 'light') {
      setLightVariant(value as LightVariant)
    } else {
      setDarkVariant(value as DarkVariant)
    }
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-accent-muted transition-colors"
        aria-label="Select theme variant"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Palette className="h-4 w-4 text-accent" />
        <span>{currentLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="dropdown-menu" role="menu" aria-orientation="vertical">
          <div className="py-1" role="none">
            {/* Mode indicator */}
            <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border">
              {mode === 'light' ? 'Light Mode Variants' : 'Dark Mode Variants'}
            </div>

            {/* Variant options */}
            {variants.map(variant => (
              <button
                key={variant.value}
                onClick={() => handleSelect(variant.value)}
                className={`dropdown-item w-full text-left flex items-center justify-between ${
                  variant.value === currentValue ? 'bg-accent-muted text-accent font-semibold' : ''
                }`}
                role="menuitem"
              >
                <span>{variant.label}</span>
                {variant.value === currentValue && (
                  <Check className="h-4 w-4" aria-label="Currently selected" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VariantSelector

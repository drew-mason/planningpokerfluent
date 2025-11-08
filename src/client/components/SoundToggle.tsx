import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../providers/SoundProvider'

/**
 * SoundToggle Component
 *
 * Button to toggle sound effects on/off
 * Plays a test sound when toggled
 */
export function SoundToggle() {
  const { enabled, toggle, play } = useSound()

  const handleToggle = () => {
    // If currently disabled, will play after toggle
    if (!enabled) {
      toggle()
      // Use setTimeout to play after state update
      setTimeout(() => play('modeSwitch'), 100)
    } else {
      play('modeSwitch')
      toggle()
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle-button"
      aria-label={enabled ? 'Disable sound effects' : 'Enable sound effects'}
      title={enabled ? 'Sound: On' : 'Sound: Off'}
    >
      {enabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </button>
  )
}

import { useEffect, useState } from 'react'

/**
 * Custom hook for detecting keyboard sequences (Konami Code pattern)
 *
 * Listens for a specific sequence of key presses and triggers a callback when matched.
 * Used for Easter eggs like "RETRO", "JOSHUA", and classic Konami Code.
 *
 * @example
 * ```tsx
 * useKonamiCode({
 *   sequence: ['r', 'e', 't', 'r', 'o'],
 *   onSuccess: () => setRetroMode(true)
 * })
 * ```
 */

interface UseKonamiCodeOptions {
  sequence: string[]
  onSuccess: () => void
  caseSensitive?: boolean
  enabled?: boolean
}

export const useKonamiCode = ({
  sequence,
  onSuccess,
  caseSensitive = false,
  enabled = true,
}: UseKonamiCodeOptions) => {
  const [keySequence, setKeySequence] = useState<string[]>([])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Get the key pressed
      const key = caseSensitive ? e.key : e.key.toLowerCase()

      // Add to sequence, keeping only the last N keys (where N = sequence length)
      const newSequence = [...keySequence, key].slice(-sequence.length)
      setKeySequence(newSequence)

      // Normalize sequence for comparison
      const normalizedSequence = caseSensitive
        ? sequence
        : sequence.map(k => k.toLowerCase())

      // Check if the sequence matches
      if (newSequence.join('') === normalizedSequence.join('')) {
        console.log('useKonamiCode: Sequence matched!', sequence.join(''))
        onSuccess()
        setKeySequence([]) // Reset after successful match
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keySequence, sequence, onSuccess, caseSensitive, enabled])

  // Return current sequence for debugging purposes
  return { currentSequence: keySequence }
}

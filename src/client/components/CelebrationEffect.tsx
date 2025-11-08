import React, { useState, useEffect } from 'react'
import './CelebrationEffect.css'

/**
 * Celebration Effect Component
 *
 * Triggered when consensus is achieved in voting.
 *
 * Features:
 * - Confetti particles falling from top
 * - Success message with bounce animation
 * - Auto-dismisses after 4 seconds
 * - Uses CSS animations for performance
 *
 * Usage:
 * ```tsx
 * const [showCelebration, setShowCelebration] = useState(false)
 *
 * // When consensus detected:
 * setShowCelebration(true)
 * ```
 */

interface CelebrationEffectProps {
  show: boolean
  onComplete?: () => void
}

// Confetti particle colors
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

// Generate random confetti particles
const generateConfetti = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    left: Math.random() * 100, // % from left
    delay: Math.random() * 2, // seconds
    duration: 2 + Math.random() * 2, // 2-4 seconds
  }))
}

export function CelebrationEffect({ show, onComplete }: CelebrationEffectProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [confetti] = useState(() => generateConfetti(50))

  useEffect(() => {
    if (!show) {
      return
    }

    setIsVisible(true)

    // Auto-hide after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [show, onComplete])

  if (!show && !isVisible) {
    return null
  }

  return (
    <div className={`celebration-overlay ${isVisible ? 'visible' : 'fade-out'}`}>
      {/* Confetti particles */}
      <div className="confetti-container">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="confetti-particle"
            style={{
              backgroundColor: particle.color,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Success message */}
      <div className="celebration-message">
        <h2 className="celebration-text">
          CONSENSUS ACHIEVED! 🎉
        </h2>
        <p className="celebration-subtext">
          Great job, team!
        </p>
      </div>
    </div>
  )
}

/**
 * Helper function to trigger celebration programmatically
 * Can be called from VotingSession when consensus is detected
 */
export function triggerCelebration(
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>,
  playSound?: () => void
) {
  setShowCelebration(true)
  playSound?.()
}

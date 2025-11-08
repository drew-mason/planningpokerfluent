import React, { useState, useEffect } from 'react'
import './WarGamesActivation.css'

/**
 * WarGames Activation Animation Component
 *
 * Full-screen overlay that appears when DeLorean mode is activated.
 * Classic WarGames computer text animation with typing effect.
 *
 * Message: "GREETINGS PROFESSOR FALKEN. SHALL WE PLAY A GAME?"
 *
 * Features:
 * - Green terminal text on black background
 * - Typing effect (1-2 characters per 100ms)
 * - CRT scan line effect
 * - Fades out after 3 seconds
 */

interface WarGamesActivationProps {
  show: boolean
}

const MESSAGE = 'GREETINGS PROFESSOR FALKEN.\n\nSHALL WE PLAY A GAME?'

export function WarGamesActivation({ show }: WarGamesActivationProps) {
  const [displayText, setDisplayText] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!show) {
      setDisplayText('')
      setIsVisible(false)
      return
    }

    setIsVisible(true)
    let currentIndex = 0

    const typingInterval = setInterval(() => {
      if (currentIndex <= MESSAGE.length) {
        setDisplayText(MESSAGE.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)

        // Fade out after typing completes
        setTimeout(() => {
          setIsVisible(false)
        }, 1500)
      }
    }, 50) // Type ~2 characters per 100ms

    return () => clearInterval(typingInterval)
  }, [show])

  if (!show && !isVisible) {
    return null
  }

  return (
    <div className={`wargames-activation ${isVisible ? 'visible' : 'fade-out'}`}>
      <div className="wargames-scanlines" />
      <div className="wargames-terminal">
        <pre className="wargames-text">
          {displayText}
          <span className="wargames-cursor">_</span>
        </pre>
      </div>
    </div>
  )
}

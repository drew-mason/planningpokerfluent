import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useDelorean } from '../../providers/DeloreanProvider'
import './DeloreanTimeCircuits.css'

/**
 * DeLorean Time Circuits Component
 *
 * Back to the Future style time display with three circuits:
 * - Destination Time: Oct 21, 2015 04:29 PM
 * - Present Time: Current date/time (updates every second)
 * - Last Time Departed: Oct 26, 1985 01:21 AM
 *
 * Styled with:
 * - Amber/red LED display colors
 * - Monospace tabular numbers
 * - Black background with glowing border
 * - Fixed position in bottom-right corner
 */
export function DeloreanTimeCircuits() {
  const { isDeloreanMode, setDeloreanMode } = useDelorean()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    if (!isDeloreanMode) return

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [isDeloreanMode])

  if (!isDeloreanMode) {
    return null
  }

  // Format date as "MMM DD YYYY" (e.g., "OCT 21 2015")
  const formatDate = (date: Date): string => {
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month} ${day} ${year}`
  }

  // Format time as "HH:MM AM/PM" (e.g., "04:29 PM")
  const formatTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase()
  }

  // Fixed dates from Back to the Future
  const destinationTime = new Date(2015, 9, 21, 16, 29) // Oct 21, 2015 4:29 PM
  const departedTime = new Date(1985, 9, 26, 1, 21) // Oct 26, 1985 1:21 AM

  return (
    <div className="delorean-time-circuits">
      <button
        className="circuits-close"
        onClick={() => setDeloreanMode(false)}
        aria-label="Close time circuits"
      >
        <X size={16} />
      </button>

      <div className="circuit-panel destination">
        <div className="circuit-label">DESTINATION TIME</div>
        <div className="circuit-display">
          <div className="circuit-date">{formatDate(destinationTime)}</div>
          <div className="circuit-time">{formatTime(destinationTime)}</div>
        </div>
      </div>

      <div className="circuit-panel present">
        <div className="circuit-label">PRESENT TIME</div>
        <div className="circuit-display">
          <div className="circuit-date">{formatDate(currentTime)}</div>
          <div className="circuit-time">{formatTime(currentTime)}</div>
        </div>
      </div>

      <div className="circuit-panel departed">
        <div className="circuit-label">LAST TIME DEPARTED</div>
        <div className="circuit-display">
          <div className="circuit-date">{formatDate(departedTime)}</div>
          <div className="circuit-time">{formatTime(departedTime)}</div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { useSound } from '../providers/SoundProvider'
import './VotingCard.css'

interface VotingCardProps {
    value: string
    isSelected: boolean
    isRevealed: boolean
    onClick: (value: string) => void
    disabled?: boolean
    variant?: 'poker' | 'tshirt' | 'fibonacci'
}

const CARD_LABELS: { [key: string]: string } = {
    '0': '0',
    '0.5': '½',
    '1': '1',
    '2': '2',
    '3': '3',
    '5': '5',
    '8': '8',
    '13': '13',
    '20': '20',
    '40': '40',
    '100': '100',
    'XS': 'XS',
    'S': 'S',
    'M': 'M',
    'L': 'L',
    'XL': 'XL',
    'XXL': 'XXL',
    '?': '?',
    'coffee': '☕',
    '☕': '☕',
    'infinity': '∞'
}

const CARD_DESCRIPTIONS: { [key: string]: string } = {
    '0': 'No effort',
    '0.5': 'Minimal effort',
    '1': 'Very small',
    '2': 'Small',
    '3': 'Medium small',
    '5': 'Medium',
    '8': 'Large',
    '13': 'Very large',
    '20': 'Extra large',
    '40': 'Huge',
    '100': 'Enormous',
    'XS': 'Extra Small - Trivial task',
    'S': 'Small - Quick fix or minor change',
    'M': 'Medium - Standard feature',
    'L': 'Large - Complex feature',
    'XL': 'Extra Large - Major feature',
    'XXL': 'Extra Extra Large - Epic',
    '?': 'Unknown',
    'coffee': 'Break needed',
    '☕': 'Break needed',
    'infinity': 'Too big to estimate'
}

/**
 * VotingCard - Modernized voting card with Framer Motion and sound effects
 *
 * Phase 3 Migration:
 * - Added Framer Motion hover and tap animations
 * - Integrated sound effects from SoundProvider
 * - Enhanced accessibility
 * - Maintained all existing functionality
 */
export default function VotingCard({
    value,
    isSelected,
    isRevealed,
    onClick,
    disabled = false,
    variant = 'poker'
}: VotingCardProps) {
    const { play } = useSound()

    const handleClick = () => {
        if (disabled) return

        // Play sound effect
        play('cardSelect')
        onClick(value)
    }

    const getCardClass = () => {
        const baseClass = 'voting-card'
        const classes = [baseClass]

        if (isSelected) classes.push('selected')
        if (isRevealed) classes.push('revealed')
        if (disabled) classes.push('disabled')
        if (variant) classes.push(`variant-${variant}`)

        // Special styling for certain cards
        if (value === '?') classes.push('unknown-card')
        if (value === 'coffee') classes.push('coffee-card')
        if (value === 'infinity') classes.push('infinity-card')

        return classes.join(' ')
    }

    const getCardColor = () => {
        if (value === '?') return '#6b7280'
        if (value === 'coffee' || value === '☕') return '#92400e'
        if (value === 'infinity') return '#7c2d12'

        // T-shirt sizing colors
        if (value === 'XS') return '#10b981' // green
        if (value === 'S') return '#3b82f6' // blue
        if (value === 'M') return '#8b5cf6' // purple
        if (value === 'L') return '#f59e0b' // amber
        if (value === 'XL') return '#f97316' // orange
        if (value === 'XXL') return '#ef4444' // red

        // Numeric values (for backward compatibility)
        const numericValue = parseFloat(value)
        if (isNaN(numericValue)) return '#3b82f6'

        // Color gradient based on story point value
        if (numericValue <= 1) return '#10b981' // green
        if (numericValue <= 3) return '#3b82f6' // blue
        if (numericValue <= 8) return '#f59e0b' // amber
        if (numericValue <= 20) return '#f97316' // orange
        return '#ef4444' // red
    }

    return (
        <motion.div
            className={getCardClass()}
            onClick={handleClick}
            style={{ '--card-color': getCardColor() } as React.CSSProperties}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={`Vote ${value} - ${CARD_DESCRIPTIONS[value]}`}
            aria-pressed={isSelected}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick()
                }
            }}
            // Framer Motion animations
            whileHover={!disabled ? { scale: 1.1, rotate: 2 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
            }}
        >
            <div className="card-inner">
                <div className="card-front">
                    <div className="card-header">
                        <div className="card-corner top-left">{CARD_LABELS[value]}</div>
                        <div className="card-corner top-right">{CARD_LABELS[value]}</div>
                    </div>

                    <div className="card-center">
                        <div className="card-value">{CARD_LABELS[value]}</div>
                        <div className="card-description">{CARD_DESCRIPTIONS[value]}</div>
                    </div>

                    <div className="card-footer">
                        <div className="card-corner bottom-left">{CARD_LABELS[value]}</div>
                        <div className="card-corner bottom-right">{CARD_LABELS[value]}</div>
                    </div>
                </div>

                {isRevealed && (
                    <motion.div
                        className="card-back"
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="card-pattern"></div>
                        <div className="planning-poker-logo">🃏</div>
                    </motion.div>
                )}
            </div>

            {isSelected && (
                <motion.div
                    className="selection-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div className="selection-ring"></div>
                    <div className="selection-checkmark">✓</div>
                </motion.div>
            )}
        </motion.div>
    )
}

import React from 'react'
import { motion } from 'framer-motion'
import VotingCard from './VotingCard'
import { GlassPanel } from './ui/GlassPanel'
import './EstimationScale.css'

interface EstimationScaleProps {
    selectedValue?: string
    onVote: (value: string) => void
    disabled?: boolean
    variant?: 'poker' | 'tshirt' | 'fibonacci'
    isRevealed?: boolean
}

const ESTIMATION_SCALES = {
    poker: ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', 'coffee'],
    fibonacci: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', 'infinity'],
    tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', 'coffee']
}

const SCALE_DESCRIPTIONS = {
    poker: 'Modified Fibonacci sequence commonly used in agile estimation',
    fibonacci: 'Pure Fibonacci sequence for mathematical progression',
    tshirt: 'T-shirt sizes for high-level estimation'
}

export default function EstimationScale({ 
    selectedValue, 
    onVote, 
    disabled = false, 
    variant = 'poker',
    isRevealed = false 
}: EstimationScaleProps) {
    const scale = ESTIMATION_SCALES[variant]

    const handleVote = (value: string) => {
        if (disabled) return
        onVote(value)
    }

    const handleKeyboardNavigation = (event: React.KeyboardEvent, index: number) => {
        if (disabled) return
        
        let nextIndex = index
        
        switch (event.key) {
            case 'ArrowLeft':
                nextIndex = Math.max(0, index - 1)
                break
            case 'ArrowRight':
                nextIndex = Math.min(scale.length - 1, index + 1)
                break
            case 'Home':
                nextIndex = 0
                break
            case 'End':
                nextIndex = scale.length - 1
                break
            default:
                return
        }
        
        event.preventDefault()
        const nextCard = event.currentTarget.parentElement?.children[nextIndex] as HTMLElement
        nextCard?.focus()
    }

    return (
        <GlassPanel>
            <div className="estimation-scale">
                <div className="scale-header mb-4">
                    <h3 className="text-lg font-semibold text-text flex items-center gap-2">
                        {variant === 'poker' && '🃏 Planning Poker'}
                        {variant === 'fibonacci' && '🔢 Fibonacci'}
                        {variant === 'tshirt' && '👕 T-Shirt Sizes'}
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                        {SCALE_DESCRIPTIONS[variant]}
                    </p>
                </div>
            
            <div 
                className={`cards-container ${disabled ? 'disabled' : ''}`}
                role="radiogroup"
                aria-label={`${variant} estimation scale`}
            >
                {scale.map((value, index) => (
                    <div
                        key={value}
                        onKeyDown={(e) => handleKeyboardNavigation(e, index)}
                    >
                        <VotingCard
                            value={value}
                            isSelected={selectedValue === value}
                            isRevealed={isRevealed}
                            onClick={() => handleVote(value)}
                            disabled={disabled}
                            variant={variant}
                        />
                    </div>
                ))}
            </div>

                {selectedValue && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center justify-between bg-accent/10 border border-accent/30 rounded-lg p-3"
                    >
                        <div className="flex items-center gap-2">
                            <div className="text-green-400 text-xl">✓</div>
                            <span className="text-text">
                                Your vote: <strong className="text-accent">{selectedValue}</strong>
                            </span>
                        </div>
                        <button
                            className="px-3 py-1 text-sm text-text-muted hover:text-text hover:bg-surface-darker rounded transition-colors"
                            onClick={() => onVote('')}
                            disabled={disabled}
                            aria-label="Clear your vote"
                        >
                            Change Vote
                        </button>
                    </motion.div>
                )}

                {!selectedValue && !disabled && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center text-text-muted flex items-center justify-center gap-2"
                    >
                        <span className="text-2xl">👆</span>
                        <span>Select a card to cast your vote</span>
                    </motion.div>
                )}

                {disabled && (
                    <div className="mt-4 text-center text-text-muted flex items-center justify-center gap-2">
                        <span className="text-2xl">⏸️</span>
                        <span>Voting is currently disabled</span>
                    </div>
                )}
            </div>
        </GlassPanel>
    )
}
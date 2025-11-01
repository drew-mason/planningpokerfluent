import React from 'react'
import VotingCard from './VotingCard'
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
        <div className="estimation-scale">
            <div className="scale-header">
                <h3 className="scale-title">
                    {variant === 'poker' && '🃏 Planning Poker'}
                    {variant === 'fibonacci' && '🔢 Fibonacci'}
                    {variant === 'tshirt' && '👕 T-Shirt Sizes'}
                </h3>
                <p className="scale-description">
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
                            onClick={handleVote}
                            disabled={disabled}
                            variant={variant}
                        />
                    </div>
                ))}
            </div>
            
            {selectedValue && (
                <div className="selection-summary">
                    <div className="selection-icon">✓</div>
                    <span className="selection-text">
                        Your vote: <strong>{selectedValue}</strong>
                    </span>
                    <button 
                        className="change-vote-button"
                        onClick={() => onVote('')}
                        disabled={disabled}
                        aria-label="Clear your vote"
                    >
                        Change Vote
                    </button>
                </div>
            )}
            
            {!selectedValue && !disabled && (
                <div className="voting-prompt">
                    <div className="prompt-icon">👆</div>
                    <span className="prompt-text">
                        Select a card to cast your vote
                    </span>
                </div>
            )}
            
            {disabled && (
                <div className="disabled-message">
                    <div className="disabled-icon">⏸️</div>
                    <span className="disabled-text">
                        Voting is currently disabled
                    </span>
                </div>
            )}
        </div>
    )
}
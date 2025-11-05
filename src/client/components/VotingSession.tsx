import React, { useState, useEffect, useCallback } from 'react'
import EstimationScale from './EstimationScale'
import { VotingService } from '../services/VotingService'
import { StoryService } from '../services/StoryService'
import { ServiceNowDisplayValue, getValue, getDisplayValue } from '../types'
import './VotingSession.css'

interface Story {
    sys_id: string
    story_title: ServiceNowDisplayValue | string
    description: ServiceNowDisplayValue | string
    status: ServiceNowDisplayValue | string
    session: ServiceNowDisplayValue | string
}

interface VotingSessionProps {
    sessionId: string
    currentStory?: Story | null
    isDealer?: boolean
    onStoryComplete?: (storyId: string, finalEstimate: string) => void
    onNextStory?: () => void
}

interface VoteResult {
    voter: string
    estimate: string
    confidence: string
    voted_at: string
}

interface VotingStats {
    totalVotes: number
    consensus: boolean
    consensusEstimate?: string | null
    avgEstimate?: number
    medianEstimate?: number
    estimates: Record<string, number>
}

export default function VotingSession({ 
    sessionId, 
    currentStory, 
    isDealer = false,
    onStoryComplete,
    onNextStory 
}: VotingSessionProps) {
    const [userVote, setUserVote] = useState<string>('')
    const [allVotes, setAllVotes] = useState<VoteResult[]>([])
    const [votingStats, setVotingStats] = useState<VotingStats | null>(null)
    const [isRevealed, setIsRevealed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [estimationScale, setEstimationScale] = useState<'poker' | 'fibonacci' | 'tshirt'>('tshirt')

    const votingService = new VotingService()
    const storyService = new StoryService()

    // Load existing vote and stats when story changes
    useEffect(() => {
        if (currentStory?.sys_id) {
            loadVotingData()
        }
    }, [currentStory?.sys_id])

    const loadVotingData = async () => {
        if (!currentStory?.sys_id) return
        
        try {
            setIsLoading(true)
            setError(null)
            
            const [existingVote, votes, stats] = await Promise.all([
                votingService.getUserVote(currentStory.sys_id),
                votingService.getStoryVotes(currentStory.sys_id),
                votingService.getVotingStats(currentStory.sys_id)
            ])
            
            setUserVote(existingVote?.estimate || '')
            setAllVotes(votes)
            setVotingStats(stats)
            setIsRevealed(false)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load voting data'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVote = async (estimate: string) => {
        if (!currentStory?.sys_id) return
        
        try {
            setIsLoading(true)
            setError(null)
            
            if (estimate === '') {
                // Clear vote
                setUserVote('')
                await loadVotingData()
                return
            }
            
            if (userVote) {
                // Update existing vote
                const existingVote = await votingService.getUserVote(currentStory.sys_id)
                if (existingVote) {
                    await votingService.updateVote(existingVote.sys_id, estimate)
                }
            } else {
                // Submit new vote
                await votingService.submitVote(currentStory.sys_id, estimate)
            }
            
            setUserVote(estimate)
            await loadVotingData()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit vote'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRevealVotes = async () => {
        setIsRevealed(true)
        await loadVotingData() // Refresh stats
    }

    const handleClearVotes = async () => {
        if (!currentStory?.sys_id) return
        
        try {
            setIsLoading(true)
            await votingService.clearStoryVotes(currentStory.sys_id)
            await loadVotingData()
            setIsRevealed(false)
            setUserVote('')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to clear votes'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFinalizeStory = async (finalEstimate: string) => {
        if (!currentStory?.sys_id) return
        
        try {
            setIsLoading(true)
            await votingService.finalizeStoryVoting(currentStory.sys_id, finalEstimate)
            onStoryComplete?.(currentStory.sys_id, finalEstimate)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to finalize story'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (!currentStory) {
        return (
            <div className="voting-session no-story">
                <div className="no-story-content">
                    <div className="no-story-icon">📝</div>
                    <h3>No Story Selected</h3>
                    <p>Select a story from the session to start voting</p>
                </div>
            </div>
        )
    }

    const isVotingDisabled = isLoading || getValue(currentStory?.status) === 'completed'
    const hasVotes = allVotes.length > 0
    const storyTitle = getDisplayValue(currentStory?.story_title)
    const storyDescription = getDisplayValue(currentStory?.description)
    const currentStatus = getValue(currentStory?.status)

    return (
        <div className="voting-session">
            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button 
                        className="dismiss-error"
                        onClick={() => setError(null)}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}
            
            <div className="story-header">
                <div className="story-info">
                    <h2 className="story-title">{storyTitle}</h2>
                    {storyDescription && (
                        <p className="story-description">{storyDescription}</p>
                    )}
                </div>
                
                <div className="story-status">
                    <span className={`status-badge ${currentStatus}`}>
                        {currentStatus?.toUpperCase()}
                    </span>
                </div>
            </div>
            
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <span>Loading...</span>
                </div>
            )}
            
            <EstimationScale
                selectedValue={userVote}
                onVote={handleVote}
                disabled={isVotingDisabled}
                variant={estimationScale}
                isRevealed={isRevealed}
            />
            
            {hasVotes && (
                <div className="voting-results">
                    <div className="results-header">
                        <h3>Voting Results</h3>
                        <div className="results-meta">
                            <span className="vote-count">
                                {votingStats?.totalVotes || 0} vote{(votingStats?.totalVotes || 0) !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                    
                    {!isRevealed ? (
                        <div className="hidden-votes">
                            <div className="vote-cards">
                                {Array.from({ length: allVotes.length }).map((_, index) => (
                                    <div key={index} className="hidden-vote-card">
                                        <div className="card-back">🃏</div>
                                    </div>
                                ))}
                            </div>
                            
                            {isDealer && (
                                <button 
                                    className="reveal-button"
                                    onClick={handleRevealVotes}
                                    disabled={isLoading}
                                >
                                    Reveal Votes
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="revealed-votes">
                            <div className="vote-breakdown">
                                {Object.entries(votingStats?.estimates || {}).map(([estimate, count]) => (
                                    <div key={estimate} className="estimate-group">
                                        <div className="estimate-value">{estimate}</div>
                                        <div className="estimate-count">{count as number} vote{(count as number) !== 1 ? 's' : ''}</div>
                                        <div className="estimate-bar">
                                            <div 
                                                className="bar-fill"
                                                style={{ 
                                                    width: `${((count as number) / (votingStats?.totalVotes || 1)) * 100}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {votingStats?.consensus && (
                                <div className="consensus-achieved">
                                    <div className="consensus-icon">🎯</div>
                                    <div className="consensus-text">
                                        <strong>Consensus Achieved!</strong>
                                        <br />
                                        Final estimate: <strong>{votingStats.consensusEstimate}</strong>
                                    </div>
                                </div>
                            )}
                            
                            {!votingStats?.consensus && (
                                <div className="consensus-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Average:</span>
                                        <span className="stat-value">{votingStats?.avgEstimate || 0}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Median:</span>
                                        <span className="stat-value">{votingStats?.medianEstimate || 0}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {isDealer && isRevealed && (
                <div className="dealer-controls">
                    <h4>Dealer Controls</h4>
                    <div className="control-buttons">
                        <button 
                            className="clear-votes-button"
                            onClick={handleClearVotes}
                            disabled={isLoading}
                        >
                            Clear Votes & Re-vote
                        </button>
                        
                        {votingStats?.consensus && (
                            <button 
                                className="finalize-button consensus"
                                onClick={() => handleFinalizeStory(votingStats.consensusEstimate || '0')}
                                disabled={isLoading}
                            >
                                Accept Consensus ({votingStats.consensusEstimate})
                            </button>
                        )}
                        
                        {!votingStats?.consensus && (
                            <div className="finalize-options">
                                <span className="finalize-label">Finalize with:</span>
                                <button 
                                    className="finalize-button"
                                    onClick={() => handleFinalizeStory(votingStats?.avgEstimate?.toString() || '0')}
                                    disabled={isLoading}
                                >
                                    Average ({votingStats?.avgEstimate})
                                </button>
                                <button 
                                    className="finalize-button"
                                    onClick={() => handleFinalizeStory(votingStats?.medianEstimate?.toString() || '0')}
                                    disabled={isLoading}
                                >
                                    Median ({votingStats?.medianEstimate})
                                </button>
                            </div>
                        )}
                        
                        <button 
                            className="next-story-button"
                            onClick={onNextStory}
                            disabled={isLoading}
                        >
                            Next Story →
                        </button>
                    </div>
                </div>
            )}
            
            <div className="scale-selector">
                <label htmlFor="estimation-scale">Estimation Scale:</label>
                <select 
                    id="estimation-scale"
                    value={estimationScale}
                    onChange={(e) => setEstimationScale(e.target.value as 'poker' | 'fibonacci' | 'tshirt')}
                    disabled={isVotingDisabled}
                >
                    <option value="poker">Planning Poker</option>
                    <option value="fibonacci">Fibonacci</option>
                    <option value="tshirt">T-Shirt Sizes</option>
                </select>
            </div>
        </div>
    )
}
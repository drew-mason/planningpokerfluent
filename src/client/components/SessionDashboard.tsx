import React, { useState, useEffect, useCallback } from 'react'
import VotingSession from './VotingSession'
import { PlanningSessionService } from '../services/PlanningSessionService'
import { StoryService } from '../services/StoryService'
import './SessionDashboard.css'

interface SessionDashboardProps {
    sessionId: string
    onExit?: () => void
}

interface Participant {
    sys_id: string
    user: any
    role: string
    joined_at: string
}

interface SessionStory {
    sys_id: string
    story_title: any
    description?: any
    sequence_order: number
    status: string
    session: string
    final_estimate?: string
    consensus_achieved?: boolean
}

export default function SessionDashboard({ sessionId, onExit }: SessionDashboardProps) {
    const [session, setSession] = useState<any>(null)
    const [stories, setStories] = useState<SessionStory[]>([])
    const [participants, setParticipants] = useState<Participant[]>([])
    const [currentStory, setCurrentStory] = useState<SessionStory | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDealer, setIsDealer] = useState(false)
    const [showAddStory, setShowAddStory] = useState(false)
    const [newStoryTitle, setNewStoryTitle] = useState('')
    const [newStoryDescription, setNewStoryDescription] = useState('')

    const sessionService = new PlanningSessionService()
    const storyService = new StoryService()

    const loadSessionData = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const [sessionData, sessionStories, sessionParticipants] = await Promise.all([
                sessionService.get(sessionId),
                storyService.getSessionStories(sessionId),
                sessionService.getSessionParticipants(sessionId)
            ])
            
            setSession(sessionData)
            setStories(sessionStories)
            setParticipants(sessionParticipants)
            
            // Set current story (first pending/voting story)
            const activeStory = sessionStories.find((story: SessionStory) => 
                story.status === 'voting' || story.status === 'pending'
            )
            setCurrentStory(activeStory || sessionStories[0] || null)
            
            // Check if current user is dealer
            const currentUserId = 'current_user' // In real implementation, get from user context
            const dealerId = typeof sessionData.dealer === 'object' 
                ? sessionData.dealer.value 
                : sessionData.dealer
            setIsDealer(currentUserId === dealerId)
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load session data'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [sessionId])

    useEffect(() => {
        loadSessionData()
        
        // Set up polling for real-time updates
        const interval = setInterval(loadSessionData, 5000)
        return () => clearInterval(interval)
    }, [loadSessionData])

    const handleStorySelect = (story: SessionStory) => {
        setCurrentStory(story)
        if (isDealer && story.status === 'pending') {
            // Auto-start voting when dealer selects a pending story
            storyService.startVoting(story.sys_id)
        }
    }

    const handleStoryComplete = async (storyId: string, finalEstimate: string) => {
        await loadSessionData()
        
        // Auto-select next story
        const currentIndex = stories.findIndex(story => story.sys_id === storyId)
        const nextStory = stories[currentIndex + 1]
        if (nextStory) {
            setCurrentStory(nextStory)
        }
    }

    const handleNextStory = () => {
        if (!currentStory) return
        
        const currentIndex = stories.findIndex(story => story.sys_id === currentStory.sys_id)
        const nextStory = stories[currentIndex + 1]
        if (nextStory) {
            setCurrentStory(nextStory)
            if (isDealer && nextStory.status === 'pending') {
                storyService.startVoting(nextStory.sys_id)
            }
        }
    }

    const handleAddStory = async () => {
        if (!newStoryTitle.trim()) return
        
        try {
            await storyService.createStory(sessionId, {
                story_title: newStoryTitle.trim(),
                description: newStoryDescription.trim() || undefined
            })
            
            setNewStoryTitle('')
            setNewStoryDescription('')
            setShowAddStory(false)
            await loadSessionData()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add story'
            setError(errorMessage)
        }
    }

    const handleDeleteStory = async (storyId: string) => {
        if (!confirm('Are you sure you want to delete this story?')) return
        
        try {
            await storyService.deleteStory(storyId)
            await loadSessionData()
            
            // If deleted story was current, select another
            if (currentStory?.sys_id === storyId) {
                const remainingStories = stories.filter(s => s.sys_id !== storyId)
                setCurrentStory(remainingStories[0] || null)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete story'
            setError(errorMessage)
        }
    }

    const getSessionProgress = () => {
        const completedStories = stories.filter(story => story.status === 'completed').length
        const totalStories = stories.length
        return totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0
    }

    const getStoryStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return '⏳'
            case 'voting': return '🗳️'
            case 'completed': return '✅'
            default: return '📝'
        }
    }

    if (isLoading) {
        return (
            <div className="session-dashboard loading">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <h3>Loading Planning Session...</h3>
                    <p>Setting up your collaborative estimation workspace</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="session-dashboard error">
                <div className="error-content">
                    <div className="error-icon">⚠️</div>
                    <h3>Failed to Load Session</h3>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={loadSessionData} className="retry-button">
                            Try Again
                        </button>
                        <button onClick={onExit} className="exit-button">
                            Exit Session
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const sessionName = typeof session?.name === 'object' ? session.name.display_value : session?.name
    const sessionCode = typeof session?.session_code === 'object' ? session.session_code.display_value : session?.session_code
    const progress = getSessionProgress()

    return (
        <div className="session-dashboard">
            {/* Session Header */}
            <header className="session-header">
                <div className="session-info">
                    <h1 className="session-title">
                        🃏 {sessionName}
                    </h1>
                    <div className="session-meta">
                        <span className="session-code">
                            Code: <strong>{sessionCode}</strong>
                        </span>
                        <span className="progress-indicator">
                            {stories.filter(s => s.status === 'completed').length} / {stories.length} stories completed
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="session-actions">
                    {isDealer && (
                        <span className="dealer-badge">
                            👑 Dealer
                        </span>
                    )}
                    <button onClick={onExit} className="exit-button">
                        Exit Session
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    {/* Participants */}
                    <div className="participants-section">
                        <h3>
                            👥 Participants ({participants.length})
                        </h3>
                        <div className="participants-list">
                            {participants.map((participant) => {
                                const userName = typeof participant.user === 'object' 
                                    ? participant.user.display_value 
                                    : participant.user
                                
                                return (
                                    <div key={participant.sys_id} className="participant-item">
                                        <div className="participant-avatar">
                                            {userName?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="participant-info">
                                            <div className="participant-name">{userName}</div>
                                            <div className="participant-role">
                                                {participant.role === 'dealer' && '👑 '}
                                                {participant.role}
                                            </div>
                                        </div>
                                        <div className="participant-status online">●</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Stories */}
                    <div className="stories-section">
                        <div className="stories-header">
                            <h3>📝 Stories ({stories.length})</h3>
                            {isDealer && (
                                <button 
                                    className="add-story-button"
                                    onClick={() => setShowAddStory(true)}
                                >
                                    + Add
                                </button>
                            )}
                        </div>
                        
                        <div className="stories-list">
                            {stories.map((story) => {
                                const storyTitle = typeof story.story_title === 'object' 
                                    ? story.story_title.display_value 
                                    : story.story_title
                                
                                return (
                                    <div 
                                        key={story.sys_id}
                                        className={`story-item ${currentStory?.sys_id === story.sys_id ? 'active' : ''}`}
                                        onClick={() => handleStorySelect(story)}
                                    >
                                        <div className="story-status">
                                            {getStoryStatusIcon(story.status)}
                                        </div>
                                        <div className="story-content">
                                            <div className="story-title">{storyTitle}</div>
                                            <div className="story-meta">
                                                {story.final_estimate && (
                                                    <span className="estimate">
                                                        Est: {story.final_estimate}
                                                    </span>
                                                )}
                                                <span className="story-order">
                                                    #{story.sequence_order}
                                                </span>
                                            </div>
                                        </div>
                                        {isDealer && (
                                            <button 
                                                className="delete-story-button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteStory(story.sys_id)
                                                }}
                                                aria-label="Delete story"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    <VotingSession
                        sessionId={sessionId}
                        currentStory={currentStory ? {
                            ...currentStory,
                            description: currentStory.description || ''
                        } : null}
                        isDealer={true}
                        onStoryComplete={handleStoryComplete}
                        onNextStory={handleNextStory}
                    />
                </main>
            </div>

            {/* Add Story Modal */}
            {showAddStory && (
                <div className="modal-overlay">
                    <div className="add-story-modal">
                        <div className="modal-header">
                            <h3>Add New Story</h3>
                            <button 
                                className="close-button"
                                onClick={() => setShowAddStory(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="form-group">
                                <label htmlFor="story-title">Story Title *</label>
                                <input
                                    id="story-title"
                                    type="text"
                                    value={newStoryTitle}
                                    onChange={(e) => setNewStoryTitle(e.target.value)}
                                    placeholder="Enter story title"
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="story-description">Description</label>
                                <textarea
                                    id="story-description"
                                    value={newStoryDescription}
                                    onChange={(e) => setNewStoryDescription(e.target.value)}
                                    placeholder="Optional: Add story details"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="cancel-button"
                                onClick={() => setShowAddStory(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="add-button"
                                onClick={handleAddStory}
                                disabled={!newStoryTitle.trim()}
                            >
                                Add Story
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
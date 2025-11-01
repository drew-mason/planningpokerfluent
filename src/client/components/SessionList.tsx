import React, { useState } from 'react'
import { PlanningSession, PlanningSessionService, getValue, getDisplayValue } from '../types'
import './SessionList.css'

interface SessionListProps {
    sessions: PlanningSession[]
    onEdit: (session: PlanningSession) => void
    onRefresh: () => void
    onJoinSession: (session: PlanningSession) => void
    onViewSession: (session: PlanningSession) => void
    service: PlanningSessionService
}

export default function SessionList({ sessions, onEdit, onRefresh, onJoinSession, onViewSession, service }: SessionListProps) {
    const [joinCode, setJoinCode] = useState('')
    const [showJoinModal, setShowJoinModal] = useState(false)

    const handleDelete = async (session: PlanningSession) => {
        if (!confirm('Are you sure you want to delete this planning session?')) {
            return
        }

        try {
            const sysId = getValue(session.sys_id)
            await service.delete(sysId)
            onRefresh()
        } catch (error) {
            console.error('Failed to delete session:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            alert('Failed to delete session: ' + errorMessage)
        }
    }

    const handleJoinByCode = async () => {
        if (!joinCode.trim()) {
            alert('Please enter a session code')
            return
        }

        try {
            const result = await service.joinSession(joinCode.trim().toUpperCase())
            setShowJoinModal(false)
            setJoinCode('')
            onRefresh()
            alert(`Successfully joined session: ${getDisplayValue(result.name)}`)
        } catch (error) {
            console.error('Failed to join session:', error)
            const errorMessage = error instanceof Error ? error.message : 'Invalid session code'
            alert('Failed to join session: ' + errorMessage)
        }
    }

    const getStatusClass = (status: any) => {
        const statusValue = typeof status === 'object' ? status.value : status

        switch (statusValue) {
            case 'draft':
                return 'status-draft'
            case 'active':
                return 'status-active'
            case 'paused':
                return 'status-paused'
            case 'completed':
                return 'status-completed'
            default:
                return ''
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateString
        }
    }

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return '#10b981' // green
        if (percentage >= 50) return '#f59e0b' // amber
        return '#ef4444' // red
    }

    return (
        <div className="session-list">
            <div className="session-list-header">
                <h3>Planning Sessions</h3>
                <button 
                    className="join-session-button"
                    onClick={() => setShowJoinModal(true)}
                >
                    Join Session
                </button>
            </div>

            {sessions.length === 0 ? (
                <div className="no-sessions">
                    <div className="no-sessions-content">
                        <h4>No planning sessions found</h4>
                        <p>Create a new session or join an existing one using a session code.</p>
                    </div>
                </div>
            ) : (
                <div className="sessions-grid">
                    {sessions.map((session) => {
                        // Extract primitive values from potential objects
                        const name = getDisplayValue(session.name)
                        const description = getDisplayValue(session.description)
                        const status = getDisplayValue(session.status)
                        const sessionCode = getDisplayValue(session.session_code)
                        const totalStories = Number(getValue(session.total_stories)) || 0
                        const completedStories = Number(getValue(session.completed_stories)) || 0
                        const consensusRate = Number(getValue(session.consensus_rate)) || 0
                        const createdOn = getDisplayValue(session.sys_created_on)
                        
                        const progressPercentage = totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0

                        return (
                            <div 
                                key={getValue(session.sys_id)}
                                className="session-card"
                            >
                                <div className="session-card-header">
                                    <h4 className="session-name" title={name}>{name}</h4>
                                    <span className={`status-badge ${getStatusClass(session.status)}`}>
                                        {status}
                                    </span>
                                </div>

                                <div className="session-code">
                                    <span className="session-code-label">Code:</span>
                                    <span className="session-code-value">{sessionCode}</span>
                                </div>

                                {description && (
                                    <p className="session-description" title={description}>
                                        {description}
                                    </p>
                                )}

                                <div className="session-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Stories:</span>
                                        <span className="stat-value">{completedStories || 0} / {totalStories || 0}</span>
                                    </div>
                                    
                                    <div className="stat-item">
                                        <span className="stat-label">Progress:</span>
                                        <div className="progress-container">
                                            <div 
                                                className="progress-bar"
                                                style={{ 
                                                    width: `${progressPercentage}%`,
                                                    backgroundColor: getProgressColor(progressPercentage)
                                                }}
                                            ></div>
                                            <span className="progress-text">{progressPercentage}%</span>
                                        </div>
                                    </div>

                                    {consensusRate && (
                                        <div className="stat-item">
                                            <span className="stat-label">Consensus:</span>
                                            <span className="stat-value">{consensusRate}%</span>
                                        </div>
                                    )}
                                </div>

                                <div className="session-meta">
                                    <small>Created: {formatDate(createdOn)}</small>
                                </div>

                                <div className="session-actions">
                                    <button
                                        className="view-button"
                                        onClick={() => onViewSession(session)}
                                        aria-label={`View session ${name}`}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="join-button"
                                        onClick={() => onJoinSession(session)}
                                        aria-label={`Join session ${name}`}
                                        disabled={status === 'completed'}
                                    >
                                        Join
                                    </button>
                                    <button
                                        className="edit-button"
                                        onClick={() => onEdit(session)}
                                        aria-label={`Edit session ${name}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(session)}
                                        aria-label={`Delete session ${name}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Join Session Modal */}
            {showJoinModal && (
                <div className="join-modal-overlay">
                    <div className="join-modal">
                        <div className="join-modal-header">
                            <h3>Join Planning Session</h3>
                            <button 
                                className="close-button"
                                onClick={() => setShowJoinModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="join-modal-content">
                            <p>Enter the session code provided by your session host:</p>
                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="Enter session code (e.g., ABC123)"
                                maxLength={10}
                                className="join-code-input"
                                autoFocus
                                autoComplete="off"
                                data-no-autofill="true"
                                data-form-type="other"
                            />
                        </div>
                        <div className="join-modal-actions">
                            <button 
                                className="cancel-button"
                                onClick={() => setShowJoinModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="join-submit-button"
                                onClick={handleJoinByCode}
                                disabled={!joinCode.trim()}
                            >
                                Join Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
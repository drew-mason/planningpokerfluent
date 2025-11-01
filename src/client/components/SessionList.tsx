import React, { useState, useCallback, useMemo } from 'react'
import { 
    PlanningSession, 
    PlanningSessionService, 
    getValue, 
    getDisplayValue, 
    getNumericValue,
    formatDate,
    formatPercentage,
    SessionStatus,
    SESSION_STATUS_LABELS
} from '../types'
import { serviceUtils, handleAsyncOperation } from '../utils/serviceUtils'
import './SessionList.css'

interface SessionListProps {
    sessions: PlanningSession[]
    onEdit: (session: PlanningSession) => void
    onRefresh: () => void
    onJoinSession: (session: PlanningSession) => void
    onViewSession: (session: PlanningSession) => void
    onDelete: (session: PlanningSession) => void
    service: PlanningSessionService
    isLoading?: boolean
}

interface JoinModalState {
    isOpen: boolean
    code: string
    isJoining: boolean
    error: string | null
}

export default function SessionList({ 
    sessions, 
    onEdit, 
    onRefresh, 
    onJoinSession, 
    onViewSession, 
    onDelete, 
    service,
    isLoading = false
}: SessionListProps) {
    const [joinModal, setJoinModal] = useState<JoinModalState>({
        isOpen: false,
        code: '',
        isJoining: false,
        error: null
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all')

    // Filter sessions based on search and status
    const filteredSessions = useMemo(() => {
        return sessions.filter(session => {
            const name = getDisplayValue(session.name).toLowerCase()
            const description = getDisplayValue(session.description).toLowerCase()
            const status = getValue(session.status) as SessionStatus
            const sessionCode = getValue(session.session_code).toLowerCase()

            const matchesSearch = !searchTerm || 
                name.includes(searchTerm.toLowerCase()) ||
                description.includes(searchTerm.toLowerCase()) ||
                sessionCode.includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === 'all' || status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [sessions, searchTerm, statusFilter])

    // Join session by code
    const handleJoinByCode = useCallback(async () => {
        if (!joinModal.code.trim()) {
            setJoinModal(prev => ({ ...prev, error: 'Please enter a session code' }))
            return
        }

        if (!serviceUtils.validateSessionCode(joinModal.code.trim())) {
            setJoinModal(prev => ({ ...prev, error: 'Invalid session code format' }))
            return
        }

        setJoinModal(prev => ({ ...prev, isJoining: true, error: null }))

        await handleAsyncOperation(
            () => service.joinSession(joinModal.code.trim().toUpperCase()),
            (session) => {
                setJoinModal({ isOpen: false, code: '', isJoining: false, error: null })
                onRefresh()
                // Auto-join the session
                onJoinSession(session)
            },
            (error) => {
                setJoinModal(prev => ({ 
                    ...prev, 
                    isJoining: false, 
                    error: error.message || 'Failed to join session' 
                }))
            }
        )
    }, [joinModal.code, service, onRefresh, onJoinSession])

    // Session action handlers
    const handleSessionAction = useCallback((session: PlanningSession, action: string) => {
        switch (action) {
            case 'view':
                onViewSession(session)
                break
            case 'join':
                onJoinSession(session)
                break
            case 'edit':
                onEdit(session)
                break
            case 'delete':
                onDelete(session)
                break
        }
    }, [onViewSession, onJoinSession, onEdit, onDelete])

    // UI helpers
    const getStatusClass = useCallback((status: SessionStatus): string => {
        const statusClasses: Record<SessionStatus, string> = {
            pending: 'status-pending',
            active: 'status-active',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        }
        return statusClasses[status] || ''
    }, [])

    const getProgressColor = useCallback((percentage: number): string => {
        if (percentage >= 80) return '#10b981' // green
        if (percentage >= 50) return '#f59e0b' // amber
        return '#ef4444' // red
    }, [])

    const getSessionIcon = useCallback((status: SessionStatus): string => {
        const statusIcons: Record<SessionStatus, string> = {
            pending: '⏳',
            active: '🔴',
            completed: '✅',
            cancelled: '❌'
        }
        return statusIcons[status] || '📝'
    }, [])

    return (
        <div className="session-list">
            {/* Header with search and filters */}
            <div className="session-list-header">
                <div className="header-left">
                    <h2>Planning Sessions</h2>
                    <span className="session-count">
                        {filteredSessions.length} of {sessions.length} sessions
                    </span>
                </div>
                <div className="header-actions">
                    <button 
                        className="secondary-button"
                        onClick={() => setJoinModal(prev => ({ ...prev, isOpen: true }))}
                        disabled={isLoading}
                    >
                        Join Session
                    </button>
                    <button 
                        className="secondary-button"
                        onClick={onRefresh}
                        disabled={isLoading}
                        aria-label="Refresh sessions"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="filter-bar">
                <div className="search-group">
                    <label htmlFor="session-search" className="sr-only">Search sessions</label>
                    <input
                        id="session-search"
                        type="text"
                        placeholder="Search sessions by name, description, or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        disabled={isLoading}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as SessionStatus | 'all')}
                        className="status-filter"
                        disabled={isLoading}
                    >
                        <option value="all">All Status</option>
                        {Object.entries(SESSION_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Sessions Grid */}
            <div className="sessions-content">
                {isLoading && sessions.length === 0 ? (
                    <div className="loading-placeholder">
                        <div className="loading-skeleton"></div>
                        <div className="loading-skeleton"></div>
                        <div className="loading-skeleton"></div>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="no-sessions">
                        <div className="no-sessions-content">
                            <div className="no-sessions-icon">🃏</div>
                            <h3>
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'No matching sessions found' 
                                    : 'No planning sessions yet'
                                }
                            </h3>
                            <p>
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Create a new session or join an existing one using a session code.'
                                }
                            </p>
                            {(searchTerm || statusFilter !== 'all') && (
                                <button 
                                    className="secondary-button"
                                    onClick={() => {
                                        setSearchTerm('')
                                        setStatusFilter('all')
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="sessions-grid">
                        {filteredSessions.map((session) => {
                            const name = getDisplayValue(session.name)
                            const description = getDisplayValue(session.description)
                            const status = getValue(session.status) as SessionStatus
                            const sessionCode = getValue(session.session_code)
                            const totalStories = getNumericValue(session.total_stories)
                            const completedStories = getNumericValue(session.completed_stories)
                            const consensusRate = getNumericValue(session.consensus_rate)
                            const createdOn = getDisplayValue(session.sys_created_on)
                            
                            const progressPercentage = totalStories > 0 
                                ? Math.round((completedStories / totalStories) * 100) 
                                : 0

                            return (
                                <div 
                                    key={getValue(session.sys_id)}
                                    className={`session-card ${getStatusClass(status)}`}
                                >
                                    <div className="session-card-header">
                                        <div className="session-title-row">
                                            <span className="session-icon">
                                                {getSessionIcon(status)}
                                            </span>
                                            <h3 className="session-name" title={name}>
                                                {name}
                                            </h3>
                                        </div>
                                        <span className={`status-badge ${getStatusClass(status)}`}>
                                            {SESSION_STATUS_LABELS[status]}
                                        </span>
                                    </div>

                                    <div className="session-code-row">
                                        <span className="session-code-label">Code:</span>
                                        <code className="session-code-value">{sessionCode}</code>
                                    </div>

                                    {description && (
                                        <p className="session-description" title={description}>
                                            {description}
                                        </p>
                                    )}

                                    <div className="session-stats">
                                        <div className="stat-row">
                                            <div className="stat-item">
                                                <span className="stat-label">Stories:</span>
                                                <span className="stat-value">
                                                    {completedStories} / {totalStories}
                                                </span>
                                            </div>
                                            
                                            {consensusRate > 0 && (
                                                <div className="stat-item">
                                                    <span className="stat-label">Consensus:</span>
                                                    <span className="stat-value">
                                                        {formatPercentage(consensusRate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {totalStories > 0 && (
                                            <div className="progress-section">
                                                <div className="progress-label">
                                                    <span>Progress</span>
                                                    <span>{formatPercentage(progressPercentage)}</span>
                                                </div>
                                                <div className="progress-container">
                                                    <div 
                                                        className="progress-bar"
                                                        style={{ 
                                                            width: `${progressPercentage}%`,
                                                            backgroundColor: getProgressColor(progressPercentage)
                                                        }}
                                                        role="progressbar"
                                                        aria-valuenow={progressPercentage}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        aria-label={`${progressPercentage}% complete`}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="session-meta">
                                        <small>Created: {formatDate(createdOn)}</small>
                                    </div>

                                    <div className="session-actions">
                                        <button
                                            className="action-button view-button"
                                            onClick={() => handleSessionAction(session, 'view')}
                                            disabled={isLoading}
                                            aria-label={`View session ${name}`}
                                        >
                                            👁️ View
                                        </button>
                                        <button
                                            className="action-button join-button"
                                            onClick={() => handleSessionAction(session, 'join')}
                                            disabled={isLoading || status === 'completed' || status === 'cancelled'}
                                            aria-label={`Join session ${name}`}
                                        >
                                            🚀 Join
                                        </button>
                                        <button
                                            className="action-button edit-button"
                                            onClick={() => handleSessionAction(session, 'edit')}
                                            disabled={isLoading}
                                            aria-label={`Edit session ${name}`}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="action-button delete-button"
                                            onClick={() => handleSessionAction(session, 'delete')}
                                            disabled={isLoading || status === 'active'}
                                            aria-label={`Delete session ${name}`}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Join Session Modal */}
            {joinModal.isOpen && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setJoinModal(prev => ({ ...prev, isOpen: false }))}>
                    <div className="join-modal">
                        <div className="modal-header">
                            <h3>Join Planning Session</h3>
                            <button 
                                className="close-button"
                                onClick={() => setJoinModal(prev => ({ ...prev, isOpen: false }))}
                                disabled={joinModal.isJoining}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <p>Enter the 6-character session code provided by your session host:</p>
                            
                            <div className="form-group">
                                <label htmlFor="join-code" className="sr-only">Session code</label>
                                <input
                                    id="join-code"
                                    type="text"
                                    value={joinModal.code}
                                    onChange={(e) => setJoinModal(prev => ({ 
                                        ...prev, 
                                        code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6),
                                        error: null
                                    }))}
                                    placeholder="Enter session code (e.g., ABC123)"
                                    maxLength={6}
                                    className="join-code-input"
                                    disabled={joinModal.isJoining}
                                    autoFocus
                                    autoComplete="off"
                                    data-no-autofill="true"
                                    data-form-type="other"
                                />
                            </div>

                            {joinModal.error && (
                                <div className="error-message" role="alert">
                                    {joinModal.error}
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                className="secondary-button"
                                onClick={() => setJoinModal(prev => ({ ...prev, isOpen: false }))}
                                disabled={joinModal.isJoining}
                            >
                                Cancel
                            </button>
                            <button 
                                className="primary-button"
                                onClick={handleJoinByCode}
                                disabled={joinModal.isJoining || !joinModal.code.trim() || joinModal.code.length < 6}
                            >
                                {joinModal.isJoining ? (
                                    <>
                                        <span className="spinner" aria-hidden="true"></span>
                                        Joining...
                                    </>
                                ) : (
                                    'Join Session'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
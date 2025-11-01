import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { PlanningSessionService } from './services/PlanningSessionService'
import SessionList from './components/SessionList'
import SessionForm from './components/SessionForm'
import SessionDashboard from './components/SessionDashboard'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { formatApiError, handleAsyncOperation } from './utils/serviceUtils'
import { isExtensionError, suppressExtensionErrors } from './utils/browserExtensionFix'
import './app.css'

// Initialize browser extension protection
if (typeof window !== 'undefined') {
    // Suppress extension-related console errors
    suppressExtensionErrors()
    
    // Add global error handler for extension errors
    const handleExtensionErrors = (event) => {
        const error = event.error || event.reason
        if (isExtensionError(error)) {
            console.debug('Browser extension interference suppressed:', error.message)
            event.preventDefault()
            return true
        }
        return false
    }
    
    window.addEventListener('error', handleExtensionErrors, true)
    window.addEventListener('unhandledrejection', handleExtensionErrors, true)
    
    // Add meta tags to discourage extension interference
    const addMetaTag = (name, content) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
            const meta = document.createElement('meta')
            meta.name = name
            meta.content = content
            document.head.appendChild(meta)
        }
    }
    
    addMetaTag('no-password-suggestions', 'true')
    addMetaTag('autocomplete', 'off')
    addMetaTag('form-type', 'other')
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Planning Poker App Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h2>🃏 Planning Poker Application</h2>
                        <div className="error-message">
                            <h3>Something went wrong</h3>
                            <p>The application encountered an unexpected error.</p>
                            <details className="error-details">
                                <summary>Error Details</summary>
                                <pre>{this.state.error?.message}</pre>
                                {this.state.error?.stack && (
                                    <pre className="error-stack">{this.state.error.stack}</pre>
                                )}
                            </details>
                        </div>
                        <div className="error-actions">
                            <button 
                                onClick={() => window.location.reload()}
                                className="primary-button"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

// Notification Component
const NotificationBar = ({ notification, onDismiss }) => {
    useEffect(() => {
        if (notification && notification.duration) {
            const timer = setTimeout(onDismiss, notification.duration)
            return () => clearTimeout(timer)
        }
    }, [notification, onDismiss])

    if (!notification) return null

    return (
        <div className={`notification-bar notification-${notification.type}`}>
            <div className="notification-content">
                <span className="notification-icon">
                    {notification.type === 'success' && '✅'}
                    {notification.type === 'error' && '❌'}
                    {notification.type === 'warning' && '⚠️'}
                    {notification.type === 'info' && 'ℹ️'}
                </span>
                <span className="notification-message">{notification.message}</span>
            </div>
            <button 
                className="notification-dismiss"
                onClick={onDismiss}
                aria-label="Dismiss notification"
            >
                ×
            </button>
        </div>
    )
}

// Loading Component
const LoadingSpinner = ({ isLoading, loadingMessage }) => {
    if (!isLoading) return null

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="loading-spinner" aria-label="Loading"></div>
                <h3>Planning Poker</h3>
                <p>{loadingMessage || 'Loading...'}</p>
            </div>
        </div>
    )
}

// Main App Component
export default function App() {
    console.log('Planning Poker App: Initializing...')
    
    // State management
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState({ isLoading: true, loadingMessage: 'Loading planning sessions...' })
    const [error, setError] = useState({ hasError: false })
    const [notification, setNotification] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null)
    const [viewMode, setViewMode] = useState('list')
    const [activeSessionId, setActiveSessionId] = useState(null)

    // Services
    const sessionService = useMemo(() => new PlanningSessionService(), [])

    // Notification helpers
    const showNotification = useCallback((notification) => {
        setNotification({ ...notification, duration: notification.duration || 5000 })
    }, [])

    const clearNotification = useCallback(() => {
        setNotification(null)
    }, [])

    // Error helpers
    const handleError = useCallback((error, context) => {
        console.error(`${context}:`, error)
        
        const errorMessage = formatApiError(error)
        setError({ hasError: true, errorMessage })
        
        showNotification({
            type: 'error',
            message: errorMessage,
            duration: 8000
        })
    }, [showNotification])

    const clearError = useCallback(() => {
        setError({ hasError: false })
    }, [])

    // Session management
    const refreshSessions = useCallback(async () => {
        console.log('App: Refreshing sessions...')
        
        await handleAsyncOperation(
            () => sessionService.list({ limit: 100 }),
            (data) => {
                console.log(`App: Retrieved ${data.length} sessions`)
                setSessions(data)
                clearError()
            },
            (error) => handleError(error, 'Failed to load planning sessions'),
            () => setLoading({ isLoading: false })
        )
    }, [sessionService, handleError, clearError])

    // Initial load
    useEffect(() => {
        refreshSessions()
    }, [refreshSessions])

    // Event handlers
    const handleCreateClick = useCallback(() => {
        setSelectedSession(null)
        setShowForm(true)
    }, [])

    const handleEditClick = useCallback((session) => {
        setSelectedSession(session)
        setShowForm(true)
    }, [])

    const handleFormClose = useCallback(() => {
        setShowForm(false)
        setSelectedSession(null)
    }, [])

    const handleFormSubmit = useCallback(async (sessionData) => {
        setLoading({ isLoading: true, loadingMessage: selectedSession ? 'Updating session...' : 'Creating session...' })
        
        const operation = selectedSession 
            ? () => {
                const sysId = typeof selectedSession.sys_id === 'object'
                    ? selectedSession.sys_id.value
                    : selectedSession.sys_id
                return sessionService.update(sysId, sessionData)
            }
            : () => sessionService.create(sessionData)

        await handleAsyncOperation(
            operation,
            (result) => {
                const action = selectedSession ? 'updated' : 'created'
                showNotification({
                    type: 'success',
                    message: `Planning session ${action} successfully!`
                })
                setShowForm(false)
                setSelectedSession(null)
                refreshSessions()
            },
            (error) => handleError(error, selectedSession ? 'Failed to update session' : 'Failed to create session'),
            () => setLoading({ isLoading: false })
        )
    }, [selectedSession, sessionService, showNotification, handleError, refreshSessions])

    const handleJoinSession = useCallback(async (session) => {
        const sessionId = typeof session.sys_id === 'object' 
            ? session.sys_id.value 
            : session.sys_id
        
        setActiveSessionId(sessionId)
        setViewMode('dashboard')
    }, [])

    const handleViewSession = useCallback((session) => {
        const sessionId = typeof session.sys_id === 'object' 
            ? session.sys_id.value 
            : session.sys_id
        
        setActiveSessionId(sessionId)
        setViewMode('dashboard')
    }, [])

    const handleExitSession = useCallback(() => {
        setActiveSessionId(null)
        setViewMode('list')
        refreshSessions()
    }, [refreshSessions])

    const handleDeleteSession = useCallback(async (session) => {
        const sessionName = typeof session.name === 'object' 
            ? session.name.display_value 
            : session.name

        if (!confirm(`Are you sure you want to delete "${sessionName}"? This action cannot be undone.`)) {
            return
        }

        const sysId = typeof session.sys_id === 'object' 
            ? session.sys_id.value 
            : session.sys_id

        setLoading({ isLoading: true, loadingMessage: 'Deleting session...' })

        await handleAsyncOperation(
            () => sessionService.delete(sysId),
            () => {
                showNotification({
                    type: 'success',
                    message: `Planning session "${sessionName}" deleted successfully!`
                })
                refreshSessions()
            },
            (error) => handleError(error, 'Failed to delete session'),
            () => setLoading({ isLoading: false })
        )
    }, [sessionService, showNotification, handleError, refreshSessions])

    // View routing
    if (viewMode === 'dashboard' && activeSessionId) {
        return (
            <ErrorBoundary>
                <NotificationBar notification={notification} onDismiss={clearNotification} />
                <SessionDashboard
                    sessionId={activeSessionId}
                    onExit={handleExitSession}
                />
            </ErrorBoundary>
        )
    }

    if (viewMode === 'analytics') {
        return (
            <ErrorBoundary>
                <div className="planning-app">
                    <NotificationBar notification={notification} onDismiss={clearNotification} />
                    <header className="app-header">
                        <div className="header-content">
                            <div className="header-title">
                                <h1>📊 Planning Poker Analytics</h1>
                                <p>Session insights and team performance</p>
                            </div>
                            <button 
                                className="secondary-button" 
                                onClick={() => setViewMode('list')}
                            >
                                ← Back to Sessions
                            </button>
                        </div>
                    </header>
                    <AnalyticsDashboard />
                </div>
            </ErrorBoundary>
        )
    }

    // Main session list view
    return (
        <ErrorBoundary>
            <div className="planning-app">
                <NotificationBar notification={notification} onDismiss={clearNotification} />
                <LoadingSpinner isLoading={loading.isLoading} loadingMessage={loading.loadingMessage} />
                
                <header className="app-header">
                    <div className="header-content">
                        <div className="header-title">
                            <h1>🃏 Planning Poker</h1>
                            <p>Collaborative estimation made easy</p>
                        </div>
                        <div className="header-actions">
                            <button 
                                className="secondary-button" 
                                onClick={() => setViewMode('analytics')}
                                disabled={loading.isLoading}
                            >
                                📊 Analytics
                            </button>
                            <button 
                                className="primary-button" 
                                onClick={handleCreateClick}
                                disabled={loading.isLoading}
                            >
                                Create New Session
                            </button>
                        </div>
                    </div>
                </header>

                <main className="app-main">
                    <SessionList
                        sessions={sessions}
                        onEdit={handleEditClick}
                        onRefresh={refreshSessions}
                        onJoinSession={handleJoinSession}
                        onViewSession={handleViewSession}
                        onDelete={handleDeleteSession}
                        service={sessionService}
                        isLoading={loading.isLoading}
                    />
                </main>

                {showForm && (
                    <SessionForm 
                        session={selectedSession} 
                        onSubmit={handleFormSubmit} 
                        onCancel={handleFormClose}
                        isLoading={loading.isLoading}
                    />
                )}
            </div>
        </ErrorBoundary>
    )
}
import React, { useState, useEffect, useMemo } from 'react'
import { PlanningSessionService } from './services/PlanningSessionService'
import SessionList from './components/SessionList'
import SessionForm from './components/SessionForm'
import SessionDashboard from './components/SessionDashboard'
import './app.css'

type ViewMode = 'list' | 'dashboard'

export default function App() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

    const sessionService = useMemo(() => new PlanningSessionService(), [])

    const refreshSessions = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await sessionService.list()
            setSessions(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError('Failed to load planning sessions: ' + errorMessage)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void refreshSessions()
    }, [])

    const handleCreateClick = () => {
        setSelectedSession(null)
        setShowForm(true)
    }

    const handleEditClick = (session: any) => {
        setSelectedSession(session)
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
        setSelectedSession(null)
    }

    const handleFormSubmit = async (formData: any) => {
        setLoading(true)
        try {
            if (selectedSession) {
                const sysId =
                    typeof selectedSession.sys_id === 'object'
                        ? selectedSession.sys_id.value
                        : selectedSession.sys_id
                await sessionService.update(sysId, formData)
            } else {
                await sessionService.create(formData)
            }
            setShowForm(false)
            await refreshSessions()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError('Failed to save planning session: ' + errorMessage)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleJoinSession = async (session: any) => {
        try {
            const sessionId = typeof session.sys_id === 'object' 
                ? session.sys_id.value 
                : session.sys_id
            
            setActiveSessionId(sessionId)
            setViewMode('dashboard')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to join session'
            setError(errorMessage)
            console.error(err)
        }
    }

    const handleViewSession = (session: any) => {
        const sessionId = typeof session.sys_id === 'object' 
            ? session.sys_id.value 
            : session.sys_id
        
        setActiveSessionId(sessionId)
        setViewMode('dashboard')
    }

    const handleExitSession = () => {
        setActiveSessionId(null)
        setViewMode('list')
        refreshSessions()
    }

    // Dashboard view
    if (viewMode === 'dashboard' && activeSessionId) {
        return (
            <SessionDashboard
                sessionId={activeSessionId}
                onExit={handleExitSession}
            />
        )
    }

    // Main session list view
    return (
        <div className="planning-app">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>🃏 Planning Poker</h1>
                        <p>Collaborative estimation made easy</p>
                    </div>
                    <button className="create-button" onClick={handleCreateClick}>
                        Create New Session
                    </button>
                </div>
            </header>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button className="dismiss-button" onClick={() => setError(null)}>
                        ×
                    </button>
                </div>
            )}

            <main className="app-main">
                {loading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>Loading planning sessions...</p>
                    </div>
                ) : (
                    <SessionList
                        sessions={sessions}
                        onEdit={handleEditClick}
                        onRefresh={refreshSessions}
                        onJoinSession={handleJoinSession}
                        onViewSession={handleViewSession}
                        service={sessionService}
                    />
                )}
            </main>

            {showForm && (
                <SessionForm 
                    session={selectedSession} 
                    onSubmit={handleFormSubmit} 
                    onCancel={handleFormClose} 
                />
            )}
        </div>
    )
}

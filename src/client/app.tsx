import React, { useState, useEffect, useMemo } from 'react'
import { PlanningSessionService } from './services/PlanningSessionService'
import SessionList from './components/SessionList'
import SessionForm from './components/SessionForm'
import './app.css'

export default function App() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

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
            // For now, just simulate joining - in real implementation you might navigate to session view
            const sessionCode = typeof session.session_code === 'object' 
                ? session.session_code.value 
                : session.session_code
            
            await sessionService.joinSession(sessionCode)
            alert(`Joined session: ${session.name}`)
            await refreshSessions()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to join session'
            setError(errorMessage)
            console.error(err)
        }
    }

    const handleViewSession = (session: any) => {
        // For now, just show session details - in real implementation you might navigate to session view
        const sessionName = typeof session.name === 'object' ? session.name.value : session.name
        const sessionCode = typeof session.session_code === 'object' ? session.session_code.value : session.session_code
        alert(`Viewing session: ${sessionName} (Code: ${sessionCode})`)
    }

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

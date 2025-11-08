import React, { useState, useEffect, useMemo } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { PlanningSessionService } from './services/PlanningSessionService'
import SessionList from './components/SessionList'
import SessionForm from './components/SessionForm'
import SessionDashboard from './components/SessionDashboard'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { ThemeProvider } from './providers/ThemeProvider'
import { SoundProvider, useSound } from './providers/SoundProvider'
import { QueryProvider } from './providers/QueryProvider'
import { RetroModeProvider } from './providers/RetroModeProvider'
import { DeloreanProvider, useDelorean } from './providers/DeloreanProvider'
import { BackgroundEffects } from './components/BackgroundEffects'
import ThemeToggle from './components/ThemeToggle'
import VariantSelector from './components/VariantSelector'
import { SoundToggle } from './components/SoundToggle'
import { RetroModeIndicator } from './components/RetroModeIndicator'
import { DeloreanTimeCircuits } from './components/easter-eggs/DeloreanTimeCircuits'
import { WarGamesActivation } from './components/easter-eggs/WarGamesActivation'
import { useKonamiCode } from './hooks/useKonamiCode'
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import { PlanningSession, ViewMode } from './types'
import './generated-tailwind.css'
import './app.css'

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode }, 
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Planning Poker App Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Planning Poker Application Error</h2>
                    <p>Something went wrong with the application.</p>
                    <details>
                        <summary>Error Details</summary>
                        <pre>{this.state.error?.message}</pre>
                    </details>
                    <button onClick={() => window.location.reload()}>
                        Reload Application
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

/**
 * AppContent Component
 * Main application logic (separated from provider wrappers)
 */
function AppContent() {
    console.log('Planning Poker App: Component mounting')

    const [sessions, setSessions] = useState<PlanningSession[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedSession, setSelectedSession] = useState<PlanningSession | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

    const sessionService = useMemo(() => new PlanningSessionService(), [])

    // Easter egg hooks
    const { play } = useSound()
    const { showActivation } = useDelorean()
    useDynamicFavicon()

    // Konami Code Easter egg (classic: up up down down left right left right b a)
    useKonamiCode({
        sequence: ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'],
        onSuccess: () => {
            toast.success('🎮 Konami Code Activated!', {
                duration: 5000,
                icon: '🕹️',
                style: {
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                },
            })
            play('themeChange')
        }
    })

    const refreshSessions = async () => {
        try {
            console.log('App.refreshSessions: Starting to refresh sessions...')
            setLoading(true)
            setError(null)
            const data = await sessionService.list()
            console.log('App.refreshSessions: Retrieved sessions:', data)
            setSessions(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            console.error('App.refreshSessions: Error loading sessions:', err)
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

    const handleEditClick = (session: PlanningSession) => {
        setSelectedSession(session)
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
        setSelectedSession(null)
    }

    const handleFormSubmit = async (sessionData: Partial<PlanningSession>) => {
        setLoading(true)
        try {
            console.log('App.handleFormSubmit: Submitting session data:', sessionData)
            if (selectedSession) {
                const sysId =
                    typeof selectedSession.sys_id === 'object'
                        ? selectedSession.sys_id.value
                        : selectedSession.sys_id
                console.log('App.handleFormSubmit: Updating session:', sysId)
                await sessionService.update(sysId, sessionData)
            } else {
                console.log('App.handleFormSubmit: Creating new session')
                const result = await sessionService.create(sessionData)
                console.log('App.handleFormSubmit: Created session result:', result)
            }
            setShowForm(false)
            console.log('App.handleFormSubmit: Refreshing sessions after create/update')
            await refreshSessions()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            console.error('App.handleFormSubmit: Error saving session:', err)
            setError('Failed to save planning session: ' + errorMessage)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleJoinSession = async (session: PlanningSession) => {
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

    const handleViewSession = (session: PlanningSession) => {
        const sessionId = typeof session.sys_id === 'object' 
            ? session.sys_id.value 
            : session.sys_id
        
        setActiveSessionId(sessionId)
        setViewMode('dashboard')
    }

    const handleDeleteSession = async (session: PlanningSession) => {
        try {
            const sessionId = typeof session.sys_id === 'object' && session.sys_id.value
                ? session.sys_id.value 
                : session.sys_id as string

            await sessionService.delete(sessionId)
            await refreshSessions()
        } catch (error) {
            console.error('Error deleting session:', error)
        }
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

    // Analytics view
    if (viewMode === 'analytics') {
        return (
            <div className="planning-app">
                <header className="app-header">
                    <div className="header-content">
                        <div className="header-title">
                            <h1>📊 Planning Poker Analytics</h1>
                            <p>Session insights and team performance</p>
                        </div>
                        <div className="header-actions">
                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                <VariantSelector />
                                <SoundToggle />
                            </div>
                            <button
                                className="create-button secondary"
                                onClick={() => setViewMode('list')}
                            >
                                ← Back to Sessions
                            </button>
                        </div>
                    </div>
                </header>
                <AnalyticsDashboard />
            </div>
        )
    }

    // Main session list view
    return (
        <>
            {/* Easter Egg Components */}
            <RetroModeIndicator />
            <DeloreanTimeCircuits />
            <WarGamesActivation show={showActivation} />

            <div className="planning-app">
                <header className="app-header">
                    <div className="header-content">
                        <div className="header-title">
                            <h1>🃏 MSM Planning Poker</h1>
                            <p>Collaborative estimation made easy</p>
                        </div>
                        <div className="header-actions">
                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                <VariantSelector />
                                <SoundToggle />
                            </div>
                            <button
                                className="analytics-button"
                                onClick={() => setViewMode('analytics')}
                            >
                                📊 Analytics
                            </button>
                            <button className="create-button" onClick={handleCreateClick}>
                                Create New Session
                            </button>
                        </div>
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
                            onDelete={handleDeleteSession}
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
        </>
    )
}

/**
 * App Component (Main Export)
 * Wraps application with provider hierarchy and global UI elements
 *
 * Provider Hierarchy (outermost to innermost):
 * 1. ErrorBoundary - Catches and displays errors
 * 2. QueryProvider - TanStack Query for server state
 * 3. ThemeProvider - Theme mode and variant management
 * 4. RetroModeProvider - CRT mode Easter egg (activated by "RETRO")
 * 5. DeloreanProvider - BTTF time circuits Easter egg (activated by "JOSHUA")
 * 6. SoundProvider - Web Audio API sound effects
 *
 * Global UI Elements:
 * - Toaster - Toast notifications (themed)
 * - BackgroundEffects - Theme-aware background animations
 *
 * Easter Eggs:
 * - Type "RETRO" - Activates CRT scanline mode with green phosphor glow
 * - Type "JOSHUA" - Shows Back to the Future time circuits
 * - Konami Code (↑↑↓↓←→←→BA) - Shows celebratory toast
 */
export default function App() {
    return (
        <ErrorBoundary>
            <QueryProvider>
                <ThemeProvider>
                    <RetroModeProvider>
                        <DeloreanProvider>
                            <SoundProvider>
                                <Toaster
                                    position="bottom-right"
                                    toastOptions={{
                                        duration: 3000,
                                        style: {
                                            background: 'var(--surface)',
                                            color: 'var(--text-primary)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '0.5rem',
                                            padding: '1rem',
                                        },
                                        success: {
                                            iconTheme: {
                                                primary: 'var(--accent)',
                                                secondary: 'var(--surface)',
                                            },
                                        },
                                        error: {
                                            iconTheme: {
                                                primary: '#ef4444',
                                                secondary: 'var(--surface)',
                                            },
                                        },
                                    }}
                                />
                                <BackgroundEffects />
                                <AppContent />
                            </SoundProvider>
                        </DeloreanProvider>
                    </RetroModeProvider>
                </ThemeProvider>
            </QueryProvider>
        </ErrorBoundary>
    )
}

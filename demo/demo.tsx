import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '../src/client/theme/ThemeProvider'
import { ModernHeader } from '../src/client/components/ModernHeader'
import SessionCard from '../src/client/components/SessionCard'
import { CardGrid, NeonButton, GlassCard } from '../src/client/components/StyledComponents'
import { useTheme } from '../src/client/theme/ThemeProvider'
import '../src/client/modern-styles.css'
import './demo.css'

// Mock session data
const mockSessions = [
    {
        sys_id: '1',
        session_name: 'Sprint 24 Planning',
        session_code: 'ABC123',
        status: 'live',
        dealer: { display_value: 'John Doe' },
        participant_count: 8,
        created: '2025-11-01T10:00:00Z'
    },
    {
        sys_id: '2',
        session_name: 'Q4 Feature Estimation',
        session_code: 'XYZ789',
        status: 'planning',
        dealer: { display_value: 'Jane Smith' },
        participant_count: 5,
        created: '2025-11-02T14:30:00Z'
    },
    {
        sys_id: '3',
        session_name: 'Bug Triage Session',
        session_code: 'BUG456',
        status: 'completed',
        dealer: { display_value: 'Mike Johnson' },
        participant_count: 6,
        created: '2025-10-28T09:15:00Z'
    },
    {
        sys_id: '4',
        session_name: 'API Redesign Estimates',
        session_code: 'API999',
        status: 'live',
        dealer: { display_value: 'Sarah Williams' },
        participant_count: 12,
        created: '2025-11-03T11:00:00Z'
    },
    {
        sys_id: '5',
        session_name: 'Mobile App Features',
        session_code: 'MOB777',
        status: 'planning',
        dealer: { display_value: 'Tom Brown' },
        participant_count: 4,
        created: '2025-11-03T08:00:00Z'
    },
    {
        sys_id: '6',
        session_name: 'Database Migration',
        session_code: 'DB2024',
        status: 'cancelled',
        dealer: { display_value: 'Lisa Davis' },
        participant_count: 3,
        created: '2025-10-25T16:00:00Z'
    }
]

function DemoContent() {
    const { theme, mode } = useTheme()
    const [view, setView] = useState<'sessions' | 'analytics'>('sessions')
    const [selectedSession, setSelectedSession] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'planning' | 'completed'>('all')

    // Filter sessions based on status
    const filteredSessions = statusFilter === 'all' 
        ? mockSessions 
        : mockSessions.filter(session => session.status === statusFilter)

    return (
        <div style={{ minHeight: '100vh', background: theme.background }}>
            {view === 'sessions' ? (
                <>
                    <ModernHeader
                        title="🃏 Planning Poker Demo"
                        subtitle="Modern UI showcase with theme switching"
                        showThemeToggle={true}
                        actions={
                            <>
                                <NeonButton 
                                    theme={theme} 
                                    mode={mode}
                                    onClick={() => setView('analytics')}
                                >
                                    📊 Analytics View
                                </NeonButton>
                                <NeonButton 
                                    theme={theme} 
                                    mode={mode}
                                    onClick={() => alert('Create session clicked!')}
                                >
                                    + Create Session
                                </NeonButton>
                            </>
                        }
                    />
                    
                    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
                        <GlassCard theme={theme} mode={mode} style={{ marginBottom: '32px' }}>
                            <h2 style={{ 
                                fontSize: '24px', 
                                marginBottom: '16px',
                                background: mode === 'dark' 
                                    ? 'linear-gradient(135deg, #00d9ff, #7b61ff)'
                                    : 'linear-gradient(135deg, #0066cc, #0052a3)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: 700
                            }}>
                                Welcome to Planning Poker!
                            </h2>
                            <p style={{ color: theme.textSecondary, lineHeight: '1.6' }}>
                                This is a standalone demo to showcase the modern UI design with dark/light theme switching. 
                                Click the theme toggle in the header to switch between neon dark mode and glassmorphism light mode.
                            </p>
                        </GlassCard>

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                            gap: '16px'
                        }}>
                            <h3 style={{ 
                                fontSize: '20px',
                                color: theme.textPrimary,
                                fontWeight: 600,
                                margin: 0
                            }}>
                                Planning Sessions ({filteredSessions.length})
                            </h3>
                            
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <NeonButton
                                    theme={theme}
                                    mode={mode}
                                    onClick={() => setStatusFilter('all')}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        opacity: statusFilter === 'all' ? 1 : 0.6,
                                        transform: statusFilter === 'all' ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                >
                                    All ({mockSessions.length})
                                </NeonButton>
                                <NeonButton
                                    theme={theme}
                                    mode={mode}
                                    onClick={() => setStatusFilter('live')}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        opacity: statusFilter === 'live' ? 1 : 0.6,
                                        transform: statusFilter === 'live' ? 'scale(1.05)' : 'scale(1)',
                                        background: mode === 'dark' 
                                            ? 'rgba(16, 185, 129, 0.2)' 
                                            : 'rgba(16, 185, 129, 0.1)',
                                        borderColor: '#10b981',
                                    }}
                                >
                                    🔴 Live ({mockSessions.filter(s => s.status === 'live').length})
                                </NeonButton>
                                <NeonButton
                                    theme={theme}
                                    mode={mode}
                                    onClick={() => setStatusFilter('planning')}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        opacity: statusFilter === 'planning' ? 1 : 0.6,
                                        transform: statusFilter === 'planning' ? 'scale(1.05)' : 'scale(1)',
                                        background: mode === 'dark' 
                                            ? 'rgba(251, 191, 36, 0.2)' 
                                            : 'rgba(251, 191, 36, 0.1)',
                                        borderColor: '#fbbf24',
                                    }}
                                >
                                    ⏳ Planning ({mockSessions.filter(s => s.status === 'planning').length})
                                </NeonButton>
                                <NeonButton
                                    theme={theme}
                                    mode={mode}
                                    onClick={() => setStatusFilter('completed')}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        opacity: statusFilter === 'completed' ? 1 : 0.6,
                                        transform: statusFilter === 'completed' ? 'scale(1.05)' : 'scale(1)',
                                        background: mode === 'dark' 
                                            ? 'rgba(148, 163, 184, 0.2)' 
                                            : 'rgba(148, 163, 184, 0.1)',
                                        borderColor: '#94a3b8',
                                    }}
                                >
                                    ✅ Completed ({mockSessions.filter(s => s.status === 'completed').length})
                                </NeonButton>
                            </div>
                        </div>
                        
                        {filteredSessions.length === 0 ? (
                            <GlassCard theme={theme} mode={mode} style={{ textAlign: 'center', padding: '48px 24px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
                                <h3 style={{ 
                                    fontSize: '20px', 
                                    color: theme.textPrimary,
                                    marginBottom: '8px',
                                    fontWeight: 600
                                }}>
                                    No {statusFilter === 'all' ? '' : statusFilter} sessions found
                                </h3>
                                <p style={{ color: theme.textSecondary }}>
                                    Try selecting a different filter or create a new session.
                                </p>
                            </GlassCard>
                        ) : (
                            <CardGrid>
                                {filteredSessions.map((session) => (
                                    <SessionCard
                                        key={session.sys_id}
                                        session={session}
                                        onClick={() => {
                                            setSelectedSession(session.sys_id)
                                            alert(`Clicked: ${session.session_name}\nCode: ${session.session_code}`)
                                        }}
                                    />
                                ))}
                            </CardGrid>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <ModernHeader
                        title="📊 Analytics Dashboard"
                        subtitle="Session insights and team performance"
                        showThemeToggle={true}
                        actions={
                            <NeonButton 
                                theme={theme} 
                                mode={mode}
                                onClick={() => setView('sessions')}
                            >
                                ← Back to Sessions
                            </NeonButton>
                        }
                    />
                    
                    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
                        <GlassCard theme={theme} mode={mode}>
                            <h2 style={{ 
                                fontSize: '28px', 
                                marginBottom: '24px',
                                color: theme.textPrimary,
                                fontWeight: 700
                            }}>
                                Analytics View
                            </h2>
                            <p style={{ 
                                color: theme.textSecondary, 
                                fontSize: '16px',
                                lineHeight: '1.6',
                                marginBottom: '24px'
                            }}>
                                This demonstrates the analytics view with the same modern theme. 
                                Charts and metrics would be displayed here in the full application.
                            </p>
                            
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '24px',
                                marginTop: '32px'
                            }}>
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '12px',
                                    background: mode === 'dark' 
                                        ? 'rgba(0, 217, 255, 0.1)' 
                                        : 'rgba(0, 102, 204, 0.08)',
                                    border: `1px solid ${theme.border}`
                                }}>
                                    <div style={{ 
                                        fontSize: '36px', 
                                        fontWeight: 700,
                                        color: theme.primary,
                                        marginBottom: '8px'
                                    }}>
                                        {mockSessions.length}
                                    </div>
                                    <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                                        Total Sessions
                                    </div>
                                </div>
                                
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '12px',
                                    background: mode === 'dark' 
                                        ? 'rgba(123, 97, 255, 0.1)' 
                                        : 'rgba(0, 102, 204, 0.08)',
                                    border: `1px solid ${theme.border}`
                                }}>
                                    <div style={{ 
                                        fontSize: '36px', 
                                        fontWeight: 700,
                                        color: theme.success,
                                        marginBottom: '8px'
                                    }}>
                                        {mockSessions.filter(s => s.status === 'live').length}
                                    </div>
                                    <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                                        Live Now
                                    </div>
                                </div>
                                
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '12px',
                                    background: mode === 'dark' 
                                        ? 'rgba(16, 185, 129, 0.1)' 
                                        : 'rgba(0, 102, 204, 0.08)',
                                    border: `1px solid ${theme.border}`
                                }}>
                                    <div style={{ 
                                        fontSize: '36px', 
                                        fontWeight: 700,
                                        color: theme.textPrimary,
                                        marginBottom: '8px'
                                    }}>
                                        38
                                    </div>
                                    <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                                        Total Participants
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </>
            )}
        </div>
    )
}

function DemoApp() {
    return (
        <ThemeProvider defaultMode="dark">
            <DemoContent />
        </ThemeProvider>
    )
}

// Mount the demo app
const rootElement = document.getElementById('root')
if (rootElement) {
    const root = createRoot(rootElement)
    root.render(<DemoApp />)
}

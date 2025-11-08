import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Eye,
    Rocket,
    Edit,
    Trash2,
    RefreshCw,
    Search,
    X,
    Clock,
    CheckCircle,
    XCircle,
    Circle
} from 'lucide-react'
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
import { GlassPanel, LoadingSpinner, Button } from './ui'
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

/**
 * SessionList - Modernized session list with glass panels and animations
 *
 * Phase 3 Migration:
 * - Uses GlassPanel for card wrapper
 * - Framer Motion stagger animations for grid
 * - Button component for actions with icons
 * - LoadingSpinner for loading states
 * - Lucide icons for better visuals
 * - Responsive grid layout (1/2/3 columns)
 * - Maintained all existing functionality
 */
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
    const getStatusIcon = (status: SessionStatus) => {
        const icons = {
            pending: <Clock className="h-4 w-4" />,
            active: <Circle className="h-4 w-4 fill-current" />,
            completed: <CheckCircle className="h-4 w-4" />,
            cancelled: <XCircle className="h-4 w-4" />
        }
        return icons[status] || <Circle className="h-4 w-4" />
    }

    const getStatusClass = (status: SessionStatus): string => {
        const statusClasses: Record<SessionStatus, string> = {
            pending: 'status-pending',
            active: 'status-active',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        }
        return statusClasses[status] || ''
    }

    const getProgressColor = (percentage: number): string => {
        if (percentage >= 80) return '#10b981' // green
        if (percentage >= 50) return '#f59e0b' // amber
        return '#ef4444' // red
    }

    // Framer Motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24
            }
        }
    }

    return (
        <div className="session-list">
            {/* Header with search and filters */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-heading uppercase tracking-wider text-accent">
                        Planning Sessions
                    </h2>
                    <span className="rounded-full bg-accent-muted px-3 py-1 text-sm text-accent">
                        {filteredSessions.length} of {sessions.length}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setJoinModal(prev => ({ ...prev, isOpen: true }))}
                        disabled={isLoading}
                        icon={<Rocket className="h-4 w-4" />}
                    >
                        Join Session
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onRefresh}
                        disabled={isLoading}
                        icon={<RefreshCw className="h-4 w-4" />}
                        aria-label="Refresh sessions"
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent/60" />
                    <input
                        type="text"
                        placeholder="Search sessions by name, description, or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-accent"
                        disabled={isLoading}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent/60 hover:text-accent"
                            aria-label="Clear search"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as SessionStatus | 'all')}
                    className="rounded-lg border border-border bg-surface px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
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

            {/* Sessions Grid */}
            {isLoading && sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-accent/80">Loading sessions...</p>
                </div>
            ) : filteredSessions.length === 0 ? (
                <GlassPanel className="p-12 text-center">
                    <div className="mx-auto max-w-md">
                        <div className="mb-4 text-6xl">🃏</div>
                        <h3 className="mb-2 text-xl font-heading text-accent">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No matching sessions found'
                                : 'No planning sessions yet'
                            }
                        </h3>
                        <p className="mb-6 text-accent/70">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Create a new session or join an existing one using a session code.'
                            }
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setSearchTerm('')
                                    setStatusFilter('all')
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </GlassPanel>
            ) : (
                <motion.div
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
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
                            <motion.div
                                key={getValue(session.sys_id)}
                                variants={cardVariants}
                            >
                                <GlassPanel className={`flex h-full flex-col p-6 ${getStatusClass(status)}`}>
                                    {/* Header */}
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(status)}
                                            <h3 className="font-heading text-lg font-bold" title={name}>
                                                {name}
                                            </h3>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs uppercase ${getStatusClass(status)}`}>
                                            {SESSION_STATUS_LABELS[status]}
                                        </span>
                                    </div>

                                    {/* Session Code */}
                                    <div className="mb-3 flex items-center gap-2 text-sm">
                                        <span className="text-accent/70">Code:</span>
                                        <code className="rounded bg-accent-muted px-2 py-1 font-mono text-accent">
                                            {sessionCode}
                                        </code>
                                    </div>

                                    {/* Description */}
                                    {description && (
                                        <p className="mb-4 line-clamp-2 text-sm text-accent/70" title={description}>
                                            {description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="mb-4 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-accent/70">Stories:</span>
                                            <span className="font-medium">
                                                {completedStories} / {totalStories}
                                            </span>
                                        </div>

                                        {consensusRate > 0 && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-accent/70">Consensus:</span>
                                                <span className="font-medium">
                                                    {formatPercentage(consensusRate)}
                                                </span>
                                            </div>
                                        )}

                                        {totalStories > 0 && (
                                            <div>
                                                <div className="mb-1 flex items-center justify-between text-xs">
                                                    <span className="text-accent/70">Progress</span>
                                                    <span className="font-medium">{formatPercentage(progressPercentage)}</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-accent-muted">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: getProgressColor(progressPercentage) }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progressPercentage}%` }}
                                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Created Date */}
                                    <div className="mb-4 text-xs text-accent/60">
                                        Created: {formatDate(createdOn)}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSessionAction(session, 'view')}
                                            disabled={isLoading}
                                            icon={<Eye className="h-4 w-4" />}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleSessionAction(session, 'join')}
                                            disabled={isLoading || status === 'completed' || status === 'cancelled'}
                                            icon={<Rocket className="h-4 w-4" />}
                                        >
                                            Join
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleSessionAction(session, 'edit')}
                                            disabled={isLoading}
                                            icon={<Edit className="h-4 w-4" />}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleSessionAction(session, 'delete')}
                                            disabled={isLoading || status === 'active'}
                                            icon={<Trash2 className="h-4 w-4" />}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </GlassPanel>
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}

            {/* Join Session Modal */}
            <AnimatePresence>
                {joinModal.isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => e.target === e.currentTarget && setJoinModal(prev => ({ ...prev, isOpen: false }))}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <GlassPanel className="w-full max-w-md p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-heading uppercase tracking-wider text-accent">
                                        Join Planning Session
                                    </h3>
                                    <button
                                        className="rounded-lg p-1 hover:bg-accent-muted"
                                        onClick={() => setJoinModal(prev => ({ ...prev, isOpen: false }))}
                                        disabled={joinModal.isJoining}
                                        aria-label="Close modal"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <p className="mb-4 text-sm text-accent/70">
                                    Enter the 6-character session code provided by your session host:
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={joinModal.code}
                                        onChange={(e) => setJoinModal(prev => ({
                                            ...prev,
                                            code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6),
                                            error: null
                                        }))}
                                        placeholder="Enter session code (e.g., ABC123)"
                                        maxLength={6}
                                        className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-center font-mono text-lg uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent"
                                        disabled={joinModal.isJoining}
                                        autoFocus
                                    />
                                </div>

                                {joinModal.error && (
                                    <motion.div
                                        className="mb-4 rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-500"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        role="alert"
                                    >
                                        {joinModal.error}
                                    </motion.div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setJoinModal(prev => ({ ...prev, isOpen: false }))}
                                        disabled={joinModal.isJoining}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleJoinByCode}
                                        disabled={joinModal.isJoining || !joinModal.code.trim() || joinModal.code.length < 6}
                                        loading={joinModal.isJoining}
                                        className="flex-1"
                                    >
                                        {joinModal.isJoining ? 'Joining...' : 'Join Session'}
                                    </Button>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

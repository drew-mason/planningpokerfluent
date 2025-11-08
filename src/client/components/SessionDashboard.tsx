import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, FileText, Plus, X, LogOut, Crown, BarChart, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import VotingSession from './VotingSession'
import { PlanningSessionService } from '../services/PlanningSessionService'
import { StoryService } from '../services/StoryService'
import { SessionParticipant, getValue } from '../types'
import { GlassPanel } from './ui/GlassPanel'
import { Button } from './ui/Button'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { useSound } from '../providers/SoundProvider'

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

type TabId = 'voting' | 'participants' | 'stories' | 'info'

export default function SessionDashboard({ sessionId, onExit }: SessionDashboardProps) {
    const [session, setSession] = useState<any>(null)
    const [stories, setStories] = useState<SessionStory[]>([])
    const [participants, setParticipants] = useState<SessionParticipant[]>([])
    const [currentStory, setCurrentStory] = useState<SessionStory | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDealer, setIsDealer] = useState(false)
    const [showAddStory, setShowAddStory] = useState(false)
    const [newStoryTitle, setNewStoryTitle] = useState('')
    const [newStoryDescription, setNewStoryDescription] = useState('')
    const [activeTab, setActiveTab] = useState<TabId>('voting')

    const { play } = useSound()
    const sessionService = new PlanningSessionService()
    const storyService = new StoryService()

    const loadSessionData = useCallback(async () => {
        try {
            setIsLoading(true)

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
            toast.error(errorMessage)
            console.error('SessionDashboard.loadSessionData:', err)
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
        setActiveTab('voting')
        play('cardSelect')
        if (isDealer && story.status === 'pending') {
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
            toast.success('Story added successfully!')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add story'
            toast.error(errorMessage)
        }
    }

    const handleDeleteStory = async (storyId: string) => {
        try {
            await storyService.deleteStory(storyId)
            await loadSessionData()

            // If deleted story was current, select another
            if (currentStory?.sys_id === storyId) {
                const remainingStories = stories.filter(s => s.sys_id !== storyId)
                setCurrentStory(remainingStories[0] || null)
            }
            toast.success('Story deleted')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete story'
            toast.error(errorMessage)
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
            <div className="min-h-screen flex items-center justify-center">
                <GlassPanel className="flex flex-col items-center gap-4 p-8">
                    <LoadingSpinner size="lg" />
                    <h3 className="text-xl font-semibold text-text">Loading Planning Session...</h3>
                    <p className="text-text-muted">Setting up your collaborative estimation workspace</p>
                </GlassPanel>
            </div>
        )
    }

    const sessionName = typeof session?.name === 'object' ? session.name.display_value : session?.name
    const sessionCode = typeof session?.session_code === 'object' ? session.session_code.display_value : session?.session_code
    const progress = getSessionProgress()

    return (
        <div className="min-h-screen p-4 md:p-6 space-y-6">
            {/* Session Header */}
            <GlassPanel>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-text">
                                🃏 {sessionName}
                            </h1>
                            {isDealer && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-400/30"
                                >
                                    <Crown className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Dealer</span>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Code:</span>
                                <code className="px-2 py-1 bg-surface-darker rounded font-mono text-accent">
                                    {sessionCode}
                                </code>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>
                                    {stories.filter(s => s.status === 'completed').length} / {stories.length} stories completed
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-surface-darker rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-accent to-accent-bright rounded-full"
                            />
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        icon={<LogOut className="w-4 h-4" />}
                        onClick={onExit}
                    >
                        Exit Session
                    </Button>
                </div>
            </GlassPanel>

            {/* Tab Navigation */}
            <GlassPanel className="p-0 overflow-hidden">
                <div className="flex border-b border-accent/20">
                    {[
                        { id: 'voting' as TabId, label: 'Voting', icon: FileText },
                        { id: 'participants' as TabId, label: 'Participants', icon: Users },
                        { id: 'stories' as TabId, label: 'Stories', icon: BarChart },
                        { id: 'info' as TabId, label: 'Info', icon: Settings }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id)
                                play('cardSelect')
                            }}
                            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'text-accent'
                                    : 'text-text-muted hover:text-text'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>

                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {/* Voting Tab */}
                        {activeTab === 'voting' && (
                            <motion.div
                                key="voting"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
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
                            </motion.div>
                        )}

                        {/* Participants Tab */}
                        {activeTab === 'participants' && (
                            <motion.div
                                key="participants"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-accent" />
                                    <h3 className="text-xl font-semibold text-text">
                                        Participants ({participants.length})
                                    </h3>
                                </div>

                                <div className="grid gap-3">
                                    {participants.map((participant, index) => {
                                        const userName = typeof participant.user === 'object'
                                            ? participant.user.display_value
                                            : participant.user

                                        return (
                                            <motion.div
                                                key={getValue(participant.sys_id)}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <GlassPanel className="flex items-center gap-4 p-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-bright flex items-center justify-center text-white font-semibold">
                                                        {userName?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-text">{userName}</div>
                                                        <div className="text-sm text-text-muted flex items-center gap-1">
                                                            {getValue(participant.role) === 'dealer' && <Crown className="w-3 h-3" />}
                                                            {getValue(participant.role)}
                                                        </div>
                                                    </div>
                                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Online" />
                                                </GlassPanel>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Stories Tab */}
                        {activeTab === 'stories' && (
                            <motion.div
                                key="stories"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <BarChart className="w-5 h-5 text-accent" />
                                        <h3 className="text-xl font-semibold text-text">
                                            Stories ({stories.length})
                                        </h3>
                                    </div>
                                    {isDealer && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            icon={<Plus className="w-4 h-4" />}
                                            onClick={() => setShowAddStory(true)}
                                        >
                                            Add Story
                                        </Button>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    {stories.map((story, index) => {
                                        const storyTitle = typeof story.story_title === 'object'
                                            ? story.story_title.display_value
                                            : story.story_title

                                        return (
                                            <motion.div
                                                key={story.sys_id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleStorySelect(story)}
                                                className="cursor-pointer"
                                            >
                                                <GlassPanel className={`p-4 transition-all ${
                                                    currentStory?.sys_id === story.sys_id
                                                        ? 'ring-2 ring-accent'
                                                        : 'hover:bg-surface-darker/50'
                                                }`}>
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-2xl">{getStoryStatusIcon(story.status)}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-text truncate">{storyTitle}</div>
                                                            <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
                                                                <span>#{story.sequence_order}</span>
                                                                {story.final_estimate && (
                                                                    <span className="px-2 py-0.5 bg-accent/20 text-accent rounded">
                                                                        Est: {story.final_estimate}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {isDealer && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    if (confirm('Delete this story?')) {
                                                                        handleDeleteStory(story.sys_id)
                                                                    }
                                                                }}
                                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </GlassPanel>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Info Tab */}
                        {activeTab === 'info' && (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings className="w-5 h-5 text-accent" />
                                    <h3 className="text-xl font-semibold text-text">Session Information</h3>
                                </div>

                                <GlassPanel className="p-6 space-y-4">
                                    <div className="grid gap-4">
                                        <div>
                                            <div className="text-sm text-text-muted">Session Name</div>
                                            <div className="text-lg font-semibold text-text">{sessionName}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-text-muted">Session Code</div>
                                            <code className="text-lg font-mono text-accent">{sessionCode}</code>
                                        </div>
                                        <div>
                                            <div className="text-sm text-text-muted">Progress</div>
                                            <div className="text-lg font-semibold text-text">{progress}%</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-text-muted">Total Stories</div>
                                            <div className="text-lg font-semibold text-text">{stories.length}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-text-muted">Participants</div>
                                            <div className="text-lg font-semibold text-text">{participants.length}</div>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassPanel>

            {/* Add Story Modal */}
            <AnimatePresence>
                {showAddStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddStory(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md"
                        >
                            <GlassPanel className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-text">Add New Story</h3>
                                    <button
                                        onClick={() => setShowAddStory(false)}
                                        className="text-text-muted hover:text-text transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="story-title" className="block text-sm font-medium text-text mb-2">
                                            Story Title *
                                        </label>
                                        <input
                                            id="story-title"
                                            type="text"
                                            value={newStoryTitle}
                                            onChange={(e) => setNewStoryTitle(e.target.value)}
                                            placeholder="Enter story title"
                                            autoFocus
                                            className="w-full px-4 py-2 bg-surface border border-accent/30 rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="story-description" className="block text-sm font-medium text-text mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="story-description"
                                            value={newStoryDescription}
                                            onChange={(e) => setNewStoryDescription(e.target.value)}
                                            placeholder="Optional: Add story details"
                                            rows={3}
                                            className="w-full px-4 py-2 bg-surface border border-accent/30 rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowAddStory(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleAddStory}
                                        disabled={!newStoryTitle.trim()}
                                    >
                                        Add Story
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

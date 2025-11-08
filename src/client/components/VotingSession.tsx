import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Eye, RefreshCw, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import EstimationScale from './EstimationScale'
import { VotingService } from '../services/VotingService'
import { StoryService } from '../services/StoryService'
import { ServiceNowDisplayValue, getValue, getDisplayValue } from '../types'
import { GlassPanel } from './ui/GlassPanel'
import { Button } from './ui/Button'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { useSound } from '../providers/SoundProvider'

interface Story {
    sys_id: string
    story_title: ServiceNowDisplayValue | string
    description: ServiceNowDisplayValue | string
    status: ServiceNowDisplayValue | string
    session: ServiceNowDisplayValue | string
}

interface VotingSessionProps {
    sessionId: string
    currentStory?: Story | null
    isDealer?: boolean
    onStoryComplete?: (storyId: string, finalEstimate: string) => void
    onNextStory?: () => void
}

interface VoteResult {
    voter: string
    estimate: string
    confidence: string
    voted_at: string
}

interface VotingStats {
    totalVotes: number
    consensus: boolean
    consensusEstimate?: string | null
    avgEstimate?: number
    medianEstimate?: number
    estimates: Record<string, number>
}

export default function VotingSession({
    sessionId,
    currentStory,
    isDealer = false,
    onStoryComplete,
    onNextStory
}: VotingSessionProps) {
    const [userVote, setUserVote] = useState<string>('')
    const [allVotes, setAllVotes] = useState<VoteResult[]>([])
    const [votingStats, setVotingStats] = useState<VotingStats | null>(null)
    const [isRevealed, setIsRevealed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [estimationScale, setEstimationScale] = useState<'poker' | 'fibonacci' | 'tshirt'>('tshirt')

    const { play } = useSound()
    const votingService = new VotingService()
    const storyService = new StoryService()

    // Load existing vote and stats when story changes
    useEffect(() => {
        if (currentStory?.sys_id) {
            loadVotingData()
        }
    }, [currentStory?.sys_id])

    const loadVotingData = async () => {
        if (!currentStory?.sys_id) return

        try {
            setIsLoading(true)

            const [existingVote, votes, stats] = await Promise.all([
                votingService.getUserVote(currentStory.sys_id),
                votingService.getStoryVotes(currentStory.sys_id),
                votingService.getVotingStats(currentStory.sys_id)
            ])

            setUserVote(existingVote?.estimate || '')
            setAllVotes(votes)
            setVotingStats(stats)
            setIsRevealed(false)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load voting data'
            toast.error(errorMessage)
            console.error('VotingSession.loadVotingData:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVote = async (estimate: string) => {
        if (!currentStory?.sys_id) return

        try {
            setIsLoading(true)

            if (estimate === '') {
                // Clear vote
                setUserVote('')
                await loadVotingData()
                toast.success('Vote cleared')
                return
            }

            if (userVote) {
                // Update existing vote
                const existingVote = await votingService.getUserVote(currentStory.sys_id)
                if (existingVote) {
                    await votingService.updateVote(existingVote.sys_id, estimate)
                }
            } else {
                // Submit new vote
                await votingService.submitVote(currentStory.sys_id, estimate)
            }

            setUserVote(estimate)
            await loadVotingData()
            toast.success(`Vote submitted: ${estimate}`)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit vote'
            toast.error(errorMessage)
            console.error('VotingSession.handleVote:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRevealVotes = async () => {
        play('reveal')
        setIsRevealed(true)
        await loadVotingData()
        toast.success('Votes revealed!')
    }

    const handleClearVotes = async () => {
        if (!currentStory?.sys_id) return

        try {
            setIsLoading(true)
            await votingService.clearStoryVotes(currentStory.sys_id)
            await loadVotingData()
            setIsRevealed(false)
            setUserVote('')
            play('roundStart')
            toast.success('Votes cleared. Ready for new round!')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to clear votes'
            toast.error(errorMessage)
            console.error('VotingSession.handleClearVotes:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFinalizeStory = async (finalEstimate: string) => {
        if (!currentStory?.sys_id) return

        try {
            setIsLoading(true)
            await votingService.finalizeStoryVoting(currentStory.sys_id, finalEstimate)
            play('timerComplete')
            toast.success(`Story finalized with estimate: ${finalEstimate}`)
            onStoryComplete?.(currentStory.sys_id, finalEstimate)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to finalize story'
            toast.error(errorMessage)
            console.error('VotingSession.handleFinalizeStory:', err)
        } finally {
            setIsLoading(false)
        }
    }

    if (!currentStory) {
        return (
            <GlassPanel className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="text-6xl">📝</div>
                    <h3 className="text-2xl font-semibold text-text">No Story Selected</h3>
                    <p className="text-text-muted">Select a story from the session to start voting</p>
                </div>
            </GlassPanel>
        )
    }

    const isVotingDisabled = isLoading || getValue(currentStory?.status) === 'completed'
    const hasVotes = allVotes.length > 0
    const storyTitle = getDisplayValue(currentStory?.story_title)
    const storyDescription = getDisplayValue(currentStory?.description)
    const currentStatus = getValue(currentStory?.status)

    return (
        <div className="space-y-6">
            {/* Story Header */}
            <GlassPanel>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-bold text-text">{storyTitle}</h2>
                        {storyDescription && (
                            <p className="text-text-muted">{storyDescription}</p>
                        )}
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            currentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                            currentStatus === 'voting' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' :
                            'bg-green-500/20 text-green-400 border border-green-400/30'
                        }`}
                    >
                        {currentStatus?.toUpperCase()}
                    </motion.div>
                </div>
            </GlassPanel>

            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <GlassPanel className="flex flex-col items-center gap-4 p-8">
                            <LoadingSpinner size="lg" />
                            <span className="text-text">Processing...</span>
                        </GlassPanel>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Estimation Scale */}
            <EstimationScale
                selectedValue={userVote}
                onVote={handleVote}
                disabled={isVotingDisabled}
                variant={estimationScale}
                isRevealed={isRevealed}
            />

            {/* Voting Results */}
            <AnimatePresence>
                {hasVotes && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GlassPanel>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-accent" />
                                        <h3 className="text-xl font-semibold text-text">Voting Results</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <span className="font-medium">
                                            {votingStats?.totalVotes || 0} vote{(votingStats?.totalVotes || 0) !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                {!isRevealed ? (
                                    <div className="space-y-4">
                                        <motion.div
                                            className="flex flex-wrap gap-3 justify-center"
                                            variants={{
                                                show: { transition: { staggerChildren: 0.1 } }
                                            }}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            {Array.from({ length: allVotes.length }).map((_, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={{
                                                        hidden: { opacity: 0, scale: 0 },
                                                        show: { opacity: 1, scale: 1 }
                                                    }}
                                                    className="w-16 h-24 glass-panel flex items-center justify-center text-4xl"
                                                >
                                                    🃏
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        {isDealer && (
                                            <div className="flex justify-center">
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    icon={<Eye className="w-5 h-5" />}
                                                    onClick={handleRevealVotes}
                                                    disabled={isLoading}
                                                >
                                                    Reveal Votes
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        {/* Vote Breakdown */}
                                        <div className="space-y-3">
                                            {Object.entries(votingStats?.estimates || {}).map(([estimate, count]) => (
                                                <motion.div
                                                    key={estimate}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-semibold text-text">{estimate}</span>
                                                        <span className="text-text-muted">
                                                            {count as number} vote{(count as number) !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="h-3 bg-surface-darker rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${((count as number) / (votingStats?.totalVotes || 1)) * 100}%` }}
                                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                                            className="h-full bg-gradient-to-r from-accent to-accent-bright rounded-full"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Consensus Indicator */}
                                        {votingStats?.consensus ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 flex items-center gap-3"
                                            >
                                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                                <div>
                                                    <div className="font-semibold text-green-400">Consensus Achieved!</div>
                                                    <div className="text-sm text-green-300">
                                                        Final estimate: <strong>{votingStats.consensusEstimate}</strong>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-text-muted">Average</div>
                                                    <div className="text-2xl font-bold text-text">
                                                        {votingStats?.avgEstimate?.toFixed(1) || '0.0'}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-text-muted">Median</div>
                                                    <div className="text-2xl font-bold text-text">
                                                        {votingStats?.medianEstimate?.toFixed(1) || '0.0'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </GlassPanel>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dealer Controls */}
            {isDealer && isRevealed && (
                <GlassPanel>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="text-xl">👑</div>
                            <h4 className="text-lg font-semibold text-text">Dealer Controls</h4>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="secondary"
                                icon={<RefreshCw className="w-4 h-4" />}
                                onClick={handleClearVotes}
                                disabled={isLoading}
                            >
                                Clear Votes & Re-vote
                            </Button>

                            {votingStats?.consensus ? (
                                <Button
                                    variant="primary"
                                    icon={<CheckCircle className="w-4 h-4" />}
                                    onClick={() => handleFinalizeStory(votingStats.consensusEstimate || '0')}
                                    disabled={isLoading}
                                >
                                    Accept Consensus ({votingStats.consensusEstimate})
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleFinalizeStory(votingStats?.avgEstimate?.toString() || '0')}
                                        disabled={isLoading}
                                    >
                                        Finalize with Average ({votingStats?.avgEstimate?.toFixed(1)})
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleFinalizeStory(votingStats?.medianEstimate?.toString() || '0')}
                                        disabled={isLoading}
                                    >
                                        Finalize with Median ({votingStats?.medianEstimate?.toFixed(1)})
                                    </Button>
                                </>
                            )}

                            <Button
                                variant="ghost"
                                onClick={onNextStory}
                                disabled={isLoading}
                            >
                                Next Story →
                            </Button>
                        </div>
                    </div>
                </GlassPanel>
            )}

            {/* Scale Selector */}
            <GlassPanel>
                <div className="flex items-center justify-between">
                    <label htmlFor="estimation-scale" className="text-text font-medium">
                        Estimation Scale:
                    </label>
                    <select
                        id="estimation-scale"
                        value={estimationScale}
                        onChange={(e) => {
                            setEstimationScale(e.target.value as 'poker' | 'fibonacci' | 'tshirt')
                            play('themeChange')
                        }}
                        disabled={isVotingDisabled}
                        className="bg-surface border border-accent/30 rounded-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                    >
                        <option value="poker">Planning Poker</option>
                        <option value="fibonacci">Fibonacci</option>
                        <option value="tshirt">T-Shirt Sizes</option>
                    </select>
                </div>
            </GlassPanel>
        </div>
    )
}

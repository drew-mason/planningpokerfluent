import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Plus, Edit, Trash2, GripVertical, Check, X, FileText, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { StoryService } from '../services/StoryService'
import { GlassPanel } from './ui/GlassPanel'
import { Button } from './ui/Button'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { useSound } from '../providers/SoundProvider'

interface StoryManagerProps {
    sessionId: string
    onClose: () => void
    onStoriesUpdated?: () => void
}

interface Story {
    sys_id: string
    story_title: any
    description?: any
    sequence_order: number
    status: string
    final_estimate?: string
    consensus_achieved?: boolean
}

export default function StoryManager({ sessionId, onClose, onStoriesUpdated }: StoryManagerProps) {
    const [stories, setStories] = useState<Story[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showBulkImport, setShowBulkImport] = useState(false)
    const [bulkStories, setBulkStories] = useState('')
    const [editingStory, setEditingStory] = useState<Story | null>(null)
    const [editForm, setEditForm] = useState({ title: '', description: '' })

    const { play } = useSound()
    const storyService = new StoryService()

    const loadStories = async () => {
        try {
            setIsLoading(true)
            const sessionStories = await storyService.getSessionStories(sessionId)
            setStories(sessionStories)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load stories'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadStories()
    }, [sessionId])

    const handleReorder = async (newStories: Story[]) => {
        setStories(newStories)

        try {
            const reorderData = newStories.map((story, index) => ({
                storyId: story.sys_id,
                newOrder: index + 1
            }))

            await storyService.reorderStories(sessionId, reorderData)
            onStoriesUpdated?.()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reorder stories'
            toast.error(errorMessage)
            await loadStories()
        }
    }

    const handleEditStory = (story: Story) => {
        const title = typeof story.story_title === 'object'
            ? story.story_title.display_value
            : story.story_title
        const description = typeof story.description === 'object'
            ? story.description.display_value
            : story.description

        setEditingStory(story)
        setEditForm({
            title: title || '',
            description: description || ''
        })
        play('cardSelect')
    }

    const handleSaveEdit = async () => {
        if (!editingStory || !editForm.title.trim()) return

        try {
            await storyService.updateStory(editingStory.sys_id, {
                story_title: editForm.title.trim(),
                description: editForm.description.trim() || undefined
            })

            setEditingStory(null)
            setEditForm({ title: '', description: '' })
            await loadStories()
            onStoriesUpdated?.()
            toast.success('Story updated!')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update story'
            toast.error(errorMessage)
        }
    }

    const handleDeleteStory = async (story: Story) => {
        const title = typeof story.story_title === 'object'
            ? story.story_title.display_value
            : story.story_title

        try {
            await storyService.deleteStory(story.sys_id)
            await loadStories()
            onStoriesUpdated?.()
            toast.success('Story deleted')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete story'
            toast.error(errorMessage)
        }
    }

    const handleResetStory = async (story: Story) => {
        try {
            await storyService.resetStory(story.sys_id)
            await loadStories()
            onStoriesUpdated?.()
            toast.success('Story voting reset!')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reset story'
            toast.error(errorMessage)
        }
    }

    const handleBulkImport = async () => {
        if (!bulkStories.trim()) return

        try {
            const storyLines = bulkStories
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)

            const storiesToCreate = storyLines.map(line => {
                const [title, description] = line.split('|').map(part => part.trim())
                return {
                    story_title: title,
                    description: description || undefined
                }
            })

            await storyService.bulkCreateStories(sessionId, storiesToCreate)
            setBulkStories('')
            setShowBulkImport(false)
            await loadStories()
            onStoriesUpdated?.()
            toast.success(`${storiesToCreate.length} stories imported!`)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to import stories'
            toast.error(errorMessage)
        }
    }

    const getStoryStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return '⏳'
            case 'voting': return '🗳️'
            case 'completed': return '✅'
            default: return '📝'
        }
    }

    const getStoryStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
            case 'voting': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
            case 'completed': return 'bg-green-500/20 text-green-400 border-green-400/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
                <GlassPanel className="flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-6 h-6 text-accent" />
                                <h2 className="text-2xl font-bold text-text">Story Management</h2>
                            </div>
                            <p className="text-sm text-text-muted mt-1">
                                Drag to reorder • Click to edit • Delete to remove
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<Upload className="w-4 h-4" />}
                                onClick={() => setShowBulkImport(true)}
                            >
                                Bulk Import
                            </Button>
                            <button
                                onClick={onClose}
                                className="text-text-muted hover:text-text transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto py-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <LoadingSpinner size="lg" />
                                <p className="text-text-muted mt-4">Loading stories...</p>
                            </div>
                        ) : stories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-text mb-2">No Stories Yet</h3>
                                <p className="text-text-muted mb-6">Start by adding stories to your planning session</p>
                                <Button
                                    variant="primary"
                                    icon={<Plus className="w-4 h-4" />}
                                    onClick={() => setShowBulkImport(true)}
                                >
                                    Add Stories
                                </Button>
                            </div>
                        ) : (
                            <Reorder.Group
                                axis="y"
                                values={stories}
                                onReorder={handleReorder}
                                className="space-y-3"
                            >
                                {stories.map((story, index) => {
                                    const title = typeof story.story_title === 'object'
                                        ? story.story_title.display_value
                                        : story.story_title
                                    const description = typeof story.description === 'object'
                                        ? story.description.display_value
                                        : story.description

                                    return (
                                        <Reorder.Item
                                            key={story.sys_id}
                                            value={story}
                                            className="touch-none"
                                        >
                                            <GlassPanel className="p-4 hover:bg-surface-darker/50 transition-colors cursor-move">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex items-center gap-2 text-text-muted">
                                                        <GripVertical className="w-5 h-5" />
                                                        <span className="font-mono text-sm">#{index + 1}</span>
                                                    </div>

                                                    <div className="text-2xl">
                                                        {getStoryStatusIcon(story.status)}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-text">{title}</div>
                                                        {description && (
                                                            <p className="text-sm text-text-muted mt-1">{description}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className={`px-2 py-1 text-xs rounded border ${getStoryStatusColor(story.status)}`}>
                                                                {story.status.toUpperCase()}
                                                            </span>
                                                            {story.final_estimate && (
                                                                <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded">
                                                                    Est: {story.final_estimate}
                                                                </span>
                                                            )}
                                                            {story.consensus_achieved && (
                                                                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                                                                    🎯 Consensus
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditStory(story)}
                                                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                                                            title="Edit story"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>

                                                        {story.status === 'completed' && (
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm(`Reset voting for "${title}"?`)) {
                                                                        handleResetStory(story)
                                                                    }
                                                                }}
                                                                className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded transition-colors"
                                                                title="Reset voting"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Delete "${title}"?`)) {
                                                                    handleDeleteStory(story)
                                                                }
                                                            }}
                                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                            title="Delete story"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </GlassPanel>
                                        </Reorder.Item>
                                    )
                                })}
                            </Reorder.Group>
                        )}
                    </div>
                </GlassPanel>
            </motion.div>

            {/* Edit Story Modal */}
            <AnimatePresence>
                {editingStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
                        onClick={() => setEditingStory(null)}
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
                                    <h3 className="text-xl font-semibold text-text">Edit Story</h3>
                                    <button
                                        onClick={() => setEditingStory(null)}
                                        className="text-text-muted hover:text-text transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="edit-title" className="block text-sm font-medium text-text mb-2">
                                            Story Title *
                                        </label>
                                        <input
                                            id="edit-title"
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Enter story title"
                                            autoFocus
                                            className="w-full px-4 py-2 bg-surface border border-accent/30 rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="edit-description" className="block text-sm font-medium text-text mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="edit-description"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Optional: Add story details"
                                            rows={4}
                                            className="w-full px-4 py-2 bg-surface border border-accent/30 rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setEditingStory(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleSaveEdit}
                                        disabled={!editForm.title.trim()}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bulk Import Modal */}
            <AnimatePresence>
                {showBulkImport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
                        onClick={() => setShowBulkImport(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl"
                        >
                            <GlassPanel className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-accent" />
                                        <h3 className="text-xl font-semibold text-text">Bulk Import Stories</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowBulkImport(false)}
                                        className="text-text-muted hover:text-text transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-2">Instructions:</h4>
                                    <ul className="text-sm text-text-muted space-y-1">
                                        <li>• Enter one story per line</li>
                                        <li>• Format: <code className="text-accent">Title</code> or <code className="text-accent">Title|Description</code></li>
                                        <li>• Example: <code className="text-accent">User Login|As a user, I want to login</code></li>
                                    </ul>
                                </div>

                                <div>
                                    <label htmlFor="bulk-stories" className="block text-sm font-medium text-text mb-2">
                                        Stories to Import
                                    </label>
                                    <textarea
                                        id="bulk-stories"
                                        value={bulkStories}
                                        onChange={(e) => setBulkStories(e.target.value)}
                                        placeholder={`User Registration
User Login|As a user, I want to login securely
Password Reset
Profile Management|User can update their profile information`}
                                        rows={10}
                                        className="w-full px-4 py-2 bg-surface border border-accent/30 rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-text-muted">
                                        <strong className="text-text">{bulkStories.split('\n').filter(line => line.trim()).length}</strong> stories to import
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowBulkImport(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            icon={<Upload className="w-4 h-4" />}
                                            onClick={handleBulkImport}
                                            disabled={!bulkStories.trim()}
                                        >
                                            Import Stories
                                        </Button>
                                    </div>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

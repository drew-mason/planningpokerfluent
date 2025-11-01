import React, { useState, useEffect } from 'react'
import { StoryService } from '../services/StoryService'
import './StoryManager.css'

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
    const [error, setError] = useState<string | null>(null)
    const [draggedStory, setDraggedStory] = useState<Story | null>(null)
    const [showBulkImport, setShowBulkImport] = useState(false)
    const [bulkStories, setBulkStories] = useState('')
    const [editingStory, setEditingStory] = useState<Story | null>(null)
    const [editForm, setEditForm] = useState({ title: '', description: '' })

    const storyService = new StoryService()

    const loadStories = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const sessionStories = await storyService.getSessionStories(sessionId)
            setStories(sessionStories)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load stories'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadStories()
    }, [sessionId])

    const handleDragStart = (e: React.DragEvent, story: Story) => {
        setDraggedStory(story)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = async (e: React.DragEvent, targetStory: Story) => {
        e.preventDefault()
        
        if (!draggedStory || draggedStory.sys_id === targetStory.sys_id) {
            setDraggedStory(null)
            return
        }

        try {
            const draggedIndex = stories.findIndex(s => s.sys_id === draggedStory.sys_id)
            const targetIndex = stories.findIndex(s => s.sys_id === targetStory.sys_id)
            
            const newStories = [...stories]
            const [removed] = newStories.splice(draggedIndex, 1)
            newStories.splice(targetIndex, 0, removed)

            // Update sequence orders
            const reorderData = newStories.map((story, index) => ({
                storyId: story.sys_id,
                newOrder: index + 1
            }))

            setStories(newStories)
            await storyService.reorderStories(sessionId, reorderData)
            onStoriesUpdated?.()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reorder stories'
            setError(errorMessage)
            await loadStories() // Reload on error
        } finally {
            setDraggedStory(null)
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
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update story'
            setError(errorMessage)
        }
    }

    const handleDeleteStory = async (story: Story) => {
        const title = typeof story.story_title === 'object' 
            ? story.story_title.display_value 
            : story.story_title

        if (!confirm(`Are you sure you want to delete "${title}"?`)) return

        try {
            await storyService.deleteStory(story.sys_id)
            await loadStories()
            onStoriesUpdated?.()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete story'
            setError(errorMessage)
        }
    }

    const handleResetStory = async (story: Story) => {
        const title = typeof story.story_title === 'object' 
            ? story.story_title.display_value 
            : story.story_title

        if (!confirm(`Reset voting for "${title}"? This will clear all votes.`)) return

        try {
            await storyService.resetStory(story.sys_id)
            await loadStories()
            onStoriesUpdated?.()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reset story'
            setError(errorMessage)
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
                // Support format: "Title|Description" or just "Title"
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
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to import stories'
            setError(errorMessage)
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
            case 'pending': return '#f59e0b'
            case 'voting': return '#3b82f6'
            case 'completed': return '#10b981'
            default: return '#6b7280'
        }
    }

    return (
        <div className="story-manager-overlay">
            <div className="story-manager">
                <div className="manager-header">
                    <div className="header-title">
                        <h2>📝 Story Management</h2>
                        <p>Drag and drop to reorder • Click to edit</p>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="bulk-import-button"
                            onClick={() => setShowBulkImport(true)}
                        >
                            📋 Bulk Import
                        </button>
                        <button 
                            className="close-button"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <span className="error-icon">⚠️</span>
                        {error}
                        <button 
                            className="dismiss-error"
                            onClick={() => setError(null)}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="manager-content">
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading stories...</p>
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No Stories Yet</h3>
                            <p>Start by adding stories to your planning session</p>
                            <button 
                                className="add-first-story"
                                onClick={() => setShowBulkImport(true)}
                            >
                                Add Stories
                            </button>
                        </div>
                    ) : (
                        <div className="stories-list">
                            {stories.map((story, index) => {
                                const title = typeof story.story_title === 'object' 
                                    ? story.story_title.display_value 
                                    : story.story_title
                                const description = typeof story.description === 'object' 
                                    ? story.description.display_value 
                                    : story.description

                                return (
                                    <div
                                        key={story.sys_id}
                                        className={`story-item ${draggedStory?.sys_id === story.sys_id ? 'dragging' : ''}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, story)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, story)}
                                    >
                                        <div className="story-drag-handle">
                                            ⋮⋮
                                        </div>
                                        
                                        <div className="story-order">
                                            #{index + 1}
                                        </div>
                                        
                                        <div 
                                            className="story-status"
                                            style={{ color: getStoryStatusColor(story.status) }}
                                        >
                                            {getStoryStatusIcon(story.status)}
                                        </div>
                                        
                                        <div className="story-content">
                                            <div className="story-title">{title}</div>
                                            {description && (
                                                <div className="story-description">{description}</div>
                                            )}
                                            <div className="story-meta">
                                                <span className={`status-tag ${story.status}`}>
                                                    {story.status.toUpperCase()}
                                                </span>
                                                {story.final_estimate && (
                                                    <span className="estimate-tag">
                                                        Est: {story.final_estimate}
                                                    </span>
                                                )}
                                                {story.consensus_achieved && (
                                                    <span className="consensus-tag">
                                                        🎯 Consensus
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="story-actions">
                                            <button 
                                                className="edit-story-button"
                                                onClick={() => handleEditStory(story)}
                                                title="Edit story"
                                            >
                                                ✏️
                                            </button>
                                            
                                            {story.status === 'completed' && (
                                                <button 
                                                    className="reset-story-button"
                                                    onClick={() => handleResetStory(story)}
                                                    title="Reset voting"
                                                >
                                                    🔄
                                                </button>
                                            )}
                                            
                                            <button 
                                                className="delete-story-button"
                                                onClick={() => handleDeleteStory(story)}
                                                title="Delete story"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Edit Story Modal */}
                {editingStory && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal">
                            <div className="modal-header">
                                <h3>Edit Story</h3>
                                <button 
                                    className="close-button"
                                    onClick={() => setEditingStory(null)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-content">
                                <div className="form-group">
                                    <label htmlFor="edit-title">Story Title *</label>
                                    <input
                                        id="edit-title"
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter story title"
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-description">Description</label>
                                    <textarea
                                        id="edit-description"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Optional: Add story details"
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button 
                                    className="cancel-button"
                                    onClick={() => setEditingStory(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="save-button"
                                    onClick={handleSaveEdit}
                                    disabled={!editForm.title.trim()}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Import Modal */}
                {showBulkImport && (
                    <div className="bulk-import-overlay">
                        <div className="bulk-import-modal">
                            <div className="modal-header">
                                <h3>📋 Bulk Import Stories</h3>
                                <button 
                                    className="close-button"
                                    onClick={() => setShowBulkImport(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-content">
                                <div className="import-instructions">
                                    <h4>Instructions:</h4>
                                    <ul>
                                        <li>Enter one story per line</li>
                                        <li>Format: <code>Title</code> or <code>Title|Description</code></li>
                                        <li>Example: <code>User Login|As a user, I want to login</code></li>
                                    </ul>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bulk-stories">Stories to Import</label>
                                    <textarea
                                        id="bulk-stories"
                                        value={bulkStories}
                                        onChange={(e) => setBulkStories(e.target.value)}
                                        placeholder={`User Registration
User Login|As a user, I want to login securely
Password Reset
Profile Management|User can update their profile information`}
                                        rows={10}
                                        className="bulk-import-textarea"
                                    />
                                </div>
                                <div className="import-preview">
                                    <strong>Preview:</strong> {bulkStories.split('\n').filter(line => line.trim()).length} stories to import
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowBulkImport(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="import-button"
                                    onClick={handleBulkImport}
                                    disabled={!bulkStories.trim()}
                                >
                                    Import Stories
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
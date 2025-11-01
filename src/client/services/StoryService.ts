import { VotingService } from './VotingService'
import { nativeService } from '../utils/serviceNowNativeService'

export class StoryService {
    private readonly tableName: string

    constructor() {
        this.tableName = 'x_902080_planpoker_session_stories'
    }

    // Get all stories for a session
    async getSessionStories(sessionId: string) {
        try {
            // 🎯 TRY NATIVE SERVICENOW API FIRST
            if (nativeService.isNativeAPIAvailable()) {
                console.log('StoryService.getSessionStories: 🚀 Using ServiceNow Native GlideRecord API')
                try {
                    const nativeOptions = {
                        filters: { session: sessionId },
                        orderBy: 'sequence_order',
                        fields: ['sys_id', 'story_title', 'description', 'sequence_order', 'status', 'final_estimate', 'consensus_achieved', 'sys_created_on']
                    }
                    
                    const nativeResults = await nativeService.query(this.tableName, nativeOptions)
                    console.log(`StoryService.getSessionStories: ✅ Native API returned ${nativeResults.length} stories`)
                    return nativeResults || []
                } catch (nativeError) {
                    console.warn('StoryService.getSessionStories: Native API failed, falling back to REST:', nativeError)
                }
            }

            // 🔄 FALLBACK TO REST API
            console.log('StoryService.getSessionStories: Using REST API fallback')
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,story_title,description,sequence_order,status,final_estimate,consensus_achieved,sys_created_on')
            searchParams.set('sysparm_query', `session=${sessionId}^ORDERBYsequence_order`)

            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
                method: 'GET',
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const { result } = await response.json()
            return result || []
        } catch (error) {
            console.error(`Error fetching stories for session ${sessionId}:`, error)
            throw error
        }
    }

    // Get a single story by sys_id
    async getStory(storyId: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')

            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}/${storyId}?${searchParams.toString()}`, {
                method: 'GET',
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const { result } = await response.json()
            return result
        } catch (error) {
            console.error(`Error fetching story ${storyId}:`, error)
            throw error
        }
    }

    // Create a new story for a session
    async createStory(sessionId: string, storyData: {
        story_title: string
        description?: string
        sequence_order?: number
    }) {
        try {
            // If no sequence order provided, get the next available order
            if (!storyData.sequence_order) {
                const existingStories = await this.getSessionStories(sessionId)
                storyData.sequence_order = existingStories.length + 1
            }

            const data = {
                session: sessionId,
                ...storyData,
                status: 'pending'
            }

            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error creating story for session ${sessionId}:`, error)
            throw error
        }
    }

    // Update a story
    async updateStory(storyId: string, updates: {
        story_title?: string
        description?: string
        sequence_order?: number
        status?: string
        final_estimate?: string
        consensus_achieved?: boolean
    }) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}/${storyId}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(updates),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error updating story ${storyId}:`, error)
            throw error
        }
    }

    // Delete a story
    async deleteStory(storyId: string) {
        try {
            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}/${storyId}`, {
                method: 'DELETE',
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.ok
        } catch (error) {
            console.error(`Error deleting story ${storyId}:`, error)
            throw error
        }
    }

    // Reorder stories in a session
    async reorderStories(sessionId: string, storyOrders: { storyId: string, newOrder: number }[]) {
        try {
            const updatePromises = storyOrders.map(({ storyId, newOrder }) =>
                this.updateStory(storyId, { sequence_order: newOrder })
            )

            await Promise.all(updatePromises)
            return true
        } catch (error) {
            console.error(`Error reordering stories for session ${sessionId}:`, error)
            throw error
        }
    }

    // Start voting on a story
    async startVoting(storyId: string) {
        try {
            return await this.updateStory(storyId, { status: 'voting' })
        } catch (error) {
            console.error(`Error starting voting for story ${storyId}:`, error)
            throw error
        }
    }

    // Complete voting on a story
    async completeVoting(storyId: string, finalEstimate: string) {
        try {
            return await this.updateStory(storyId, {
                status: 'completed',
                final_estimate: finalEstimate,
                consensus_achieved: true
            })
        } catch (error) {
            console.error(`Error completing voting for story ${storyId}:`, error)
            throw error
        }
    }

    // Reset a story to pending (clear votes and estimates)
    async resetStory(storyId: string) {
        try {
            // Clear all votes for this story first
            const votingService = new VotingService()
            await votingService.clearStoryVotes(storyId)

            // Reset story status and estimates
            return await this.updateStory(storyId, {
                status: 'pending',
                final_estimate: '',
                consensus_achieved: false
            })
        } catch (error) {
            console.error(`Error resetting story ${storyId}:`, error)
            throw error
        }
    }

    // Bulk create stories from a list
    async bulkCreateStories(sessionId: string, stories: Array<{
        story_title: string
        description?: string
    }>) {
        try {
            const createPromises = stories.map((story, index) =>
                this.createStory(sessionId, {
                    ...story,
                    sequence_order: index + 1
                })
            )

            const results = await Promise.all(createPromises)
            return results
        } catch (error) {
            console.error(`Error bulk creating stories for session ${sessionId}:`, error)
            throw error
        }
    }

    // Get story statistics for a session
    async getSessionStoryStats(sessionId: string) {
        try {
            const stories = await this.getSessionStories(sessionId)
            
            const totalStories = stories.length
            const completedStories = stories.filter((story: any) => story.status === 'completed').length
            const pendingStories = stories.filter((story: any) => story.status === 'pending').length
            const votingStories = stories.filter((story: any) => story.status === 'voting').length
            
            // Calculate total estimated points
            const totalPoints = stories
                .filter((story: any) => story.final_estimate && story.final_estimate !== '?' && story.final_estimate !== 'coffee')
                .reduce((sum: number, story: any) => {
                    const points = parseFloat(story.final_estimate)
                    return sum + (isNaN(points) ? 0 : points)
                }, 0)

            // Calculate consensus rate
            const consensusStories = stories.filter((story: any) => story.consensus_achieved).length
            const consensusRate = totalStories > 0 ? (consensusStories / totalStories) * 100 : 0

            return {
                totalStories,
                completedStories,
                pendingStories,
                votingStories,
                totalPoints: Math.round(totalPoints * 100) / 100,
                consensusRate: Math.round(consensusRate * 100) / 100,
                progressPercentage: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0
            }
        } catch (error) {
            console.error(`Error getting story stats for session ${sessionId}:`, error)
            throw error
        }
    }
}
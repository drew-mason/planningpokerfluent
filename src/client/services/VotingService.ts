export class VotingService {
    private readonly tableName: string

    constructor() {
        this.tableName = 'x_902080_planpoker_planning_vote'
    }

    // Submit a vote for a story
    async submitVote(storyId: string, estimate: string, confidence?: string) {
        try {
            const voteData = {
                story: storyId,
                estimate: estimate,
                confidence: confidence || 'medium'
            }

            const response = await fetch(`/api/now/table/${this.tableName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify(voteData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error submitting vote for story ${storyId}:`, error)
            throw error
        }
    }

    // Update an existing vote
    async updateVote(voteId: string, estimate: string, confidence?: string) {
        try {
            const voteData = {
                estimate: estimate,
                confidence: confidence || 'medium'
            }

            const response = await fetch(`/api/now/table/${this.tableName}/${voteId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify(voteData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error updating vote ${voteId}:`, error)
            throw error
        }
    }

    // Get all votes for a story
    async getStoryVotes(storyId: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,voter,estimate,confidence,voted_at')
            searchParams.set('sysparm_query', `story=${storyId}`)

            const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const { result } = await response.json()
            return result || []
        } catch (error) {
            console.error(`Error fetching votes for story ${storyId}:`, error)
            throw error
        }
    }

    // Get current user's vote for a story
    async getUserVote(storyId: string, userId?: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,estimate,confidence,voted_at')
            
            // Use current user if not specified
            const userQuery = userId ? `voter=${userId}` : `voter=javascript:gs.getUserID()`
            searchParams.set('sysparm_query', `story=${storyId}^${userQuery}`)

            const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const { result } = await response.json()
            return result && result.length > 0 ? result[0] : null
        } catch (error) {
            console.error(`Error fetching user vote for story ${storyId}:`, error)
            throw error
        }
    }

    // Calculate voting statistics for a story
    async getVotingStats(storyId: string) {
        try {
            const votes = await this.getStoryVotes(storyId)
            
            if (!votes || votes.length === 0) {
                return {
                    totalVotes: 0,
                    estimates: {},
                    consensus: false,
                    avgEstimate: 0,
                    medianEstimate: 0
                }
            }

            // Count estimates
            const estimates: { [key: string]: number } = {}
            const numericEstimates: number[] = []

            votes.forEach((vote: any) => {
                const estimate = vote.estimate
                estimates[estimate] = (estimates[estimate] || 0) + 1
                
                // Convert estimate to number for statistical calculations
                const numericValue = this.estimateToNumber(estimate)
                if (numericValue !== null) {
                    numericEstimates.push(numericValue)
                }
            })

            // Check for consensus (all votes are the same)
            const uniqueEstimates = Object.keys(estimates)
            const consensus = uniqueEstimates.length === 1

            // Calculate average and median
            let avgEstimate = 0
            let medianEstimate = 0

            if (numericEstimates.length > 0) {
                avgEstimate = numericEstimates.reduce((sum, val) => sum + val, 0) / numericEstimates.length
                
                const sorted = numericEstimates.sort((a, b) => a - b)
                const mid = Math.floor(sorted.length / 2)
                medianEstimate = sorted.length % 2 === 0 
                    ? (sorted[mid - 1] + sorted[mid]) / 2 
                    : sorted[mid]
            }

            return {
                totalVotes: votes.length,
                estimates,
                consensus,
                avgEstimate: Math.round(avgEstimate * 100) / 100,
                medianEstimate: Math.round(medianEstimate * 100) / 100,
                consensusEstimate: consensus ? uniqueEstimates[0] : null
            }
        } catch (error) {
            console.error(`Error calculating voting stats for story ${storyId}:`, error)
            throw error
        }
    }

    // Convert Planning Poker estimates to numbers for calculations
    private estimateToNumber(estimate: string): number | null {
        switch (estimate.toLowerCase()) {
            case '0': return 0
            case '0.5': return 0.5
            case '1': return 1
            case '2': return 2
            case '3': return 3
            case '5': return 5
            case '8': return 8
            case '13': return 13
            case '20': return 20
            case '40': return 40
            case '100': return 100
            case '?': return null
            case 'coffee': return null
            default: 
                // Try to parse as number
                const parsed = parseFloat(estimate)
                return isNaN(parsed) ? null : parsed
        }
    }

    // Clear all votes for a story (for re-voting)
    async clearStoryVotes(storyId: string) {
        try {
            // First get all votes for the story
            const votes = await this.getStoryVotes(storyId)
            
            // Delete each vote
            const deletePromises = votes.map((vote: any) => 
                fetch(`/api/now/table/${this.tableName}/${vote.sys_id}`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'X-UserToken': window.g_ck,
                    },
                })
            )

            await Promise.all(deletePromises)
            return true
        } catch (error) {
            console.error(`Error clearing votes for story ${storyId}:`, error)
            throw error
        }
    }

    // Finalize voting for a story (set consensus estimate)
    async finalizeStoryVoting(storyId: string, finalEstimate: string) {
        try {
            const response = await fetch(`/api/now/table/x_902080_planpoker_session_stories/${storyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify({
                    final_estimate: finalEstimate,
                    status: 'completed',
                    consensus_achieved: true
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error finalizing voting for story ${storyId}:`, error)
            throw error
        }
    }
}
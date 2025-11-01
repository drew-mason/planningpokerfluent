// Extend Window interface to include g_ck property
declare global {
    interface Window {
        g_ck: string
    }
}

export class PlanningSessionService {
    private readonly tableName: string

    constructor() {
        this.tableName = 'x_902080_planpoker_planning_session'
    }

    // Return all planning sessions for current user
    async list() {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,name,description,status,session_code,dealer,total_stories,completed_stories,consensus_rate,sys_created_on')
            searchParams.set('sysparm_query', 'ORDERBYDESCsys_created_on')

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
            console.error('Error fetching planning sessions:', error)
            throw error
        }
    }

    // Get a single planning session by sys_id with full details
    async get(sysId: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')

            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}?${searchParams.toString()}`, {
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
            
            // Also fetch stories and participants
            const [stories, participants] = await Promise.all([
                this.getSessionStories(sysId),
                this.getSessionParticipants(sysId)
            ])

            return {
                ...result,
                stories,
                participants
            }
        } catch (error) {
            console.error(`Error fetching planning session ${sysId}:`, error)
            throw error
        }
    }

    // Get stories for a session
    async getSessionStories(sessionId: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,story_title,description,sequence_order,status,final_estimate,consensus_achieved')
            searchParams.set('sysparm_query', `session=${sessionId}^ORDERBYsequence_order`)

            const response = await fetch(`/api/now/table/x_902080_planpoker_session_stories?${searchParams.toString()}`, {
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
            console.error(`Error fetching session stories for ${sessionId}:`, error)
            throw error
        }
    }

    // Get participants for a session
    async getSessionParticipants(sessionId: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,user,role,joined_at,left_at')
            searchParams.set('sysparm_query', `session=${sessionId}^left_atISEMPTY`)

            const response = await fetch(`/api/now/table/x_902080_planpoker_session_participant?${searchParams.toString()}`, {
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
            console.error(`Error fetching session participants for ${sessionId}:`, error)
            throw error
        }
    }

    // Create a new planning session
    async create(data: any) {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error('Error creating planning session:', error)
            throw error
        }
    }

    // Update a planning session
    async update(sysId: string, data: any) {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error updating planning session ${sysId}:`, error)
            throw error
        }
    }

    // Delete a planning session
    async delete(sysId: string): Promise<void> {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            // Return void for successful deletion
        } catch (error) {
            console.error(`Error deleting planning session ${sysId}:`, error)
            throw error
        }
    }

    // Join a session using session code
    async joinSession(sessionCode: string, userId?: string) {
        try {
            // First find the session by code
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_query', `session_code=${sessionCode}`)
            searchParams.set('sysparm_fields', 'sys_id,name,status')

            const sessionResponse = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
            })

            if (!sessionResponse.ok) {
                throw new Error('Session not found')
            }

            const { result } = await sessionResponse.json()
            if (!result || result.length === 0) {
                throw new Error('Invalid session code')
            }

            const session = result[0]

            // Add participant to session
            const participantData = {
                session: session.sys_id,
                user: userId || 'javascript:gs.getUserID()', // Use current user if not specified
                role: 'participant'
            }

            const participantResponse = await fetch('/api/now/table/x_902080_planpoker_session_participant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify(participantData),
            })

            if (!participantResponse.ok) {
                const errorData = await participantResponse.json()
                throw new Error(errorData.error?.message || 'Failed to join session')
            }

            // Return the full session details
            return this.get(session.sys_id)
        } catch (error) {
            console.error(`Error joining session with code ${sessionCode}:`, error)
            throw error
        }
    }

    // Generate a unique session code
    private generateSessionCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }
}
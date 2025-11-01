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
            console.log('PlanningSessionService.list: Starting to fetch sessions...')
            console.log('PlanningSessionService.list: window.g_ck available:', !!window.g_ck)
            
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,name,description,status,session_code,dealer,total_stories,completed_stories,consensus_rate,sys_created_on')
            searchParams.set('sysparm_query', 'ORDERBYDESCsys_created_on')

            const url = `/api/now/table/${this.tableName}?${searchParams.toString()}`
            console.log('PlanningSessionService.list: Fetching from URL:', url)

            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }
            console.log('PlanningSessionService.list: Request headers:', headers)

            const response = await fetch(url, {
                method: 'GET',
                headers,
            })

            console.log('PlanningSessionService.list: Response status:', response.status)
            console.log('PlanningSessionService.list: Response ok:', response.ok)

            if (!response.ok) {
                const errorData = await response.json()
                console.error('PlanningSessionService.list: Error response:', errorData)
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const responseData = await response.json()
            console.log('PlanningSessionService.list: Response data:', responseData)
            
            const result = responseData.result || []
            console.log('PlanningSessionService.list: Returning sessions:', result.length, 'sessions')
            return result
        } catch (error) {
            console.error('PlanningSessionService.list: Error fetching planning sessions:', error)
            throw error
        }
    }

    // Get a single planning session by sys_id with full details
    async get(sysId: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')

            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}?${searchParams.toString()}`, {
                method: 'GET',
                headers,
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

            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/x_902080_planpoker_session_stories?${searchParams.toString()}`, {
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

            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/x_902080_planpoker_session_participant?${searchParams.toString()}`, {
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
            console.error(`Error fetching session participants for ${sessionId}:`, error)
            throw error
        }
    }

    // Create a new planning session
    async create(data: any) {
        try {
            console.log('PlanningSessionService.create: Creating session with data:', data)
            console.log('PlanningSessionService.create: window.g_ck available:', !!window.g_ck)
            
            // Ensure required fields are present
            const sessionData = {
                name: data.name,
                description: data.description || '',
                session_code: data.session_code || this.generateSessionCode(),
                status: data.status || 'pending',
                dealer: data.dealer || 'javascript:gs.getUserID()', // Use current user as dealer
                timebox_minutes: data.timebox_minutes || 30,
                total_stories: 0,
                completed_stories: 0,
                consensus_rate: 0
            }
            
            console.log('PlanningSessionService.create: Processed session data:', sessionData)

            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }
            console.log('PlanningSessionService.create: Request headers:', headers)

            const response = await fetch(`/api/now/table/${this.tableName}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(sessionData),
            })

            console.log('PlanningSessionService.create: Response status:', response.status)
            console.log('PlanningSessionService.create: Response ok:', response.ok)

            if (!response.ok) {
                const errorData = await response.json()
                console.error('PlanningSessionService.create: Error response:', errorData)
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const responseData = await response.json()
            console.log('PlanningSessionService.create: Created session:', responseData)
            return responseData
        } catch (error) {
            console.error('PlanningSessionService.create: Error creating planning session:', error)
            throw error
        }
    }

    // Update a planning session
    async update(sysId: string, data: any) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'PATCH',
                headers,
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
            const headers = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'DELETE',
                headers,
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

            const sessionHeaders = {
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const sessionResponse = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
                method: 'GET',
                headers: sessionHeaders,
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

            const participantHeaders = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(window.g_ck && { 'X-UserToken': window.g_ck })
            }

            const participantResponse = await fetch('/api/now/table/x_902080_planpoker_session_participant', {
                method: 'POST',
                headers: participantHeaders,
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
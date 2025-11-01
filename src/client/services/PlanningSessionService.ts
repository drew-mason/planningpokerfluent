import { 
    PlanningSession, 
    SessionParticipant, 
    SessionStory, 
    ServiceNowAPIError,
    getValue 
} from '../types'
import { serviceUtils } from '../utils/serviceUtils'

export class PlanningSessionService {
    private readonly tableName = 'x_902080_planpoker_session'

    // List all planning sessions with pagination support
    async list(params: {
        limit?: number
        offset?: number
        orderBy?: string
        filters?: Record<string, any>
    } = {}): Promise<PlanningSession[]> {
        try {
            console.log('PlanningSessionService.list: Fetching sessions...')
            console.log('PlanningSessionService.list: Params:', params)
            
            const queryParams = {
                sysparm_limit: params.limit || 50,
                sysparm_offset: params.offset || 0,
                sysparm_query: this.buildQuery(params),
                sysparm_fields: this.getSessionFields().join(',')
            }

            console.log('PlanningSessionService.list: Query params:', queryParams)

            const response = await serviceUtils.get<{ result: PlanningSession[] }>(
                this.tableName, 
                queryParams
            )

            console.log('PlanningSessionService.list: Raw response:', response)
            console.log(`PlanningSessionService.list: Retrieved ${response.result?.length || 0} sessions`)
            
            // Debug: also try a raw query without any filters
            try {
                const debugParams = {
                    sysparm_limit: 10,
                    sysparm_fields: 'sys_id,name,status,sys_created_on,dealer'
                }
                const debugResponse = await serviceUtils.get<{ result: any[] }>(
                    this.tableName,
                    debugParams
                )
                console.log('PlanningSessionService.list: Debug raw query (no filters):', debugResponse)
                console.log(`PlanningSessionService.list: Debug found ${debugResponse.result?.length || 0} total records`)
            } catch (debugError) {
                console.error('Debug query failed:', debugError)
            }
            
            return response.result || []
        } catch (error) {
            console.error('PlanningSessionService.list: Error fetching sessions:', error)
            throw new ServiceNowAPIError(
                'Failed to fetch planning sessions',
                0,
                error
            )
        }
    }

    // Get a single planning session with full details
    async get(sysId: string): Promise<PlanningSession> {
        try {
            const queryParams = {
                sysparm_fields: this.getSessionFields().join(',')
            }

            const response = await serviceUtils.getById<{ result: PlanningSession }>(
                this.tableName,
                sysId,
                queryParams
            )

            if (!response.result) {
                throw new ServiceNowAPIError('Session not found', 404)
            }

            // Fetch related data in parallel
            const [stories, participants] = await Promise.all([
                this.getSessionStories(sysId),
                this.getSessionParticipants(sysId)
            ])

            return {
                ...response.result,
                stories,
                participants
            }
        } catch (error) {
            console.error(`PlanningSessionService.get: Error fetching session ${sysId}:`, error)
            if (error instanceof ServiceNowAPIError) {
                throw error
            }
            throw new ServiceNowAPIError('Failed to fetch session details', 0, error)
        }
    }

    // Create a new planning session
    async create(sessionData: Partial<PlanningSession>): Promise<{ result: PlanningSession }> {
        try {
            console.log('PlanningSessionService.create: Creating session with data:', sessionData)
            
            // Validate required fields
            this.validateSessionData(sessionData)

            // Prepare data with defaults
            const data = {
                name: serviceUtils.sanitizeInput(getValue(sessionData.name)),
                description: serviceUtils.sanitizeInput(getValue(sessionData.description) || ''),
                session_code: getValue(sessionData.session_code) || serviceUtils.generateSessionCode(),
                status: getValue(sessionData.status) || 'pending',
                dealer: getValue(sessionData.dealer) || serviceUtils.getCurrentUser().userID,
                timebox_minutes: Number(getValue(sessionData.timebox_minutes)) || 30,
                total_stories: 0,
                completed_stories: 0,
                consensus_rate: 0
            }

            console.log('PlanningSessionService.create: Sanitized data to be sent:', data)

            // Validate session code uniqueness
            await this.validateUniqueSessionCode(data.session_code)

            const response = await serviceUtils.create<{ result: PlanningSession }>(
                this.tableName,
                data
            )

            console.log('PlanningSessionService.create: Server response:', response)

            // Verify the session was actually created by trying to fetch it
            if (response.result?.sys_id) {
                const sysId = getValue(response.result.sys_id)
                console.log('PlanningSessionService.create: Verifying creation by fetching sys_id:', sysId)
                try {
                    const verification = await this.get(sysId)
                    console.log('PlanningSessionService.create: Verification successful, session exists:', verification)
                } catch (verifyError) {
                    console.error('PlanningSessionService.create: CRITICAL - Session creation reported success but record not found!', verifyError)
                    throw new ServiceNowAPIError('Session creation verification failed - record may not have been persisted', 0, verifyError)
                }
            } else {
                console.error('PlanningSessionService.create: CRITICAL - No sys_id returned from creation!')
                throw new ServiceNowAPIError('Session creation failed - no sys_id returned', 0)
            }

            console.log('PlanningSessionService.create: Session created and verified successfully')
            return response
        } catch (error) {
            console.error('PlanningSessionService.create: Error creating session:', error)
            if (error instanceof ServiceNowAPIError) {
                throw error
            }
            throw new ServiceNowAPIError('Failed to create planning session', 0, error)
        }
    }

    // Update a planning session
    async update(sysId: string, sessionData: Partial<PlanningSession>): Promise<{ result: PlanningSession }> {
        try {
            console.log(`PlanningSessionService.update: Updating session ${sysId}`)
            
            // Prepare update data
            const data: Record<string, any> = {}
            
            if (sessionData.name !== undefined) {
                data.name = serviceUtils.sanitizeInput(getValue(sessionData.name))
            }
            if (sessionData.description !== undefined) {
                data.description = serviceUtils.sanitizeInput(getValue(sessionData.description) || '')
            }
            if (sessionData.status !== undefined) {
                data.status = getValue(sessionData.status)
            }
            if (sessionData.timebox_minutes !== undefined) {
                data.timebox_minutes = Number(getValue(sessionData.timebox_minutes))
            }

            // Handle status transitions
            if (data.status) {
                await this.handleStatusTransition(sysId, data.status)
            }

            const response = await serviceUtils.update<{ result: PlanningSession }>(
                this.tableName,
                sysId,
                data
            )

            console.log('PlanningSessionService.update: Session updated successfully')
            return response
        } catch (error) {
            console.error(`PlanningSessionService.update: Error updating session ${sysId}:`, error)
            if (error instanceof ServiceNowAPIError) {
                throw error
            }
            throw new ServiceNowAPIError('Failed to update planning session', 0, error)
        }
    }

    // Delete a planning session
    async delete(sysId: string): Promise<void> {
        try {
            console.log(`PlanningSessionService.delete: Deleting session ${sysId}`)
            
            // Check if session can be deleted (not active)
            const session = await this.get(sysId)
            const status = getValue(session.status)
            
            if (status === 'active') {
                throw new ServiceNowAPIError('Cannot delete an active session', 400)
            }

            await serviceUtils.delete(this.tableName, sysId)
            console.log('PlanningSessionService.delete: Session deleted successfully')
        } catch (error) {
            console.error(`PlanningSessionService.delete: Error deleting session ${sysId}:`, error)
            if (error instanceof ServiceNowAPIError) {
                throw error
            }
            throw new ServiceNowAPIError('Failed to delete planning session', 0, error)
        }
    }

    // Join a session using session code
    async joinSession(sessionCode: string, userId?: string): Promise<PlanningSession> {
        try {
            console.log(`PlanningSessionService.joinSession: Joining session with code ${sessionCode}`)
            
            // Validate session code format
            if (!serviceUtils.validateSessionCode(sessionCode)) {
                throw new ServiceNowAPIError('Invalid session code format', 400)
            }

            // Find session by code
            const sessions = await this.list({
                filters: { session_code: sessionCode }
            })

            if (sessions.length === 0) {
                throw new ServiceNowAPIError('Session not found', 404)
            }

            const session = sessions[0]
            const sessionId = getValue(session.sys_id)
            const currentUser = userId || serviceUtils.getCurrentUser().userID

            // Check if user is already a participant
            const existingParticipant = await this.checkParticipantExists(sessionId, currentUser)
            
            if (!existingParticipant) {
                // Add participant to session
                await this.addParticipant(sessionId, currentUser)
            }

            // Return full session details
            return this.get(sessionId)
        } catch (error) {
            console.error(`PlanningSessionService.joinSession: Error joining session:`, error)
            if (error instanceof ServiceNowAPIError) {
                throw error
            }
            throw new ServiceNowAPIError('Failed to join session', 0, error)
        }
    }

    // Get session participants
    async getSessionParticipants(sessionId: string): Promise<SessionParticipant[]> {
        try {
            const response = await serviceUtils.get<{ result: SessionParticipant[] }>(
                'x_902080_planpoker_session_participant',
                {
                    sysparm_query: `session=${sessionId}^left_atISEMPTY`,
                    sysparm_fields: 'sys_id,user,role,joined_at,left_at'
                }
            )

            return response.result || []
        } catch (error) {
            console.error(`Error fetching participants for session ${sessionId}:`, error)
            return []
        }
    }

    // Get session stories
    async getSessionStories(sessionId: string): Promise<SessionStory[]> {
        try {
            const response = await serviceUtils.get<{ result: SessionStory[] }>(
                'x_902080_planpoker_session_stories',
                {
                    sysparm_query: `session=${sessionId}^ORDERBYsequence_order`,
                    sysparm_fields: 'sys_id,story_title,description,sequence_order,status,final_estimate,consensus_achieved,sys_created_on'
                }
            )

            return response.result || []
        } catch (error) {
            console.error(`Error fetching stories for session ${sessionId}:`, error)
            return []
        }
    }

    // Private helper methods
    private getSessionFields(): string[] {
        return [
            'sys_id', 'name', 'description', 'status', 'session_code',
            'dealer', 'total_stories', 'completed_stories', 'consensus_rate',
            'started_at', 'completed_at', 'timebox_minutes', 'sys_created_on', 'sys_updated_on'
        ]
    }

    private buildQuery(params: { orderBy?: string, filters?: Record<string, any> }): string {
        let query = ''
        
        // Add filters
        if (params.filters) {
            query = serviceUtils.buildEncodedQuery(params.filters)
        }
        
        // Add ordering
        const orderBy = params.orderBy || 'ORDERBYDESCsys_created_on'
        query = query ? `${query}^${orderBy}` : orderBy
        
        return query
    }

    private validateSessionData(data: Partial<PlanningSession>): void {
        const name = getValue(data.name)
        
        if (!name || name.trim().length === 0) {
            throw new ServiceNowAPIError('Session name is required', 400)
        }
        
        if (name.trim().length > 100) {
            throw new ServiceNowAPIError('Session name must be 100 characters or less', 400)
        }

        const description = getValue(data.description)
        if (description && description.length > 1000) {
            throw new ServiceNowAPIError('Description must be 1000 characters or less', 400)
        }
    }

    private async validateUniqueSessionCode(sessionCode: string): Promise<void> {
        const existingSessions = await this.list({
            filters: { session_code: sessionCode }
        })

        if (existingSessions.length > 0) {
            throw new ServiceNowAPIError('Session code already exists', 409)
        }
    }

    private async handleStatusTransition(sessionId: string, newStatus: string): Promise<void> {
        if (newStatus === 'active') {
            // Set started_at timestamp
            await serviceUtils.update(this.tableName, sessionId, {
                started_at: new Date().toISOString()
            })
        } else if (newStatus === 'completed') {
            // Set completed_at timestamp and calculate final stats
            await this.completeSession(sessionId)
        }
    }

    private async completeSession(sessionId: string): Promise<void> {
        const stories = await this.getSessionStories(sessionId)
        const totalStories = stories.length
        const completedStories = stories.filter(story => getValue(story.status) === 'completed').length
        const consensusStories = stories.filter(story => getValue(story.consensus_achieved)).length
        const consensusRate = totalStories > 0 ? Math.round((consensusStories / totalStories) * 100) : 0

        await serviceUtils.update(this.tableName, sessionId, {
            completed_at: new Date().toISOString(),
            total_stories: totalStories,
            completed_stories: completedStories,
            consensus_rate: consensusRate
        })
    }

    private async checkParticipantExists(sessionId: string, userId: string): Promise<boolean> {
        const response = await serviceUtils.get<{ result: SessionParticipant[] }>(
            'x_902080_planpoker_session_participant',
            {
                sysparm_query: `session=${sessionId}^user=${userId}^left_atISEMPTY`,
                sysparm_limit: 1
            }
        )

        return (response.result?.length || 0) > 0
    }

    private async addParticipant(sessionId: string, userId: string, role: string = 'participant'): Promise<void> {
        await serviceUtils.create('x_902080_planpoker_session_participant', {
            session: sessionId,
            user: userId,
            role: role,
            joined_at: new Date().toISOString()
        })
    }
}
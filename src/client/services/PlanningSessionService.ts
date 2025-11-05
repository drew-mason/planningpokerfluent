import { 
    PlanningSession, 
    SessionParticipant, 
    SessionStory, 
    ServiceNowAPIError,
    getValue 
} from '../types'
import { nativeService } from '../utils/serviceNowNativeService'
import { PlanningPokerUtils } from '../utils/planningPokerUtils'

export class PlanningSessionService {
    private readonly tableName = 'x_snc_msm_pp_session'

    // List all planning sessions with pagination support
    async list(params: {
        limit?: number
        offset?: number
        orderBy?: string
        filters?: Record<string, any>
    } = {}): Promise<PlanningSession[]> {
        try {
            console.log('PlanningSessionService.list: Fetching sessions with native API...')
            console.log('PlanningSessionService.list: Params:', params)
            
            // Use the basic query approach that works!
            // We know this works from the diagnostic logs
            const workingOptions = {
                limit: params.limit || 50,
                fields: ['sys_id', 'name', 'description', 'status', 'session_code', 'sys_created_on'],
                filters: params.filters
                // Skip orderBy for now since that's what breaks it
            }
            
            console.log('PlanningSessionService.list: Using working basic query approach...')
            const results = await nativeService.query(this.tableName, workingOptions)
            console.log(`PlanningSessionService.list: ✅ Retrieved ${results.length} sessions`)
            
            // Sort manually if needed (since ORDERBY was causing issues)
            if (params.orderBy && results.length > 0) {
                const orderField = params.orderBy.replace(/^ORDERBY(DESC)?/, '') || 'sys_created_on'
                const isDesc = params.orderBy?.includes('DESC') || true // Default to newest first
                
                results.sort((a, b) => {
                    const aVal = a[orderField]?.value || a[orderField] || ''
                    const bVal = b[orderField]?.value || b[orderField] || ''
                    
                    if (isDesc) {
                        return bVal.localeCompare(aVal)
                    } else {
                        return aVal.localeCompare(bVal)
                    }
                })
                
                console.log('PlanningSessionService.list: ✅ Results sorted manually')
            }
            
            return results as PlanningSession[]
            
        } catch (error) {
            console.error('PlanningSessionService.list: Error fetching sessions:', error)
            throw new ServiceNowAPIError(
                'Failed to fetch planning sessions',
                0,
                error
            )
        }
    }

    // Get single planning session by ID
    async get(sysId: string): Promise<PlanningSession> {
        try {
            console.log(`PlanningSessionService.get: Fetching session ${sysId}`)
            
            const fields = this.getSessionFields()
            const record = await nativeService.getById(this.tableName, sysId, fields)
            console.log('PlanningSessionService.get: Session found:', record)
            return record as PlanningSession
            
        } catch (error) {
            console.error(`PlanningSessionService.get: Error fetching session ${sysId}:`, error)
            throw new ServiceNowAPIError(
                `Session not found: ${sysId}`,
                404,
                error
            )
        }
    }

    // Create new planning session
    async create(sessionData: Partial<PlanningSession>): Promise<PlanningSession> {
        try {
            console.log('PlanningSessionService.create: Creating new session:', sessionData)
            
            // Validate required fields
            if (!sessionData.name) {
                throw new ServiceNowAPIError('Session name is required', 400)
            }

            // Prepare data with sanitization
            const data = {
                name: PlanningPokerUtils.sanitizeInput(getValue(sessionData.name)),
                description: PlanningPokerUtils.sanitizeInput(getValue(sessionData.description) || ''),
                session_code: getValue(sessionData.session_code) || PlanningPokerUtils.generateSessionCode(),
                status: getValue(sessionData.status) || 'pending',
                dealer: getValue(sessionData.dealer) || nativeService.getCurrentUser().userID,
                total_stories: getValue(sessionData.total_stories) || 0,
                completed_stories: getValue(sessionData.completed_stories) || 0,
                consensus_rate: getValue(sessionData.consensus_rate) || 0,
                timebox_minutes: getValue(sessionData.timebox_minutes) || 30
            }

            console.log('PlanningSessionService.create: Processed data:', data)
            
            const response = await nativeService.create(this.tableName, data)
            console.log('PlanningSessionService.create: ✅ Session created with sys_id:', response.result.sys_id)
            
            // Return the created session
            return await this.get(response.result.sys_id)
            
        } catch (error) {
            console.error('PlanningSessionService.create: Error creating session:', error)
            
            // Enhanced error logging for debugging
            if (error instanceof ServiceNowAPIError && error.statusCode === 400) {
                console.error('PlanningSessionService.create: Validation failed - check required fields')
            } else {
                console.error('PlanningSessionService.create: Create operation failed')
                
                // Test if native API is available
                try {
                    if (nativeService.isNativeAPIAvailable()) {
                        console.log('PlanningSessionService.create: Native API is available')
                    }
                } catch (debugError) {
                    console.error('PlanningSessionService.create: Debug check failed:', debugError)
                }
            }
            
            throw new ServiceNowAPIError(
                'Failed to create planning session',
                500,
                error
            )
        }
    }

    // Update a planning session
    async update(sysId: string, sessionData: Partial<PlanningSession>): Promise<{ result: PlanningSession }> {
        try {
            console.log(`PlanningSessionService.update: Updating session ${sysId}`)
            
            // Prepare update data
            const data: Record<string, any> = {}
            
            if (sessionData.name !== undefined) {
                data.name = PlanningPokerUtils.sanitizeInput(getValue(sessionData.name))
            }
            if (sessionData.description !== undefined) {
                data.description = PlanningPokerUtils.sanitizeInput(getValue(sessionData.description) || '')
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

            await nativeService.update(this.tableName, sysId, data)
            
            console.log('PlanningSessionService.update: Session updated successfully')
            
            // Return the updated session
            const updatedSession = await this.get(sysId)
            return { result: updatedSession }
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

            await nativeService.delete(this.tableName, sysId)
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
            if (!PlanningPokerUtils.validateSessionCode(sessionCode)) {
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
            const currentUser = userId || nativeService.getCurrentUser().userID

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
            const participants = await nativeService.query(
                'x_snc_msm_pp_session_participant',
                {
                    filters: { session: sessionId },
                    fields: ['sys_id', 'user', 'role', 'joined_at', 'left_at']
                }
            )

            // Filter out participants who have left (client-side filtering)
            const activeParticipants = participants.filter((p: any) => 
                !p.left_at || p.left_at === '' || p.left_at === null
            )

            return activeParticipants as SessionParticipant[]
        } catch (error) {
            console.error(`Error fetching participants for session ${sessionId}:`, error)
            return []
        }
    }

    // Get session stories
    async getSessionStories(sessionId: string): Promise<SessionStory[]> {
        try {
            const stories = await nativeService.query(
                'x_snc_msm_pp_session_stories',
                {
                    filters: { session: sessionId },
                    fields: ['sys_id', 'story_title', 'description', 'sequence_order', 'status', 'final_estimate', 'consensus_achieved', 'sys_created_on']
                }
            )

            // Sort client-side by sequence_order to avoid ORDERBY REST API issues
            const sortedStories = stories.sort((a: any, b: any) => {
                const orderA = parseInt(a.sequence_order?.value || a.sequence_order || '0')
                const orderB = parseInt(b.sequence_order?.value || b.sequence_order || '0')
                return orderA - orderB
            })

            return sortedStories as SessionStory[]
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
        
        // Add filters - for native service, we don't need to build encoded query
        // The filters are passed directly as objects
        if (params.filters) {
            // This method is kept for backward compatibility but not used with native service
            query = Object.entries(params.filters)
                .filter(([_, value]) => value !== undefined && value !== null)
                .map(([field, value]) => {
                    if (Array.isArray(value)) {
                        return `${field}IN${value.join(',')}`
                    }
                    return `${field}=${value}`
                })
                .join('^')
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
            await nativeService.update(this.tableName, sessionId, {
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

        await nativeService.update(this.tableName, sessionId, {
            completed_at: new Date().toISOString(),
            total_stories: totalStories,
            completed_stories: completedStories,
            consensus_rate: consensusRate
        })
    }

    private async checkParticipantExists(sessionId: string, userId: string): Promise<boolean> {
        const participants = await nativeService.query(
            'x_snc_msm_pp_session_participant',
            {
                filters: { session: sessionId, user: userId, left_at: null },
                limit: 1
            }
        )

        return participants.length > 0
    }

    private async addParticipant(sessionId: string, userId: string, role: string = 'participant'): Promise<void> {
        await nativeService.create('x_snc_msm_pp_session_participant', {
            session: sessionId,
            user: userId,
            role: role,
            joined_at: new Date().toISOString()
        })
    }
}
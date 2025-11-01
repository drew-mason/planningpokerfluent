// Planning Poker Application Types and Utilities

export interface ServiceNowDisplayValue {
    value: string
    display_value: string
}

export interface ServiceNowReference {
    value: string
    link: string
    display_value: string
}

// Core Domain Types
export interface PlanningSession {
    sys_id: string | ServiceNowDisplayValue
    name: string | ServiceNowDisplayValue
    description: string | ServiceNowDisplayValue
    status: SessionStatus | ServiceNowDisplayValue
    session_code: string | ServiceNowDisplayValue
    dealer: string | ServiceNowReference
    total_stories: number | ServiceNowDisplayValue
    completed_stories: number | ServiceNowDisplayValue
    consensus_rate: number | ServiceNowDisplayValue
    started_at?: string | ServiceNowDisplayValue
    completed_at?: string | ServiceNowDisplayValue
    timebox_minutes?: number | ServiceNowDisplayValue
    sys_created_on: string | ServiceNowDisplayValue
    sys_updated_on: string | ServiceNowDisplayValue
    stories?: SessionStory[]
    participants?: SessionParticipant[]
}

export interface SessionStory {
    sys_id: string | ServiceNowDisplayValue
    session: string | ServiceNowReference
    story_title: string | ServiceNowDisplayValue
    description: string | ServiceNowDisplayValue
    sequence_order: number | ServiceNowDisplayValue
    status: StoryStatus | ServiceNowDisplayValue
    final_estimate?: string | ServiceNowDisplayValue
    vote_summary?: string | ServiceNowDisplayValue
    consensus_achieved: boolean | ServiceNowDisplayValue
    voting_started?: string | ServiceNowDisplayValue
    completed_on?: string | ServiceNowDisplayValue
    sys_created_on: string | ServiceNowDisplayValue
    votes?: PlanningVote[]
}

export interface SessionParticipant {
    sys_id: string | ServiceNowDisplayValue
    session: string | ServiceNowReference
    user: string | ServiceNowReference
    role: ParticipantRole | ServiceNowDisplayValue
    joined_at: string | ServiceNowDisplayValue
    left_at?: string | ServiceNowDisplayValue
}

export interface PlanningVote {
    sys_id: string | ServiceNowDisplayValue
    session: string | ServiceNowReference
    story: string | ServiceNowReference
    voter: string | ServiceNowReference
    vote_value: string | ServiceNowDisplayValue
    version: number | ServiceNowDisplayValue
    is_current: boolean | ServiceNowDisplayValue
    created_on: string | ServiceNowDisplayValue
}

// Enum Types
export type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type StoryStatus = 'pending' | 'voting' | 'revealed' | 'completed' | 'skipped'
export type ParticipantRole = 'dealer' | 'participant' | 'observer'
export type ViewMode = 'list' | 'dashboard' | 'analytics'

// Analytics Types
export interface VoteDistribution {
    [voteValue: string]: {
        count: number
        percentage: number
        voters: string[]
    }
}

export interface SessionAnalytics {
    totalSessions: number
    completedSessions: number
    averageConsensusRate: number
    averageStoriesPerSession: number
    averageSessionDuration: number
    velocityTrend: VelocityData[]
    consensusDistribution: ConsensusData[]
}

export interface VelocityData {
    date: string
    storiesCompleted: number
    averageEstimate: number
    consensusRate: number
}

export interface ConsensusData {
    consensusRange: string
    sessionCount: number
    percentage: number
}

export interface SessionStats {
    totalStories: number
    completedStories: number
    pendingStories: number
    votingStories: number
    totalPoints: number
    consensusRate: number
    progressPercentage: number
}

// UI State Types
export interface LoadingState {
    isLoading: boolean
    loadingMessage?: string
}

export interface ErrorState {
    hasError: boolean
    errorMessage?: string
    errorCode?: string
}

export interface NotificationState {
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
}

// Service Interface Types
export interface PlanningSessionService {
    list(): Promise<PlanningSession[]>
    get(sysId: string): Promise<PlanningSession>
    create(sessionData: Partial<PlanningSession>): Promise<{ result: PlanningSession }>
    update(sysId: string, sessionData: Partial<PlanningSession>): Promise<{ result: PlanningSession }>
    delete(sysId: string): Promise<void>
    joinSession(sessionCode: string, userId?: string): Promise<PlanningSession>
    getSessionParticipants(sessionId: string): Promise<SessionParticipant[]>
    getSessionStories(sessionId: string): Promise<SessionStory[]>
}

// Utility Type Guards
export const isServiceNowObject = (value: any): value is ServiceNowDisplayValue | ServiceNowReference => {
    return value && typeof value === 'object' && ('value' in value || 'display_value' in value)
}

// Field Extraction Utilities
export const getValue = <T>(field: T): string => {
    if (isServiceNowObject(field)) {
        return field.value || ''
    }
    return String(field || '')
}

export const getDisplayValue = <T>(field: T): string => {
    if (isServiceNowObject(field)) {
        return field.display_value || field.value || ''
    }
    return String(field || '')
}

export const getNumericValue = <T>(field: T): number => {
    const value = getValue(field)
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
}

export const getBooleanValue = <T>(field: T): boolean => {
    const value = getValue(field)
    return value === 'true' || value === '1' || value === 'yes'
}

export const getDateValue = <T>(field: T): Date | null => {
    const value = getValue(field)
    if (!value) return null
    
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
}

// Validation Utilities
export const validateSessionCode = (code: string): boolean => {
    return /^[A-Z0-9]{6}$/.test(code)
}

export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>\"'&]/g, '')
}

// Constants
export const ESTIMATION_SCALE = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕']

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
    pending: 'Pending',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled'
}

export const STORY_STATUS_LABELS: Record<StoryStatus, string> = {
    pending: 'Pending',
    voting: 'Voting',
    revealed: 'Revealed',
    completed: 'Completed',
    skipped: 'Skipped'
}

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
    dealer: 'Dealer',
    participant: 'Participant',
    observer: 'Observer'
}

// Error Classes
export class PlanningPokerError extends Error {
    constructor(
        message: string,
        public code?: string,
        public details?: any
    ) {
        super(message)
        this.name = 'PlanningPokerError'
    }
}

export class ServiceNowAPIError extends PlanningPokerError {
    constructor(
        message: string,
        public statusCode: number,
        public response?: any
    ) {
        super(message, 'SERVICENOW_API_ERROR', { statusCode, response })
        this.name = 'ServiceNowAPIError'
    }
}

// Formatting Utilities
export const formatDate = (date: string | Date | null, options?: Intl.DateTimeFormatOptions): string => {
    if (!date) return 'N/A'
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            ...options
        })
    } catch {
        return String(date)
    }
}

export const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`
}

// Storage Utilities
export const getStorageKey = (key: string): string => {
    return `planningpoker_${key}`
}

export const saveToStorage = (key: string, value: any): void => {
    try {
        localStorage.setItem(getStorageKey(key), JSON.stringify(value))
    } catch (error) {
        console.warn('Failed to save to localStorage:', error)
    }
}

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(getStorageKey(key))
        return item ? JSON.parse(item) : defaultValue
    } catch (error) {
        console.warn('Failed to load from localStorage:', error)
        return defaultValue
    }
}
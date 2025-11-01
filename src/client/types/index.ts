// Planning Poker Application Types

export interface ServiceNowDisplayValue {
    value: string
    display_value: string
}

export interface ServiceNowReference {
    value: string
    link: string
    display_value: string
}

export interface PlanningSessionService {
    list(): Promise<PlanningSession[]>
    get(sysId: string): Promise<PlanningSession>
    create(sessionData: Partial<PlanningSession>): Promise<PlanningSession>
    update(sysId: string, sessionData: Partial<PlanningSession>): Promise<PlanningSession>
    delete(sysId: string): Promise<void>
    joinSession(sessionCode: string, userId?: string): Promise<PlanningSession>
}

export interface PlanningSession {
    sys_id: string | ServiceNowDisplayValue
    name: string | ServiceNowDisplayValue
    description: string | ServiceNowDisplayValue
    status: string | ServiceNowDisplayValue
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
}

export interface SessionStory {
    sys_id: string | ServiceNowDisplayValue
    session: string | ServiceNowReference
    story_title: string | ServiceNowDisplayValue
    description: string | ServiceNowDisplayValue
    sequence_order: number | ServiceNowDisplayValue
    status: 'pending' | 'voting' | 'revealed' | 'completed' | 'skipped'
    final_estimate?: string | ServiceNowDisplayValue
    vote_summary?: string | ServiceNowDisplayValue
    consensus_achieved: boolean | ServiceNowDisplayValue
    voting_started?: string | ServiceNowDisplayValue
    completed_on?: string | ServiceNowDisplayValue
    sys_created_on: string | ServiceNowDisplayValue
}

export interface SessionParticipant {
    sys_id: string | ServiceNowDisplayValue
    session: string | ServiceNowReference
    user: string | ServiceNowReference
    role: 'dealer' | 'participant' | 'observer'
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

export type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type StoryStatus = 'pending' | 'voting' | 'revealed' | 'completed' | 'skipped'
export type ParticipantRole = 'dealer' | 'participant' | 'observer'
export type ViewMode = 'list' | 'dashboard' | 'analytics'

// Utility types for extracting values from ServiceNow objects
export type ExtractValue<T> = T extends ServiceNowDisplayValue 
    ? string 
    : T extends ServiceNowReference 
        ? string 
        : T

export type ExtractDisplay<T> = T extends ServiceNowDisplayValue 
    ? string 
    : T extends ServiceNowReference 
        ? string 
        : T

// Helper functions for working with ServiceNow values
export const getValue = <T>(field: T): ExtractValue<T> => {
    if (typeof field === 'object' && field !== null && 'value' in field) {
        return (field as any).value
    }
    return field as ExtractValue<T>
}

export const getDisplayValue = <T>(field: T): ExtractDisplay<T> => {
    if (typeof field === 'object' && field !== null && 'display_value' in field) {
        return (field as any).display_value
    }
    if (typeof field === 'object' && field !== null && 'value' in field) {
        return (field as any).value
    }
    return field as ExtractDisplay<T>
}
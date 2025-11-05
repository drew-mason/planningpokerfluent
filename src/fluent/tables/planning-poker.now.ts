import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, IntegerColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

// Planning Session Table
export const x_snc_msm_ppoker_session = Table({
    name: 'x_snc_msm_ppoker_session',
    label: 'Planning Session',
    schema: {
        name: StringColumn({
            label: 'Session Name',
            maxLength: 100,
            mandatory: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 1000,
        }),
        session_code: StringColumn({
            label: 'Session Code',
            maxLength: 10,
            mandatory: true,
            unique: true,
        }),
        status: StringColumn({
            label: 'Status',
            maxLength: 40,
            choices: {
                pending: { label: 'Pending', sequence: 0 },
                active: { label: 'Active', sequence: 1 },
                completed: { label: 'Completed', sequence: 2 },
                cancelled: { label: 'Cancelled', sequence: 3 },
            },
            default: 'pending',
        }),
        dealer: ReferenceColumn({
            label: 'Dealer',
            reference: 'sys_user',
            mandatory: true,
        }),
        timebox_minutes: IntegerColumn({
            label: 'Timebox (Minutes)',
            default: 30,
        }),
        total_stories: IntegerColumn({
            label: 'Total Stories',
            default: 0,
        }),
        completed_stories: IntegerColumn({
            label: 'Completed Stories',
            default: 0,
        }),
        consensus_rate: IntegerColumn({
            label: 'Consensus Rate %',
            default: 0,
        }),
        started_at: DateTimeColumn({
            label: 'Started At',
        }),
        completed_at: DateTimeColumn({
            label: 'Completed At',
        }),
    },
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
})

// Session Stories Table
export const x_snc_msm_ppoker_session_stories = Table({
    name: 'x_snc_msm_ppoker_session_stories',
    label: 'Session Stories',
    schema: {
        session: ReferenceColumn({
            label: 'Session',
            reference: 'x_snc_msm_ppoker_session',
            mandatory: true,
        }),
        story_title: StringColumn({
            label: 'Story Title',
            maxLength: 200,
            mandatory: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 2000,
        }),
        sequence_order: IntegerColumn({
            label: 'Sequence Order',
            mandatory: true,
        }),
        status: StringColumn({
            label: 'Status',
            maxLength: 40,
            choices: {
                pending: { label: 'Pending', sequence: 0 },
                voting: { label: 'Voting', sequence: 1 },
                revealed: { label: 'Revealed', sequence: 2 },
                completed: { label: 'Completed', sequence: 3 },
                skipped: { label: 'Skipped', sequence: 4 },
            },
            default: 'pending',
        }),
        final_estimate: StringColumn({
            label: 'Final Estimate',
            maxLength: 20,
        }),
        vote_summary: StringColumn({
            label: 'Vote Summary',
            maxLength: 500,
        }),
        consensus_achieved: BooleanColumn({
            label: 'Consensus Achieved',
            default: false,
        }),
        voting_started: DateTimeColumn({
            label: 'Voting Started',
        }),
        completed_on: DateTimeColumn({
            label: 'Completed On',
        }),
    },
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
})

//  Votes Table
export const x_snc_msm_ppoker_vote = Table({
    name: 'x_snc_msm_ppoker_vote',
    label: 'Planning Vote',
    schema: {
        session: ReferenceColumn({
            label: 'Session',
            reference: 'x_snc_msm_ppoker_session',
            mandatory: true,
        }),
        story: ReferenceColumn({
            label: 'Story',
            reference: 'x_snc_msm_ppoker_session_stories',
            mandatory: true,
        }),
        voter: ReferenceColumn({
            label: 'Voter',
            reference: 'sys_user',
            mandatory: true,
        }),
        vote_value: StringColumn({
            label: 'Vote Value',
            maxLength: 20,
            mandatory: true,
        }),
        version: IntegerColumn({
            label: 'Version',
            default: 1,
        }),
        is_current: BooleanColumn({
            label: 'Is Current',
            default: true,
        }),
        created_on: DateTimeColumn({
            label: 'Created On',
        }),
    },
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
})

// Session Participants Table
export const x_snc_msm_ppoker_session_participant = Table({
    name: 'x_snc_msm_ppoker_session_participant',
    label: 'Session Participant',
    schema: {
        session: ReferenceColumn({
            label: 'Session',
            reference: 'x_snc_msm_ppoker_session',
            mandatory: true,
        }),
        user: ReferenceColumn({
            label: 'User',
            reference: 'sys_user',
            mandatory: true,
        }),
        role: StringColumn({
            label: 'Role',
            maxLength: 40,
            choices: {
                dealer: { label: 'Dealer', sequence: 0 },
                participant: { label: 'Participant', sequence: 1 },
                observer: { label: 'Observer', sequence: 2 },
            },
            default: 'participant',
        }),
        joined_at: DateTimeColumn({
            label: 'Joined At',
        }),
        left_at: DateTimeColumn({
            label: 'Left At',
        }),
    },
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
})
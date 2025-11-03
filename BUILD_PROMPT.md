# Build a Complete ServiceNow Planning Poker Application

Create a comprehensive Planning Poker application for ServiceNow using the NowSDK framework. This application should allow teams to collaboratively estimate user stories using planning poker techniques.

## Application Overview

The application consists of:
- **Frontend**: React/TypeScript application with planning poker interface
- **Backend**: ServiceNow tables, script includes, and business rules
- **Features**: Session management, story estimation, real-time voting, analytics

## Project Setup

1. Initialize a new NowSDK project:
```bash
npx create-now-sdk@latest planning-poker-app
cd planning-poker-app
```

2. Install dependencies:
```bash
npm install
```

## ServiceNow Tables

Create the following tables in your ServiceNow instance (scope: x_902080_ppoker):

### 1. Planning Session Table (`x_902080_ppoker_session`)
```javascript
// Table: x_902080_ppoker_session
// Label: Planning Session
// Extends: Task

Fields:
- name (String, 100 chars) - Session name
- description (String, 1000 chars) - Session description
- status (Choice: pending, active, completed)
- session_code (String, 6 chars) - Unique session code
- dealer (Reference to sys_user) - Session facilitator
- total_stories (Integer) - Total number of stories
- completed_stories (Integer) - Completed stories count
- consensus_rate (Integer) - Consensus percentage
- started_at (DateTime) - Session start time
- completed_at (DateTime) - Session completion time
- timebox_minutes (Integer, default: 30) - Time limit in minutes
```

### 2. Session Stories Table (`x_902080_ppoker_session_stories`)
```javascript
// Table: x_902080_ppoker_session_stories
// Label: Session Stories

Fields:
- session (Reference to x_902080_ppoker_session)
- story_title (String, 200 chars)
- description (String, 1000 chars)
- sequence_order (Integer)
- status (Choice: pending, active, completed)
- final_estimate (String, 10 chars)
- consensus_achieved (Boolean)
```

### 3. Session Participants Table (`x_902080_ppoker_session_participant`)
```javascript
// Table: x_902080_ppoker_session_participant
// Label: Session Participants

Fields:
- session (Reference to x_902080_ppoker_session)
- user (Reference to sys_user)
- role (Choice: participant, observer)
- joined_at (DateTime)
- left_at (DateTime)
```

### 4. Planning Votes Table (`x_902080_ppoker_vote`)
```javascript
// Table: x_902080_ppoker_vote
// Label: Planning Votes

Fields:
- session (Reference to x_902080_ppoker_session)
- story (Reference to x_902080_ppoker_session_stories)
- user (Reference to sys_user)
- vote_value (String, 10 chars)
- voted_at (DateTime)
```

## NowSDK Configuration

Create `now.config.json`:
```json
{
  "scope": "x_902080_ppoker",
  "name": "Planning Poker",
  "tsconfigPath": "./src/server/tsconfig.json"
}
```

## Frontend Structure

### Main Application (`src/client/main.tsx`)
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'

console.log('Planning Poker App: Initializing...')

class AppErrorBoundary extends React.Component<
    { children: React.ReactNode }, 
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Planning Poker App Critical Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>Planning Poker Application</h1>
                    <p>Unable to load the application. Please refresh the page.</p>
                    <button onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

const rootElement = document.getElementById('root')
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AppErrorBoundary>
                <App />
            </AppErrorBoundary>
        </React.StrictMode>
    )
}
```

### App Component (`src/client/app.tsx`)
```tsx
import React, { useState, useEffect } from 'react'
import { PlanningSessionService } from './services/PlanningSessionService'
import { PlanningSession } from './types'
import SessionDashboard from './components/SessionDashboard'
import SessionForm from './components/SessionForm'
import SessionList from './components/SessionList'
import './app.css'

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'list' | 'create' | 'session'>('list')
    const [sessions, setSessions] = useState<PlanningSession[]>([])
    const [currentSession, setCurrentSession] = useState<PlanningSession | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadSessions()
    }, [])

    const loadSessions = async () => {
        try {
            setLoading(true)
            setError(null)
            const sessionData = await PlanningSessionService.list()
            setSessions(sessionData)
        } catch (err) {
            console.error('Failed to load sessions:', err)
            setError('Failed to load sessions. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateSession = async (sessionData: Partial<PlanningSession>) => {
        try {
            setLoading(true)
            setError(null)
            const newSession = await PlanningSessionService.create(sessionData)
            setSessions(prev => [newSession, ...prev])
            setCurrentSession(newSession)
            setCurrentView('session')
        } catch (err) {
            console.error('Failed to create session:', err)
            setError('Failed to create session. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleJoinSession = async (sessionCode: string) => {
        try {
            setLoading(true)
            setError(null)
            const session = await PlanningSessionService.joinSession(sessionCode)
            setCurrentSession(session)
            setCurrentView('session')
        } catch (err) {
            console.error('Failed to join session:', err)
            setError('Failed to join session. Please check the session code.')
        } finally {
            setLoading(false)
        }
    }

    const handleBackToList = () => {
        setCurrentView('list')
        setCurrentSession(null)
        loadSessions()
    }

    if (currentView === 'session' && currentSession) {
        return (
            <SessionDashboard
                session={currentSession}
                onBack={handleBackToList}
            />
        )
    }

    if (currentView === 'create') {
        return (
            <SessionForm
                onSubmit={handleCreateSession}
                onCancel={() => setCurrentView('list')}
                loading={loading}
            />
        )
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Planning Poker</h1>
                <p>Collaborative story estimation for agile teams</p>
            </header>

            <main className="app-main">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <SessionList
                    sessions={sessions}
                    loading={loading}
                    onCreateNew={() => setCurrentView('create')}
                    onJoinSession={handleJoinSession}
                    onRefresh={loadSessions}
                />
            </main>
        </div>
    )
}

export default App
```

## Service Layer

### Planning Session Service (`src/client/services/PlanningSessionService.ts`)
```typescript
import { PlanningSession } from '../types'
import { nativeService } from '../utils/serviceNowNativeService'
import { PlanningPokerUtils } from '../utils/planningPokerUtils'

export class PlanningSessionService {
    private readonly tableName = 'x_902080_ppoker_session'

    async list(params: {
        limit?: number
        offset?: number
        orderBy?: string
        filters?: Record<string, any>
    } = {}): Promise<PlanningSession[]> {
        try {
            const workingOptions = {
                limit: params.limit || 50,
                fields: ['sys_id', 'name', 'description', 'status', 'session_code', 'sys_created_on'],
                filters: params.filters
            }

            const results = await nativeService.query(this.tableName, workingOptions)
            return results as PlanningSession[]
        } catch (error) {
            console.error('PlanningSessionService.list: Error fetching sessions:', error)
            throw error
        }
    }

    async get(sysId: string): Promise<PlanningSession> {
        try {
            const fields = [
                'sys_id', 'name', 'description', 'status', 'session_code',
                'dealer', 'total_stories', 'completed_stories', 'consensus_rate',
                'started_at', 'completed_at', 'timebox_minutes', 'sys_created_on', 'sys_updated_on'
            ]
            const record = await nativeService.getById(this.tableName, sysId, fields)
            return record as PlanningSession
        } catch (error) {
            console.error(`PlanningSessionService.get: Error fetching session ${sysId}:`, error)
            throw error
        }
    }

    async create(sessionData: Partial<PlanningSession>): Promise<PlanningSession> {
        try {
            if (!sessionData.name) {
                throw new Error('Session name is required')
            }

            const data = {
                name: PlanningPokerUtils.sanitizeInput(sessionData.name),
                description: PlanningPokerUtils.sanitizeInput(sessionData.description || ''),
                session_code: sessionData.session_code || PlanningPokerUtils.generateSessionCode(),
                status: sessionData.status || 'pending',
                dealer: nativeService.getCurrentUser().userID,
                total_stories: sessionData.total_stories || 0,
                completed_stories: sessionData.completed_stories || 0,
                consensus_rate: sessionData.consensus_rate || 0,
                timebox_minutes: sessionData.timebox_minutes || 30
            }

            const response = await nativeService.create(this.tableName, data)
            return await this.get(response.result.sys_id)
        } catch (error) {
            console.error('PlanningSessionService.create: Error creating session:', error)
            throw error
        }
    }

    async joinSession(sessionCode: string): Promise<PlanningSession> {
        try {
            const sessions = await this.list({
                filters: { session_code: sessionCode }
            })

            if (sessions.length === 0) {
                throw new Error('Session not found')
            }

            const session = sessions[0]
            const sessionId = session.sys_id

            // Check if user is already a participant
            const existingParticipant = await this.checkParticipantExists(sessionId)
            
            if (!existingParticipant) {
                await this.addParticipant(sessionId)
            }

            return this.get(sessionId)
        } catch (error) {
            console.error(`PlanningSessionService.joinSession: Error joining session:`, error)
            throw error
        }
    }

    private async checkParticipantExists(sessionId: string): Promise<boolean> {
        const participants = await nativeService.query(
            'x_902080_ppoker_session_participant',
            {
                filters: { session: sessionId, user: nativeService.getCurrentUser().userID, left_at: null },
                limit: 1
            }
        )
        return participants.length > 0
    }

    private async addParticipant(sessionId: string): Promise<void> {
        await nativeService.create('x_902080_ppoker_session_participant', {
            session: sessionId,
            user: nativeService.getCurrentUser().userID,
            role: 'participant',
            joined_at: new Date().toISOString()
        })
    }
}
```

### ServiceNow Native Service (`src/client/utils/serviceNowNativeService.ts`)
```typescript
declare global {
    interface Window {
        g_user: {
            userName: string;
            userID: string;
            firstName: string;
            lastName: string;
        };
        g_ck: string;
        GlideAjax: any;
    }
}

export class ServiceNowNativeService {
    private static instance: ServiceNowNativeService;

    private constructor() {}

    static getInstance(): ServiceNowNativeService {
        if (!ServiceNowNativeService.instance) {
            ServiceNowNativeService.instance = new ServiceNowNativeService();
        }
        return ServiceNowNativeService.instance;
    }

    async query(tableName: string, options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        try {
            console.log(`ServiceNowNativeService.query: Using GlideAjax for ${tableName}`);
            
            if (tableName === 'x_902080_planpoker_session') {
                return await this.querySessionsViaAjax(options);
            }
            
            return await this.queryWithRESTAPI(tableName, options);
        } catch (error) {
            console.error('ServiceNowNativeService.query: Error with query:', error);
            throw error;
        }
    }

    private async querySessionsViaAjax(options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                const ajax = new window.GlideAjax('PlanningPokerSessionAjax');
                ajax.addParam('sysparm_name', 'getSessions');
                ajax.addParam('sysparm_options', JSON.stringify(options));
                
                ajax.getXML((response: any) => {
                    try {
                        const answer = response.responseXML.documentElement.getAttribute('answer');
                        const sessions = JSON.parse(answer);
                        resolve(sessions);
                    } catch (parseError) {
                        reject(parseError);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async queryWithRESTAPI(tableName: string, options: {
        filters?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        fields?: string[];
    } = {}): Promise<any[]> {
        const params = new URLSearchParams();
        params.set('sysparm_display_value', 'all');
        params.set('sysparm_exclude_reference_link', 'true');
        
        if (options.limit) {
            params.set('sysparm_limit', options.limit.toString());
        }
        
        if (options.fields && options.fields.length > 0) {
            params.set('sysparm_fields', options.fields.join(','));
        }
        
        let queryString = '';
        if (options.filters) {
            const filterParts = Object.entries(options.filters)
                .filter(([_, value]) => value !== undefined && value !== null)
                .map(([field, value]) => {
                    if (Array.isArray(value)) {
                        return `${field}IN${value.join(',')}`;
                    }
                    return `${field}=${value}`;
                });
            queryString = filterParts.join('^');
        }
        
        if (queryString) {
            params.set('sysparm_query', queryString);
        }
        
        const url = `/api/now/table/${tableName}?${params.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.result || [];
    }

    async getById(tableName: string, sysId: string, fields?: string[]): Promise<any> {
        try {
            if (tableName === 'x_902080_planpoker_session') {
                return await this.getSessionByIdViaAjax(sysId);
            }
            return await this.getByIdWithRESTAPI(tableName, sysId, fields);
        } catch (error) {
            throw error;
        }
    }

    private async getSessionByIdViaAjax(sysId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const ajax = new window.GlideAjax('PlanningPokerSessionAjax');
            ajax.addParam('sysparm_name', 'getSession');
            ajax.addParam('sysparm_sys_id', sysId);
            
            ajax.getXML((response: any) => {
                try {
                    const answer = response.responseXML.documentElement.getAttribute('answer');
                    const session = JSON.parse(answer);
                    resolve(session);
                } catch (parseError) {
                    reject(parseError);
                }
            });
        });
    }

    private async getByIdWithRESTAPI(tableName: string, sysId: string, fields?: string[]): Promise<any> {
        const params = new URLSearchParams();
        params.set('sysparm_display_value', 'all');
        params.set('sysparm_exclude_reference_link', 'true');
        
        if (fields && fields.length > 0) {
            params.set('sysparm_fields', fields.join(','));
        }
        
        const url = `/api/now/table/${tableName}/${sysId}?${params.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Record not found: ${sysId}`);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.result;
    }

    async create(tableName: string, data: Record<string, any>): Promise<any> {
        try {
            if (tableName === 'x_902080_planpoker_session') {
                return await this.createSessionViaAjax(data);
            }
            return await this.createWithRESTAPI(tableName, data);
        } catch (error) {
            throw error;
        }
    }

    private async createSessionViaAjax(data: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            const ajax = new window.GlideAjax('PlanningPokerSessionAjax');
            ajax.addParam('sysparm_name', 'createSession');
            ajax.addParam('sysparm_session_data', JSON.stringify(data));
            
            ajax.getXML((response: any) => {
                try {
                    const answer = response.responseXML.documentElement.getAttribute('answer');
                    const session = JSON.parse(answer);
                    resolve({ result: session });
                } catch (parseError) {
                    reject(parseError);
                }
            });
        });
    }

    private async createWithRESTAPI(tableName: string, data: Record<string, any>): Promise<any> {
        const url = `/api/now/table/${tableName}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        return result;
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (typeof window !== 'undefined' && window.g_ck) {
            headers['X-UserToken'] = window.g_ck;
        }

        return headers;
    }

    isNativeAPIAvailable(): boolean {
        return typeof window !== 'undefined' && 
               typeof window.g_user !== 'undefined' &&
               typeof window.g_ck !== 'undefined';
    }

    getCurrentUser() {
        if (typeof window !== 'undefined' && window.g_user) {
            return {
                userName: window.g_user.userName || '',
                userID: window.g_user.userID || '',
                firstName: window.g_user.firstName || '',
                lastName: window.g_user.lastName || '',
                displayName: window.g_user.firstName && window.g_user.lastName 
                    ? `${window.g_user.firstName} ${window.g_user.lastName}`
                    : window.g_user.userName || 'Unknown User'
            };
        }
        return {
            userName: '',
            userID: '',
            firstName: '',
            lastName: '',
            displayName: 'Unknown User'
        };
    }
}

export const nativeService = ServiceNowNativeService.getInstance();
```

## Script Include for Server-Side Operations

Create `src/fluent/script-includes/planning-poker-session.now.ts`:
```typescript
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['planning_poker_session_ajax'],
    name: 'PlanningPokerSessionAjax',
    description: 'Server-side data access for planning poker sessions',
    script: `
var PlanningPokerSessionAjax = Class.create();
PlanningPokerSessionAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    getSessions: function() {
        gs.info('PlanningPokerSessionAjax.getSessions: Starting session query');

        var gr = new GlideRecord('x_902080_planpoker_session');
        gr.addEncodedQuery('ORDERBYDESCsys_created_on');
        gr.setLimit(50);

        var results = [];
        gr.query();

        while (gr.next()) {
            results.push({
                sys_id: gr.getValue('sys_id'),
                name: gr.getValue('name'),
                description: gr.getValue('description'),
                status: gr.getValue('status'),
                session_code: gr.getValue('session_code'),
                dealer: gr.getValue('dealer'),
                total_stories: gr.getValue('total_stories'),
                completed_stories: gr.getValue('completed_stories'),
                consensus_rate: gr.getValue('consensus_rate'),
                started_at: gr.getValue('started_at'),
                completed_at: gr.getValue('completed_at'),
                timebox_minutes: gr.getValue('timebox_minutes'),
                sys_created_on: gr.getValue('sys_created_on'),
                sys_updated_on: gr.getValue('sys_updated_on')
            });
        }

        gs.info('PlanningPokerSessionAjax.getSessions: Found ' + results.length + ' sessions');
        return JSON.stringify(results);
    },

    getSession: function() {
        var sysId = this.getParameter('sysparm_sys_id');
        gs.info('PlanningPokerSessionAjax.getSession: Fetching session ' + sysId);

        var gr = new GlideRecord('x_902080_planpoker_session');
        if (gr.get(sysId)) {
            var result = {
                sys_id: gr.getValue('sys_id'),
                name: gr.getValue('name'),
                description: gr.getValue('description'),
                status: gr.getValue('status'),
                session_code: gr.getValue('session_code'),
                dealer: gr.getValue('dealer'),
                total_stories: gr.getValue('total_stories'),
                completed_stories: gr.getValue('completed_stories'),
                consensus_rate: gr.getValue('consensus_rate'),
                started_at: gr.getValue('started_at'),
                completed_at: gr.getValue('completed_at'),
                timebox_minutes: gr.getValue('timebox_minutes'),
                sys_created_on: gr.getValue('sys_created_on'),
                sys_updated_on: gr.getValue('sys_updated_on')
            };
            return JSON.stringify(result);
        } else {
            gs.warn('PlanningPokerSessionAjax.getSession: Session not found - ' + sysId);
            return 'null';
        }
    },

    createSession: function() {
        var sessionData = JSON.parse(this.getParameter('sysparm_session_data'));
        gs.info('PlanningPokerSessionAjax.createSession: Creating new session');

        var gr = new GlideRecord('x_902080_planpoker_session');

        gr.setValue('name', sessionData.name);
        gr.setValue('description', sessionData.description || '');
        gr.setValue('session_code', sessionData.session_code || this.generateSessionCode());
        gr.setValue('status', sessionData.status || 'pending');
        gr.setValue('dealer', sessionData.dealer || gs.getUserID());
        gr.setValue('total_stories', sessionData.total_stories || 0);
        gr.setValue('completed_stories', sessionData.completed_stories || 0);
        gr.setValue('consensus_rate', sessionData.consensus_rate || 0);
        gr.setValue('timebox_minutes', sessionData.timebox_minutes || 30);

        var sysId = gr.insert();

        if (sysId) {
            gs.info('PlanningPokerSessionAjax.createSession: Created session with sys_id ' + sysId);
            return this.getSessionById(sysId);
        } else {
            gs.error('PlanningPokerSessionAjax.createSession: Failed to create session');
            return 'null';
        }
    },

    getSessionById: function(sysId) {
        var gr = new GlideRecord('x_902080_planpoker_session');
        if (gr.get(sysId)) {
            var result = {
                sys_id: gr.getValue('sys_id'),
                name: gr.getValue('name'),
                description: gr.getValue('description'),
                status: gr.getValue('status'),
                session_code: gr.getValue('session_code'),
                dealer: gr.getValue('dealer'),
                total_stories: gr.getValue('total_stories'),
                completed_stories: gr.getValue('completed_stories'),
                consensus_rate: gr.getValue('consensus_rate'),
                started_at: gr.getValue('started_at'),
                completed_at: gr.getValue('completed_at'),
                timebox_minutes: gr.getValue('timebox_minutes'),
                sys_created_on: gr.getValue('sys_created_on'),
                sys_updated_on: gr.getValue('sys_updated_on')
            };
            return JSON.stringify(result);
        }
        return 'null';
    },

    generateSessionCode: function() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var code = '';
        for (var i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },

    type: 'PlanningPokerSessionAjax'
});
`
})
```

## UI Components

### Session List Component (`src/client/components/SessionList.tsx`)
```tsx
import React from 'react'
import { PlanningSession } from '../types'

interface SessionListProps {
    sessions: PlanningSession[]
    loading: boolean
    onCreateNew: () => void
    onJoinSession: (sessionCode: string) => void
    onRefresh: () => void
}

const SessionList: React.FC<SessionListProps> = ({
    sessions,
    loading,
    onCreateNew,
    onJoinSession,
    onRefresh
}) => {
    const [joinCode, setJoinCode] = React.useState('')

    const handleJoin = () => {
        if (joinCode.trim()) {
            onJoinSession(joinCode.trim().toUpperCase())
            setJoinCode('')
        }
    }

    return (
        <div className="session-list">
            <div className="session-list-header">
                <h2>Planning Poker Sessions</h2>
                <div className="session-list-actions">
                    <button onClick={onRefresh} disabled={loading}>
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                    <button onClick={onCreateNew} className="primary">
                        Create New Session
                    </button>
                </div>
            </div>

            <div className="join-session">
                <h3>Join Existing Session</h3>
                <div className="join-form">
                    <input
                        type="text"
                        placeholder="Enter session code (e.g., ABC123)"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={6}
                    />
                    <button onClick={handleJoin} disabled={!joinCode.trim()}>
                        Join Session
                    </button>
                </div>
            </div>

            <div className="sessions-grid">
                {sessions.length === 0 && !loading && (
                    <div className="no-sessions">
                        <p>No planning poker sessions found.</p>
                        <p>Create your first session to get started!</p>
                    </div>
                )}

                {sessions.map((session) => (
                    <div key={session.sys_id} className="session-card">
                        <h3>{session.name}</h3>
                        <p>{session.description}</p>
                        <div className="session-meta">
                            <span className={`status status-${session.status}`}>
                                {session.status}
                            </span>
                            <span>Code: {session.session_code}</span>
                        </div>
                        <div className="session-stats">
                            <span>{session.total_stories || 0} stories</span>
                            <span>{session.consensus_rate || 0}% consensus</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SessionList
```

### Session Form Component (`src/client/components/SessionForm.tsx`)
```tsx
import React, { useState } from 'react'
import { PlanningSession } from '../types'

interface SessionFormProps {
    onSubmit: (sessionData: Partial<PlanningSession>) => void
    onCancel: () => void
    loading: boolean
}

const SessionForm: React.FC<SessionFormProps> = ({ onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        timebox_minutes: 30
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.name.trim()) {
            onSubmit(formData)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="session-form">
            <h2>Create New Planning Poker Session</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Session Name *</label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter session name"
                        required
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Describe the purpose of this session"
                        rows={3}
                        maxLength={1000}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="timebox">Timebox (minutes)</label>
                    <input
                        id="timebox"
                        type="number"
                        value={formData.timebox_minutes}
                        onChange={(e) => handleChange('timebox_minutes', parseInt(e.target.value) || 30)}
                        min={5}
                        max={480}
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading || !formData.name.trim()}>
                        {loading ? 'Creating...' : 'Create Session'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SessionForm
```

## Types and Utilities

### Types (`src/client/types/index.ts`)
```typescript
export interface PlanningSession {
    sys_id: string
    name: string
    description: string
    status: 'pending' | 'active' | 'completed'
    session_code: string
    dealer: string
    total_stories: number
    completed_stories: number
    consensus_rate: number
    started_at?: string
    completed_at?: string
    timebox_minutes: number
    sys_created_on: string
    sys_updated_on: string
}

export interface SessionParticipant {
    sys_id: string
    session: string
    user: string
    role: 'participant' | 'observer'
    joined_at: string
    left_at?: string
}

export interface SessionStory {
    sys_id: string
    session: string
    story_title: string
    description: string
    sequence_order: number
    status: 'pending' | 'active' | 'completed'
    final_estimate?: string
    consensus_achieved: boolean
}

export interface PlanningVote {
    sys_id: string
    session: string
    story: string
    user: string
    vote_value: string
    voted_at: string
}

export class ServiceNowAPIError extends Error {
    constructor(message: string, public statusCode: number = 0, public originalError?: any) {
        super(message)
        this.name = 'ServiceNowAPIError'
    }
}

export function getValue<T>(obj: any, defaultValue?: T): T | undefined {
    if (obj && typeof obj === 'object' && 'value' in obj) {
        return obj.value
    }
    return obj !== undefined ? obj : defaultValue
}
```

### Planning Poker Utils (`src/client/utils/planningPokerUtils.ts`)
```typescript
export class PlanningPokerUtils {
    static readonly FIBONACCI_SCALE = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?']
    static readonly STANDARD_SCALE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?']
    static readonly TSHIRT_SCALE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?']

    static generateSessionCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    static validateSessionCode(code: string): boolean {
        return /^[A-Z0-9]{6}$/.test(code)
    }

    static sanitizeInput(input: string): string {
        if (!input) return ''
        return input.trim().replace(/[<>]/g, '')
    }

    static calculateConsensus(votes: string[]): { consensus: boolean; average?: number } {
        if (votes.length === 0) return { consensus: false }

        const numericVotes = votes
            .filter(vote => vote !== '?' && !isNaN(Number(vote)))
            .map(vote => Number(vote))

        if (numericVotes.length === 0) return { consensus: false }

        const average = numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length
        const consensus = numericVotes.every(vote => Math.abs(vote - average) / average < 0.2)

        return { consensus, average }
    }

    static formatEstimate(estimate: string | number): string {
        if (estimate === null || estimate === undefined) return 'Not estimated'
        if (estimate === '?') return 'Unknown'
        return String(estimate)
    }

    static getTimeRemaining(startTime: string, timeboxMinutes: number): { minutes: number; seconds: number; expired: boolean } {
        const start = new Date(startTime).getTime()
        const now = new Date().getTime()
        const timeboxMs = timeboxMinutes * 60 * 1000
        const elapsed = now - start
        const remaining = Math.max(0, timeboxMs - elapsed)

        const minutes = Math.floor(remaining / (60 * 1000))
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

        return {
            minutes,
            seconds,
            expired: remaining === 0
        }
    }
}
```

## Styling

### Main CSS (`src/client/app.css`)
```css
/* Planning Poker Application Styles */

:root {
    --primary-color: #007acc;
    --secondary-color: #f8f9fa;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --text-color: #333;
    --border-color: #dee2e6;
    --shadow: 0 2px 4px rgba(0,0,0,0.1);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: #f5f5f5;
}

.app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.app-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: var(--shadow);
}

.app-header h1 {
    color: var(--primary-color);
    margin-bottom: 10px;
}

.app-main {
    background: white;
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 20px;
}

/* Buttons */
button {
    padding: 8px 16px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

button:hover {
    background: var(--secondary-color);
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

button.primary {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

button.primary:hover {
    background: #005a9e;
}

/* Form Styles */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 30px;
}

/* Session List */
.session-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.session-list-actions {
    display: flex;
    gap: 10px;
}

.join-session {
    margin-bottom: 30px;
    padding: 20px;
    background: var(--secondary-color);
    border-radius: 8px;
}

.join-form {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.join-form input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    text-transform: uppercase;
}

.sessions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.session-card {
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    transition: box-shadow 0.2s;
}

.session-card:hover {
    box-shadow: var(--shadow);
}

.session-card h3 {
    margin-bottom: 10px;
    color: var(--primary-color);
}

.session-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
}

.status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
}

.status-pending {
    background: var(--warning-color);
    color: #000;
}

.status-active {
    background: var(--success-color);
    color: white;
}

.status-completed {
    background: var(--secondary-color);
    color: var(--text-color);
}

.session-stats {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
}

/* Error Messages */
.error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
}

.no-sessions {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: #666;
}

/* Responsive */
@media (max-width: 768px) {
    .app {
        padding: 10px;
    }
    
    .session-list-header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }
    
    .session-list-actions {
        justify-content: center;
    }
    
    .sessions-grid {
        grid-template-columns: 1fr;
    }
    
    .join-form {
        flex-direction: column;
    }
    
    .form-actions {
        flex-direction: column;
    }
}
```

## Build and Deployment

### Package.json Scripts
```json
{
  "name": "x-902080-planning-poker",
  "version": "1.0.0",
  "scripts": {
    "build": "now-sdk build",
    "deploy": "now-sdk install",
    "lint": "eslint src/ --ext .js,.jsx,.ts,.tsx",
    "lint:errors-only": "eslint src/ --ext .js,.jsx,.ts,.tsx --quiet",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {},
  "devDependencies": {
    "@servicenow/sdk": "^1.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Business Rules

Create `src/fluent/business-rules/session-defaults.now.ts`:
```typescript
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['session_defaults_br'],
    name: 'Set Session Defaults',
    table: 'x_902080_planpoker_session',
    when: 'before',
    action: ['insert'],
    script: `
        // Set default timebox if not provided
        if (!current.timebox_minutes) {
            current.timebox_minutes = 30;
        }
        
        // Generate session code if not provided
        if (!current.session_code) {
            current.session_code = generateSessionCode();
        }
        
        // Set dealer to current user if not provided
        if (!current.dealer) {
            current.dealer = gs.getUserID();
        }
        
        function generateSessionCode() {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var code = '';
            for (var i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        }
    `,
    order: 100,
    active: true,
    description: 'Sets default values for planning sessions'
})
```

## UI Page

Create `src/fluent/ui-pages/planning-poker-app.now.ts`:
```typescript
import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import planningPokerPage from '../../client/index.html'

UiPage({
    $id: Now.ID['planning-poker-page'],
    endpoint: 'x_902080_planpoker_app.do',
    description: 'Planning Poker Application - Collaborative estimation for agile teams',
    category: 'general',
    html: planningPokerPage,
    direct: true,
    roles: [],
    public: false,
})
```

## Final Steps

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to ServiceNow**:
   ```bash
   npm run deploy
   ```

3. **Access the application**:
   - Navigate to the Planning Poker application in ServiceNow
   - The application should load with session management capabilities

## Key Features Implemented

- ✅ Session creation and management
- ✅ Join sessions using session codes
- ✅ Real-time session status tracking
- ✅ Server-side data access via GlideAjax
- ✅ Responsive UI with modern design
- ✅ Error handling and loading states
- ✅ ServiceNow integration with proper authentication
- ✅ TypeScript for type safety
- ✅ ESLint for code quality

This comprehensive Planning Poker application provides a complete solution for agile teams to conduct collaborative story estimation sessions within ServiceNow.
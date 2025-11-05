# API Integration & Service Layer Agent

## Role
Specialist for ServiceNow REST API integration, client-side services, and data transformation between ServiceNow and React frontend.

## Expertise
- ServiceNow REST API (Table API)
- GlideAjax for AJAX processors
- Authentication with X-UserToken
- TypeScript service patterns
- Data transformation and validation

## Primary Responsibilities

### 1. Service Layer Development
**Location:** `src/client/services/`

**Tasks:**
- Create service classes for each table
- Implement CRUD operations
- Handle authentication
- Transform ServiceNow responses
- Implement business logic

**Pattern:**
```typescript
// src/client/services/PlanningSessionService.ts
import { nativeService } from '../utils/serviceNowNativeService'
import { PlanningSession } from '../types'
import { getValue } from '../utils/serviceUtils'

export class PlanningSessionService {
  private readonly tableName = 'x_1860782_msm_pl_0_session'

  async list(params?: {
    filters?: Record<string, any>
    orderBy?: string
    limit?: number
  }): Promise<PlanningSession[]> {
    try {
      const results = await nativeService.query(this.tableName, {
        limit: params?.limit || 50,
        fields: ['sys_id', 'name', 'description', 'status', 'session_code', 
                 'dealer', 'total_stories', 'stories_completed', 'consensus_rate'],
        filters: params?.filters || {},
        orderBy: params?.orderBy || '-sys_created_on'
      })
      return results as PlanningSession[]
    } catch (error) {
      console.error('PlanningSessionService.list:', error)
      throw new Error('Failed to load sessions')
    }
  }

  async get(sysId: string): Promise<PlanningSession> {
    try {
      const result = await nativeService.get(this.tableName, sysId)
      return result as PlanningSession
    } catch (error) {
      console.error('PlanningSessionService.get:', error)
      throw new Error('Failed to load session')
    }
  }

  async create(data: Partial<PlanningSession>): Promise<PlanningSession> {
    try {
      const sessionData = {
        name: getValue(data.name),
        description: getValue(data.description) || '',
        status: 'draft',
        session_code: this.generateSessionCode(),
        dealer: nativeService.getCurrentUser().userID
      }
      
      const response = await nativeService.create(this.tableName, sessionData)
      return await this.get(response.result.sys_id)
    } catch (error) {
      console.error('PlanningSessionService.create:', error)
      throw new Error('Failed to create session')
    }
  }

  async update(sysId: string, data: Partial<PlanningSession>): Promise<PlanningSession> {
    try {
      const updateData = {
        name: getValue(data.name),
        description: getValue(data.description),
        status: getValue(data.status)
      }
      
      await nativeService.update(this.tableName, sysId, updateData)
      return await this.get(sysId)
    } catch (error) {
      console.error('PlanningSessionService.update:', error)
      throw new Error('Failed to update session')
    }
  }

  async delete(sysId: string): Promise<void> {
    try {
      await nativeService.delete(this.tableName, sysId)
    } catch (error) {
      console.error('PlanningSessionService.delete:', error)
      throw new Error('Failed to delete session')
    }
  }

  async joinSession(sessionCode: string): Promise<PlanningSession | null> {
    try {
      const results = await nativeService.query(this.tableName, {
        filters: { session_code: sessionCode },
        limit: 1
      })
      
      if (results.length === 0) {
        throw new Error('Session not found')
      }
      
      const session = results[0] as PlanningSession
      const sessionId = getValue(session.sys_id)
      
      // Add user as participant
      await nativeService.create('x_1860782_msm_pl_0_session_participant', {
        session: sessionId,
        user: nativeService.getCurrentUser().userID,
        role: 'participant',
        joined_at: new Date().toISOString()
      })
      
      return session
    } catch (error) {
      console.error('PlanningSessionService.joinSession:', error)
      throw error
    }
  }

  private generateSessionCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
}

export const sessionService = new PlanningSessionService()
```

### 2. Native Service Integration
**Location:** `src/client/utils/serviceNowNativeService.ts`

**Critical:** This is the bridge between React and ServiceNow APIs.

**Key Methods:**
```typescript
export class ServiceNowNativeService {
  // REST API query
  async query(tableName: string, params?: QueryParams): Promise<any[]>
  
  // Get single record
  async get(tableName: string, sysId: string): Promise<any>
  
  // Create record
  async create(tableName: string, data: any): Promise<any>
  
  // Update record
  async update(tableName: string, sysId: string, data: any): Promise<any>
  
  // Delete record
  async delete(tableName: string, sysId: string): Promise<void>
  
  // Get current user
  getCurrentUser(): { userID: string, userName: string }
}
```

**Authentication Pattern:**
```typescript
async query(tableName: string, params?: QueryParams): Promise<any[]> {
  const url = new URL(`/api/now/table/${tableName}`, window.location.origin)
  
  // Add query parameters
  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-UserToken': window.g_ck // Critical for authentication
    },
    credentials: 'same-origin'
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.result || []
}
```

### 3. Data Transformation Utilities
**Location:** `src/client/utils/serviceUtils.ts`

**Purpose:** Handle ServiceNow's nested value objects

**Key Utilities:**
```typescript
// Extract value from ServiceNow field
export function getValue<T>(field: T | ServiceNowValue<T>): T {
  if (field === null || field === undefined) {
    return field as T
  }
  
  if (typeof field === 'object' && 'value' in field) {
    return field.value
  }
  
  return field
}

// Get display value
export function getDisplayValue(field: ServiceNowValue<any>): string {
  if (field && typeof field === 'object' && 'display_value' in field) {
    return field.display_value
  }
  return String(field || '')
}

// Safe parsing
export function parseServiceNowInt(value: any): number {
  const extracted = getValue(value)
  const parsed = parseInt(extracted, 10)
  return isNaN(parsed) ? 0 : parsed
}

export function parseServiceNowBool(value: any): boolean {
  const extracted = getValue(value)
  if (typeof extracted === 'boolean') return extracted
  if (typeof extracted === 'string') {
    return extracted.toLowerCase() === 'true' || extracted === '1'
  }
  return false
}
```

## Service Architecture

### Services to Implement:

1. **PlanningSessionService** ✅
   - Session CRUD
   - Join session by code
   - Session statistics
   - Participant management

2. **VotingService** ✅
   - Submit votes
   - Get voting statistics
   - Detect consensus
   - Reveal votes

3. **StoryService** ✅
   - Story CRUD
   - Bulk import
   - Reorder stories
   - Story progress

4. **AnalyticsService**
   - Session metrics
   - Consensus calculations
   - Velocity tracking
   - Team statistics

## API Patterns

### Query with Filters:
```typescript
const activeSessions = await sessionService.list({
  filters: { status: 'active' },
  orderBy: '-sys_created_on',
  limit: 20
})
```

### Complex Queries:
```typescript
// Get votes for a story
const votes = await nativeService.query('x_1860782_msm_pl_0_vote', {
  filters: { 
    story: storyId,
    'session.status': 'active'  // Dot-walk filtering
  },
  fields: ['sys_id', 'voter', 'estimate', 'voted_at']
})
```

### Error Handling:
```typescript
try {
  const session = await sessionService.get(sysId)
  return session
} catch (error) {
  if (error.message.includes('404')) {
    throw new Error('Session not found')
  } else if (error.message.includes('403')) {
    throw new Error('Access denied')
  }
  throw new Error('Failed to load session')
}
```

## Key Rules

### ✅ DO:
1. Use nativeService for all ServiceNow API calls
2. Include X-UserToken header (g_ck)
3. Use credentials: 'same-origin'
4. Transform responses with getValue()
5. Implement proper error handling
6. Log errors with service name prefix
7. Validate input data
8. Return typed responses
9. Handle null/undefined gracefully
10. Test with real ServiceNow instance

### ❌ DON'T:
1. Use GlideRecord in client-side code
2. Skip authentication headers
3. Return raw ServiceNow responses
4. Ignore error responses
5. Hardcode sys_ids
6. Use synchronous APIs
7. Skip input validation
8. Return 'any' types
9. Expose internal implementation details
10. Skip error logging

## Authentication

### Session Token:
```typescript
// Available globally in ServiceNow UI
window.g_ck // Current user session token

// Include in all API requests
headers: {
  'X-UserToken': window.g_ck
}
```

### User Context:
```typescript
// Get current user
const user = nativeService.getCurrentUser()
// Returns: { userID: string, userName: string }

// Use in service methods
dealer: nativeService.getCurrentUser().userID
```

## Testing Checklist

Before deployment:
- [ ] All services compile without errors
- [ ] Authentication headers included
- [ ] Error handling implemented
- [ ] Input validation works
- [ ] Responses are typed correctly
- [ ] getValue() used for ServiceNow fields
- [ ] Network requests succeed
- [ ] Error messages are user-friendly
- [ ] Logging is consistent
- [ ] No hardcoded values

## Commands

```bash
# Type check services
npm run type-check

# Lint services
npm run lint src/client/services/

# Build and deploy
npm run build && npm run deploy
```

## Troubleshooting

**401 Unauthorized:**
- Check X-UserToken header
- Verify user is logged in
- Check session hasn't expired

**404 Not Found:**
- Verify table name is correct
- Check sys_id is valid
- Ensure record exists

**CORS errors:**
- Use credentials: 'same-origin'
- Check ServiceNow CORS settings
- Verify running in ServiceNow context

**getValue() errors:**
- Check field isn't null/undefined
- Verify ServiceNow response format
- Add null checks before extraction

# React Frontend Development Agent

## Role
Frontend specialist for React 19 + TypeScript development, focusing on UI components, state management, and ServiceNow API integration.

## Expertise
- React 19.x with Hooks
- TypeScript 5.5.4
- Modern CSS with responsive design
- ServiceNow REST API integration
- Client-side state management

## Primary Responsibilities

### 1. React Component Development
**Location:** `src/client/components/`

**Tasks:**
- Create functional components with TypeScript
- Implement proper prop types and interfaces
- Use React hooks (useState, useEffect, useCallback)
- Handle loading/error states
- Build responsive layouts

**Pattern:**
```typescript
import React, { useState, useEffect } from 'react'
import { PlanningSession } from '../types'

interface SessionListProps {
  onSessionSelect: (session: PlanningSession) => void
}

export default function SessionList({ onSessionSelect }: SessionListProps) {
  const [sessions, setSessions] = useState<PlanningSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const data = await sessionService.list()
      setSessions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="session-list">
      {sessions.map(session => (
        <SessionCard 
          key={session.sys_id} 
          session={session}
          onClick={() => onSessionSelect(session)}
        />
      ))}
    </div>
  )
}
```

### 2. Service Layer Integration
**Location:** `src/client/services/`

**Tasks:**
- Consume service layer APIs
- Handle async operations
- Manage loading states
- Process API responses
- Extract values from ServiceNow objects

**Pattern:**
```typescript
import { sessionService } from '../services'
import { getValue } from '../utils/serviceUtils'

const createSession = async (data: Partial<PlanningSession>) => {
  try {
    const newSession = await sessionService.create(data)
    // Extract values safely
    const sessionId = getValue(newSession.sys_id)
    const sessionCode = getValue(newSession.session_code)
    return { sessionId, sessionCode }
  } catch (error) {
    console.error('Failed to create session:', error)
    throw error
  }
}
```

### 3. Styling and UI/UX
**Location:** `src/client/components/*.css`

**Tasks:**
- Create responsive CSS
- Implement Planning Poker theme
- Use CSS Grid/Flexbox
- Add animations and transitions
- Ensure accessibility

**Pattern:**
```css
/* Planning Poker Color Scheme */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  --card-bg: #ffffff;
  --border-radius: 8px;
}

.session-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.session-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
```

## Component Catalog

### Core Components:

1. **SessionList** - Display all planning sessions
   - Grid layout with session cards
   - Status badges
   - Progress indicators
   - Join/View/Edit actions

2. **SessionForm** - Create/edit sessions
   - Form validation
   - Auto-generated session codes
   - Dealer assignment
   - Story import

3. **VotingSession** - Active voting interface
   - T-shirt sizing cards (XS, S, M, L, XL, XXL, ?, ☕)
   - Vote reveal animation
   - Real-time vote tracking
   - Story navigation

4. **SessionDashboard** - Session management view
   - Story list with drag-drop ordering
   - Participant list
   - Session controls (start, pause, complete)
   - Progress tracking

5. **StoryManager** - Story management
   - Add/edit/delete stories
   - Bulk import from CSV
   - Sequence ordering
   - Story details (description, acceptance criteria)

6. **AnalyticsDashboard** - Session analytics
   - Consensus rate charts
   - Velocity metrics
   - Vote distribution
   - Team statistics

7. **VotingCard** - Individual voting card
   - T-shirt sizing scale values (XS, S, M, L, XL, XXL, ?, ☕)
   - Selected state styling
   - Confidence indicator
   - Disabled state when revealed

## TypeScript Types

### Key Interfaces:
```typescript
// src/client/types/index.ts

export interface PlanningSession {
  sys_id: string | ServiceNowValue<string>
  name: string | ServiceNowValue<string>
  description: string | ServiceNowValue<string>
  status: 'draft' | 'active' | 'paused' | 'completed'
  session_code: string | ServiceNowValue<string>
  dealer: string | ServiceNowValue<string>
  total_stories: number | ServiceNowValue<number>
  stories_completed: number | ServiceNowValue<number>
  consensus_rate: number | ServiceNowValue<number>
}

export interface SessionStory {
  sys_id: string | ServiceNowValue<string>
  session: string | ServiceNowValue<string>
  story_title: string | ServiceNowValue<string>
  description: string | ServiceNowValue<string>
  sequence_order: number | ServiceNowValue<number>
  status: 'pending' | 'voting' | 'completed'
  final_estimate: string | ServiceNowValue<string>
  consensus_achieved: boolean | ServiceNowValue<boolean>
}

export interface Vote {
  sys_id: string | ServiceNowValue<string>
  story: string | ServiceNowValue<string>
  voter: string | ServiceNowValue<string>
  estimate: string | ServiceNowValue<string>
  confidence: number | ServiceNowValue<number>
  voted_at: string | ServiceNowValue<string>
}
```

## Key Rules

### ✅ DO:
1. Use TypeScript for all components
2. Define prop interfaces
3. Handle loading/error states
4. Use getValue() for ServiceNow fields
5. Implement proper error boundaries
6. Add accessibility attributes
7. Create responsive designs
8. Use semantic HTML
9. Optimize re-renders with useMemo/useCallback
10. Test across browsers

### ❌ DON'T:
1. Use `any` types
2. Ignore TypeScript errors
3. Mutate state directly
4. Skip loading states
5. Use inline styles everywhere
6. Create deeply nested components
7. Ignore accessibility
8. Hardcode API endpoints
9. Skip error handling
10. Use deprecated React patterns

## State Management Patterns

### Local State (useState):
```typescript
const [sessions, setSessions] = useState<PlanningSession[]>([])
const [selectedSession, setSelectedSession] = useState<PlanningSession | null>(null)
```

### Derived State:
```typescript
const activeSessions = sessions.filter(s => getValue(s.status) === 'active')
const completedCount = sessions.filter(s => getValue(s.status) === 'completed').length
```

### Effect Hooks:
```typescript
useEffect(() => {
  const loadData = async () => {
    const data = await sessionService.list()
    setSessions(data)
  }
  loadData()
}, []) // Empty deps = run once on mount
```

## Responsive Design

### Breakpoints:
```css
/* Mobile first approach */
.session-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .session-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .session-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Testing Checklist

Before commit:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] All props have types
- [ ] Loading states work
- [ ] Error states display correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility attributes present
- [ ] No console errors
- [ ] Performance is acceptable

## Commands

```bash
# Type check
npm run type-check

# Lint
npm run lint
npm run lint:fix

# Build
npm run build

# Deploy
npm run deploy
```

## Troubleshooting

**TypeScript errors:**
- Check import paths
- Verify interface definitions
- Use getValue() for ServiceNow fields

**Component not rendering:**
- Check React DevTools
- Verify props are passed correctly
- Check for errors in console

**Styling issues:**
- Check CSS selector specificity
- Verify CSS file is imported
- Use browser DevTools

**API errors:**
- Check Network tab
- Verify service method exists
- Check authentication headers

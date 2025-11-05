# Planning Poker Fluent - AI Agent Instructions

## Project Overview
**MSM Planning Poker** - ServiceNow application built with **NowSDK 4.0.2**, React 19, TypeScript 5.5, and ServiceNow Fluent framework. Enables agile teams to perform collaborative story point estimation with real-time voting and analytics.

**Key Context:** This project underwent a critical migration (Nov 2025) from server-side GlideRecord to client-side REST APIs. Understanding the client/server API boundary is essential. All GlideAjax calls have been removed - Fluent framework requires pure REST API usage.

## Architecture

### Core Structure
```
src/
├── fluent/           # ServiceNow backend (server-side)
│   ├── tables/       # Database schema definitions (Fluent DSL)
│   └── business-rules/ # Server-side logic only
├── client/           # Browser-executed code (client-side)
│   ├── services/     # API layer using REST with auth
│   ├── components/   # React components (TSX)
│   └── utils/        # Client utilities
└── server/           # Legacy server scripts (avoid for new code)
```

### Data Model
4 ServiceNow tables with scope `x_1860782_msm_pl_0`:
- `session` - Planning sessions with dealer, status, metrics
- `session_stories` - User stories with voting status, consensus tracking
- `vote` - Individual votes with versioning
- `session_participant` - Session membership and roles

Planning Poker scales (T-shirt sizing): XS, S, M, L, XL, XXL, ?, ☕

**Important:** Current instance is `dev313212.service-now.com` (fresh install with ServiceNow-generated scope)

## Critical Development Patterns

### ServiceNow API Context (MOST IMPORTANT)
**Client-side code (React, services, utils):**
- ✅ Use REST API via `fetch()` with authentication
- ✅ Include `X-UserToken: window.g_ck` header
- ✅ Use `credentials: 'same-origin'`
- ❌ NEVER use GlideRecord, GlideAjax, or server-side APIs

**Server-side code (Fluent business rules, script includes):**
- ✅ Use GlideRecord for database operations
- ✅ Use Fluent framework syntax from `@servicenow/sdk-core/db`
- ❌ NEVER import client-side React or browser APIs

**Example - Correct Client-Side Pattern:**
```typescript
// In src/client/services/
async query(tableName: string) {
  const response = await fetch(`/api/now/table/${tableName}`, {
    headers: { 'X-UserToken': window.g_ck },
    credentials: 'same-origin'
  });
  return response.json();
}
```

### TypeScript Type System
ServiceNow returns objects with nested values. Use type-safe extraction:

```typescript
// Types defined in src/client/types/index.ts
interface ServiceNowDisplayValue<T> {
  value: T;
  display_value: string;
}

// Extract values safely
function getValue<T>(field: T | ServiceNowDisplayValue<T>): T {
  return typeof field === 'object' && field !== null && 'value' in field
    ? field.value
    : field;
}
```

### Fluent Table Definitions
Tables use Fluent DSL, not TypeScript classes:
```typescript
// In src/fluent/tables/
import { Table, StringColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_902080_planpoker_session = Table({
  name: 'x_902080_planpoker_session',
  schema: {
    session_code: StringColumn({ unique: true, maxLength: 10 }),
    status: StringColumn({
      choices: { pending: {...}, active: {...} }
    })
  },
  accessible_from: 'public',
  allow_web_service_access: true
})
```

## Build & Development Workflow

### Essential Commands
```bash
npm run build        # Rollup bundler via now-sdk (see now.prebuild.mjs)
npm run deploy       # Push to ServiceNow instance
npm run type-check   # Validate TypeScript without bundling
npm run lint:fix     # Auto-fix ESLint issues
npm run check-all    # Pre-commit validation (lint + build)
```

### Build System
- **Prebuild:** `now.prebuild.mjs` uses `@servicenow/isomorphic-rollup` to bundle client files
- **Entry points:** All `*.html` files in `src/client/`
- **Output:** `staticContentDir` (defined in `now.config.json`)
- **Bundle size:** ~600KB typical

### Hot Reload Pattern
Changes to `src/client/` require `npm run build && npm run deploy` to see in ServiceNow. No watch mode.

## Component Development

### React Component Pattern
```tsx
// Components use functional style with hooks
import { useState, useEffect } from 'react'
import { PlanningSession } from '../types'

export default function SessionList({ 
  sessions,
  onViewSession 
}: { sessions: PlanningSession[], onViewSession: (s: PlanningSession) => void }) {
  const [loading, setLoading] = useState(false)
  
  const handleClick = (session: PlanningSession) => {
    const sysId = getValue(session.sys_id) // Type-safe extraction
    onViewSession(session)
  }
  // ...
}
```

### Service Layer Pattern
Services in `src/client/services/` follow this structure:
```typescript
export class PlanningSessionService {
  private readonly tableName = 'x_902080_planpoker_session'
  
  async list(params?: { filters?: Record<string, any> }): Promise<PlanningSession[]> {
    const results = await nativeService.query(this.tableName, {
      limit: 50,
      fields: ['sys_id', 'name', 'status'],
      filters: params?.filters
    })
    return results as PlanningSession[]
  }
  
  async create(data: Partial<PlanningSession>): Promise<PlanningSession> {
    const sanitized = {
      name: PlanningPokerUtils.sanitizeInput(getValue(data.name)),
      session_code: PlanningPokerUtils.generateSessionCode(),
      dealer: nativeService.getCurrentUser().userID
    }
    const response = await nativeService.create(this.tableName, sanitized)
    return this.get(response.result.sys_id)
  }
}
```

## Common Issues & Solutions

### "GlideRecord not available" Error
**Cause:** Attempting to use server-side API in client code  
**Fix:** Use `nativeService.query()` from `serviceNowNativeService.ts` instead

### Session List Showing 0 Results
**Cause:** Missing authentication or ACL restrictions  
**Fix:** Ensure `allow_web_service_access: true` in table definition and `X-UserToken` header present

### ORDERBY Query Failures
**Cause:** ServiceNow REST API strict query encoding  
**Fix:** Sort client-side after fetch or use simple field names without `^ORDERBY` prefix

### TypeScript "Cannot read property 'value'" Errors
**Cause:** Mixing ServiceNow object types with primitives  
**Fix:** Always use `getValue(field)` helper function

## Testing Approach

### Manual Testing Flow (see TESTING_GUIDE.md)
1. Deploy: `npm run deploy`
2. Navigate to ServiceNow instance Planning Poker app
3. Test sequence: Create session → Add stories → Vote → View analytics
4. Check browser console for API errors (F12)

### Debugging
- All services log to console with prefixes like `PlanningSessionService.list:`
- Network tab shows REST API calls to `/api/now/table/x_902080_planpoker_*`
- Check ServiceNow ACLs if 403 errors occur

## Key Files to Reference

- **Architecture:** `AGENT_UPDATE.md` - Complete migration history and patterns
- **API Service:** `src/client/utils/serviceNowNativeService.ts` - REST API wrapper
- **Types:** `src/client/types/index.ts` - All TypeScript interfaces
- **Schema:** `src/fluent/tables/planning-poker.now.ts` - Database structure
- **Main App:** `src/client/app.tsx` - View routing and state management

## DO NOT

- ❌ Use GlideRecord in `src/client/` code
- ❌ Import React in `src/fluent/` or `src/server/` code
- ❌ Create Script Includes with standard JS/TS (Fluent syntax only)
- ❌ Modify table names without updating all 7 service files
- ❌ Skip authentication headers on REST API calls
- ❌ Use `any` types (use proper interfaces from `types/index.ts`)

## DO

- ✅ Check `AGENT_UPDATE.md` for migration context before major changes
- ✅ Run `npm run check-all` before committing
- ✅ Use `getValue()` utility for ServiceNow fields
- ✅ Add new tables to `src/fluent/tables/planning-poker.now.ts`
- ✅ Follow existing service patterns in `services/` directory
- ✅ Test in actual ServiceNow instance (not localhost)

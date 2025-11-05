# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **MSM Planning Poker** - a ServiceNow application built with **NowSDK 4.0.2 (Fluent API)**. It enables agile teams to conduct collaborative story estimation sessions directly within ServiceNow.

**Scope**: `x_1860782_msm_pl_0` (ServiceNow-generated on fresh install)
**Architecture**: React 19/TypeScript 5.5 frontend + ServiceNow Fluent backend
**Instance**: dev313212.service-now.com (fresh installation)

## ⚠️ CRITICAL: Client/Server API Boundary

**This project underwent a critical migration (November 2025)** from server-side GlideRecord to client-side REST APIs. Understanding this boundary is essential:

### Client-Side Code (`src/client/`)
- ✅ **USE:** REST API via `fetch()` with authentication
- ✅ **USE:** `window.g_ck` for session token
- ✅ **USE:** `credentials: 'same-origin'`
- ❌ **NEVER:** GlideRecord, GlideAjax, or any server-side APIs
- **IMPORTANT:** All GlideAjax calls have been removed - Fluent requires pure REST API

### Server-Side Code (`src/fluent/`)
- ✅ **USE:** GlideRecord for database operations
- ✅ **USE:** Fluent framework from `@servicenow/sdk-core/db`
- ❌ **NEVER:** React, browser APIs, or client-side code

**Key Learning:** GlideRecord is server-side only and will fail with "not available" errors in browser context. Always use authenticated REST API calls in client code.

## Build, Test, and Development Commands

### Essential Commands
```bash
# Build the application (compiles Fluent APIs and React components)
npm run build

# Deploy to ServiceNow instance
npm run deploy

# Transform Fluent definitions to ServiceNow XML
npm run transform

# Type checking
npm run type-check

# Linting
npm run lint                    # Full lint with warnings
npm run lint:errors-only        # Errors only (faster)
npm run lint:fix                # Auto-fix issues

# Pre-commit validation
npm run check-all               # Runs lint:errors-only + build
```

### Development Workflow
1. Make changes to source files in `src/`
2. Run `npm run build` to compile
3. Run `npm run deploy` to push to ServiceNow instance
4. Access via ServiceNow: Navigate to the Planning Poker application

### Deployment Considerations

**⚠️ Codespaces/Headless Environment Limitation:**
- NowSDK requires D-Bus/X11 for credential storage (system keychain)
- GitHub Codespaces and headless environments cannot use `npm run deploy`
- **Solution:** Deploy from local machine with GUI, or use manual upload via ServiceNow Studio
- See `PHASE_2_3_COMPLETION_SUMMARY.md` for detailed workarounds

## High-Level Architecture

### ServiceNow Fluent Backend (`src/fluent/`)

**Tables** (`tables/planning-poker.now.ts`):
- `x_1860782_msm_pl_0_session` - Planning sessions with status, dealer, consensus tracking
- `x_1860782_msm_pl_0_session_stories` - Stories to be estimated (sequenced, votable)
- `x_1860782_msm_pl_0_vote` - Individual votes with versioning support
- `x_1860782_msm_pl_0_session_participant` - Session membership tracking

**Script Include** (`script-includes/planning-poker-session.now.ts`):
- `PlanningPokerSessionAjax` - Server-side GlideAjax processor for session CRUD operations
- Methods: `getSessions()`, `getSession()`, `createSession()`, `generateSessionCode()`

**Business Rules** (`business-rules/session-defaults.now.ts`):
- Sets default values on session creation (timebox, session_code, dealer)

**UI Pages** (`ui-pages/planning-poker-app.now.ts`):
- Defines the application endpoint and HTML container

### React Frontend (`src/client/`)

**Main App Flow** (`app.tsx`):
- Error boundary wrapping
- View modes: `list` (session list), `form` (create/edit), `session` (active session), `analytics`
- Manages session state and coordinates service calls

**Services Layer** (`services/`):
- `PlanningSessionService` - Session CRUD, join by code, participant management
- `VotingService` - Vote submission, retrieval, consensus calculation
- `StoryService` - Story management for sessions
- `AnalyticsService` - Session statistics and metrics

**Native Service Integration** (`utils/serviceNowNativeService.ts`):
- Singleton service wrapping ServiceNow's REST API
- **Authentication:** Uses `window.g_ck` (CSRF token) in `X-UserToken` header
- **Pattern:** `fetch()` with `credentials: 'same-origin'` and proper headers
- **Critical**: Always check `window.g_ck` availability before API calls
- Example authentication pattern:
  ```typescript
  headers: {
    'X-UserToken': window.g_ck,
    'Content-Type': 'application/json'
  },
  credentials: 'same-origin'
  ```

**Key Components** (`components/`):
- `SessionList` - Display and search sessions
- `SessionForm` - Create/edit session form
- `SessionDashboard` - Active session view (dealer controls, story management)
- `VotingSession` - Real-time voting interface
- `StoryManager` - Add/edit/reorder stories
- `AnalyticsDashboard` - Session statistics and charts

### Data Flow Patterns

**Session Creation**:
1. User fills `SessionForm` → validates input
2. `PlanningSessionService.create()` → sanitizes data, generates session code
3. Calls `nativeService.create()` → sends POST to REST API or GlideAjax
4. Business rule `session-defaults` sets defaults server-side
5. Returns created session → navigates to session dashboard

**Voting Flow**:
1. Dealer activates story → status changes to `voting`
2. Participants submit votes via `VotingService.submitVote()`
3. Votes stored with version tracking (`is_current` flag)
4. Dealer reveals votes → status changes to `revealed`
5. `VotingService.calculateConsensus()` determines if estimates align
6. Dealer sets final estimate → story status becomes `completed`

**ServiceNow Integration**:
- Uses ServiceNow REST API (`/api/now/table/`) exclusively for all operations
- **No GlideAjax** - Fluent framework requires pure REST API usage
- Authentication via `window.g_ck` session token in `X-UserToken` header
- Display values retrieved with `sysparm_display_value=all`

## Critical Implementation Details

### ServiceNow Authentication
The app relies on `window.g_ck` for ServiceNow session authentication. Always verify availability:
```typescript
if (typeof window !== 'undefined' && window.g_ck) {
    headers['X-UserToken'] = window.g_ck;
}
```

### Type-Safe Field Extraction
ServiceNow returns fields as either primitives or `{value, display_value}` objects. Always use the `getValue()` helper:
```typescript
// Defined in src/client/types/index.ts
interface ServiceNowDisplayValue<T> {
  value: T;
  display_value: string;
}

function getValue<T>(field: T | ServiceNowDisplayValue<T>): T {
  return typeof field === 'object' && field !== null && 'value' in field
    ? field.value
    : field;
}

// Usage in services
const sysId = getValue(session.sys_id);
const status = getValue(session.status);
```

### REST API Query Patterns
**Avoid** using `ORDERBY` in encoded queries with REST API - it causes parse errors. Instead:
- Fetch data without ordering
- Sort client-side using Array.sort()
- Example in `PlanningSessionService.list()` line 39-55

### Fluent API Conventions
- All Fluent definitions in `.now.ts` files
- Table definitions use `Table()` with `schema`, `accessible_from`, `caller_access`
- ScriptIncludes use `ScriptInclude()` with inline `script` string
- BusinessRules use `BusinessRule()` with `when`, `action`, `script`
- All exports in `src/fluent/index.now.ts`

### Type Safety
- TypeScript strict mode enabled
- All ServiceNow responses use `getValue()` helper to unwrap display values
- Service layer returns typed interfaces (PlanningSession, SessionStory, etc.)
- `ServiceNowAPIError` for consistent error handling

### State Management
- React state managed in `app.tsx` (sessions, view mode, loading, errors)
- Service singletons created with `useMemo` to prevent recreation
- `refreshSessions()` called after mutations to keep UI in sync

## Common Development Patterns

### Adding a New Table
1. Define in `src/fluent/tables/*.now.ts` using Fluent `Table()` API
2. Add columns with typed column functions (StringColumn, IntegerColumn, etc.)
3. Export from `src/fluent/index.now.ts`
4. Run `npm run build` and `npm run deploy`

### Adding a Service Method
1. Add method to appropriate service class in `src/client/services/`
2. Use `nativeService` for API calls
3. Wrap in try-catch with `ServiceNowAPIError` for errors
4. Add console logging for debugging
5. Return typed responses

### Adding a React Component
1. Create `.tsx` file in `src/client/components/`
2. Define TypeScript interface for props
3. Use service hooks with error handling
4. Export from `src/client/components/index.ts`
5. Import CSS if needed or use `app.css` global styles

## Important Debugging Tips

### Session Creation Issues
- Check browser console for `PlanningSessionService.create` logs
- Verify `window.g_ck` is available (refresh page if null)
- Check Network tab for POST `/api/now/table/x_1860782_msm_pl_0_session`
- Verify table permissions in ServiceNow ACLs
- **If you see xmlhttp.do 404 errors** - GlideAjax code still present, must use REST API only

### Voting Issues
- Votes use version tracking - check `is_current` flag
- Story must be in `voting` status to accept votes
- Consensus calculated based on numeric vote variance (< 20%)

### Build Failures
- Run `npm run type-check` to isolate TypeScript errors
- Check `dist/` output for generated files
- Verify all `.now.ts` files are properly exported in `index.now.ts`

### ORDERBY Query Failures
- **Problem:** ServiceNow REST API has strict query encoding - `ORDERBY` in encoded queries causes parse errors
- **Solution:** Fetch data without ordering, then sort client-side with `Array.sort()`
- **Example:** See `PlanningSessionService.list()` at src/client/services/PlanningSessionService.ts:39-55

### ServiceNow Logs
- Check **System Logs > System Log > All** in ServiceNow for server-side errors
- Script Include logs use `gs.info()`, `gs.warn()`, `gs.error()`
- Look for `PlanningPokerSessionAjax` in log source

### Migration Context
- **IMPORTANT:** Read `AGENT_UPDATE.md` for complete migration history (November 2025)
- Explains why GlideRecord cannot be used client-side
- Documents the REST API migration pattern

## Configuration Files

- `now.config.json` - NowSDK configuration (scope, name, tsconfig path)
- `tsconfig.json` - Root TypeScript config (ES2022, React JSX, strict mode)
- `src/server/tsconfig.json` - Server-side Fluent code config
- `.eslintrc` - ESLint configuration with TypeScript and React rules
- `package.json` - Dependencies and build scripts

## Key Documentation Files

### Project Documentation
- **`AGENT_UPDATE.md`** - Complete migration history (November 2025) and architectural decisions
- **`AGENT_INSTRUCTIONS.md`** - Comprehensive development guide for Fluent architecture
- **`PHASE_2_3_COMPLETION_SUMMARY.md`** - T-shirt sizing implementation and deployment status
- **`.github/copilot-instructions.md`** - Critical patterns and DO/DON'T rules
- **`TESTING_GUIDE.md`** - Testing procedures and manual test flows
- **`DEPLOYMENT_GUIDE.md`** - Deployment instructions

### Multi-Agent System Documentation
- **`.github/agents/README.md`** - Agent system overview and architecture
- **`.github/agents/QUICK_REFERENCE.md`** - One-page quick reference card
- **`.github/agents/ARCHITECTURE_DIAGRAM.md`** - Visual architecture diagrams
- **`.github/agents/coordinator-agent.md`** - Orchestration and coordination
- **`.github/agents/fluent-backend-agent.md`** - Backend development patterns
- **`.github/agents/react-frontend-agent.md`** - Frontend development patterns
- **`.github/agents/api-integration-agent.md`** - API integration patterns
- **`.github/agents/build-deploy-agent.md`** - Build and deployment procedures
- **`.github/agents/testing-qa-agent.md`** - Testing and QA procedures

## Multi-Agent Development System

This project uses a **specialized multi-agent system** for coordinated development. Each agent is an expert in a specific domain:

### Available Agents

1. **Coordinator Agent** (`.github/agents/coordinator-agent.md`)
   - Lead orchestrator and architecture guardian
   - Use for: New features, architectural decisions, multi-agent coordination

2. **Fluent Backend Agent** (`.github/agents/fluent-backend-agent.md`)
   - ServiceNow backend specialist
   - Use for: Tables, business rules, Script Includes, GlideRecord operations

3. **React Frontend Agent** (`.github/agents/react-frontend-agent.md`)
   - UI/UX and React development specialist
   - Use for: Components, CSS, state management, responsive design

4. **API Integration Agent** (`.github/agents/api-integration-agent.md`)
   - Service layer and API integration specialist
   - Use for: Service methods, REST API, authentication, data transformation

5. **Build & Deployment Agent** (`.github/agents/build-deploy-agent.md`)
   - Build system and deployment specialist
   - Use for: Build failures, deployment issues, configuration, dependencies

6. **Testing & QA Agent** (`.github/agents/testing-qa-agent.md`)
   - Quality assurance and testing specialist
   - Use for: Test execution, bug reporting, performance, security

### Quick Reference
See `.github/agents/QUICK_REFERENCE.md` for a one-page reference card showing which agent to consult for each task.

### Agent Workflow Examples

**Adding a New Feature:**
1. **Coordinator Agent** → Review requirements and plan architecture
2. **Backend Agent** → Design database schema (if needed)
3. **API Agent** → Design service layer methods
4. **Frontend Agent** → Design UI components
5. **Build Agent** → Deploy changes
6. **QA Agent** → Test functionality

**Fixing a Bug:**
1. **QA Agent** → Report bug with details
2. **Coordinator Agent** → Analyze and assign to specialist
3. **Specialist Agent** → Implement fix
4. **Build Agent** → Deploy fix
5. **QA Agent** → Verify fix

**Quick Task Reference:**
- "How do I add a table field?" → **Backend Agent**
- "How do I create a React component?" → **Frontend Agent**
- "API call not working?" → **API Agent**
- "Build failing?" → **Build Agent**
- "Need to test this?" → **QA Agent**
- "Should we refactor?" → **Coordinator Agent**

## Domain Model

**Planning Poker Scales**:
- **T-Shirt Sizing (DEFAULT)**: XS, S, M, L, XL, XXL, ?, ☕
- **Fibonacci (Alternative)**: 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, ☕

**Core Entities**:
- **Sessions** contain **Stories** which receive **Votes** from **Participants**
- Session codes: 6-character alphanumeric strings for easy sharing
- Consensus: Achieved when all participants vote the same estimate (or numeric variance < 20%)
- Vote versioning: Uses `is_current` flag to track revotes

## Tech Stack
- **Framework**: ServiceNow NowSDK 4.0.2 (Fluent API)
- **Frontend**: React 19.x, TypeScript 5.5.4
- **Build**: @servicenow/isomorphic-rollup
- **Linting**: ESLint 8.50.0 with TypeScript and React plugins
- **ServiceNow**: REST API (client-side), GlideRecord (server-side only)

## Recent Updates (November 2025)

### T-Shirt Sizing Feature
- **Default scale changed** from Fibonacci to T-shirt sizing (XS, S, M, L, XL, XXL)
- Color-coded voting cards with tooltips
- Full accessibility support (WCAG 2.1 AA)
- Scale switching remains functional (toggle between T-shirt and Fibonacci)

### Multi-Agent System
- Comprehensive agent documentation created (9 files)
- Specialized agents for Backend, Frontend, API, Build, QA, and Coordination
- Quick reference guides and architecture diagrams
- Test planning with 40+ test cases documented

### Build & Deployment
- Build successful: 614 KB bundle with source maps
- Authentication validated (OAuth working)
- Deployment requires local machine with GUI (D-Bus limitation)
- Alternative deployment methods documented

## Quick Reference: Critical DO/DON'T Rules

### ❌ NEVER
- Use GlideRecord or GlideAjax in `src/client/` code (browser context)
- Import React in `src/fluent/` or `src/server/` code
- Use `ORDERBY` in REST API encoded queries
- Skip authentication headers (`X-UserToken`) on REST API calls
- Modify table names (all use `x_1860782_msm_pl_0_*` prefix)
- Use `any` types (use proper interfaces from `types/index.ts`)
- Deploy from Codespaces/headless environments (use local machine)
- Use GlideAjax (causes xmlhttp.do 404 errors in Fluent)

### ✅ ALWAYS
- Check `AGENT_UPDATE.md` for migration context before major changes
- Consult appropriate agent from `.github/agents/` for specialized tasks
- Run `npm run check-all` before committing
- Use `getValue()` utility for ServiceNow field extraction
- Verify `window.g_ck` availability before REST API calls
- Sort data client-side (not in queries)
- Test in actual ServiceNow instance (not localhost)
- Use `fetch()` with proper authentication for all client-side data operations
- Reference `.github/agents/QUICK_REFERENCE.md` for agent selection

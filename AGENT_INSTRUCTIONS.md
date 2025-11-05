# Agent Instructions for Planning Poker Fluent Application

## Project Context

**Application Name:** Planning Poker for ServiceNow  
**Framework:** ServiceNow Fluent SDK (NowSDK)  
**Scope:** `x_902080_ppoker`  
**Purpose:** Collaborative agile story estimation using planning poker techniques

## Critical Priorities

### 🎯 **PRIORITY ONE: MAINTAIN FLUENT ARCHITECTURE**
This is a **Fluent-based application**. All development must use:
- Fluent table definitions (`.now.ts` files)
- Fluent Script Includes (TypeScript in `.now.ts`)
- Fluent Business Rules (TypeScript in `.now.ts`)
- Fluent UI Pages (TypeScript in `.now.ts`)
- NowSDK build system (`now-sdk build`, `now-sdk deploy`)

**NEVER:**
- Use traditional ServiceNow development patterns from `pre-fluent.md`
- Create `.script.js` files directly in ServiceNow
- Use VS Code ServiceNow Sync extension
- Mix Fluent and traditional approaches

## Project Structure

```
planningpokerfluent/
├── src/
│   ├── fluent/                       # ServiceNow Fluent definitions
│   │   ├── index.now.ts             # Main exports
│   │   ├── tables/                   # Table definitions
│   │   │   └── planning-poker.now.ts
│   │   ├── script-includes/          # Server-side logic
│   │   │   └── planning-poker-session.now.ts
│   │   ├── business-rules/           # Business rules
│   │   │   └── session-defaults.now.ts
│   │   └── ui-pages/                 # UI page definitions
│   │       └── planning-poker-app.now.ts
│   ├── client/                       # React/TypeScript frontend
│   │   ├── main.tsx                 # Entry point
│   │   ├── app.tsx                  # Main app component
│   │   ├── components/              # React components
│   │   ├── services/                # API services
│   │   ├── theme/                   # Theming
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Utilities
│   └── server/                      # Server TypeScript config
│       └── tsconfig.json
├── now.config.json                  # Fluent configuration
├── package.json                     # Dependencies & scripts
└── tsconfig.json                    # Root TypeScript config
```

## Development Workflow

### 1. Building & Deploying
```bash
# Build the application (compiles Fluent code)
npm run build

# Deploy to ServiceNow instance
npm run deploy

# Transform code (if needed)
npm run transform

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### 2. Making Changes

**For Table Changes:**
1. Edit `src/fluent/tables/planning-poker.now.ts`
2. Use Fluent `Table()` API
3. Define all fields with proper types
4. Run `npm run build && npm run deploy`

**For Script Includes:**
1. Edit `src/fluent/script-includes/*.now.ts`
2. Use TypeScript with ServiceNow types
3. Export using `ScriptInclude()` API
4. Implement proper AJAX processors
5. Run `npm run build && npm run deploy`

**For Business Rules:**
1. Edit `src/fluent/business-rules/*.now.ts`
2. Use `BusinessRule()` API
3. Define when, action, and script
4. Run `npm run build && npm run deploy`

**For UI Changes:**
1. Edit React components in `src/client/`
2. Changes auto-compile during build
3. Run `npm run build && npm run deploy`

### 3. Testing Changes
1. Build and deploy
2. Navigate to ServiceNow instance
3. Access application via UI Page endpoint
4. Check browser console for errors
5. Monitor ServiceNow System Logs

## Core Architecture Patterns

### Fluent Table Definitions

```typescript
import '@servicenow/sdk/global'
import { Table } from '@servicenow/sdk/core'

Table({
  $id: Now.ID['table_name'],
  name: 'x_902080_ppoker_table_name',
  label: 'Table Label',
  extends: 'task', // or omit for standalone
  fields: [
    {
      name: 'field_name',
      type: 'string',
      label: 'Field Label',
      maxLength: 100,
      mandatory: false
    }
  ]
})
```

### Fluent Script Includes

```typescript
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
  $id: Now.ID['script_include_name'],
  name: 'ScriptIncludeName',
  description: 'Description',
  script: `
    var ScriptIncludeName = Class.create();
    ScriptIncludeName.prototype = Object.extendsObject(AbstractAjaxProcessor, {
      methodName: function() {
        // Implementation
        return JSON.stringify(result);
      },
      type: 'ScriptIncludeName'
    });
  `
})
```

### Fluent Business Rules

```typescript
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
  $id: Now.ID['rule_name'],
  name: 'Rule Name',
  table: 'x_902080_ppoker_table',
  when: 'before', // before, after, async, display
  action: ['insert', 'update'],
  script: `
    // Business rule logic
    current.setValue('field', value);
  `,
  order: 100,
  active: true
})
```

### Fluent UI Pages

```typescript
import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import htmlContent from '../../client/index.html'

UiPage({
  $id: Now.ID['ui_page_name'],
  endpoint: 'x_902080_ppoker_app.do',
  description: 'Description',
  category: 'general',
  html: htmlContent,
  direct: true,
  roles: [],
  public: false
})
```

## Database Schema

### Core Tables (Must be defined in Fluent)

1. **x_902080_ppoker_planning_session** (extends task)
   - name: string(100)
   - description: string(1000)
   - status: choice(pending, active, completed, cancelled)
   - session_code: string(6) - unique
   - dealer: reference(sys_user)
   - scoring_method: reference(x_902080_ppoker_scoring_method)
   - total_stories: integer
   - stories_voted: integer
   - stories_completed: integer
   - stories_skipped: integer
   - total_votes: integer
   - consensus_rate: integer
   - started_at: datetime
   - completed_at: datetime
   - timebox_minutes: integer (default: 30)

2. **x_902080_ppoker_session_stories**
   - session: reference(x_902080_ppoker_planning_session)
   - story: reference(rm_story)
   - story_title: string(200)
   - description: string(4000)
   - acceptance_criteria: string(4000)
   - sequence_order: integer
   - status: choice(pending, active, revealed, completed, skipped)
   - final_estimate: string(10)
   - consensus_achieved: boolean
   - vote_count: integer
   - times_revoted: integer

3. **x_902080_ppoker_planning_vote**
   - session: reference(x_902080_ppoker_planning_session)
   - story: reference(x_902080_ppoker_session_stories)
   - user: reference(sys_user)
   - vote_value: string(10)
   - voted_at: datetime

4. **x_902080_ppoker_session_participant**
   - session: reference(x_902080_ppoker_planning_session)
   - user: reference(sys_user)
   - role: choice(dealer, participant, spectator)
   - joined_at: datetime
   - left_at: datetime

5. **x_902080_ppoker_scoring_method**
   - name: string(100)
   - description: string(500)
   - active: boolean
   - is_default: boolean

6. **x_902080_ppoker_scoring_value**
   - scoring_method: reference(x_902080_ppoker_scoring_method)
   - value: string(10)
   - display_order: integer
   - numeric_value: decimal

## Frontend Architecture

### React + TypeScript
- Uses React 19.x with TypeScript
- Emotion for styling (optional, can use CSS)
- ServiceNow native APIs (GlideAjax, REST API)

### Service Layer Pattern

```typescript
// src/client/services/PlanningSessionService.ts
export class PlanningSessionService {
  private readonly tableName = 'x_902080_ppoker_planning_session'
  
  async list(): Promise<PlanningSession[]> {
    // Use nativeService or direct REST API
  }
  
  async get(sysId: string): Promise<PlanningSession> {
    // Fetch single record
  }
  
  async create(data: Partial<PlanningSession>): Promise<PlanningSession> {
    // Create new record
  }
}
```

### ServiceNow Integration

```typescript
// src/client/utils/serviceNowNativeService.ts
export class ServiceNowNativeService {
  // Use window.GlideAjax for AJAX calls
  // Use fetch() for REST API calls
  // Handle authentication with window.g_ck
  // Provide current user context
}
```

## Key Implementation Rules

### ✅ DO:
1. **Use Fluent APIs** for all ServiceNow artifacts
2. **Use TypeScript** for all code (client and server)
3. **Export all tables** from `src/fluent/tables/`
4. **Export all script includes** from `src/fluent/script-includes/`
5. **Build before deploying** with `npm run build`
6. **Use proper ID references** with `Now.ID['resource_name']`
7. **Follow ServiceNow naming conventions** for tables/fields
8. **Implement proper error handling** in all services
9. **Use GlideAjax** for AJAX processors
10. **Test after every deployment**

### ❌ DON'T:
1. **Don't use traditional ServiceNow files** (`.script.js`, etc.)
2. **Don't use VS Code Sync** - use `npm run deploy`
3. **Don't mix Fluent and traditional approaches**
4. **Don't hardcode sys_ids** - use references
5. **Don't skip the build step**
6. **Don't create UI Pages as XML/Jelly** - use Fluent UiPage()
7. **Don't use global variables** - use proper scoping
8. **Don't ignore TypeScript errors**
9. **Don't deploy without testing locally first**
10. **Don't modify `pre-fluent.md` patterns** - they're obsolete

## Common Tasks

### Adding a New Table Field
1. Edit `src/fluent/tables/planning-poker.now.ts`
2. Add field to appropriate table definition
3. Run `npm run build`
4. Run `npm run deploy`
5. Verify in ServiceNow instance

### Creating a New AJAX Method
1. Edit `src/fluent/script-includes/planning-poker-session.now.ts`
2. Add method to Script Include class
3. Return JSON string from method
4. Run `npm run build && npm run deploy`
5. Call from frontend using GlideAjax

### Adding a New React Component
1. Create component in `src/client/components/`
2. Import and use in parent component
3. Run `npm run build && npm run deploy`
4. Test in browser

### Adding a Business Rule
1. Create new file in `src/fluent/business-rules/`
2. Use `BusinessRule()` API
3. Export from `src/fluent/index.now.ts`
4. Run `npm run build && npm run deploy`

## Testing Strategy

### Local Testing
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Run all checks
npm run check-all
```

### ServiceNow Testing
1. Deploy to instance
2. Navigate to application URL
3. Check browser console for errors
4. Test each user flow
5. Check ServiceNow System Logs
6. Verify database changes

## Troubleshooting

### Build Errors
- Check TypeScript syntax
- Verify imports are correct
- Ensure `Now.ID` references exist
- Check `now.config.json` settings

### Deployment Errors
- Verify ServiceNow credentials
- Check instance availability
- Ensure scope matches `now.config.json`
- Review deployment logs

### Runtime Errors
- Check browser console
- Review ServiceNow System Logs
- Verify table/field names
- Check user permissions
- Validate AJAX responses

### Authentication Issues
- Ensure `window.g_ck` is available
- Verify user is logged in
- Check session timeout
- Validate CORS settings

## Git Workflow

### Branch Strategy
- `main` - production-ready code
- `develop` - active development
- Feature branches - `feature/feature-name`

### Commit Guidelines
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add session voting functionality"

# Push to remote
git push origin branch-name
```

### Commit Types
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `test:` - Test additions/changes
- `chore:` - Build/tooling changes

## Performance Considerations

### Summary Fields
Use auto-calculated summary fields to avoid expensive queries:
- `total_stories` on sessions
- `vote_count` on stories
- `stories_completed` on sessions

### Database Queries
- Use indexed fields for filtering
- Limit query results appropriately
- Avoid N+1 query patterns
- Use GlideRecord efficiently

### Frontend Performance
- Lazy load components
- Implement proper loading states
- Cache API responses when appropriate
- Minimize re-renders

## Security

### Access Control
- Define proper ACLs for all tables
- Implement role-based access
- Validate user permissions in AJAX
- Sanitize all user inputs

### Data Validation
- Validate on client and server
- Use TypeScript types for safety
- Implement proper error messages
- Log security violations

## Documentation

### Code Comments
- Document complex logic
- Explain non-obvious decisions
- Keep comments up-to-date
- Use JSDoc for functions

### README Updates
- Document new features
- Update deployment steps
- Maintain troubleshooting guide
- Keep architecture diagrams current

## Support Resources

### Key Files to Reference
- `BUILD_PROMPT.md` - Original build specification
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `TESTING_GUIDE.md` - Testing procedures
- `now.config.json` - Fluent configuration
- `package.json` - Scripts and dependencies

### ServiceNow Documentation
- Fluent SDK documentation
- ServiceNow API documentation
- GlideRecord reference
- REST API guide

### Community Resources
- ServiceNow Community forums
- ServiceNow Developer site
- GitHub issues/discussions
- Stack Overflow (servicenow tag)

## Version Control

### Pre-Commit Checklist
- [ ] Run `npm run type-check`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Test locally if possible
- [ ] Write descriptive commit message
- [ ] Update documentation if needed

### Pre-Deploy Checklist
- [ ] All commits pushed
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Backup current version (if major change)

## Emergency Procedures

### Rollback
1. Identify last working commit
2. `git revert <commit-hash>`
3. Run `npm run build && npm run deploy`
4. Verify rollback successful
5. Investigate issue

### Critical Bug Fix
1. Create hotfix branch
2. Fix issue
3. Test thoroughly
4. Deploy to production
5. Merge to main and develop
6. Post-mortem analysis

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and fix linting warnings
- Update documentation
- Review and optimize queries
- Check for security updates

### Monitoring
- Monitor error logs
- Track performance metrics
- Review user feedback
- Analyze usage patterns

---

## Quick Reference Commands

```bash
# Development
npm run build                 # Build application
npm run deploy               # Deploy to ServiceNow
npm run type-check           # TypeScript validation
npm run lint                 # Check code quality
npm run lint:fix            # Auto-fix linting issues
npm run check-all           # Run all checks

# Git
git status                   # Check status
git add .                    # Stage all changes
git commit -m "message"      # Commit changes
git push origin branch       # Push to remote
```

## Contact & Support

For questions or issues:
1. Check documentation first
2. Review ServiceNow logs
3. Search community forums
4. Create detailed issue report
5. Contact team lead if urgent

---

**Remember: This is a Fluent application. Always use NowSDK tools and patterns. Traditional ServiceNow development patterns from `pre-fluent.md` are for reference only and should NOT be used in this codebase.**

# Planning Poker Fluent - Agent System

## Overview

This project uses a specialized multi-agent system to coordinate development of the ServiceNow Planning Poker Fluent application. Each agent is an expert in a specific domain, ensuring high-quality, consistent code across all aspects of the application.

## Agent Architecture

```
┌─────────────────────────────────────────────────────┐
│         COORDINATOR AGENT (Orchestration)           │
│  • Architecture decisions                           │
│  • Agent coordination                               │
│  • Quality gates                                    │
│  • Documentation oversight                          │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────────┐
│   BACKEND    │ │  FRONTEND  │ │  API INTEGRATION│
│   AGENT      │ │   AGENT    │ │     AGENT       │
│              │ │            │ │                 │
│ • Tables     │ │ • React    │ │ • Services      │
│ • Bus Rules  │ │ • CSS      │ │ • REST API      │
│ • Scripts    │ │ • TSX      │ │ • Transform     │
└──────────────┘ └────────────┘ └─────────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐        │
│  BUILD/DEPLOY│ │  TESTING/QA│        │
│    AGENT     │ │    AGENT   │        │
│              │ │            │        │
│ • NowSDK    │ │ • Test Cases│        │
│ • Rollup    │ │ • Bug Track │        │
│ • Deploy    │ │ • Quality   │        │
└──────────────┘ └────────────┘        │
```

## Agent Roster

### 1. Coordinator Agent
**File:** `.github/agents/coordinator-agent.md`  
**Role:** Lead orchestrator and architecture guardian

**Responsibilities:**
- Coordinate all other agents
- Make architectural decisions
- Enforce quality gates
- Manage integration points
- Oversee documentation
- Handle emergency procedures

**Use When:**
- Starting new features
- Making architectural changes
- Coordinating multi-agent tasks
- Resolving conflicts
- Planning sprints

---

### 2. Fluent Backend Agent
**File:** `.github/agents/fluent-backend-agent.md`  
**Role:** ServiceNow backend specialist

**Responsibilities:**
- Table schema definitions (Fluent DSL)
- Business Rules in TypeScript
- Script Includes for AJAX
- GlideRecord operations
- Database optimization

**Use When:**
- Adding/modifying tables
- Creating business rules
- Implementing server logic
- Optimizing queries
- Setting up ACLs

**Key Files:**
- `src/fluent/tables/planning-poker.now.ts`
- `src/fluent/business-rules/*.now.ts`
- `src/fluent/script-includes/*.now.ts`

---

### 3. React Frontend Agent
**File:** `.github/agents/react-frontend-agent.md`  
**Role:** UI/UX and React development specialist

**Responsibilities:**
- React component development
- TypeScript interfaces for UI
- CSS styling and responsive design
- State management with hooks
- User experience optimization

**Use When:**
- Creating new components
- Improving UI/UX
- Adding animations
- Making responsive layouts
- Implementing forms

**Key Files:**
- `src/client/components/*.tsx`
- `src/client/components/*.css`
- `src/client/app.tsx`
- `src/client/types/index.ts`

---

### 4. API Integration Agent
**File:** `.github/agents/api-integration-agent.md`  
**Role:** Service layer and API integration specialist

**Responsibilities:**
- Service class development
- REST API integration
- ServiceNow authentication
- Data transformation utilities
- Error handling patterns

**Use When:**
- Adding service methods
- Fixing API calls
- Transforming ServiceNow data
- Handling authentication
- Implementing error handling

**Key Files:**
- `src/client/services/*.ts`
- `src/client/utils/serviceNowNativeService.ts`
- `src/client/utils/serviceUtils.ts`

---

### 5. Build & Deployment Agent
**File:** `.github/agents/build-deploy-agent.md`  
**Role:** Build system and deployment specialist

**Responsibilities:**
- NowSDK configuration
- Build pipeline management
- Rollup bundler setup
- TypeScript compilation
- Deployment processes

**Use When:**
- Build failures
- Deployment issues
- Configuration changes
- Adding dependencies
- Optimizing bundles

**Key Files:**
- `now.config.json`
- `now.prebuild.mjs`
- `package.json`
- `tsconfig.json`

---

### 6. Testing & QA Agent
**File:** `.github/agents/testing-qa-agent.md`  
**Role:** Quality assurance and testing specialist

**Responsibilities:**
- Test case design and execution
- Bug reporting and tracking
- Performance testing
- Browser compatibility
- Security testing

**Use When:**
- Running tests
- Reporting bugs
- Performance issues
- Browser problems
- Security concerns

**Key Files:**
- `TESTING_GUIDE.md`
- Test documentation
- Bug reports

---

## How to Use This System

### For New Features

1. **Start with Coordinator**
   - Review requirements
   - Break down into tasks
   - Assign to appropriate agents

2. **Agents Work in Parallel** (when possible)
   - Backend: Design schema
   - API: Design services
   - Frontend: Design UI
   - Build: Configure dependencies

3. **Integration Phase**
   - Coordinator reviews integration points
   - Agents collaborate on interfaces
   - Testing validates integration

4. **Quality Assurance**
   - Build agent deploys
   - QA agent tests
   - Coordinator approves

### For Bug Fixes

1. **QA Agent** reports bug with details
2. **Coordinator** analyzes and assigns to specialist
3. **Specialist** investigates and implements fix
4. **Build Agent** deploys fix
5. **QA Agent** verifies fix
6. **Coordinator** closes ticket

### For Refactoring

1. **Coordinator** defines scope
2. **All affected agents** review their areas
3. **Agents** implement changes in coordination
4. **Build Agent** ensures compilation
5. **QA Agent** runs regression tests
6. **Coordinator** reviews quality

## Quick Command Reference

### Development Commands
```bash
npm run build                 # Build agent
npm run deploy               # Build agent
npm run type-check           # All agents
npm run lint                 # All agents
npm run lint:fix            # All agents
npm run check-all           # Coordinator runs before approvals
```

### Git Workflow
```bash
git status                   # Check what changed
git add .                    # Stage changes
git commit -m "feat: add voting cards"  # Commit with semantic message
git push origin feature-name # Push to remote
```

## Agent Communication Protocol

### Status Updates
Each agent reports:
- ✅ Tasks completed
- 🚧 Work in progress
- ⛔ Blockers
- 🔗 Dependencies

### Code Review Process
```
1. Agent: "Implementation complete"
2. Coordinator: Reviews for quality
3. Coordinator: Approves or requests changes
4. Agent: Addresses feedback
5. Coordinator: Final approval
```

## Quality Gates

### Before Commit
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Code follows agent patterns
- [ ] Documentation updated

### Before Deployment
- [ ] Build succeeds
- [ ] All tests pass
- [ ] No critical bugs
- [ ] Coordinator approves

### After Deployment
- [ ] Application loads
- [ ] Smoke tests pass
- [ ] No errors in logs
- [ ] QA agent signs off

## File Organization

```
.github/agents/
├── README.md                    # This file
├── coordinator-agent.md         # Orchestration agent
├── fluent-backend-agent.md      # Backend specialist
├── react-frontend-agent.md      # Frontend specialist
├── api-integration-agent.md     # API specialist
├── build-deploy-agent.md        # Build specialist
└── testing-qa-agent.md          # QA specialist
```

## When to Consult Which Agent

| Question/Task | Agent to Consult |
|--------------|------------------|
| "How do I add a field to a table?" | Backend Agent |
| "How do I create a new React component?" | Frontend Agent |
| "How do I call the ServiceNow API?" | API Agent |
| "Build is failing!" | Build Agent |
| "How do I test this feature?" | QA Agent |
| "Should we refactor this?" | Coordinator Agent |
| "What's the architecture for X?" | Coordinator Agent |

## Best Practices

### DO ✅
- Start with the coordinator for new features
- Let agents work within their domains
- Coordinate when crossing boundaries
- Document decisions in agent files
- Follow each agent's patterns
- Run quality checks before committing
- Test after every deployment

### DON'T ❌
- Skip the coordinator for major changes
- Mix concerns between agents
- Ignore agent guidelines
- Deploy without testing
- Skip documentation
- Violate architectural patterns
- Work in isolation

## Emergency Contacts

**Critical Production Bug:**
1. Alert Coordinator Agent
2. Coordinator assigns specialist
3. Fast-track fix and deployment
4. QA verifies in production

**Build Pipeline Broken:**
1. Alert Build Agent immediately
2. Build Agent diagnoses issue
3. Coordinator decides rollback vs. fix
4. All agents verify after recovery

**Security Issue:**
1. Alert Coordinator immediately
2. Coordinator assesses severity
3. Backend & API agents secure system
4. QA agent verifies fix

## Success Metrics

### Code Quality
- TypeScript strict mode: ✅
- ESLint passing: ✅
- Test coverage: Target 80%+
- Build time: < 60 seconds
- Bundle size: < 1MB

### Development Velocity
- Feature completion rate
- Bug fix turnaround time
- Deployment frequency
- Code review speed

### Application Quality
- Uptime: 99.9%+
- Performance: < 3s page loads
- Bug count: Trending down
- User satisfaction: High

## Version History

- **v1.0** - Initial agent system creation
- Agents defined and documented
- Coordinator established
- Workflow patterns documented

## Contributing

When updating agent instructions:
1. Consult with Coordinator Agent
2. Update relevant agent file
3. Update this README if needed
4. Commit with clear message
5. Have coordinator review

## Support

For questions or issues with the agent system:
1. Check the relevant agent's documentation
2. Consult the Coordinator Agent
3. Review AGENT_INSTRUCTIONS.md
4. Check AGENT_UPDATE.md for recent changes

---

**Remember:** The agent system is designed to ensure consistency, quality, and efficiency. Each agent is an expert in their domain. Use them wisely, and they'll help build an excellent Planning Poker application!

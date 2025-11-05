# Planning Poker Agent System - Quick Reference Card

## 🎯 Which Agent Do I Need?

```
┌─────────────────────────────────────────────────────────────┐
│  TASK                          →  AGENT TO CONSULT          │
├─────────────────────────────────────────────────────────────┤
│  Add/modify table              →  Backend Agent             │
│  Create business rule          →  Backend Agent             │
│  Write Script Include          →  Backend Agent             │
│  Optimize database query       →  Backend Agent             │
│                                                             │
│  Create React component        →  Frontend Agent            │
│  Style/CSS work               →  Frontend Agent             │
│  UI/UX improvements           →  Frontend Agent             │
│  React hooks/state            →  Frontend Agent             │
│                                                             │
│  Add service method           →  API Agent                  │
│  Fix REST API call            →  API Agent                  │
│  Authentication issue         →  API Agent                  │
│  Transform ServiceNow data    →  API Agent                  │
│                                                             │
│  Build failure                →  Build Agent                │
│  Deployment problem           →  Build Agent                │
│  TypeScript config            →  Build Agent                │
│  Add npm package              →  Build Agent                │
│                                                             │
│  Run tests                    →  QA Agent                   │
│  Report bug                   →  QA Agent                   │
│  Performance issue            →  QA Agent                   │
│  Browser compatibility        →  QA Agent                   │
│                                                             │
│  Architecture decision        →  Coordinator Agent          │
│  Multi-agent coordination     →  Coordinator Agent          │
│  Major refactoring            →  Coordinator Agent          │
│  New feature planning         →  Coordinator Agent          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Common Workflows

### Add New Feature
```
1. Coordinator → Plan feature
2. Backend    → Design schema
3. API        → Design services
4. Frontend   → Design UI
5. Build      → Deploy
6. QA         → Test
```

### Fix Bug
```
1. QA         → Report bug
2. Coordinator → Assign specialist
3. Specialist → Fix issue
4. Build      → Deploy
5. QA         → Verify
```

### Deploy Changes
```
1. Build      → npm run check-all
2. Build      → npm run build
3. Build      → npm run deploy
4. QA         → Smoke test
```

## 📁 Key File Locations

```
Backend Agent:
  src/fluent/tables/planning-poker.now.ts
  src/fluent/business-rules/*.now.ts
  src/fluent/script-includes/*.now.ts

Frontend Agent:
  src/client/components/*.tsx
  src/client/components/*.css
  src/client/app.tsx

API Agent:
  src/client/services/*.ts
  src/client/utils/serviceNowNativeService.ts
  src/client/utils/serviceUtils.ts

Build Agent:
  now.config.json
  package.json
  tsconfig.json
  now.prebuild.mjs

QA Agent:
  TESTING_GUIDE.md
  (Test documentation)
```

## 💻 Essential Commands

```bash
# Development
npm run build          # Compile everything
npm run deploy         # Deploy to ServiceNow
npm run type-check     # Check TypeScript
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix issues
npm run check-all     # Full validation

# Git
git status            # Check changes
git add .             # Stage all
git commit -m "msg"   # Commit
git push              # Push to remote
```

## ⚠️ Critical Rules

### Backend Agent (Server-side)
✅ Use GlideRecord
✅ Import from @servicenow/sdk-core/db
✅ Script Includes for AJAX
❌ Never use fetch() or REST API

### Frontend Agent (Client-side)
✅ Use React hooks
✅ TypeScript for all components
✅ Responsive CSS
❌ Never use GlideRecord

### API Agent (Bridge)
✅ Use REST API with fetch()
✅ Include X-UserToken header
✅ Use getValue() helper
✅ credentials: 'same-origin'
❌ Never use GlideRecord in services

### Build Agent
✅ Build before deploy
✅ Check TypeScript errors
✅ Run lint before commit
❌ Never deploy without building

### QA Agent
✅ Test after every deploy
✅ Document bugs clearly
✅ Regression test
❌ Never skip smoke tests

## 🔧 Troubleshooting

### "Build failed"
→ Consult: **Build Agent**
→ Run: `npm run type-check`

### "API not working"
→ Consult: **API Agent**
→ Check: Authentication headers

### "Component not rendering"
→ Consult: **Frontend Agent**
→ Check: Browser console

### "Database query slow"
→ Consult: **Backend Agent**
→ Review: GlideRecord usage

### "Deployment failed"
→ Consult: **Build Agent**
→ Check: ServiceNow credentials

## 📋 Quality Checklist

Before Commit:
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Follows agent patterns
- [ ] Documentation updated

Before Deploy:
- [ ] Build succeeds
- [ ] Tests pass
- [ ] No critical bugs
- [ ] Coordinator approves

After Deploy:
- [ ] App loads
- [ ] Smoke tests pass
- [ ] No log errors
- [ ] QA signs off

## 🎨 Planning Poker Specifics

### Tables (Backend Agent)
- x_1860782_msm_pl_0_session
- x_1860782_msm_pl_0_session_stories
- x_1860782_msm_pl_0_vote
- x_1860782_msm_pl_0_session_participant

### Services (API Agent)
- PlanningSessionService
- VotingService
- StoryService
- AnalyticsService

### Components (Frontend Agent)
- SessionList
- SessionForm
- VotingSession
- SessionDashboard
- StoryManager
- AnalyticsDashboard
- VotingCard

### Planning Poker Scale (T-Shirt Sizing)
XS, S, M, L, XL, XXL, ?, ☕

## 🆘 Emergency Procedures

### Critical Bug
1. Alert **Coordinator**
2. Assign to **Specialist**
3. **Build** fast-track deploy
4. **QA** verify immediately

### Build Broken
1. Alert **Build Agent**
2. **Coordinator** decides: rollback or fix
3. All agents verify after fix

### Instance Down
1. **Coordinator** notifies all
2. Work continues locally
3. **Build** prepares deployment
4. **QA** full regression when back

## 📖 Documentation

**Agent Files:** `.github/agents/`
- coordinator-agent.md
- fluent-backend-agent.md
- react-frontend-agent.md
- api-integration-agent.md
- build-deploy-agent.md
- testing-qa-agent.md

**Project Docs:**
- AGENT_INSTRUCTIONS.md - Full instructions
- AGENT_UPDATE.md - Recent changes
- BUILD_PROMPT.md - Original build spec
- TESTING_GUIDE.md - Testing procedures
- DEPLOYMENT_GUIDE.md - Deployment steps

## 🎯 Remember

1. **Start with Coordinator** for major work
2. **Use the right agent** for each task
3. **Test before deploying**
4. **Document as you go**
5. **Follow the patterns**

---

**Print this and keep it handy!**
📄 Full docs: `.github/agents/README.md`

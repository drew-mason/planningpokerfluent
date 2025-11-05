# Planning Poker Agent System - Visual Architecture

## System Overview

```
                        ╔═══════════════════════════════════════╗
                        ║   PLANNING POKER FLUENT APPLICATION   ║
                        ║                                       ║
                        ║  ServiceNow + React + TypeScript     ║
                        ╚═══════════════════════════════════════╝
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                   ┌────▼────┐                     ┌────▼────┐
                   │ Backend │                     │ Frontend│
                   │ (Fluent)│                     │ (React) │
                   └────┬────┘                     └────┬────┘
                        │                               │
        ┌───────────────┼───────────────────────────────┼───────────────┐
        │               │                               │               │
        │               │                               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌───────────────┐ ┌──▼──────────┐ ┌──▼──────┐
│   TABLES     │ │  BUSINESS   │ │   SERVICES    │ │ COMPONENTS  │ │  UTILS  │
│              │ │    RULES    │ │               │ │             │ │         │
│ • Session    │ │             │ │ • SessionSvc  │ │ • SessionList│ │ • API   │
│ • Stories    │ │ • Defaults  │ │ • VotingSvc   │ │ • VotingCard │ │ • Types │
│ • Votes      │ │ • Calc      │ │ • StorySvc    │ │ • Dashboard  │ │ • Utils │
│ • Participants││ • Validate  │ │ • Analytics   │ │ • Analytics  │ │         │
└──────────────┘ └─────────────┘ └───────────────┘ └─────────────┘ └─────────┘
```

## Agent Responsibilities Map

```
╔══════════════════════════════════════════════════════════════════════╗
║                         COORDINATOR AGENT                            ║
║                                                                      ║
║  • Overall architecture        • Integration oversight              ║
║  • Agent coordination          • Quality gates                      ║
║  • Decision making             • Emergency response                 ║
╚══════════════════════════════════════════════════════════════════════╝
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
    ┌───────────▼──────────┐ ┌───▼──────────┐ ┌───▼─────────────────┐
    │  BACKEND AGENT       │ │ FRONTEND     │ │  API INTEGRATION    │
    │                      │ │ AGENT        │ │  AGENT              │
    │  ServiceNow Backend  │ │              │ │                     │
    ├──────────────────────┤ │ React/UI     │ │  Service Layer      │
    │ • Tables             │ ├──────────────┤ ├─────────────────────┤
    │ • Business Rules     │ │ • Components │ │ • REST API          │
    │ • Script Includes    │ │ • Styling    │ │ • Authentication    │
    │ • GlideRecord        │ │ • Hooks      │ │ • Data Transform    │
    │ • Server Logic       │ │ • Types      │ │ • Error Handling    │
    └──────────────────────┘ └──────────────┘ └─────────────────────┘
                │                 │                 │
                └─────────────────┼─────────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
    ┌───────────▼──────────┐ ┌───▼──────────┐     │
    │  BUILD/DEPLOY        │ │ TESTING/QA   │     │
    │  AGENT               │ │ AGENT        │     │
    │                      │ │              │     │
    │  Build Pipeline      │ │ Quality      │     │
    ├──────────────────────┤ ├──────────────┤     │
    │ • NowSDK             │ │ • Test Cases │     │
    │ • TypeScript         │ │ • Bug Track  │     │
    │ • Rollup             │ │ • Performance│     │
    │ • Deployment         │ │ • Security   │     │
    │ • Configuration      │ │ • Acceptance │     │
    └──────────────────────┘ └──────────────┘     │
```

## Development Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEW FEATURE REQUEST                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  COORDINATOR AGENT      │
                    │  • Parse requirements   │
                    │  • Break into tasks     │
                    │  • Assign to agents     │
                    └────┬────────────────┬───┘
                         │                │
        ┌────────────────┼────────────────┼────────────────┐
        │                │                │                │
        ▼                ▼                ▼                ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ BACKEND  │    │ FRONTEND │    │   API    │    │  BUILD   │
  │  AGENT   │    │  AGENT   │    │  AGENT   │    │  AGENT   │
  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
       │               │               │               │
       │ Design        │ Design        │ Design        │ Configure
       │ Schema        │ UI            │ Services      │ Dependencies
       │               │               │               │
       └───────┬───────┴───────┬───────┴───────┬───────┘
               │               │               │
               ▼               ▼               ▼
         ┌─────────────────────────────────────────┐
         │      IMPLEMENTATION PHASE                │
         │  All agents work in coordination        │
         └─────────────────┬───────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  BUILD AGENT    │
                  │  • Compile      │
                  │  • Bundle       │
                  │  • Deploy       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   QA AGENT      │
                  │  • Run tests    │
                  │  • Verify       │
                  │  • Report       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  COORDINATOR    │
                  │  • Review       │
                  │  • Approve      │
                  │  • Document     │
                  └─────────────────┘
```

## Client-Server Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                        BROWSER (CLIENT)                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  React Application                      │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │    │
│  │  │  Components  │  │   Services   │  │    Utils    │  │    │
│  │  │              │  │              │  │             │  │    │
│  │  │ • SessionList│  │ • SessionSvc │  │ • getValue()│  │    │
│  │  │ • VotingCard │  │ • VotingSvc  │  │ • Types     │  │    │
│  │  │ • Dashboard  │  │ • StorySvc   │  │ • Helpers   │  │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │    │
│  │         │                 │                 │         │    │
│  │         └─────────────────┼─────────────────┘         │    │
│  │                           │                           │    │
│  └───────────────────────────┼───────────────────────────┘    │
│                              │                                │
└──────────────────────────────┼────────────────────────────────┘
                               │
                               │ REST API
                               │ (fetch + X-UserToken)
                               │
┌──────────────────────────────┼────────────────────────────────┐
│                              │                                │
│              SERVICENOW INSTANCE (SERVER)                     │
│                              │                                │
│  ┌───────────────────────────▼───────────────────────────┐   │
│  │                    REST API Layer                     │   │
│  │         (/api/now/table/x_1860782_msm_pl_0_*)        │   │
│  └───────────────────────────┬───────────────────────────┘   │
│                              │                                │
│  ┌───────────────────────────▼───────────────────────────┐   │
│  │              Fluent Application Layer                 │   │
│  │                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │   Tables     │  │  Bus Rules   │  │  Scripts  │  │   │
│  │  │              │  │              │  │           │  │   │
│  │  │ • Session    │  │ • Defaults   │  │ • AJAX    │  │   │
│  │  │ • Stories    │  │ • Calculate  │  │ • Queries │  │   │
│  │  │ • Votes      │  │ • Validate   │  │ • Logic   │  │   │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘  │   │
│  │         │                 │                │        │   │
│  │         └─────────────────┼────────────────┘        │   │
│  │                           │                         │   │
│  └───────────────────────────┼─────────────────────────┘   │
│                              │                              │
│  ┌───────────────────────────▼─────────────────────────┐   │
│  │              ServiceNow Database                    │   │
│  │                                                     │   │
│  │  • x_1860782_msm_pl_0_session                      │   │
│  │  • x_1860782_msm_pl_0_session_stories              │   │
│  │  • x_1860782_msm_pl_0_vote                         │   │
│  │  • x_1860782_msm_pl_0_session_participant          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER ACTION (Vote on Story)
       │
       ▼
┌──────────────────┐
│ VotingCard.tsx   │  ← FRONTEND AGENT
│ onClick handler  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ VotingService.ts │  ← API AGENT
│ submitVote()     │
└────────┬─────────┘
         │
         │ fetch() with
         │ X-UserToken header
         ▼
┌──────────────────┐
│ REST API         │  ← ServiceNow
│ /api/now/table/  │
│ x_902080_plan... │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Business Rule    │  ← BACKEND AGENT
│ • Validate vote  │
│ • Update counts  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Database Table   │  ← ServiceNow DB
│ x_902080_plan... │
│ _vote            │
└────────┬─────────┘
         │
         │ Response
         ▼
┌──────────────────┐
│ VotingService.ts │  ← API AGENT
│ Transform data   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ VotingCard.tsx   │  ← FRONTEND AGENT
│ Update UI        │
└──────────────────┘
```

## Build & Deployment Flow

```
  LOCAL DEVELOPMENT
         │
         ▼
┌─────────────────┐
│  npm run build  │  ← BUILD AGENT
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  TypeScript  │      │   Rollup     │
│  Compiler    │      │   Bundler    │
│              │      │              │
│ • Fluent     │      │ • React      │
│ • Backend    │      │ • Client     │
└──────┬───────┘      └──────┬───────┘
       │                     │
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Build Output   │
         │                 │
         │ • Tables        │
         │ • Bus Rules     │
         │ • Scripts       │
         │ • UI Bundle     │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ npm run deploy  │  ← BUILD AGENT
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   now-sdk       │
         │   install       │
         └────────┬────────┘
                  │
                  ▼
    ┌─────────────────────────┐
    │  ServiceNow Instance    │
    │                         │
    │ • Tables created        │
    │ • Rules deployed        │
    │ • Scripts uploaded      │
    │ • UI content published  │
    └─────────┬───────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │    QA Testing           │  ← QA AGENT
    │                         │
    │ • Smoke tests           │
    │ • Feature tests         │
    │ • Regression tests      │
    └─────────────────────────┘
```

## Agent Communication Matrix

```
┌──────────────┬────────┬─────────┬─────┬───────┬────┬─────────────┐
│ Communicates │Backend │Frontend │ API │ Build │ QA │ Coordinator │
├──────────────┼────────┼─────────┼─────┼───────┼────┼─────────────┤
│ Backend      │   -    │    ✓    │  ✓  │   ✓   │ ✓  │      ✓      │
│ Frontend     │   ✓    │    -    │  ✓  │   ✓   │ ✓  │      ✓      │
│ API          │   ✓    │    ✓    │  -  │   ✓   │ ✓  │      ✓      │
│ Build        │   ✓    │    ✓    │  ✓  │   -   │ ✓  │      ✓      │
│ QA           │   ✓    │    ✓    │  ✓  │   ✓   │ -  │      ✓      │
│ Coordinator  │   ✓    │    ✓    │  ✓  │   ✓   │ ✓  │      -      │
└──────────────┴────────┴─────────┴─────┴───────┴────┴─────────────┘

Legend:
✓ = Direct communication required
- = Self (no communication needed)
```

## Priority & Escalation Path

```
        Level 1: Individual Agents
        (Handle routine tasks)
                │
                ├─ Issue within domain? → Solve
                │
                ├─ Need another agent? → Coordinate
                │
                └─ Complex/Blocking? → Escalate
                                │
                                ▼
        Level 2: Coordinator Agent
        (Handle cross-cutting concerns)
                │
                ├─ Architecture decision → Decide
                │
                ├─ Agent conflict → Mediate
                │
                └─ Critical issue? → Emergency Protocol
                                │
                                ▼
        Level 3: Emergency Response
        (Critical bugs, production issues)
                │
                ├─ Assess severity
                │
                ├─ Fast-track fix
                │
                ├─ Deploy immediately
                │
                └─ Post-mortem review
```

---

**Legend:**
- `│ ├ └ ┌ ┐ ┘ ┴ ┬ ┼` = Connectors
- `▼ ►` = Flow direction
- `╔ ╗ ╚ ╝ ║ ═` = Boxes/containers
- `✓` = Affirmative
- `•` = List item

**Color Coding (if printed in color):**
- Blue = Backend/Server
- Green = Frontend/Client
- Yellow = Integration/API
- Red = Build/Deploy
- Purple = Testing/QA
- Orange = Coordination

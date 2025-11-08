# Planning Poker System Guide

**MSM Planning Poker for ServiceNow**

Version: 2.0
Last Updated: November 2025
Scope: `x_1860782_msm_pl_0`
Instance: dev313212.service-now.com

---

## Table of Contents

1. [What is Planning Poker?](#what-is-planning-poker)
2. [How the System Works](#how-the-system-works)
3. [User Roles](#user-roles)
4. [Session Workflow](#session-workflow)
5. [Technical Architecture](#technical-architecture)
6. [Key Features](#key-features)
7. [User Guide](#user-guide)
8. [Estimation Scales](#estimation-scales)
9. [Data Model](#data-model)
10. [API Integration](#api-integration)

---

## What is Planning Poker?

Planning Poker (also called Scrum Poker) is a consensus-based, gamified technique for estimating the effort or relative size of development goals in software development. The system allows distributed teams to collaboratively estimate work items in real-time.

### Core Principles

1. **Collaborative Estimation**: All team members participate in estimating
2. **Anonymous Voting**: Prevents anchoring bias and groupthink
3. **Discussion-Based**: Encourages conversation about complexity
4. **Consensus Building**: Team reaches agreement on estimates
5. **Gamification**: Card-based voting makes estimation engaging

### Benefits

- ✅ Reduces estimation bias
- ✅ Encourages team discussion
- ✅ Surfaces hidden complexity early
- ✅ Builds shared understanding
- ✅ Improves estimation accuracy over time

---

## How the System Works

### High-Level Flow

```
1. Dealer creates a Planning Poker session
2. Participants join using session code or link
3. Dealer activates stories for estimation
4. Participants vote anonymously using cards
5. Dealer reveals votes when everyone has voted
6. Team discusses discrepancies
7. Team re-votes if needed to reach consensus
8. Dealer finalizes the estimate
9. Repeat for next story
```

### Real-Time Collaboration

The system provides real-time updates so all participants see:
- Who has joined the session
- Who has voted (without revealing the vote)
- When all votes are in
- Vote distribution when revealed
- Consensus status

---

## User Roles

### 1. **Dealer** (Facilitator/Scrum Master)

**Responsibilities:**
- Create and configure sessions
- Add stories to be estimated
- Activate stories for voting
- Reveal votes when ready
- Facilitate discussion
- Finalize estimates
- Start new rounds if needed

**Special Permissions:**
- Session creation/editing
- Story management (add/edit/delete/reorder)
- Vote reveal control
- Session timer control
- Final estimate setting

### 2. **Participant** (Team Member)

**Responsibilities:**
- Join sessions via code or link
- Review story details
- Submit estimates (votes)
- Participate in discussions
- Change votes before reveal

**Permissions:**
- View active session
- Submit/change own votes
- View revealed votes
- View session statistics

### 3. **Admin** (System Administrator)

**Responsibilities:**
- Manage users
- Review session history
- Access analytics
- Configure system settings

**Special Permissions:**
- User management
- All dealer permissions
- System configuration
- Historical data access

---

## Session Workflow

### Phase 1: Session Setup

**Dealer Actions:**
1. Click "Create New Session"
2. Enter session details:
   - Session name (required)
   - Description (optional)
   - Time box duration (optional, in minutes)
   - Estimation scale (T-shirt sizing, Fibonacci, Poker)
3. System generates unique 6-character session code
4. Share session code with team

**System Actions:**
- Creates session record
- Generates unique session code
- Sets dealer as first participant
- Initializes session status: `draft`

### Phase 2: Participant Joining

**Participant Actions:**
1. Click "Join Session" or navigate to shared link
2. Enter 6-character session code
3. System adds them to session

**System Actions:**
- Validates session code
- Adds participant to session
- Updates participant list (real-time)
- Sets participant status: `active`

### Phase 3: Story Estimation

**Dealer Actions:**
1. Navigate to "Stories" tab
2. Add stories to be estimated:
   - Story title (required)
   - Description (optional)
   - Business value, acceptance criteria (optional)
3. Activate a story for voting
4. Optional: Start timer for discussion

**System Actions:**
- Creates story records
- Sets story status: `pending` → `voting` (when activated)
- Notifies all participants
- Starts timer if configured

### Phase 4: Voting

**Participant Actions:**
1. Review activated story details
2. Select estimation card (XS, S, M, L, XL, XXL, ?, ☕)
3. Submit vote
4. Can change vote before reveal

**Dealer Actions:**
- Monitors vote progress (sees who voted, not values)
- Waits for all participants to vote (or timer expires)
- Clicks "Reveal Votes" when ready

**System Actions:**
- Records votes with timestamps
- Tracks vote completion status
- Prevents vote changes after reveal
- Calculates vote distribution

### Phase 5: Vote Reveal

**System Actions:**
1. Displays all votes to everyone
2. Shows vote distribution chart
3. Calculates consensus:
   - **Consensus Achieved**: All votes identical OR variance < 20%
   - **No Consensus**: Significant discrepancy in votes
4. Displays statistics:
   - Vote range (min/max)
   - Average estimate
   - Variance percentage

**Dealer Actions:**
- Reviews votes and consensus status
- Facilitates discussion (especially for outliers)
- Options:
  - **Finalize**: Accept current votes and set final estimate
  - **Clear Votes**: Start new round for re-voting

### Phase 6: Re-Voting (If Needed)

**When to Re-Vote:**
- No consensus achieved
- Significant outliers need discussion
- New information emerged during discussion

**Process:**
1. Dealer clicks "Clear Votes"
2. Discussion continues
3. Return to Phase 4 (Voting)
4. Repeat until consensus reached

### Phase 7: Finalization

**Dealer Actions:**
1. Clicks "Finalize Estimate"
2. Confirms final estimate value
3. Story marked complete

**System Actions:**
- Sets story status: `voting` → `completed`
- Records final estimate
- Saves voting round count
- Moves to next story in queue

### Phase 8: Session Completion

**Dealer Actions:**
1. Estimates all stories
2. Reviews session analytics
3. Exports results (optional)
4. Ends session

**System Actions:**
- Session status: `active` → `completed`
- Calculates session metrics:
  - Total stories estimated
  - Average velocity
  - Consensus rate
  - Time per story
- Archives session data

---

## Technical Architecture

### Frontend (React 19 + TypeScript)

**Component Structure:**

```
App.tsx (Main Container)
├── SessionList (Browse/create sessions)
├── SessionDashboard (Active session view)
│   ├── VotingSession (Participant view)
│   │   ├── StoryPanel (Story details)
│   │   ├── EstimationScale (Card deck)
│   │   │   └── VotingCard (Individual cards)
│   │   └── ParticipantsPanel (Live participant list)
│   └── DealerSessionDashboard (Dealer controls)
│       ├── StoryManager (Add/edit stories)
│       ├── SessionSettings (Configuration)
│       └── AnalyticsDashboard (Real-time stats)
└── AnalyticsDashboard (Historical analytics)
```

**State Management:**

- **Local State**: React hooks (useState, useEffect)
- **Global State**: React Context API
  - ThemeProvider (9 theme variants)
  - SoundProvider (audio feedback)
  - RetroModeProvider (CRT easter egg)
  - DeloreanProvider (time circuits easter egg)
- **Server State**: React Query (ready for integration)
- **Real-time**: Polling every 5 seconds (auto-refresh)

**Styling:**

- Tailwind CSS 3.4.18 (utility-first)
- Framer Motion 12.x (animations)
- Glass morphism design system
- Dual-theme system (light/dark modes)
- 9 color variants

### Backend (ServiceNow Fluent API)

**Database Tables:**

1. **x_1860782_msm_pl_0_session** (Planning Sessions)
   - Session metadata (name, description, status)
   - Session code (6-char unique identifier)
   - Dealer reference
   - Time box configuration
   - Created/updated timestamps

2. **x_1860782_msm_pl_0_session_stories** (Stories to Estimate)
   - Story title and description
   - Session reference
   - Display order (sequence)
   - Status (pending, voting, completed)
   - Final estimate
   - Business value, acceptance criteria (optional)

3. **x_1860782_msm_pl_0_vote** (Individual Votes)
   - Session and story references
   - Participant reference
   - Vote value (XS, S, M, L, XL, XXL, ?, ☕)
   - Timestamp
   - Vote version (supports re-voting)
   - is_current flag (latest vote only)

4. **x_1860782_msm_pl_0_session_participant** (Session Membership)
   - Session reference
   - User reference
   - Role (dealer, participant)
   - Joined timestamp
   - Active status

**Business Rules:**

- **session-defaults**: Sets default values on session creation
  - Default timebox: 30 minutes
  - Auto-generates session code
  - Sets dealer to current user
  - Initial status: `draft`

**REST API Endpoints:**

All operations use ServiceNow REST API:
- `GET /api/now/table/x_1860782_msm_pl_0_session` - List sessions
- `POST /api/now/table/x_1860782_msm_pl_0_session` - Create session
- `GET /api/now/table/x_1860782_msm_pl_0_session/{sys_id}` - Get session
- `PUT /api/now/table/x_1860782_msm_pl_0_session/{sys_id}` - Update session
- Similar endpoints for stories, votes, participants

**Authentication:**
- Uses ServiceNow session authentication
- `window.g_ck` token in `X-UserToken` header
- `credentials: 'same-origin'` for CORS

---

## Key Features

### 1. Multiple Estimation Scales

**T-Shirt Sizing (Default):**
- XS (Extra Small)
- S (Small)
- M (Medium)
- L (Large)
- XL (Extra Large)
- XXL (Extra Extra Large)
- ? (Unknown/Need discussion)
- ☕ (Break needed)

**Fibonacci Sequence:**
- 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, ☕

**Modified Poker:**
- 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, ☕

### 2. Real-Time Collaboration

**Auto-Refresh:**
- Polls server every 5 seconds
- Updates participant list
- Shows vote status (voted/waiting)
- Syncs story changes

**Visual Indicators:**
- ✅ Green checkmark: User has voted
- ⏳ Hourglass: Waiting for vote
- 👑 Crown icon: Dealer
- 🎯 Target icon: Active story

### 3. Consensus Detection

**Algorithm:**
```javascript
// Consensus achieved if:
// 1. All votes are identical, OR
// 2. Numeric variance is less than 20%

function calculateConsensus(votes) {
  const uniqueVotes = [...new Set(votes)]

  // All identical
  if (uniqueVotes.length === 1) {
    return { achieved: true, variance: 0 }
  }

  // Calculate variance for numeric votes
  const numericVotes = votes.filter(v => !isNaN(v))
  if (numericVotes.length > 0) {
    const avg = numericVotes.reduce((a, b) => a + b) / numericVotes.length
    const variance = Math.max(...numericVotes) - Math.min(...numericVotes)
    const variancePercent = (variance / avg) * 100

    return {
      achieved: variancePercent < 20,
      variance: variancePercent
    }
  }

  return { achieved: false, variance: null }
}
```

### 4. Session Analytics

**Real-Time Metrics:**
- Stories estimated
- Average velocity
- Consensus rate
- Time per story
- Participant engagement

**Historical Analytics:**
- Session history
- Velocity trends over time
- Consensus patterns
- Team performance metrics

**Charts:**
- Velocity chart (story points per session)
- Consensus chart (consensus rate over time)
- Vote distribution histograms

### 5. Accessibility Features

**WCAG 2.1 AA Compliant:**
- Keyboard navigation (Tab, Enter, Arrow keys)
- Screen reader support (ARIA labels)
- Focus indicators
- Color contrast ratios
- Reduced motion support

**Keyboard Shortcuts:**
- `1-8`: Quick vote with number keys
- `Enter`: Submit vote
- `Esc`: Close modals
- `Tab`: Navigate between elements

### 6. Theme System

**9 Theme Variants:**

**Light Mode:**
- Blue Lion (default) - Professional blue
- Red Lion - Bold red
- Green Lion - Fresh green
- Yellow Lion - Warm amber
- Black Lion - Sophisticated gray
- Voltron - Multi-color gradient

**Dark Mode:**
- Tron (default) - Cyan sci-fi
- Sark - Orange legacy
- User - White/light accent

**Theme Features:**
- Real-time switching
- LocalStorage persistence
- Dynamic favicon (matches theme color)
- CSS custom properties

### 7. Sound System

**Web Audio API Integration:**

**Sound Effects:**
- `cardSelect`: Card click, button press
- `reveal`: Vote reveal
- `roundStart`: New round, clear votes
- `timerComplete`: Story finalization
- `themeChange`: Variant switch
- `modeSwitch`: Light/dark toggle

**Dual Presets:**
- Voltron (light): Square/triangle waves, heroic tones
- Tron (dark): Sawtooth waves, gritty synth

**Controls:**
- Volume toggle in header
- LocalStorage persistence

### 8. Easter Eggs

**Retro CRT Mode:**
- Activation: Type `RETRO`
- Effect: Green phosphor scanlines, monospace font, CRT glow
- Toggle: Click indicator badge

**DeLorean Time Circuits:**
- Activation: Type `JOSHUA`
- Effect: Back to the Future time display (3 LED circuits)
- Features: Live updating present time
- Close: Click X or toggle off

**Konami Code:**
- Activation: Press `↑↑↓↓←→←→BA`
- Effect: Toast celebration with sound

---

## User Guide

### For Dealers (Facilitators)

**Creating a Session:**

1. Navigate to Planning Poker app
2. Click "Create New Session"
3. Fill in session details:
   - **Name**: Descriptive session name (e.g., "Sprint 23 Estimation")
   - **Description**: Optional context
   - **Time Box**: Minutes per story (optional timer)
   - **Scale**: Choose estimation scale
4. Click "Create Session"
5. Share session code with team (displayed after creation)

**Adding Stories:**

1. In session dashboard, click "Stories" tab
2. Click "+ Add Story"
3. Enter story details:
   - **Title**: User story or task name
   - **Description**: What needs to be done
   - **Business Value**: Why it matters (optional)
   - **Acceptance Criteria**: Definition of done (optional)
4. Click "Save"
5. Repeat for all stories
6. Drag to reorder stories

**Running Estimation:**

1. Click on a story to activate it
2. Story appears to all participants
3. Wait for participants to vote (progress shown)
4. When ready, click "Reveal Votes"
5. Review vote distribution and consensus
6. Facilitate discussion if needed
7. Options:
   - **Finalize**: Accept estimate, move to next story
   - **Clear Votes**: Re-vote after discussion

**Ending Session:**

1. Estimate all stories
2. Click "End Session" or navigate away
3. Session auto-saves progress
4. View analytics in "Analytics" tab

### For Participants

**Joining a Session:**

1. Navigate to Planning Poker app
2. Click "Join Session"
3. Enter 6-character session code
4. Click "Join"

**Voting on Stories:**

1. Wait for dealer to activate a story
2. Review story details (title, description, criteria)
3. Click your estimate card (XS, S, M, L, XL, XXL, ?, ☕)
4. Card highlights to show selection
5. Can change vote before reveal
6. Wait for dealer to reveal votes

**After Reveal:**

1. View all participant votes
2. See consensus status
3. Participate in discussion
4. If dealer clears votes, vote again
5. Wait for dealer to finalize and move to next story

### For Admins

**User Management:**

1. Navigate to Admin panel
2. Manage user roles (participant, dealer, admin)
3. Activate/deactivate users
4. Generate magic links for passwordless login

**Session Review:**

1. Access session history
2. View all sessions (active and completed)
3. Review session details and votes
4. Export session data (optional)

**Analytics:**

1. View system-wide analytics
2. Filter by date range
3. Export reports
4. Track team velocity trends

---

## Estimation Scales

### T-Shirt Sizing (Recommended for Non-Technical Teams)

| Card | Meaning | Use Case |
|------|---------|----------|
| **XS** | Trivial task | < 1 hour, well understood |
| **S** | Small task | 1-4 hours, straightforward |
| **M** | Medium task | 1 day, some complexity |
| **L** | Large task | 2-3 days, significant work |
| **XL** | Extra large | 1 week, complex or uncertain |
| **XXL** | Too large | > 1 week, should be split |
| **?** | Unknown | Need more information |
| **☕** | Break | Need a break to recharge |

**Advantages:**
- Intuitive for all team members
- Avoids false precision
- Encourages relative sizing
- Good for mixed technical/business teams

### Fibonacci Sequence (Recommended for Agile Teams)

| Card | Story Points | Typical Effort |
|------|--------------|----------------|
| **0** | 0 points | Already done or trivial |
| **0.5** | 0.5 points | 15-30 minutes |
| **1** | 1 point | 1-2 hours |
| **2** | 2 points | Half day |
| **3** | 3 points | 1 day |
| **5** | 5 points | 2-3 days |
| **8** | 8 points | 1 week |
| **13** | 13 points | 2 weeks (split recommended) |
| **20** | 20 points | Too large, split into smaller stories |
| **40** | 40 points | Epic, must be split |
| **100** | 100 points | Epic, must be decomposed |
| **?** | Unknown | Need more information |
| **☕** | Break | Need a break |

**Advantages:**
- Industry standard for Agile
- Increasing gaps reflect uncertainty
- Works well with velocity tracking
- Natural progression

---

## Data Model

### Entity Relationship Diagram

```
┌─────────────────────┐
│   Session           │
│  ─────────────────  │
│  • sys_id (PK)      │
│  • session_code     │◄───────┐
│  • name             │        │
│  • description      │        │
│  • dealer (FK)      │        │
│  • status           │        │
│  • timebox          │        │
│  • scale            │        │
└─────────────────────┘        │
          │                    │
          │                    │
          │                    │
          ▼                    │
┌─────────────────────┐        │
│   Story             │        │
│  ─────────────────  │        │
│  • sys_id (PK)      │        │
│  • session (FK)     │────────┘
│  • title            │
│  • description      │
│  • sequence         │
│  • status           │
│  • final_estimate   │
└─────────────────────┘
          │
          │
          ▼
┌─────────────────────┐        ┌─────────────────────┐
│   Vote              │        │   Participant       │
│  ─────────────────  │        │  ─────────────────  │
│  • sys_id (PK)      │        │  • sys_id (PK)      │
│  • session (FK)     │        │  • session (FK)     │
│  • story (FK)       │        │  • user (FK)        │
│  • participant (FK) │◄───────│  • role             │
│  • vote_value       │        │  • joined_at        │
│  • version          │        │  • active           │
│  • is_current       │        └─────────────────────┘
│  • created          │
└─────────────────────┘
```

### Table Schemas

**Session Table:**
```javascript
{
  sys_id: String (32-char UUID),
  session_code: String (6-char alphanumeric),
  name: String (required),
  description: String (optional),
  dealer: Reference(User),
  status: Choice(draft, active, completed),
  timebox: Integer (minutes),
  scale: Choice(tshirt, fibonacci, poker),
  created_by: Reference(User),
  created_at: DateTime,
  updated_at: DateTime
}
```

**Story Table:**
```javascript
{
  sys_id: String (32-char UUID),
  session: Reference(Session),
  title: String (required),
  description: String (optional),
  sequence: Integer (display order),
  status: Choice(pending, voting, completed),
  final_estimate: String,
  business_value: String (optional),
  acceptance_criteria: String (optional),
  testing_steps: String (optional),
  created_at: DateTime,
  updated_at: DateTime
}
```

**Vote Table:**
```javascript
{
  sys_id: String (32-char UUID),
  session: Reference(Session),
  story: Reference(Story),
  participant: Reference(User),
  vote_value: String (XS, S, M, L, XL, XXL, ?, ☕),
  version: Integer (1, 2, 3... for revotes),
  is_current: Boolean (latest vote only),
  created_at: DateTime
}
```

**Participant Table:**
```javascript
{
  sys_id: String (32-char UUID),
  session: Reference(Session),
  user: Reference(User),
  role: Choice(dealer, participant),
  joined_at: DateTime,
  active: Boolean
}
```

---

## API Integration

### REST API Patterns

**Authentication:**
```javascript
const headers = {
  'Content-Type': 'application/json',
  'X-UserToken': window.g_ck, // ServiceNow session token
}

const options = {
  credentials: 'same-origin', // CORS handling
  headers: headers
}
```

**List Sessions:**
```javascript
GET /api/now/table/x_1860782_msm_pl_0_session?sysparm_query=active=true&sysparm_display_value=all

Response:
{
  "result": [
    {
      "sys_id": "abc123...",
      "session_code": { "value": "ABC123", "display_value": "ABC123" },
      "name": { "value": "Sprint 23", "display_value": "Sprint 23" },
      "dealer": { "value": "user_sys_id", "display_value": "John Doe" },
      "status": { "value": "active", "display_value": "Active" }
    }
  ]
}
```

**Create Session:**
```javascript
POST /api/now/table/x_1860782_msm_pl_0_session

Body:
{
  "name": "Sprint 23 Estimation",
  "description": "Estimating stories for next sprint",
  "timebox": 30,
  "scale": "tshirt"
}

Response:
{
  "result": {
    "sys_id": "abc123...",
    "session_code": "XYZ789",
    ...
  }
}
```

**Submit Vote:**
```javascript
POST /api/now/table/x_1860782_msm_pl_0_vote

Body:
{
  "session": "session_sys_id",
  "story": "story_sys_id",
  "participant": "user_sys_id",
  "vote_value": "M",
  "version": 1,
  "is_current": true
}
```

### Service Layer

**Services:** (`src/client/services/`)
- `PlanningSessionService.ts` - Session CRUD operations
- `VotingService.ts` - Vote submission and consensus
- `StoryService.ts` - Story management
- `AnalyticsService.ts` - Session statistics

**Example Service Method:**
```javascript
async create(sessionData) {
  try {
    const response = await fetch(
      `/api/now/table/x_1860782_msm_pl_0_session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-UserToken': window.g_ck
        },
        credentials: 'same-origin',
        body: JSON.stringify(sessionData)
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return this.transformResponse(data.result)
  } catch (error) {
    console.error('Failed to create session:', error)
    throw error
  }
}
```

---

## Best Practices

### For Dealers

1. **Session Preparation:**
   - Pre-load stories before session starts
   - Add clear descriptions and acceptance criteria
   - Order stories by priority
   - Set realistic time boxes

2. **Facilitation:**
   - Start with smaller/simpler stories to calibrate
   - Encourage discussion for outlier votes
   - Time-box discussions (don't go too long)
   - Take breaks every 60-90 minutes

3. **Consensus Building:**
   - Ask high and low voters to explain reasoning
   - Look for hidden complexity or simplicity
   - Re-vote after discussion if needed
   - It's okay to not reach perfect consensus

### For Participants

1. **Voting:**
   - Vote based on complexity, not just time
   - Consider unknowns and risks
   - Vote independently (don't anchor to others)
   - Use "?" card when you need more information

2. **Discussion:**
   - Share your reasoning, especially if outlier
   - Ask questions about unclear requirements
   - Voice concerns about technical complexity
   - Suggest splitting large stories

### For Teams

1. **Estimation:**
   - Use relative sizing, not absolute time
   - Establish baseline stories for reference
   - Re-calibrate estimates periodically
   - Track velocity to improve over time

2. **Session Management:**
   - Keep sessions under 2 hours
   - Limit stories per session (5-10 is typical)
   - Review analytics to identify patterns
   - Adjust process based on team feedback

---

## Troubleshooting

### Common Issues

**Problem: Session code not working**
- Verify code is exactly 6 characters
- Check for typos (O vs 0, l vs 1)
- Ensure session is still active
- Contact dealer for new code

**Problem: Votes not appearing**
- Refresh the page
- Check network connection
- Verify you clicked a card
- Ensure story is in "voting" status

**Problem: Can't change vote**
- Votes are locked after dealer reveals
- Ask dealer to clear votes if re-vote needed
- Refresh if vote appears stuck

**Problem: Theme not applying**
- Clear browser cache
- Check localStorage is enabled
- Verify JavaScript is enabled
- Try different browser

**Problem: Sounds not playing**
- Check volume toggle in header (should show speaker icon)
- Verify browser allows audio autoplay
- Check system volume
- Try interacting with page first (browser autoplay policy)

### Getting Help

1. **Check documentation:** Review this guide and linked docs
2. **Contact dealer:** Session-specific issues
3. **Contact admin:** User/permission issues
4. **File ticket:** System bugs or feature requests

---

## Appendix

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `1-8` | Quick vote with number keys |
| `Enter` | Submit vote / Confirm action |
| `Esc` | Close modal / Cancel |
| `Tab` | Navigate between elements |
| `Shift + Tab` | Navigate backwards |
| `Space` | Toggle checkbox / Activate button |
| `RETRO` | Activate Retro CRT Mode |
| `JOSHUA` | Activate DeLorean Time Circuits |
| `↑↑↓↓←→←→BA` | Konami Code |

### Session Code Format

- **Length:** 6 characters
- **Characters:** Alphanumeric (A-Z, 0-9)
- **Case:** Insensitive (ABC123 = abc123)
- **Uniqueness:** Guaranteed unique per session
- **Generation:** Auto-generated on session creation

### Status Values

**Session Status:**
- `draft` - Created but not started
- `active` - In progress
- `completed` - Finished

**Story Status:**
- `pending` - Not yet voted on
- `voting` - Currently accepting votes
- `completed` - Estimate finalized

**Vote Status:**
- `submitted` - Vote recorded
- `revealed` - Visible to all
- `superseded` - Replaced by new vote

### Metrics Calculations

**Consensus Rate:**
```javascript
consensusRate = (storiesWithConsensus / totalStories) * 100
```

**Average Velocity:**
```javascript
averageVelocity = totalStoryPoints / numberOfSessions
```

**Participant Engagement:**
```javascript
engagement = (participantsWhoVoted / totalParticipants) * 100
```

---

## Glossary

- **Dealer**: Session facilitator (usually Scrum Master or Product Owner)
- **Participant**: Team member voting on estimates
- **Story**: Work item to be estimated (user story, task, bug)
- **Vote**: Individual estimate submitted by participant
- **Reveal**: Action that makes all votes visible
- **Consensus**: Agreement on estimate (all same or variance < 20%)
- **Round**: One voting cycle for a story
- **Session Code**: 6-character unique identifier for joining sessions
- **Time Box**: Maximum time allocated for discussion
- **Velocity**: Rate of story completion (story points per sprint)
- **Scale**: Estimation system (T-shirt, Fibonacci, Poker)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | Nov 2025 | Claude | Complete rewrite with modern GUI system |
| 1.0 | Oct 2025 | - | Initial version |

---

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Project overview and development guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures
- [PHASE_1_THEME_IMPLEMENTATION_REPORT.md](./PHASE_1_THEME_IMPLEMENTATION_REPORT.md) - Theme system details
- [EASTER_EGGS_QUICK_REFERENCE.md](./EASTER_EGGS_QUICK_REFERENCE.md) - Easter egg activation guide
- [gui.md](./gui.md) - GUI implementation specification

---

**For questions or support, contact your ServiceNow administrator.**

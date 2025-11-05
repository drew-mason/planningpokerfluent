# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

**Common Commands:**
```bash
npx eslint path/to/file.js  # Lint JavaScript files
```

**Testing:** Run background scripts in ServiceNow (APPLICATION scope):
- `VERIFY_CODE_VERSION.js` - Verify deployed code version
- `TEST_AJAX_FIXED.js` - Test AJAX parameter passing
- `DIAGNOSE_ISSUE.js` - General diagnostics

**Key Architecture Patterns:**
- **AJAX Delegation:** `PlanningPokerAjax` → specialized classes (SessionAjax, VotingAjax, StoryAjax)
- **Parameter Sharing:** Use `_copyParametersTo()` with `.bind()` to share request context
- **GlideRecord Updates:** Always use two-pass pattern (collect IDs → update separately)
- **UI Pages:** HTML in `.html.html`, JavaScript in `.client_script.js` (NEVER mix)
- **Story Data:** Read/write from `rm_story` (source of truth), NOT `session_stories`

**Critical Rules:**
- 🚫 **NEVER commit without user permission** - User controls all git operations
- 🚫 **NEVER put JavaScript in HTML files** - Always separate files
- ✅ **ALWAYS call `setAnswer()` in AJAX processors** - Required for AbstractAjaxProcessor
- ✅ **ALWAYS self-close void elements in XML** - `<br />`, `<meta />`, `<hr />`

---

## Project Overview

**Planning Poker ServiceNow Application** (x_902080_msmplnpkr)
- **Instance:** dev353895.service-now.com
- **Platform:** ServiceNow Zurich Release
- **Development:** VS Code with ServiceNow Sync (NOT using Fluent/SDK)

Scoped application for Agile story estimation using collaborative voting sessions. Dealers facilitate sessions where participants estimate story points using various scoring methods (Fibonacci, T-shirt sizing, etc.).

## Build, Lint, and Test Commands

### Linting
```bash
npx eslint path/to/file.js  # ESLint 5.6.0 installed
```

### Testing
No traditional unit tests. Testing uses:
- **ServiceNow ATF** - `src/Automated Test Framework/Test Steps/`
- **Test Runner UI** - `test_runner` UI Page
- **Background Scripts** - Located in `background scripts/` directory (also in root)

**How to run background scripts:**
1. Navigate to: **System Definition > Scripts - Background** in ServiceNow
2. Set **Application** = "Planning Poker New (x_902080_msmplnpkr)" (APPLICATION scope)
3. Copy script content and execute

**Available Scripts:**
- `TEST_AJAX_FIXED.js` - AJAX parameter passing tests
- `TEST_PARAMETER_MECHANICS.js` - Parameter mechanics validation
- `DIAGNOSE_ISSUE.js` - General diagnostics
- `CHECK_AJAX_SYNC.js` - Verify sync status
- `VERIFY_CODE_VERSION.js` - Confirm deployed version

## High-Level Architecture

### Modular AJAX Delegation Pattern (CRITICAL)

The application uses a **coordinator-delegate pattern** for better code organization and maintainability.

**Architecture Flow:**
```
Client (GlideAjax) → PlanningPokerAjax (Coordinator)
                         ├─→ PlanningPokerSessionAjax (session retrieval)
                         ├─→ PlanningPokerVotingAjax (vote operations)
                         └─→ PlanningPokerStoryAjax (story lifecycle)
```

**How It Works:**
1. **Client calls** `PlanningPokerAjax` methods (e.g., `getSession()`, `castVote()`)
2. **Coordinator** receives request and initializes specialized AJAX instances
3. **Parameter copying** using `_copyParametersTo()` shares request context via `.bind()`
4. **Delegation** to appropriate specialized class using `.apply()`
5. **Response** returned via `_setAnswerAndReturn()` which calls `setAnswer()`

**Why This Matters:**
- Each AJAX instance needs access to the original request parameters
- Using `.bind()` ensures `getParameter()` works in delegated instances
- Without proper parameter copying, delegated methods cannot access client data
- This pattern keeps code organized by concern (session, voting, story)

### Core Components

**Data Layer (Tables):**
- `x_902080_msmplnpkr_planning_session` - Sessions (extends Task)
- `x_902080_msmplnpkr_session_stories` - Stories to estimate
- `x_902080_msmplnpkr_planning_vote` - Individual votes
- `x_902080_msmplnpkr_scoring_method` - Voting scales
- `x_902080_msmplnpkr_session_participant` - Role tracking (dealer/participant/spectator)
- `x_902080_msmplnpkr_session_voter_groups` - Group-based access control
- `x_902080_msmplnpkr_scoring_value` - Individual values for scoring methods

**Business Logic (Script Includes):**

*Core AJAX Pattern (Coordinator-Delegate):*
- `PlanningPokerAjax.script.js` - **Coordinator** (receives all client calls, delegates to specialists)
- `PlanningPokerSessionAjax.script.js` - **Delegate** for session retrieval
- `PlanningPokerVotingAjax.script.js` - **Delegate** for vote operations
- `PlanningPokerStoryAjax.script.js` - **Delegate** for story lifecycle

*Supporting AJAX Classes:*
- `SessionManagementAjax.script.js` - Session CRUD, story management
- `SessionStatisticsAjax.script.js` - Analytics
- `SessionParticipantAjax.script.js` - Role switching
- `DemoSessionAjax.script.js` - Demo session creation for testing

*Utilities:*
- `PlanningPokerTestRunner.script.js` - Test framework
- `PlanningPokerVoteUtils.script.js` - Vote calculation helpers
- `PlanningPokerSecurity.script.js` - Security utilities

**Presentation (10 UI Pages):**
- `voting_interface` - Real-time voting
- `session_management` - Session CRUD
- `session_statistics` - Analytics
- `demo_session_creator` - Testing
- `test_runner` - Test suite

**Automation (3 Business Rules):**
- `Auto Update Session Status` - Auto-completes sessions
- `Update Session Summary Fields` - Maintains counts
- `Update Session Summary on Vote Change` - Vote tracking

### Story Details Data Flow (CRITICAL)

```
rm_story (SOURCE OF TRUTH)
    ↓ referenced by
session_stories.story (reference field)
    ↓ displayed via
_getCurrentStory() → queries rm_story directly
    ↓ edits saved to
updateStoryDetails() → updates rm_story, NOT session_stories
```

Description and acceptance criteria are ALWAYS read/written to `rm_story` with fallback to `session_stories` only if reference is missing.

### Vote Lifecycle

```
1. castVote() → Creates/updates planning_vote
2. Business Rule → Updates vote_count summary
3. revealVotes() → Sets status 'revealed', calculates stats
4. setStoryPoints() → Marks complete, auto-advances
5. Business Rule → Auto-completes session when all stories done
```

### Performance: Summary Fields

Prevent expensive calculations with auto-maintained fields:
- **Planning Session:** `total_stories`, `stories_voted`, `stories_completed`, `stories_skipped`, `total_votes`
- **Session Stories:** `vote_count`, `times_revoted`, `session_count`

Updated automatically by business rules.

## Key Patterns and Conventions

### 1. GlideRecord Two-Pass Pattern (CRITICAL)

```javascript
// ✅ CORRECT - Collect IDs first, update separately
var sessionIds = [];
var gr = new GlideRecord('table');
gr.query();
while (gr.next()) {
  sessionIds.push(gr.getUniqueValue());
}
for (var i = 0; i < sessionIds.length; i++) {
  var updateGr = new GlideRecord('table');
  if (updateGr.get(sessionIds[i])) {
    updateGr.setValue('field', value);
    updateGr.update();
  }
}

// ❌ WRONG - Causes cursor conflicts
while (gr.next()) {
  gr.setValue('field', value);
  gr.update(); // ERROR!
}
```

### 2. AJAX Parameter Passing with bind()

```javascript
_copyParametersTo: function(targetAjax) {
  if (this.request) {
    targetAjax.request = this.request;
  }
  if (this.getParameter) {
    targetAjax.getParameter = this.getParameter.bind(this);
  }
}
```

### 3. Explicit setAnswer() Calls

```javascript
_setAnswerAndReturn: function(result) {
  this.setAnswer(result); // REQUIRED for AbstractAjaxProcessor
  return result;
}
```

### 4. UI Page Structure (MANDATORY)

**ALWAYS separate HTML and JavaScript:**

```
src/Forms & UI/UI Pages/[page_name]/
├── [page_name].html.html          # XML/Jelly + HTML + CSS ONLY
└── [page_name].client_script.js   # Pure JavaScript ONLY
```

**HTML File (`*.html.html`):**
```html
<?xml version="1.0" encoding="utf-8"?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide">
<html>
<head>
  <style>/* CSS here */</style>
</head>
<body>
  <!-- HTML content -->
</body>
</html>
</j:jelly>
```

**NO `<g:inline>` tags** - ServiceNow auto-includes "Client script" field content.

**Client Script File (`*.client_script.js`):**
```javascript
// Pure JavaScript - no XML, no CDATA, no wrappers
/* global GlideAjax */
function myFunction() {
  // Use &&, <, >, & freely without XML escaping
}
```

**Why:** Avoids XML/CDATA/entity escaping issues, proper linting, follows ServiceNow best practices.

### 5. Story Reuse Logic

Stories reusable ONLY if:
- Previous session completed/cancelled AND
- Story has 0 votes OR status is 'skipped'

```javascript
if (sessionStatus === 'completed' || sessionStatus === 'cancelled') {
  var voteCount = voteCheckGr.getRowCount();
  if (voteCount === 0 || storyStatus === 'skipped') {
    // ✅ ALLOW REUSE
  }
}
```

### 6. Role-Based Pattern

Explicit parameters take priority over database:
```javascript
var explicitRole = this.getParameter('sysparm_role');
if (explicitRole === 'dealer' || explicitRole === 'participant' || explicitRole === 'spectator') {
  role = explicitRole; // User-selected wins
}
```

### 7. XML/Jelly Rules

Void elements MUST be self-closing:
```html
✅ <meta name="viewport" content="width=device-width" />
✅ <br />
✅ <hr />

❌ <meta name="viewport" content="width=device-width"></meta>
❌ <br>
```

No DOCTYPE in UI Pages:
```html
❌ <!DOCTYPE html>
✅ <?xml version="1.0" encoding="utf-8"?>
   <j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide">
```

### 8. Safe Logging Pattern

```javascript
try {
  gs.info('[Function] Parameter: ' + String(this.getParameter('param') || 'null'));
} catch (e) {
  gs.info('[Function] Logging failed, continuing...');
}
```

## Development Workflow

### File Sync
Changes sync automatically via ServiceNow VS Code extension:
- Server-side: `src/Server Development/Script Includes/*.script.js`
- Client-side: `src/Forms & UI/UI Pages/*/*.client_script.js`
- HTML: `src/Forms & UI/UI Pages/*/*.html.html`

### Git Workflow (CRITICAL)
**NEVER commit code without explicit user permission.**
- Only stage files when requested
- User controls all commits and messages
- "sync" means VS Code sync, NOT git operations

### Testing Workflow
1. Make changes in VS Code
2. Auto-sync to ServiceNow via extension
3. Run verification script in background scripts
4. Test in UI (voting_interface, session_management, etc.)
5. Check System Logs for errors
6. Stage changes (DO NOT commit without permission)

## Critical Documentation Files

**MUST READ:**
1. `Lessons Learned/copilot-instructions.md` - Original requirements (note: mentions Fluent/SDK which weren't used)
2. `Lessons Learned/LESSONS_LEARNED.md` - Critical patterns and pitfalls
3. `Lessons Learned/TECHNICAL_BRIEFING.md` - Technical architecture
4. `.claude/agents/servicenow-zurich-dev.md` - ServiceNow agent instructions

## Common Pitfalls

### 🚫 NEVER Do:
1. **Commit code without user permission** - User controls all git operations
2. **Mix HTML and JavaScript in UI Pages** - Always use separate `.html.html` and `.client_script.js` files
3. **Update GlideRecord while iterating** - Use two-pass pattern (collect IDs first, then update)
4. **Use non-self-closing void elements** - Must use `<br />`, `<meta />`, `<hr />` in XML
5. **Forget `setAnswer()` in AJAX processors** - Required for AbstractAjaxProcessor to return data
6. **Copy parameters without `.bind()`** - Delegation will fail without proper binding
7. **Write to `session_stories` fields** - Story details go to `rm_story` (source of truth)

### ✅ ALWAYS Do:
1. **Separate HTML and JavaScript** - Use `.html.html` for structure/CSS, `.client_script.js` for logic
2. **Use two-pass GlideRecord pattern** - Collect IDs array, then update in separate loop
3. **Self-close void elements in XML** - `<br />`, `<meta />`, `<hr />`
4. **Use `String()` in logging** - Prevents toString errors: `String(variable || 'null')`
5. **Call `setAnswer()` explicitly** - Use `_setAnswerAndReturn()` helper pattern
6. **Copy parameters with `.bind()`** - Use `_copyParametersTo()` for delegation
7. **Read/write story details from `rm_story`** - Not from `session_stories` fields

## Key Files Reference

### 🖥️ Server Development
**Location:** `x-902080-msm-planning-poker/src/Server Development/Script Includes/`

*Coordinator-Delegate Pattern:*
- `PlanningPokerAjax.script.js` - **Main coordinator** (entry point for all client calls)
- `PlanningPokerSessionAjax.script.js` - Session retrieval delegate
- `PlanningPokerVotingAjax.script.js` - Vote operations delegate
- `PlanningPokerStoryAjax.script.js` - Story lifecycle delegate

*Supporting Classes:*
- `SessionManagementAjax.script.js` - Session CRUD operations
- `SessionStatisticsAjax.script.js` - Analytics and reporting
- `SessionParticipantAjax.script.js` - Role management

### 🎨 UI Pages
**Location:** `x-902080-msm-planning-poker/src/Forms & UI/UI Pages/`

- `voting_interface/` - **Primary interface** for real-time voting
  - `voting_interface.html.html` - Structure + CSS
  - `voting_interface.client_script.js` - Voting logic
- `session_management/` - Session CRUD interface
  - `session_management.html.html` - Structure + CSS
  - `session_management.client_script.js` - Management logic
- `session_statistics/` - Analytics dashboard

### 🧪 Background Scripts
**Location:** `background scripts/` (also in root as standalone files)

- `VERIFY_CODE_VERSION.js` - Verify deployed code version
- `TEST_AJAX_FIXED.js` - Test AJAX parameter passing with `.bind()`
- `DIAGNOSE_ISSUE.js` - General diagnostics
- `CHECK_AJAX_SYNC.js` - Verify sync status
- `TEST_PARAMETER_MECHANICS.js` - Validate parameter mechanics

## Technology Stack

- **ServiceNow Zurich Release** - Platform
- **JavaScript (ES5)** - Scripting
- **GlideRecord/GlideAjax** - Database/AJAX operations
- **XML/Jelly** - UI templating
- **jQuery** - Client-side DOM
- **VS Code + ServiceNow Extension** - Development

**NOT USED:** ServiceNow SDK, Fluent Language, ServiceNow CLI (despite documentation mentioning them)

## Notes for AI Assistants

- Uses **traditional ServiceNow development**, not Fluent/SDK
- **Documentation mentions Fluent** but it's NOT actually used
- **VS Code sync is deployment**, not npm scripts
- **Background scripts run in ServiceNow** using application scope
- **Testing is manual or through custom test runner**, not Jest/Mocha

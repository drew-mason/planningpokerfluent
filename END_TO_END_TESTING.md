# End-to-End Testing Guide - Planning Poker Fluent

## Deployment Information
- **ServiceNow Instance:** https://dev353895.service-now.com
- **Application Scope:** x_902080_ppoker
- **Latest Deploy:** Successfully deployed (614KB bundle)

## Testing Prerequisites
1. ✅ Application built successfully
2. ✅ Deployed to ServiceNow instance
3. ✅ All backend components complete:
   - 4 Tables (session, session_stories, vote, session_participant)
   - 3 Script Includes (planning-poker-session, voting-ajax, story-ajax)
   - 3 Business Rules (session-defaults, update-session-summary, update-vote-count)
4. ✅ All frontend components complete:
   - 4 Services (PlanningSessionService, StoryService, VotingService, AnalyticsService)
   - 12 React components including 3 orchestration components

## Test Scenarios

### Test 1: Session Creation Flow
**Objective:** Verify session creation with automatic defaults

**Steps:**
1. Navigate to Planning Poker app: `/x_902080_ppoker/index.html`
2. Click "Create New Session" button
3. Fill in session form:
   - Name: "Sprint 25 Planning"
   - Description: "Q1 2025 User Stories"
   - Estimation Scale: "T-Shirt Sizes"
4. Click "Create Session"

**Expected Results:**
- ✅ Session appears in session list
- ✅ Session code generated (6 alphanumeric characters, e.g., "ABC123")
- ✅ Status set to "pending"
- ✅ Dealer set to current user
- ✅ Timestamps populated (sys_created_on, sys_updated_on)
- ✅ Summary fields initialized:
  - total_stories: 0
  - pending_stories: 0
  - completed_stories: 0
  - consensus_rate: 0

**Browser Console Checks:**
```javascript
// Should see logs like:
PlanningSessionService.create: Creating session with data: {...}
App.handleFormSubmit: Created session result: {...}
App.refreshSessions: Retrieved sessions: [...]
```

**ServiceNow Database Verification:**
```sql
-- Navigate to: Tables > x_902080_ppoker_session
-- Verify record exists with:
SELECT session_code, name, dealer, status 
FROM x_902080_ppoker_session 
WHERE name = 'Sprint 25 Planning'
```

---

### Test 2: Join Session Flow
**Objective:** Verify session joining and participant tracking

**Steps:**
1. From session list, note the session code (e.g., "ABC123")
2. Click "Join Session" button
3. Enter session code: "ABC123"
4. Click "Join Session"

**Expected Results:**
- ✅ Session opens in SessionDashboard view
- ✅ Session header shows name and code
- ✅ Participants section shows current user
- ✅ Stories section shows empty state (0 stories)
- ✅ Dealer badge visible if user is dealer

**Database Verification:**
```sql
-- Navigate to: Tables > x_902080_ppoker_session_participant
-- Verify participant record created:
SELECT user, session, role, joined_at 
FROM x_902080_ppoker_session_participant 
WHERE session = '<session_sys_id>'
```

---

### Test 3: Story Management
**Objective:** Verify story creation, editing, reordering, and deletion

**3A: Add Single Story**
1. In SessionDashboard, click "+ Add" button
2. Enter story title: "User Authentication"
3. Enter description: "As a user, I want to login securely"
4. Click "Add Story"

**Expected Results:**
- ✅ Story appears in stories list with #1 sequence
- ✅ Status: "pending"
- ✅ Story icon: ⏳
- ✅ Session summary updated:
  - total_stories: 1
  - pending_stories: 1

**3B: Bulk Import Stories**
1. Click "📋 Bulk Import" (if StoryManager exposed)
2. Enter multiple stories:
   ```
   User Registration|New user signup flow
   Password Reset
   Two-Factor Authentication|SMS and authenticator app support
   Profile Management
   ```
3. Click "Import Stories"

**Expected Results:**
- ✅ 4 stories added with sequential ordering (#2, #3, #4, #5)
- ✅ Session summary updated:
  - total_stories: 5
  - pending_stories: 5

**3C: Edit Story**
1. Click on story "Password Reset"
2. Click edit (✏️) button
3. Update title: "Password Reset Flow"
4. Add description: "Email-based password reset"
5. Click "Save Changes"

**Expected Results:**
- ✅ Story title updated in list
- ✅ Description saved to database
- ✅ Sequence order unchanged

**3D: Reorder Stories**
1. Open StoryManager (if available)
2. Drag "Two-Factor Authentication" to position #2
3. Drop story

**Expected Results:**
- ✅ Stories reordered:
  - #1: User Authentication
  - #2: Two-Factor Authentication
  - #3: User Registration
  - #4: Password Reset Flow
  - #5: Profile Management
- ✅ Database sequence_order updated

**3E: Delete Story**
1. Click delete (🗑️) button on "Profile Management"
2. Confirm deletion

**Expected Results:**
- ✅ Story removed from list
- ✅ Session summary updated:
  - total_stories: 4
  - pending_stories: 4
- ✅ Remaining stories renumbered (#1-4)

**Database Verification:**
```sql
-- Navigate to: Tables > x_902080_ppoker_session_stories
-- Verify all stories present with correct sequence_order
SELECT story_title, description, sequence_order, status, session
FROM x_902080_ppoker_session_stories
WHERE session = '<session_sys_id>'
ORDER BY sequence_order
```

---

### Test 4: Voting Workflow
**Objective:** Verify voting, vote tracking, revealing, and consensus

**4A: Start Voting**
1. Select first story: "User Authentication"
2. If dealer, click story to auto-start voting
3. If not dealer, wait for dealer to start

**Expected Results:**
- ✅ Story status changes to "voting"
- ✅ Story icon changes to 🗳️
- ✅ Estimation scale appears with voting cards
- ✅ VotingSession component renders

**4B: Cast Vote**
1. Select estimation card (e.g., "M" for Medium)
2. Click card to vote

**Expected Results:**
- ✅ Card shows selected state (checkmark, ring)
- ✅ Vote record created in database
- ✅ Vote appears in hidden votes section
- ✅ Vote count updates

**Console Verification:**
```javascript
VotingService.submitVote: Submitting vote for story: <story_id>, estimate: M
```

**Database Verification:**
```sql
-- Navigate to: Tables > x_902080_ppoker_vote
-- Verify vote record:
SELECT voter, story, estimate, vote_version, voted_at
FROM x_902080_ppoker_vote
WHERE story = '<story_sys_id>'
```

**4C: Multiple Participants Vote** (Simulate with multiple users if possible)
1. User 1 votes: "M"
2. User 2 votes: "M"
3. User 3 votes: "L"

**Expected Results:**
- ✅ Hidden vote cards show count (3 cards face-down)
- ✅ Story vote_count updated in database
- ✅ Business rule triggers vote count update

**Business Rule Verification:**
```sql
-- Story record should show:
SELECT vote_count, vote_summary, is_revealed
FROM x_902080_ppoker_session_stories
WHERE sys_id = '<story_sys_id>'
-- Expected: vote_count = 3, vote_summary = '{"M":2,"L":1}'
```

**4D: Auto-Reveal (if all participants voted)**
If participant count equals vote count:

**Expected Results:**
- ✅ Business rule `update-vote-count` auto-reveals votes
- ✅ is_revealed set to true
- ✅ Vote cards flip to show estimates
- ✅ Vote breakdown chart appears

**4E: Manual Reveal (Dealer Only)**
1. Click "Reveal Votes" button

**Expected Results:**
- ✅ Vote cards flip animation
- ✅ Vote breakdown shows:
  - M: 2 votes (67%)
  - L: 1 vote (33%)
- ✅ Consensus status displayed:
  - ❌ "No consensus achieved" (not all same)
  - Statistics: Avg, Median shown

**4F: Consensus Scenario**
If all 3 participants voted "M":

**Expected Results:**
- ✅ Vote breakdown shows:
  - M: 3 votes (100%)
- ✅ Consensus indicator: 🎯 "Consensus Achieved!"
- ✅ Final estimate: "M"
- ✅ consensus_achieved: true

**4G: Finalize Story**
1. Dealer clicks "Accept Consensus (M)" or "Finalize with: Average/Median"
2. Confirm finalization

**Expected Results:**
- ✅ Story status changes to "completed"
- ✅ Story icon changes to ✅
- ✅ final_estimate set to "M"
- ✅ consensus_achieved set to true/false
- ✅ Session summary updated:
  - completed_stories: 1
  - consensus_rate calculated
- ✅ Auto-advance to next story

**Database Verification:**
```sql
-- Story completed:
SELECT story_title, status, final_estimate, consensus_achieved
FROM x_902080_ppoker_session_stories
WHERE sys_id = '<story_sys_id>'

-- Session summary updated:
SELECT total_stories, completed_stories, consensus_rate
FROM x_902080_ppoker_session
WHERE sys_id = '<session_sys_id>'
```

**4H: Clear Votes & Re-vote**
1. Dealer clicks "Clear Votes & Re-vote"
2. Confirm action

**Expected Results:**
- ✅ All votes deleted from database
- ✅ vote_count reset to 0
- ✅ is_revealed set to false
- ✅ Story status back to "voting"
- ✅ Vote cards reset (no selections)

**4I: Reset Completed Story**
1. Click reset (🔄) button on completed story
2. Confirm reset

**Expected Results:**
- ✅ Story status: "pending"
- ✅ final_estimate cleared
- ✅ consensus_achieved: false
- ✅ All votes deleted
- ✅ Session summary recalculated

---

### Test 5: Session Auto-Completion
**Objective:** Verify automatic session completion when all stories done

**Steps:**
1. Complete all 4 remaining stories (vote & finalize each)
2. Observe session status after last story finalized

**Expected Results:**
- ✅ Business rule `update-session-summary` triggers
- ✅ Session status changes to "completed"
- ✅ Session summary shows:
  - total_stories: 4
  - completed_stories: 4
  - consensus_rate: calculated (e.g., 75% if 3/4 had consensus)

**Database Verification:**
```sql
-- Session auto-completed:
SELECT status, total_stories, completed_stories, consensus_rate
FROM x_902080_ppoker_session
WHERE sys_id = '<session_sys_id>'
-- Expected: status = 'completed', completed_stories = total_stories
```

---

### Test 6: Real-Time Updates (Polling)
**Objective:** Verify SessionDashboard polls for updates

**Steps:**
1. Open session in browser tab 1 (User A)
2. Open same session in browser tab 2 (User B)
3. User B adds a story
4. Wait 5 seconds (polling interval)
5. Observe tab 1

**Expected Results:**
- ✅ Tab 1 shows new story after 5-second polling
- ✅ No page refresh required
- ✅ Console shows: `SessionDashboard.loadSessionData: Starting to load...`

---

### Test 7: Error Handling
**Objective:** Verify error states and recovery

**7A: Invalid Session Code**
1. Click "Join Session"
2. Enter invalid code: "XXXXXX"
3. Click "Join Session"

**Expected Results:**
- ✅ Error message: "Session not found" or "Invalid session code"
- ✅ Modal remains open
- ✅ User can retry

**7B: Network Failure** (Simulate by disabling network)
1. Disable network
2. Try to vote
3. Re-enable network

**Expected Results:**
- ✅ Error banner: "Failed to submit vote"
- ✅ Retry button appears
- ✅ After network restored, retry succeeds

**7C: Duplicate Participant**
1. User A joins session
2. User A tries to join again

**Expected Results:**
- ✅ Participant record updated (not duplicated)
- ✅ Session dashboard loads normally

---

### Test 8: Analytics Dashboard
**Objective:** Verify analytics and reporting

**Steps:**
1. From main app, click "📊 Analytics" button
2. Observe AnalyticsDashboard component

**Expected Results:**
- ✅ Session metrics displayed:
  - Total sessions
  - Active sessions
  - Completed sessions
- ✅ Velocity chart shows story completion trends
- ✅ Consensus chart shows consensus rates
- ✅ Export options available (CSV, PDF)

**Service Methods Tested:**
- `getSessionMetrics()`
- `getVelocityData()`
- `getConsensusAnalysis()`
- `exportReport(format)`

---

### Test 9: Session List Filtering
**Objective:** Verify search and filter functionality

**Steps:**
1. Navigate to session list
2. Create multiple sessions with different statuses
3. Test search:
   - Enter "Sprint" in search box
   - Verify only matching sessions shown
4. Test status filter:
   - Select "Active" from dropdown
   - Verify only active sessions shown

**Expected Results:**
- ✅ Search filters by name, description, session code
- ✅ Status filter works correctly
- ✅ Combined filters work together
- ✅ "Clear Filters" button resets all

---

### Test 10: Edge Cases
**Objective:** Test boundary conditions

**10A: Empty Session**
- Create session without adding stories
- Status should remain "pending"
- Summary fields should show zeros

**10B: Single Participant Voting**
- Only dealer joins
- Dealer votes
- Votes should auto-reveal (1 vote = all votes)

**10C: Very Long Story Title**
- Create story with 200+ character title
- Should truncate in UI but save full text

**10D: Special Characters**
- Story title: "User's Profile & Settings (v2.0)"
- Should save and display correctly (no SQL injection)

**10E: Rapid Voting**
- Change vote multiple times quickly
- Should update vote record (not create duplicates)
- vote_version should increment

---

## Browser Console Monitoring

Throughout testing, monitor browser console for:

### Expected Log Messages:
```javascript
PlanningSessionService.list: Retrieved sessions: [...]
PlanningSessionService.create: Creating session...
StoryService.getSessionStories: Retrieved stories for session...
VotingService.submitVote: Submitting vote...
VotingService.getVotingStats: Retrieved stats...
SessionDashboard.loadSessionData: Session data loaded successfully
```

### Error Indicators:
```javascript
// Should NOT see:
❌ GlideRecord is not defined
❌ 403 Forbidden
❌ CORS errors
❌ Uncaught TypeError
❌ Cannot read property of undefined
```

---

## ServiceNow System Logs

Check ServiceNow system logs for business rule execution:

**Navigate to:** System Logs > System Log > Application Logs

**Expected Log Entries:**
```
[INFO] session-defaults.now: Setting defaults for session [session_id]
[INFO] session-defaults.now: Generated session code: ABC123
[INFO] update-session-summary.now: Session summary updated - Total: 5, Completed: 3, Consensus: 60%
[INFO] update-vote-count.now: Vote count updated for story [story_id] - 3/3 votes, revealing...
[INFO] update-vote-count.now: Auto-revealing story - all participants voted
```

---

## Database Integrity Checks

### Query 1: Verify Session Integrity
```sql
SELECT 
    s.name,
    s.session_code,
    s.total_stories,
    s.completed_stories,
    s.consensus_rate,
    COUNT(DISTINCT st.sys_id) as actual_total_stories,
    COUNT(CASE WHEN st.status = 'completed' THEN 1 END) as actual_completed_stories
FROM x_902080_ppoker_session s
LEFT JOIN x_902080_ppoker_session_stories st ON st.session = s.sys_id
GROUP BY s.sys_id
-- Verify: total_stories = actual_total_stories
-- Verify: completed_stories = actual_completed_stories
```

### Query 2: Verify Vote Integrity
```sql
SELECT 
    st.story_title,
    st.vote_count,
    COUNT(v.sys_id) as actual_vote_count,
    st.vote_summary
FROM x_902080_ppoker_session_stories st
LEFT JOIN x_902080_ppoker_vote v ON v.story = st.sys_id
GROUP BY st.sys_id
-- Verify: vote_count = actual_vote_count
```

### Query 3: Verify Consensus Rate
```sql
SELECT 
    s.name,
    s.total_stories,
    s.completed_stories,
    s.consensus_rate,
    COUNT(CASE WHEN st.consensus_achieved = true THEN 1 END) as consensus_stories,
    (COUNT(CASE WHEN st.consensus_achieved = true THEN 1 END) * 100.0 / NULLIF(s.completed_stories, 0)) as calculated_consensus_rate
FROM x_902080_ppoker_session s
LEFT JOIN x_902080_ppoker_session_stories st ON st.session = s.sys_id AND st.status = 'completed'
GROUP BY s.sys_id
-- Verify: consensus_rate ≈ calculated_consensus_rate
```

---

## Performance Benchmarks

### Target Metrics:
- **Session Creation:** < 500ms
- **Story Addition:** < 300ms
- **Vote Submission:** < 200ms
- **Vote Reveal:** < 400ms
- **Page Load (5 sessions):** < 1s
- **Page Load (50 sessions):** < 2s
- **Polling Refresh:** < 500ms

### Bundle Size:
- **Current:** 614KB (acceptable)
- **Target:** < 800KB
- **Gzipped:** ~150-200KB

---

## Test Summary Checklist

After completing all tests, verify:

- [ ] ✅ Session creation with auto-generated code
- [ ] ✅ Session list filtering and search
- [ ] ✅ Join session by code
- [ ] ✅ Participant tracking
- [ ] ✅ Story CRUD operations (Create, Read, Update, Delete)
- [ ] ✅ Story reordering (drag & drop)
- [ ] ✅ Bulk story import
- [ ] ✅ Voting workflow (submit, update, clear)
- [ ] ✅ Vote reveal (manual and auto)
- [ ] ✅ Consensus detection
- [ ] ✅ Story finalization
- [ ] ✅ Session auto-completion
- [ ] ✅ Real-time updates (polling)
- [ ] ✅ Error handling and recovery
- [ ] ✅ Analytics dashboard
- [ ] ✅ Business rules execution
- [ ] ✅ Database integrity
- [ ] ✅ No console errors
- [ ] ✅ No CORS or auth errors
- [ ] ✅ Performance within targets

---

## Known Issues / Limitations

### Current:
1. **Polling interval:** 5 seconds (not true real-time)
2. **No WebSocket support:** Requires page refresh for some updates
3. **User context:** Currently using placeholder for current user detection
4. **Single instance:** Not tested with multi-instance deployment

### Future Enhancements:
1. **WebSocket integration:** Real-time bidirectional updates
2. **Push notifications:** Alert users when votes revealed
3. **Advanced analytics:** Velocity trends, team performance
4. **Mobile responsive:** Touch-optimized voting cards
5. **Accessibility:** Full WCAG 2.1 AA compliance

---

## Troubleshooting

### Issue: "GlideRecord is not defined"
**Cause:** Client-side code trying to use server-side API  
**Fix:** Use REST API via `nativeService.query()` instead

### Issue: Session list shows 0 results
**Cause:** Missing authentication or ACL restrictions  
**Fix:** 
1. Check `allow_web_service_access: true` in table definition
2. Ensure `X-UserToken` header present in requests
3. Verify user has read access to tables

### Issue: Votes not saving
**Cause:** Script include not accessible or voting service error  
**Fix:**
1. Check script include exports in `src/fluent/index.now.ts`
2. Verify voting-ajax.now.ts has correct `accessible_from: 'public'`
3. Check ServiceNow logs for errors

### Issue: Business rules not triggering
**Cause:** Table name mismatch or condition not met  
**Fix:**
1. Verify table name matches exactly (e.g., `x_902080_ppoker_session`)
2. Check business rule conditions
3. Enable debug logging in business rules

---

## Test Report Template

```markdown
# Planning Poker Test Report - [Date]

## Test Environment
- ServiceNow Instance: dev353895.service-now.com
- Application Version: 1.0.0
- Bundle Size: 614KB
- Tester: [Name]

## Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| Session Creation | ✅ PASS | |
| Join Session | ✅ PASS | |
| Story Management | ✅ PASS | |
| Voting Workflow | ✅ PASS | |
| Auto-Completion | ✅ PASS | |
| Real-Time Updates | ✅ PASS | |
| Error Handling | ✅ PASS | |
| Analytics | ✅ PASS | |
| Filtering | ✅ PASS | |
| Edge Cases | ✅ PASS | |

## Issues Found
1. [None]

## Performance Metrics
- Session Creation: [time]ms
- Vote Submission: [time]ms
- Page Load: [time]ms

## Recommendations
1. [Any improvements needed]

## Sign-off
- ✅ All critical tests passing
- ✅ No blocking issues
- ✅ Ready for production
```

---

## Next Steps

After successful testing:

1. **Document findings:** Fill out test report template
2. **Fix any issues:** Address bugs found during testing
3. **Update README:** Add usage instructions for end users
4. **Create user guide:** Step-by-step guide for facilitators
5. **Production deployment:** Deploy to production instance
6. **User training:** Train team on Planning Poker usage
7. **Monitor production:** Track usage and gather feedback

---

**Last Updated:** November 5, 2025  
**Testing Status:** Ready for execution  
**Application Status:** 100% complete, deployed, ready for testing

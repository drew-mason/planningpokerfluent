# Testing & QA Agent

## Role
Quality assurance specialist focusing on testing strategies, bug detection, and ensuring application reliability across all components.

## Expertise
- Manual testing procedures
- Test case design
- Bug reporting and tracking
- Performance testing
- User acceptance testing
- Browser compatibility

## Primary Responsibilities

### 1. Test Planning
**Location:** `TESTING_GUIDE.md`

**Tasks:**
- Design comprehensive test cases
- Create test scenarios
- Define acceptance criteria
- Plan regression tests
- Document test procedures

### 2. Functional Testing

**Test Areas:**
1. **Session Management**
2. **Story Estimation**
3. **Voting Process**
4. **Analytics & Reporting**
5. **User Management**

### 3. Test Execution

**Process:**
1. Deploy latest build
2. Execute test cases
3. Document results
4. Report bugs
5. Verify fixes

## Test Scenarios

### Session Management Tests

#### TC-001: Create Planning Session
```
Prerequisites: Logged in as valid user
Steps:
1. Navigate to Planning Poker application
2. Click "Create New Session"
3. Enter session name: "Sprint 23 Planning"
4. Enter description: "Q1 feature estimation"
5. Click "Create Session"

Expected Results:
- Session created successfully
- Unique session code generated (6 characters)
- User assigned as dealer
- Session status = 'draft'
- Redirected to session dashboard

Pass/Fail: _______
Notes: _______
```

#### TC-002: Join Session by Code
```
Prerequisites: Active session exists
Steps:
1. Navigate to Planning Poker application
2. Click "Join Session"
3. Enter valid session code
4. Click "Join"

Expected Results:
- User added to participants
- Redirected to voting interface
- Can see current story
- Can submit votes

Pass/Fail: _______
Notes: _______
```

#### TC-003: Invalid Session Code
```
Prerequisites: None
Steps:
1. Click "Join Session"
2. Enter invalid code: "XXXXXX"
3. Click "Join"

Expected Results:
- Error message: "Session not found"
- User remains on join screen
- No participant record created

Pass/Fail: _______
Notes: _______
```

### Story Management Tests

#### TC-010: Add Story to Session
```
Prerequisites: Logged in as dealer, session in draft status
Steps:
1. Open session dashboard
2. Click "Add Story"
3. Enter title: "User authentication feature"
4. Enter description: "Implement OAuth login"
5. Click "Save"

Expected Results:
- Story added to session
- Story status = 'pending'
- Sequence order assigned automatically
- Appears in story list

Pass/Fail: _______
Notes: _______
```

#### TC-011: Reorder Stories
```
Prerequisites: Session with multiple stories
Steps:
1. Open session dashboard
2. Drag story #3 to position #1
3. Verify reordering

Expected Results:
- Story moves to new position
- Sequence numbers updated
- Order persisted on refresh

Pass/Fail: _______
Notes: _______
```

#### TC-012: Delete Story
```
Prerequisites: Session with stories
Steps:
1. Select story from list
2. Click "Delete" icon
3. Confirm deletion

Expected Results:
- Story removed from list
- Sequence numbers recalculated
- Associated votes deleted
- Total story count updated

Pass/Fail: _______
Notes: _______
```

### Voting Tests

#### TC-020: Submit Vote
```
Prerequisites: Active session, story in voting status
Steps:
1. View current story
2. Click estimate card: "5"
3. Verify vote submitted

Expected Results:
- Vote recorded with timestamp
- Vote count incremented
- Card shows selected state
- Cannot change vote until reset

Pass/Fail: _______
Notes: _______
```

#### TC-021: Reveal Votes
```
Prerequisites: All participants voted
Steps:
1. As dealer, click "Reveal Votes"
2. View vote distribution

Expected Results:
- All votes displayed
- Vote statistics shown
- Consensus detection ran
- Story status updated

Pass/Fail: _______
Notes: _______
```

#### TC-022: Planning Poker Scale
```
Prerequisites: Active voting session
Steps:
1. Verify all scale values available:
   XS, S, M, L, XL, XXL, ?, ☕
2. Test each value can be selected

Expected Results:
- All values render correctly
- Each value is selectable
- Special cards (?, ☕) work
- Values stored correctly

Pass/Fail: _______
Notes: _______
```

#### TC-023: Consensus Detection
```
Prerequisites: Story with votes
Steps:
1. Scenario A: All votes identical (e.g., all "5")
2. Scenario B: 80% votes same value
3. Scenario C: Votes widely distributed

Expected Results:
Scenario A:
- Consensus = true
- Final estimate = "5"
- Consensus rate = 100%

Scenario B:
- Consensus = true (if >80%)
- Final estimate = majority value
- Consensus rate = 80%

Scenario C:
- Consensus = false
- No final estimate assigned
- Requires re-vote

Pass/Fail: _______
Notes: _______
```

### Analytics Tests

#### TC-030: Session Statistics
```
Prerequisites: Completed session with data
Steps:
1. Navigate to analytics dashboard
2. View session metrics

Expected Results:
- Total stories count correct
- Completed stories count correct
- Consensus rate calculated
- Average estimate shown
- Velocity metrics displayed

Pass/Fail: _______
Notes: _______
```

#### TC-031: Consensus Rate Chart
```
Prerequisites: Session with mixed consensus results
Steps:
1. View consensus chart
2. Verify data accuracy

Expected Results:
- Chart renders correctly
- Data matches database
- Visual indicators accurate
- Legend displays correctly

Pass/Fail: _______
Notes: _______
```

#### TC-032: Velocity Tracking
```
Prerequisites: Multiple completed sessions
Steps:
1. View velocity chart
2. Compare across sessions

Expected Results:
- Historical data displayed
- Trends visible
- Accurate calculations
- Time period filtering works

Pass/Fail: _______
Notes: _______
```

## Browser Compatibility Testing

### Browsers to Test:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Test Areas:
- [ ] Layout rendering
- [ ] Button functionality
- [ ] Form submissions
- [ ] Drag and drop
- [ ] Animations
- [ ] API calls
- [ ] Local storage
- [ ] Session management

## Performance Testing

### Load Testing Scenarios:

#### PT-001: Concurrent Users
```
Scenario: Multiple users join same session
Steps:
1. Create session
2. Have 10+ users join simultaneously
3. Monitor response times

Metrics:
- Join time: < 2 seconds
- Vote submission: < 1 second
- Page load: < 3 seconds
- No timeouts
- No lost data

Pass/Fail: _______
Notes: _______
```

#### PT-002: Large Story Lists
```
Scenario: Session with 100+ stories
Steps:
1. Create session
2. Import 100 stories
3. Test scrolling, filtering, voting

Metrics:
- Page load: < 5 seconds
- Scroll performance: 60fps
- Search results: < 1 second
- No browser freezing

Pass/Fail: _______
Notes: _______
```

#### PT-003: Vote Reveal Performance
```
Scenario: Reveal votes for 20+ participants
Steps:
1. Session with 20+ participants
2. All vote on story
3. Dealer reveals votes

Metrics:
- Reveal time: < 2 seconds
- Animation smooth
- Statistics calculate correctly
- No UI blocking

Pass/Fail: _______
Notes: _______
```

## Security Testing

### SEC-001: Authentication
```
Test: Unauthenticated access
Steps:
1. Logout from ServiceNow
2. Attempt to access Planning Poker
3. Try to join session

Expected Results:
- Redirected to login
- No data accessible
- API calls rejected (401)

Pass/Fail: _______
```

### SEC-002: Authorization
```
Test: Non-dealer permissions
Steps:
1. Join as participant
2. Attempt to reveal votes
3. Attempt to delete stories
4. Attempt to close session

Expected Results:
- Dealer-only actions blocked
- Appropriate error messages
- No unauthorized modifications

Pass/Fail: _______
```

### SEC-003: Input Validation
```
Test: Malicious inputs
Steps:
1. Session name: <script>alert('xss')</script>
2. Story description: SQL injection attempt
3. Session code: ../../../etc/passwd

Expected Results:
- Inputs sanitized
- No script execution
- No SQL injection
- No path traversal

Pass/Fail: _______
```

## Accessibility Testing

### A11Y Checklist:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Alt text for images
- [ ] Form labels associated
- [ ] Error messages accessible

## Regression Testing

### After Each Deployment:
1. Run smoke tests (critical path)
2. Verify recent bug fixes
3. Check integrations still work
4. Test session lifecycle end-to-end
5. Verify data persistence

### Smoke Test Suite:
- [ ] Create session
- [ ] Add story
- [ ] Join session
- [ ] Submit vote
- [ ] Reveal votes
- [ ] Complete session
- [ ] View analytics

## Bug Reporting Template

```markdown
### Bug ID: BUG-XXX
**Title:** Clear, descriptive title

**Priority:** Critical / High / Medium / Low
**Status:** Open / In Progress / Fixed / Closed

**Environment:**
- Instance: dev353895.service-now.com
- Browser: Chrome 120.0
- OS: Windows 11
- User Role: Participant

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Screenshots:**
[Attach screenshots]

**Console Errors:**
```
[Console log errors]
```

**Network Activity:**
[API request/response details]

**Additional Notes:**
Any other relevant information
```

## Key Rules

### ✅ DO:
1. Test after every deployment
2. Document all test results
3. Report bugs with full details
4. Verify bug fixes thoroughly
5. Test on multiple browsers
6. Check mobile responsiveness
7. Validate all user inputs
8. Test error scenarios
9. Monitor system logs
10. Perform regression testing

### ❌ DON'T:
1. Skip test cases
2. Assume features work
3. Test only happy paths
4. Ignore minor bugs
5. Skip browser compatibility
6. Forget mobile testing
7. Overlook accessibility
8. Neglect performance
9. Skip security testing
10. Deploy without testing

## Testing Commands

```bash
# Build for testing
npm run build

# Deploy to test instance
npm run deploy

# Check for errors
npm run type-check
npm run lint

# Full pre-deployment check
npm run check-all
```

## Test Data

### Sample Sessions:
```javascript
{
  name: "Sprint 23 Planning",
  description: "Q1 feature estimation",
  dealer: "abel.tuter",
  session_code: "ABC123"
}
```

### Sample Stories:
```javascript
{
  story_title: "User authentication",
  description: "Implement OAuth 2.0 login",
  acceptance_criteria: "Users can login with Google/GitHub"
}
```

### Test Users:
- Dealer: `abel.tuter`
- Participant 1: `admin`
- Participant 2: (create test user)
- Observer: (create test user)

## Metrics to Track

- **Test Coverage:** % of features tested
- **Pass Rate:** % of tests passing
- **Bug Count:** Open/Closed bugs
- **Critical Bugs:** High-priority issues
- **Performance:** Page load times, API response times
- **Uptime:** Application availability

## Support Resources

- `TESTING_GUIDE.md` - Comprehensive testing guide
- `AGENT_UPDATE.md` - Recent changes
- ServiceNow System Logs
- Browser DevTools
- Network tab for API debugging

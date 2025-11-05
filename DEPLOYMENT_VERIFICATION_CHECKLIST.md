# Deployment Verification Checklist
## Planning Poker Fluent - Post-Deployment Validation

**Version:** 1.0
**Date:** _________
**Deployment Date:** _________
**Verified By:** _________
**Instance:** dev353895.service-now.com → Production

---

## Instructions

This checklist MUST be completed immediately after production deployment to verify all systems are operational.

- ✅ Check box when verification passes
- ❌ Mark with X if verification fails
- ⚠️ Mark with warning if partial success
- 🔄 Mark for retest if needs validation again

**Failure Threshold:** If more than 5 critical items fail, initiate rollback procedure.

**Estimated Time:** 45-60 minutes

---

## Section 1: Functional Testing (40 checks)

### 1.1 Application Accessibility (5 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 1 | Navigate to https://dev353895.service-now.com | ☐ | | Response time < 2s |
| 2 | Login with admin credentials | ☐ | | Authentication succeeds |
| 3 | Access Planning Poker app (direct URL) | ☐ | | /x_902080_ppoker loads |
| 4 | Access via Application Navigator | ☐ | | Search "Planning Poker" |
| 5 | Application loads without errors | ☐ | | No 404, 500 errors |

**Critical Items:** All 5
**Sign-off:** _________ Time: _________

---

### 1.2 User Interface Rendering (8 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 6 | Header displays "🃏 Planning Poker" | ☐ | | Text visible |
| 7 | "Create New Session" button visible | ☐ | | Primary action |
| 8 | "📊 Analytics" button visible | ☐ | | Secondary action |
| 9 | Session list container renders | ☐ | | Empty or with sessions |
| 10 | No JavaScript console errors (F12) | ☐ | | 0 red errors |
| 11 | CSS styles applied correctly | ☐ | | Layout proper |
| 12 | Images/icons load properly | ☐ | | No broken images |
| 13 | Responsive design works | ☐ | | Resize browser |

**Critical Items:** 6, 10
**Sign-off:** _________ Time: _________

---

### 1.3 Session Creation (8 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 14 | Click "Create New Session" opens form | ☐ | | Modal/page appears |
| 15 | Form displays all required fields | ☐ | | Name, description, status |
| 16 | Session code auto-generates | ☐ | | 6-character alphanumeric |
| 17 | Fill form with test data | ☐ | | Name: "Production Test Session" |
| 18 | Click "Create Session" submits form | ☐ | | No errors |
| 19 | Modal/form closes after creation | ☐ | | Returns to list |
| 20 | New session appears in session list | ☐ | | Within 2 seconds |
| 21 | Session has correct data | ☐ | | Name, code, status match |

**Test Data:**
```
Name: Production Test Session 1
Description: Post-deployment verification test
Status: Active
```

**Critical Items:** 18, 19, 20
**Sign-off:** _________ Time: _________

---

### 1.4 Session Management (6 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 22 | Click on session opens dashboard | ☐ | | Navigation works |
| 23 | Session dashboard displays session info | ☐ | | Name, code, status |
| 24 | "Back" or navigation to list works | ☐ | | Can return to list |
| 25 | Edit session (if applicable) | ☐ | | Update description |
| 26 | Changes save successfully | ☐ | | Updates reflected |
| 27 | Session list refreshes with changes | ☐ | | Updated data shown |

**Critical Items:** 22, 23
**Sign-off:** _________ Time: _________

---

### 1.5 Story Management (6 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 28 | Navigate to session dashboard | ☐ | | From previous tests |
| 29 | "Add Story" button/section visible | ☐ | | Story management UI |
| 30 | Click "Add Story" opens form | ☐ | | Modal or inline form |
| 31 | Fill story details and save | ☐ | | Title: "Test Story 1" |
| 32 | Story appears in story list | ☐ | | Immediately visible |
| 33 | Story has correct sequence/order | ☐ | | #1 or ordered |

**Test Data:**
```
Title: Test User Story 1
Description: Verify story creation functionality
Sequence: 1
```

**Critical Items:** 31, 32
**Sign-off:** _________ Time: _________

---

### 1.6 Voting Interface (7 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 34 | Click on story to start voting | ☐ | | Voting UI appears |
| 35 | T-shirt sizing cards display | ☐ | | XS, S, M, L, XL, XXL, ?, ☕ |
| 36 | Cards are color-coded | ☐ | | Different colors visible |
| 37 | Click card selects it | ☐ | | Visual feedback |
| 38 | Submit vote button appears | ☐ | | After card selection |
| 39 | Click submit saves vote | ☐ | | No errors |
| 40 | Vote confirmation shown | ☐ | | "Vote submitted" message |

**Critical Items:** 35, 39, 40
**Sign-off:** _________ Time: _________

---

## Section 2: Integration Testing (20 checks)

### 2.1 Database Operations (8 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 41 | Open ServiceNow: System Definition > Tables | ☐ | | Admin access |
| 42 | Search for "x_902080_ppoker" | ☐ | | 4 tables appear |
| 43 | Table: x_902080_ppoker_session exists | ☐ | | Click to open |
| 44 | Table has correct columns (12 columns) | ☐ | | Verify schema |
| 45 | Test session record exists | ☐ | | Created in tests |
| 46 | Table: x_902080_ppoker_session_stories exists | ☐ | | Check exists |
| 47 | Test story record exists | ☐ | | Created in tests |
| 48 | Table: x_902080_ppoker_vote exists | ☐ | | Check exists |

**Critical Items:** 43, 44, 45
**Sign-off:** _________ Time: _________

---

### 2.2 Script Include Verification (4 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 49 | Navigate to: System Definition > Script Includes | ☐ | | Admin access |
| 50 | Search: "PlanningPokerSessionAjax" | ☐ | | Should find 1 |
| 51 | Script Include is Active | ☐ | | Active checkbox checked |
| 52 | Script Include is Client Callable | ☐ | | Client callable checked |

**Critical Items:** 49, 51, 52
**Sign-off:** _________ Time: _________

---

### 2.3 Business Rule Verification (4 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 53 | Navigate to: System Definition > Business Rules | ☐ | | Admin access |
| 54 | Search: "session-defaults" | ☐ | | Should find 1 |
| 55 | Business Rule is Active | ☐ | | Active checkbox |
| 56 | Business Rule table: x_902080_ppoker_session | ☐ | | Correct table |

**Critical Items:** 53, 55
**Sign-off:** _________ Time: _________

---

### 2.4 REST API Integration (4 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 57 | Open Browser DevTools (F12) > Network tab | ☐ | | Monitor API calls |
| 58 | Create new session (from UI) | ☐ | | Watch network |
| 59 | Verify POST to /api/now/table/x_902080_ppoker_session | ☐ | | Status 201 Created |
| 60 | Verify response contains session data | ☐ | | JSON response |

**Critical Items:** 59, 60
**Sign-off:** _________ Time: _________

---

## Section 3: Performance Testing (15 checks)

### 3.1 Load Time Metrics (5 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 61 | Clear browser cache | ☐ | | Hard refresh (Ctrl+Shift+R) |
| 62 | Open DevTools > Network tab | ☐ | | Monitor timing |
| 63 | Load application fresh | ☐ | | Navigate to app URL |
| 64 | Measure initial load time | ☐ | | Target: < 3 seconds |
| 65 | Verify app.js loads | ☐ | | ~614 KB, status 200 |

**Measured Metrics:**
```
Initial Load: _____ seconds (Target: < 3s)
app.js Load: _____ seconds (Target: < 2s)
Time to Interactive: _____ seconds (Target: < 4s)
```

**Critical Items:** 64 (must be < 5s)
**Sign-off:** _________ Time: _________

---

### 3.2 Browser Performance (5 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 66 | Open DevTools > Console | ☐ | | Check for errors |
| 67 | Zero JavaScript errors | ☐ | | No red errors |
| 68 | Warnings are acceptable/documented | ☐ | | React DevTools warnings OK |
| 69 | Open DevTools > Performance tab | ☐ | | Record performance |
| 70 | No frame drops during interaction | ☐ | | Smooth 60fps |

**Console Errors:** _____ (Target: 0 errors)
**Warnings:** _____ (Acceptable: < 10)

**Critical Items:** 67
**Sign-off:** _________ Time: _________

---

### 3.3 Memory & Resource Usage (5 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 71 | Open DevTools > Memory tab | ☐ | | Take heap snapshot |
| 72 | Application memory < 150 MB | ☐ | | Check Task Manager |
| 73 | No memory leaks detected | ☐ | | Heap stable over 5 min |
| 74 | CPU usage < 50% during interaction | ☐ | | Check Task Manager |
| 75 | Network requests complete successfully | ☐ | | No failed requests |

**Measured Resources:**
```
Memory Usage: _____ MB (Target: < 150 MB)
CPU Usage: _____% (Target: < 50%)
Failed Requests: _____ (Target: 0)
```

**Critical Items:** 72, 75
**Sign-off:** _________ Time: _________

---

## Section 4: Security Validation (15 checks)

### 4.1 Authentication & Authorization (5 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 76 | Application requires login | ☐ | | No anonymous access |
| 77 | CSRF token present (window.g_ck) | ☐ | | Console: window.g_ck |
| 78 | API calls include X-UserToken header | ☐ | | Check Network tab |
| 79 | Session timeout works | ☐ | | After inactivity |
| 80 | Re-login redirects properly | ☐ | | After timeout |

**CSRF Token Check:**
```javascript
// Browser Console:
console.log('CSRF Token:', window.g_ck);
// Should output: [32-character string]
```

**Critical Items:** 76, 77, 78
**Sign-off:** _________ Time: _________

---

### 4.2 Data Security (5 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 81 | HTTPS enforced (not HTTP) | ☐ | | Check URL bar |
| 82 | No credentials in console logs | ☐ | | Review console output |
| 83 | No credentials in network requests | ☐ | | Check request bodies |
| 84 | No SQL injection possible | ☐ | | Try: ' OR '1'='1 |
| 85 | No XSS vulnerabilities | ☐ | | Try: <script>alert(1)</script> |

**Security Tests:**
```
SQL Injection: Create session with name: ' OR '1'='1
Expected: Sanitized or rejected

XSS Test: Create session with name: <script>alert(1)</script>
Expected: Script not executed
```

**Critical Items:** 81, 82, 84, 85
**Sign-off:** _________ Time: _________

---

### 4.3 Access Control (5 checks)

| # | Verification | Status | Result | Notes |
|---|-------------|--------|--------|-------|
| 86 | Table ACLs exist (if implemented) | ☐ | | Check ACL list |
| 87 | Users cannot access other users' data (if applicable) | ☐ | | Test with 2 accounts |
| 88 | Dealer controls work correctly | ☐ | | Only dealer can reveal |
| 89 | Voting restricted during non-voting status | ☐ | | Story status check |
| 90 | Admin can access all sessions | ☐ | | Admin privilege |

**Note:** ACL implementation may be Phase 1 post-deployment. Verify current status.

**Critical Items:** None (if Phase 1 post-deployment)
**Sign-off:** _________ Time: _________

---

## Section 5: User Acceptance Criteria (10 checks)

### 5.1 Core Functionality (10 checks)

| # | Acceptance Criteria | Status | Result | Notes |
|---|---------------------|--------|--------|-------|
| 91 | User can create a planning session | ☐ | | End-to-end test |
| 92 | User can join session via session code | ☐ | | Enter 6-char code |
| 93 | User can add stories to session | ☐ | | Multiple stories |
| 94 | User can vote on stories using T-shirt sizes | ☐ | | XS through XXL |
| 95 | Dealer can reveal votes | ☐ | | Dealer control |
| 96 | System detects consensus correctly | ☐ | | All same = consensus |
| 97 | Analytics dashboard shows data | ☐ | | Charts render |
| 98 | Session code sharing works | ☐ | | Unique codes |
| 99 | Application is mobile responsive | ☐ | | Test on mobile view |
| 100 | No critical bugs (P0/P1 severity) | ☐ | | Bug review |

**User Acceptance Test Scenario:**
```
1. Admin creates session "UAT Test Session"
2. Note session code (e.g., ABC123)
3. Open incognito window
4. Join session with code
5. Add story "Test Story UAT"
6. Vote with size "M"
7. Dealer reveals votes
8. Verify consensus or stats shown
9. Navigate to Analytics
10. Verify session appears in analytics
```

**Critical Items:** All 10
**Sign-off:** _________ Time: _________

---

## Section 6: Sign-off Template

### Deployment Verification Summary

**Deployment Date:** _________
**Deployment Time:** _________
**Verification Completed:** _________ (Date/Time)
**Verification Duration:** _________ minutes

---

### Results Summary

| Category | Total | Passed | Failed | Warning | Pass Rate |
|----------|-------|--------|--------|---------|-----------|
| Functional Testing | 40 | _____ | _____ | _____ | ____% |
| Integration Testing | 20 | _____ | _____ | _____ | ____% |
| Performance Testing | 15 | _____ | _____ | _____ | ____% |
| Security Validation | 15 | _____ | _____ | _____ | ____% |
| User Acceptance | 10 | _____ | _____ | _____ | ____% |
| **TOTAL** | **100** | **_____** | **_____** | **_____** | **____%** |

**Overall Pass Rate:** _____% (Target: ≥ 95%)

---

### Critical Issues Found

| # | Issue Description | Severity | Status | Resolution |
|---|-------------------|----------|--------|------------|
| 1 | | ☐ P0 ☐ P1 ☐ P2 | ☐ Open ☐ Fixed | |
| 2 | | ☐ P0 ☐ P1 ☐ P2 | ☐ Open ☐ Fixed | |
| 3 | | ☐ P0 ☐ P1 ☐ P2 | ☐ Open ☐ Fixed | |

**P0 Issues:** _____ (Must be 0 for sign-off)
**P1 Issues:** _____ (Must be < 3 for sign-off)
**P2 Issues:** _____ (Acceptable: < 10)

---

### Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Initial Load Time | < 3s | _____ s | ☐ Pass ☐ Fail |
| Time to Interactive | < 4s | _____ s | ☐ Pass ☐ Fail |
| Bundle Size | < 650 KB | _____ KB | ☐ Pass ☐ Fail |
| Memory Usage | < 150 MB | _____ MB | ☐ Pass ☐ Fail |
| Console Errors | 0 | _____ | ☐ Pass ☐ Fail |
| Failed API Calls | 0 | _____ | ☐ Pass ☐ Fail |

**All Metrics Pass:** ☐ Yes ☐ No

---

### Security Status

| Security Check | Status | Notes |
|----------------|--------|-------|
| HTTPS Enforced | ☐ Pass ☐ Fail | |
| CSRF Protection | ☐ Pass ☐ Fail | |
| Authentication | ☐ Pass ☐ Fail | |
| No XSS Vulnerabilities | ☐ Pass ☐ Fail | |
| No SQL Injection | ☐ Pass ☐ Fail | |
| No Exposed Credentials | ☐ Pass ☐ Fail | |

**All Security Checks Pass:** ☐ Yes ☐ No

---

### Deployment Decision

Based on verification results:

**Deployment Status:** ☐ APPROVED ☐ APPROVED WITH CONDITIONS ☐ REJECTED

**If APPROVED WITH CONDITIONS, list conditions:**
1. _________________________________
2. _________________________________
3. _________________________________

**If REJECTED, reason:**
_________________________________________________________________

**Rollback Required:** ☐ Yes ☐ No

**If Yes, rollback initiated at:** _________

---

### Sign-off Approval

**Required Signatures:**

| Role | Name | Status | Signature | Date |
|------|------|--------|-----------|------|
| QA Lead | | ☐ Approve ☐ Reject | | |
| Deployment Lead | | ☐ Approve ☐ Reject | | |
| Technical Lead | | ☐ Approve ☐ Reject | | |
| Product Owner | | ☐ Approve ☐ Reject | | |

**All Approvals Required:** ☐ Yes (4/4)

---

### Next Steps

**If APPROVED:**
- [ ] Close deployment window
- [ ] Send success notification to stakeholders
- [ ] Enable 24-hour monitoring
- [ ] Schedule post-deployment review
- [ ] Update documentation
- [ ] Archive deployment logs

**If APPROVED WITH CONDITIONS:**
- [ ] Document conditions
- [ ] Schedule follow-up tasks
- [ ] Notify stakeholders of conditions
- [ ] Set deadline for condition resolution
- [ ] Plan verification for conditions

**If REJECTED:**
- [ ] Initiate rollback procedure (see PRODUCTION_DEPLOYMENT_RUNBOOK.md)
- [ ] Document failure reasons
- [ ] Notify all stakeholders immediately
- [ ] Schedule root cause analysis
- [ ] Plan remediation and redeployment

---

## Appendix A: Detailed Test Scenarios

### Scenario 1: Complete Session Workflow

**Objective:** Verify end-to-end session creation, voting, and completion.

**Steps:**
1. Login as Admin
2. Create new session:
   - Name: "Complete Workflow Test"
   - Description: "End-to-end verification"
   - Status: Active
3. Note session code (e.g., XYZ789)
4. Add 3 stories:
   - Story 1: "User Authentication"
   - Story 2: "Data Visualization"
   - Story 3: "Mobile Responsiveness"
5. For each story:
   - Click to start voting
   - Select T-shirt size (S, M, L respectively)
   - Submit vote
   - Verify vote saved
6. Dealer reveals votes for Story 1
7. Verify vote display correct
8. Check consensus detection
9. Set final estimate
10. Complete session

**Expected Results:**
- All steps complete without errors
- Votes saved correctly
- Consensus detected accurately
- Session completes successfully

**Actual Results:** _________________________________

**Status:** ☐ Pass ☐ Fail

---

### Scenario 2: Multiple User Collaboration (If Possible)

**Objective:** Test multi-user voting and consensus.

**Prerequisites:** 2 user accounts (Admin + User1)

**Steps:**
1. Admin creates session "Multi-User Test"
2. Admin adds story "Collaboration Test"
3. Admin shares session code with User1
4. User1 joins session via code
5. Admin votes "M" on story
6. User1 votes "M" on story
7. Dealer (Admin) reveals votes
8. Verify both votes shown
9. Verify consensus achieved (both "M")

**Expected Results:**
- User1 joins successfully
- Both votes recorded
- Consensus detected
- Vote display shows both users

**Actual Results:** _________________________________

**Status:** ☐ Pass ☐ Fail ☐ N/A (single user test)

---

### Scenario 3: Analytics Verification

**Objective:** Verify analytics dashboard functionality.

**Steps:**
1. Complete Scenario 1 (creates data)
2. Navigate to Analytics dashboard
3. Verify metrics displayed:
   - Total sessions: ≥ 1
   - Total stories: ≥ 3
   - Consensus rate: calculated
4. Verify charts render:
   - Velocity chart
   - Consensus chart
5. Change date filter (e.g., Last 7 days)
6. Verify data updates

**Expected Results:**
- Dashboard loads without errors
- Metrics accurate
- Charts render correctly
- Filters work

**Actual Results:** _________________________________

**Status:** ☐ Pass ☐ Fail

---

### Scenario 4: Mobile Responsiveness

**Objective:** Verify mobile/tablet compatibility.

**Steps:**
1. Open Chrome DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro (390x844)
4. Refresh application
5. Verify layout responsive
6. Test session creation on mobile
7. Test voting on mobile
8. Switch to Tablet: iPad (768x1024)
9. Verify layout adapts
10. Test core functionality

**Expected Results:**
- Layout responsive on all sizes
- Buttons accessible
- Text readable
- No horizontal scroll
- Functionality works

**Actual Results:** _________________________________

**Status:** ☐ Pass ☐ Fail

---

### Scenario 5: Error Handling

**Objective:** Verify graceful error handling.

**Steps:**
1. Attempt to create session with empty name
   - Expected: Validation error shown
2. Attempt to join session with invalid code "000000"
   - Expected: "Session not found" error
3. Attempt to vote without selecting card
   - Expected: "Please select an estimate" error
4. Disconnect internet temporarily
5. Attempt to create session
   - Expected: Network error shown
6. Reconnect internet
7. Retry operation
   - Expected: Succeeds

**Expected Results:**
- All error messages clear and helpful
- No application crashes
- Recovery possible

**Actual Results:** _________________________________

**Status:** ☐ Pass ☐ Fail

---

## Appendix B: Performance Baseline Recording

### Initial Deployment Metrics (Record for Future Comparison)

**Date/Time:** _________

**Load Performance:**
```
Initial Load: _____ ms
First Contentful Paint: _____ ms
Largest Contentful Paint: _____ ms
Time to Interactive: _____ ms
Total Blocking Time: _____ ms
Cumulative Layout Shift: _____
Speed Index: _____
```

**Resource Metrics:**
```
Bundle Size (app.js): _____ KB
Source Map Size: _____ MB
HTML Size: _____ bytes
Total Page Size: _____ KB
Number of Requests: _____
```

**Runtime Metrics:**
```
Memory Usage (Initial): _____ MB
Memory Usage (After 5 min): _____ MB
CPU Usage (Idle): _____%
CPU Usage (Active): _____%
```

**API Performance:**
```
Session Create: _____ ms
Session List: _____ ms
Story Create: _____ ms
Vote Submit: _____ ms
Analytics Load: _____ ms
```

**Browser Compatibility:**
```
Chrome: ☐ Tested, Version: _____
Firefox: ☐ Tested, Version: _____
Safari: ☐ Tested, Version: _____
Edge: ☐ Tested, Version: _____
```

---

## Appendix C: Issue Tracking Template

**Issue #:** _____
**Reported By:** _________
**Date/Time:** _________

**Issue Description:**
_________________________________________________________________

**Steps to Reproduce:**
1. _________________________________
2. _________________________________
3. _________________________________

**Expected Behavior:**
_________________________________________________________________

**Actual Behavior:**
_________________________________________________________________

**Severity:** ☐ P0 (Critical) ☐ P1 (High) ☐ P2 (Medium) ☐ P3 (Low)

**Impact:** ☐ Blocks deployment ☐ Requires fix before go-live ☐ Can defer

**Environment:**
- Browser: _________
- OS: _________
- Device: _________

**Screenshots/Logs:**
_________________________________________________________________

**Resolution:**
_________________________________________________________________

**Resolved By:** _________
**Resolution Date:** _________

**Verification:**
☐ Issue fixed
☐ Retested
☐ Verified by QA
☐ Sign-off obtained

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-05 | Build & Deployment Agent | Initial creation |

**Review Schedule:**
- Update after each deployment
- Review quarterly
- Update with new test scenarios as needed

**Distribution:**
- Deployment team (all members)
- QA team
- Technical leads
- Product owners

---

**END OF DEPLOYMENT VERIFICATION CHECKLIST**

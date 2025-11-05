# Production Deployment Runbook
## Planning Poker Fluent Application

**Version:** 1.0
**Last Updated:** November 5, 2025
**Application:** Planning Poker for ServiceNow
**Scope:** x_902080_ppoker
**Instance:** dev353895.service-now.com → Production

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Phase](#pre-deployment-phase)
3. [Deployment Phase](#deployment-phase)
4. [Post-Deployment Phase](#post-deployment-phase)
5. [Rollback Procedures](#rollback-procedures)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Emergency Contacts](#emergency-contacts)

---

## Overview

### Purpose
This runbook provides step-by-step instructions for deploying the Planning Poker Fluent application to production ServiceNow environment.

### Deployment Method
**CRITICAL:** Deployment MUST be executed from a local machine with GUI/display. NowSDK requires D-Bus/X11 for credential storage and cannot run in headless environments (Codespaces, Docker, CI/CD).

### Application Components
- **Frontend:** React 19.x TypeScript application (614 KB bundle)
- **Backend:** ServiceNow Fluent API (4 tables, 1 Script Include, 1 Business Rule)
- **Build Output:** `dist/static/` directory
- **Deployment Tool:** NowSDK 4.0.2

### Key Metrics
- **Build Size:** 614 KB (main.jsdbx)
- **Source Map:** 4.3 MB (main.jsdbx.map)
- **Build Time:** ~5-10 seconds
- **Deployment Time:** ~2-3 minutes
- **Expected Downtime:** Zero (new tables, no data migration)

---

## Pre-Deployment Phase

**Estimated Time:** 2-3 hours
**Responsible:** Build & Deployment Agent + Coordinator Agent
**Sign-off Required:** YES

### A. Environment Verification (30 minutes)

#### 1. Local Machine Requirements
```bash
# Verify local environment
node --version      # Should be 18+ or 20+
npm --version       # Should be 9+ or 10+
git --version       # Any recent version

# Verify GUI/Display available
echo $DISPLAY       # Linux: Should show :0 or similar
# macOS/Windows: Always available (skip this check)

# Verify ServiceNow CLI installed
npx now-sdk --version  # Should show 4.0.2
```

**✅ Checklist:**
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Git installed and configured
- [ ] GUI/display available (not headless)
- [ ] NowSDK 4.0.2 available
- [ ] Minimum 2 GB free disk space
- [ ] Stable internet connection

---

#### 2. Code Repository Verification (15 minutes)

```bash
# Clone/update repository on local machine
cd ~/projects
git clone <repository-url> planningpokerfluent
cd planningpokerfluent

# Verify current branch and commit
git branch --show-current    # Should show: main or production
git log --oneline -5         # Review recent commits
git status                   # Should be clean (no uncommitted changes)

# Verify latest changes pulled
git fetch origin
git diff origin/main         # Should show no differences
```

**✅ Checklist:**
- [ ] Repository cloned to local machine
- [ ] On correct branch (main or production)
- [ ] Latest commits pulled from remote
- [ ] No uncommitted changes
- [ ] No merge conflicts
- [ ] Branch is up-to-date with origin

---

#### 3. Dependency Verification (10 minutes)

```bash
# Install dependencies
npm ci   # Use 'ci' for clean install (preferred)
# OR
npm install

# Verify critical dependencies
npm ls react        # Should show 19.x
npm ls react-dom    # Should show 19.x
npm ls typescript   # Should show 5.5.4
npm ls @servicenow/sdk  # Should show 4.0.2

# Check for vulnerabilities
npm audit
# Expected: 0 critical, 0 high vulnerabilities
# If vulnerabilities found: Review and fix before proceeding
```

**✅ Checklist:**
- [ ] All dependencies installed successfully
- [ ] React 19.x present
- [ ] TypeScript 5.5.4 present
- [ ] NowSDK 4.0.2 present
- [ ] No critical security vulnerabilities
- [ ] No high severity vulnerabilities
- [ ] node_modules/ directory created (~500 MB)

---

#### 4. Code Quality Verification (20 minutes)

```bash
# Run type checking
npm run type-check
# Expected: No errors
# Known issue: 1 warning in serviceUtils.ts (NodeJS.Timeout) - safe to ignore

# Run linting (errors only)
npm run lint:errors-only
# Expected: No errors
# Note: 224 pre-existing warnings are acceptable

# Run full quality check
npm run check-all
# Expected: Both lint and build succeed
```

**✅ Checklist:**
- [ ] Type checking passes (0 errors)
- [ ] Linting passes (0 errors, warnings OK)
- [ ] `npm run check-all` succeeds
- [ ] No new TypeScript errors introduced
- [ ] No new ESLint errors introduced

**Expected Output:**
```
> npm run type-check
✓ Type checking completed successfully

> npm run lint:errors-only
✓ No linting errors found

> npm run check-all
✓ Linting passed
✓ Build succeeded
```

---

### B. Build Verification (20 minutes)

#### 1. Clean Build

```bash
# Remove previous build artifacts
rm -rf dist/ build/

# Build application
npm run build

# Verify build output
ls -lh dist/static/
# Expected files:
# - app.js (614 KB)
# - app.js.map (4.3 MB)
# - index.html (325 bytes)
```

**✅ Checklist:**
- [ ] Build completed without errors
- [ ] `dist/static/app.js` exists (~614 KB)
- [ ] `dist/static/app.js.map` exists (~4.3 MB)
- [ ] `dist/static/index.html` exists
- [ ] Build time < 15 seconds
- [ ] No error messages in console

**Expected Output:**
```
> npm run build

[now-sdk] Building application...
[now-sdk] Compiling TypeScript...
[now-sdk] Bundling React application...
[now-sdk] Processing Fluent definitions...
[now-sdk] ✓ Build completed successfully

Build artifacts:
  dist/static/app.js (614 KB)
  dist/static/app.js.map (4.3 MB)
  dist/static/index.html (325 B)

Total build time: 8.2s
```

---

#### 2. Build Validation

```bash
# Verify bundle integrity
file dist/static/app.js
# Expected: JavaScript source, UTF-8 Unicode text

# Check for common issues
grep -q "React" dist/static/app.js && echo "✓ React included"
grep -q "ServiceNow" dist/static/app.js && echo "✓ ServiceNow integration present"

# Verify HTML entry point
cat dist/static/index.html | grep -q "app.js" && echo "✓ HTML references bundle"
```

**✅ Checklist:**
- [ ] Bundle is valid JavaScript
- [ ] React library included
- [ ] ServiceNow integration code present
- [ ] HTML correctly references app.js
- [ ] No obvious syntax errors in bundle

---

### C. Credential Setup & Authentication (15 minutes)

#### 1. ServiceNow Instance Access

**Manual Verification:**
1. Open browser
2. Navigate to: https://dev353895.service-now.com
3. Login with admin credentials
4. Verify access to:
   - System Applications menu
   - Studio (if available)
   - Tables module
   - Script Includes

**✅ Checklist:**
- [ ] Can access ServiceNow instance
- [ ] Admin credentials valid
- [ ] Instance is responsive
- [ ] No system maintenance scheduled

---

#### 2. NowSDK Authentication

```bash
# CRITICAL: This MUST be done on local machine (NOT Codespaces)

# Authenticate with ServiceNow instance
npx now-sdk auth

# Follow OAuth flow:
# 1. Browser window will open
# 2. Login to ServiceNow
# 3. Authorize the application
# 4. Return to terminal

# Expected output:
# [now-sdk] Opening browser for authentication...
# [now-sdk] Successfully authenticated to instance https://dev353895.service-now.com
# [now-sdk] Storing credentials for instance...
# [now-sdk] ✓ Credentials stored successfully

# Verify authentication
npx now-sdk auth --list
# Should show: dev353895.service-now.com (authenticated)
```

**✅ Checklist:**
- [ ] OAuth flow completed successfully
- [ ] Credentials stored in system keychain
- [ ] No "D-Bus" or "X11" errors (indicates local machine)
- [ ] Instance shows as authenticated
- [ ] Can execute now-sdk commands

**⚠️ TROUBLESHOOTING:**
If you see `ERROR: Cannot autolaunch D-Bus without X11 $DISPLAY`:
- You are in a headless environment (Codespaces, Docker, etc.)
- **SOLUTION:** Switch to local machine with GUI
- This error is **FATAL** for deployment

---

### D. Backup Procedures (30 minutes)

#### 1. Database Backup

**ServiceNow UI Method:**
1. Login to ServiceNow instance as admin
2. Navigate to: **System Definition > Tables**
3. Export current table definitions:
   - Search: `x_902080_ppoker`
   - Select all application tables
   - Right-click > Export to XML
4. Save XML to: `backups/pre-deployment-YYYYMMDD.xml`

**Alternative - API Method:**
```bash
# Create backup directory
mkdir -p backups/$(date +%Y%m%d)

# Export current application state (if NowSDK supports)
npx now-sdk export --scope x_902080_ppoker \
  --output backups/$(date +%Y%m%d)/app-backup.xml
```

**✅ Checklist:**
- [ ] All tables backed up
- [ ] Script Includes backed up
- [ ] Business Rules backed up
- [ ] UI Pages backed up
- [ ] Backup file saved securely
- [ ] Backup file size verified (> 0 bytes)
- [ ] Backup timestamp recorded

---

#### 2. Code Backup

```bash
# Tag current commit
git tag -a v1.0.0-pre-deploy -m "Pre-deployment snapshot $(date)"
git push origin v1.0.0-pre-deploy

# Create code backup
git archive --format=zip --output=backups/code-backup-$(date +%Y%m%d).zip HEAD

# Verify backup
ls -lh backups/code-backup-*.zip
```

**✅ Checklist:**
- [ ] Git tag created
- [ ] Tag pushed to remote
- [ ] Code archive created
- [ ] Backup verified (> 0 bytes)
- [ ] Backup stored in safe location

---

### E. Communication Plan (15 minutes)

#### 1. Stakeholder Notification

**Email Template:**
```
Subject: [SCHEDULED] Planning Poker Deployment - [DATE/TIME]

Dear Stakeholders,

This email confirms the scheduled deployment of the Planning Poker application to production.

DEPLOYMENT DETAILS:
- Date: [YYYY-MM-DD]
- Time: [HH:MM timezone]
- Duration: ~15-20 minutes
- Expected Downtime: None (new application)
- Rollback Window: 1 hour

WHAT'S CHANGING:
- New Planning Poker application deployed
- 4 new database tables created
- 1 Script Include added
- 1 Business Rule added
- React frontend application

WHAT TO EXPECT:
- Application will be available after deployment
- Users can create planning sessions
- Users can join sessions via session code
- Voting and analytics features available

ROLLBACK PLAN:
If issues arise, we will rollback within 1 hour.

SUPPORT:
Contact [deployment-team@company.com] for issues.

Thank you,
Deployment Team
```

**✅ Checklist:**
- [ ] Stakeholders notified (email sent)
- [ ] Deployment window confirmed
- [ ] Support contacts shared
- [ ] Rollback plan communicated
- [ ] Confirmation received from key stakeholders

---

#### 2. Team Coordination

**Slack/Teams Message Template:**
```
🚀 DEPLOYMENT STARTING: Planning Poker Application
────────────────────────────────────────────────
📅 Date: [YYYY-MM-DD]
⏰ Time: [HH:MM timezone]
⏱️ Duration: ~15-20 minutes

👥 Team Roles:
- Deployment Lead: [Name]
- Build Agent: [Name]
- QA Tester: [Name]
- Rollback Authority: [Name]

📋 Checklist:
✅ Pre-deployment checks completed
⏳ Awaiting deployment execution
⬜ Post-deployment validation
⬜ Sign-off

📞 Emergency Contact: [Phone/Slack]

Stay tuned for updates...
```

**✅ Checklist:**
- [ ] Team notified via Slack/Teams
- [ ] Roles and responsibilities confirmed
- [ ] Communication channel established
- [ ] Emergency contacts shared
- [ ] All team members acknowledged

---

### F. Pre-Deployment Checklist Summary

**FINAL GO/NO-GO DECISION**

**Technical Readiness:**
- [ ] Local machine ready (Node.js, npm, git)
- [ ] Repository cloned and updated
- [ ] Dependencies installed (npm ci)
- [ ] Code quality checks passed
- [ ] Build successful (614 KB bundle)
- [ ] Authentication successful (NowSDK)
- [ ] ServiceNow instance accessible

**Documentation & Planning:**
- [ ] Backups completed (database + code)
- [ ] Rollback plan documented
- [ ] Communication sent to stakeholders
- [ ] Team roles assigned
- [ ] Emergency contacts confirmed

**Security & Compliance:**
- [ ] Security audit reviewed (SECURITY_AUDIT_REPORT.md)
- [ ] ACL implementation plan ready (Phase 1 post-deployment)
- [ ] No critical vulnerabilities in dependencies
- [ ] Admin credentials secured

**Sign-off:**
- [ ] Deployment Lead: _________________ Date: _______
- [ ] Technical Lead: __________________ Date: _______
- [ ] QA Lead: _______________________ Date: _______

**GO / NO-GO:** __________

**If NO-GO:** Document reason and reschedule.

---

## Deployment Phase

**Estimated Time:** 15-20 minutes
**Responsible:** Build & Deployment Agent
**Monitoring:** Coordinator Agent

### A. Deployment Execution

#### Step 1: Final Verification (2 minutes)

```bash
# Verify you're on local machine (NOT Codespaces)
echo $HOSTNAME
# Should NOT show: codespaces-*

# Verify authentication
npx now-sdk auth --list
# Should show: dev353895.service-now.com (authenticated)

# Verify build artifacts exist
ls -lh dist/static/
# Should show app.js, app.js.map, index.html

# Verify working directory
pwd
# Should show: /path/to/planningpokerfluent
```

**✅ Pre-Flight Checklist:**
- [ ] On local machine (confirmed)
- [ ] Authenticated to ServiceNow
- [ ] Build artifacts present
- [ ] In correct directory
- [ ] Internet connection stable

---

#### Step 2: Deployment Command (3-5 minutes)

```bash
# CRITICAL: Execute deployment
npm run deploy

# This runs: now-sdk install
# Watch for output messages...
```

**Expected Output:**
```
> npm run deploy

[now-sdk] Starting deployment to dev353895.service-now.com...
[now-sdk] Uploading application artifacts...
[now-sdk]   ✓ Uploaded dist/static/app.js (614 KB)
[now-sdk]   ✓ Uploaded dist/static/app.js.map (4.3 MB)
[now-sdk]   ✓ Uploaded dist/static/index.html (325 B)
[now-sdk] Creating/updating tables...
[now-sdk]   ✓ Created table: x_902080_ppoker_session
[now-sdk]   ✓ Created table: x_902080_ppoker_session_stories
[now-sdk]   ✓ Created table: x_902080_ppoker_vote
[now-sdk]   ✓ Created table: x_902080_ppoker_session_participant
[now-sdk] Creating/updating Script Includes...
[now-sdk]   ✓ Created: PlanningPokerSessionAjax
[now-sdk] Creating/updating Business Rules...
[now-sdk]   ✓ Created: session-defaults
[now-sdk] Creating/updating UI Pages...
[now-sdk]   ✓ Created: planning-poker-app
[now-sdk] Activating application scope...
[now-sdk]   ✓ Scope activated: x_902080_ppoker
[now-sdk]
[now-sdk] ✅ Deployment completed successfully!
[now-sdk]
[now-sdk] Application URL: https://dev353895.service-now.com/x_902080_ppoker
[now-sdk]
[now-sdk] Deployment summary:
[now-sdk]   - Tables created: 4
[now-sdk]   - Script Includes: 1
[now-sdk]   - Business Rules: 1
[now-sdk]   - UI Pages: 1
[now-sdk]   - Static files: 3
[now-sdk]
[now-sdk] Total deployment time: 3m 24s
```

**⏱️ Timing Checkpoints:**
- **0:00-0:30** - Authentication & connection
- **0:30-2:00** - File upload (app.js, source map, HTML)
- **2:00-3:00** - Table creation (4 tables)
- **3:00-3:30** - Script Include & Business Rule creation
- **3:30-4:00** - Scope activation & finalization

---

#### Step 3: Deployment Verification (2 minutes)

**Immediate Checks:**
```bash
# Verify deployment success
echo $?
# Should output: 0 (success)

# Check for error messages
# Review terminal output for any "ERROR" or "FAILED" messages
```

**✅ Success Criteria:**
- [ ] No error messages in output
- [ ] All files uploaded successfully
- [ ] All tables created (4/4)
- [ ] Script Include created (1/1)
- [ ] Business Rule created (1/1)
- [ ] UI Page created (1/1)
- [ ] Application URL provided
- [ ] Exit code 0 (success)

**❌ Rollback Triggers:**
- Any file upload failure
- Table creation errors
- Script Include errors
- Authentication failures
- Timeout errors
- Exit code non-zero

---

### B. Deployment Monitoring

**Real-time Monitoring (during deployment):**

1. **Terminal Output:** Watch for progress messages
2. **Browser Tab:** Keep ServiceNow instance open
3. **Network Stability:** Monitor internet connection
4. **Time Tracking:** Note actual vs. expected time

**📊 Deployment Log Template:**
```
DEPLOYMENT LOG - Planning Poker Production
═══════════════════════════════════════════

Date: [YYYY-MM-DD]
Time Started: [HH:MM:SS]
Deployment Lead: [Name]

Timeline:
[HH:MM:SS] - Pre-flight checks completed
[HH:MM:SS] - npm run deploy executed
[HH:MM:SS] - File upload started
[HH:MM:SS] - Table creation started
[HH:MM:SS] - Script Include creation completed
[HH:MM:SS] - Deployment completed
[HH:MM:SS] - Verification started

Total Duration: [MM:SS]

Status: [SUCCESS / FAILED / ROLLED BACK]

Notes:
- [Any observations or issues]
- [Performance notes]
- [Unexpected behaviors]
```

---

### C. Error Handling During Deployment

#### Common Errors & Immediate Actions

**Error 1: Authentication Failed**
```
[now-sdk] ERROR: Authentication failed
[now-sdk] ERROR: Unable to connect to instance
```

**Immediate Action:**
```bash
# Stop deployment (Ctrl+C)
# Re-authenticate
npx now-sdk auth
# Retry deployment
npm run deploy
```

---

**Error 2: File Upload Failed**
```
[now-sdk] ERROR: Failed to upload dist/static/app.js
[now-sdk] ERROR: Network timeout
```

**Immediate Action:**
```bash
# Stop deployment (Ctrl+C)
# Check network connection
ping dev353895.service-now.com
# Rebuild if necessary
npm run build
# Retry deployment
npm run deploy
```

---

**Error 3: Table Creation Failed**
```
[now-sdk] ERROR: Failed to create table x_902080_ppoker_session
[now-sdk] ERROR: Table already exists with different schema
```

**Immediate Action:**
```bash
# CRITICAL: This indicates a conflict
# DO NOT PROCEED - Initiate rollback
# Contact technical lead immediately
```

**Escalation Required:** YES

---

**Error 4: Timeout**
```
[now-sdk] Uploading files... (stuck for > 5 minutes)
```

**Immediate Action:**
```bash
# Wait 5 minutes total
# If no progress, stop deployment (Ctrl+C)
# Check ServiceNow instance status (browser)
# Retry once:
npm run deploy
# If fails again, abort and schedule retry
```

---

## Post-Deployment Phase

**Estimated Time:** 30-45 minutes
**Responsible:** Testing & QA Agent
**Sign-off Required:** YES

### A. Immediate Smoke Tests (10 minutes)

#### 1. Application Accessibility

```bash
# Open browser and navigate to:
https://dev353895.service-now.com

# Login as admin

# Navigate to application:
# Method 1: Direct URL
https://dev353895.service-now.com/x_902080_ppoker

# Method 2: Application Navigator
# Search: "Planning Poker"
# Click: Planning Poker Fluent
```

**✅ Smoke Test Checklist:**
- [ ] Application loads without errors
- [ ] No JavaScript console errors (F12)
- [ ] Header displays: "Planning Poker"
- [ ] "Create New Session" button visible
- [ ] "Analytics" button visible
- [ ] No 404 errors
- [ ] No authentication errors

**Expected Screen:**
```
╔════════════════════════════════════════╗
║   🃏 Planning Poker                    ║
║   ────────────────────────────────     ║
║   📊 Analytics  | Create New Session   ║
╠════════════════════════════════════════╣
║                                        ║
║   No sessions found.                   ║
║   Click "Create New Session" to start. ║
║                                        ║
╚════════════════════════════════════════╝
```

---

#### 2. Database Table Verification

**ServiceNow UI:**
1. Navigate to: **System Definition > Tables**
2. Search: `x_902080_ppoker`
3. Verify tables exist:
   - [ ] `x_902080_ppoker_session`
   - [ ] `x_902080_ppoker_session_stories`
   - [ ] `x_902080_ppoker_vote`
   - [ ] `x_902080_ppoker_session_participant`

**Click each table and verify:**
- [ ] Columns present (check schema)
- [ ] No data (fresh deployment)
- [ ] Access controls exist (if implemented)
- [ ] Table is accessible

---

#### 3. Script Include Verification

**ServiceNow UI:**
1. Navigate to: **System Definition > Script Includes**
2. Search: `PlanningPokerSessionAjax`
3. Verify:
   - [ ] Script Include exists
   - [ ] Client callable: true
   - [ ] Active: true
   - [ ] Script content not empty

---

#### 4. Business Rule Verification

**ServiceNow UI:**
1. Navigate to: **System Definition > Business Rules**
2. Search: `session-defaults`
3. Verify:
   - [ ] Business Rule exists
   - [ ] Table: x_902080_ppoker_session
   - [ ] When: before, insert
   - [ ] Active: true
   - [ ] Script content present

---

### B. Functional Testing (15 minutes)

#### Test 1: Create Session (5 minutes)

**Procedure:**
1. Click "Create New Session" button
2. Fill form:
   - Name: "Test Production Session"
   - Description: "Testing production deployment"
   - Status: Active
3. Click "Create Session"

**✅ Expected Results:**
- [ ] Form submits without error
- [ ] Modal closes
- [ ] Session appears in list
- [ ] Session has auto-generated code (6 characters)
- [ ] Session status shows "Active"
- [ ] Created date/time displayed
- [ ] No console errors

**❌ Rollback Triggers:**
- Form submission fails
- JavaScript errors in console
- Session not created in database
- Page crashes or freezes

---

#### Test 2: View Session (3 minutes)

**Procedure:**
1. Click on created session
2. Navigate to session dashboard

**✅ Expected Results:**
- [ ] Dashboard loads
- [ ] Session name displayed
- [ ] Session code displayed
- [ ] Story management section visible
- [ ] Participant section visible
- [ ] No errors

---

#### Test 3: Add Story (4 minutes)

**Procedure:**
1. In session dashboard, click "Add Story"
2. Fill story details:
   - Title: "Test User Story"
   - Description: "Testing story creation"
3. Click "Save"

**✅ Expected Results:**
- [ ] Story created successfully
- [ ] Story appears in story list
- [ ] Story has sequence number
- [ ] Story status: pending
- [ ] No errors

---

#### Test 4: Voting Interface (3 minutes)

**Procedure:**
1. Click on story to start voting
2. Select estimation card (e.g., "M")
3. Submit vote

**✅ Expected Results:**
- [ ] Voting cards displayed (XS, S, M, L, XL, XXL, ?, ☕)
- [ ] Card selection works
- [ ] Vote submits successfully
- [ ] Vote stored in database
- [ ] No errors

---

### C. Performance Validation (5 minutes)

#### 1. Load Time Measurement

**Using Browser DevTools:**
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh application
4. Measure:

**✅ Performance Targets:**
- [ ] Initial load < 3 seconds
- [ ] App.js load < 2 seconds
- [ ] Time to Interactive < 4 seconds
- [ ] No failed network requests
- [ ] No 500 errors

**Performance Thresholds:**
- **Good:** < 3 seconds initial load
- **Acceptable:** 3-5 seconds
- **Poor:** > 5 seconds (investigate)

---

#### 2. Console Error Check

**Browser Console (F12):**
```
# Check for errors
# Should see NO red error messages

# Acceptable warnings:
- React DevTools extension warnings
- Browser extension warnings

# UNACCEPTABLE errors:
- JavaScript runtime errors
- Failed API calls
- Authentication errors
- Module not found errors
```

**✅ Checklist:**
- [ ] No JavaScript errors
- [ ] No failed API requests
- [ ] No authentication errors
- [ ] No module loading errors

---

### D. Monitoring Setup (5 minutes)

#### 1. ServiceNow System Logs

**Enable Logging:**
1. Navigate to: **System Logs > System Log > All**
2. Set filter: Source = `x_902080_ppoker*`
3. Monitor for errors

**✅ Checklist:**
- [ ] Log monitoring enabled
- [ ] No error logs from application
- [ ] Info logs show activity (optional)
- [ ] Log level appropriate

---

#### 2. Browser Performance Monitoring

**Setup:**
```javascript
// Add to browser console for basic monitoring
window.performance.mark('app-start');
// (Application loads)
window.performance.mark('app-ready');
window.performance.measure('app-load', 'app-start', 'app-ready');
console.log('App load time:', window.performance.getEntriesByName('app-load')[0].duration);
```

**Baseline Metrics:**
- Record initial load time
- Record interaction response time
- Record API call latency

---

### E. User Communication (5 minutes)

#### 1. Success Announcement

**Email Template:**
```
Subject: ✅ [COMPLETED] Planning Poker Deployment Successful

Dear Stakeholders,

The Planning Poker application has been successfully deployed to production!

DEPLOYMENT SUMMARY:
- Status: ✅ Successful
- Completed: [YYYY-MM-DD HH:MM timezone]
- Duration: [MM] minutes
- Downtime: 0 minutes

APPLICATION ACCESS:
- URL: https://dev353895.service-now.com/x_902080_ppoker
- Available to: All authenticated users
- Documentation: [Link to user guide]

FEATURES DEPLOYED:
✓ Session management (create, edit, join)
✓ Story estimation with T-shirt sizing
✓ Real-time voting interface
✓ Analytics dashboard
✓ Session code sharing

NEXT STEPS:
1. User training sessions: [Schedule]
2. Documentation available: [Link]
3. Support: deployment-team@company.com

Thank you for your support during this deployment.

Deployment Team
```

**✅ Checklist:**
- [ ] Success email sent to stakeholders
- [ ] Application URL shared
- [ ] Documentation links provided
- [ ] Support contacts shared
- [ ] Training schedule communicated

---

#### 2. Team Notification

**Slack/Teams Message:**
```
✅ DEPLOYMENT COMPLETED SUCCESSFULLY
─────────────────────────────────────

🎉 Planning Poker is now live in production!

📊 Stats:
- Duration: [MM] minutes
- Downtime: 0 minutes
- Tests passed: 15/15
- Performance: Excellent

🔗 Application: https://dev353895.service-now.com/x_902080_ppoker

📋 Post-Deployment Tasks:
✅ Smoke tests passed
✅ Functional tests passed
✅ Performance validated
⏳ Monitoring active (24h)
⏳ User training (scheduled)

👏 Great work team!

Questions? Contact #deployment-support
```

---

### F. Sign-off Procedures (5 minutes)

**DEPLOYMENT SIGN-OFF FORM**

```
Planning Poker Production Deployment - Sign-off
═══════════════════════════════════════════════════

Deployment Date: [YYYY-MM-DD]
Deployment Time: [HH:MM timezone]
Deployment Lead: [Name]

TECHNICAL VALIDATION:
✅ Application deployed successfully
✅ All smoke tests passed
✅ Functional tests passed
✅ Performance metrics acceptable
✅ No critical errors logged
✅ Monitoring active

QUALITY VALIDATION:
✅ Build size within limits (614 KB)
✅ Load time < 3 seconds
✅ Zero JavaScript errors
✅ All features operational
✅ Database tables created
✅ API integration working

SECURITY VALIDATION:
⚠️  ACLs not yet implemented (Phase 1 post-deployment)
✅ Authentication working
✅ CSRF tokens functional
✅ No exposed credentials

SIGN-OFFS:
─────────────────────────────────────────────

Deployment Lead: _________________ Date: _______
Signature: _____________________________________

QA Lead: _________________________ Date: _______
Signature: _____________________________________

Technical Lead: ___________________ Date: _______
Signature: _____________________________________

Product Owner: ____________________ Date: _______
Signature: _____________________________________

DEPLOYMENT STATUS: ✅ APPROVED FOR PRODUCTION

Next Review: [Date + 7 days]
```

---

## Rollback Procedures

**Estimated Time:** 10-15 minutes
**Authority:** Deployment Lead or Technical Lead
**Notification Required:** YES - Immediate

### A. When to Rollback

**MANDATORY Rollback Triggers:**
1. ❌ Application fails to load (404, 500 errors)
2. ❌ Critical JavaScript errors prevent usage
3. ❌ Database corruption or data loss
4. ❌ Authentication completely broken
5. ❌ Security vulnerability discovered
6. ❌ Cannot create/view/edit sessions
7. ❌ More than 3 smoke tests fail

**OPTIONAL Rollback Triggers:**
1. ⚠️ Performance degradation > 50%
2. ⚠️ Intermittent errors affecting > 30% of users
3. ⚠️ Memory leaks detected
4. ⚠️ Partial functionality loss

**Decision Authority:**
- **Immediate Rollback:** Deployment Lead
- **Delayed Rollback:** Technical Lead + Product Owner

---

### B. Rollback Command Sequence

#### Step 1: Immediate Communication (2 minutes)

**Slack/Teams Alert:**
```
🚨 ROLLBACK INITIATED - Planning Poker Deployment
────────────────────────────────────────────────

Reason: [Brief description]
Started: [HH:MM]
ETA: ~15 minutes

Team: Stand by for updates
Users: Service may be unavailable temporarily

Status updates every 5 minutes
```

**Email (Quick):**
```
Subject: 🚨 URGENT: Planning Poker Deployment Rollback

A rollback is in progress due to [reason].
Application will be unavailable for ~15 minutes.
Updates to follow.
```

---

#### Step 2: Rollback Execution (8 minutes)

**Method 1: Git Revert + Redeploy (Preferred)**

```bash
# On local machine:
cd ~/projects/planningpokerfluent

# Revert to tagged version
git checkout v1.0.0-pre-deploy

# Verify checkout
git log --oneline -1
# Should show: pre-deployment commit

# Rebuild application
npm run build

# Expected output:
# [now-sdk] ✓ Build completed successfully

# Redeploy previous version
npm run deploy

# Expected output:
# [now-sdk] ✓ Deployment completed successfully!
```

**⏱️ Expected Timeline:**
- Checkout: 30 seconds
- Build: 8 seconds
- Deploy: 3-4 minutes
- Verification: 2 minutes

**Total: ~7 minutes**

---

**Method 2: ServiceNow Backup Restore (If Method 1 fails)**

```bash
# ServiceNow UI:
1. Navigate to: System Update Sets > Retrieved Update Sets
2. Locate: Planning Poker Pre-Deployment Backup
3. Click: Restore
4. Confirm restoration
5. Wait for completion (~5 minutes)
```

---

**Method 3: Manual Table Deletion (Emergency Only)**

**⚠️ CRITICAL: Only if both methods above fail**

```bash
# ServiceNow UI:
1. Navigate to: System Definition > Tables
2. Search: x_902080_ppoker
3. Select all application tables
4. Right-click > Delete
5. Confirm deletion (⚠️ irreversible!)

# Delete Script Includes:
1. Navigate to: System Definition > Script Includes
2. Search: PlanningPokerSessionAjax
3. Delete record

# Delete Business Rules:
1. Navigate to: System Definition > Business Rules
2. Search: session-defaults
3. Delete record

# Delete UI Pages:
1. Navigate to: System UI > UI Pages
2. Search: planning-poker-app
3. Delete record
```

**⚠️ WARNING:** This is destructive and irreversible!

---

#### Step 3: Rollback Verification (3 minutes)

**Verification Checklist:**
```bash
# 1. Check application status
# Navigate to: https://dev353895.service-now.com/x_902080_ppoker

# Expected behaviors:
# - Method 1 (Git revert): Previous version loads
# - Method 2 (Backup): Previous state restored
# - Method 3 (Delete): Application not found (expected)
```

**✅ Rollback Success Criteria:**
- [ ] Previous version accessible (Method 1/2)
- [ ] OR Application removed completely (Method 3)
- [ ] No JavaScript errors
- [ ] No database errors
- [ ] System stable

---

### C. Data Migration Rollback

**Note:** Since this is a new application deployment with no existing data, data migration rollback is NOT applicable.

**For future deployments with data:**
1. Restore database from backup
2. Verify data integrity
3. Test data access
4. Validate relationships

---

### D. Communication During Rollback

#### Continuous Updates (Every 5 minutes)

**Slack/Teams Update Template:**
```
🚨 ROLLBACK UPDATE - Planning Poker
───────────────────────────────────

Time: [HH:MM]
Status: [In Progress / Completed / Failed]

Progress:
[X] Communication sent
[X] Rollback initiated
[ ] Rollback completed
[ ] Verification done

ETA: [MM] minutes

Next update: [HH:MM]
```

---

#### Rollback Completion Announcement

**Success Message:**
```
✅ ROLLBACK COMPLETED - Planning Poker
───────────────────────────────────────

Status: ✅ Successful
Completed: [HH:MM]
Duration: [MM] minutes

Current State:
- Application: [Previous version / Removed]
- Data: No data loss (new deployment)
- System: Stable

Root Cause Analysis:
- Scheduled: [Date/Time]
- Responsible: Technical Lead

Redeployment Plan:
- Under review
- Target: TBD

Thank you for your patience.
```

**Failure Message (Escalation):**
```
🚨 ROLLBACK FAILED - URGENT ASSISTANCE NEEDED
─────────────────────────────────────────────

Status: ❌ Failed
Issue: [Description]
Current State: [Description]

IMMEDIATE ACTIONS:
1. ServiceNow support ticket opened
2. Technical escalation in progress
3. Emergency team assembled

Users: Application unavailable
ETA: Under assessment

Critical contact: [Emergency number]
```

---

### E. Post-Rollback Analysis

**MANDATORY Post-Rollback Meeting**

**Agenda:**
1. Timeline review (what happened when)
2. Root cause identification
3. Impact assessment
4. Lessons learned
5. Prevention measures
6. Redeployment plan

**Documentation Required:**
```
ROLLBACK INCIDENT REPORT
════════════════════════

Date: [YYYY-MM-DD]
Time: [HH:MM - HH:MM]
Duration: [MM] minutes
Deployment Lead: [Name]
Rollback Authority: [Name]

INCIDENT SUMMARY:
[Brief description of what triggered rollback]

TIMELINE:
[HH:MM] - Deployment started
[HH:MM] - Issue detected
[HH:MM] - Rollback decision made
[HH:MM] - Rollback initiated
[HH:MM] - Rollback completed
[HH:MM] - Verification done

ROOT CAUSE:
[Detailed analysis of what went wrong]

IMPACT:
- Users affected: [Number / None]
- Downtime: [MM] minutes
- Data loss: [None / Description]
- Business impact: [Description]

RESOLUTION:
[How rollback was executed]

LESSONS LEARNED:
1. [Lesson 1]
2. [Lesson 2]
3. [Lesson 3]

PREVENTION MEASURES:
1. [Action 1]
2. [Action 2]
3. [Action 3]

REDEPLOYMENT PLAN:
- Target Date: [YYYY-MM-DD]
- Additional Testing: [Description]
- Risk Mitigation: [Actions]

Sign-off:
Deployment Lead: _____________ Date: _____
Technical Lead: ______________ Date: _____
Product Owner: _______________ Date: _____
```

---

## Troubleshooting Guide

### Common Deployment Errors

#### Error 1: D-Bus/X11 Error

**Error Message:**
```
[now-sdk] ERROR: Cannot autolaunch D-Bus without X11 $DISPLAY
```

**Cause:** Attempting deployment from headless environment (Codespaces, Docker, CI/CD)

**Resolution:**
```bash
# MUST switch to local machine with GUI
# There is NO workaround for this

# On local machine:
cd ~/projects
git clone <repo> planningpokerfluent
cd planningpokerfluent
npm install
npm run build
npx now-sdk auth  # Will open browser
npm run deploy    # Should succeed
```

**Prevention:** Always deploy from local machine

---

#### Error 2: Authentication Timeout

**Error Message:**
```
[now-sdk] ERROR: Authentication timeout
[now-sdk] ERROR: Failed to receive authorization code
```

**Cause:** OAuth flow not completed in browser

**Resolution:**
```bash
# Clear browser cache
# Try authentication again
npx now-sdk auth

# Complete OAuth flow within 5 minutes
# Click "Authorize" in browser window
# Wait for "Success" message
```

**Prevention:** Complete OAuth flow promptly

---

#### Error 3: Table Already Exists

**Error Message:**
```
[now-sdk] ERROR: Failed to create table x_902080_ppoker_session
[now-sdk] ERROR: Table already exists with different schema
```

**Cause:** Previous deployment exists with schema conflicts

**Resolution:**
```bash
# Option 1: Delete existing tables manually
# ServiceNow UI: System Definition > Tables
# Search: x_902080_ppoker
# Delete all application tables

# Option 2: Use different scope name
# Edit now.config.json:
{
  "scope": "x_902080_ppoker_v2"  // Change suffix
}

# Rebuild and redeploy
npm run build
npm run deploy
```

**Prevention:** Clean previous deployments before redeploying

---

#### Error 4: File Upload Timeout

**Error Message:**
```
[now-sdk] Uploading dist/static/app.js (614 KB)...
[now-sdk] ERROR: Request timeout after 60 seconds
```

**Cause:** Network issues or large file size

**Resolution:**
```bash
# Check network connection
ping dev353895.service-now.com

# Check internet speed
# Minimum: 5 Mbps upload

# Retry deployment
npm run deploy

# If persistent, reduce bundle size:
# See PERFORMANCE_REVIEW.md for optimization tips
```

**Prevention:**
- Stable internet connection (10+ Mbps)
- Optimize bundle size
- Deploy during off-peak hours

---

#### Error 5: Script Include Compilation Error

**Error Message:**
```
[now-sdk] ERROR: Failed to create Script Include: PlanningPokerSessionAjax
[now-sdk] ERROR: Syntax error in script
```

**Cause:** JavaScript syntax error in server-side code

**Resolution:**
```bash
# Check script include file
# src/fluent/script-includes/planning-poker-session.now.ts

# Run type checking
npm run type-check

# Fix syntax errors
# Rebuild
npm run build

# Redeploy
npm run deploy
```

**Prevention:**
- Run `npm run check-all` before deployment
- Use ESLint
- Test locally

---

### Performance Issues

#### Issue 1: Slow Initial Load

**Symptom:** Application takes > 5 seconds to load

**Diagnosis:**
```bash
# Browser DevTools > Network tab
# Check:
# - app.js load time
# - Network latency
# - Number of requests

# Browser DevTools > Performance tab
# Record page load
# Analyze:
# - JavaScript execution time
# - Rendering time
```

**Resolution:**
1. **Check bundle size** (should be ~614 KB)
   ```bash
   ls -lh dist/static/app.js
   ```

2. **Optimize if needed** (see PERFORMANCE_REVIEW.md)
   - Remove unused dependencies
   - Enable code splitting
   - Optimize images

3. **Check ServiceNow instance performance**
   - Navigate to: System Diagnostics > Performance
   - Review instance load

---

#### Issue 2: High Memory Usage

**Symptom:** Browser tab uses > 500 MB RAM

**Diagnosis:**
```bash
# Browser DevTools > Memory tab
# Take heap snapshot
# Analyze object retention

# Check for:
# - Memory leaks
# - Large objects
# - Detached DOM nodes
```

**Resolution:**
1. **Review React components**
   - Check for missing cleanup in useEffect
   - Verify event listener removal
   - Check interval/timeout cleanup

2. **Optimize state management**
   - Avoid storing large objects in state
   - Use pagination for large lists
   - Implement lazy loading

3. **Update dependencies**
   ```bash
   npm update
   npm run build
   npm run deploy
   ```

---

### Integration Issues

#### Issue 1: REST API Failures

**Symptom:** API calls fail with 401/403 errors

**Diagnosis:**
```bash
# Browser DevTools > Network tab
# Check failed requests
# Look for:
# - Status codes
# - Response body
# - Request headers
```

**Resolution:**
1. **Check authentication**
   ```javascript
   // Browser console:
   console.log('CSRF Token:', window.g_ck);
   // Should show token value
   ```

2. **Verify table ACLs**
   - ServiceNow UI: System Security > Access Control (ACL)
   - Search: x_902080_ppoker
   - Ensure proper read/write permissions

3. **Check user roles**
   - Verify user has required roles
   - Add roles if necessary

---

#### Issue 2: CORS Errors

**Symptom:** Console shows CORS policy errors

**Diagnosis:**
```bash
# Browser console shows:
# "Access to fetch at '...' has been blocked by CORS policy"
```

**Resolution:**
1. **Verify same-origin requests**
   - Application should use relative URLs
   - All API calls should be to same domain

2. **Check ServiceNow instance settings**
   - Navigate to: System Properties > System Security
   - Verify CORS settings allow application domain

3. **Use proper credentials**
   ```javascript
   fetch(url, {
     credentials: 'same-origin'  // Required
   })
   ```

---

## Emergency Contacts

### Primary Contacts

**Deployment Team:**
```
Deployment Lead: [Name]
  Email: deployment-lead@company.com
  Phone: [Phone]
  Slack: @deployment-lead

Build Agent: [Name]
  Email: build-agent@company.com
  Phone: [Phone]
  Slack: @build-agent

QA Lead: [Name]
  Email: qa-lead@company.com
  Phone: [Phone]
  Slack: @qa-lead

Technical Lead: [Name]
  Email: tech-lead@company.com
  Phone: [Phone]
  Slack: @tech-lead
```

---

### Escalation Path

**Level 1 (0-15 minutes):** Deployment Lead
- Handle routine deployment issues
- Execute standard troubleshooting
- Retry failed steps

**Level 2 (15-30 minutes):** Technical Lead
- Complex technical issues
- Architecture decisions
- Rollback authorization

**Level 3 (30-60 minutes):** Engineering Manager
- Business impact decisions
- Resource allocation
- Executive communication

**Level 4 (60+ minutes):** VP Engineering
- Critical system failures
- Vendor escalation
- C-level notification

---

### ServiceNow Support

**ServiceNow HI (HelpDesk International):**
```
Portal: https://support.servicenow.com
Phone: 1-XXX-XXX-XXXX
Email: support@servicenow.com
Priority: P1 (Critical)
```

**When to Contact ServiceNow:**
- Platform-level failures
- Database corruption
- Instance unavailability
- Security incidents

---

### Internal Support Channels

**Slack Channels:**
```
#deployment-support - General deployment questions
#planning-poker-dev - Application-specific issues
#servicenow-admin - Platform administration
#incident-response - Critical incidents
```

**Email Distribution Lists:**
```
deployment-team@company.com - All deployment team
engineering-all@company.com - All engineers
incident-response@company.com - Critical issues
```

---

## Appendix A: Quick Reference Commands

### Essential Commands

```bash
# Pre-deployment
npm ci                  # Install dependencies
npm run check-all       # Quality checks
npm run build           # Build application

# Deployment
npx now-sdk auth        # Authenticate (one-time)
npm run deploy          # Deploy to ServiceNow

# Verification
npx now-sdk auth --list # Check auth status
ls -lh dist/static/     # Verify build output

# Rollback
git checkout <tag>      # Revert code
npm run build           # Rebuild
npm run deploy          # Redeploy

# Troubleshooting
npm run type-check      # Check TypeScript
npm run lint:errors-only  # Check linting
npm audit               # Security check
```

---

## Appendix B: Deployment Checklist (Printable)

```
PLANNING POKER PRODUCTION DEPLOYMENT
═══════════════════════════════════════════════════

Date: ____________  Time: ____________  Lead: ____________

PRE-DEPLOYMENT (2-3 hours)
───────────────────────────────────────────────────
Environment Verification:
□ Local machine ready (Node.js, npm, git)
□ GUI/display available (NOT headless)
□ Repository cloned and updated
□ Dependencies installed (npm ci)
□ Internet connection stable

Code Quality:
□ npm run type-check passes
□ npm run lint:errors-only passes
□ npm run build succeeds
□ Build output: ~614 KB

Authentication:
□ npx now-sdk auth completed
□ Credentials stored in keychain
□ Instance accessible

Backups:
□ Database backup created
□ Code tagged (git tag)
□ Backup files verified

Communication:
□ Stakeholders notified
□ Team coordinated
□ Roles assigned

DEPLOYMENT (15-20 minutes)
───────────────────────────────────────────────────
Pre-flight:
□ On local machine (confirmed)
□ Build artifacts present
□ Authentication verified

Execution:
□ npm run deploy executed
□ Files uploaded (3/3)
□ Tables created (4/4)
□ Script Include created (1/1)
□ Business Rule created (1/1)
□ UI Page created (1/1)
□ No error messages
□ Application URL received

POST-DEPLOYMENT (30-45 minutes)
───────────────────────────────────────────────────
Smoke Tests:
□ Application loads
□ No JavaScript errors
□ Tables exist (4/4)
□ Script Include exists
□ Business Rule exists

Functional Tests:
□ Create session works
□ View session works
□ Add story works
□ Voting interface works

Performance:
□ Load time < 3 seconds
□ No console errors
□ No failed requests

Monitoring:
□ System logs enabled
□ Performance baseline recorded
□ Monitoring active

Communication:
□ Success email sent
□ Team notified
□ Documentation shared

SIGN-OFF
───────────────────────────────────────────────────
Deployment Lead: ________________  Date: ________

QA Lead: ________________________  Date: ________

Technical Lead: __________________  Date: ________

Product Owner: ___________________  Date: ________

STATUS: □ SUCCESS  □ FAILED  □ ROLLED BACK

Notes: ________________________________________________

___________________________________________________________

___________________________________________________________
```

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-05 | Build & Deployment Agent | Initial creation |

**Review Schedule:**
- Next Review: After first production deployment
- Quarterly updates: Every 3 months
- Update triggers: Major version changes, process improvements

**Approval:**
- Technical Lead: _________________ Date: _______
- Deployment Lead: ________________ Date: _______
- QA Lead: _______________________ Date: _______

---

**END OF PRODUCTION DEPLOYMENT RUNBOOK**

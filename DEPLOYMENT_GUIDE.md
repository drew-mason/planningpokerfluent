# ServiceNow Planning Poker - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Planning Poker application to a ServiceNow instance and testing the session creation functionality.

## Prerequisites
- ServiceNow instance with developer privileges
- ServiceNow CLI tools installed
- Node.js and npm installed locally

## Key Issues Fixed
✅ **Authentication Issues**: Fixed all `window.g_ck` null reference errors  
✅ **Session Creation Debugging**: Added comprehensive logging to identify API issues  
✅ **Error Handling**: Improved error handling across all service layers

## Deployment Steps

### 1. Build the Application
```bash
cd /path/to/planningpokerfluent
npm run build
```

### 2. Deploy to ServiceNow Instance
```bash
# Deploy the built application to your ServiceNow instance
npm run deploy
```

### 3. Verify Database Tables
Ensure these tables exist in your ServiceNow instance:
- `x_902080_planpoker_planning_session`
- `x_902080_planpoker_session_stories` 
- `x_902080_planpoker_session_participant`
- `x_902080_planpoker_planning_vote`
- `x_902080_planpoker_user_stats`
- `x_902080_planpoker_session_analytics`
- `x_902080_planpoker_session_files`

### 4. Access the Application
1. Log into your ServiceNow instance
2. Navigate to the Planning Poker application
3. The application should load with the session list view

## Testing Session Creation Issue

### Expected Behavior
1. Click "Create New Session"
2. Fill in session details (name, description)
3. Click "Create Session"
4. New session should appear in the session list

### Debugging Steps

#### 1. Check Browser Console
Open Developer Tools (F12) and monitor console output when creating a session:

**Expected Debug Logs:**
```
PlanningSessionService.create: Creating session with data: {name: "Test Session", description: "..."}
PlanningSessionService.create: window.g_ck available: true
PlanningSessionService.create: Processed session data: {...}
PlanningSessionService.create: Request headers: {Content-Type: "application/json", ...}
PlanningSessionService.create: Response status: 201
PlanningSessionService.create: Response ok: true
PlanningSessionService.create: Created session: {result: {...}}

App.tsx: handleFormSubmit: Session created successfully: {...}
App.tsx: refreshSessions: Starting to refresh sessions...
PlanningSessionService.list: Starting to fetch sessions...
PlanningSessionService.list: Returning sessions: 1 sessions
App.tsx: refreshSessions: Sessions loaded: 1
```

#### 2. Check Network Tab
Monitor XHR/Fetch requests:
- **POST** `/api/now/table/x_902080_planpoker_planning_session` (session creation)
- **GET** `/api/now/table/x_902080_planpoker_planning_session` (session list refresh)

#### 3. Common Issues & Solutions

**Issue: `window.g_ck` is undefined**
- **Cause**: ServiceNow authentication token not available
- **Solution**: Ensure you're logged into ServiceNow and refresh the page

**Issue: HTTP 403 Forbidden**
- **Cause**: Insufficient permissions to access tables
- **Solution**: Check user roles and table ACL permissions

**Issue: HTTP 404 Not Found**
- **Cause**: Tables don't exist or incorrect table names
- **Solution**: Verify table names match the schema exactly

**Issue: Sessions created but not appearing in list**
- **Cause**: Different user contexts or filtering issues
- **Solution**: Check `sysparm_query` parameters in list API call

### 4. ServiceNow Table Verification
Check table data directly in ServiceNow:
1. Navigate to **System Definition > Tables**
2. Search for `x_902080_planpoker_planning_session`
3. Click on table name
4. Verify records are being created

### 5. API Testing
Test the REST API directly:
```javascript
// In ServiceNow background script or browser console
var gr = new GlideRecord('x_902080_planpoker_planning_session');
gr.query();
while (gr.next()) {
    gs.print('Session: ' + gr.name + ' | Status: ' + gr.status);
}
```

## Troubleshooting

### Authentication Errors
If you see "Cannot read properties of undefined (reading 'control')" errors:
1. Refresh the page to ensure ServiceNow session is active
2. Check browser console for `window.g_ck` availability
3. Verify user has proper roles assigned

### Session List Empty
If sessions are created but not displayed:
1. Check console logs for API response data
2. Verify the list API returns data
3. Check React state updates in App component

### API Failures
If API calls fail:
1. Verify ServiceNow instance is accessible
2. Check table permissions and ACLs
3. Ensure scope and table names are correct

## Performance Monitoring
Monitor these metrics after deployment:
- Session creation response time
- API call success rate
- User authentication success rate
- Database query performance

## Support
For deployment issues:
1. Check ServiceNow logs in **System Logs > System Log > All**
2. Review browser console for JavaScript errors
3. Verify all prerequisite tables and data exist
4. Test API endpoints manually using ServiceNow REST API Explorer
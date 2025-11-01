# Planning Poker Application - User Testing Guide

## 🎯 Overview
This guide walks you through testing the complete Planning Poker application on your ServiceNow instance. The application enables agile teams to conduct estimation sessions using interactive voting cards and real-time collaboration.

## 🚀 Quick Start

### Step 1: Access the Application
1. **Login to ServiceNow**: Navigate to https://dev353895.service-now.com
2. **Open Planning Poker**: 
   - Go to **All Applications** → Search for "Planning Poker" 
   - OR directly visit: `https://dev353895.service-now.com/$planningpoker.do`
3. **Verify Load**: You should see the Planning Poker interface with navigation options

## 📝 Complete Testing Workflow

### Phase 1: Story Management Testing

#### Create Your First Story
1. **Navigate to Story Manager**:
   - Click "Manage Stories" or navigate to the story management section
   - You should see an empty story list with "Add Story" button

2. **Add Individual Stories**:
   ```
   Story 1: "User can login to the system"
   Description: "As a user, I want to login so I can access my account"
   
   Story 2: "User can view their dashboard" 
   Description: "As a user, I want to see my personalized dashboard"
   
   Story 3: "User can update profile settings"
   Description: "As a user, I want to update my profile information"
   ```

3. **Test Bulk Import** (Optional):
   - Click "Bulk Import" button
   - Paste multiple stories in format: `Title | Description`
   - Example:
   ```
   User Registration | As a new user, I want to register an account
   Password Reset | As a user, I want to reset my forgotten password
   Email Notifications | As a user, I want to receive email updates
   ```

4. **Test Story Management**:
   - ✅ **Edit**: Click edit icon on any story, modify title/description, save
   - ✅ **Reorder**: Drag and drop stories to change sequence
   - ✅ **Delete**: Remove a test story using the delete button

### Phase 2: Session Management Testing

#### Create a Planning Session
1. **Start New Session**:
   - Click "New Session" or "Create Session"
   - Fill in session details:
     ```
     Session Name: "Sprint 24 Planning"
     Description: "Estimation for upcoming sprint stories"
     Estimation Scale: "Fibonacci" (0,1,2,3,5,8,13,20,40,100)
     ```

2. **Add Participants**:
   - Add yourself as session dealer/moderator
   - Add test participants (can use dummy names for testing):
     ```
     - John Developer (Developer)
     - Sarah Tester (QA)
     - Mike Designer (Designer)
     ```

3. **Verify Session Dashboard**:
   - ✅ **Participant List**: All participants show with status
   - ✅ **Story Queue**: Your created stories appear in session
   - ✅ **Session Controls**: Start/pause/reset buttons available

### Phase 3: Voting Interface Testing

#### Test Estimation Workflow
1. **Select First Story**:
   - Click on first story in the session dashboard
   - Story details should display in voting area
   - Voting cards should appear for all participants

2. **Cast Votes (Simulate Multiple Users)**:
   - **As Dealer**: Select estimation card (try "5")
   - **Simulate Participant Votes**: 
     - John: "3" 
     - Sarah: "5"
     - Mike: "8"

3. **Test Voting Features**:
   - ✅ **Card Selection**: Click different estimation values
   - ✅ **Vote Submission**: Confirm votes are recorded
   - ✅ **Vote Hiding**: Votes should be hidden until all submit
   - ✅ **Reveal Votes**: Click "Reveal Votes" to show all estimates

4. **Consensus Testing**:
   - **Scenario A - Consensus**: All vote same value (e.g., "5")
     - Should show "Consensus Reached!" message
     - Should allow finalizing the estimate
   
   - **Scenario B - No Consensus**: Different votes (3,5,8)
     - Should show voting statistics
     - Should prompt for discussion and re-voting

5. **Story Completion**:
   - Finalize estimate for the story
   - Move to next story in queue
   - Verify story shows as "estimated" in dashboard

### Phase 4: Advanced Features Testing

#### Test Estimation Scales
1. **Switch Scales**:
   - Try different estimation scales:
     - **Fibonacci**: 0,1,2,3,5,8,13,20,40,100
     - **Poker**: 0,1/2,1,2,3,5,8,13,20,40,100
     - **T-Shirt**: XS,S,M,L,XL,XXL

2. **Verify Scale Behavior**:
   - Cards update to show new values
   - Previous votes reset when scale changes
   - Statistics recalculate correctly

#### Test Session Controls
1. **Dealer Controls**:
   - ✅ **Start/Pause Voting**: Control when participants can vote
   - ✅ **Reset Votes**: Clear all votes for current story
   - ✅ **Skip Story**: Move to next without estimation
   - ✅ **End Session**: Complete the session

2. **Real-time Updates**:
   - Vote counts update as votes are cast
   - Participant status changes (voting/submitted/ready)
   - Story progress updates in real-time

### Phase 5: User Experience Testing

#### Test Responsive Design
1. **Desktop Testing**:
   - Resize browser window to test responsiveness
   - Verify all components scale properly
   - Test at different screen resolutions

2. **Mobile Simulation**:
   - Use browser dev tools to simulate mobile devices
   - Test voting card interactions on touch devices
   - Verify navigation works on small screens

#### Test Accessibility
1. **Keyboard Navigation**:
   - Tab through all interactive elements
   - Use Enter/Space to select voting cards
   - Ensure focus indicators are visible

2. **Screen Reader Compatibility**:
   - Test with screen reader (if available)
   - Verify ARIA labels are descriptive
   - Check heading structure makes sense

## 🐛 Expected Testing Scenarios

### Positive Test Cases
- ✅ **Happy Path**: Complete story estimation workflow
- ✅ **Multiple Stories**: Estimate 3-5 stories in sequence
- ✅ **Consensus**: Achieve consensus on estimates
- ✅ **Scale Switching**: Change estimation scales mid-session

### Edge Case Testing
- 🔍 **Empty States**: Test with no stories, no participants
- 🔍 **Single Participant**: Test voting with only dealer
- 🔍 **Large Numbers**: Test with 10+ stories, 8+ participants
- 🔍 **Network Issues**: Test with slow/interrupted connections

### Error Scenarios
- ❌ **Invalid Data**: Submit empty story titles, invalid estimates
- ❌ **Permissions**: Test with non-dealer participants
- ❌ **Session Limits**: Test maximum participants/stories
- ❌ **Concurrent Sessions**: Multiple sessions by same user

## 📊 Success Criteria

### Core Functionality
- [ ] Stories can be created, edited, and managed
- [ ] Sessions can be started with participants
- [ ] Voting works with all estimation scales
- [ ] Consensus detection functions correctly
- [ ] Session completion saves estimates

### User Experience
- [ ] Interface is intuitive and responsive
- [ ] Voting cards are visually appealing
- [ ] Real-time updates work smoothly
- [ ] Navigation is clear and logical

### Performance
- [ ] Application loads quickly (&lt;3 seconds)
- [ ] Voting responses are immediate (&lt;1 second)
- [ ] No console errors or warnings
- [ ] Works in multiple browser tabs

## 🔧 Troubleshooting

### Common Issues
1. **Application Won't Load**:
   - Check ServiceNow instance is accessible
   - Verify user has proper application access
   - Try refreshing browser cache

2. **Voting Cards Don't Respond**:
   - Check browser JavaScript is enabled
   - Verify no browser console errors
   - Try different browser or incognito mode

3. **Real-time Updates Missing**:
   - Check network connectivity
   - Verify ServiceNow session is active
   - Try refreshing the page

### Getting Help
- **Browser Console**: Check for JavaScript errors (F12 → Console)
- **Network Tab**: Monitor API calls for failures (F12 → Network)
- **ServiceNow Logs**: Check application logs in ServiceNow System Logs

## 📝 Testing Report Template

After testing, document your findings:

```markdown
## Testing Session Report

**Date**: [Date]
**Tester**: [Your Name]
**Browser**: [Chrome/Firefox/Safari + Version]
**Duration**: [Time spent testing]

### Completed Tests
- [ ] Story Management
- [ ] Session Creation  
- [ ] Voting Workflow
- [ ] Consensus Detection
- [ ] Responsive Design

### Issues Found
1. **Issue**: [Description]
   **Severity**: [High/Medium/Low]
   **Steps**: [How to reproduce]

### Recommendations
- [Suggestions for improvements]

### Overall Assessment
- **Functionality**: [Working/Needs fixes]
- **User Experience**: [Excellent/Good/Needs improvement]
- **Performance**: [Fast/Acceptable/Slow]
```

## 🎉 Next Steps

Once testing is complete, the application is ready for:
1. **Analytics Dashboard**: View estimation metrics and trends
2. **Mobile Optimization**: Enhanced mobile experience
3. **Real-time Collaboration**: Live participant updates
4. **Production Deployment**: Move to production ServiceNow instance

---

**Happy Testing! 🚀**

*For technical support or questions about this testing guide, refer to the development team or check the application documentation.*
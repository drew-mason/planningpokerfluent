# Easter Eggs Testing Checklist

## Pre-Testing Setup

1. Deploy the application to ServiceNow instance (requires local machine with GUI)
2. Open the Planning Poker application in a web browser
3. Open browser DevTools console (F12) to monitor logs
4. Ensure sound is enabled for full experience

---

## Test 1: Retro CRT Mode

### Test Steps:

1. **Activate Retro Mode**
   - [ ] Type the letters: `R` `E` `T` `R` `O` (case-insensitive)
   - [ ] Watch for console log: `useKonamiCode: Sequence matched! retro`
   - [ ] Watch for console log: `RetroModeProvider: Retro mode activated`

2. **Verify Visual Effects**
   - [ ] Green CRT scanlines appear across entire screen
   - [ ] All text changes to Courier New monospace font
   - [ ] Green phosphor glow visible on buttons and panels
   - [ ] Subtle screen flicker animation present
   - [ ] "RETRO MODE" badge appears in top-right corner with TV icon
   - [ ] Badge has pulsing animation

3. **Verify Interaction**
   - [ ] Click on the RETRO MODE badge
   - [ ] Retro mode should deactivate immediately
   - [ ] Scanlines and effects disappear
   - [ ] Font returns to normal

4. **Verify Persistence**
   - [ ] Activate Retro Mode again by typing RETRO
   - [ ] Refresh the page (F5)
   - [ ] Verify Retro Mode is still active after refresh
   - [ ] Check localStorage: `planningpoker_retro_mode` should be "true"

5. **Verify Keyboard Toggle**
   - [ ] Type `R` `E` `T` `R` `O` again
   - [ ] Retro Mode should toggle off
   - [ ] Type `R` `E` `T` `R` `O` once more
   - [ ] Retro Mode should toggle back on

### Expected Results:
✅ All visual effects apply correctly
✅ Toggle works via both badge click and keyboard
✅ State persists across page refreshes
✅ No console errors

---

## Test 2: DeLorean Time Circuits

### Test Steps:

1. **Activate DeLorean Mode**
   - [ ] Type the letters: `J` `O` `S` `H` `U` `A`
   - [ ] Watch for console log: `useKonamiCode: Sequence matched! joshua`
   - [ ] Watch for console log: `DeloreanProvider: DeLorean mode activated`

2. **Verify WarGames Activation Screen**
   - [ ] Full-screen black overlay appears
   - [ ] Green CRT scanlines visible
   - [ ] Text types out character by character:
     ```
     GREETINGS PROFESSOR FALKEN.

     SHALL WE PLAY A GAME?
     ```
   - [ ] Blinking cursor visible at end of text
   - [ ] Screen fades out after ~3 seconds

3. **Verify Time Circuits Display**
   - [ ] After activation screen fades, time circuits appear in bottom-right
   - [ ] Three LED panels visible with labels:

   **Destination Time Panel (Red LED):**
   - [ ] Label: "DESTINATION TIME"
   - [ ] Date: "OCT 21 2015"
   - [ ] Time: "04:29 PM"
   - [ ] Red text with glow effect

   **Present Time Panel (Green LED):**
   - [ ] Label: "PRESENT TIME"
   - [ ] Shows current date (updates live)
   - [ ] Shows current time (updates every second)
   - [ ] Green text with glow effect
   - [ ] Subtle blinking animation

   **Last Time Departed Panel (Amber LED):**
   - [ ] Label: "LAST TIME DEPARTED"
   - [ ] Date: "OCT 26 1985"
   - [ ] Time: "01:21 AM"
   - [ ] Amber/orange text with glow effect

4. **Verify Interactivity**
   - [ ] X button visible in top-right of time circuits
   - [ ] Click X button - time circuits disappear
   - [ ] Type `J` `O` `S` `H` `U` `A` again - circuits reappear

5. **Verify Responsive Design**
   - [ ] Resize browser window to mobile width (<640px)
   - [ ] Time circuits should shrink and remain readable
   - [ ] Panels should stack vertically on very small screens

### Expected Results:
✅ WarGames activation plays smoothly
✅ Time circuits display correctly with proper LED colors
✅ Present time updates every second
✅ Close button works
✅ Responsive on mobile devices
✅ No console errors

---

## Test 3: Konami Code

### Test Steps:

1. **Activate Konami Code**
   - [ ] Press arrow keys in exact sequence:
     - `↑` (ArrowUp)
     - `↑` (ArrowUp)
     - `↓` (ArrowDown)
     - `↓` (ArrowDown)
     - `←` (ArrowLeft)
     - `→` (ArrowRight)
     - `←` (ArrowLeft)
     - `→` (ArrowRight)
     - `B` key
     - `A` key
   - [ ] Watch for console log: `useKonamiCode: Sequence matched!`

2. **Verify Toast Notification**
   - [ ] Toast appears in bottom-right corner
   - [ ] Message: "🎮 Konami Code Activated!"
   - [ ] Joystick icon (🕹️) visible
   - [ ] Large font size (1.25rem)
   - [ ] Bold text
   - [ ] Sound effect plays

3. **Verify Auto-Dismiss**
   - [ ] Toast automatically fades out after 5 seconds
   - [ ] No manual dismissal required

4. **Verify Reset**
   - [ ] Immediately after first activation, try sequence again
   - [ ] Should work multiple times in a row
   - [ ] Each activation creates a new toast

### Expected Results:
✅ Sequence detection works accurately
✅ Toast displays with correct styling
✅ Sound plays on activation
✅ Can be activated multiple times
✅ No console errors

---

## Test 4: Celebration Effect (Manual Trigger)

### Test Steps:

Since the celebration effect is not yet integrated into VotingSession, we need to test it manually via browser console:

1. **Manual Trigger via Console**
   - [ ] Open browser DevTools console (F12)
   - [ ] Paste the following code:
   ```javascript
   // Create a button to trigger celebration
   const btn = document.createElement('button')
   btn.textContent = 'Test Celebration'
   btn.style.cssText = 'position:fixed;top:10px;left:10px;z-index:99999;padding:10px;'
   btn.onclick = () => {
     // Dispatch custom event
     window.dispatchEvent(new CustomEvent('test-celebration'))
   }
   document.body.appendChild(btn)
   ```
   - [ ] Click the "Test Celebration" button that appears

2. **Verify Confetti Animation**
   - [ ] 50 confetti particles fall from top of screen
   - [ ] Particles are different colors (red, orange, green, blue, purple, pink)
   - [ ] Particles rotate as they fall
   - [ ] Particles fade out as they reach bottom
   - [ ] Random positions across width of screen

3. **Verify Success Message**
   - [ ] Message appears in center: "CONSENSUS ACHIEVED! 🎉"
   - [ ] Subtext: "Great job, team!"
   - [ ] Message has bounce-in animation
   - [ ] Glass panel styling with border
   - [ ] Gradient glow effect on text

4. **Verify Auto-Dismiss**
   - [ ] Entire effect (confetti + message) fades out after 4 seconds
   - [ ] Screen returns to normal

### Alternative Test (Future Integration):

Once integrated into VotingSession:
- [ ] Create a voting session
- [ ] Have all participants vote the same value
- [ ] Dealer reveals votes
- [ ] Celebration should trigger automatically on consensus

### Expected Results:
✅ Confetti animates smoothly (60fps)
✅ Success message bounces in
✅ Auto-dismisses after 4 seconds
✅ No performance lag
✅ No console errors

---

## Test 5: Dynamic Favicon

### Test Steps:

1. **Initial Check**
   - [ ] Look at browser tab icon (favicon)
   - [ ] Should show a playing card with "?" symbol
   - [ ] Color should match current theme

2. **Test Theme Mode Toggle**
   - [ ] Click theme toggle button (sun/moon icon)
   - [ ] Switch from dark to light mode
   - [ ] Favicon should update immediately
   - [ ] Background color should change (dark to light)

3. **Test Variant Changes**
   - [ ] Open variant selector dropdown
   - [ ] Select different variants and observe favicon color:

   **Light Mode Variants:**
   - [ ] Voltron - Blue favicon
   - [ ] Red Lion - Red favicon
   - [ ] Green Lion - Green favicon
   - [ ] Blue Lion - Blue favicon
   - [ ] Yellow Lion - Yellow/amber favicon
   - [ ] Black Lion - Dark gray favicon

   **Dark Mode Variants:**
   - [ ] Tron - Cyan favicon
   - [ ] Sark - Amber favicon
   - [ ] User - Pink favicon

4. **Verify Console Logs**
   - [ ] Each theme change should log:
     ```
     useDynamicFavicon: Updated favicon for [variant] variant
     ```

### Expected Results:
✅ Favicon updates instantly on theme change
✅ Favicon color matches theme accent color
✅ Icon remains visible and recognizable
✅ Works across all 9 theme variants
✅ No console errors

---

## Combined Easter Egg Tests

### Test: Multiple Easter Eggs Active Simultaneously

1. **Activate All Easter Eggs**
   - [ ] Type `RETRO` to enable Retro Mode
   - [ ] Type `JOSHUA` to show DeLorean Time Circuits
   - [ ] Press Konami Code (↑↑↓↓←→←→BA)

2. **Verify Compatibility**
   - [ ] All three can be active at once
   - [ ] Retro Mode scanlines visible
   - [ ] Time circuits still readable with retro styling
   - [ ] Konami toast appears normally
   - [ ] No visual conflicts or z-index issues

3. **Verify Performance**
   - [ ] Open DevTools Performance tab
   - [ ] Record for 10 seconds with all Easter eggs active
   - [ ] Check frame rate - should be 60fps or close
   - [ ] No janky animations

### Expected Results:
✅ All Easter eggs work together harmoniously
✅ No visual conflicts
✅ Performance remains smooth
✅ No console errors

---

## Cross-Browser Testing

### Chrome/Edge (Chromium)
- [ ] All tests pass in Chrome
- [ ] All tests pass in Edge

### Firefox
- [ ] All tests pass in Firefox
- [ ] Note any visual differences

### Safari (if available)
- [ ] All tests pass in Safari
- [ ] Note any visual differences

### Mobile Browsers
- [ ] Test on mobile Chrome (Android)
- [ ] Test on Safari (iOS)
- [ ] Time circuits responsive
- [ ] Toast notifications readable

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab to Retro Mode indicator
- [ ] Press Enter to toggle (should work)
- [ ] Tab to time circuits close button
- [ ] Press Enter to close (should work)

### Screen Reader (Optional)
- [ ] Enable screen reader
- [ ] Verify ARIA labels are read correctly
- [ ] Verify buttons have descriptive labels

### Reduced Motion
- [ ] Enable "Prefers Reduced Motion" in OS
- [ ] Verify animations are minimal or disabled
- [ ] App should still be functional

---

## Performance Testing

### Bundle Size Check
- [ ] Check build output: main.jsdbx should be < 850 KB
- [ ] Current size: 768 KB ✅
- [ ] CSS files combined: ~52 KB ✅

### Memory Leak Check
- [ ] Open DevTools Memory tab
- [ ] Take heap snapshot
- [ ] Activate/deactivate each Easter egg 10 times
- [ ] Take another heap snapshot
- [ ] Memory usage should not increase significantly

### Animation Performance
- [ ] Open DevTools Performance tab
- [ ] Record while triggering celebration effect
- [ ] Check for 60fps frame rate
- [ ] No dropped frames or long tasks

---

## Bug Reporting Template

If you find any issues during testing, report them using this format:

```markdown
## Bug Report

**Easter Egg:** [Name of Easter egg]
**Browser:** [Chrome/Firefox/Safari/Edge]
**OS:** [Windows/Mac/Linux]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**


**Actual Behavior:**


**Console Errors:**
```
[paste any console errors]
```

**Screenshots:**
[attach if applicable]
```

---

## Sign-Off

### Tester Information
- **Name:** _______________
- **Date:** _______________
- **Build Version:** _______________

### Test Results Summary
- [ ] All Retro Mode tests passed
- [ ] All DeLorean Mode tests passed
- [ ] All Konami Code tests passed
- [ ] All Celebration Effect tests passed
- [ ] All Dynamic Favicon tests passed
- [ ] Cross-browser compatibility verified
- [ ] Performance acceptable
- [ ] No critical bugs found

### Overall Status
- [ ] ✅ PASS - Ready for production
- [ ] ⚠️ PASS WITH ISSUES - Minor issues found (list below)
- [ ] ❌ FAIL - Critical issues found (list below)

### Notes:
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

---

**Testing completed successfully? Enjoy the Easter eggs! 🎉**

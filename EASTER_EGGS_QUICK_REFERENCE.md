# MSM Planning Poker - Easter Eggs Quick Reference

## 🎮 Hidden Features & Easter Eggs

### 1. 🖥️ Retro CRT Mode

**Activation:** Type `RETRO` anywhere in the app

**What happens:**
- Green CRT scanlines appear over entire screen
- All text changes to monospace font (Courier New)
- Green phosphor glow on buttons and panels
- Subtle screen flicker effect
- "RETRO MODE" indicator badge appears in top-right

**Deactivation:**
- Click the indicator badge, or
- Type `RETRO` again

**Persistence:** Your preference is saved and restored on next visit

---

### 2. ⏰ DeLorean Time Circuits

**Activation:** Type `JOSHUA` (WarGames reference)

**What happens:**
1. **WarGames-style activation sequence:**
   - Full-screen terminal appears
   - Green text types: "GREETINGS PROFESSOR FALKEN. SHALL WE PLAY A GAME?"
   - Fades away after 3 seconds

2. **Time Circuits appear** (Back to the Future style):
   - **Destination Time:** OCT 21 2015 04:29 PM (red LED)
   - **Present Time:** [Current date/time] (green LED, live updating)
   - **Last Time Departed:** OCT 26 1985 01:21 AM (amber LED)

**Location:** Bottom-right corner of screen

**Deactivation:**
- Click the X button, or
- Type `JOSHUA` again

---

### 3. 🎮 Konami Code

**Activation:** Press arrow keys in sequence:
```
↑ ↑ ↓ ↓ ← → ← → B A
```

**What happens:**
- Success toast notification: "🎮 Konami Code Activated!"
- Sound effect plays
- Celebratory message appears for 5 seconds

**Notes:**
- Must be typed in exact order
- Resets automatically after successful activation
- Can be activated multiple times

---

### 4. 🎉 Celebration Effect (Auto-triggered)

**Activation:** Automatically when consensus is achieved in voting

**What happens:**
- 50 colorful confetti particles fall from top
- Success message: "CONSENSUS ACHIEVED! 🎉"
- Bounce animation on message
- Sound effect plays
- Auto-dismisses after 4 seconds

**Colors:** Red, Orange, Green, Blue, Purple, Pink

---

### 5. 🎨 Dynamic Favicon

**Activation:** Automatic (always active)

**What it does:**
- Favicon color matches your current theme variant
- Updates instantly when you change themes
- Different design for light/dark mode
- Shows a playing card icon with "?" symbol

**Theme Colors:**
- **Voltron:** Blue
- **Red Lion:** Red
- **Green Lion:** Green
- **Blue Lion:** Blue
- **Yellow Lion:** Yellow
- **Black Lion:** Dark Gray
- **Tron:** Cyan
- **Sark:** Amber
- **User:** Pink

---

## 🎯 Quick Command Reference

| Type This | Get This |
|-----------|----------|
| `RETRO` | CRT mode with green scanlines |
| `JOSHUA` | Back to the Future time circuits |
| `↑↑↓↓←→←→BA` | Konami Code celebration |

---

## 💡 Pro Tips

1. **Retro + DeLorean:** Both can be active at the same time!
2. **Keyboard Focus:** Easter eggs work even when typing in text fields (by design)
3. **Mobile Friendly:** All Easter eggs work on touch devices (though keyboard sequences are harder)
4. **Performance:** All effects use CSS animations for smooth 60fps performance
5. **Accessibility:** All Easter eggs can be disabled/hidden if needed

---

## 🔧 For Developers

### Integrating Celebration Effect

To trigger the celebration effect manually (e.g., when consensus is achieved):

```tsx
import { CelebrationEffect, triggerCelebration } from './components/CelebrationEffect'
import { useSound } from './providers/SoundProvider'

function VotingSession() {
  const [showCelebration, setShowCelebration] = useState(false)
  const { play } = useSound()

  // When consensus is detected:
  useEffect(() => {
    if (consensusAchieved) {
      triggerCelebration(setShowCelebration, () => play('reveal'))
    }
  }, [consensusAchieved])

  return (
    <>
      {/* Your component content */}
      <CelebrationEffect
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </>
  )
}
```

### Using Konami Code Hook

Create custom keyboard sequences:

```tsx
import { useKonamiCode } from './hooks/useKonamiCode'

useKonamiCode({
  sequence: ['h', 'e', 'l', 'l', 'o'],
  onSuccess: () => {
    console.log('Secret hello activated!')
  },
  caseSensitive: false, // default
  enabled: true, // can be disabled conditionally
})
```

### Accessing Easter Egg States

```tsx
import { useRetroMode } from './providers/RetroModeProvider'
import { useDelorean } from './providers/DeloreanProvider'

function MyComponent() {
  const { isRetroMode, toggleRetroMode } = useRetroMode()
  const { isDeloreanMode, showActivation } = useDelorean()

  // Conditional rendering based on Easter egg states
  return (
    <div className={isRetroMode ? 'retro-style' : 'normal-style'}>
      {/* content */}
    </div>
  )
}
```

---

## 🎨 CSS Classes Available

When Retro Mode is active, the following CSS class is applied:

```css
body.retro-mode {
  /* Your custom retro styling can hook into this */
}
```

Example custom styling:

```css
.retro-mode .my-component {
  border: 2px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}
```

---

## 🐛 Troubleshooting

**Easter egg not activating?**
- Make sure you're typing in the correct sequence
- Check browser console for errors
- Verify JavaScript is enabled
- Try refreshing the page

**Performance issues?**
- Retro Mode scanlines are subtle and optimized
- All effects use CSS animations (GPU-accelerated)
- If needed, disable Retro Mode by toggling it off

**Scanlines too intense?**
- You can adjust opacity in app.css (line ~758):
  ```css
  rgba(0, 255, 0, 0.03) /* Lower the 0.03 value */
  ```

---

## 🎉 Easter Egg Credits

Inspired by:
- **Retro Mode:** Classic CRT monitors and green phosphor displays
- **DeLorean:** Back to the Future (1985) time circuits
- **JOSHUA:** WarGames (1983) computer AI
- **Konami Code:** Classic NES games (1986)
- **Celebration:** Modern web confetti effects

---

**Have fun discovering these hidden features! 🎮**

**Pro tip:** Show these to your team members and watch their reactions! 😄

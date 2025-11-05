# 🎴 Ultra Modern Planning Poker UI

A cutting-edge UI overhaul for the Planning Poker ServiceNow application featuring:
- **Dark Mode**: Neon accents with cyberpunk vibes
- **Light Mode**: Glassmorphism with clean aesthetics  
- **Smooth Animations**: Bouncy, fluid transitions
- **Polaris-Inspired**: Aligned with ServiceNow's design principles

## 🎨 Features

### Theme System
- **Dual Themes**: Toggle between dark/neon and light/glass modes
- **Persistent**: User preference saved to localStorage
- **CSS Variables**: Dynamic theming with custom properties
- **Smooth Transitions**: All theme changes are animated

### Modern Components

#### 🃏 **VotingCard**
- Flip animations on reveal
- 3D perspective effects
- Neon glow pulse when selected (dark mode)
- Glassmorphism surface (light mode)
- Hover lift and scale animations

#### 📇 **SessionCard**
- Glassmorphism backdrop blur
- Neon border glow on hover (dark mode)
- Status badges with theme-aware styling
- Smooth lift animation
- Responsive layout

#### 🎯 **ModernHeader**
- Sticky positioning with blur
- Gradient text for title
- Animated theme toggle (moon/sun)
- Glass backdrop effect
- Responsive design

#### 🔘 **Buttons**
- **NeonButton**: Gradient background with shine effect
- **GhostButton**: Border animation with fill on hover
- **FAB**: Floating action button with rotation
- All have smooth spring animations

### Design Principles

1. **Glassmorphism (Light Mode)**
   - `backdrop-filter: blur(12px)`
   - Semi-transparent backgrounds
   - Subtle shadows and borders
   - Clean, airy feel

2. **Neon Glow (Dark Mode)**
   - Cyan/purple gradient accents (`#00d9ff` → `#7b61ff`)
   - Box-shadow glows
   - Pulse animations on active elements
   - Cyberpunk aesthetic

3. **Smooth Animations**
   - Cubic bezier easing: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
   - 0.3s standard transitions
   - Spring bounce effects
   - Stagger delays for lists

4. **Polaris Alignment**
   - 8px spacing grid
   - 16px base font size
   - Consistent border radius (12-16px)
   - Accessible color contrast

## 📦 File Structure

```
/home/claude/
├── theme.config.ts           # Theme colors and design tokens
├── ThemeProvider.tsx          # React context for theme state
├── StyledComponents.tsx       # Reusable styled components
├── modern-styles.css          # Global styles and animations
├── SessionCard.tsx            # Session list card component
├── VotingCard.tsx            # Voting card with animations
├── ModernHeader.tsx          # App header with theme toggle
└── ModernPlanningPokerApp.tsx # Demo implementation
```

## 🚀 Integration Guide

### 1. Install Dependencies

```bash
npm install @emotion/react @emotion/styled
```

### 2. Import Theme Provider

Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from './ThemeProvider';
import './modern-styles.css';

function App() {
  return (
    <ThemeProvider defaultMode="dark">
      <YourAppComponents />
    </ThemeProvider>
  );
}
```

### 3. Use Theme in Components

```tsx
import { useTheme } from './ThemeProvider';
import { NeonButton, GlassCard } from './StyledComponents';

function MyComponent() {
  const { theme, mode, toggleTheme } = useTheme();
  
  return (
    <GlassCard theme={theme} mode={mode}>
      <NeonButton theme={theme} mode={mode} onClick={toggleTheme}>
        Toggle Theme
      </NeonButton>
    </GlassCard>
  );
}
```

### 4. Replace Existing Components

#### Old Session List
```tsx
// Before
<div className="session-list">
  {sessions.map(s => <div>{s.name}</div>)}
</div>
```

#### New Modern Session List
```tsx
// After
import { SessionCard } from './SessionCard';
import { CardGrid } from './StyledComponents';

<CardGrid>
  {sessions.map(s => (
    <SessionCard 
      key={s.sys_id} 
      session={s}
      onClick={() => navigateTo(s)}
    />
  ))}
</CardGrid>
```

## 🎯 Component Examples

### Voting Interface

```tsx
import { VotingDeck } from './VotingCard';

<VotingDeck
  values={[1, 2, 3, 5, 8, 13, 21, '?']}
  selectedValue={vote}
  onVote={(value) => submitVote(value)}
  isRevealed={showVotes}
  disabled={!canVote}
/>
```

### Modern Header

```tsx
import { ModernHeader } from './ModernHeader';

<ModernHeader
  title="Planning Poker"
  subtitle="Sprint 24 Planning"
  showThemeToggle={true}
  actions={
    <NeonButton onClick={createSession}>
      + New Session
    </NeonButton>
  }
/>
```

### Form Inputs

```tsx
import { ModernInput } from './StyledComponents';

<ModernInput
  theme={theme}
  mode={mode}
  type="text"
  placeholder="Search sessions..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

## 🎨 Customization

### Changing Colors

Edit `theme.config.ts`:

```ts
export const darkTheme: ThemeColors = {
  primary: '#ff006e',  // Change neon accent
  secondary: '#fb5607', // Change secondary color
  // ... other colors
};
```

### Adding New Animations

Add to `modern-styles.css`:

```css
@keyframes myAnimation {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.my-element {
  animation: myAnimation 0.4s ease-out;
}
```

### Creating Custom Components

```tsx
import styled from '@emotion/styled';
import { ThemeColors } from './theme.config';

const MyComponent = styled.div<{ theme: ThemeColors; mode: 'dark' | 'light' }>`
  background: ${props => props.theme.surface};
  color: ${props => props.theme.textPrimary};
  border-radius: 12px;
  padding: 16px;
  
  ${props => props.mode === 'dark' && `
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  `}
`;
```

## 🎭 Animation Utilities

Use these classes from `modern-styles.css`:

- `.fade-in` - Fade in from bottom
- `.slide-in-right` - Slide from right
- `.scale-in` - Scale up with bounce
- `.pulse` - Pulsing opacity
- `.glow` - Neon glow effect
- `.float` - Floating animation
- `.hover-lift` - Lift on hover
- `.hover-scale` - Scale on hover

## 📱 Responsive Design

All components are mobile-responsive:
- Cards stack vertically on mobile
- Header collapses navigation
- Touch-friendly button sizes (44px minimum)
- Optimized animations for reduced motion

## ♿ Accessibility

- Focus visible states with outline
- ARIA labels on interactive elements
- Color contrast ratios meet WCAG AA
- Keyboard navigation support
- Reduced motion support (prefers-reduced-motion)

## 🔧 ServiceNow Integration

### Update App Container

Replace the existing app container in `src/client/app.tsx`:

```tsx
import { ThemeProvider } from './components/ThemeProvider';
import { ModernHeader } from './components/ModernHeader';
import './styles/modern-styles.css';

export const App = () => {
  return (
    <ThemeProvider defaultMode="dark">
      <ModernHeader title="Planning Poker" showThemeToggle={true} />
      {/* Your existing app content */}
    </ThemeProvider>
  );
};
```

### Update CSS Import

In `src/ui-pages/planning-poker-app.now.ts`, ensure the CSS is loaded:

```ts
<link rel="stylesheet" href="/styles/modern-styles.css" />
```

## 🎉 Demo

Check out `ModernPlanningPokerApp.tsx` for a complete working example with:
- Theme toggle
- Session cards
- Voting interface
- Form inputs
- Buttons and badges
- Responsive layout

## 💡 Tips

1. **Performance**: Use `useMemo` for theme objects to prevent re-renders
2. **Gradients**: Dark mode uses cyan/purple, light uses blue/indigo
3. **Shadows**: Dark mode uses colored glows, light uses subtle shadows
4. **Transitions**: Keep under 400ms for snappy feel
5. **Mobile**: Test on actual devices for animation smoothness

## 🐛 Troubleshooting

**Theme not applying?**
- Check ThemeProvider wraps your app
- Verify CSS custom properties are set
- Look for console errors

**Animations laggy?**
- Reduce blur values in theme.config.ts
- Use `will-change` property sparingly
- Check for excessive re-renders

**Colors look off?**
- Verify RGBA transparency values
- Check border vs background contrast
- Test in both themes

## 🚀 Next Steps

1. Replace existing components gradually
2. Test in ServiceNow environment
3. Get user feedback on theme preference
4. Add more custom animations
5. Create additional themed components

---

**Built with ❤️ for ServiceNow Planning Poker**
*Dark mode neon vibes + Light mode glass aesthetics*

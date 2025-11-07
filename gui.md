# GUI Implementation Guide

This document provides in-depth guidance for implementing the frontend GUI of the Star Forge Planning Poker application. This guide is intended for Claude Code instances or developers who need to build, extend, or modify the user interface.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Styling System](#styling-system)
3. [Theme System](#theme-system)
4. [Component Structure](#component-structure)
5. [State Management](#state-management)
6. [Animation & Visual Effects](#animation--visual-effects)
7. [Sound System](#sound-system)
8. [Common UI Patterns](#common-ui-patterns)
9. [Responsive Design](#responsive-design)
10. [Easter Eggs & Special Features](#easter-eggs--special-features)

---

## Architecture Overview

### Technology Stack

- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.1.12
- **Styling**: Tailwind CSS 3.4.18 + CSS custom properties
- **Routing**: React Router DOM 7.9.5
- **State Management**:
  - React Context API for global state
  - Zustand 5.0.8 for specific stores
  - TanStack React Query 5.90.6 for server state
- **Real-time**: Socket.IO Client 4.8.1
- **HTTP Client**: Axios 1.13.1
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.552.0
- **Toast Notifications**: React Hot Toast 2.6.0

### Directory Structure

```
client/src/
├── components/
│   ├── admin/          # Admin-specific UI (user management, session review)
│   ├── auth/           # Authentication components (name capture dialog)
│   ├── easter-eggs/    # Easter egg features (DeLorean, WarGames)
│   ├── layout/         # Layout components (AppShell, nav, badges)
│   └── session/        # Session UI (card deck, story panel, participants)
├── views/              # Page-level components (routes)
├── providers/          # React context providers
├── hooks/              # Custom React hooks
├── api/                # API client functions (axios wrappers)
├── utils/              # Helper utilities
└── types.ts            # Shared TypeScript types
```

### Provider Hierarchy

Components are wrapped in the following provider hierarchy (see `client/src/main.tsx`):

```
QueryClientProvider (TanStack Query)
└─ ThemeProvider (Light/Dark modes, variants)
   └─ RetroModeProvider (Retro CRT styling)
      └─ DeloreanProvider (Time-travel debug mode)
         └─ SoundProvider (Web Audio API)
            └─ AuthProvider (User session, JWT)
               └─ SocketProvider (Socket.IO connection)
                  └─ TimerProvider (Session timers)
                     └─ BrowserRouter
                        └─ App
```

**Key Principle**: When accessing global state, use the appropriate hook:
- `useTheme()` - Theme mode and variants
- `useAuth()` - Current user, authentication
- `useSocket()` - Real-time session events
- `useSound()` - Audio playback
- `useTimer()` - Timer state

---

## Styling System

### CSS Custom Properties

The app uses **CSS custom properties** (CSS variables) for theming, defined in `client/src/index.css`. Tailwind is configured to reference these variables.

**Core Variables:**
```css
--background       /* Page background color */
--surface          /* Panel/card background */
--border           /* Border colors */
--accent           /* Primary accent color */
--accent-gradient  /* Gradient for buttons/highlights */
--accent-muted     /* Subtle accent (backgrounds) */
--accent-glow      /* Glow/shadow color */
--accent-selected-text  /* Text color on accent backgrounds */
```

### Tailwind Configuration

See `client/tailwind.config.ts`:

```typescript
colors: {
  background: 'var(--background)',
  surface: 'var(--surface)',
  border: 'var(--border)',
  accent: {
    DEFAULT: 'var(--accent)',
    muted: 'var(--accent-muted)',
    glow: 'var(--accent-glow)',
  },
}
```

**Usage in Components:**
```tsx
<div className="bg-background text-slate-100">
  <div className="bg-surface border border-border rounded-2xl">
    <button className="bg-accent text-white">Action</button>
  </div>
</div>
```

### Pre-built CSS Classes

**Glass Panel** (frosted glass effect):
```tsx
<div className="glass-panel p-6">
  {/* Content */}
</div>
```

CSS definition:
```css
.glass-panel {
  @apply backdrop-blur border border-border bg-surface shadow-lg rounded-2xl;
}
```

**Voltron Button** (gradient animated button):
```tsx
<button className="voltron-button">Join Session</button>
```

### Typography

Two font families are used:
- **Headings**: `font-heading` → Rajdhani (sci-fi aesthetic)
- **Body**: `font-body` → Roboto (readability)

Common pattern:
```tsx
<h2 className="font-heading text-lg uppercase tracking-[0.3em] text-accent">
  Card Deck
</h2>
```

---

## Theme System

### Two-Axis Theme System

The app has **two independent theme axes**:

1. **Mode**: `light` or `dark`
2. **Variant**: Color scheme within that mode

**Light Mode Variants:**
- `voltron` - Five-lion combined gradient
- `black-lion` - Dark gray
- `red-lion` - Red
- `green-lion` - Green
- `blue-lion` - Blue (default)
- `yellow-lion` - Yellow/amber
- `random` - Randomized on mount
- `custom` - User-defined palette

**Dark Mode Variants:**
- `tron` - Cyan/blue (default)
- `sark` - Orange/amber
- `user` - White/light
- `random` - Randomized on mount
- `custom` - User-defined palette

### Theme Provider Implementation

See `client/src/providers/ThemeProvider.tsx`.

**Key Functions:**
- `toggleMode()` - Switch between light and dark
- `setLightVariant(variant)` - Change light variant
- `setDarkVariant(variant)` - Change dark variant
- `updateCustomTheme(mode, palette)` - Set custom colors

**Persistence:**
Theme preferences are saved to `localStorage`:
- `planningpoker_theme_mode`
- `planningpoker_theme_variant_light`
- `planningpoker_theme_variant_dark`
- `planningpoker_theme_custom_light` (JSON)
- `planningpoker_theme_custom_dark` (JSON)

### Applying Themes

The `ThemeProvider` adds classes to `document.body`:
- `theme-light` or `theme-dark` class
- `data-variant="variant-name"` attribute

CSS selectors target these:
```css
.theme-light {
  --accent: #1d4ed8;
  /* ... */
}

.theme-light[data-variant='red-lion'] {
  --accent: #dc2626;
  /* ... */
}
```

### Custom Palettes

Users can create custom color palettes via the `VariantSelector` component. Custom colors are applied directly to CSS custom properties using `body.style.setProperty()`.

**Custom Palette Interface:**
```typescript
type CustomPalette = {
  accentPrimary: string;    // Main accent color
  accentSecondary: string;  // Gradient complement
  background: string;       // Page background
  surface: string;          // Card/panel background
  border: string;           // Border color
  selectedText: string;     // Text on accent bg
};
```

---

## Component Structure

### Layout Components

**AppShell** (`client/src/components/layout/AppShell.tsx`):
- Global layout wrapper
- Contains header with logo, theme toggle, sound toggle, user badge
- Renders background animations (scan lines for dark, rays for light)
- Hosts easter egg components

**Header Elements:**
- `ThemeToggle` - Gradient slider with sun/moon icons
- `VariantSelector` - Dropdown for theme variants
- `SoundToggle` - Audio on/off
- `UserBadge` - User menu with role, impersonation, logout
- `NavTimer` - Shows active session timer (if in session)
- `RetroModeIndicator` - CRT mode indicator

### Session Components

**CardDeck** (`client/src/components/session/CardDeck.tsx`):
- Renders voting cards (XS, S, M, L, XL, XXL, ?, ☕)
- Highlights selected card with `accent-active-text` class
- Disables voting for dealers and after reveal
- Plays `cardSelect` sound on click

**StoryPanel** (`client/src/components/session/StoryPanel.tsx`):
- Displays current story title, description
- AI-assisted fields: business value, use cases, acceptance criteria, testing steps
- Dealer controls: Start timer, reveal votes, new round
- Simple mode variant: `SimpleStoryPanel.tsx`

**ParticipantsPanel** (`client/src/components/session/ParticipantsPanel.tsx`):
- Live participant list with avatars
- Voting status indicators (waiting, selected, revealed)
- Role badges (dealer, admin)

**VotingResults** (`client/src/components/session/VotingResults.tsx`):
- Revealed vote display with summary statistics
- Consensus detection
- Distribution chart/histogram

**DealerSessionDashboard** (`client/src/components/session/DealerSessionDashboard.tsx`):
- Tabbed interface for dealer controls
- Stories tab, Settings tab, Session info tab
- Only visible to dealers

### Admin Components

**UserEditDialog** (`client/src/components/admin/UserEditDialog.tsx`):
- Modal for editing user details
- Role selection (participant/dealer/admin)
- Active/inactive toggle

**MagicLinkGenerator** (`client/src/components/admin/MagicLinkGenerator.tsx`):
- Admin tool to create passwordless login links
- Sends email invitation to users

### Form Patterns

The app uses controlled components with React state:

```tsx
const [value, setValue] = useState('');

<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="rounded-lg border border-border bg-surface px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
/>
```

Tailwind Forms plugin (`@tailwindcss/forms`) provides base form styling.

---

## State Management

### Server State (TanStack Query)

All API calls use React Query for caching, loading states, and optimistic updates.

**Pattern:**
```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchSession } from '../api/session';

const { data, isLoading, error } = useQuery({
  queryKey: ['session', sessionId],
  queryFn: () => fetchSession(sessionId),
});

const mutation = useMutation({
  mutationFn: createSession,
  onSuccess: (session) => {
    navigate(`/session/${session.id}`);
  },
});
```

**API Modules:**
- `api/http.ts` - Axios instance with base URL
- `api/session.ts` - Session CRUD
- `api/admin.ts` - User/session management
- `api/ai.ts` - AI copilot requests
- `api/profile.ts` - User profile updates

### Real-Time State (Socket.IO)

`SocketProvider` manages the Socket.IO connection and emits events.

**Connecting to a session:**
```tsx
const { socket, emitJoinSession } = useSocket();

useEffect(() => {
  emitJoinSession(sessionId, userId);
}, [sessionId, userId]);
```

**Listening for events:**
```tsx
useEffect(() => {
  if (!socket) return;

  const handleVoteUpdate = (data) => {
    // Update local state
  };

  socket.on('session:vote_update', handleVoteUpdate);

  return () => {
    socket.off('session:vote_update', handleVoteUpdate);
  };
}, [socket]);
```

**Key Socket Events:**
- `session:join` / `session:leave` - Participant presence
- `session:select_card` - Vote submission
- `session:reveal` - Reveal votes
- `session:new_round` - Start new round
- `session:timer:start` / `session:timer:pause` - Timer coordination

### Local State

Use `useState` for component-local state. For cross-component state, use context providers.

**Example: Timer State**
```tsx
// TimerProvider manages timer state
const { timerState, startTimer, pauseTimer } = useTimer();

// timerState = { remaining: number, running: boolean }
```

---

## Animation & Visual Effects

### Framer Motion

Used for complex animations and page transitions.

**Example: Fade In**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

### CSS Animations

**Pulse Glow** (defined in Tailwind config):
```tsx
<div className="animate-pulse-glow">...</div>
```

**Lightsaber Swipe** (card reveal animation):
```css
.lightsaber-swipe.active {
  animation: swipe 0.6s ease-out;
}

@keyframes swipe {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(0); opacity: 1; }
}
```

### Background Effects

**Dark Mode**: Animated scan lines (Tron aesthetic)
```tsx
<div className="animate-scan-lines" />
```

**Light Mode**: Radial gradient rays (Voltron aesthetic)
```tsx
<div className="bg-voltron-rays" />
```

These are defined in `tailwind.config.ts` under `backgroundImage` and `keyframes`.

---

## Sound System

### Web Audio API Implementation

See `client/src/providers/SoundProvider.tsx`.

**Sound IDs:**
- `cardSelect` - Card click
- `reveal` - Vote reveal
- `roundStart` - New round
- `timerComplete` - Timer finishes
- `themeChange` - Variant switch
- `modeSwitch` - Light/dark toggle

**Dual Presets:**
- **Voltron** (light mode): Square/triangle waves, heroic tones
- **Tron** (dark mode): Sawtooth waves, gritty synth tones

**Usage:**
```tsx
const { enabled, toggle, play } = useSound();

// Play a sound
play('cardSelect');

// Toggle sound on/off
<button onClick={toggle}>
  {enabled ? 'Sound On' : 'Sound Off'}
</button>
```

**Implementation Details:**
- Uses `AudioContext` and `OscillatorNode`
- Sounds are synthesized (no audio files)
- Frequencies and waveforms differ by theme mode
- Volume: 0.05-0.09 (subtle)

---

## Common UI Patterns

### Modal Dialogs

Use Framer Motion `AnimatePresence` for modal animations:

```tsx
import { AnimatePresence, motion } from 'framer-motion';

{isOpen && (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-panel max-w-md p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content */}
      </motion.div>
    </motion.div>
  </AnimatePresence>
)}
```

### Loading States

**React Query Loading:**
```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  );
}
```

### Toast Notifications

Use `react-hot-toast`:

```tsx
import toast from 'react-hot-toast';

toast.success('Session created!');
toast.error('Failed to join session');
toast.loading('Creating session...');
```

Toaster is configured in `main.tsx`:
```tsx
<Toaster position="bottom-right" />
```

### Buttons

**Primary Button:**
```tsx
<button className="voltron-button">
  Join Session
</button>
```

**Secondary Button:**
```tsx
<button className="rounded-lg border border-accent px-4 py-2 text-accent hover:bg-accent-muted">
  Cancel
</button>
```

**Disabled State:**
```tsx
<button
  disabled={isLoading}
  className="opacity-60 cursor-not-allowed"
>
  Submit
</button>
```

### Icons

Use Lucide React:
```tsx
import { Play, Pause, RotateCcw } from 'lucide-react';

<button>
  <Play className="h-5 w-5" />
  Start
</button>
```

---

## Responsive Design

### Breakpoints (Tailwind defaults)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Patterns

**Grid Layouts:**
```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

**Card Deck:**
```tsx
<div className="grid grid-cols-4 gap-3 md:grid-cols-8">
  {/* 4 columns on mobile, 8 on desktop */}
</div>
```

**Header:**
```tsx
<div className="flex flex-wrap items-center justify-between gap-4">
  {/* Wraps on small screens */}
</div>
```

### Container Constraints

Most content is constrained to `max-w-6xl` except session views (which need full width for panels):

```tsx
<main className="px-4 pb-16 md:px-12">
  <div className={isSessionRoute ? '' : 'mx-auto max-w-6xl'}>
    {children}
  </div>
</main>
```

---

## Easter Eggs & Special Features

### Retro Mode

CRT-style overlay activated by typing "RETRO" anywhere.

**Implementation:**
- `RetroModeProvider` listens for keystrokes
- Adds `.retro-mode` class to body
- CSS applies scanlines, glow, and monospace fonts

### DeLorean Mode

Time-circuit display (Back to the Future reference) activated by typing "JOSHUA" (WarGames reference).

**Components:**
- `DeloreanTimeCircuits.tsx` - Displays dates in BTTF style
- `WarGamesActivation.tsx` - Activation animation

**State:**
```tsx
const { isDeloreanMode, setDeloreanMode } = useDelorean();
```

### Konami Code

Custom hook for sequence detection:
```tsx
import { useKonamiCode } from '../hooks/useKonamiCode';

useKonamiCode({
  sequence: ['j', 'o', 's', 'h', 'u', 'a'],
  onSuccess: () => {
    // Activate easter egg
  }
});
```

### Dynamic Favicon

Favicon changes based on theme variant (see `useDynamicFavicon.ts`).

---

## Building New Components

### Checklist

When creating a new UI component:

1. **TypeScript**: Define prop interface
2. **Styling**: Use Tailwind + CSS variables
3. **Theme Awareness**: Check `useTheme()` if styling differs by mode
4. **Responsive**: Mobile-first approach
5. **Accessibility**:
   - Semantic HTML
   - ARIA labels for icon buttons
   - Keyboard navigation
6. **Sounds**: Call `play()` for interactions if appropriate
7. **Loading States**: Handle async operations gracefully
8. **Error Boundaries**: Catch and display errors

### Example Component Template

```tsx
import { useState } from 'react';
import { useSound } from '../../providers/SoundProvider';
import { Play } from 'lucide-react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent = ({ title, onAction }: MyComponentProps) => {
  const [isActive, setIsActive] = useState(false);
  const { play } = useSound();

  const handleClick = () => {
    play('cardSelect');
    setIsActive(!isActive);
    onAction();
  };

  return (
    <section className="glass-panel p-6">
      <h2 className="font-heading text-lg uppercase tracking-[0.3em] text-accent">
        {title}
      </h2>
      <button
        onClick={handleClick}
        className="mt-4 flex items-center gap-2 rounded-lg border border-accent px-4 py-2 text-accent hover:bg-accent-muted"
      >
        <Play className="h-5 w-5" />
        Action
      </button>
    </section>
  );
};
```

---

## Testing the GUI

### Manual Testing

Run the dev server:
```bash
npm run dev --prefix client
```

Open `http://localhost:5173` in multiple browser windows to simulate multiple users.

### Multi-User Tester

HTML-based tester for simulating multiple participants:
```bash
npm run test:multi-user
```

This opens `tests/manual/multi-user-tester.html` with embedded iframes.

### Browser DevTools

- **React Query DevTools**: Enabled in development (bottom-left icon)
- **React DevTools**: Install browser extension
- **Socket.IO Inspector**: Use browser network tab, filter by WS

---

## Common Customization Tasks

### Adding a New Theme Variant

1. **Define CSS variables** in `client/src/index.css`:
```css
.theme-light[data-variant='purple-lion'] {
  --accent: #9333ea;
  --accent-gradient: linear-gradient(135deg, #9333ea, #c084fc);
  --accent-muted: rgba(147, 51, 234, 0.18);
  --accent-glow: rgba(147, 51, 234, 0.5);
}
```

2. **Add variant to ThemeProvider** (`client/src/providers/ThemeProvider.tsx`):
```typescript
const LIGHT_BASE_VARIANTS = ['voltron', 'black-lion', 'red-lion', 'green-lion', 'blue-lion', 'yellow-lion', 'purple-lion'] as const;
```

3. **Update VariantSelector** UI to include the new option.

### Adding a New Sound

1. **Define preset** in `SoundProvider.tsx`:
```typescript
const voltronPresets: Record<SoundId, OscillatorPreset> = {
  // ...
  newSound: { frequencies: [440, 554.37], wave: 'sine' },
};

const tronPresets: Record<SoundId, OscillatorPreset> = {
  // ...
  newSound: { frequencies: [220, 277.18], wave: 'sawtooth' },
};
```

2. **Update SoundId type**:
```typescript
export type SoundId = 'cardSelect' | 'reveal' | 'roundStart' | 'timerComplete' | 'themeChange' | 'modeSwitch' | 'newSound';
```

3. **Play in component**:
```tsx
play('newSound');
```

### Customizing Animations

Edit `client/tailwind.config.ts` to add keyframes:

```typescript
keyframes: {
  myAnimation: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
},
animation: {
  'my-animation': 'myAnimation 1s ease-in-out infinite',
},
```

Use in components:
```tsx
<div className="animate-my-animation">...</div>
```

---

## Performance Considerations

### React Query Caching

Session data is cached by query key. Invalidate cache when data changes:

```tsx
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// After mutation:
queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
```

### Socket Event Cleanup

Always clean up socket listeners to prevent memory leaks:

```tsx
useEffect(() => {
  if (!socket) return;

  const handler = (data) => { /* ... */ };
  socket.on('event', handler);

  return () => {
    socket.off('event', handler);
  };
}, [socket]);
```

### Lazy Loading

For heavy components, use React lazy loading:

```tsx
import { lazy, Suspense } from 'react';

const AdminView = lazy(() => import('./views/AdminView'));

<Suspense fallback={<LoadingSpinner />}>
  <AdminView />
</Suspense>
```

---

## Accessibility Guidelines

1. **Semantic HTML**: Use `<button>`, `<nav>`, `<section>`, etc.
2. **ARIA Labels**: Add `aria-label` for icon-only buttons
3. **Keyboard Navigation**: Ensure all interactions work with Tab/Enter
4. **Focus Indicators**: Use `focus:ring-2 focus:ring-accent` classes
5. **Color Contrast**: Test variants for WCAG AA compliance
6. **Screen Readers**: Use `sr-only` class for hidden but readable text

Example:
```tsx
<button aria-label="Start timer" className="focus:outline-none focus:ring-2 focus:ring-accent">
  <Play className="h-5 w-5" />
</button>
```

---

## Troubleshooting

### Theme not applying
- Check `data-variant` attribute on `<body>`
- Verify CSS custom properties in DevTools > Computed
- Ensure `ThemeProvider` wraps the app

### Sounds not playing
- Check browser autoplay policy (user interaction required)
- Verify `AudioContext` state (may need resume after user gesture)
- Check sound is enabled via `useSound().enabled`

### Socket events not received
- Verify socket connection: `socket.connected` should be `true`
- Check event names match server
- Ensure socket listener cleanup in `useEffect` return

### Styles not updating
- Restart Vite dev server
- Clear browser cache
- Check Tailwind JIT is scanning the right files (`tailwind.config.ts` content array)

---

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **React Query**: https://tanstack.com/query/latest
- **Socket.IO Client**: https://socket.io/docs/v4/client-api/
- **Lucide Icons**: https://lucide.dev/icons/

---

## Summary

This GUI is built on a **dual-theme system** (light Voltron / dark Tron) with **real-time synchronization** via Socket.IO. The styling uses **CSS custom properties** for dynamic theming, **Tailwind** for utility classes, and **Framer Motion** for animations.

When building new features:
1. Start with the view or component structure
2. Apply theming via CSS variables and Tailwind classes
3. Connect to real-time events with `useSocket()`
4. Manage server state with React Query
5. Add sound effects with `useSound()`
6. Test responsiveness across breakpoints

The architecture prioritizes **theme flexibility**, **real-time responsiveness**, and **sci-fi aesthetics** with subtle audio cues.

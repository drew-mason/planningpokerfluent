# Planning Poker - Standalone Demo

This is a standalone demo version of the Planning Poker UI that runs independently from ServiceNow. It's perfect for testing the look and feel of the modern theme system.

## Features

- 🎨 **Dual Theme System**: Switch between dark (neon) and light (glassmorphism) themes
- 🎭 **Mock Data**: Pre-populated with sample planning sessions
- 🚀 **Fast Development**: Hot module reloading with Vite
- 📱 **Responsive Design**: Works on all screen sizes
- 🎯 **Interactive**: Click sessions to see interactions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The demo will automatically open at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Theme Switching

Click the theme toggle button (🌙/☀️) in the top-right corner of the header to switch between:

- **Dark Mode**: Neon cyan/purple accents with deep black background
- **Light Mode**: Glassmorphism effects with soft shadows

Your theme preference is saved to localStorage and persists across sessions.

## What's Included

### Components Showcased
- **ModernHeader**: Gradient text, theme toggle, action buttons
- **SessionCard**: 3D hover effects, status badges, neon glow
- **GlassCard**: Glassmorphism container with backdrop blur
- **NeonButton**: Animated buttons with theme-aware styling

### Mock Sessions
The demo includes 6 sample planning sessions with different statuses:
- Active sessions (2)
- Pending sessions (2)
- Completed session (1)
- Cancelled session (1)

### Views
- **Sessions List**: Grid of planning session cards
- **Analytics View**: Sample analytics dashboard with metrics

## Technology Stack

- **React 19**: Latest React with modern hooks
- **TypeScript**: Type-safe component development
- **Emotion**: CSS-in-JS for dynamic theming
- **Vite**: Lightning-fast build tool and dev server

## Customization

### Adding More Sessions
Edit `demo/demo.tsx` and add items to the `mockSessions` array:

```typescript
{
  sys_id: '7',
  session_name: 'Your Session Name',
  session_code: 'CODE42',
  status: 'active', // 'active' | 'pending' | 'completed' | 'cancelled'
  dealer: { display_value: 'Your Name' },
  participant_count: 10,
  created: '2025-11-03T12:00:00Z'
}
```

### Modifying Themes
Edit `src/client/theme/theme.config.ts` to customize colors, spacing, and effects.

## Notes

- This demo is for UI/UX testing only
- No ServiceNow backend is required
- All interactions show alerts instead of actual functionality
- Perfect for sharing with designers and stakeholders

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Enjoy exploring the modern Planning Poker UI! 🃏✨

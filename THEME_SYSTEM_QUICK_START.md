# Theme System Quick Start Guide

**For:** MSM Planning Poker Developers
**Version:** Phase 1
**Last Updated:** November 7, 2025

---

## 🚀 Quick Start

### Using the Theme in Components

```tsx
import { useTheme } from '../providers/ThemeProvider'

function MyComponent() {
  const { mode, currentVariant, toggleMode } = useTheme()

  return (
    <div className="glass-panel p-6">
      <h2 className="text-heading">Current Theme</h2>
      <p>Mode: {mode}</p>
      <p>Variant: {currentVariant}</p>
      <button onClick={toggleMode} className="voltron-button">
        Toggle Theme
      </button>
    </div>
  )
}
```

---

## 🎨 Available Theme Classes

### **Panels and Cards**

```tsx
// Glass panel with frosted effect
<div className="glass-panel p-6">Content</div>

// Card with border
<div className="card">Content</div>

// Card with hover effect
<div className="card-hover">Content</div>

// Panel with glow animation
<div className="panel-glow">Content</div>
```

### **Buttons**

```tsx
// Primary button (uses accent color)
<button className="btn-primary">Primary Action</button>

// Secondary button (uses surface/border)
<button className="btn-secondary">Secondary Action</button>

// Accent gradient button
<button className="btn-accent">Accent Action</button>

// Voltron gradient button (animated)
<button className="voltron-button">Join Session</button>
```

### **Typography**

```tsx
// Heading with Rajdhani font and accent color
<h2 className="text-heading">Planning Poker</h2>

// Body text with Roboto font
<p className="text-body">Regular text content</p>

// Muted text
<span className="text-muted">Less important info</span>

// Gradient text
<span className="text-gradient">Gradient Effect</span>
```

### **Form Elements**

```tsx
// Themed input field
<input
  type="text"
  className="input-field"
  placeholder="Enter text..."
/>

// Styled with focus states and theme colors
```

### **Badges**

```tsx
<span className="badge-accent">Active</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-error">Error</span>
```

### **Alerts**

```tsx
<div className="alert-info">Information message</div>
<div className="alert-success">Success message</div>
<div className="alert-warning">Warning message</div>
<div className="alert-error">Error message</div>
```

### **Utilities**

```tsx
// Divider line
<div className="divider" />

// Scrollbar styling
<div className="scrollbar-thin overflow-auto">
  Scrollable content
</div>

// Hide scrollbar
<div className="scrollbar-hide overflow-auto">
  Scrollable content without visible scrollbar
</div>

// Backdrop blur
<div className="backdrop-blur-md">
  Blurred background
</div>
```

---

## 🌈 Theme Colors

### **Using CSS Variables Directly**

```css
.my-component {
  background: var(--background);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.my-accent-button {
  background: var(--accent);
  color: var(--accent-selected-text);
  box-shadow: 0 0 20px var(--accent-glow);
}
```

### **Using Tailwind Classes**

```tsx
<div className="bg-background text-text-primary border border-border">
  <button className="bg-accent text-accent-selected-text">
    Action
  </button>
</div>
```

### **Available Color Variables**

| Variable | Usage | Light Mode | Dark Mode |
|----------|-------|------------|-----------|
| `--background` | Page background | `#f0f4f8` | `#0a0f1e` |
| `--surface` | Cards/panels | `#ffffff` | `#1a1f2e` |
| `--border` | Borders | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` |
| `--accent` | Primary accent | Variant-based | Variant-based |
| `--accent-muted` | Subtle accent | 15% opacity | 15% opacity |
| `--accent-glow` | Glow effects | 40% opacity | 40% opacity |
| `--accent-selected-text` | Text on accent | White | White |
| `--text-primary` | Primary text | `#1f2937` | `#e5e7eb` |
| `--text-secondary` | Secondary text | `#6b7280` | `#9ca3af` |
| `--text-muted` | Muted text | `#9ca3af` | `#6b7280` |

---

## 🎭 Theme Variants

### **Light Mode Variants**

| Variant | Accent Color | Description |
|---------|--------------|-------------|
| `blue-lion` | Blue (#1d4ed8) | Default - Professional blue |
| `red-lion` | Red (#dc2626) | Bold and energetic |
| `green-lion` | Green (#10b981) | Fresh and natural |
| `yellow-lion` | Yellow (#f59e0b) | Warm and inviting |
| `black-lion` | Gray (#1f2937) | Sophisticated dark |
| `voltron` | Multi-color | All lions combined |

### **Dark Mode Variants**

| Variant | Accent Color | Description |
|---------|--------------|-------------|
| `tron` | Cyan (#00d9ff) | Default - Tron-inspired |
| `sark` | Orange (#ff6b35) | Sark/Legacy-inspired |
| `user` | White (#f0f0f0) | Light accent on dark |

### **Programmatically Setting Variants**

```tsx
import { useTheme } from '../providers/ThemeProvider'

function ThemeControls() {
  const { mode, setLightVariant, setDarkVariant } = useTheme()

  return (
    <>
      <button onClick={() => setLightVariant('red-lion')}>
        Red Lion Theme
      </button>
      <button onClick={() => setDarkVariant('sark')}>
        Sark Theme
      </button>
    </>
  )
}
```

---

## 🔧 Advanced Usage

### **Custom Styled Components**

```tsx
// Using CSS variables in styled components or inline styles
function CustomCard() {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '2px solid var(--accent)',
        boxShadow: '0 0 30px var(--accent-glow)',
        color: 'var(--text-primary)',
      }}
    >
      Custom styled card
    </div>
  )
}
```

### **Conditional Theming**

```tsx
function DynamicComponent() {
  const { mode } = useTheme()

  return (
    <div className={mode === 'dark' ? 'dark-specific-class' : 'light-specific-class'}>
      {mode === 'dark' ? (
        <span>🌙 Dark mode content</span>
      ) : (
        <span>☀️ Light mode content</span>
      )}
    </div>
  )
}
```

### **Accessing Theme in Non-React Code**

```typescript
// Get current theme from localStorage
const themeMode = localStorage.getItem('planningpoker_theme_mode') || 'dark'
const lightVariant = localStorage.getItem('planningpoker_theme_variant_light') || 'blue-lion'
const darkVariant = localStorage.getItem('planningpoker_theme_variant_dark') || 'tron'

// Get current variant based on mode
const currentVariant = themeMode === 'light' ? lightVariant : darkVariant
```

### **Reading CSS Variables in JavaScript**

```typescript
// Get computed CSS variable value
const accentColor = getComputedStyle(document.body)
  .getPropertyValue('--accent')
  .trim()

console.log('Current accent color:', accentColor)
```

---

## 📱 Responsive Usage

### **Mobile-First Approach**

```tsx
<div className="
  glass-panel
  p-4 sm:p-6 lg:p-8
  text-sm sm:text-base lg:text-lg
">
  Responsive content
</div>
```

### **Breakpoints**

| Breakpoint | Size | Example |
|------------|------|---------|
| `sm:` | 640px+ | Tablet |
| `md:` | 768px+ | Small laptop |
| `lg:` | 1024px+ | Desktop |
| `xl:` | 1280px+ | Large desktop |

---

## ♿ Accessibility

### **ARIA Labels**

```tsx
// ThemeToggle component (built-in)
<button aria-label="Switch to light mode">
  Toggle Theme
</button>

// Custom accessible components
<div role="button" aria-label="Select theme variant">
  Theme Selector
</div>
```

### **Focus States**

All themed components include automatic focus indicators:

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### **Reduced Motion Support**

Automatically respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🐛 Debugging Tips

### **Check Theme Application**

```typescript
// In browser console
console.log('Theme mode:', document.body.classList.contains('theme-light') ? 'light' : 'dark')
console.log('Variant:', document.body.getAttribute('data-variant'))
```

### **Inspect CSS Variables**

```typescript
// Get all CSS variables
const styles = getComputedStyle(document.body)
console.log('Background:', styles.getPropertyValue('--background'))
console.log('Accent:', styles.getPropertyValue('--accent'))
```

### **Common Issues**

1. **Theme not persisting:**
   - Check localStorage permissions
   - Verify localStorage keys exist
   - Check browser console for errors

2. **Colors not updating:**
   - Ensure ThemeProvider wraps your component
   - Check if CSS variables are being overridden
   - Verify component is using theme classes

3. **TypeScript errors:**
   - Import types from ThemeProvider
   - Use proper variant type definitions
   - Check useTheme() is called within provider

---

## 📦 Component Library

### **Pre-built Components**

```tsx
import ThemeToggle from '../components/ThemeToggle'
import VariantSelector from '../components/VariantSelector'

function Header() {
  return (
    <header className="app-header">
      <ThemeToggle />
      <VariantSelector />
    </header>
  )
}
```

### **Creating Theme-Aware Components**

```tsx
import { useTheme } from '../providers/ThemeProvider'

function VotingCard({ value, isSelected }) {
  const { mode, currentVariant } = useTheme()

  return (
    <div className={isSelected ? 'voting-card-selected' : 'voting-card'}>
      <span className="text-4xl">{value}</span>
    </div>
  )
}
```

---

## 🎯 Best Practices

### **DO:**

✅ Use CSS custom properties for colors
✅ Use Tailwind utility classes when possible
✅ Wrap app in ThemeProvider
✅ Use `useTheme()` hook for theme access
✅ Test in both light and dark modes
✅ Consider accessibility (focus states, contrast)
✅ Use semantic HTML elements

### **DON'T:**

❌ Hardcode colors in components
❌ Bypass ThemeProvider for theme state
❌ Use inline styles for theme colors (use CSS vars)
❌ Forget to test variant switching
❌ Override theme CSS variables globally
❌ Skip ARIA labels on interactive elements

---

## 📚 Examples

### **Complete Example: Themed Modal**

```tsx
import { useTheme } from '../providers/ThemeProvider'

function ThemedModal({ isOpen, onClose, children }) {
  const { mode } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="glass-panel relative z-10 max-w-lg w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading">Modal Title</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="text-body">
          {children}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="voltron-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
```

### **Complete Example: Themed Form**

```tsx
function ThemedForm() {
  const [name, setName] = useState('')

  return (
    <div className="card max-w-md">
      <h2 className="text-heading mb-6">Create Session</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Session Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
            placeholder="Enter session name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            className="input-field w-full h-24"
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button className="btn-secondary flex-1">
            Cancel
          </button>
          <button className="btn-primary flex-1">
            Create Session
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## 🔗 Related Documentation

- **Full Implementation Report:** `PHASE_1_THEME_IMPLEMENTATION_REPORT.md`
- **Tailwind Config:** `tailwind.config.ts`
- **Theme CSS:** `src/client/app.css`
- **ThemeProvider Source:** `src/client/providers/ThemeProvider.tsx`

---

## 🆘 Support

For issues or questions:

1. Check this guide first
2. Review the implementation report
3. Check browser console for errors
4. Verify ThemeProvider is wrapping your component
5. Test in a fresh browser session

---

**Last Updated:** November 7, 2025
**Version:** Phase 1 Complete
**Status:** Production Ready ✅

import { useEffect } from 'react'
import { useTheme } from '../providers/ThemeProvider'

/**
 * Dynamic Favicon Hook
 *
 * Automatically updates the favicon based on the current theme variant.
 * Generates a simple colored SVG favicon that matches the theme's accent color.
 *
 * Usage:
 * ```tsx
 * function App() {
 *   useDynamicFavicon()
 *   // ...
 * }
 * ```
 */

// Accent color map for each theme variant
const VARIANT_COLORS: Record<string, string> = {
  // Light mode variants
  'voltron': '#1d4ed8',
  'black-lion': '#1f2937',
  'red-lion': '#dc2626',
  'green-lion': '#10b981',
  'blue-lion': '#1d4ed8',
  'yellow-lion': '#f59e0b',

  // Dark mode variants
  'tron': '#00d9ff',
  'sark': '#f59e0b',
  'user': '#ec4899',
}

/**
 * Generate an SVG favicon with the specified color
 */
function generateFavicon(color: string, isDark: boolean): string {
  // Create a playing card icon
  const bgColor = isDark ? '#1a1f2e' : '#ffffff'
  const borderColor = color

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="${bgColor}" rx="8"/>
      <rect x="6" y="6" width="52" height="52" fill="none" stroke="${borderColor}" stroke-width="3" rx="6"/>
      <text x="32" y="44" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${color}" text-anchor="middle">?</text>
    </svg>
  `

  // Encode SVG to data URI
  const encodedSvg = encodeURIComponent(svg.trim())
  return `data:image/svg+xml,${encodedSvg}`
}

/**
 * Update the favicon in the document head
 */
function updateFavicon(dataUri: string) {
  // Find or create favicon link element
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.href = dataUri
}

/**
 * Hook to manage dynamic favicon
 */
export function useDynamicFavicon() {
  const { currentVariant, mode } = useTheme()

  useEffect(() => {
    if (typeof document === 'undefined') return

    // Get color for current variant
    const color = VARIANT_COLORS[currentVariant] || '#1d4ed8'
    const isDark = mode === 'dark'

    // Generate and update favicon
    const faviconDataUri = generateFavicon(color, isDark)
    updateFavicon(faviconDataUri)

    console.log(`useDynamicFavicon: Updated favicon for ${currentVariant} variant`)
  }, [currentVariant, mode])
}

// Modern Theme Configuration for Planning Poker
// Supports Dark/Neon and Light/Glassmorphism modes

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  // Base colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceHover: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Accent colors
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border & divider
  border: string;
  divider: string;
  
  // Special effects
  glow: string;
  shadow: string;
  glassBg: string;
  glassBlur: string;
}

export const darkTheme: ThemeColors = {
  // Dark backgrounds with depth
  background: '#0a0a0f',
  backgroundSecondary: '#13131a',
  backgroundTertiary: '#1a1a24',
  surface: 'rgba(25, 25, 35, 0.6)',
  surfaceHover: 'rgba(35, 35, 50, 0.8)',
  
  // Text optimized for dark mode
  textPrimary: '#f0f0f5',
  textSecondary: '#b0b0c0',
  textTertiary: '#808090',
  
  // Neon accents
  primary: '#00d9ff',
  primaryHover: '#00f0ff',
  secondary: '#7b61ff',
  accent: '#ff006e',
  
  // Status with neon glow
  success: '#00ff88',
  warning: '#ffd600',
  error: '#ff3366',
  info: '#00d9ff',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  divider: 'rgba(255, 255, 255, 0.05)',
  
  // Effects
  glow: '0 0 20px rgba(0, 217, 255, 0.5)',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  glassBg: 'rgba(25, 25, 35, 0.4)',
  glassBlur: '10px'
};

export const lightTheme: ThemeColors = {
  // Light backgrounds with airiness
  background: '#f5f7fa',
  backgroundSecondary: '#ffffff',
  backgroundTertiary: '#e8ecf1',
  surface: 'rgba(255, 255, 255, 0.7)',
  surfaceHover: 'rgba(255, 255, 255, 0.9)',
  
  // Text optimized for light mode
  textPrimary: '#1a1a2e',
  textSecondary: '#4a4a5e',
  textTertiary: '#7a7a8e',
  
  // Vibrant but not overwhelming
  primary: '#0066cc',
  primaryHover: '#0052a3',
  secondary: '#6366f1',
  accent: '#ec4899',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9',
  
  // Borders
  border: 'rgba(0, 0, 0, 0.08)',
  divider: 'rgba(0, 0, 0, 0.06)',
  
  // Glassmorphism effects
  glow: '0 0 20px rgba(0, 102, 204, 0.15)',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  glassBg: 'rgba(255, 255, 255, 0.6)',
  glassBlur: '12px'
};

export const themes = {
  dark: darkTheme,
  light: lightTheme
};

// Animation configs
export const animations = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
  
  // Easing functions
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Spacing system (Polaris-aligned)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Border radius
export const borderRadius = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};

// Typography scale
export const typography = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

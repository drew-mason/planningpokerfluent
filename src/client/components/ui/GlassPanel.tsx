import React from 'react'
import { motion } from 'framer-motion'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  onClick?: () => void
}

/**
 * GlassPanel - Frosted glass effect panel component
 *
 * Uses the .glass-panel CSS class with optional Framer Motion animations
 * Part of Phase 3 GUI migration
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  animate = true,
  onClick
}) => {
  const Component = animate ? motion.div : 'div'

  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  } : {}

  return (
    <Component
      className={`glass-panel ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
